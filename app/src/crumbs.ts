import { Buffer } from "buffer";
import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { COOKIE_RPC, MEMO_PROGRAM_ID, TIP_JAR } from "./cookieChain";

export const connection = new Connection(COOKIE_RPC, "confirmed");

export function cookToLamports(cook: number): number {
  return Math.round(cook * LAMPORTS_PER_SOL);
}

/** Build a crumb: Memo + optional dust tip to the jar. */
export async function buildCrumbTx(params: {
  from: PublicKey;
  message: string;
  tipCook?: number;
}): Promise<Transaction> {
  const { from, message, tipCook = 0 } = params;
  if (!message.trim()) throw new Error("Crumb message is empty");
  if (message.length > 280) throw new Error("Crumb max 280 characters");

  const ix: TransactionInstruction[] = [
    new TransactionInstruction({
      keys: [{ pubkey: from, isSigner: true, isWritable: true }],
      programId: new PublicKey(MEMO_PROGRAM_ID),
      data: Buffer.from(new TextEncoder().encode(message)),
    }),
  ];

  if (tipCook && tipCook > 0) {
    ix.push(
      SystemProgram.transfer({
        fromPubkey: from,
        toPubkey: new PublicKey(TIP_JAR),
        lamports: cookToLamports(tipCook),
      })
    );
  }

  const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
  const tx = new Transaction({
    feePayer: from,
    blockhash,
    lastValidBlockHeight,
  }).add(...ix);
  return tx;
}

export type CrumbFeedItem = {
  signature: string;
  slot: number | null;
  err: unknown;
  memo?: string;
};

export async function fetchRecentJarActivity(limit = 15): Promise<CrumbFeedItem[]> {
  const jar = new PublicKey(TIP_JAR);
  const sigs = await connection.getSignaturesForAddress(jar, { limit });
  const items: CrumbFeedItem[] = [];

  for (const s of sigs) {
    let memo: string | undefined;
    try {
      const parsed = await connection.getParsedTransaction(s.signature, {
        maxSupportedTransactionVersion: 0,
      });
      const instructions = parsed?.transaction.message.instructions ?? [];
      for (const ins of instructions) {
        if ("parsed" in ins && ins.program === "spl-memo") {
          const p = ins.parsed as string | { type?: string; info?: string };
          memo = typeof p === "string" ? p : p?.info ?? String(p);
        } else if ("programId" in ins && ins.programId?.toString() === MEMO_PROGRAM_ID) {
          // raw path — skip heavy decode for MVP
        }
      }
    } catch {
      /* ignore decode failures */
    }
    items.push({
      signature: s.signature,
      slot: s.slot ?? null,
      err: s.err,
      memo,
    });
  }
  return items;
}

export async function getCookBalance(pubkey: PublicKey): Promise<number> {
  const lamports = await connection.getBalance(pubkey);
  return lamports / LAMPORTS_PER_SOL;
}

export async function getChainHealth() {
  const [slot, genesis, version] = await Promise.all([
    connection.getSlot(),
    connection.getGenesisHash(),
    connection.getVersion(),
  ]);
  return { slot, genesis, version };
}

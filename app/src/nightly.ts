import type { Transaction, VersionedTransaction } from "@solana/web3.js";

export type NightlySolana = {
  connect: (opts?: { onlyIfTrusted?: boolean }) => Promise<{ publicKey: { toString(): string; toBytes(): Uint8Array } }>;
  disconnect: () => Promise<void>;
  signAndSendTransaction: (
    tx: Transaction | VersionedTransaction,
    opts?: { skipPreflight?: boolean }
  ) => Promise<{ signature: string } | string>;
  signTransaction: <T extends Transaction | VersionedTransaction>(tx: T) => Promise<T>;
  changeNetwork: (net: { genesisHash: string; url?: string }) => Promise<{ success?: boolean } | void>;
  genesisHash?: string;
  publicKey?: { toString(): string };
};

declare global {
  interface Window {
    nightly?: { solana?: NightlySolana };
  }
}

export function getNightly(): NightlySolana | null {
  return window.nightly?.solana ?? null;
}

export async function ensureCookieNetwork(
  nightly: NightlySolana,
  genesisHash: string,
  rpcUrl: string
) {
  if (typeof nightly.changeNetwork === "function") {
    await nightly.changeNetwork({ genesisHash, url: rpcUrl });
  }
}

import { useCallback, useEffect, useMemo, useState } from "react";
import { PublicKey } from "@solana/web3.js";
import {
  COOKIE_BRIDGE,
  COOKIE_DOCS,
  COOKIE_EXPLORER,
  COOKIE_GENESIS_HASH,
  COOKIE_RPC,
  TIP_JAR,
  explorerAddress,
  explorerTx,
} from "./cookieChain";
import { ensureCookieNetwork, getNightly } from "./nightly";
import {
  buildCrumbTx,
  connection,
  fetchRecentJarActivity,
  getChainHealth,
  getCookBalance,
  type CrumbFeedItem,
} from "./crumbs";
import {
  addDemoCrumb,
  clearDemoCrumbs,
  isDemoModePreferred,
  loadDemoCrumbs,
  setDemoModePreferred,
  type DemoCrumb,
} from "./demoStore";
import "./App.css";

type Status =
  | { kind: "idle" }
  | { kind: "info"; text: string }
  | { kind: "pending"; text: string }
  | { kind: "ok"; text: string; sig?: string }
  | { kind: "err"; text: string };

type FeedRow =
  | { kind: "onchain"; item: CrumbFeedItem }
  | { kind: "demo"; item: DemoCrumb };

export default function App() {
  const [pubkey, setPubkey] = useState<string | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [message, setMessage] = useState("Nom nom — first crumb on Cookie Crumb Board 🍪");
  const [tip, setTip] = useState("0");
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [feed, setFeed] = useState<CrumbFeedItem[]>([]);
  const [demoCrumbs, setDemoCrumbs] = useState<DemoCrumb[]>([]);
  const [demoMode, setDemoMode] = useState(true);
  const [health, setHealth] = useState<{ slot: number; genesis: string; version: unknown } | null>(
    null
  );
  const [rpcOk, setRpcOk] = useState<boolean | null>(null);

  const refresh = useCallback(
    async (pk?: string | null) => {
      const key = pk ?? pubkey;
      try {
        const h = await getChainHealth();
        setHealth(h);
        setRpcOk(true);
        setFeed(await fetchRecentJarActivity());
        if (key) setBalance(await getCookBalance(new PublicKey(key)));
      } catch (e) {
        console.warn(e);
        setRpcOk(false);
      }
      setDemoCrumbs(loadDemoCrumbs());
    },
    [pubkey]
  );

  useEffect(() => {
    setDemoMode(isDemoModePreferred());
    setDemoCrumbs(loadDemoCrumbs());
    void refresh();
    const t = setInterval(() => void refresh(), 20_000);
    return () => clearInterval(t);
  }, [refresh]);

  function toggleDemoMode(on: boolean) {
    setDemoMode(on);
    setDemoModePreferred(on);
    setStatus({
      kind: "info",
      text: on
        ? "Demo mode ON — simulated crumbs (localStorage). Live RPC stays read-only."
        : "Demo mode OFF — leaving a crumb will try a real Nightly tx (needs COOK for fees).",
    });
  }

  async function connect() {
    setStatus({ kind: "info", text: "Looking for Nightly…" });
    const nightly = getNightly();
    if (!nightly) {
      setStatus({
        kind: "err",
        text: "Nightly not found. Install Nightly (nightly.app), reload, or stay in Demo mode ($0).",
      });
      return;
    }
    try {
      setStatus({ kind: "pending", text: "Switching Nightly to Cookie Chain…" });
      await ensureCookieNetwork(nightly, COOKIE_GENESIS_HASH, COOKIE_RPC);
      const res = await nightly.connect();
      const pk = res.publicKey.toString();
      setPubkey(pk);
      setBalance(await getCookBalance(new PublicKey(pk)));
      setStatus({
        kind: "ok",
        text: `Connected ${pk.slice(0, 4)}…${pk.slice(-4)} on Cookie Chain (read OK; spend only if you leave an on-chain crumb)`,
      });
      await refresh(pk);
    } catch (e) {
      setStatus({ kind: "err", text: e instanceof Error ? e.message : String(e) });
    }
  }

  async function disconnect() {
    try {
      await getNightly()?.disconnect();
    } catch {
      /* ignore */
    }
    setPubkey(null);
    setBalance(null);
    setStatus({ kind: "idle" });
  }

  function leaveSimulatedCrumb() {
    const tipCook = Number(tip) || 0;
    if (!message.trim()) {
      setStatus({ kind: "err", text: "Crumb message is empty" });
      return;
    }
    const crumb = addDemoCrumb(message, tipCook, pubkey ?? "anonymous-demo");
    setDemoCrumbs(loadDemoCrumbs());
    setStatus({
      kind: "ok",
      text: `Simulated crumb saved locally (${crumb.id}). $0 spend — not on-chain.`,
    });
  }

  async function leaveOnChainCrumb() {
    const nightly = getNightly();
    if (!nightly || !pubkey) {
      setStatus({
        kind: "err",
        text: "Connect Nightly first, or turn Demo mode ON for a $0 simulated crumb.",
      });
      return;
    }
    const tipCook = Number(tip) || 0;
    if ((balance ?? 0) <= 0 && tipCook <= 0) {
      setStatus({
        kind: "err",
        text: "Wallet has 0 COOK. Memo still needs a fee. Use Demo mode (recommended) or Bridge COOK — that costs real funds.",
      });
      return;
    }
    try {
      setStatus({ kind: "pending", text: "Building crumb transaction…" });
      await ensureCookieNetwork(nightly, COOKIE_GENESIS_HASH, COOKIE_RPC);
      const tx = await buildCrumbTx({
        from: new PublicKey(pubkey),
        message,
        tipCook,
      });
      setStatus({ kind: "pending", text: "Approve in Nightly (this spends COOK for fees/tip)…" });
      const raw = await nightly.signAndSendTransaction(tx);
      const sig = typeof raw === "string" ? raw : raw.signature;
      setStatus({ kind: "pending", text: `Confirming ${sig.slice(0, 8)}…` });
      const latest = await connection.getLatestBlockhash();
      await connection.confirmTransaction({ signature: sig, ...latest }, "confirmed");
      setStatus({ kind: "ok", text: "Crumb landed on Cookie Chain", sig });
      await refresh(pubkey);
    } catch (e) {
      setStatus({ kind: "err", text: e instanceof Error ? e.message : String(e) });
    }
  }

  function leaveCrumb() {
    if (demoMode) leaveSimulatedCrumb();
    else void leaveOnChainCrumb();
  }

  const mergedFeed: FeedRow[] = useMemo(() => {
    const demoRows: FeedRow[] = demoCrumbs.map((item) => ({ kind: "demo", item }));
    const onchainRows: FeedRow[] = feed.map((item) => ({ kind: "onchain", item }));
    return [...demoRows, ...onchainRows].slice(0, 25);
  }, [demoCrumbs, feed]);

  const analytics = useMemo(() => {
    const simTips = demoCrumbs.reduce((a, c) => a + (c.tipCook || 0), 0);
    return {
      simulated: demoCrumbs.length,
      jarTxs: feed.length,
      simTipVolume: simTips,
      genesisOk: health ? health.genesis === COOKIE_GENESIS_HASH : null,
    };
  }, [demoCrumbs, feed, health]);

  return (
    <div className="page">
      <div className="demo-banner" role="status">
        <strong>FREE DEMO · Cookie Crumb Board</strong>
        <span>
          Runs on public Cookie RPC (read-only) + optional simulated crumbs. No paid APIs.{" "}
          <em>Do not bridge or buy COOK unless you choose on-chain mode.</em>
        </span>
      </div>

      <header className="hero">
        <p className="eyebrow">Cookie Chain cApp · free demo</p>
        <h1>Cookie Crumb Board</h1>
        <p className="lede">
          Public guestbook / signal board for Cookie Chain. Connect <strong>Nightly</strong>, watch
          live chain health, and leave crumbs. Default path is <strong>$0 demo mode</strong>{" "}
          (simulated board + real RPC reads). On-chain memos are opt-in and need COOK for fees.
        </p>
        <div className="actions">
          {!pubkey ? (
            <button className="btn primary" onClick={() => void connect()}>
              Connect Nightly
            </button>
          ) : (
            <button className="btn" onClick={() => void disconnect()}>
              Disconnect
            </button>
          )}
          <a className="btn ghost" href={COOKIE_BRIDGE} target="_blank" rel="noreferrer">
            Bridge COOK →
          </a>
          <a className="btn ghost" href={COOKIE_DOCS} target="_blank" rel="noreferrer">
            Docs
          </a>
        </div>
        <label className="mode-toggle">
          <input
            type="checkbox"
            checked={demoMode}
            onChange={(e) => toggleDemoMode(e.target.checked)}
          />
          <span>
            Demo mode (simulated crumbs · $0){" "}
            <em>{demoMode ? "ON — recommended" : "OFF — real txs / spend risk"}</em>
          </span>
        </label>
      </header>

      <section className="grid analytics">
        <article className="card mini">
          <h2>Simulated crumbs</h2>
          <p className="stat">{analytics.simulated}</p>
          <p className="muted tiny">localStorage · free</p>
        </article>
        <article className="card mini">
          <h2>Jar signatures</h2>
          <p className="stat">{analytics.jarTxs}</p>
          <p className="muted tiny">live RPC · tip jar</p>
        </article>
        <article className="card mini">
          <h2>RPC</h2>
          <p className="stat">{rpcOk === null ? "…" : rpcOk ? "ok" : "down"}</p>
          <p className="muted tiny">cookiescan.io</p>
        </article>
        <article className="card mini">
          <h2>Genesis</h2>
          <p className="stat small">
            {analytics.genesisOk === null ? "…" : analytics.genesisOk ? "match" : "mismatch"}
          </p>
          <p className="muted tiny">Cookie Chain</p>
        </article>
      </section>

      <section className="grid">
        <article className="card">
          <h2>Wallet</h2>
          {pubkey ? (
            <ul className="meta">
              <li>
                <span>Address</span>
                <a href={explorerAddress(pubkey)} target="_blank" rel="noreferrer">
                  {pubkey}
                </a>
              </li>
              <li>
                <span>Balance</span>
                <strong>{balance === null ? "…" : `${balance.toFixed(4)} COOK`}</strong>
              </li>
            </ul>
          ) : (
            <p className="muted">
              Nightly is required for on-chain crumbs. For judges / visitors with $0: leave simulated
              crumbs in Demo mode — chain health still hits real Cookie RPC.
            </p>
          )}
        </article>

        <article className="card">
          <h2>Chain</h2>
          <ul className="meta">
            <li>
              <span>RPC</span>
              <code>{COOKIE_RPC}</code>
            </li>
            <li>
              <span>Genesis</span>
              <code className="tiny">{COOKIE_GENESIS_HASH.slice(0, 12)}…</code>
            </li>
            <li>
              <span>Slot</span>
              <strong>{health?.slot ?? "…"}</strong>
            </li>
            <li>
              <span>Match</span>
              <strong>
                {health
                  ? health.genesis === COOKIE_GENESIS_HASH
                    ? "Cookie genesis OK"
                    : "Genesis mismatch!"
                  : "…"}
              </strong>
            </li>
          </ul>
        </article>
      </section>

      <section className="card compose">
        <h2>{demoMode ? "Leave a simulated crumb ($0)" : "Leave an on-chain crumb (spend risk)"}</h2>
        {!demoMode ? (
          <p className="warn">
            On-chain mode builds a Memo (± tip) tx. Fees and tips spend real COOK. Prefer Demo mode
            unless you already hold COOK and accept the cost. Bridge = paid path.
          </p>
        ) : (
          <p className="muted tiny">
            Simulated crumbs stay in this browser. Live slot / genesis above still come from Cookie
            RPC (no write, no fee).
          </p>
        )}
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={280}
          rows={3}
        />
        <label className="tip">
          Optional tip (COOK) {demoMode ? "— simulated only" : "— real transfer to tip jar"}
          <input value={tip} onChange={(e) => setTip(e.target.value)} inputMode="decimal" />
        </label>
        <p className="muted tiny">
          Tip jar:{" "}
          <a href={explorerAddress(TIP_JAR)} target="_blank" rel="noreferrer">
            {TIP_JAR}
          </a>
        </p>
        <div className="actions">
          <button
            className="btn primary"
            disabled={!demoMode && !pubkey}
            onClick={() => leaveCrumb()}
          >
            {demoMode ? "Save simulated crumb" : "Sign & send crumb"}
          </button>
          {demoMode ? (
            <button
              className="btn ghost"
              onClick={() => {
                clearDemoCrumbs();
                setDemoCrumbs(loadDemoCrumbs());
                setStatus({ kind: "info", text: "Demo crumbs reset to seed." });
              }}
            >
              Reset demo board
            </button>
          ) : null}
        </div>
        <StatusBanner status={status} />
      </section>

      <section className="card">
        <div className="row">
          <h2>Crumb board</h2>
          <button className="btn ghost sm" onClick={() => void refresh()}>
            Refresh
          </button>
        </div>
        {mergedFeed.length === 0 ? (
          <p className="muted">
            Empty board — leave a simulated crumb, or (on-chain) tip the jar so signatures appear.
          </p>
        ) : (
          <ul className="feed">
            {mergedFeed.map((row) =>
              row.kind === "demo" ? (
                <li key={row.item.id}>
                  <span className="badge demo">simulated</span>
                  <em>{row.item.message}</em>
                  <span className="muted tiny">
                    {new Date(row.item.at).toLocaleString()} · {row.item.author}
                    {row.item.tipCook > 0 ? ` · tip ${row.item.tipCook} COOK (fake)` : ""}
                  </span>
                </li>
              ) : (
                <li key={row.item.signature}>
                  <span className="badge onchain">on-chain</span>
                  <a href={explorerTx(row.item.signature)} target="_blank" rel="noreferrer">
                    {row.item.signature.slice(0, 16)}…
                  </a>
                  <span>{row.item.err ? "failed" : "ok"}</span>
                  {row.item.memo ? <em>{row.item.memo}</em> : null}
                </li>
              )
            )}
          </ul>
        )}
        <p className="muted tiny">
          Explorer: <a href={COOKIE_EXPLORER}>{COOKIE_EXPLORER}</a>
        </p>
      </section>

      <footer className="foot">
        <p>
          Free demo scaffold · no Earn submit from this tree ·{" "}
          <a href="https://superteam.fun/earn/listing/create-an-app-on-cookie-chain-app/">listing</a>
        </p>
      </footer>
    </div>
  );
}

function StatusBanner({ status }: { status: Status }) {
  if (status.kind === "idle") return null;
  return (
    <div className={`status ${status.kind}`}>
      <p>{status.text}</p>
      {status.kind === "ok" && status.sig ? (
        <a href={explorerTx(status.sig)} target="_blank" rel="noreferrer">
          View on CookieScan →
        </a>
      ) : null}
    </div>
  );
}

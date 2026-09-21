/** Cookie Chain network constants (official community RPC). */
export const COOKIE_RPC = "https://rpc.cookiescan.io";
export const COOKIE_WSS = "wss://wss.cookiescan.io";
export const COOKIE_GENESIS_HASH = "9wDaBRDgArEUpvhHxGguNkwozsZh4UpGZB9o2EoEcBB2";
export const COOKIE_EXPLORER = "https://cookiescan.io";
export const COOKIE_BRIDGE = "https://bridge.cookiescan.io";
export const COOKIE_DOCS = "https://docs.cookiechain.wtf";

/** Demo tip jar — replace before a real submission if you want a controlled address. */
export const TIP_JAR = "89iCLYPebBsQVxQMPcEKGybCYV6sJrRtK6tG1uSKaRgF";

/** Solana Memo program (genesis / standard on SVM forks). */
export const MEMO_PROGRAM_ID = "MemoSq4gqABAXKb96qnH8TysNcWxMyW5Xbd1vKuhp74";

export function explorerTx(sig: string) {
  return `${COOKIE_EXPLORER}/tx/${sig}`;
}

export function explorerAddress(addr: string) {
  return `${COOKIE_EXPLORER}/address/${addr}`;
}

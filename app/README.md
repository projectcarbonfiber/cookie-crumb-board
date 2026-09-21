# Cookie Crumb Board (free demo)

**Cookie Chain** cApp for Superteam Earn — [Create an App on Cookie Chain](https://superteam.fun/earn/listing/create-an-app-on-cookie-chain-app/).

Leave crumbs with **Nightly**. Default **Demo mode** uses simulated crumbs + live Cookie RPC reads so the app works with **$0** (no COOK / no bridge).

## Stack

- Vite + React + TypeScript (static SPA)
- `@solana/web3.js` → `https://rpc.cookiescan.io` (read-only in demo)
- Nightly (`window.nightly.solana`) + `changeNetwork`
- `demoStore.ts` — localStorage simulated board

## Network

| | |
|--|--|
| RPC | `https://rpc.cookiescan.io` |
| WSS | `wss://wss.cookiescan.io` |
| Genesis | `9wDaBRDgArEUpvhHxGguNkwozsZh4UpGZB9o2EoEcBB2` |
| Explorer | https://cookiescan.io |
| Bridge | https://bridge.cookiescan.io (**paid path — do not use for $0 hero**) |
| Memo program | `MemoSq4gqABAXKb96qnH8TysNcWxMyW5Xbd1vKuhp74` |
| Demo tip jar | `89iCLYPebBsQVxQMPcEKGybCYV6sJrRtK6tG1uSKaRgF` |

## Quick start

```bash
cd app
npm install
npm run dev
```

1. Open the app — **Demo mode ON** by default.
2. Leave a simulated crumb (no wallet / no COOK required).
3. Optional: install [Nightly](https://nightly.app/) → **Connect Nightly** (network switch only; still $0).
4. Only if you already hold COOK and accept fees: turn Demo mode **OFF** and send an on-chain Memo.

## Build / free deploy

```bash
npm run build
# deploy dist/ — see ../DEPLOY_FREE.md (Cloudflare Pages or GitHub Pages, no card)
```

`base: './'` in `vite.config.ts` for portable static hosting. SPA fallback: `public/_redirects`.

## Submission addresses (when Noah ships)

| Item | Address |
|------|---------|
| Live URL | https://projectcarbonfiber.github.io/cookie-crumb-board/ |
| Tip jar | `89iCLYPebBsQVxQMPcEKGybCYV6sJrRtK6tG1uSKaRgF` |
| Custom program | _none in v1 — Memo + SystemProgram_ |
| Token mint | native COOK |

## Bounty checklist

- [x] Nightly connect path
- [x] Show wallet address + balance
- [x] Execute path (on-chain) + confirmation / errors
- [x] **Free demo mode** (simulated crumbs + RPC health)
- [x] Activity feed + explorer links + analytics cards
- [x] Public live URL (GitHub Pages)
- [ ] X demo thread + Telegram share (Noah)
- [ ] Earn form submit (human only — **not by agents**)

## Custom program (optional stretch)

See `../programs/README.md`. Skip for $0 path.

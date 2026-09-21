# BLOCKERS.md

## Hard / time

1. **Deadline Tue Sep 22, 2026 5:59 PM ET** — deploy + X thread + Telegram share still required after code.
2. **~107 submissions already** — 2 winners × 500 USDC. Swarm crush on EV unless the ship is clearly differentiated.
3. **Earn `agentAccess: HUMAN_ONLY`** — must submit as a human on Superteam Earn (not an automated Earn agent). AI-*apps* are still allowed per listing text.

## Product / wallet

4. **Nightly is mandatory** — Phantom-only is non-compliant. Need Nightly install + Cookie `changeNetwork` approval UX tested end-to-end in a real browser (**Noah HITL**).
5. **COOK / Bridge spend risk (CRITICAL for $0 hero)** — Bridging or buying COOK is a **real-money** path. There is no guaranteed faucet. **Do not bridge or buy COOK for this hero push.**
   - **Mitigation shipped:** **Demo mode** (default ON) = Cookie RPC **read-only** (slot, genesis, jar signatures) + **simulated crumbs** in `localStorage`. Fully usable Live URL without fees.
   - **On-chain crumbs** remain opt-in (Demo mode OFF + Nightly + COOK for fees/tips). Treat as optional stretch, not a blocker for a free demo ship.
6. **Memo-only crumbs** may not appear in the tip-jar activity feed (feed indexes jar transfers). Memo-without-tip needs signer-history or a custom program for a clean global wall — called out in UI. Demo board covers the empty-feed case for $0 demos.

## Infra / tooling

7. **Public RPC only** (`rpc.cookiescan.io`) — rate limits / CORS edge cases possible for heavy polling; free path intentionally avoids a paid proxy.
8. **No custom program in scaffold** — judges wanting “deployed program address” may score Memo-only lower vs teams with Anchor deploys. Stretch path under `programs/`. Program deploy itself may need tiny COOK — **skip for $0 path**.
9. **Live URL** — use **free** Cloudflare Pages or GitHub Pages (see `DEPLOY_FREE.md`). Avoid hosts that force a card.
10. **Demo surface area** — X thread + Telegram share are explicit listing requirements; easy to forget under time pressure. **Do not submit Earn** until Noah explicitly says go.

## Unverified / watch

11. Exact Nightly Cookie Chain preset vs custom-RPC-only — docs say custom SVM / `changeNetwork` with genesis; confirm on latest Nightly extension build (**Noah HITL**).
12. WSS URL (`wss.cookiescan.io`) not smoke-tested in this scaffold (HTTP RPC verified `getHealth` / genesis).
13. Listing remaining-time UI showed “Syncing…” — trust API deadline `2026-09-22T21:59:59.000Z`, not the spinner.
14. Cloudflare / Vercel free signup flows can change — if any host asks for a card, abort that host and use GitHub Pages.

## Non-blockers (clarified)

- **AI-powered apps:** allowed as a category in the listing.
- **Chain health:** RPC responded `ok`, genesis `9wDaBRDg…` at research / harden time.
- **Solana tooling familiarity:** SVM-compatible — `@solana/web3.js` / Anchor / CLI apply with RPC swap.
- **$0 demo viability:** YES — read-only RPC + simulated crumbs + static deploy. Differentiated as “Cookie Crumb Board Free Demo” with clear demo vs on-chain badges.

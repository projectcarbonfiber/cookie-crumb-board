# MVP_PLAN — Cookie Crumb Board (~24–48h, serious)

## Concept

**Cookie Crumb Board** — a public on-chain guestbook / signal board for Cookie Chain.

Users connect **Nightly**, switch to Cookie Chain, leave a short “crumb” (SPL Memo + optional dust COOK tip to a jar), see balance + confirmation, and browse recent crumbs + chain health. Looks like a real cApp; no custom program required for v1.

Why this wins the time box:

- Hits every hard requirement (Nightly, wallet address, tx, confirm/error, activity, Cookie RPC)
- Uses genesis **Memo** program → real on-chain interaction without Anchor deploy risk
- Optional CookieScan / DAS polish for “dashboard”
- Easy X-thread demo; clear Bridge CTA for users who need COOK
- Can upgrade to a custom Anchor program later without rewriting the UI

## Out of scope (v1)

- Custom program deploy / audits
- Full Cookieswap / Cookiebox trading UI
- Mobile-first Nightly Connect deep links (nice-to-have)
- Backend server (all client-side + public RPC)

## Scope that still looks serious

| Feature | v1 |
|---------|----|
| Nightly connect + Cookie `changeNetwork` | Required |
| Show pubkey + COOK balance | Required |
| Leave crumb = Memo ix (± tip transfer) | Required |
| Pending → confirmed / failed UI | Required |
| Recent crumbs (signatures for jar + memo decode) | Required |
| Chain health strip (slot / genesis / RPC) | Required |
| Bridge deep-link + faucet/bridge copy | Required |
| CookieScan links per tx | Required |
| Mini “analytics” cards (crumb count, tip volume) | Stretch (~2h) |
| Dark cookie aesthetic, responsive | Required for “serious” |

## 24–48h schedule

### Hours 0–4 — Foundations
- Vite + React + TS scaffold (this repo `app/`)
- Wire `@solana/web3.js` to `https://rpc.cookiescan.io`
- Nightly inject connect + `changeNetwork` with genesis `9wDaBRDgArEUpvhHxGguNkwozsZh4UpGZB9o2EoEcBB2`
- Balance + disconnect

### Hours 4–12 — On-chain path
- Build Memo (+ optional SystemProgram transfer) transaction
- `signAndSendTransaction` / `sendTransaction` via Nightly
- Confirmation polling + explorer links
- Tip-jar pubkey (generated once, checked in README)

### Hours 12–20 — Activity + polish
- `getSignaturesForAddress` feed for jar
- Decode memo from parsed tx
- Error states (wrong network, rejected, insufficient COOK)
- README + deploy (Vercel/Cloudflare Pages)

### Hours 20–30 — Demo pack
- X thread script + screenshots
- Telegram share
- Address dump for Earn form
- Optional: Cookie DAS token metadata card if time

### Buffer
- Nightly quirks, CORS, RPC lag, COOK funding via bridge

## Success criteria (ship checklist)

- [ ] Live URL works without local setup
- [ ] Nightly connect on Cookie Chain (not Solana mainnet by accident)
- [ ] One successful crumb tx visible on cookiescan.io
- [ ] README has RPC, genesis, jar address, setup, Bridge guide
- [ ] X thread + Telegram share ready
- [ ] Earn form: live URL + repo + addresses

## Stretch upgrades (only if ahead)

1. Tiny Anchor “crumb board” program (PDA per crumb) — document stub in `programs/`
2. cookie-mcp demo mode / “ask agent to leave crumb”
3. Simple chart of crumbs/hour via client aggregation

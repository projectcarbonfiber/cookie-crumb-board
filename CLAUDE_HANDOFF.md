# CLAUDE_HANDOFF — Cookie Chain hero (paste into Claude Max)

## Goal

Ship / harden **Cookie Crumb Board** as a clearly differentiated **free demo** for Superteam Earn listing “Create an App on Cookie Chain”, without spending money. Ready Noah for HITL (Nightly + free deploy + Earn prep). **Do not submit Earn. Do not bridge or buy COOK.**

## Paths

| Path | Purpose |
|------|---------|
| `/workspace/cookie-chain-capp/` | Repo root |
| `/workspace/cookie-chain-capp/app/` | Vite + React + TS app |
| `/workspace/cookie-chain-capp/app/src/` | `App.tsx`, `crumbs.ts`, `nightly.ts`, `cookieChain.ts`, `demoStore.ts` |
| `/workspace/cookie-chain-capp/BRIEF.md` | Listing facts / deadline |
| `/workspace/cookie-chain-capp/MVP_PLAN.md` | Product plan |
| `/workspace/cookie-chain-capp/BLOCKERS.md` | Risks (incl. COOK bridge spend) |
| `/workspace/cookie-chain-capp/DEPLOY_FREE.md` | $0 Cloudflare / GitHub Pages |
| `/workspace/cookie-chain-capp/HERO_STATUS.md` | Noah HITL next steps |
| `/workspace/cookie-chain-capp/programs/` | Optional Anchor notes (skip for $0) |

## Deadline

**Tue Sep 22, 2026 — 5:59 PM ET** (API `2026-09-22T21:59:59.000Z`).

## Constraints (no spend)

1. **NO** Cookie Bridge funding / **NO** buying COOK / **NO** real asset transfers for “demo polish”.
2. **NO** Earn submission (listing is `HUMAN_ONLY`; Noah submits later if at all).
3. **NO** paid RPC, paid hosting tiers, paid domains, or card-gated deploys — if a host asks for a card, switch host.
4. Prefer **Demo mode**: public Cookie RPC **read-only** + **simulated crumbs** (`demoStore.ts` / localStorage).
5. On-chain Memo path may remain in code but must stay **opt-in** and clearly labeled spend-risk.

## Network constants

- RPC: `https://rpc.cookiescan.io`
- Genesis: `9wDaBRDgArEUpvhHxGguNkwozsZh4UpGZB9o2EoEcBB2`
- Explorer: `https://cookiescan.io`
- Bridge (link only, do not use): `https://bridge.cookiescan.io`
- Tip jar (demo): `89iCLYPebBsQVxQMPcEKGybCYV6sJrRtK6tG1uSKaRgF`
- Memo program: `MemoSq4gqABAXKb96qnH8TysNcWxMyW5Xbd1vKuhp74`

## Acceptance criteria

- [ ] App builds (`cd app && npm ci && npm run build`) with no errors.
- [ ] UI clearly marked **FREE DEMO**; Demo mode default ON.
- [ ] Without Nightly / without COOK: user can leave simulated crumbs and see live slot/genesis from Cookie RPC.
- [ ] With Nightly: connect + Cookie `changeNetwork` path still present; on-chain send gated / warned when Demo mode OFF.
- [ ] `DEPLOY_FREE.md` documents a card-free path (Cloudflare Pages and/or GitHub Pages).
- [ ] `BLOCKERS.md` calls out COOK bridge spend risk + demo-mode mitigation.
- [ ] `HERO_STATUS.md` lists exact Noah HITL steps (Nightly install, free deploy, Earn **prep only**).
- [ ] No Earn submit, no bridge, no COOK purchase performed by agents.

## Suggested next Claude tasks (still $0)

1. Polish README + screenshots script for the free demo story.
2. Add GitHub Actions Pages workflow file if Noah chooses GH Pages.
3. Dry-run Nightly UX copy / empty-state polish.
4. Draft X-thread + Telegram text emphasizing $0 demo + optional Bridge for *end users*, not for Noah funding.

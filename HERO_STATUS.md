# HERO_STATUS — Cookie Crumb Board ($0 path)

**As of:** Mon Sep 21, 2026 ~7:45 AM ET  
**Deadline:** Tue Sep 22, 2026 **5:59 PM ET**  
**Spend:** **$0** — no bridge, no COOK purchase, no Earn submit from agents.

## Done in tree

| Item | Status |
|------|--------|
| Vite/React Cookie Crumb Board scaffold | Done |
| Nightly connect + `changeNetwork` wiring | Done (needs browser HITL) |
| Cookie RPC read health (slot / genesis) | Done / RPC `ok` |
| **Demo mode** (simulated crumbs + read-only RPC) | Done (default ON) |
| On-chain Memo path | Done but **opt-in** (needs COOK) |
| Free deploy docs | `DEPLOY_FREE.md` |
| BLOCKERS updated (bridge spend risk) | Done |
| CLAUDE handoff | `CLAUDE_HANDOFF.md` |

## $0 demo viable?

**YES.** Live static site + public Cookie RPC reads + simulated board. No paid services required.

**Live URL:** https://projectcarbonfiber.github.io/cookie-crumb-board/
**Public repo:** https://github.com/projectcarbonfiber/cookie-crumb-board

## Exact next Noah HITL steps ($0)

### 1) Install Nightly (free) — ~5 min

1. Install Nightly extension from https://nightly.app/ (browser store).
2. Create / unlock a wallet (**do not** fund via Cookie Bridge for this hero).
3. Open the local or deployed Crumb Board → leave **Demo mode ON** → click **Connect Nightly** → approve Cookie `changeNetwork` if prompted.
4. Confirm: address shows, balance may be `0.0000 COOK`, chain card shows genesis match + live slot.
5. Leave a **simulated** crumb; confirm it appears with a `simulated` badge.

### 2) Free deploy (pick one) — ~15–30 min

Follow `DEPLOY_FREE.md`:

1. Prefer **Cloudflare Pages** (Git connect, root `app`, build `npm ci && npm run build`, output `dist`).
2. If Cloudflare asks for a card → **GitHub Pages** instead.
3. Smoke the Live URL: demo banner visible, RPC ok, simulated crumb works, Nightly connect still works.

### 3) Superteam Earn — prepare only, **do not submit yet**

Listing: https://superteam.fun/earn/listing/create-an-app-on-cookie-chain-app/  
`agentAccess: HUMAN_ONLY` — Noah must click submit.

**Prep checklist (still $0):**

- [x] Live URL (GitHub Pages) published: https://projectcarbonfiber.github.io/cookie-crumb-board/
- [x] Public GitHub repo + README: https://github.com/projectcarbonfiber/cookie-crumb-board
- [ ] Addresses: tip jar `89iCLYPebBsQVxQMPcEKGybCYV6sJrRtK6tG1uSKaRgF`; custom program = none (Memo)
- [ ] Screenshots: demo banner, Nightly connect, simulated crumb, chain health
- [ ] Draft X thread (demo mode story + Bridge CTA as *optional* for users who want on-chain — **you** do not bridge)
- [ ] Draft Telegram share to https://t.me/TheCookieNetChain

**Hard stop:** Do **not** submit Earn, do **not** bridge/buy COOK, unless Noah explicitly overrides the $0 constraint after reviewing this status.

### 4) Optional later (costs money — out of scope)

- Bridge tiny COOK → one real Memo tx for CookieScan links in the X thread.
- Anchor program deploy (may need deploy fees).

## Agent constraints still in force

- Do **not** bridge real assets or buy COOK.
- Do **not** submit Earn.
- Prefer docs + demo hardening over paid infra.

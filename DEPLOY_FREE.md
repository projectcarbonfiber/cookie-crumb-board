# FREE deploy path — Cookie Crumb Board

**Constraint:** $0. No credit card. No paid Cloudflare / Vercel / DNS plans.

The app is a static Vite build (`app/dist/`) talking to the **public** Cookie RPC (`https://rpc.cookiescan.io`). No backend, no paid SaaS.

## Recommended (no card): Cloudflare Pages via Wrangler / GitHub

### Option A — Cloudflare Pages + GitHub (UI)

1. Push this repo to a **public** GitHub repo (free).
2. Sign up at https://dash.cloudflare.com (Pages free tier — historically no card for Pages).
3. **Workers & Pages → Create → Pages → Connect to Git**.
4. Build settings:
   - **Root directory:** `app`
   - **Build command:** `npm ci && npm run build`
   - **Build output directory:** `dist`
5. Deploy. You get `https://<project>.pages.dev` — that is the Live URL for Earn.

SPA fallback is covered by `app/public/_redirects` (`/* → /index.html 200`).

### Option B — Wrangler from this box / laptop (CLI)

```bash
cd app
npm ci
npm run build
npx wrangler pages project create cookie-crumb-board --production-branch main
npx wrangler pages deploy dist --project-name cookie-crumb-board
```

Wrangler login is free for Pages. If Cloudflare ever asks for a card, **stop** and use GitHub Pages instead.

## Backup (no card): GitHub Pages

1. Public GitHub repo.
2. Settings → Pages → Source: **GitHub Actions** or deploy `app/dist` to `gh-pages`.
3. Minimal workflow (place at `.github/workflows/pages.yml` when publishing):

```yaml
name: pages
on:
  push:
    branches: [main]
permissions:
  contents: read
  pages: write
  id-token: write
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22 }
      - working-directory: app
        run: npm ci && npm run build
      - uses: actions/upload-pages-artifact@v3
        with: { path: app/dist }
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment: { name: github-pages, url: ${{ steps.d.outputs.page_url }} }
    steps:
      - id: d
        uses: actions/deploy-pages@v4
```

`vite.config.ts` uses `base: './'` so project sites under `https://<user>.github.io/<repo>/` resolve assets.

## Vercel hobby — use only if already verified free

Vercel Hobby is often free but **may prompt for a card**. Prefer Cloudflare Pages or GitHub Pages for a strict $0 path. If you already have a free Vercel account with no card wall:

- Root: `app`
- Build: `npm run build`
- Output: `dist`

## Local preview ($0)

```bash
cd /workspace/cookie-chain-capp/app
npm ci
npm run build
npm run preview -- --host 0.0.0.0 --port 4173
```

## What judges get without COOK

- Live URL loads
- Chain health (slot / genesis) from real Cookie RPC
- Simulated crumb board ($0)
- Nightly connect works if they install the extension; on-chain send only if they hold COOK

## Do not

- Buy COOK / bridge assets for “demo polish”
- Pay for a custom domain
- Add paid analytics / RPC providers

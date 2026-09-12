# Zaibi Tools — Image & CNIC Optimization Suite

A browser-only, zero-server web portal hosting two document utilities:

- **Batch Image Optimizer** (`image-optimation-tool`) — compress and convert images to JPEG/WebP/AVIF/PNG, strip EXIF/GPS metadata, and crop to social-media presets.
- **CNIC & ID Print Suite** (`cnic-copy-print-opt`) — align CNIC/ID front and back onto a true-size A4 (or Letter/Legal/3R) print sheet with scan-enhancement filters and anti-fraud watermarks.

All processing happens **entirely in the browser** using the HTML5 Canvas API. Files are never uploaded to any server.

**Live:** https://zaibitools.com (fallback: https://optipack-portal.asadbukhari65813.workers.dev)

---

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 15 (App Router) |
| UI | React 19, Tailwind CSS v4, `lucide-react` icons |
| Language | TypeScript (strict) |
| Hosting | Cloudflare Workers via `@opennextjs/cloudflare` + Wrangler |
| PDF export | `jsPDF`, loaded on demand from a CDN |

No database, no backend API beyond a health check. There is no test framework.

---

## Getting started

### Prerequisites

- Node.js 20+
- npm

### Install & run

```bash
npm install
npm run dev
```

Open http://localhost:3000.

---

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Next.js dev server |
| `npm run build` | Production build (`next build`) |
| `npm run preview` | Build the Cloudflare worker and run it locally with `wrangler dev` |
| `npm run deploy` | Build with OpenNext and deploy to Cloudflare Workers |
| `npm run lint` / `npm run typecheck` | Type-check only (`tsc --noEmit`) |

---

## Project structure

```
app/
  layout.tsx            Root layout: fonts, metadata, theme, shell
  page.tsx              Landing page (HomeHub)
  image-opt/page.tsx    Batch Image Optimizer page
  cnic-opt/page.tsx     CNIC Print Suite page
  api/health/route.ts   Health check endpoint (GET /api/health)
  error.tsx             Route error boundary
  not-found.tsx         404 page
  globals.css           Tailwind v4 theme tokens + global styles
components/
  SiteShell.tsx         Header + main + footer + security modal + sticky mobile ad
  Header.tsx            Nav, brand, theme toggle, security trigger
  Footer.tsx            Links and privacy blurb
  HomeHub.tsx           Landing page sections (tools + FAQ)
  ImageOptTool.tsx      Image optimizer UI (dropzone, controls, compare slider)
  CnicOptTool.tsx       CNIC print UI (uploads, layout controls, live preview)
  SecurityModal.tsx     Privacy/security modal
  ThemeToggle.tsx       Light/dark switch (persisted in localStorage)
  CornerMarks.tsx       Decorative print marks + scale ruler
  AdBanner.tsx          Isolated iframe Adsterra banner unit
  ResponsiveAd.tsx      Picks desktop (728x90) or mobile (300x250) size
  StickyMobileAd.tsx    Dismissible sticky 320x50 mobile bar
lib/
  types.ts              Shared domain types
  data/initialData.ts   Tool metadata, presets, FAQ content
  data/ads.ts           Adsterra ad keys and dimensions
  utils/imageOptimizer.ts  Image processing engine (Canvas)
  utils/cnicOptimizer.ts   CNIC sheet rendering + filters (Canvas)
```

Path alias: `@/*` maps to the project root.

---

## Deployment (Cloudflare Workers)

The app is deployed as a Cloudflare Worker using OpenNext.

### Credentials

Wrangler reads the following from a **gitignored `.env`** file at the project root:

```
CLOUDFLARE_API_TOKEN=...
CLOUDFLARE_ACCOUNT_ID=...
```

This lets `npm run deploy` run non-interactively without `wrangler login`.

### Deploy

```bash
npm run deploy
```

This runs `opennextjs-cloudflare build` (which invokes `next build`, then bundles the worker) followed by `wrangler deploy`.

Deployment is **manual** — there is no CI. Pushing to GitHub does not update the live site.

### Configuration files

- `wrangler.jsonc` — Worker name, compatibility flags, assets binding.
- `open-next.config.ts` — OpenNext Cloudflare adapter config (defaults).
- `next.config.ts` — `output: "standalone"`, compression, security headers.

---

## Privacy & security

- **Zero-server:** all image and document processing runs client-side; nothing is uploaded.
- **Metadata stripping:** re-encoding through Canvas drops EXIF/GPS data.
- **Security headers** (set in `next.config.ts`): `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`.

---

## Analytics & ads

- **Google Analytics 4** (`G-3QKCPR8SR3`) is embedded in `app/layout.tsx` as a literal `<script>` (async loader + inline config) so it is present in the initial server HTML on every route and does not depend on the Next.js client runtime.
- **Adsterra** banner units are configured in `lib/data/ads.ts` and rendered by `AdBanner.tsx`. Each unit lives in its own `srcDoc` iframe, which isolates Adsterra's global `atOptions` so multiple banners can coexist. The iframe is intentionally **not** sandboxed — Adsterra's `invoke.js` needs cookies/localStorage.
- Sizes in use: 300x250 (medium rectangle), 728x90 (leaderboard, desktop), 320x50 (sticky mobile bar).

---

## Notes & known limitations

- **Fonts:** `next/font/google` downloads font files at build time. On networks with broken IPv6 DNS, the build hangs; the scripts set `NODE_OPTIONS="--dns-result-order=ipv4first --no-network-family-autoselection"` to work around this.
- **AVIF:** the UI exposes an AVIF option, but the encoder currently falls back to WebP (`lib/utils/imageOptimizer.ts`). Browser AVIF encoding support is inconsistent.
- **PDF export** requires internet access to load jsPDF from cdnjs at runtime.
- `stripExif` and `lossless` options are surfaced in the UI but not currently applied by the processing engine.

---

## License

Proprietary. © Asad Bukhari. All rights reserved.

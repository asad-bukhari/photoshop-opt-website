# Zaibi Tools — Image Compressor & CNIC Print Tool

A browser-only, zero-server web portal hosting two document utilities:

- **Image Compressor** (`/image-compressor`) — compress JPG, PNG or WebP images to a target size in KB, convert formats, and crop to social-media presets. Re-encoding drops EXIF/GPS metadata; AVIF input is accepted when the browser can decode it.
- **CNIC Photocopy** (`/cnic-photocopy`) — place CNIC/ID front and back on a card-sized A4, Letter, Legal or 3R sheet with scan-enhancement filters and an optional purpose watermark.

All processing happens **entirely in the browser** using the HTML5 Canvas API. Files are never uploaded to any server.

**Live:** https://zaibitools.com (fallback: https://optipack-portal.asadbukhari65813.workers.dev)

---

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS v4, `lucide-react` icons |
| Language | TypeScript (strict) |
| Hosting | Cloudflare Workers via `@opennextjs/cloudflare` 1.20.14 + Wrangler 4.155 |
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
  layout.tsx            Root layout: fonts, metadata, light theme, shell
  page.tsx              Landing page (HomeHub)
  image-compressor/page.tsx  Image compressor page
  cnic-photocopy/page.tsx    CNIC photocopy page
  privacy/page.tsx      Privacy policy
  terms/page.tsx        Terms of use
  sitemap.ts            Sitemap for the public routes
  api/health/route.ts   Health check endpoint (GET /api/health)
  error.tsx             Route error boundary
  not-found.tsx         404 page
  globals.css           Tailwind v4 theme tokens + global styles
components/
  SiteShell.tsx         Skip link, header, main, footer, file-handling modal
  Header.tsx            Registry-driven nav, brand, mobile menu, file-handling trigger
  Footer.tsx            Registry-driven tool links and privacy blurb
  HomeHub.tsx           Landing page sections (category-grouped tools + FAQ)
  tool/                 Shared tool parts: ToolPage, ToolHero, FileDropzone,
                        HowToSteps, ToolFaq, RelatedTools, ResultActions, ToolIcon
  ImageOptTool.tsx      Image optimizer UI (dropzone, controls, compare slider)
  CnicOptTool.tsx       CNIC print UI (uploads, layout controls, live preview)
  SecurityModal.tsx     Privacy/security modal
  CornerMarks.tsx       Decorative print marks + scale ruler
  AdBanner.tsx          Isolated iframe Adsterra banner unit
  ResponsiveAd.tsx      Picks desktop (728x90) or mobile (300x250) size
lib/
  types.ts              Shared domain types
  data/tools.ts         Tool registry: nav, footer, home, sitemap, related tools
  data/initialData.ts   Presets and FAQ content
  data/ads.ts           Adsterra ad keys and dimensions
  hooks/useObjectUrl.ts Object URL lifecycle for file previews
  utils/objectUrls.ts   Create/revoke object URL helpers
  utils/loadImage.ts    File/URL image decoding with a friendly error
  utils/download.ts     Blob/Data URL download helpers
  utils/format.ts       Byte and filename formatting
  utils/imageOptimizer.ts  Image processing engine (Canvas)
  utils/cnicOptimizer.ts   CNIC sheet rendering + filters (Canvas)
```

Add a new tool by adding one entry to `lib/data/tools.ts` and one page; header, footer, home hub, sitemap and related-tool links read from the registry.

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
- `next.config.ts` — `output: "standalone"`, compression, 301 redirects from `/image-opt` and `/cnic-opt`, security headers.

---

## Privacy & security

- **Zero-server:** all image and document processing runs client-side; nothing is uploaded.
- **Metadata stripping:** re-encoding through Canvas drops EXIF/GPS data.
- **Preview URLs:** file previews use object URLs that are revoked on reset, source change and unmount.
- **Security headers** (set in `next.config.ts`): `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`.

---

## Analytics & ads

- **Google Analytics 4** (`G-3QKCPR8SR3`) is embedded in `app/layout.tsx` as a literal `<script>` (async loader + inline config) so it is present in the initial server HTML on every route and does not depend on the Next.js client runtime.
- **Adsterra** banner units are configured in `lib/data/ads.ts` and rendered by `AdBanner.tsx`. Each unit lives in its own `srcDoc` iframe, which isolates Adsterra's global `atOptions` so multiple banners can coexist. The iframe is intentionally **not** sandboxed — Adsterra's `invoke.js` needs cookies/localStorage.
- Sizes in use: 300x250 (medium rectangle, mobile) and 728x90 (leaderboard, desktop). The sticky 320x50 bar was removed; ads sit after the tool content and reserve their height.

---

## Notes & known limitations

- **Fonts:** `next/font/google` downloads font files at build time. On networks with broken IPv6 DNS, the build hangs; the scripts set `NODE_OPTIONS="--dns-result-order=ipv4first --no-network-family-autoselection"` to work around this.
- **AVIF:** the UI does not offer AVIF output because the encoder falls back to WebP (`lib/utils/imageOptimizer.ts`). AVIF input is accepted when the browser can decode it.
- **PDF export** requires internet access to load jsPDF from cdnjs at runtime.

---

## License

Free to use. © Asad Bukhari. All rights reserved.

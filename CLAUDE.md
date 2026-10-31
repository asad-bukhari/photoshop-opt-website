# CLAUDE.md

Read `AGENTS.md` first. It is the source of truth for workflow, branching, testing, docs, safety, and intentional decisions. Use this file only as a quick technical reference.

## Project

`optipack-portal` (branded **Zaibi Tools**) is a Next.js 16 App Router site with eleven 100% client-side tools: `/image-compressor`, `/image-converter`, `/crop-rotate-image`, `/photo-signature-resizer`, `/jpg-to-pdf`, `/merge-pdf`, `/split-pdf`, `/photo-to-scanned-pdf`, `/pdf-to-jpg`, `/passport-photo-maker` and `/cnic-photocopy`. It runs as a Cloudflare Worker through OpenNext. User files never leave the browser.

Live: https://zaibitools.com (fallback: https://optipack-portal.asadbukhari65813.workers.dev)

## Commands

```bash
npm install
npm run dev          # Next dev server (localhost:3000)
npm run typecheck    # tsc --noEmit
npm run lint         # same as typecheck
npm run test         # vitest run (pure functions only)
npm run build        # next build (with the required NODE_OPTIONS prefix)
npm run preview      # OpenNext build + wrangler dev
npm run deploy       # manual fallback only
```

Vitest covers pure functions (`npm run test`, config in `vitest.config.mts`). Use `npm run dev` for changed routes, then `typecheck`, `test`, `build`, `preview`, and the manual checklist in `AGENTS.md`. Never claim a check passed unless it was run. The owner performs the final production deploy.

## Technical gotchas

- **Build recursion:** `package.json` `build` must run `next build` (currently prefixed with the DNS flags). `opennextjs-cloudflare build` calls the package `build` script, so pointing `build` at OpenNext recurses forever.
- **DNS/IPv6:** keep `NODE_OPTIONS="--dns-result-order=ipv4first --no-network-family-autoselection"` on `build`, `preview`, and `deploy`. The environment prefers IPv6 but has no route, which hangs font fetches.
- **Output:** `next.config.ts` uses `output: "standalone"` for OpenNext. Do not remove it.
- **Deploy auth:** Wrangler reads `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` from a gitignored `.env`. Never print or commit them.
- **AVIF fallback:** `lib/utils/imageOptimizer.ts` maps `avif` to `image/webp`; browser AVIF encoding is unreliable.
- **EXIF:** Canvas re-encoding drops EXIF automatically; there is no separate strip-EXIF control.
- **jsPDF:** loaded at runtime from cdnjs in `components/CnicOptTool.tsx`; PDF export needs network access.
- **Adsterra:** each banner renders in its own `srcDoc` iframe to isolate `atOptions`. Do **not** add `sandbox`; `invoke.js` needs cookies/localStorage.
- **GA4:** `G-3QKCPR8SR3` is a literal script in `app/layout.tsx`.
- **Tool registry:** `lib/data/tools.ts` drives the header, footer, home hub, sitemap, related tools and JSON-LD. Add a tool as one registry entry plus one page; do not hard-code nav links. `kind: 'landing'` keeps KB-target pages out of the navigation while leaving them in the sitemap; use `getNavTools()` for nav.
- **Crop/rotate:** `lib/utils/cropRect.ts` is shared with the scan tool; `lib/utils/cropRotate.ts` caps the preview but exports at source crop resolution. Rotation is 90-degree steps only.
- **Image converter:** `lib/utils/imageConvert.ts` re-encodes through Canvas; JPG fills white, PNG/WebP keep transparency. `useObjectUrl` now accepts a Blob for result previews.
- **Object URLs:** create and revoke them through `lib/utils/objectUrls.ts`. Use `lib/hooks/useObjectUrl.ts` for previews; `ImageOptTool` owns the original comparison URLs and revokes them on reset/unmount.
- **Shared tool parts:** `components/tool/` holds `ToolPage`, `ToolHero`, `FileDropzone`, `HowToSteps`, `ToolFaq`, `RelatedTools`, `ResultActions` and `ToolIcon` for new tools.
- **PDF to JPG:** `lib/utils/pdfToJpg.ts` dynamically imports `pdfjs-dist` and sets the worker to `/pdf.worker.min.mjs`. `predev` and `prebuild` copy the worker from `node_modules` into `public/`; the copy is gitignored. Test it under `npm run preview`.
- **Document scan:** `lib/utils/scanPdf.ts` caps cropped sources at 2400 px, renders A4 pages at 150 DPI and reuses the CNIC filters. There is no automatic edge detection, perspective fix or OCR.
- **Passport sheet:** `lib/utils/passportSheet.ts` keeps grid math pure and renders at 300 DPI with a 200 fallback. It centre-crops with zoom only, not background removal. `printSheetMm` is the generic print path.
- **Split PDF:** `parsePageRanges` in `lib/utils/pdfTools.ts` is pure and tested; extraction and every-N splitting use the same dynamic `pdf-lib` path. There is no ZIP; outputs download individually.
- **Merge PDF:** `lib/utils/pdfTools.ts` inspects and merges PDFs with `pdf-lib` behind a dynamic import. Encrypted PDFs are skipped, not cracked; there are no thumbnails yet.
- **Image to PDF:** `lib/utils/imagesToPdf.ts` imports `pdf-lib` dynamically inside `buildImagesPdf`; never move it into the shared layout. Images are re-encoded as JPEG, capped at 4000 px and processed one at a time.
- **Photo resizer:** `lib/utils/photoResizer.ts` keeps unit/crop/target math pure; `PhotoResizeTool.tsx` debounces the final encode and draws a 720 px preview. Output is capped at 6000 px. Canvas writes pixels, not DPI metadata.
- **Light-only theme:** no `dark:` variants, no theme switch, no stored preference. Use tokens from `app/globals.css`, not raw hex.
- **Build output:** `.open-next/` is currently tracked; do not add more build output. See `IMPROVE.md` I-17.

## Deployment

Production deploys through Cloudflare Workers Builds when changes merge to `main`. There are no GitHub Actions. The Cloudflare dashboard is the source of truth for build settings; verify and record each deploy in `WORKLOG.md`. `npm run deploy` is a manual fallback only.

Config: `wrangler.jsonc`, `open-next.config.ts`, `next.config.ts`.

## Do not

- Do not commit `.env`, secrets, or `node_modules`/`.next`/new `.open-next` output.
- Do not add a dependency or third-party script without approval.
- Do not change DNS, domains, dashboard build settings, or Cloudflare account config.
- Do not add a code comment unless asked.
- Do not change `build` to `opennextjs-cloudflare build`.
- Do not run `npm run deploy`; the owner performs the final production deploy.

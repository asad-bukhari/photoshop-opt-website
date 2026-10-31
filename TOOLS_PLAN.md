# TOOLS_PLAN.md — Plan to add new tools to ZaibiTools

Status: IMPLEMENTED (2026-10-31). All phases 0–6 are built and merged. Production deploy and manual browser/print checks remain.
Follow `AGENTS.md` for every step: plan -> branch -> build -> test -> update docs -> commit -> PR -> verify.
Copy the phase you are working on into `WORKLOG.md` as a `PLANNED` entry before you code.

---

## 1. Goal

Grow ZaibiTools from 2 tools to a small set of practical, privacy-first tools for people in Pakistan who handle forms, photos, CNIC copies and PDFs. Every tool runs 100% in the browser. No file is uploaded.

## 2. Why these tools (research summary)

- Form portals (NADRA, job and exam sites) often demand photos and signatures at about 20KB, sometimes with exact pixel sizes. People search for "compress image to 20KB / 50KB / 100KB" and "passport photo / signature resizer".
- PDF tools have the biggest search demand (competitor data shows "jpg to pdf", "merge pdf", "compress pdf" in the millions of searches). Those numbers are mostly India/global from Ahrefs snippets on competitor sites. No Pakistan-specific numbers were found. **Verify with Google Search Console after launch.**
- Big competitors upload files to servers and limit free use. "Nothing is uploaded" is our selling point.
- Your engines already cover a lot: KB-targeting compression, canvas filters (B&W, sharpen), print sheet layout, PDF export. New tools should reuse these.

## 3. Tool list, order and size

| # | Tool | Main search idea | Reuses | Size |
| --- | --- | --- | --- | --- |
| 0 | Foundation (shared parts, tool registry) | — | existing code | M |
| 1 | Photo and signature resizer (exact pixels + KB) | resize photo for form, signature resizer | image engine | M |
| 1b | "Compress to 20KB / 50KB / 100KB" landing pages | compress image to 20kb | existing optimizer | S |
| 2 | Image to PDF (JPG/PNG to PDF) | jpg to pdf | jsPDF loader | M |
| 3 | Merge PDF, then Split PDF | merge pdf, split pdf | new lib `pdf-lib` | M |
| 4 | Passport photo sheet maker | passport photo print 4x6 / A4 | CNIC layout + print/PDF code | M |
| 5 | Document scan cleanup (photo to clean B&W PDF) | scan document online | CNIC filters | M |
| 6 | PDF to JPG, image format converter, crop and rotate | pdf to jpg, png to jpg | new lib `pdfjs-dist` | M |

**Not in scope (and why):** background remover (popular browser library is AGPL-licensed, needs a 40–80MB model download), PDF to Word and OCR (need a server or heavy models, which would break the "no upload" promise), PDF compression (browser-only methods give weak results; revisit later).

Build order is 0 -> 1 -> 1b -> 2 -> 3 -> 4 -> 5 -> 6. Ship each tool on its own. Do not start the next until the previous one is merged and checked.

## 4. Prerequisites

1. The frontend redesign (light only, mobile first, SEO page names) from `WORKLOG.md` should be merged first, at least its theme and layout steps. New tools must be built on the **light theme tokens and mobile-first layout**. If the redesign is not merged yet, stop and ask Asad. Do not build new dark-mode UI.
2. `IMPROVE.md` I-09 (object URL leak) should be fixed inside Phase 0 so new tools do not copy the leak.
3. Confirm Workers Builds auto-deploy works (see `WORKLOG.md` deployment log).

Status at 2026-10-30: the light-only redesign, mobile-first CNIC layout and SEO routes are merged on `main`. The object-URL leak remains open and is scheduled for Phase 0.

## 5. Rules every new tool must follow

- 100% client-side. No network calls with user files. No new third-party scripts, no new ad code.
- Keep all existing "intentional decisions" in `AGENTS.md` section 6. Refactors of existing code (marked **[REFACTOR]** below) need Asad's approval first and must not change behaviour of the Image or CNIC tool.
- Mobile first (320px up), tap targets 44px, inputs 16px, no horizontal scroll, light mode only.
- Every on-page claim must be true. Say what the tool cannot do.
- Server Component page wrapper + one `'use client'` tool component + a pure engine in `lib/utils`.
- Heavy libraries are loaded with dynamic `import()` only on the tool page, never in the shared layout.
- Memory safety: process files one at a time, release object URLs (`URL.revokeObjectURL`), and show a clear message for files that are too big or cannot be decoded.
- No code comments unless asked. Use design tokens, no raw hex.
- Any new npm dependency must be listed in the plan and approved (see section 12).

---

## 6. Phase 0 — Foundation

Branch: `feature/tools-foundation`

### 6.1 Tool registry — `lib/data/tools.ts` (new)
One list that describes every tool. Header nav, footer links, home page cards, sitemap, JSON-LD and "related tools" all read from it, so adding a tool later is one entry plus one page.

Each entry:
```
id, slug, name, shortName, icon, description, metaTitle, metaDescription,
h1, intro, howToSteps[], faq[], relatedIds[], keywords[], version, status
```
Move the two existing tools into it. Keep `REPO_INFO` working until nothing uses it, then remove in a follow-up.

### 6.2 Shared UI components (new, in `components/tool/`)
- `ToolHero` — H1 + short intro + privacy note
- `FileDropzone` — click, drag and drop, paste, accept filter, size limit, clear error text, keyboard accessible
- `HowToSteps`, `ToolFaq`, `RelatedTools`
- `ResultActions` — download / print buttons with consistent look
- `ToolPage` layout: hero, ad slot (existing `ResponsiveAd`), tool area, how-to, FAQ, related tools, bottom ad

### 6.3 Shared helpers (new, in `lib/utils/`)
- `objectUrls.ts` — create and revoke object URLs safely
- `loadImage.ts` — decode a File to `HTMLImageElement` / `ImageBitmap`, with a friendly error (HEIC is not supported by most browsers; say so)
- `download.ts` — one function to download a Blob/DataURL
- `format.ts` — KB/MB formatting, filename helpers

### 6.4 [REFACTOR] extractions (approved 2026-10-30; separate small PRs, behaviour must not change)
| Extract | From | To |
| --- | --- | --- |
| `tuneToTarget`, `estimateDataUrlSize` | `imageOptimizer.ts` (private) | `lib/utils/canvasEncode.ts` |
| `applyImageFilters`, `computeOtsuThreshold`, `applyUnsharpMask`, `clamp255` | `cnicOptimizer.ts` (private) | `lib/utils/imageFilters.ts` |
| `loadJsPdfLibrary`, `canvasToJpegDataUrl`, print-window code, `PAPER_SIZE_MM` | `CnicOptTool.tsx` | `lib/utils/pdfExport.ts`, `lib/utils/printSheet.ts` |

After each extraction: Image tool and CNIC tool must behave exactly the same. Compare outputs before/after with the same sample input (same size KB, same pixels visually).

### 6.5 Testing setup (IMPROVE I-29)
Add Vitest for **pure** functions only (math, parsing, layout calculations). Canvas code is checked by hand. Add `npm run test` and add it to the checks in `AGENTS.md`. **Approved by Asad on 2026-10-30 (D-1).**

### 6.6 Navigation
Header, footer and home page now render from the registry. On mobile the menu must list all tools without crowding. Tools hub section on the home page: cards grouped as "Photos", "PDF", "Print sheets".

### 6.7 Done when
- [ ] Registry drives header, footer, home, sitemap
- [ ] Shared components used by at least one existing tool page without visual regressions
- [ ] Object URL leak fixed (I-09)
- [ ] `typecheck`, `build`, `preview` pass; both existing tools tested end to end
- [ ] Docs updated (WORKLOG, IMPROVE, README structure, AGENTS tool checklist)

---

## 7. Phase 1 — Photo and signature resizer

Branch: `feature/photo-signature-resizer`
Suggested URL (final slug comes from the SEO plan): `/photo-signature-resizer`

### 7.1 What the user can do
1. Upload one photo or signature image.
2. Pick a preset or enter custom values:
   - Width x height in pixels, or in mm/cm/inch at a chosen DPI (shown as pixels)
   - Target file size: maximum KB, optional minimum KB
   - Output: JPEG (default), PNG, WebP
3. Choose fit mode: **Fill (crop)**, **Fit (white padding)**, **Stretch** (warn that it distorts).
4. Crop by dragging and zooming (touch friendly) with the correct aspect ratio locked.
5. Optional strip at the bottom with **name and date** text (some portals ask for it). Font size and strip height adjustable.
6. See result: pixels, KB, and a green/red check against the targets.
7. Download. Filename like `photo_300x400_20kb.jpg`.

### 7.2 Presets
Start with generic ones and label them "common sizes, check your portal's rules":
passport 35x45 mm, 2x2 inch, 300x400 px photo, 200x230 px signature, CNIC-style photo. Put presets in `lib/data/tools.ts` or `initialData.ts` as data so they can be edited without touching code. **Do not state that a specific portal requires a size unless it is verified from the portal itself.** Add a "last checked" date to any preset that names a portal.

### 7.3 Engine — `lib/utils/photoResizer.ts` (pure + canvas)
1. Compute crop rectangle from the user's crop/zoom (pure math, unit-tested).
2. Draw to a canvas at the exact output pixels.
3. Add name/date strip if enabled (the strip is part of the final pixel size).
4. Encode with the shared `tuneToTarget` (binary search on quality).
5. Exact pixel size is fixed, so the engine **never shrinks pixels**. If the target KB is impossible at that size, return a clear message ("at 300x400 the smallest we could reach is 24 KB") and still offer the best result.
6. If the file is **below** the minimum KB, raise quality up to the maximum and report if still below. Do not pad files with junk data.

### 7.4 Limits to state on the page
- Canvas export does not write DPI into the file. If DPI matters, say so, or add a small JFIF density write (optional, only if tested).
- Signature on white background only; no background removal.

### 7.5 Tests
- Unit: crop rectangle math, unit conversion (mm/inch to px), target-size result states.
- Manual: portrait/landscape/square sources, a 4000px phone photo, a tiny image, a transparent PNG, EXIF-rotated phone photo (must appear upright), target 20KB / 50KB / 100KB, min KB, name/date strip, phone and desktop, no network upload.

### 7.6 Done when
- [ ] All acceptance checks above pass
- [ ] Page has unique title, H1, intro, how-to, FAQ, JSON-LD, related tools
- [ ] Docs updated; entry in IMPROVE for any limits found

## 7b. Phase 1b — "Compress to 20KB / 50KB / 100KB" pages

Branch: `feature/size-landing-pages`
- The optimizer already targets KB. Add pages that open the **same engine** with a preset target: 20, 50, 100, 200 KB (start with 20/50/100).
- Each page needs its own unique text (what it is for, how to get best quality, FAQ). Do **not** copy the same text with the number changed.
- Implement as a shared `ImageOptTool` with an `initialTargetKB` prop. The old `/image-opt` page stays.
- Add the pages to the registry, sitemap, and internal links. Link them from the optimizer page and from the photo resizer.

---

## 8. Phase 2 — Image to PDF

Branch: `feature/image-to-pdf`
Suggested URL: `/jpg-to-pdf` (matches the biggest search phrase; page text also covers PNG/WebP)

### 8.1 Features
- Add many images, drag to reorder (with up/down buttons for touch), rotate, remove.
- Page size: A4, Letter, Legal, "fit to image". Orientation: auto / portrait / landscape. Margin: none / small / normal.
- Quality: original, high, small (re-encode as JPEG at set quality).
- Download PDF. Optional "Print".

### 8.2 Engine — `lib/utils/imagesToPdf.ts`
- Use one PDF library for all PDF work (see decision D-3: `pdf-lib` approved, so PDF tools share one library and do not depend on a CDN).
- Process images one at a time. Downscale images above a pixel limit (for example 4000px long side) with a visible note.
- Phone photos: rely on browser orientation handling; test with rotated photos.
- HEIC: show a clear "your browser cannot read HEIC" message.

### 8.3 Tests
- Unit: page layout math (fit image into page with margins).
- Manual: 1 image, 20 images, mixed sizes, portrait and landscape, PNG with transparency (white background), a 12MP photo, output opens in a PDF viewer on phone and desktop, file size sensible.

### 8.4 Done when
- [ ] Checks pass; memory stays stable with 20 photos
- [ ] SEO page complete; docs updated

---

## 9. Phase 3 — Merge PDF, then Split PDF

Branches: `feature/merge-pdf`, then `feature/split-pdf`
Suggested URLs: `/merge-pdf`, `/split-pdf`

### 9.1 Merge
- Add several PDFs, reorder, remove, merge in order, download.
- Show file name, page count, size per file.
- v1 has **no page thumbnails** (keeps it small). Thumbnails come with Phase 6 when `pdfjs-dist` is added.
- Encrypted/password PDFs: show "this PDF is protected" and skip. Do not try to break passwords.

### 9.2 Split / extract pages
- Input: page ranges like `1-3, 5, 8-10`. Modes: extract pages into one PDF, or split every N pages into several PDFs (download as individual files; ZIP only if a ZIP helper is approved, see D-4).
- Parse and validate ranges in a pure function (`parsePageRanges`) with unit tests: spaces, reversed ranges, out-of-range, duplicates.

### 9.3 Engine — `lib/utils/pdfTools.ts`
`pdf-lib`: `PDFDocument.load`, `copyPages`, `save`. Load in dynamic import.

### 9.4 Tests
- Unit: `parsePageRanges`.
- Manual: 2 and 10 PDFs, large PDF (about 50MB), PDF with images, scanned PDF, broken file, protected PDF, mobile browser.

### 9.5 Done when
- [ ] Checks pass; honest limit text on the page (file size, no passwords)
- [ ] SEO pages and cross links (merge <-> split <-> jpg-to-pdf)

---

## 10. Phase 4 — Passport photo sheet maker

Branch: `feature/passport-photo-sheet`
Suggested URL: `/passport-photo-maker`

### 10.1 Features
- Upload a photo, crop to the chosen photo size (35x45 mm, 2x2 inch, custom).
- Paper: 4x6 inch, A4, Letter, 3R (reuse existing sizes).
- Copies: auto-fit as many as the sheet allows, or choose a number. Gap between photos adjustable. Optional thin cut lines.
- Optional white-background note: we do **not** remove backgrounds, so the page tells users to upload a photo with a plain background.
- Output at **300 DPI** (A4 = 2480x3508 px). Check memory on low-end phones; fall back to 200 DPI with a note if the canvas fails.
- Print, Download PDF, Download PNG (reuse shared print/PDF helpers).

### 10.2 Engine — `lib/utils/passportSheet.ts`
- Pure function `computeGrid(paperMm, photoMm, gapMm, marginMm)` -> rows, columns, positions. Unit-tested.
- Canvas draw uses mm-to-px at the chosen DPI. True-size accuracy: printing must be at 100% scale; state this on the page.

### 10.3 Tests
- Unit: `computeGrid` for each paper/photo combination (count and positions never exceed the sheet).
- Manual: print a real sheet and measure with a ruler (photo size must match within about 1 mm); PDF page size matches paper size.

### 10.4 Done when
- [ ] Real print measured and noted in WORKLOG
- [ ] SEO page complete; cross link with CNIC tool and photo resizer

---

## 11. Phase 5 and 6 (outline; write detailed plans when you reach them)

### Phase 5 — Document scan cleanup
Branch `feature/scan-cleanup`, URL idea `/photo-to-scanned-pdf`.
Rotate, crop, then filters: Original, Grayscale, B&W scan, brighten (reuse `imageFilters.ts`), multi-page, export one PDF. Honest title: **no automatic edge detection or perspective fix in v1**. Add that as a later improvement if wanted.

### Phase 6 — PDF to JPG, converter, crop/rotate
- `/pdf-to-jpg` with `pdfjs-dist` (render each page to canvas; choose scale/quality; download single image or each page). The pdf.js worker must be served from our own origin and tested under the OpenNext build (`npm run preview`).
- `/image-converter` (JPG/PNG/WebP) and `/crop-rotate-image` reuse shared helpers.
- When `pdfjs-dist` is in, add page thumbnails to merge/split as an improvement.

---

## 12. Dependencies

| Id | Package | Used for | Why | Status |
| --- | --- | --- | --- | --- |
| D-1 | `vitest` (dev) | unit tests for pure functions | no tests exist today | **Approved 2026-10-30.** Dev only, not shipped. |
| D-2 | `pdf-lib` | merge, split, images to PDF | MIT licensed, runs in browser | Approved as part of D-3; check bundle size in `next build` output. |
| D-3 | `pdf-lib` for all PDF work | image to PDF, merge, split | one library is simpler; the jsPDF CDN has no integrity check (IMPROVE I-15) | **Resolved 2026-10-30: use `pdf-lib`.** |
| D-4 | `fflate` (or similar) | ZIP download for batches/splits | only if ZIP is wanted | **Declined 2026-10-30.** No ZIP downloads. |
| D-5 | `pdfjs-dist` | PDF to JPG, thumbnails | Apache-2.0 | **Approved 2026-10-31.** Worker served from our origin via `predev`/`prebuild`. |

Before adding any package: check license, size, last release date, and that it works inside the Cloudflare Worker build.

## 13. SEO and content for each tool (same checklist every time)

- Unique `<title>` (about 60 characters), meta description (about 155), one H1, short intro, 3–4 step how-to, 4–6 FAQ items, related tools, canonical URL
- JSON-LD: `WebApplication` plus `FAQPage` plus `BreadcrumbList`
- Entry added to the registry, sitemap, header/footer and home hub
- Internal links to and from related tools
- Page text written by hand in plain English. No keyword stuffing. No claims the tool cannot meet
- Privacy line that is true: "your files stay on your device; the site uses analytics and ads"
- Old URLs never removed; add redirects if a slug ever changes

## 14. Ads and analytics

- Use the existing ad components and keys. Keep the `srcDoc` iframe with no `sandbox`. No new ad code.
- Reserve ad height to avoid layout shift. Keep ads away from main buttons.
- **Declined 2026-10-30:** no `tool_used` GA event. Do not send tool ids or any other tool data.

## 15. Risks and how to handle them

| Risk | Handling |
| --- | --- |
| Large files freeze the phone | one-at-a-time processing, size limits with clear messages, progress text, later Web Worker |
| Build breaks on Cloudflare | run `npm run preview` for every phase that adds a dependency or worker file |
| pdf.js worker not found in production | serve from own origin; test with `preview`; only in Phase 6 |
| Thin or duplicate SEO pages | unique text per page; the landing pages for 20/50/100 KB must differ |
| Wrong portal rules shown as fact | label presets "common"; verify and date every portal-specific claim |
| Refactor breaks existing tools | tiny PRs, before/after comparison, test both tools fully |
| Bundle gets big | dynamic imports, check `next build` page sizes, keep heavy libs on their own page only |
| Print size not exact | test on a real printer; tell users to print at 100% / "actual size" |

## 16. Pull request list (in order)

1. `docs/add-tools-plan` — this file
2. `feature/tools-foundation` (registry, shared components, helpers, object URL fix)
3. `refactor/extract-canvas-encode`, `refactor/extract-image-filters`, `refactor/extract-print-pdf` (behaviour unchanged)
4. `chore/add-vitest`
5. `feature/photo-signature-resizer`
6. `feature/size-landing-pages`
7. `feature/image-to-pdf`
8. `feature/merge-pdf`, `feature/split-pdf`
9. `feature/passport-photo-sheet`
10. `feature/scan-cleanup`
11. `feature/pdf-to-jpg`, `feature/image-converter`, `feature/crop-rotate`
12. `docs/update-after-new-tools` — README, CLAUDE.md, AGENTS.md, IMPROVE, WORKLOG cleanup

## 17. Definition of done (every tool)

- [ ] Works on a real phone (Android Chrome and iOS Safari if available) and desktop
- [ ] No file leaves the browser (DevTools Network check)
- [ ] `npm run typecheck`, `npm run build`, `npm run test` pass; `npm run preview` passes when dependencies or config changed
- [ ] Lighthouse mobile run on the new page; scores and LCP/CLS/INP recorded in WORKLOG (aim for 90+ Accessibility, Best Practices, SEO; report honestly if lower)
- [ ] SEO checklist (section 13) complete
- [ ] Limits and "what this tool cannot do" are written on the page
- [ ] WORKLOG, IMPROVE, README and registry updated in the same PR
- [ ] After merge: Workers Build checked, live page checked, WORKLOG marked DEPLOYED

## 18. New tool checklist (add to `AGENTS.md`)

```
[ ] Entry added to lib/data/tools.ts
[ ] app/<slug>/page.tsx (Server Component, metadata, JSON-LD)
[ ] components/<Name>Tool.tsx ('use client')
[ ] lib/utils/<engine>.ts (pure math separated from canvas)
[ ] Types in lib/types.ts
[ ] Unit tests for pure functions
[ ] Heavy libraries loaded with dynamic import
[ ] Object URLs released; file size and decode errors handled
[ ] Mobile 320px, light mode, 44px tap targets
[ ] Ads placed using existing components only
[ ] Sitemap, header, footer, home hub, related links updated
[ ] Honest limits written on the page
[ ] WORKLOG / IMPROVE / README updated
```

## 19. Decisions from Asad (answered 2026-10-30)

1. **Order:** start with Phase 0 foundation, then the photo and signature resizer.
2. **Slugs:** `/photo-signature-resizer`, `/jpg-to-pdf`, `/merge-pdf`, `/split-pdf`, `/passport-photo-maker` are the suggested slugs; final names still follow the SEO checklist.
3. **PDF library (D-3):** use `pdf-lib` for all PDF work.
4. **Tests:** Vitest approved (D-1).
5. **ZIP downloads (D-4):** not wanted.
6. **Refactors:** approved on 2026-10-30 for the three extractions in 6.4. Each still ships as its own behaviour-neutral PR with before/after checks.
7. **Analytics event** `tool_used`: no.
8. **Redesign first:** confirmed; the redesign is merged.

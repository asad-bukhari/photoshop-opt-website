# IMPROVE.md

Prioritized backlog for Zaibi Tools. Based on `main` at `da3222a` (2026-10-29). Uncommitted work is out of scope.

- **P1** — trust, legal, privacy, or correctness risk. Fix before promoting the claim.
- **P2** — real bug, performance issue, SEO gap, security hardening, or accessibility gap.
- **P3** — polish, maintainability, or low-risk improvement.
- **DECISION** — needs the owner's answer before implementation.

---

## P1 — fix before promoting claims

- [ ] **I-08 — Replace stale deployment docs and verify Workers Builds.** `README.md:118` still says deployment is manual; this branch corrects the old `CLAUDE.md` line. The project rule is Workers Builds auto-deploy on merge to `main` with no GitHub Actions. The repo has no proof of the dashboard setting. Confirm it in Cloudflare, record it in `WORKLOG.md`, and update `README.md`. No Pages references were found.

## P2 — correctness, performance, SEO, security

- [ ] **I-10 — Debounce CNIC preview rendering.** `components/CnicOptTool.tsx:98-120` regenerates a 1240x1754 PNG and runs per-pixel filters/unsharp on every option change, including slider drags. Debounce, cancel stale work, and avoid re-rendering unchanged inputs.
- [ ] **I-13 — Add robots and Open Graph images.** `app/sitemap.ts` now lists the new routes. Still missing: `app/robots.ts` and per-page Open Graph images. Add them in the SEO technical branch.
- [ ] **I-14 — Add a contact route.** `main` has no contact page. Decide whether the public contact method is a page, a `mailto:` link, or both. **DECISION:** choose the supported contact channel.
- [ ] **I-15 — Add SRI for jsPDF.** `components/CnicOptTool.tsx:64` loads `jspdf.umd.min.js` from cdnjs without `integrity` or `crossOrigin`. Pin the exact file and add a verified SRI hash.
- [ ] **I-17 — Untrack `.open-next` build output.** `main` tracks 89 files under `.open-next/`, so every build dirties the tree. Remove them from the index, add `.open-next/` to `.gitignore`, and confirm Workers Builds still produces its own output. **DECISION:** coordinate with the deploy setup before removing.
- [ ] **I-21 — Remove the `color-boost` type mismatch.** `lib/types.ts:48` includes `color-boost`, but the UI uses `enhanced` (`components/CnicOptTool.tsx:454`) and the engine handles `enhanced` (`lib/utils/cnicOptimizer.ts:295`). Remove `color-boost` or alias it.
- [ ] **I-22 — Expose or remove hidden CNIC controls.** `lib/types.ts:58-62` includes brightness, contrast, sharpness, `borderGrid`, and `dateStamp`; the UI exposes none of them. Either add controls or remove the unused surface.
- [ ] **I-32 — Add keyboard panning to the photo resizer crop.** The canvas crop preview responds to pointer drag and the zoom slider is keyboard accessible, but there is no keyboard way to move the crop. Add arrow-key panning or equivalent buttons.
- [ ] **I-23 — Align the `customScale` range.** `lib/types.ts:57` says 0.5–1.5; the slider allows 0.7–1.3 (`components/CnicOptTool.tsx:495-497`). Pick one range and update the comment and UI.

## P3 — polish and maintainability

- [ ] **I-24 — Stop hard-coding the health version.** `app/api/health/route.ts:8` returns `3.0.0`; read the package version or expose a build identifier.
- [ ] **I-25 — Document the HSTS header.** `README.md:132` lists four security headers; `next.config.ts:19` also sets `Strict-Transport-Security`. Add it to the README.
- [ ] **I-33 — Optionally write JFIF DPI density for JPEG exports.** `lib/utils/photoResizer.ts` keeps the pixel size but Canvas does not write DPI metadata. Add a tested JFIF density write only if the output still opens correctly everywhere.
- [ ] **I-34 — Avoid double JPEG encoding in image-to-PDF when safe.** `lib/utils/imagesToPdf.ts` always re-encodes through Canvas. Embedding the original JPEG/PNG when there is no rotation or downscale would preserve quality and reduce PDF size, but EXIF orientation must be handled first.
- [ ] **I-35 — Add drag/touch positioning to the passport sheet.** The sheet centre-crops with a zoom slider; a drag crop like the photo resizer would let users correct head placement without editing the source. Add after the print-measurement check.
- [ ] **I-27 — Lazy-load below-fold ads.** `components/AdBanner.tsx:50` defaults to `loading="eager"` and `ResponsiveAd` is usually rendered without `lazy`. Pass `lazy` for lower units and measure CLS.

---

- [ ] **I-31 — Split registry content from nav metadata if the bundle grows.** `lib/data/tools.ts` is imported by the client Header and Footer, so it also pulls the FAQ arrays from `initialData.ts` into their chunks. It is small today; revisit if the registry grows or the shared chunks get noticeably larger.

## Done

Move completed items here with the date and commit.

- [x] **I-29 (2026-10-31)** Added Vitest 5.0.5 as a dev dependency, `vitest.config.mts`, the `npm run test` script and 8 pure-function tests for `format`, `estimateDataUrlSize`, `clamp255` and `computeOtsuThreshold`. Canvas/browser flows stay manual; Playwright remains unapproved. Commit `f2543b0`, PR #18.

- [x] **I-09 (2026-10-30)** Object URLs are now created and revoked through `lib/utils/objectUrls.ts`. `ImageOptTool` tracks the original preview URLs and revokes them on reset and unmount; `cnicOptimizer.loadImage` revokes its URL after decode; `CnicOptTool` uses the new `useObjectUrl` hook. Commit `f9dc503`, PR #13.

- [x] **I-30 (2026-10-29)** Upgraded Next.js from 15.5.25 to 16.4.3, `@opennextjs/cloudflare` to 1.20.14 and Wrangler to 4.155.0. `npm run preview` now builds and serves without the escape flag. Commit `342c907`, PR #9.

- [x] **I-05 (2026-10-29)** Removed "without quality loss", "up to 80%" and "batch multi-threaded" from the metadata and copy; the tool page and FAQ now describe the target-size process and sequential processing. The unused `REPO_INFO` block was removed. Commit `17fe0fd`, PR #7.
- [x] **I-07 (2026-10-29)** Added `/privacy` with analytics, ads, hosting logs and jsPDF coverage, and linked it from the footer and tool content. Contact details are omitted until the owner confirms a mailbox (I-14). Commit `17fe0fd`, PR #7.
- [x] **I-20 (2026-10-29)** Renamed the visible labels and internal names to "Image Compressor" and "CNIC Photocopy"; removed the "optimation" strings from the source. Commit `17fe0fd`, PR #7.
- [x] **I-28 (2026-10-29)** Removed the unsupported "up to 80%" claim rather than backing it with a benchmark. Commit `17fe0fd`, PR #7.

- [x] **I-00 (2026-10-29)** Confirmed the repository targets Cloudflare Workers via OpenNext, not Pages; no Pages configuration was found.
- [x] **I-26 (2026-10-29)** Removed the dark mode and theme switch entirely; the site is light-only with `color-scheme: light`, so there is no stored-preference flash. Commit `8d6f439`, PR #2.
- [x] **I-01 (2026-10-29)** Removed the malicious-scanner claim. The modal now says the tools read files with the Canvas API in the browser; no validator is implied. Commit `c37f26c`, PR #3.
- [x] **I-12 (2026-10-29)** Removed the hard-coded "All Systems Active" badge from the header. Commit `c37f26c`, PR #3.
- [x] **I-18 (2026-10-29)** The file-handling modal now uses `aria-labelledby`, a focus trap, Escape to close, focus restore, body scroll lock, and a 44 px close button. Commit `c37f26c`, PR #3.
- [x] **I-02 (2026-10-29)** Removed the HEIC support claim. The UI accepts JPG, PNG, WebP and AVIF input and does not claim HEIC decoding. Commit `72feb3e`, PR #4.
- [x] **I-04 (2026-10-29)** Removed AVIF from the export UI, so the tool no longer downloads WebP bytes with an `.avif` name. The engine fallback is unchanged and unreachable from the UI. Commit `72feb3e`, PR #4.
- [x] **I-11 (2026-10-29)** Removed the unused "Strip EXIF" and "Lossless quantization" controls. The UI now states that re-encoding removes EXIF automatically. Commit `72feb3e`, PR #4.
- [x] **I-19 (2026-10-29)** Removed the "max 25MB" claim; the UI states that there is no enforced file-size limit. Commit `72feb3e`, PR #4.
- [x] **I-03 (2026-10-29)** Corrected the copy to 150 DPI and about 85 x 53 mm; the engine and 500x315 px card frames are unchanged. Commit `c6d78cb`, PR #6.
- [x] **I-06 (2026-10-29)** Removed the automatic boundary-alignment and aspect-lock claims. The UI now says the photo is fitted into a fixed card frame and is not straightened or cropped. Commit `c6d78cb`, PR #6.
- [x] **I-16 (2026-10-29)** Removed the sticky mobile ad and reduced each page to one responsive ad unit (mobile 300x250, desktop 728x90). Commit `c6d78cb`, PR #6.

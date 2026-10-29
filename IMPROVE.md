# IMPROVE.md

Prioritized backlog for Zaibi Tools. Based on `main` at `da3222a` (2026-10-29). Uncommitted work is out of scope.

- **P1** — trust, legal, privacy, or correctness risk. Fix before promoting the claim.
- **P2** — real bug, performance issue, SEO gap, security hardening, or accessibility gap.
- **P3** — polish, maintainability, or low-risk improvement.
- **DECISION** — needs the owner's answer before implementation.

---

## P1 — fix before promoting claims

- [ ] **I-05 — Replace unprovable quality claims.** `app/image-opt/page.tsx:7` says "without quality loss"; `lib/data/initialData.ts:57` says "up to 80%" with "no visible quality degradation"; `lib/data/initialData.ts:12` says "Batch multi-threaded" though processing is a sequential `for` loop in `components/ImageOptTool.tsx:82-90`. Replace with measurable wording or add evidence.
- [ ] **I-07 — Add a privacy policy on `main`.** `app/layout.tsx:46-55` loads Google Analytics and the site serves third-party ads, but `main` has no `/privacy` route or footer policy link. Add a policy that covers analytics, ads, localStorage, and the jsPDF CDN.
- [ ] **I-08 — Replace stale deployment docs and verify Workers Builds.** `README.md:118` still says deployment is manual; this branch corrects the old `CLAUDE.md` line. The project rule is Workers Builds auto-deploy on merge to `main` with no GitHub Actions. The repo has no proof of the dashboard setting. Confirm it in Cloudflare, record it in `WORKLOG.md`, and update `README.md`. No Pages references were found.

## P2 — correctness, performance, SEO, security

- [ ] **I-09 — Revoke object URLs.** `lib/utils/imageOptimizer.ts:80` creates an object URL and stores it in the result; `lib/utils/cnicOptimizer.ts:219` creates one for every CNIC image load; `components/CnicOptTool.tsx:366,393` creates a new URL inside render on every pass. None are revoked. Revoke on reset/unmount or convert thumbnails to data URLs.
- [ ] **I-10 — Debounce CNIC preview rendering.** `components/CnicOptTool.tsx:98-120` regenerates a 1240x1754 PNG and runs per-pixel filters/unsharp on every option change, including slider drags. Debounce, cancel stale work, and avoid re-rendering unchanged inputs.
- [ ] **I-13 — Add sitemap, robots, and Open Graph images.** `main` has no `app/sitemap.ts`, `app/robots.ts`, or `app/opengraph-image.tsx`. Add metadata routes and per-page OG images.
- [ ] **I-14 — Add a contact route.** `main` has no contact page. Decide whether the public contact method is a page, a `mailto:` link, or both. **DECISION:** choose the supported contact channel.
- [ ] **I-15 — Add SRI for jsPDF.** `components/CnicOptTool.tsx:64` loads `jspdf.umd.min.js` from cdnjs without `integrity` or `crossOrigin`. Pin the exact file and add a verified SRI hash.
- [ ] **I-17 — Untrack `.open-next` build output.** `main` tracks 89 files under `.open-next/`, so every build dirties the tree. Remove them from the index, add `.open-next/` to `.gitignore`, and confirm Workers Builds still produces its own output. **DECISION:** coordinate with the deploy setup before removing.
- [ ] **I-20 — Fix user-facing typos.** On `main`: "imgage optimation" (`components/HomeHub.tsx:55`), "image optimation tool" (`components/Footer.tsx:27`), "image-optimation" (`components/Header.tsx:12`), "image-optimation-tool" (`lib/data/initialData.ts:3`), and double spaces in `app/layout.tsx:32` and `components/SecurityModal.tsx:32`. Rename the legacy labels consistently.
- [ ] **I-21 — Remove the `color-boost` type mismatch.** `lib/types.ts:48` includes `color-boost`, but the UI uses `enhanced` (`components/CnicOptTool.tsx:454`) and the engine handles `enhanced` (`lib/utils/cnicOptimizer.ts:295`). Remove `color-boost` or alias it.
- [ ] **I-22 — Expose or remove hidden CNIC controls.** `lib/types.ts:58-62` includes brightness, contrast, sharpness, `borderGrid`, and `dateStamp`; the UI exposes none of them. Either add controls or remove the unused surface.
- [ ] **I-23 — Align the `customScale` range.** `lib/types.ts:57` says 0.5–1.5; the slider allows 0.7–1.3 (`components/CnicOptTool.tsx:495-497`). Pick one range and update the comment and UI.

## P3 — polish and maintainability

- [ ] **I-24 — Stop hard-coding the health version.** `app/api/health/route.ts:8` returns `3.0.0`; read the package version or expose a build identifier.
- [ ] **I-25 — Document the HSTS header.** `README.md:132` lists four security headers; `next.config.ts:19` also sets `Strict-Transport-Security`. Add it to the README.
- [ ] **I-27 — Lazy-load below-fold ads.** `components/AdBanner.tsx:50` defaults to `loading="eager"` and `ResponsiveAd` is usually rendered without `lazy`. Pass `lazy` for lower units and measure CLS.
- [ ] **I-28 — Back up the "up to 80%" claim.** The number appears in metadata and FAQ copy but there is no benchmark or test. Add measured examples or soften the claim.
- [ ] **I-29 — Add a minimal automated smoke suite.** There is no test framework. A small Playwright or Vitest smoke test could cover the two tool flows and `/api/health`. **DECISION:** approve a test dependency and runtime budget.

---

## Done

Move completed items here with the date and commit.

- [x] **I-00 (2026-10-29)** Confirmed the repository targets Cloudflare Workers via OpenNext, not Pages; no Pages configuration was found.
- [x] **I-26 (2026-10-29)** Removed the dark mode and theme switch entirely; the site is light-only with `color-scheme: light`, so there is no stored-preference flash. Commit `8d6f439`, PR #2.
- [x] **I-01 (2026-10-29)** Removed the malicious-scanner claim. The modal now says the tools read files with the Canvas API in the browser; no validator is implied. Commit `c37f26c`, PR #3.
- [x] **I-12 (2026-10-29)** Removed the hard-coded "All Systems Active" badge from the header. Commit `c37f26c`, PR #3.
- [x] **I-18 (2026-10-29)** The file-handling modal now uses `aria-labelledby`, a focus trap, Escape to close, focus restore, body scroll lock, and a 44 px close button. Commit `c37f26c`, PR #3.
- [x] **I-02 (2026-10-29)** Removed the HEIC support claim. The UI accepts JPG, PNG, WebP and AVIF input and does not claim HEIC decoding. Commit `72feb3e`, PR #4.
- [x] **I-04 (2026-10-29)** Removed AVIF from the export UI, so the tool no longer downloads WebP bytes with an `.avif` name. The engine fallback is unchanged and unreachable from the UI. Commit `72feb3e`, PR #4.
- [x] **I-11 (2026-10-29)** Removed the unused "Strip EXIF" and "Lossless quantization" controls. The UI now states that re-encoding removes EXIF automatically. Commit `72feb3e`, PR #4.
- [x] **I-19 (2026-10-29)** Removed the "max 25MB" claim; the UI states that there is no enforced file-size limit. Commit `72feb3e`, PR #4.
- [x] **I-03 (2026-10-29)** Corrected the copy to 150 DPI and about 85 x 53 mm; the engine and 500x315 px card frames are unchanged. Branch `feature/mobile-first-cnic-tool`.
- [x] **I-06 (2026-10-29)** Removed the automatic boundary-alignment and aspect-lock claims. The UI now says the photo is fitted into a fixed card frame and is not straightened or cropped. Branch `feature/mobile-first-cnic-tool`.
- [x] **I-16 (2026-10-29)** Removed the sticky mobile ad and reduced each page to one responsive ad unit (mobile 300x250, desktop 728x90). Branch `feature/mobile-first-cnic-tool`.

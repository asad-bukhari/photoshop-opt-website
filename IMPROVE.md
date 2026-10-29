# IMPROVE.md

Prioritized backlog for Zaibi Tools. Based on `main` at `da3222a` (2026-10-29). Uncommitted work is out of scope.

- **P1** — trust, legal, privacy, or correctness risk. Fix before promoting the claim.
- **P2** — real bug, performance issue, SEO gap, security hardening, or accessibility gap.
- **P3** — polish, maintainability, or low-risk improvement.
- **DECISION** — needs the owner's answer before implementation.

---

## P1 — fix before promoting claims

- [ ] **I-02 — Resolve the HEIC support claim.** `components/ImageOptTool.tsx:335` says HEIC is supported. There is no HEIC decoder; Chrome/Firefox cannot reliably decode HEIC through `Image`. **DECISION:** remove HEIC from the copy or add a decoder dependency (requires approval).
- [ ] **I-03 — Fix the 300 DPI / 150 DPI / "true-size" mismatch.** `components/HomeHub.tsx:21` says "300 DPI calibration"; `components/CnicOptTool.tsx:571` says "@ 150 DPI"; A4 is rendered as 1240x1754 px in `lib/utils/cnicOptimizer.ts:10-11`, which is 150 DPI. The cards are drawn at a fixed 500x315 px (`cnicOptimizer.ts:57-58`), not from the physical 85.60x53.98 mm card at a calibrated DPI. **DECISION:** correct the copy to 150 DPI or render at 300 DPI and re-verify scale.
- [ ] **I-04 — Stop labelling WebP bytes as AVIF.** `lib/utils/imageOptimizer.ts:119` maps AVIF to `image/webp`, but `lib/utils/imageOptimizer.ts:7,171` gives the file an `.avif` extension. The downloaded file is WebP content with an AVIF name. **DECISION:** label it WebP or add a real AVIF encoder.
- [ ] **I-05 — Replace unprovable quality claims.** `app/image-opt/page.tsx:7` says "without quality loss"; `lib/data/initialData.ts:57` says "up to 80%" with "no visible quality degradation"; `lib/data/initialData.ts:12` says "Batch multi-threaded" though processing is a sequential `for` loop in `components/ImageOptTool.tsx:82-90`. Replace with measurable wording or add evidence.
- [ ] **I-06 — Fix the "automated boundary alignment" claim.** `lib/data/initialData.ts:28` claims automatic boundary alignment and aspect-ratio lock. `lib/utils/cnicOptimizer.ts:73` stretches each image into a fixed box with `drawImage(img, 0, 0, w, h)`; there is no edge detection or aspect lock. **DECISION:** rewrite the claim or implement detection.
- [ ] **I-07 — Add a privacy policy on `main`.** `app/layout.tsx:46-55` loads Google Analytics and the site serves third-party ads, but `main` has no `/privacy` route or footer policy link. Add a policy that covers analytics, ads, localStorage, and the jsPDF CDN.
- [ ] **I-08 — Replace stale deployment docs and verify Workers Builds.** `README.md:118` still says deployment is manual; this branch corrects the old `CLAUDE.md` line. The project rule is Workers Builds auto-deploy on merge to `main` with no GitHub Actions. The repo has no proof of the dashboard setting. Confirm it in Cloudflare, record it in `WORKLOG.md`, and update `README.md`. No Pages references were found.

## P2 — correctness, performance, SEO, security

- [ ] **I-09 — Revoke object URLs.** `lib/utils/imageOptimizer.ts:80` creates an object URL and stores it in the result; `lib/utils/cnicOptimizer.ts:219` creates one for every CNIC image load; `components/CnicOptTool.tsx:366,393` creates a new URL inside render on every pass. None are revoked. Revoke on reset/unmount or convert thumbnails to data URLs.
- [ ] **I-10 — Debounce CNIC preview rendering.** `components/CnicOptTool.tsx:98-120` regenerates a 1240x1754 PNG and runs per-pixel filters/unsharp on every option change, including slider drags. Debounce, cancel stale work, and avoid re-rendering unchanged inputs.
- [ ] **I-11 — Wire or remove the unused image options.** The "Strip EXIF GPS privacy data" checkbox (`components/ImageOptTool.tsx:263-274`) does not change behavior; Canvas re-encoding always strips EXIF. "Lossless quantization" (`components/ImageOptTool.tsx:276-287`) is ignored by `imageOptimizer.ts`. Remove the controls or implement the behavior.
- [ ] **I-13 — Add sitemap, robots, and Open Graph images.** `main` has no `app/sitemap.ts`, `app/robots.ts`, or `app/opengraph-image.tsx`. Add metadata routes and per-page OG images.
- [ ] **I-14 — Add a contact route.** `main` has no contact page. Decide whether the public contact method is a page, a `mailto:` link, or both. **DECISION:** choose the supported contact channel.
- [ ] **I-15 — Add SRI for jsPDF.** `components/CnicOptTool.tsx:64` loads `jspdf.umd.min.js` from cdnjs without `integrity` or `crossOrigin`. Pin the exact file and add a verified SRI hash.
- [ ] **I-16 — Review ad density and networks.** Home has four ad units, each tool page has three, plus the sticky mobile bar. That is high for a utility page and can hurt CLS and trust. **DECISION:** decide which units stay and whether the Adsterra policy allows the layout.
- [ ] **I-17 — Untrack `.open-next` build output.** `main` tracks 89 files under `.open-next/`, so every build dirties the tree. Remove them from the index, add `.open-next/` to `.gitignore`, and confirm Workers Builds still produces its own output. **DECISION:** coordinate with the deploy setup before removing.
- [ ] **I-19 — Enforce or remove the 25 MB limit.** `components/ImageOptTool.tsx:335` says "max 25MB per file"; no code checks file size. Add validation with a clear error or remove the claim.
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
- [x] **I-01 (2026-10-29)** Removed the malicious-scanner claim. The modal now says the tools read files with the Canvas API in the browser; no validator is implied. Branch `feature/mobile-first-layout`.
- [x] **I-12 (2026-10-29)** Removed the hard-coded "All Systems Active" badge from the header. Branch `feature/mobile-first-layout`.
- [x] **I-18 (2026-10-29)** The file-handling modal now uses `aria-labelledby`, a focus trap, Escape to close, focus restore, body scroll lock, and a 44 px close button. Branch `feature/mobile-first-layout`.

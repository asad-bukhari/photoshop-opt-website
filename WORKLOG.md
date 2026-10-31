# WORKLOG.md

Newest entries go at the top. Keep the project snapshot and deployment log current.

---

## 2026-10-31 — Extract print and PDF helpers (refactor 3 of 3)

Status: TESTED
Branch: `refactor/extract-print-pdf`

Goal:
- Move `PAPER_SIZE_MM`, `loadJsPdfLibrary` and `canvasToJpegDataUrl` out of `CnicOptTool.tsx` into `lib/utils/pdfExport.ts`, and the print-window code into `lib/utils/printSheet.ts`, without changing print or PDF output.

Plan:
- Add `pdfExport.ts` with the paper sizes, the jsPDF CDN loader and the JPEG conversion.
- Add `printSheet.ts` with the popup/write/image-wait/print/close sequence, returning `false` when the popup is blocked.
- Import the helpers in `CnicOptTool.tsx` and delete the local copies; keep the same message, title, A4/Letter/Legal/3R dimensions and Pakistani-grid two-page behavior.
- Run `typecheck`, `build`, the dev route check and a line-level comparison.

Risks:
- The jQuery-free print ready loop, page count and `@page` CSS must stay identical.
- The jsPDF version, CDN URL, JPEG quality and `FAST` compression must not change.

What changed:
- Added `lib/utils/pdfExport.ts` with `PAPER_SIZE_MM`, `loadJsPdfLibrary` and `canvasToJpegDataUrl` copied from `CnicOptTool.tsx`.
- Added `lib/utils/printSheet.ts` with the popup, HTML, image-ready wait, print and close sequence. It returns `false` when the popup is blocked and accepts an optional print title.
- `CnicOptTool.tsx` imports the helpers and no longer defines the paper sizes, jsPDF loader, JPEG conversion or print-window code. The blocked-popup message is unchanged.
- No UI copy, routing or dependency changes; the jsPDF CDN URL/version, JPEG quality and `FAST` compression are unchanged.

Tests run:
- `npm run typecheck` — PASS.
- `npm run build` — PASS. Next.js 16.4.3 (Turbopack), all 8 routes generated, TypeScript passed.
- `npm run dev` — PASS. `/` 200, `/image-compressor` 200, `/cnic-photocopy` 200, `/api/health` 200; no errors in the dev log.
- `git diff --check` — PASS.
- Print/PDF output comparison — code-level only. The moved blocks are identical; no browser or printer was available.
- Manual print/PDF check and Lighthouse — NOT RUN. No browser is installed.

Not tested:
- A real print window, PDF download and printed sheet size were not exercised.
- `npm run preview` — NOT RUN. No routing, config, dependency or asset change.

Docs updated:
- `WORKLOG.md`.

Commit/PR:
- Commit `PENDING` — `refactor: extract print and PDF helpers`.
- PR `PENDING`.

Follow-ups:
- Production deploy remains deferred until all new tools are built.
- Next: `chore/add-vitest`, then the photo/signature resizer.

---

## 2026-10-31 — Extract image filters (refactor 2 of 3)

Status: TESTED
Branch: `refactor/extract-image-filters`

Goal:
- Move `applyImageFilters`, `computeOtsuThreshold`, `applyUnsharpMask` and `clamp255` out of `cnicOptimizer.ts` into `lib/utils/imageFilters.ts` without changing filter output.

Plan:
- Add `lib/utils/imageFilters.ts` with the existing function bodies copied verbatim.
- Use a narrow `ImageFilterOptions` type (`filter`, `brightness`, `contrast`, `sharpness`) so the module is reusable; `CnicPrintOptions` stays structurally compatible.
- Import `applyImageFilters` in `cnicOptimizer.ts` and delete the private copies.
- Run `typecheck`, `build`, the dev route check and a line-level comparison.

Risks:
- The Otsu threshold, sigmoid softness, grayscale stretch and unsharp-mask kernel must not change.
- The `original` early return and the `sharpness > 0` guard must stay.

What changed:
- Added `lib/utils/imageFilters.ts` with the exact `clamp255`, `computeOtsuThreshold`, `applyImageFilters` and `applyUnsharpMask` bodies from `cnicOptimizer.ts`.
- Added an `ImageFilterOptions` type (`filter`, `brightness`, `contrast`, `sharpness`); `CnicPrintOptions` remains structurally compatible, so the CNIC call site is unchanged.
- `cnicOptimizer.ts` imports `applyImageFilters` and no longer defines the four private helpers.
- No UI, copy, routing or dependency changes.

Tests run:
- `npm run typecheck` — PASS.
- `npm run build` — PASS. Next.js 16.4.3 (Turbopack), all 8 routes generated, TypeScript passed.
- `npm run dev` — PASS. `/` 200, `/image-compressor` 200, `/cnic-photocopy` 200, `/api/health` 200; no errors in the dev log.
- `git diff --check` — PASS.
- Filter-output comparison — code-level only. The moved function bodies are identical; no browser or Canvas run was available.
- Manual browser checks and Lighthouse — NOT RUN. No browser is installed.

Not tested:
- Real filter output and print/PDF results were not compared in a browser.
- `npm run preview` — NOT RUN. No routing, config, dependency or asset change.

Docs updated:
- `WORKLOG.md`.

Commit/PR:
- Commit: `ed692e8` — `refactor: extract image filter helpers`.
- PR: https://github.com/asad-bukhari/photoshop-opt-website/pull/16.

Follow-ups:
- Production deploy remains deferred until all new tools are built.
- Next refactor: `refactor/extract-print-pdf`.

---

## 2026-10-31 — Extract canvas encoding (refactor 1 of 3)

Status: TESTED
Branch: `refactor/extract-canvas-encode`

Goal:
- Move `estimateDataUrlSize` and `tuneToTarget` out of `imageOptimizer.ts` into `lib/utils/canvasEncode.ts` without changing image output.

Plan:
- Add `lib/utils/canvasEncode.ts` with the existing functions copied verbatim and an exported `TuneResult` type.
- Import the functions in `imageOptimizer.ts` and delete the private copies.
- Compare the extracted code line by line, then run `typecheck`, `build` and the dev route check.
- Docs: this entry; note that the Image and CNIC tools are unchanged.

Risks:
- A changed rounding or loop bound could change the encoded quality or target-size result.
- The `overTarget` fallback at quality 0.05 must stay exactly the same.

What changed:
- Added `lib/utils/canvasEncode.ts` with the exact `estimateDataUrlSize` and `tuneToTarget` bodies from `imageOptimizer.ts`, plus the exported `TuneResult` type.
- `imageOptimizer.ts` imports both helpers and no longer defines private copies. No loop bound, rounding, quality floor or fallback changed.
- No UI, copy, routing or dependency changes.

Tests run:
- `npm run typecheck` — PASS.
- `npm run build` — PASS. Next.js 16.4.3 (Turbopack), all 8 routes generated, TypeScript passed.
- `npm run dev` — PASS. `/` 200, `/image-compressor` 200, `/cnic-photocopy` 200, `/api/health` 200; no errors in the dev log.
- `git diff --check` — PASS.
- Output comparison with the pre-refactor code — code-level only. The moved function bodies are identical; no browser or Canvas run was available.
- Manual browser checks and Lighthouse — NOT RUN. No browser is installed.

Not tested:
- Real encoded sizes and visual output were not compared in a browser.
- `npm run preview` — NOT RUN. No routing, config, dependency or asset change.

Docs updated:
- `WORKLOG.md`.

Commit/PR:
- Commit: `8c05c97` — `refactor: extract canvas encoding helpers`.
- PR: https://github.com/asad-bukhari/photoshop-opt-website/pull/15.

Follow-ups:
- Production deploy is intentionally deferred until all new tools are built (owner decision on 2026-10-31).
- Next refactor: `refactor/extract-image-filters`.

---

## 2026-10-30 — Tools foundation (registry, shared parts, object URLs)

Status: MERGED (production deploy pending)
Branch: `feature/tools-foundation`

Goal:
- Build the shared foundation in `TOOLS_PLAN.md` Phase 0 so the new tools reuse one registry, one set of UI parts and one set of helpers.
- Fix the object-URL leak (`IMPROVE.md` I-09) before new tools copy it.
- Keep the Image and CNIC tools visually and behaviourally unchanged.

Plan:
- Add `lib/data/tools.ts` with the two live tools and helpers; add tool types to `lib/types.ts`.
- Add shared helpers: `objectUrls.ts`, `loadImage.ts`, `download.ts`, `format.ts`.
- Add shared components in `components/tool/`: `ToolHero`, `FileDropzone`, `HowToSteps`, `ToolFaq`, `RelatedTools`, `ResultActions`, `ToolPage`, `ToolIcon`.
- Render header, footer, home hub and sitemap from the registry.
- Use `RelatedTools` on both existing tool pages; leave the tool components untouched.
- Revoke the original preview object URLs created by `imageOptimizer.ts` and `cnicOptimizer.ts`; track them in `ImageOptTool`.
- Checks: `typecheck`, `build`, `dev` route checks, `preview` (navigation and rendering changed), manual browser checks if available.

Risks:
- Registry-driven nav could change active-link behaviour; keep the existing active logic.
- Shared `RelatedTools` adds content to both pages; keep it below the existing content so the tool flow is unchanged.
- The preview object URL is used by the comparison slider; revoke only on reset/unmount, never while an item is displayed.

What changed:
- `lib/types.ts`: added the tool registry types (`ToolEntry`, `ToolCategory`, `ToolStatus`, `ToolIconName`, how-to and FAQ item types).
- `lib/data/tools.ts`: new registry for the two live tools with metadata, intro, how-to steps, FAQ references, related ids, keywords, features, action label, version and status. Helpers: `toolHref`, `getToolById`, `getToolBySlug`, `getLiveTools`, `getLiveToolCategories`, `getRelatedTools`.
- `components/tool/`: new `ToolIcon`, `ToolHero`, `HowToSteps`, `ToolFaq`, `RelatedTools`, `FileDropzone`, `ResultActions` and `ToolPage`. `FileDropzone` supports click, drag/drop and paste with type/size validation and error text; `ToolPage` uses one responsive ad unit to keep the one-ad-per-page rule.
- `Header.tsx`, `Footer.tsx`, `HomeHub.tsx` and `app/sitemap.ts` now read the live tools from the registry. The home hub groups cards under "Photos" and "Print sheets".
- Both existing tool pages render `RelatedTools` below their content.
- `lib/utils/objectUrls.ts`: create/revoke helpers. `lib/hooks/useObjectUrl.ts`: preview URL lifecycle hook.
- I-09 fix: `imageOptimizer.ts` revokes its URL on decode/processing failure; `ImageOptTool` tracks successful original preview URLs and revokes them on reset and unmount; `cnicOptimizer.loadImage` revokes its URL after decode; `CnicOptTool` uses `useObjectUrl` instead of creating URLs in `useMemo`.
- New helpers `loadImage.ts`, `download.ts` and `format.ts` are ready for the new tools; nothing imports them yet.
- Docs: this entry, `IMPROVE.md` (I-09 moved to Done, new I-31), `README.md` structure, `CLAUDE.md` notes and the new `AGENTS.md` tool checklist.

Tests run:
- `npm run typecheck` — PASS.
- `npm run build` — PASS. Next.js 16.4.3 (Turbopack), all 8 routes generated, TypeScript passed.
- `npm run dev` — PASS. `/` 200, `/image-compressor` 200, `/cnic-photocopy` 200, `/privacy` 200, `/terms` 200, `/api/health` 200, `/sitemap.xml` 200, `/missing-route` 404; `/image-opt` and `/cnic-opt` returned 301. No server errors in the dev log. Each of `/`, `/image-compressor` and `/cnic-photocopy` had exactly one `<h1>`; no `class="dark"` appeared; the home page contained "Photos" and "Print sheets"; both tool pages contained "Related tools" and the other tool link.
- `npm run preview` — PASS on retry. The first attempt failed while Next fetched Google Fonts ("Failed to fetch Space Grotesk from Google Fonts"); a second run built and served normally. Final run: `/`, `/image-compressor`, `/cnic-photocopy`, `/privacy`, `/terms`, `/api/health` and `/sitemap.xml` 200; `/image-opt` and `/cnic-opt` 301 and resolved to 200 when followed; unknown route 404. The sitemap contains the two registry tools and the legal pages.
- `git diff --check` — PASS after restoring the generated tracked `.open-next` changes from the preview build. The `.open-next/` and `.wrangler/` output remains untracked and is not part of this change.
- Manual browser checks (375 px, 1280 px, tool flows, compare slider, print/PDF/PNG, ads, keyboard) — NOT RUN. No browser is installed.
- Object URL runtime check in DevTools — NOT RUN. The fix was verified by code inspection only.
- Lighthouse — NOT RUN. Chrome/Lighthouse are not installed.

Not tested:
- Visual layout, tap targets, ads and the two tool flows in a real browser.
- Real memory behaviour after many large images.
- Client bundle size: Next.js 16 did not print per-route sizes in this build.
- Production after merge: the live site still served the pre-Phase-0 HTML at 2026-10-31 04:00 UTC (`Two tools, one page`, no related-tools section). `wrangler deployments list` showed the newest deployment created 2026-10-30T04:46:56Z, before this merge. Workers Builds did not publish a new version within about five minutes. The dashboard build was not inspected and `npm run deploy` was not run.

Docs updated:
- `WORKLOG.md`, `IMPROVE.md`, `README.md`, `CLAUDE.md`, `AGENTS.md`.

Commit/PR:
- Commit: `f9dc503` — `feat: add tools foundation and fix object URLs`.
- PR: https://github.com/asad-bukhari/photoshop-opt-website/pull/13 (merged, merge commit `c9ee4e0`).

Follow-ups:
- Approve and run the three behaviour-neutral engine extractions next.
- Add Vitest (`chore/add-vitest`), then the photo/signature resizer.
- I-31: if the client bundle grows, split nav metadata from the registry content.
- I-08 remains open: confirm Workers Builds in the Cloudflare dashboard or have the owner run the production deploy, then re-check the live HTML and record it here.
- `npm run preview` depends on fetching Google Fonts; a network failure can make the first attempt fail even though the build is valid.

---

## 2026-10-30 — Add the new-tools plan and record decisions

Status: MERGED
Branch: `docs/add-tools-plan`

Goal:
- Commit `TOOLS_PLAN.md`, the phased plan for growing Zaibi Tools from two tools to a small suite, and record the owner's decisions before any code starts.

Plan:
- Add `TOOLS_PLAN.md` with the phases, shared foundation, SEO rules, dependencies and risks.
- Correct the backlog references to `IMPROVE.md` (object-URL leak is I-09; test suite is I-29).
- Record Asad's answers in section 19 and the dependency table.
- Docs-only change: run `git diff --check`; no `typecheck`, `build`, `preview` or dev-server check.

What changed:
- Added `TOOLS_PLAN.md`.
- Decisions recorded: build Phase 0 before Phase 1; `pdf-lib` for all PDF work; Vitest approved; no ZIP downloads; no `tool_used` GA event; redesign prerequisite confirmed merged.
- Refactors of the existing Image and CNIC engines are still unapproved; each extraction needs its own approval before work starts.
- `IMPROVE.md` I-29 now records that Vitest is approved and pending implementation in Phase 0.

Tests run:
- `npm run dev` — NOT RUN. Docs-only change.
- `npm run typecheck` — NOT RUN. Docs-only change.
- `npm run build` — NOT RUN. Docs-only change.
- `npm run preview` — NOT RUN. Docs-only change.
- Manual checklist — NOT RUN. No UI change.
- `git diff --check` — PASS.

Not tested:
- Every new tool in the plan is unbuilt, so no tool checks exist yet.

Docs updated:
- `WORKLOG.md`, `IMPROVE.md`, `TOOLS_PLAN.md`.

Commit/PR:
- Commit: `26c79cd` — `docs: add new tools plan and record decisions`.
- PR: https://github.com/asad-bukhari/photoshop-opt-website/pull/12 (merged).
- Merge commit: `6240eca`.
- Production: docs-only change. `zaibitools.com` `/`, `/api/health` and `/sitemap.xml` returned 200 on 2026-10-31 03:54 UTC. The Cloudflare Workers Build itself was not inspected.

Follow-ups:
- Phase 0 is in progress in `feature/tools-foundation` (PR #13).
- The three engine extractions need separate approval and behaviour-neutral PRs.
- `pdf-lib` (D-2) and Vitest (D-1) are approved but not installed yet.
- `pdfjs-dist` (D-5) is still unapproved.
- I-08 (verify Workers Builds in the Cloudflare dashboard) remains open.

---

## 2026-10-29 — Upgrade to Next.js 16 (deploy blocker I-30)

Status: DEPLOYED
Branch: `chore/upgrade-nextjs-16`

Goal:
- Fix I-30: OpenNext rejects Next.js 15.5.25 because Next 15 left the two-year support window on 2026-10-21.
- Restore the normal `npm run preview` and deploy path without the `--dangerouslyUseUnsupportedNextVersion` escape flag.

Plan:
- Upgrade `next` to 16.4.3, `@opennextjs/cloudflare` to 1.20.14 (supports Next >=16.4.1), and `wrangler` to 4.148.0 (OpenNext peer requirement).
- Run `npm install`, then `typecheck`, `build`, `dev` route checks, and `npm run preview`.
- Fix any Next 16 breaking changes.
- Update `README.md`, `CLAUDE.md`, `AGENTS.md` and `IMPROVE.md` with the new versions and close I-30.

What changed:
- `next` `^15.3.3` → `^16.4.3` (installed 16.4.3); React resolved to 19.2.8.
- `@opennextjs/cloudflare` `^1.20.6` → `^1.20.14`, which supports Next `>=16.4.1`.
- `wrangler` `^4.130.0` → `^4.148.0` (installed 4.155.0), required by the OpenNext peer range.
- `tsconfig.json`: Next 16 set `jsx` to `react-jsx` and added `.next/dev/types/**/*.ts` to `include`; the rest of the file keeps its compact format.
- `package-lock.json` regenerated. `node_modules` was reinstalled because npm could not rename the old `miniflare`/`workerd` directories in place on this filesystem.
- Docs: Next.js 16 in `AGENTS.md`, `CLAUDE.md`, `README.md`; version table and I-30 updated.

Tests run:
- `npm run typecheck` — PASS.
- `npm run build` — PASS. Next.js 16.4.3 (Turbopack); all 8 routes generated; TypeScript passed.
- `npm run dev` — PASS. `/` 200, `/image-compressor` 200, `/cnic-photocopy` 200, `/privacy` 200, `/terms` 200, `/api/health` 200, unknown route 404; `/image-opt` 301 to `/image-compressor`; no errors in the dev log.
- `npm run preview` — PASS with no escape flag. OpenNext built the Worker and `wrangler dev` served `/`, both tools, `/privacy`, `/terms`, `/sitemap.xml` and `/api/health` with 200; `/image-opt` and `/cnic-opt` returned 301 and resolved to the new routes; trailing slash returned 308 then 301.
- `git diff --check` — PASS.
- Manual browser checks and Lighthouse — NOT RUN. No browser is installed.

Not tested:
- Visual layout, tool flows, print/PDF/PNG, ads and keyboard checks in a real browser.
- `npm audit` — the install reported 6 high-severity advisories, but `npm audit --omit=dev` failed with a registry/network error. Needs a follow-up audit and a decision before production.
- npm printed allow-scripts warnings for `esbuild` and `workerd` postinstall scripts; the preview still ran with the bundled binaries.

Docs updated:
- `WORKLOG.md`, `IMPROVE.md`, `README.md`, `CLAUDE.md`, `AGENTS.md`.

Commit/PR:
- Commit: `342c907` — `chore: upgrade to next.js 16`.
- PR: https://github.com/asad-bukhari/photoshop-opt-website/pull/9.

Follow-ups:
- Production still served the old deployment at the last check; after merge, the owner needs to confirm the Workers Build and deploy.
- Run `npm audit` when the registry is reachable and decide whether to update or accept the reported advisories.
- The CNIC engine footer still says "Prepared with cnic-copy-print-opt | Proprietary tool by Asad Bukhari"; owner decision pending.

---

## 2026-10-29 — SEO routes and content (redesign step 5)

Status: DEPLOYED
Branch: `feature/seo-pages-and-content` (stacked on `feature/mobile-first-cnic-tool`, PR #6)

Goal:
- Rename the tool URLs to `/image-compressor` and `/cnic-photocopy`, keep the old URLs working with `301`, and align titles, descriptions, canonicals, sitemap and internal links.
- Add the long-tail content, FAQs and legal pages from the approved redesign plan without claiming anything the tools cannot do.

Plan:
- Rename the route folders and add `301` redirects in `next.config.ts`.
- Update Header, Footer, home, tool and 404 links.
- Add long-tail content components for both tools, with one H1 per page and truthful copy.
- Add `/privacy`, `/terms` and `app/sitemap.ts`; link the legal pages from the footer.
- Update the root metadata, README, CLAUDE, AGENTS, IMPROVE and this log.
- Check typecheck, build, dev routes, redirects, sitemap, canonicals, copy and preview.

What changed:
- `app/image-opt` → `app/image-compressor`; `app/cnic-opt` → `app/cnic-photocopy`.
- `next.config.ts`: `301` redirects for both old slugs. Next normalizes a trailing slash with its own `308` before the `301`.
- `app/layout.tsx` and `app/page.tsx`: new home title, description, Open Graph copy; removed "Proprietary" and the suite language.
- Tool page metadata: `Image Compressor to 20KB, 50KB or 100KB` and `Print CNIC Front and Back on One A4 Page`, with new descriptions, canonicals and `og:url`.
- Added `components/ContentSheet.tsx`, `ImageOptContent.tsx`, `CnicOptContent.tsx`, `LegalPage.tsx`.
- Moved the 4-step how-tos out of the client tool components and into the server content components, then added the long-tail H2/H3 sections and FAQ lists.
- Added 12 image FAQs and 13 CNIC FAQs to `lib/data/initialData.ts`; removed the unused `REPO_INFO` block that repeated stale claims.
- Added `/privacy` and `/terms` (light layout); the footer now links to both. Contact details are omitted until the owner confirms a mailbox (I-14).
- Added `app/sitemap.ts` with fixed `lastModified` dates and the new routes.
- Updated `Header.tsx`, `Footer.tsx`, `HomeHub.tsx`, `not-found.tsx` and both tool components to the new slugs.
- Added a "Popular tasks" section on the home page linking to `#compress-jpg`, `#convert-formats`, `#how-to-print-cnic` and `#cnic-pdf` with `scroll-mt-24`.
- Updated `README.md`, `CLAUDE.md`, `AGENTS.md` and `IMPROVE.md` (I-05, I-07, I-20, I-28; new I-30).

Tests run:
- `npm run typecheck` — PASS.
- `npm run build` — PASS. Next.js 15.5.25; `/` 107 kB, `/image-compressor` 114 kB, `/cnic-photocopy` 117 kB, `/privacy` and `/terms` 103 kB first load.
- `npm run dev` — PASS. `/` 200, `/image-compressor` 200, `/cnic-photocopy` 200, `/privacy` 200, `/terms` 200, `/api/health` 200, unknown route 404. The dev log had no errors.
- Redirects in dev — PASS: `/image-opt`, `/image-opt/`, `/cnic-opt` and `/cnic-opt/` all end at the new route with 200 after following; the first hop is `301` (trailing slash first gets Next's `308`).
- Sitemap in dev — PASS: `/sitemap.xml` 200 with `/`, `/image-compressor`, `/cnic-photocopy`, `/privacy`, `/terms` and a fixed `2026-10-29` date.
- Rendered HTML audit — PASS: one H1 per page; titles, descriptions and canonicals match the plan; no `class="dark"`, "up to 80%", "without quality loss", "anti-fraud", "Proprietary", "HEIC", "300 DPI" or "Official Use Only" in the visible copy; no old-slug links; home popular-task anchors exist on the target pages.
- `npm run preview` — FAIL. The script stops with `Next.js version 15.5.25 is not supported by the Next.js team.` This is a pre-existing version check, now recorded as I-30.
- OpenNext + Wrangler workaround — PASS. `npx opennextjs-cloudflare build --dangerouslyUseUnsupportedNextVersion` succeeded and `wrangler dev` served `/`, both tools, `/privacy`, `/terms`, `/api/health` and `/sitemap.xml` with 200; the old slugs returned `301` and resolved to the new routes (trailing slash: `308` then `301`).
- `git diff --check` — PASS.
- Manual browser checks (375 px, 1280 px, tool flows, print/PDF/PNG, ads, keyboard) — NOT RUN. No browser is installed.
- Lighthouse — NOT RUN. Chrome/Lighthouse are not installed.
- Rich Results / schema validation — NOT RUN. JSON-LD is branch 6.

Not tested:
- Visual layout, tap targets, print output, PDF/PNG export, ad rendering and real-device behaviour.
- Search Console reindexing and the real-world redirect status in production.
- Legal wording and the missing contact channel need the owner's approval.

Docs updated:
- `WORKLOG.md`, `IMPROVE.md`, `README.md`, `CLAUDE.md`, `AGENTS.md`.

Commit/PR:
- Commit: `17fe0fd` — `feat: add seo routes and long-tail content`.
- PR: https://github.com/asad-bukhari/photoshop-opt-website/pull/7 (base `feature/mobile-first-cnic-tool`; retarget after PR #6 merges). Do not merge without approval.

Follow-ups:
- Branch 6: `robots.ts`, Open Graph images, JSON-LD, Twitter metadata, sitemap/robots verification.
- Owner decisions: approve the legal text and route rename, and confirm whether a contact email exists (I-14).
- I-30: upgrade Next.js or add `--dangerouslyUseUnsupportedNextVersion` to the OpenNext scripts; `npm run preview` and the normal deploy path currently fail.
- The generated CNIC sheet footer still reads `Prepared with cnic-copy-print-opt | Proprietary tool by Asad Bukhari` because the engine was not edited. This needs an owner decision.
- Rebase this branch onto `main` after PR #6 merges.

---

## 2026-10-29 — Mobile-first CNIC tool (redesign step 4)

Status: MERGED (production deploy unverified)
Branch: `feature/mobile-first-cnic-tool`

Goal:
- Make the CNIC tool usable on a 360 px phone: add the two card images, open settings only when needed, see a bounded preview, and reach Print/PDF/PNG before any ad.
- Remove the 300 DPI, true-size, anti-fraud, and engine-badge claims from the CNIC UI.

What changed:
- `components/CnicOptTool.tsx`: rewritten mobile-first layout. Mobile order is add images, collapsible print settings, preview + actions, one ad, then a 4-step how-to. Desktop uses a 5/7 split.
- Removed the dark "cnic-copy-print-opt engine" hero, version badge, "Official Use Only" stamp, and 1:1/true-size copy.
- The preview is now a bounded `max-h-[60vh]` white sheet with `object-contain`; no fixed 520 px box or `overflow-auto`.
- Settings are inside a native `<details>` panel with a compact summary, 44 px layout/filter buttons, 150 DPI paper sizes, card scale, and a purpose watermark.
- Actions are 48 px; Print, Download PDF and Download PNG are disabled until a front or back image is added. Popup blocking and PDF errors now appear inline instead of failing silently or using `alert`.
- Replaced `URL.createObjectURL` on every render with memoized front/back preview URLs and cleanup.
- Replaced the sample card's real-looking name/ID with obvious "SAMPLE" text and a "NOT A REAL DOCUMENT" label.
- Renamed "anti-fraud" to "purpose watermark" and removed the non-functional "CUSTOM TEXT" preset; the UI states that a watermark discourages casual reuse but does not prevent copying.
- Removed "FOR OFFICIAL USE ONLY" from the watermark presets.
- Moved the single ad below the preview/actions; removed the second ad unit.
- Added a 4-step "How to print CNIC front and back" section, a 100%-scale warning, a NADRA disclaimer, and a link to the image compressor.
- `lib/data/initialData.ts`: replaced the cnicOpt boundary-alignment/true-size/anti-fraud metadata with accurate copy.
- Updated `README.md` and `IMPROVE.md` (I-03, I-06, I-16).

Tests run:
- `npm run typecheck` — PASS.
- `npm run build` — PASS. Next.js 15.5.25; `/cnic-opt` 117 kB first load.
- `npm run dev` — PASS. `/` 200, `/image-opt` 200, `/cnic-opt` 200, `/api/health` 200, unknown route 404. Dev log had no errors.
- Dev HTML audit on `/cnic-opt` — PASS: exactly one H1; new "Add the card images", "Print settings", "Purpose watermark", "Download PDF" and how-to copy present; no "cnic-copy-print-opt engine", "Official Use Only", or "anti-fraud" in the UI.
- The page metadata still contains the word "anti-fraud" until branch 5; that is not in the UI.
- `git diff --check` — PASS.
- `npm run preview` — NOT RUN (no routing/config change; branch 5).
- Manual CNIC flow (sample, front/back upload, every layout/filter/paper/scale/watermark, Print, PDF, PNG, popup-blocked path) — NOT RUN. No browser.
- Lighthouse — NOT RUN. No Chrome/Lighthouse.

Not tested:
- Real preview rendering, filter output, watermark placement, print/PDF/PNG, popup handling, and mobile layout.
- Ad rendering and CLS after the preview.
- The generated sheet footer still says `Prepared with cnic-copy-print-opt | Proprietary tool by Asad Bukhari` because `lib/utils/cnicOptimizer.ts` was not edited. This is visible in PNG/PDF output and needs a follow-up decision.

Docs updated:
- `README.md`, `IMPROVE.md`, `WORKLOG.md`.

Commit/PR:
- Commit: `c6d78cb` — `feat: make the CNIC tool mobile-first`.
- PR: https://github.com/asad-bukhari/photoshop-opt-website/pull/6. Do not merge without approval.

Follow-ups:
- Branch 5: replace the CNIC page title/description (still "anti-fraud"), add the full long-tail content, and decide whether to change the engine footer string.
- Consider debouncing the preview (I-10) and the remaining object URLs in the engine (I-09).

---

## 2026-10-29 — Require a dev-server check and owner deploy

Status: TESTED
Branch: `docs/dev-server-first-rule`

Goal:
- Make local dev-server verification mandatory before commit, and make the owner's production deploy the final step.

What changed:
- `AGENTS.md`:
  - Step 4 (TEST) now requires `npm run dev` for changed routes.
  - Step 8 (VERIFY DEPLOY) now states that the owner runs the final production deploy and agents must not run `npm run deploy`.
  - Added a mandatory "Dev-server check" subsection with the routes, copy checks, dark-class check, log check, 375/1280 browser check, and the honesty rule.
  - Added the dev check to the manual checklist, end-of-session checklist, "When to stop and ask", and the WORKLOG template.
- `CLAUDE.md`: added the dev-server check to the testing note and "Do not run `npm run deploy`; the owner performs the final production deploy."

Tests run:
- Docs-only. No `typecheck`, `build`, or `preview` was run; no application code or config changed.
- `git diff --check` — PASS.
- Fact-check — PASS: the commands and routes match the current scripts and pages.
- The dev server was run on `feature/mobile-first-image-tool`; the result is recorded in that branch's entry. It was not rerun for this docs-only rule.

Not tested:
- Nothing in the runtime; this branch changes rules and docs only.

Docs updated:
- `AGENTS.md`, `CLAUDE.md`, `WORKLOG.md`.

Commit/PR:
- Commit: `55d2709` — `docs: require a dev-server check before deploy`.
- PR: https://github.com/asad-bukhari/photoshop-opt-website/pull/5. Do not merge without approval.

Follow-ups:
- Rebase the open image-tool PR after this rule merges if `AGENTS.md` conflicts.

---

## 2026-10-29 — Mobile-first image tool (redesign step 3)

Status: TESTED
Branch: `feature/mobile-first-image-tool`

Goal:
- Make the image compressor usable on a 360 px phone: upload first, settings second, one clear action, results and download before any ad.
- Remove the unprovable HEIC, AVIF-export, 80%, 25 MB, and strip-EXIF/lossless claims from the image UI.

What changed:
- `components/ImageOptTool.tsx`: rewritten layout. Mobile order is upload, settings + Compress, results + comparison, then one ad, then a 4-step how-to. Desktop uses a 12-column grid with the settings card spanning two rows.
- Removed the dark "img-opt core engine" hero, version badge, rotated "EXIF Stripped" stamp, and the 80% claim.
- Output formats are now JPG, WebP and PNG. AVIF input is accepted when the browser can decode it; AVIF export is not offered.
- Removed the "Strip EXIF" and "Lossless quantization" controls. A short note now says EXIF/GPS is removed automatically by Canvas re-encoding.
- Removed the HEIC and 25 MB claims. The UI states that there is no enforced file-size limit.
- Replaced the fixed 320/400 px comparison with `aspect-[4/3]` mobile / `16/9` desktop and `max-h-[60vh]`; added a focus ring for the slider.
- Added 44 px controls, fieldset/legend for the format group, label/input associations, `aria-pressed` format buttons, a live status region, a visible error message, and descriptive alt text for original, compressed and thumbnail images.
- Results rows are keyboard-selectable buttons with a separate 44 px download button and label.
- Moved the single ad below the results and removed the second ad unit.
- Added a short "How to compress an image" section and a link to the CNIC tool.
- `lib/types.ts`: removed the unused `stripExif` and `lossless` fields.
- Updated `AGENTS.md`, `CLAUDE.md`, and `README.md` for the removed controls and AVIF output.

Tests run:
- `npm run typecheck` — PASS.
- `npm run build` — PASS. Next.js 15.5.25; `/image-opt` 115 kB first load.
- Built HTML audit on `/image-opt` — PASS: exactly one H1; 0 "img-opt core engine", "EXIF Stripped", "Strip EXIF", "Lossless quantization", "HEIC", or "25MB"; format buttons are JPG, WebP, PNG only.
- Metadata still contains "up to 80%" and AVIF until branch 5; that is outside this UI branch.
- Source audit — PASS: no `stripExif`/`lossless` references remain.
- `npm run dev` — PASS. `/` 200, `/image-opt` 200, `/cnic-opt` 200, `/api/health` 200, unknown route 404. Dev log had no errors.
- Dev HTML audit — PASS: `/` has no `class="dark"`; `/image-opt` has the new H1, "Add images", "Optimization settings", and "How to compress an image", with 0 hits for "img-opt core engine", "Strip EXIF", "Lossless quantization", "HEIC", or "25MB".
- `git diff --check` — PASS.
- `npm run preview` — NOT RUN (no routing/config change; branch 5).
- Manual image flow (drop/picker, demo, 20/50/100 KB, presets, slider, download, reset, error path) — NOT RUN. No browser.
- Lighthouse — NOT RUN. No Chrome/Lighthouse.

Not tested:
- Real upload/Canvas processing, target-size accuracy, compare slider touch/keyboard behavior, download, and mobile layout.
- Ad rendering and CLS after the image result.
- AVIF input on a browser that supports it.

Docs updated:
- `AGENTS.md`, `CLAUDE.md`, `README.md`, `IMPROVE.md`, `WORKLOG.md`.

Commit/PR:
- Commit: `72feb3e` — `feat: make the image tool mobile-first`.
- PR: https://github.com/asad-bukhari/photoshop-opt-website/pull/4. Do not merge without approval.

Follow-ups:
- Branch 4: CNIC tool mobile order, responsive preview, settings details, accurate size/watermark copy.
- Branch 5: replace the image page title/description (still "up to 80%", "without quality loss", AVIF export) and add the full long-tail content.

---

## 2026-10-29 — Mobile-first layout (redesign step 2)

Status: TESTED
Branch: `feature/mobile-first-layout`

Goal:
- Replace the double mobile nav, sticky ad, desktop-first footer, and dark-panel home with a one-row mobile header, a menu panel, a 2-column footer, a mobile-first home, and ads that reserve their space.
- Remove the hard-coded "All Systems Active" badge and the false malicious-scanner claim, and make the file-handling modal keyboard accessible.

What changed:
- `components/Header.tsx`: one-row header (56/64 px) with brand + 44 px menu button on mobile; menu panel with Home, Image Compressor, CNIC Photocopy, and "How we handle files"; 44 px desktop nav; removes the second nav row, status badge, theme toggle remnant, scale ruler, and "Proprietary" label. Escape closes the menu and returns focus to the trigger; the menu closes on route change.
- `components/SiteShell.tsx`: skip link to `#main`, `max-w-6xl` container, `min-h-dvh`, and no sticky-ad padding/import.
- `components/Footer.tsx`: light 2-column mobile footer (brand, Tools, Site), 44 px links, no Enterprise/SSL/zero-retention claims; "Not affiliated with NADRA."
- `components/HomeHub.tsx`: mobile-first home with one H1, two honest tool cards, one responsive ad after the cards, a 3-step "How it works", a browser-processing note that names analytics/ads, and native `<details>` FAQ. Removed the "JOB SHEET", "Proprietary", 300 DPI, 80%, AVIF export, and anti-fraud claims from the home page.
- `lib/data/initialData.ts`: replaced the home FAQ with five truthful items (free, no upload, ID-1 usage, target-size range, 150 DPI / about 85 x 53 mm).
- `components/FaqList.tsx`: native `<details>`/`<summary>` accordion; no JS; 44 px summary; content stays in the DOM.
- `components/SecurityModal.tsx`: rewritten as a light bottom sheet on mobile; `aria-labelledby`, focus trap, Escape, focus restore, body scroll lock, 44 px close; removed the scanner claim; copy now names Google Analytics and ads.
- `components/AdBanner.tsx`: lazy by default, 12 px ad label, `scrolling="no"`, unchanged `srcDoc` iframe (no `sandbox`).
- `components/ResponsiveAd.tsx`: reserves 286 px mobile / 126 px desktop so the 250/90 swap cannot shift layout.
- `app/not-found.tsx` and `app/error.tsx`: one H1, 44 px links/buttons, plain copy, no jargon.
- Deleted `components/StickyMobileAd.tsx`.
- Updated `README.md` and `IMPROVE.md` (I-01, I-12, I-18).

Tests run:
- `npm run typecheck` — PASS.
- `npm run build` — PASS. Next.js 15.5.25; `/` 107 kB, `/image-opt` 111 kB, `/cnic-opt` 113 kB first load.
- Built HTML audit on `/` — PASS: exactly one H1; 0 "All Systems Active"; 0 "JOB SHEET"; 0 "Enterprise"; 0 theme toggle; 0 sticky-ad close button; skip link and menu button present.
- Source audit — PASS: no `dark:`/`optipack-theme`/`ThemeToggle`/`StickyMobileAd` in `app`, `components`, or `lib`.
- `git diff --check` — PASS.
- `npm run preview` — NOT RUN. This branch does not change routing, headers, assets, or config; branch 5 will run it for redirects.
- Manual checklist (320/375/768/1280, tap targets, keyboard, OS dark mode, ad rendering, tool flows) — NOT RUN. No browser is installed.
- Lighthouse — NOT RUN. Chrome/Lighthouse are not installed.

Not tested:
- Real-device layout, horizontal overflow, tap-target spacing, menu focus order, modal focus trap in a browser.
- Ad iframe rendering, reserved-space CLS, and the Adsterra network.
- Tool pages still have their old hero ads and claims until branches 3 and 4.

Docs updated:
- `README.md`, `IMPROVE.md`, `WORKLOG.md`.

Commit/PR:
- Commit: `c37f26c` — `feat: rebuild the shell and home for mobile`.
- PR: https://github.com/asad-bukhari/photoshop-opt-website/pull/3. Do not merge without approval.

Follow-ups:
- Branch 3: image tool mobile order, responsive compare, remove toggle/AVIF/HEIC/25 MB claims.
- Branch 4: CNIC tool mobile order, responsive preview, settings details, accurate size/watermark copy.
- Branch 5: `/privacy` and `/terms` links in the footer/header, new slugs, canonical, and the full long-tail content.
- Root metadata still says "Proprietary" and omits analytics/ads; branch 5 fixes it.

---

## 2026-10-29 — Light theme tokens (redesign step 1)

Status: TESTED
Branch: `feature/light-theme-tokens`

Goal:
- Make the site light-only, remove the dark theme and theme switch, and establish a contrast-safe light token set for the later mobile/SEO branches.

What changed:
- `app/globals.css`: new light tokens (`paper #f7f5ef`, `paper-2 #ffffff`, `paper-3 #f1ece2`, `line #e3ded3`, `rule #d8d2c6`, `ink #0f172a`, `ink-soft #475569`, `doc #0b6b4f`, `doc-bright #0f766e`, `doc-soft #e8f3ee`, `gold #8a6400`, `gold-soft #f6ecd8`, `stamp #b91c1c`); `color-scheme: light`; 3 px gold focus ring; removed the dark variant and `.dark body`; removed the unused `ink-2/3/4` and `rule-2` tokens.
- Added `@source not` for root Markdown, `.next`, and `.open-next`. Tailwind was scanning the tracked `.open-next` build output and the docs, which emitted 25 unused `.dark:` utilities into the production CSS. After the exclusion the built CSS contains zero `.dark` selectors.
- `app/layout.tsx`: removed `<html className="dark">`; added the Next.js `viewport` export with `themeColor: '#f7f5ef'` and `colorScheme: 'light'`; fixed the double space in the root description.
- Replaced the dark surface tokens and `dark:` utilities across all components with the light equivalents; converted the hero, tool panels, FAQ, content sheets, legal header, footer, modal, and 404/error surfaces to light.
- Deleted `components/ThemeToggle.tsx`; removed its import/render from the header.
- Fixed light-mode contrast on the image comparison labels, the CNIC rendering overlay, the CNIC PNG button, and the security modal headings.
- Updated `AGENTS.md`, `CLAUDE.md`, and `README.md` to remove the dark-mode/theme-switch rules and the `ThemeToggle` listing.

Tests run:
- `npm run typecheck` — PASS.
- `npm run build` — PASS. Next.js 15.5.25; 7 static pages; `/` 107 kB first load, `/image-opt` 111 kB, `/cnic-opt` 113 kB.
- Built CSS audit — PASS: 0 `.dark` selectors (file `583f2ca17f15e863.css`, 38,988 bytes).
- Built HTML audit — PASS: no `class="dark"`, `theme-color` is `#f7f5ef`, `color-scheme` is `light`.
- Source audit — PASS: `grep -rn "dark:\|className=\"dark\"\|optipack-theme\|@custom-variant dark" app components lib` returns 0.
- `git diff --check` — PASS.
- `npm run preview` — NOT RUN. This branch does not change routing, headers, assets, or dependencies; branch 5 will run it for redirects.
- Manual checklist (320/375/768/1280 widths, tap targets, OS dark-mode emulation, tool flows) — NOT RUN. No browser is installed in this environment.
- Lighthouse — NOT RUN. Chrome/Lighthouse are not installed.

Not tested:
- Visual appearance on a real phone or desktop browser.
- OS dark-mode emulation in DevTools.
- Any tool flow (no logic changed).
- Cloudflare/OpenNext preview and deploy.

Docs updated:
- `AGENTS.md`, `CLAUDE.md`, `README.md`, `IMPROVE.md`, `WORKLOG.md`.

Commit/PR:
- Commit: `8d6f439` — `feat: switch to a light-only theme`.
- PR: https://github.com/asad-bukhari/photoshop-opt-website/pull/2. Do not merge without approval.

Follow-ups:
- Branch 2: mobile-first header/footer/home/shell and ad placement.
- Branch 5/6: create the light OG images and icon; they do not exist on `main` and were not part of this branch.
- Manual visual and contrast checks on a real browser.

---

## 2026-10-29 — Mobile-first, light-only redesign and SEO plan

Status: IN PROGRESS (approved; implementation split into seven branches)
Branch: not created yet (see Blockers; the working tree is dirty on `main`)

Goal:
- Redesign the public site mobile-first and light-only, remove dark mode, and make the page names, titles, headings, and copy accurate and search-friendly.
- Keep the Canvas engines in `lib/utils/*` untouched. This is a UI, layout, content, and metadata task.

Scope guardrails:
- Do not change processing logic, the Adsterra `srcDoc`/no-sandbox approach, the jsPDF CDN, the GA literal script, `output: "standalone"`, the `build` script, the `NODE_OPTIONS` flags, or the Worker name `optipack-portal`.
- Do not add dependencies, fonts, or third-party scripts.
- No code comments.

### Blockers found before planning

These must be resolved before any implementation branch is created.

1. **The working tree is not clean on `main`.** There is a large staged changeset (privacy, terms, sitemap, robots, OG images, JSON-LD, content sheets, redirect template) plus modified `.open-next/*` build output and an unstaged change to `app/layout.tsx` that adds a Google AdSense script (`ca-pub-7666939548584268`). Editing on `main` is against `AGENTS.md`, and committing the tree as-is would mix unrelated work.
2. **The AdSense script is an unapproved third-party script.** It is unstaged, not documented, and overlaps Adsterra. It must be removed or explicitly approved and documented before `app/layout.tsx` is committed.
3. **`git diff --check` currently fails** on tracked `.open-next/server-functions/default/handler.mjs` trailing whitespace. Source files are clean. This is build output; see `IMPROVE.md` I-17.
4. **`npm run typecheck` passes** on the current working tree (verified 2026-10-29). No implementation has started.
5. **No browser or Lighthouse is installed** in this environment. Local Lighthouse is not possible without installing Chrome/Lighthouse (needs approval). PageSpeed Insights can be run on the deployed URL after merge.

### A. Audit of the current code

#### A1. Dark mode

| Area | File / line | Finding |
| --- | --- | --- |
| Root class | `app/layout.tsx:53` | `<html lang="en" className="dark">` forces the dark look before paint. |
| Theme variant | `app/globals.css:3` | `@custom-variant dark (&:where(.dark, .dark *));` |
| Dark body | `app/globals.css:42-44` | `.dark body { @apply bg-ink text-paper; }` |
| Theme switch | `components/ThemeToggle.tsx:7,10,13,19` | Defaults to dark, reads/writes `localStorage['optipack-theme']`, toggles `.dark` in an effect. |
| Header usage | `components/Header.tsx:7,91` | Imports and renders `ThemeToggle`. |
| `dark:` classes | 196 occurrences in 11 files | `CnicOptTool` 53, `ImageOptTool` 51, `Footer` 26, `HomeHub` 26, `Header` 17, `ThemeToggle` 6, `LegalPage` 5, `StickyMobileAd` 5, `AdBanner` 3, `error` 2, `not-found` 2. |
| Always-dark panels | `HomeHub.tsx:13,150`, `ImageOptTool.tsx:148,371`, `CnicOptTool.tsx:303,564`, `SecurityModal.tsx:14-15`, `ContentSheet.tsx:5`, `FaqList.tsx:9`, `LegalPage.tsx:12`, `Footer.tsx:13` | Hero, tool preview, FAQ/content, modal, and footer are dark by design (`bg-ink-*`, `text-paper`) even in light mode. |
| OG images | `lib/ogImage.tsx:21` | OG cards use the dark `#0b0e13` background. |
| Icon | `app/icon.svg` | Dark background square. |

Sections that need a light redesign: home hero, home tool cards, home FAQ, both tool headers, image comparison panel, CNIC preview panel, content sheets, FAQ list, security modal, footer, legal page header, 404/error, OG images, icon.

#### A2. Mobile problems

| Area | File / line | Finding |
| --- | --- | --- |
| Double navigation | `Header.tsx:49-70` (desktop nav hidden below `lg`) and `Header.tsx:95-113` (second mobile nav row) | Two stacked nav rows on mobile; the top row also holds status, lock, and theme controls. |
| Header height | `Header.tsx:26` | Fixed `h-16` (64 px) plus a ~36 px sub-nav = ~100 px before content. |
| Sticky ad overlap | `SiteShell.tsx:13` (`pb-16`), `StickyMobileAd.tsx:16` (`fixed inset-x-0 bottom-0 z-50`) | The 320x50 bar covers the bottom of the viewport and the last content. Its close button is 24x24 px (`StickyMobileAd.tsx:17-23`). |
| Fixed CNIC preview | `CnicOptTool.tsx:575` | `h-[520px]` with `overflow-auto`; on a 360x640 phone the preview alone is taller than the visible area. |
| Fixed compare view | `ImageOptTool.tsx:390` | `h-[320px] md:h-[400px]`; can overflow narrow screens and is taller than needed. |
| Tap targets | `Header.tsx:82-89` (32 px lock), `ImageOptTool.tsx:476-485` (32 px download), `CnicOptTool.tsx` controls, `AdBanner.tsx:38` label, `StickyMobileAd.tsx:17-23` (24 px close) | Many controls are below 44x44 px. |
| Small text | 58 matches for `text-[9px]`/`[10px]`/`[11px]` and fixed heights | Labels, nav, status, ad label, and helper text are 9-11 px. Body copy is often 12 px (`text-xs`). |
| Desktop-first grids | `ImageOptTool.tsx:182`, `CnicOptTool.tsx:337` | `grid-cols-1 lg:grid-cols-12`; the two-column tool layout only starts at 1024 px. Home cards start at `md` (`HomeHub.tsx:43`). |
| Footer grid | `Footer.tsx:15` | `grid-cols-1 md:grid-cols-4`; mobile gets a long single column. |
| Horizontal scroll risk | `CnicOptTool.tsx:575` (`overflow-auto`), long mono strings, fixed-width ad units | Needs a real 320 px check after redesign. |
| Layout shift | `ResponsiveAd.tsx:13-28`, `ImageOptTool.tsx:370-426`, `CnicOptTool.tsx:583-588` | The ad placeholder swaps 250 px to 90 px after hydration; result images have no width/height, so the page grows when a result appears. |
| Ads before the tool | `HomeHub.tsx:40`, `ImageOptTool.tsx:179`, `CnicOptTool.tsx:334` | A responsive ad sits between the heading and the tool. On mobile the main action can be pushed below the fold. |

#### A3. SEO problems

| Area | File / line | Finding |
| --- | --- | --- |
| Nav labels | `Header.tsx:12-13` | `image-optimation`, `cnic-copy-print-opt` are code-style names, and "optimation" is a typo. |
| Jargon in copy | `HomeHub.tsx:20,158`, `ImageOptTool.tsx:159`, `CnicOptTool.tsx:314`, `Footer.tsx:27-28,40,113`, `initialData.ts:4` | "JOB SHEET", "Proprietary tech", "img-opt core engine", "cnic-copy-print-opt engine", "Enterprise Tools", "Portal Enterprise Suite", "Zaibi Tools Enterprise". |
| Typos / double spaces | `SecurityModal.tsx:32` ("compression  and"), `SecurityModal.tsx:19`, `initialData.ts` | Fix all visible copy. |
| Titles / descriptions | `image-opt/page.tsx:9-25`, `cnic-opt/page.tsx:9-25`, `layout.tsx:28-47` | "Proprietary", "without quality loss", "up to 80%", "true-size 300 DPI", "anti-fraud" are unproven or wrong. |
| H1 | `HomeHub.tsx:24`, `ImageOptTool.tsx:163`, `CnicOptTool.tsx:318` | One H1 per page is correct, but the H1s are jargon-heavy and the tool H1 sits inside a dark hero. |
| Heading order | `ContentSheet.tsx`, `FaqList.tsx` | H2 sections then H3 questions is correct; keep it. |
| Sitemap / robots | `app/sitemap.ts`, `app/robots.ts` | They exist only in the staged changes; `sitemap.ts:6` uses `new Date()` on every request, so `lastmod` changes constantly. |
| Canonical | Page files | Exists in staged work; must move with the new URLs. |
| OG / Twitter | `app/opengraph-image.tsx`, per-page OG files | Exists only in staged work; dark design; claims 300 DPI and "Up to 80%". No `twitter-image` (X falls back to `og:image`). |
| JSON-LD | `lib/schema.ts`, `app/*/page.tsx` | Exists only in staged work. `SoftwareApplication` has no rating/review, so it is not eligible for the Google software-app rich result. `FAQPage` is included although Google removed FAQ rich results in May 2026. |
| Internal links | Content sheets | No links between the two tools and no link to privacy from the tool content. |
| Image alt text | `ImageOptTool.tsx:391,398,457`, `CnicOptTool.tsx:367,394,586` | Generic "Original", "Optimized", "thumbnail", "Front", "Back", "A4 CNIC print sheet". |
| Privacy claim | `HomeHub.tsx:31`, `Footer.tsx:33,104-106`, `SecurityModal.tsx:30-34`, `initialData.ts:87` | "Files never leave your device" is true of the tool but omits that GA and third-party ads load. The claim must say both. |
| Sitemap `lastModified` | `app/sitemap.ts:6` | `new Date()` on every request; use a fixed date or real per-page dates. |
| Schema injection | `components/JsonLd.tsx` | Static data today, but stringify without escaping `<`; escape it to be safe. |
| Redirects | `next.config.ts` | No redirects yet. Next's `permanent: true` returns 308, not 301; use `statusCode: 301` to meet the requirement. |

### B. Research summary (observed 2026-10-29)

No search volumes are claimed. Query demand below comes from Google Autocomplete suggestions for Pakistan (`gl=pk`, `hl=en`) and DuckDuckGo result pages, both observed on 2026-10-29. Autocomplete shows query variants, not traffic.

#### B1. What people search for

| Query family | Observed variants (Pakistan) | Intent |
| --- | --- | --- |
| Compress image to a KB limit | "compress image to 20kb", "compress image to 20kb online free", "compress image to 50kb", "compress image to 100kb", "compress image to 100kb passport size", "image compressor 20kb to 50kb", "resize image to 20kb 600*800" | Transactional, immediate. Users have a hard upload limit (job, visa, exam, government form) and want the file under it now. |
| CNIC front and back | "cnic front and back in one page", "cnic front and back merge online", "cnic front and back print online", "cnic front and back picture" | Transactional. Users want one printable page, often from a phone, for a bank, visa, or job form. |
| CNIC photocopy | "cnic photocopy online", "cnic photocopy maker", "cnic photocopy size", "cnic photocopy size in inches", "nadra cnic photocopy online" | Transactional plus informational: correct size, legitimacy, and how to print. |
| Passport / ID photo | "passport photo size in pakistan", "passport photo size in pixels", "passport photo size in inches", "passport photo size maker" | Informational at first, then transactional. |
| WebP conversion | "webp converter to jpg", "webp converter to png", "webp converter bulk", "webp converter and compressor" | Transactional. Conversion and compression are often the same job. |

Implications: the image page should own "compress to 20/50/100 KB" in its title, H1, and body, not only "batch optimization". The CNIC page should use "photocopy" and "front and back on one A4 page" language. The tool must be usable on a phone in one thumb reach.

#### B2. What the likely ranking pages do

| Page | URL / title pattern | What it does |
| --- | --- | --- |
| Toolsy Hub ID card copy | `/tools/id-card-copy`; H1 "ID Card Copy"; "CNIC front and back on one A4 page" | Tool above the fold, actual size 85.6 x 54 mm, PDF/JPG, crop/rotate, short how-to, FAQ, sources, related tools, phone-first copy. |
| BolPakistan CNIC | `/cnic`; H1 about printing both sides on one page | Tool first, then a very long page of unrelated MCQ links. Relevant tool, poor page focus. |
| ResizePixel 20 KB | `/en/compress-image-to-20-kb`; title matches the query exactly | Exact-intent URL, tool first, minimal copy. |
| OnlineMiniTools 20 KB | `/image-compressor/compress-image-to-20kb` | Exact-intent URL, mentions passport photos, exam forms, job portals. |
| BulkImage 20 KB | `/compress-image-to-20kb` | Says "process JPG, PNG or WebP locally in your browser" and shows real output size. |
| iLoveIMG | `/compress`; H1 "Compress Image" | Broad tool page, very fast, no size-specific URL. |

Common pattern: keyword slug, title/H1 matching the job, tool above the fold, a short how-to, an FAQ, and related tools. Exact-size URLs are common, but one well-written page can cover 20/50/100 KB with separate H2s and a target-size control.

Our own `/cnic-opt` currently appears second in DuckDuckGo for `cnic front and back in one page print` with the title "CNIC Front & Back A4 Print Optimizer" (observed 2026-10-29). That is a real ranking to protect when changing the URL.

#### B3. Current Google guidance

- Titles: every page needs a unique, descriptive, concise `<title>`. Google truncates by device width, not a fixed character count. Avoid keyword stuffing and boilerplate. Google may use the H1 or other prominent text if the title is weak. Source: Google, "Influencing your title links", last updated 2025-12-10, https://developers.google.com/search/docs/appearance/title-link
- Mobile-first indexing: Google indexes and ranks the mobile version. Mobile and desktop must have equivalent content, headings, metadata, structured data, and alt text. Ads must not harm the mobile page. Source: Google, "Mobile site and mobile-first indexing best practices", last updated 2025-12-10, https://developers.google.com/search/docs/crawling-indexing/mobile/mobile-sites-mobile-first-indexing
- SEO basics: descriptive URLs, unique helpful content, good link text, descriptive alt text, sitemaps, and avoiding distracting ads. Source: Google SEO Starter Guide, https://developers.google.com/search/docs/fundamentals/seo-starter-guide (retrieved 2026-10-29)
- Structured data: `SoftwareApplication` rich results require `name`, `offers.price`, and a rating or review. We have no legitimate ratings, so we must not add fake ones; the markup can still describe the app but will not produce a rich result. Source: Google, "Software app (SoftwareApplication) structured data", last updated 2026-09-08, https://developers.google.com/search/docs/appearance/structured-data/software-app
- FAQ rich results were deprecated: "This feature will no longer appear in Google Search starting May 7, 2026." The documentation was removed on 2026-06-15. Source: Google Search Central documentation updates, https://developers.google.com/search/updates
- Breadcrumbs appear on desktop search results, not mobile (January 2025 update). `BreadcrumbList` is still valid markup, but do not expect a mobile breadcrumb rich result.
- Core Web Vitals: LCP <= 2.5 s, INP <= 200 ms, CLS <= 0.1 at the 75th percentile. Source: web.dev, "Web Vitals", last updated 2024-10-31, https://web.dev/articles/vitals
- Tap targets: WCAG 2.2 SC 2.5.8 (AA) requires at least 24x24 CSS px or sufficient spacing; 44x44 is the enhanced/best-practice target used in this plan. Source: W3C WAI, "Understanding SC 2.5.8 Target Size (Minimum)", updated 2026-05-11, https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
- Tailwind is mobile-first: unprefixed utilities apply to all sizes, `sm:`/`md:`/`lg:` only add changes at and above the breakpoint. Source: Tailwind CSS v4.3 "Responsive design", https://tailwindcss.com/docs/responsive-design (retrieved 2026-10-29)

#### B4. Next.js 15 App Router SEO features

- `metadata` / `generateMetadata` for title, description, canonical, OG, Twitter; `metadataBase` makes relative URLs absolute. Metadata merges shallowly; a child `openGraph` replaces the parent's. Source: Next.js "generateMetadata", last updated 2026-08-19, https://nextjs.org/docs/app/api-reference/functions/generate-metadata
- `app/sitemap.ts` returns `MetadataRoute.Sitemap`; `app/robots.ts` returns `MetadataRoute.Robots`; file-based `opengraph-image.tsx` generates OG images and adds the tags. Source: Next.js "sitemap.xml", last updated 2026-08-18, https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
- `redirects()` in `next.config.ts`; `permanent: true` uses 308. To return 301, use `statusCode: 301` (do not combine with `permanent`). Source: Next.js "redirects", last updated 2026-06-30, https://nextjs.org/docs/app/api-reference/config/next-config-js/redirects
- `metadata.themeColor` and `metadata.colorScheme` are deprecated in favor of the `viewport` export, which is how the light `theme-color` and `color-scheme` will be set.

### C. The plan

#### C1. Design direction (light only)

Palette: keep the existing token names where possible. Remove the `ink-2/3/4` and `rule-2` dark-surface tokens once no component uses them.

| Token | New value | Use | Contrast |
| --- | --- | --- | --- |
| `paper` | `#f7f5ef` | Page background | base |
| `paper-2` | `#ffffff` | Cards, header, modal | base |
| `paper-3` | `#f1ece2` | Subtle fills, inputs | base |
| `line` | `#e3ded3` | Default borders | decorative |
| `rule` | `#d8d2c6` | Stronger rules, print marks | decorative |
| `ink` | `#0f172a` | Primary text | 16.4:1 on paper |
| `ink-soft` | `#475569` | Secondary text | 7.0:1 on paper |
| `doc` | `#0b6b4f` | Primary buttons, links | 6.0:1 on paper; white on it 6.5:1 |
| `doc-bright` | `#0f766e` | Link hover, small accents | 5.0:1 on paper |
| `gold` | `#8a6400` | Accent text/rules; white text on gold is 5.4:1 | 4.9:1 on paper |
| `gold-soft` | `#f6ecd8` | Gold tint background | new token |
| `doc-soft` | `#e8f3ee` | Green tint background | new token |
| `stamp` | `#b91c1c` | Errors, destructive | 5.9:1 on paper |

Rules: no raw hex in components; no `dark:` classes; `:root { color-scheme: light; }`; `focus-visible` 3 px `gold` outline with 2 px offset; `::selection` gold-soft/ink; no heavy `shadow-2xl`; one soft shadow on cards only.

Type scale (mobile first):
- Body 16 px / 1.6; secondary 14 px / 1.5; minimum visible text 12 px, only for uppercase mono labels, never body.
- H1 30 px / 1.15, `sm` 36 px, `lg` 48 px.
- H2 22 px / 1.25, `sm` 28 px.
- H3 18 px.
- Buttons 16 px semibold; inputs 16 px (prevents iOS zoom); labels 14 px.

Spacing: 4/8/12/16/24/32/48/64; page padding 16 px, `sm` 24 px, `lg` 32 px; container `max-w-6xl`; section gap 32-48 px; card padding 16-24 px; card radius 12 px; button/input radius 8 px; min height 44 px.

Document / print identity, kept but lightened: thin rules, small mono labels, corner marks used on 1-2 panels only, a "sheet" card with a white surface and a 1 px rule. Remove the rotated "Proprietary", "Official Use Only", "SSL Secure", "All Systems Active", and stamp-like decoration that implies official status.

Page-by-page at 360 px first:

| Page / part | 360 px | Tablet (768) | Desktop (1024+) |
| --- | --- | --- | --- |
| Header | 56-64 px single row: logo + "Menu" button. Menu opens a panel with Home, Image Compressor, CNIC Photocopy, Privacy, Terms, each 44 px tall. No second nav row. | Same header; nav can show inline from `md`. | Logo + inline nav + "How we handle files" link. |
| Home | H1, 2-sentence intro, two stacked tool cards, one ad after the cards, 3-step "How it works", privacy note, FAQ in native `<details>`, footer. | Tool cards 2-up; ad leaderboard after cards. | Tool cards 2-up with more detail; leaderboard; two-column FAQ optional. |
| Image tool | H1/intro, upload dropzone, format/size/preset controls, full-width "Compress images" button, results + comparison, download, then one ad, then how-to/FAQ. No ad before the upload. | 2-column: controls left, upload/results right. | 12-column: controls 4, upload/results 8; second ad below results. |
| CNIC tool | H1/intro, front/back upload, sample button, collapsible settings (closed by default), A4 preview, Print/PDF/PNG buttons, then one ad, then how-to/FAQ. | 2-column: upload/settings left, preview/actions right. | 5/7 split; second ad below actions. |
| Footer | 2-column link lists (Tools, Legal), then brand/contact, then a one-line copyright. No 4-column desktop grid only. | 3-4 columns. | 4 columns. |
| Security modal | Full-width sheet, scrollable, close 44 px, Escape closes, focus trapped and restored. | Centered max-w-lg. | Same. |
| 404 / error | One H1, one sentence, two 44 px links (Home, Image Compressor). | Same. | Same. |

Remove:
- `components/ThemeToggle.tsx` (delete the file).
- Every `dark:` class (196 occurrences).
- `@custom-variant dark`, `.dark body`, `<html className="dark">`.
- `optipack-theme` localStorage reads/writes. No theme storage remains.
- `StickyMobileAd.tsx` (recommended; see DECISIONS).
- `ink-2`, `ink-3`, `ink-4`, `rule-2` tokens after replacement.
- Add `color-scheme: light` and `viewport.themeColor = '#f7f5ef'`, `colorScheme: 'light'`.

Tool logic stays untouched: `lib/utils/imageOptimizer.ts` and `lib/utils/cnicOptimizer.ts` are not edited.

#### C2. Mobile-first rules for the build

- Base classes target 320-375 px. Add `sm:`/`md:`/`lg:` only to enhance. Never use `sm:` for the mobile layout.
- Minimum 44x44 px for every interactive target (links in a sentence excepted). Inputs and selects min-height 44 px and 16 px text.
- Body text 16 px; secondary 14 px; no visible text below 12 px; 12 px only for non-essential mono labels.
- No horizontal scroll at 320 px. Replace fixed heights with `aspect-ratio`, `min-h`, `max-h` + `dvh`/`vh`. Use `min-w-0`, `break-words`, and `overflow-wrap:anywhere` on long mono strings. Verify `document.documentElement.scrollWidth <= window.innerWidth` at 320/375/414.
- One mobile header row + a menu panel. No stacked double nav. Primary tool actions are full-width and within thumb reach; no sticky action bar that covers content.
- Tool order guarantees the main action is reachable before any ad: upload -> settings -> primary button -> result/download -> ad.
- Ads: keep the existing Adsterra `srcDoc` iframes, no `sandbox`, keys in `lib/data/ads.ts`. Only change placement and reserve space. One unit on mobile, at most two on desktop. No sticky bar. Label at 12 px. Keep ads at least 24 px away from buttons.
- Reserve exact ad height including the label (see C2 ad plan) so the unit cannot shift layout. Use `loading="lazy"` below the fold.
- Use native `<details>` for FAQ and advanced settings; content stays in the DOM for indexing.
- Safe areas: add `padding-bottom: env(safe-area-inset-bottom)` on the footer and on any bottom action bar. If no sticky bar, the footer still gets the inset.
- Test with keyboard only: skip link, tab order, visible focus, Escape closes the menu/modal, focus returns to the trigger.
- Respect `prefers-reduced-motion` (already in `globals.css`).

Ad placement plan:

| Page | Mobile (<= 767 px) | Desktop (>= 768 px) |
| --- | --- | --- |
| Home | One 300x250 after the two tool cards; reserved 250 px + 20 px label + 12 px gap. | 728x90 leaderboard after the tool cards; one 300x250 after the FAQ if it does not push content too far. |
| Image tool | One 300x250 after the result/download block; reserved space; lazy. | 728x90 below the results; optional 300x250 in the left column below the controls (sticky-free). |
| CNIC tool | One 300x250 after Print/PDF/PNG; reserved space; lazy. | 728x90 below the actions; optional 300x250 below the settings column. |
| Sticky bar | Removed. | Not applicable. |

Do not add new ad scripts, networks, or keys. Keep `AD_NETWORK_DOMAIN` and the three existing units.

#### C3. SEO plan

##### C3.1 URLs and navigation labels

| Page | Option A (recommended) | Option B | Recommendation and reason |
| --- | --- | --- | --- |
| Image tool | `/image-compressor` — nav "Image Compressor" | `/compress-image` — nav "Compress Image" | A. "image compressor" is the noun users type and matches the broad 20/50/100 KB intent; one page can cover all target sizes. `/compress-image` is also good but narrower as a page name. |
| CNIC tool | `/cnic-photocopy` — nav "CNIC Photocopy" | `/cnic-print` — nav "CNIC Print" | A. "cnic photocopy online", "cnic photocopy maker", and "cnic front and back in one page" are the observed queries; "photocopy" carries the copy intent. B is shorter and closer to "cnic print", but less specific. |
| Home | `/` — nav "Home" | keep `/` | Keep. |
| Privacy / Terms | `/privacy`, `/terms` | keep | Keep. |

URL change rules: 301 from `/image-opt` to `/image-compressor` and from `/cnic-opt` to `/cnic-photocopy` in `next.config.ts` using `statusCode: 301` (Next's `permanent: true` is 308). Update canonical, OG URLs, sitemap, Header, Footer, content links, and JSON-LD. Verify with `curl -sI` in `npm run preview`. Keep the redirects indefinitely. Resubmit the sitemap in Search Console after deploy.

##### C3.2 Exact metadata and page copy

Home (`/`):

- Title: `Zaibi Tools — Image Compressor & CNIC Print Tool` (50 chars)
- Description: `Compress images to 20KB, 50KB or 100KB and print CNIC front and back on one A4 page. Free tools that run in your browser.` (130 chars)
- H1: `Compress images and print CNIC copies in your browser`
- Intro: `Zaibi Tools has two free tools: an image compressor for JPG, PNG and WebP files, and a CNIC print tool that puts the front and back of an ID card on one A4 page. Both run in your browser.`
- H2 outline: `Two tools, one page`; `Popular tasks`; `How it works`; `Why the tools run in your browser`; `Common file-size limits`; `Frequently asked questions`
- `Popular tasks` links: `Compress an image to 20KB`, `Compress an image to 50KB`, `Compress an image to 100KB`, `Print CNIC front and back on A4`, `Make a CNIC photocopy PDF`, `Convert PNG to WebP`. Use descriptive anchor text and link to the matching tool section. Do not create separate pages for each task.
- Image alt text: the logo mark is decorative (`aria-hidden`); the two tool-card icons are decorative. There are no content images on the home page.

Image tool (`/image-compressor`):

- Title: `Image Compressor to 20KB, 50KB or 100KB | Zaibi Tools` (56 chars)
- Description: `Compress JPG, PNG or WebP images to 20KB, 50KB, 100KB or a custom size. Convert to WebP and remove EXIF location data in your browser.` (140 chars)
- H1: `Compress an image to 20KB, 50KB or 100KB`
- Intro: `Choose a target size, upload one or more images, and download the compressed files. Processing happens in your browser; the tool does not upload your images.`
- H2 outline: `How to compress an image`; `Compress a JPG to 20KB, 50KB or 100KB`; `Compress a PNG to 20KB`; `Compress several images at once`; `Compress an image for a job, visa or exam form`; `Convert PNG to WebP or WebP to JPG`; `Remove EXIF location data`; `Resize for Instagram and passport photos`; `Where your files go`; `Frequently asked questions`
- H3 long-tail subsections:
  - Under `Compress a JPG to 20KB, 50KB or 100KB`: `Compress a photo to 20KB`, `Compress a photo to 50KB`, `Compress a photo to 100KB`, `Compress to 200KB or 1MB`.
  - Under `Compress a PNG to 20KB`: `Why PNG ignores the target size`, `Convert PNG to JPG or WebP to hit a KB limit`.
  - Under `Compress several images at once`: `Batch select images`, `Process images one at a time`.
  - Under `Compress an image for a job, visa or exam form`: `JPG or WebP for an upload form`, `Check the result before you submit`.
  - Under `Convert PNG to WebP or WebP to JPG`: `PNG to WebP`, `WebP to JPG`, `JPG to WebP`.
  - Under `Resize for Instagram and passport photos`: `Passport photo 600x600 px`, `Instagram 1080x1080`, `Instagram Story 1080x1920`, `LinkedIn banner 1584x396`.
- H2 body points:
  - How to: upload, choose format, set target KB, compress, download.
  - Target size: the engine lowers quality and, if needed, resolution until the output fits or reaches the smallest size it can produce. PNG ignores the target (lossless).
  - WebP: choose WebP for smaller web files; AVIF export is not offered because browser AVIF encoding is unreliable and the current fallback writes WebP bytes (see Claims).
  - EXIF: Canvas re-encoding drops EXIF/GPS automatically; no separate switch.
  - Presets: Instagram 1080x1080, Story 1080x1920, LinkedIn 1584x396, passport 600x600, e-commerce 800x800; presets crop to fill.
  - Privacy: the tool does not upload files; the site loads analytics and ads.
  - PNG: the PNG export is lossless and ignores the target size. To reach 20/50/100 KB, choose JPG or WebP instead. This is the honest answer for the "compress PNG to 20KB" query.
  - Custom pixels: the tool offers presets, not arbitrary width/height fields. Do not claim a 600x800 resize unless that UI is added.
- Image alt text:
  - Original comparison image: `Original version of {file name}`
  - Optimized comparison image: `Compressed {format} version of {file name}`
  - Result thumbnail: `Compressed preview of {file name}`
  - Demo: `Sample gradient image used for the compression demo`
- FAQ:
  1. `How do I compress an image to 20KB?` — `Upload a JPG, PNG or WebP image, set Target file size to 20 KB, then select Compress images. The tool lowers quality and, if needed, resolution until the file fits the target or reaches the smallest output it can produce.`
  2. `Can I compress an image to 50KB or 100KB?` — `Yes. Enter 50 or 100 in the target size field. You can enter any target from 1 to 10,240 KB, and the result depends on the image content and output format.`
  3. `Does compression remove EXIF GPS data?` — `Yes. The browser re-encodes the image through the Canvas API, which drops EXIF metadata such as GPS coordinates, camera model and timestamps. The tool does this automatically; there is no separate switch.`
  4. `Can I convert PNG to WebP?` — `Yes. Choose WebP as the output format. WebP is usually smaller than PNG at a similar visual quality. This tool exports JPG, PNG or WebP; it does not export AVIF.`
  5. `Is there a file size limit?` — `The tool does not enforce a file size limit. Very large images can be slow or run out of memory on a phone, so resize unusually large files before uploading.`
  6. `Are my images uploaded?` — `No. The tool decodes and re-encodes each image in your browser and does not send the file to a server. The site itself loads Google Analytics and third-party ads; see the privacy policy.`
  7. `Can I resize an image for Instagram or a passport photo?` — `Yes. Choose a preset: Instagram square 1080x1080, Instagram story 1080x1920, LinkedIn banner 1584x396, passport photo 600x600, or e-commerce thumbnail 800x800. Presets crop the image to fill the frame.`
  8. `Can I compress a PNG to 20KB?` — `Not with the PNG export, because PNG is lossless and ignores the target size. To reach 20 KB, choose JPG or WebP, which re-encode the image and can reduce the file size.`
  9. `Can I compress an image to 20KB without losing quality?` — `At very small sizes, some quality loss is usually unavoidable, especially for large photos. Use the comparison slider to check the result; the tool lowers quality and resolution only as needed to approach the target.`
  10. `Can I convert WebP to JPG?` — `Yes. Upload a WebP image and choose JPG as the output format. The browser decodes the WebP file and re-encodes it as JPG.`
  11. `Can I compress several images at once?` — `Yes. Select multiple files at once. They are processed one at a time in your browser, and each result is listed with its before and after size.`
  12. `Can I choose an exact pixel size such as 600x800?` — `The tool offers presets rather than free width and height fields. The available presets are original, Instagram square 1080x1080, Instagram story 1080x1920, LinkedIn banner 1584x396, passport 600x600 and e-commerce 800x800.`

CNIC tool (`/cnic-photocopy`):

- Title: `Print CNIC Front and Back on One A4 Page | Zaibi Tools` (56 chars)
- Description: `Put CNIC front and back on one A4 page at card size. Choose a layout, improve a phone photo, add a watermark, then print or save PDF.` (140 chars)
- H1: `Print CNIC front and back on one A4 page`
- Intro: `Upload a photo or scan of each side. The tool places both sides on a card-sized sheet, lets you adjust the layout and filter, and exports a print-ready PDF or PNG.`
- H2 outline: `How to print CNIC front and back on A4`; `CNIC photocopy size in mm, cm and inches`; `CNIC front and back on one page as PDF`; `Print CNIC on A4 at home`; `Print 2 or 4 copies on one sheet`; `CNIC copy for a bank, visa or job form`; `CNIC photocopy without Photoshop or Word`; `Improve a phone photo`; `Where your files go`; `Frequently asked questions`
- H3 long-tail subsections:
  - Under `CNIC photocopy size in mm, cm and inches`: `CNIC size in pixels at 150 DPI`, `Why the print scale matters`, `Check the size with a ruler`.
  - Under `CNIC front and back on one page as PDF`: `Merge front and back into one PNG`, `Save the sheet as PDF`.
  - Under `Print 2 or 4 copies on one sheet`: `Dual copy`, `Quad copy`, `Pakistani grid layout`.
  - Under `CNIC copy for a bank, visa or job form`: `Bank verification watermark`, `Visa and passport watermark`, `Job application copy`.
  - Under `CNIC photocopy without Photoshop or Word`: `Use your phone`, `No software install`, `Works in the browser`.
- H2 body points:
  - How to: upload front and back, keep A4 + centered stacked, check scale, print or download.
  - Size: ID-1 is 85.60 x 53.98 mm = 8.56 x 5.40 cm = 3.37 x 2.13 inches; the tool draws each card at about 84.7 x 53.3 mm (500x315 px at 150 DPI) on A4. Print at 100%, not "fit to page"; check with a ruler.
  - PDF/PNG: the PDF contains the sheet; the PNG is a single image. The tool does not export JPG for the CNIC sheet.
  - Layouts: centered stacked, side-by-side, dual copy, quad copy, Pakistani grid. Dual and quad are fixed 2/4 sets; the Pakistani grid repeats as many rows as fit the page.
  - Phone photo: no automatic crop, straighten, or boundary detection; crop in the phone editor first. The tool fits the whole image into the frame, which can stretch a non-standard aspect ratio.
  - Watermark: visible purpose text drawn into the sheet; it is off by default, can be removed by turning it off, and discourages casual reuse but does not prevent copying.
  - Other cards: any ID-1-proportioned card can be placed in the frames, including a driving licence or bank card; check the printed size against the real card.
  - Privacy: the tool does not upload files; the site loads analytics and ads.
  - Not affiliated with NADRA; use only with lawful authority.
- Image alt text:
  - Front thumbnail: `Selected front side of the ID card`
  - Back thumbnail: `Selected back side of the ID card`
  - Preview: `Preview of the {paper size} sheet with the front and back of the ID card`
  - Sample: `Sample ID card front used for the demo`
- FAQ:
  1. `How do I print CNIC front and back on one A4 page?` — `Upload a photo or scan of each side, keep the Centered stacked layout and A4 paper, then choose Print, Download PDF or Download PNG. The sheet places both sides in card-sized frames.`
  2. `What is the correct CNIC size?` — `A Pakistani CNIC uses the ID-1 card format, 85.60 x 53.98 mm. This tool draws each card at about 85 x 53 mm on an A4 page at 150 DPI. Print at 100% scale and check the result with a ruler before you submit it.`
  3. `Can I print 2 or 4 copies on one sheet?` — `Yes. Choose Dual copy for two sets or Quad copy for four sets. The Pakistani grid layout fills the page with repeated rows and exports a two-page PDF.`
  4. `Can I add a watermark?` — `Yes. Turn on the watermark, choose a preset such as FOR BANK ACCOUNT VERIFICATION ONLY, and set the opacity. The text is drawn onto the sheet before export.`
  5. `Does the tool straighten or crop my photo?` — `No. It fits the whole image into a fixed card frame, so a photo taken at an angle or with extra background is not straightened or cropped. Crop the photo in your phone editor first for a cleaner copy.`
  6. `Does the CNIC tool work offline?` — `Uploading, layout, filters and PNG export run in your browser once the page has loaded. PDF export loads jsPDF from cdnjs, so that one feature needs a network connection.`
  7. `Are my CNIC photos uploaded?` — `No. The images are read and drawn into a canvas in your browser and are not sent to a server by the tool. The site loads Google Analytics and third-party ads; see the privacy policy.`
  8. `Can I merge CNIC front and back into one image?` — `Yes. The sheet is a single image, so Download PNG gives you one file with both sides. Use Download PDF if the form asks for a PDF.`
  9. `Can I print a CNIC copy on my phone?` — `Yes, in a mobile browser. Save the PDF or PNG and print it from your phone, or send the file to a print shop. Check the scale before printing.`
  10. `Is this an official NADRA tool?` — `No. Zaibi Tools is not affiliated with NADRA or any government office. It is an independent browser tool for arranging images you already have.`
  11. `Can I use a driving licence or another ID card?` — `The layout uses the ID-1 card proportion, so it also works for driving licences, bank cards and many student or employee cards. Check the printed size against the real card.`
  12. `Why is my printed CNIC the wrong size?` — `The usual cause is a printer setting such as "fit to page" or a reduced scale. Print at 100% and measure the card with a ruler; the sheet is drawn at about 85 x 53 mm at 150 DPI.`
  13. `Does the tool add a watermark by default?` — `No. The watermark is off by default. Turn it on when you want a visible purpose label, and turn it off before export if you do not want one.`

Privacy (`/privacy`):
- Title: `Privacy Policy | Zaibi Tools` (28)
- Description: `How Zaibi Tools handles data: your chosen files are processed in the browser and are not uploaded. The site uses analytics and third-party ads.` (147)
- H1: `Privacy Policy`
- Update the theme localStorage bullet: remove it, because no theme preference is stored after this task.
- Keep the analytics, ads, hosting logs, jsPDF CDN, children, changes, and contact sections. Confirm the `privacy@zaibitools.com` mailbox exists before publishing (see DECISIONS).

Terms (`/terms`):
- Title: `Terms of Use | Zaibi Tools` (25)
- Description: `Terms for using Zaibi Tools, the free browser-based image compressor and CNIC print tool.` (94)
- H1: `Terms of Use`
- Keep the existing terms, but remove "proprietary" if the tool is presented as free to use, and add "not affiliated with NADRA".

Home FAQ:
1. `Are the tools free?` — `Yes. Both tools are free and do not require an account.`
2. `Do my files get uploaded?` — `No. The tools process files in your browser and do not upload them. The site loads Google Analytics and third-party ads; see the privacy policy.`
3. `Can I use the CNIC tool for any ID card?` — `The layout is built around the ID-1 card size used by CNICs and many bank, licence and student cards. Check the printed size before submitting an official copy.`
4. `What image sizes can I compress to?` — `You can enter a target from 1 to 10,240 KB. 20 KB, 50 KB and 100 KB are common limits on job, visa and exam forms.`
5. `Does the CNIC tool print at the real card size?` — `The card frames are drawn at about 85 x 53 mm on A4 at 150 DPI. Print at 100% scale and check with a ruler; do not use "fit to page".`

##### C3.3 Claims to fix or remove

| Current claim | Location | Action |
| --- | --- | --- |
| "malicious payload scanner", "strict MIME header validation and binary buffer inspection" | `SecurityModal.tsx:52-56` | Remove. Replace with "Only image files are accepted and decoded locally by your browser." |
| HEIC support | `ImageOptTool.tsx:335`, `IMAGE_FAQ_ITEMS` | Remove HEIC from the copy and FAQ. |
| AVIF export | `ImageOptTool.tsx:204`, `FORMAT_LABELS`, `initialData.ts`, metadata | Remove AVIF from the export choices and all "AVIF export" copy. AVIF may still be accepted as an input if the browser can decode it, but the output is JPG, PNG or WebP. This also fixes the mislabeled `.avif` file (I-04). |
| "up to 80%", "without quality loss" | metadata, hero, initialData | Replace with "smaller files, depending on the image" and "lower quality/resolution to reach the target". No percentage without a benchmark. |
| "Batch multi-threaded" | `initialData.ts:12` | Replace with "Batch selection, processed one image at a time". |
| "Automated boundary alignment and aspect ratio lock" | `initialData.ts:28`, FAQ | Remove. Say the image is fitted into a fixed card frame. |
| "300 DPI" / "true-size" | `HomeHub.tsx:21`, `CnicOptTool.tsx:571`, FAQ, schema, OG | Use 150 DPI and "about 85 x 53 mm". |
| "Anti-fraud / anti-photocopy watermark" | hero, initialData, FAQ | Use "visible purpose watermark"; it discourages casual reuse but does not prevent copying. |
| "max 25MB per file" | `ImageOptTool.tsx:335` | Remove (no size check exists). |
| "All Systems Active" | `Header.tsx:74-80` | Remove. It is not wired to `/api/health`. |
| "Enterprise", "Proprietary", "Portal Enterprise Suite" | Header, Footer, initialData | Remove. The tools are free. |
| "Job sheet" | HomeHub | Replace with "Overview" or "Print sheet". |
| "Files never leave your device" | Home, footer, modal, FAQ | Replace with "The tool does not upload your files. The site loads Google Analytics and third-party ads." |
| "SSL Secure" | Footer | Remove. |
| "Official Use Only" | CNIC hero | Remove. |
| "1:1 print calibration" | Home | Replace with "A4 layout at 150 DPI". |
| `stripExif` and `lossless` toggles | `ImageOptTool.tsx:262-288` | Remove both controls. Canvas always strips EXIF; lossless is ignored. |
| Sample CNIC with a real-looking name/ID | `CnicOptTool.tsx:122-190` | Replace with clearly fictional "SAMPLE" text and `00000-0000000-0`; label it as a sample. |

##### C3.4 Technical SEO

- `app/sitemap.ts`: new URLs only; fixed `lastModified` dates (no `new Date()` per request); include home, both tools, privacy, terms.
- `app/robots.ts`: allow `/`, disallow `/api/`, sitemap URL. Keep the existing file.
- Canonical on every page, including home, privacy, terms.
- Open Graph + Twitter metadata per page; file-based OG images for home and each tool; light OG design; no 300 DPI/80% claims.
- JSON-LD: `WebApplication` (or `SoftwareApplication`) per tool with name, URL, applicationCategory, operatingSystem, browserRequirements, `offers.price: 0`; `BreadcrumbList`; `FAQPage` on pages with FAQ (note: no Google FAQ rich result since May 2026; keep it for semantic completeness and other engines); Organization/WebSite on home. Do not add fake ratings/reviews.
- Escape `<` in `JSON.stringify` inside `JsonLd` (`\\u003c`) to prevent script breakout.
- Semantic HTML: `header`, `nav` with `aria-label`, `main`, `section` with `aria-labelledby`, `footer`; one H1; H2/H3 in order; descriptive link text; `lang="en"`.
- Add a 3-4 step "How to use" section on each tool page and links between the two tools.
- Images: keep `<img>` for data URLs, but always give an explicit width/height or an aspect-ratio container; lazy-load below-fold images; descriptive alt text.
- Internal links: Header/Footer to both tools; tool-to-tool links; privacy link from each tool; no fake social links.
- Add "Zaibi Tools is not affiliated with NADRA" on the CNIC page and in the terms.

#### C3.5 Long-tail keyword map

How the long tail is targeted:
- One page per job, not one page per KB limit. Do not create `/compress-image-to-20kb`, `/compress-image-to-50kb` and similar thin doorway pages. They split authority, duplicate the same tool, and risk being treated as low-value pages. Put each long-tail variant in an H2/H3/FAQ on the main tool page.
- Primary keyword placement: title, H1, intro, one H2, one FAQ, and an internal link where natural. Long-tail variants go in H3s, FAQ questions, and short answer-first paragraphs. Use the exact phrase once; use natural variants elsewhere.
- Answer first: under each long-tail H2/H3, answer the question in the first 40-60 words, then add detail. This is readable for users and eligible for snippets.
- No keyword stuffing: no repeated lists, no city-name spam, no "Pakistan" in every sentence, no `meta keywords` tag (Google ignores it).
- Truthful coverage: never target a claim the engine cannot support. If the answer is "not supported", say so and offer the supported path instead.
- Internal links use descriptive anchors: "compress an image to 20KB", "print CNIC front and back on one A4 page", "convert PNG to WebP". Never "click here".
- Add `id` attributes and `scroll-mt-24` to the target sections so home-page links land below the sticky header.
- After deploy, use Search Console queries for 4-6 weeks to see which long-tail variants actually earn impressions. Add or merge sections based on real data, not guesses. No search volumes are claimed here.

Image tool long-tail clusters:

| Cluster | Representative queries (observed or natural variants) | Intent | Where it goes |
| --- | --- | --- | --- |
| KB limits | compress image to 20kb online free; compress jpg to 20kb; compress image to 50kb free online; compress image to 100kb; compress image to 100kb for passport size; image compressor 20kb to 50kb; compress image to 200kb; compress image to 1mb | Transactional, hard upload limit | H2 `Compress a JPG to 20KB, 50KB or 100KB`; H3s for 20/50/100 KB and 200 KB/1 MB; FAQ 1-2 |
| PNG | compress png to 20kb; png compressor; reduce png file size | Transactional, but PNG is lossless here | H2 `Compress a PNG to 20KB`; H3 `Why PNG ignores the target size`; H3 `Convert PNG to JPG or WebP`; FAQ 8 |
| Quality | compress image to 20kb without losing quality; compress image without losing quality | Transactional with a quality worry | FAQ 9; comparison-slider helper text. Do not promise lossless output. |
| Formats | convert png to webp; webp to jpg; jpg to webp; webp converter bulk | Transactional conversion | H2 `Convert PNG to WebP or WebP to JPG`; H3s for each direction; FAQ 10 |
| Batch | bulk image compressor; compress multiple images; batch image compressor | Transactional, quantity | H2 `Compress several images at once`; FAQ 11 |
| Forms | compress image for job application; compress image for visa; compress image for exam form; photo size reducer for government form | Transactional, deadline-driven | H2 `Compress an image for a job, visa or exam form`; body copy |
| Presets | passport photo size in pixels; passport photo 600x600; instagram 1080x1080; linkedin banner size; resize image to 20kb 600x800 | Mixed: preset or specific dimensions | H2 `Resize for Instagram and passport photos`; H3s for each preset; FAQ 7 and 12. State that free 600x800 is not available. |
| Privacy | image compressor without upload; compress image offline; private image compressor | Trust-driven | H2 `Where your files go`; FAQ 6 |
| Format limits | convert heic to jpg; avif converter; compress png to exact kb | Transactional, unsupported | Do not target as a capability. Explain the supported formats in the FAQ or body if it helps. |

CNIC tool long-tail clusters:

| Cluster | Representative queries (observed or natural variants) | Intent | Where it goes |
| --- | --- | --- | --- |
| One page | cnic front and back in one page; cnic front and back merge online; cnic front and back print online; print both sides of id card on one page | Transactional | H1 and H2 `How to print CNIC front and back on A4`; FAQ 1 |
| Size | cnic photocopy size; cnic size in inches; cnic size in cm; cnic size in mm; cnic size in pixels; cnic card size | Informational plus transactional | H2 `CNIC photocopy size in mm, cm and inches`; H3s for pixels and print scale; FAQ 2 |
| PDF / image | cnic front and back pdf; cnic copy pdf; cnic photocopy pdf; merge cnic front and back into one image | Transactional | H2 `CNIC front and back on one page as PDF`; H3 `Merge front and back into one PNG`; FAQ 8 |
| Home printing | print cnic on a4 at home; cnic print a4; cnic photocopy on printer; cnic print scale | Transactional | H2 `Print CNIC on A4 at home`; FAQ 12 |
| Copies | cnic 2 copies one page; cnic 4 copies one page; cnic multiple copies; cnic grid print | Transactional | H2 `Print 2 or 4 copies on one sheet`; H3s for dual, quad, grid |
| Purpose | cnic copy for bank account; cnic for visa; cnic for job; cnic watermark | Transactional with an institution | H2 `CNIC copy for a bank, visa or job form`; H3 watermark presets; FAQ 4 and 13 |
| No software | cnic photocopy without photoshop; cnic copy in ms word alternative; cnic photocopy maker; cnic photocopy online free | Transactional, tool-seeking | H2 `CNIC photocopy without Photoshop or Word`; body copy |
| Phone | cnic photocopy on phone; cnic print from mobile; nadra cnic photocopy online | Transactional, mobile | H2 `Use your phone`; FAQ 9 |
| Other IDs | driving licence front and back one page; id card copy; bank card copy | Transactional, adjacent | Body copy; FAQ 11 |
| Trust | is online cnic photocopy safe; cnic photocopy without watermark; is this nadra | Trust and legitimacy | H2 `Where your files go`; FAQ 10 and 13; NADRA disclaimer. Do not give legal advice. |

Home long-tail clusters:

| Cluster | Representative queries | Where it goes |
| --- | --- | --- |
| Task hub | free image compressor and cnic print; compress image and print cnic; pakistani cnic print tool; online cnic photocopy and image compressor | H1, intro, and `Popular tasks` links. Keep the home page short and send long-tail intent to the tool pages. |

Do not target (or claim) these:
- `compress PNG to 20KB` as a direct capability. PNG ignores the target; explain conversion to JPG/WebP.
- `resize to 600x800` or any free width/height input. Only presets exist.
- `HEIC converter`, `AVIF converter`, `AVIF export`. Not offered.
- `300 DPI` CNIC output. The engine is 150 DPI.
- `official NADRA`, `government approved`, `legally valid copy`. Not affiliated; no legal guarantee.
- `unlimited file size`. No explicit limit is enforced, but browser memory is the real limit.
- `batch multi-threaded`. Processing is sequential.
- `without losing quality` as a guarantee.
- Separate pages for each KB size. Use sections on the one tool page.

#### C4. File-by-file change list

| File | Action | Reason |
| --- | --- | --- |
| `app/globals.css` | Edit | Light tokens, remove dark variant/body rule, `color-scheme: light`, focus/type/spacing base, safe-area helper. |
| `app/layout.tsx` | Edit | Remove `className="dark"`; add `viewport` (`themeColor`, `colorScheme`); fix metadata copy; remove the unapproved AdSense script (pending decision). |
| `app/page.tsx` | Edit | Home metadata/canonical/JSON-LD graph. |
| `app/image-opt/page.tsx` | Rename to `app/image-compressor/page.tsx` | Keyword slug + new metadata/H1/JSON-LD. |
| `app/image-opt/opengraph-image.tsx` | Rename to `app/image-compressor/opengraph-image.tsx` | Keep the OG route with the new URL; light design. |
| `app/cnic-opt/page.tsx` | Rename to `app/cnic-photocopy/page.tsx` | Keyword slug + new metadata/H1/JSON-LD. |
| `app/cnic-opt/opengraph-image.tsx` | Rename to `app/cnic-photocopy/opengraph-image.tsx` | Keep the OG route with the new URL; light design. |
| `app/sitemap.ts` | Edit | New URLs, fixed dates. |
| `app/robots.ts` | Keep | Already correct; verify. |
| `app/opengraph-image.tsx` | Edit | Light OG card, corrected claims. |
| `app/icon.svg` | Edit | Light background, same P mark. |
| `app/not-found.tsx` | Edit | Light, H1, 44 px links, no jargon. |
| `app/error.tsx` | Edit | Light, H1, 44 px reset, accurate copy. |
| `app/privacy/page.tsx` | Edit | Remove theme localStorage; confirm claims and contact. |
| `app/terms/page.tsx` | Edit | Remove "proprietary" if free, add NADRA disclaimer. |
| `components/Header.tsx` | Edit | One-row mobile header + menu, plain labels, remove theme/status, 44 px targets. |
| `components/Footer.tsx` | Edit | Light, 2-col mobile, plain links, remove Enterprise/SSL claims. |
| `components/HomeHub.tsx` | Edit | Light hero/cards/FAQ, new order, ad after cards. |
| `components/SiteShell.tsx` | Edit | Remove sticky-ad padding/import; skip link; spacing. |
| `components/SecurityModal.tsx` | Edit | Light, remove scanner claim, focus trap/Escape/restore, 44 px close. |
| `components/ThemeToggle.tsx` | Delete | Light-only site; no theme storage. |
| `components/StickyMobileAd.tsx` | Delete | Remove overlap and accidental clicks (recommended). |
| `components/AdBanner.tsx` | Edit | Reserved space, 12 px label, lazy, no sandbox, `scrolling="no"`. |
| `components/ResponsiveAd.tsx` | Edit | Prevent 250/90 hydration jump; reserve exact height. |
| `components/ImageOptTool.tsx` | Edit | Mobile order, remove toggles/AVIF/HEIC claims, responsive compare, 44 px targets, alt text, accurate copy. |
| `components/CnicOptTool.tsx` | Edit | Mobile order, responsive preview, settings `<details>`, 44 px targets, accurate copy, sample labels, alt text, print-blocked message. |
| `components/ImageOptContent.tsx` | Edit | New H2s, 4-step how-to, exact size content, internal link to CNIC. |
| `components/CnicOptContent.tsx` | Edit | New H2s, 4-step how-to, accurate size/scale, internal link to image tool. |
| `components/ContentSheet.tsx` | Edit | Light sheet, readable measure, link styles. |
| `components/FaqList.tsx` | Edit | Native `<details>`/`<summary>`, light, H3. |
| `components/LegalPage.tsx` | Edit | Light header/body, readable measure. |
| `components/CornerMarks.tsx` | Keep | Decorative; keep but use sparingly. |
| `components/JsonLd.tsx` | Edit | Escape `<` in JSON output. |
| `lib/data/initialData.ts` | Edit | All titles, descriptions, FAQ, claims, labels in one place. |
| `lib/data/ads.ts` | Keep | Same keys/units; placement changes only. |
| `lib/schema.ts` | Edit | WebApplication, breadcrumb, FAQ; remove invalid rating assumptions; new URLs. |
| `lib/ogImage.tsx` | Edit | Light card palette and corrected copy. |
| `lib/types.ts` | Edit | Remove `stripExif`/`lossless` if the controls are removed (engine does not read them). Remove `color-boost` if unused. |
| `next.config.ts` | Edit | 301 redirects from old URLs; keep headers/standalone. |
| `WORKLOG.md`, `IMPROVE.md`, `README.md`, `CLAUDE.md`, `AGENTS.md` | Edit | Docs, backlog, and dark-mode rule updates. |
| `.open-next/*` | Do not touch | Build output is tracked by mistake; see I-17. |

#### C5. Risks and mitigation

| Risk | Mitigation |
| --- | --- |
| Dirty tree / unrelated staged work | Stop before branching. Preserve the existing staged work in its own branch/PR (or owner-approved stash), exclude `.open-next`, and start each redesign branch from a clean `main`. Never edit on `main`. |
| Unapproved AdSense script | Remove it, or get explicit approval and document it. Do not commit it silently with the redesign. |
| Broken old URLs / lost rankings | 301 via `statusCode: 301`; verify with `curl -sI` in preview; keep redirects indefinitely; update sitemap/canonical/internal links in the same PR; resubmit sitemap; watch Search Console. `/cnic-opt` currently ranks #2 on DuckDuckGo, so expect a possible temporary dip. |
| Next returns 308 instead of 301 | Use `statusCode: 301`, not `permanent: true`. If OpenNext does not honor it, fall back to a route-level `permanentRedirect` and document the actual code. |
| Ad layout shift | Reserve exact height (label + unit + gap), render placeholder at the same height, lazy-load below the fold, no sticky bar, fixed iframe dimensions. Measure CLS. |
| Ad iframe same-origin access | The no-sandbox `srcDoc` iframe is same-origin and could read page DOM. Do not claim the ads cannot see the page. Keep file processing local, and note this as a follow-up security decision. Do not change the sandbox rule without approval. |
| GA literal script | Keep it exactly as a literal script in `layout.tsx`; do not move it to `next/script` or a package. |
| OpenNext / Workers build | Keep `build` as `next build` with the DNS flags, `output: "standalone"`, Worker name, and assets binding. Run `npm run build` and `npm run preview`; check the Worker build after merge. |
| Light-only contrast | Use the measured palette; do not use gold for small text on paper-3 without checking; focus ring 3:1; test with a contrast checker. |
| iOS Safari / Android Chrome | 16 px inputs, 44 px targets, `accept="image/*"`, no hover-only controls, test Canvas memory with large images, test print popup blocking and PDF CDN. |
| Long-tail doorway pages or keyword stuffing | Do not create per-size pages; use H2/H3/FAQ sections on the one tool page. Keep one primary keyword per page, use each exact long-tail phrase once, and review the rendered copy for repetition before merge. |
| FAQ/SoftwareApplication rich results | Do not promise rich results: FAQ rich results were removed in May 2026, and SoftwareApplication needs a legitimate rating/review. Keep valid markup for semantics only. |
| Sitemap `lastmod` noise | Use fixed dates, not `new Date()` per request. |
| Contact email may not exist | Confirm `privacy@zaibitools.com` before publishing; otherwise use a verified address or remove the contact claim. |
| `color-scheme: light` changes form controls | Test selects, checkboxes, range inputs, and the print preview on both platforms. |

#### C6. Test plan

Commands:

```bash
npm run typecheck
npm run lint          # same command
npm run build
npm run preview       # required for next.config.ts/redirect changes
git diff --check
```

Manual checks:

- Widths: 320, 375, 414, 768, 1024, 1440. At each width, run `document.documentElement.scrollWidth <= window.innerWidth` and confirm no horizontal scroll.
- Tap targets: list every `a`, `button`, `input`, `select`, `summary`; confirm at least 44x44 CSS px (or adequate spacing for inline links).
- Text: no visible text below 12 px; body 16 px; inputs 16 px.
- Image tool end to end: drag/drop and picker; demo sample; JPG/PNG/WebP; target 20/50/100 KB; preset; compare slider with mouse, touch, and keyboard; download; reset; error path for a non-image file.
- CNIC tool end to end: sample; front/back upload; every layout; every filter; every paper size; scale; watermark on/off and opacity; preview; Print; PDF; PNG; popup-blocked message.
- Header/menu: open, close, Escape, outside click, route change; focus returns to the menu button.
- Security modal: open from footer, Escape, backdrop, focus trap, focus restore.
- Keyboard: skip link, tab order, visible focus, no keyboard traps.
- Ads: each unit renders in its own iframe; no `sandbox`; reserved height; no overlap with buttons; lazy below the fold; no CLS jump; no new ad scripts.
- Network: confirm no upload of selected files (only analytics/ad requests); no console errors or unhandled rejections.
- `/api/health` returns healthy.
- Redirects: `curl -sI http://localhost:8787/image-opt` -> `301` + `location: /image-compressor`; same for `/cnic-opt` -> `/cnic-photocopy`. Test with and without a trailing slash.
- `curl -s http://localhost:8787/sitemap.xml` and `/robots.txt`; confirm new URLs, no old URLs.
- Canonical: inspect each page's `<link rel="canonical">` and OG/Twitter tags.
- Long-tail coverage: for every row in C3.5, confirm a matching H2/H3/FAQ exists and the answer is true. Each exact phrase should appear at most twice on the page (for example once in a heading and once in an FAQ). Confirm no unsupported capability is claimed, and that every home `Popular tasks` link resolves to the correct section with `scroll-mt-24`.
- Duplicate intent: confirm there is no separate page competing for the same KB or CNIC-copy query. One URL per job.
- JSON-LD: Rich Results Test or `https://validator.schema.org/`; expect valid JSON, no fake ratings; note that FAQ/SoftwareApplication may not show a rich result.
- No dark mode: `grep -rn "dark:\|className=\"dark\"\|optipack-theme\|@custom-variant dark" app components lib` returns nothing. Emulate `prefers-color-scheme: dark` in DevTools and confirm the site does not change.
- Lighthouse mobile on `/`, `/image-compressor`, `/cnic-photocopy`, `/privacy`, `/terms`: Performance, Accessibility, Best Practices, SEO, and LCP/CLS/INP. Target 90+ for Accessibility, Best Practices and SEO. Report actual numbers. Local Lighthouse is **NOT RUN** in this environment because Chrome/Lighthouse are not installed; use PageSpeed Insights on the deployed URL after merge, or get approval to run `npx lighthouse` transiently.

Never report a check as passed unless it was run. Record the exact command/output in `WORKLOG.md`.

#### C7. Work split (one branch per step)

1. `feature/light-theme-tokens` — light palette, remove dark mode, delete `ThemeToggle`, light OG/icon, `color-scheme`, focus/type tokens. Checks: typecheck, build.
2. `feature/mobile-first-layout` — Header, menu, SiteShell, Footer, HomeHub, SecurityModal, 404/error, ad placement/space, delete sticky ad. Checks: typecheck, build, manual 320/375/768/1440.
3. `feature/mobile-first-image-tool` — Image tool order, responsive compare, remove toggles/AVIF/HEIC/25MB claims, 44 px targets, alt text, image content/how-to. Checks: typecheck, build, full image flow.
4. `feature/mobile-first-cnic-tool` — CNIC tool order, responsive preview, settings `<details>`, accurate size/watermark copy, sample labels, 44 px targets, alt text, print/PDF/PNG flow. Checks: typecheck, build, full CNIC flow.
5. `feature/seo-pages-and-content` — rename routes, 301 redirects, metadata, canonical, sitemap/internal links, copy/FAQ, long-tail H2/H3/FAQ map, JSON-LD URLs, Header/Footer labels. Checks: typecheck, build, preview, redirects, sitemap, canonical, long-tail coverage audit.
6. `feature/seo-technical` — sitemap dates, robots, OG images, WebApplication/Breadcrumb/FAQ schema, JsonLd escaping, Twitter metadata, final metadata audit. Checks: typecheck, build, preview, Rich Results Test.
7. `docs/update-after-redesign` — README, CLAUDE.md, AGENTS.md (light-only rule, URLs, commands), WORKLOG/IMPROVE. Checks: `git diff --check`; docs fact-check.

Each branch: update `WORKLOG.md` to IN PROGRESS, implement only that step, run checks, update `IMPROVE.md` (I-01, I-02, I-03, I-04, I-05, I-06, I-11, I-12, I-13, I-16, I-18, I-19, I-20, I-26, I-27 as applicable), commit `type: summary`, push, open a PR with 375 px and 1280 px screenshots, and wait for approval before merge.

#### C8. DECISIONS for the owner

1. **URLs and labels.** Recommended: `/image-compressor` + "Image Compressor"; `/cnic-photocopy` + "CNIC Photocopy"; 301 from the old URLs. Alternative: keep `/image-opt` and `/cnic-opt` to protect the current ranking. Approve one.
2. **Visual style.** Recommended: keep the document / print-sheet identity (thin rules, mono labels, white sheets, small corner marks) but light, bright, and plain. Alternative: a completely plain utility style with no print marks. Approve one.
3. **"optimation".** It is not an English word. Recommended: treat it as a typo and use "optimization" everywhere. Confirm if it is an intentional brand spelling.
4. **`stripExif` and `lossless` toggles.** Recommended: remove both. Canvas re-encoding always strips EXIF, and `lossless` is ignored by the engine. Alternative: implement them (needs engine work and a quality test).
5. **Ad density on mobile.** Recommended: remove the sticky 320x50 bar; one unit on mobile, up to two on desktop; keep the existing Adsterra iframes/keys. Alternative: keep the sticky bar but make it dismissible and reserve 66 px. Approve one.
6. **Internal names.** Recommended: keep the Worker name `optipack-portal`, the package name, and the internal CSS keyframe names; remove the `optipack-theme` localStorage key because it disappears with the toggle. Do not rename the Worker. Confirm.
7. **Uncommitted staged SEO work (blocker).** Approve preserving it as its own checkpoint branch/PR before the redesign branches, or tell me to stash/leave it. I will not commit or discard it without your answer.
8. **Unstaged AdSense script (blocker).** Recommended: remove it (duplicate ad network, unapproved, CWV/consent risk). Alternative: approve it, document it, and test it; I will not include it silently.
9. **AVIF export.** Recommended: remove AVIF from the export options and copy (current fallback writes WebP bytes with an `.avif` name). Alternative: change the download extension to `.webp` or add a real AVIF encoder (needs approval/engine work).
10. **DPI.** Recommended: keep the engine and state 150 DPI / about 85 x 53 mm. Alternative: render at 300 DPI (larger files, slower previews, engine change).
11. **Contact email.** Confirm that `privacy@zaibitools.com` exists. If not, give me the correct address or I will remove the contact claim.
12. **Lighthouse.** Approve a transient `npx --yes lighthouse` run (no `package.json` change) or accept PageSpeed Insights on the deployed URL after merge. Local Lighthouse is otherwise NOT RUN.
13. **Dedicated long-tail pages.** Recommended: no separate pages for each KB size or CNIC copy variant; use the H2/H3/FAQ map in C3.5 on `/image-compressor` and `/cnic-photocopy`. Alternative: per-size URLs such as `/compress-image-to-20kb` (not recommended; thin, duplicate, doorway-page risk).

### Approval request

Phase 1 stops here. No app file, no branch with code changes, and no commit has been made. The only file changed is this `WORKLOG.md` entry, written on the current dirty `main` working tree at your request. Reply with your answers to the 13 DECISIONS above (especially 1, 5, 7, 8, and 13) and written approval to start Phase 2. I will then create the first branch from a clean `main` and follow the split in C7.

---

## 2026-10-29 — Add project guide docs

Status: TESTED
Branch: `docs/add-project-guides`

Goal:
- Add a durable rules file, a project log, and a prioritized backlog.
- Refresh `CLAUDE.md` so it points to the rules and stops saying deployment is manual.

Plan:
- Base the docs on `main` in a clean worktree so the change is docs-only.
- Create `AGENTS.md`, `WORKLOG.md`, and `IMPROVE.md`; replace `CLAUDE.md`.
- Fact-check every command, path, and claim against `main`.
- Commit only the four docs, push the branch, and open a PR. Do not merge.

What changed:
- Added `AGENTS.md` with the workflow, branching, testing, docs, conventions, safety, and WORKLOG rules.
- Added `WORKLOG.md` with the project snapshot, this entry, and an empty deployment log.
- Added `IMPROVE.md` with a P1/P2/P3 backlog based on the current `main` code.
- Replaced `CLAUDE.md` with a short pointer to `AGENTS.md` plus commands and technical gotchas.

Tests run:
- Docs-only change. No `typecheck`, `build`, or `preview` was run; no application code or config changed.
- Fact-check against `main` source: commands, pages, versions, config, analytics, ads, and known limitations.
- `git diff --check` — PASS.
- Diff scope check — PASS: only `AGENTS.md`, `CLAUDE.md`, `IMPROVE.md`, and `WORKLOG.md` changed.

Not tested:
- Browser behavior, manual tool flows, ads, and deployment. This task does not change them.
- Cloudflare Workers Builds settings cannot be checked from the repository. Confirm in the dashboard.

Docs updated:
- `AGENTS.md`, `WORKLOG.md`, `IMPROVE.md`, `CLAUDE.md`.

Commit/PR:
- Docs commit: `b07a513` — `docs: add AGENTS, IMPROVE, WORKLOG and refresh CLAUDE`.
- PR to `main`: https://github.com/asad-bukhari/photoshop-opt-website/pull/1. Do not merge without approval.

Follow-ups:
- Confirm in the Cloudflare dashboard that a merge to `main` triggers a Workers Build, then record it in the deployment log.
- Fix the stale "manual deployment" section in `README.md`.
- Review the P1 items in `IMPROVE.md` and decide the marked `DECISION` items.

---

## Project state snapshot

Snapshot date: 2026-10-29 (branch base: `main` at `da3222a`).

### Runtime and versions

| Item | Value |
| --- | --- |
| App package | `optipack-portal` v3.0.0 |
| Tool labels | Image Compressor; CNIC Photocopy |
| Next.js | `^16.4.3` (App Router) |
| React | `^19.1.0` |
| Tailwind CSS | `^4.1.14` |
| TypeScript | `~5.8.3`, strict |
| Icons | `lucide-react` `^0.546.0` |
| Cloudflare adapter | `@opennextjs/cloudflare` `^1.20.14` |
| Wrangler | `^4.148.0` (installed 4.155.0) |
| Output mode | `standalone` in `next.config.ts` |

### Pages and routes on `main`

| Route | Purpose |
| --- | --- |
| `/` | Landing page with tool cards, popular tasks and FAQ |
| `/image-compressor` | Image compressor and long-tail content |
| `/cnic-photocopy` | CNIC photocopy tool and long-tail content |
| `/privacy` | Privacy policy |
| `/terms` | Terms of use |
| `/sitemap.xml` | Sitemap |
| `/api/health` | Health check (`GET`) |

`/image-opt` and `/cnic-opt` return `301` to the new slugs. `app/error.tsx` and `app/not-found.tsx` are error/404 boundaries. There is still no `/robots.txt` or Open Graph image route; see `IMPROVE.md`.

### Hosting and analytics

- Cloudflare Worker `optipack-portal`, `nodejs_compat`, compatibility date `2026-09-08`.
- Assets binding `ASSETS` points at `.open-next/assets`.
- Live domain: https://zaibitools.com. Fallback: https://optipack-portal.asadbukhari65813.workers.dev.
- GA4 measurement ID: `G-3QKCPR8SR3`, loaded as literal scripts in `app/layout.tsx`.
- No GitHub Actions workflow exists in the repository.

### Ads

- Network: Adsterra via `lib/data/ads.ts`.
- Units: 300x250 medium rectangle and 728x90 leaderboard, selected responsively.
- Each unit renders in an isolated `srcDoc` iframe with no `sandbox` attribute.
- Ad density: one responsive unit per page, placed after the tool result and before the long-tail content. The sticky mobile bar was removed.

### Verification status

- No test framework or automated test suite.
- Available checks: `npm run typecheck` / `npm run lint` (same command), `npm run build`, `npm run preview`, and manual browser checks.
- The 2026-10-30 deploy is verified: the live site serves the new routes and titles.
- `npm run preview` currently fails when OpenNext checks the Next.js version; see I-30 in `IMPROVE.md`.
- The repository currently tracks 89 `.open-next` build-output files. See `IMPROVE.md`.

---

## Deployment verification log

| Date | Commit | Environment | Result | Notes |
| --- | --- | --- | --- | --- |
| 2026-10-29 | `f83c496` | production | UNVERIFIED | PR #2 merged. Live HTML still had `<html class="dark">` about 15 minutes later. The Cloudflare dashboard could not be checked. |
| 2026-10-29 | `7a9f8e2` | production | UNVERIFIED | PR #3 merged. Live HTML still had `<html class="dark">` at 10:09 UTC. Workers Builds auto-deploy is not confirmed. |
| 2026-10-29 | `704a288` | production | UNVERIFIED | PR #6 merged. At 15:29 UTC the live site still served the old HTML; `/image-compressor` returned 404. No Workers Build was observed. The owner deploy is still pending. |
| 2026-10-29 | `0dde39f` | production | UNVERIFIED | PR #7 merged. At 15:29 UTC `/image-opt` still returned 200, `/image-compressor` 404, the title was still the old one, and `/sitemap.xml` still used a per-request `lastmod`. No Workers Build was observed. Any deploy must also address I-30. |
| 2026-10-30 | `6530c0e` | production | DEPLOYED | PR #9 (Next.js 16) merged at 03:54 UTC. The owner approved `npm run deploy` at 04:47 UTC; Worker version `85a6c83d-7957-4140-a3d0-59ebce7f285b`. Live title updated; `/`, `/image-compressor`, `/cnic-photocopy`, `/privacy`, `/terms`, `/sitemap.xml` and `/api/health` return 200; `/image-opt` and `/cnic-opt` return 301; the sitemap lists the new URLs. |

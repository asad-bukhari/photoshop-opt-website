# WORKLOG.md

Newest entries go at the top. Keep the project snapshot and deployment log current.

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
| Tool labels | Image Optimizer v3.0; CNIC Print Suite v3.5 |
| Next.js | `^15.3.3` (App Router) |
| React | `^19.1.0` |
| Tailwind CSS | `^4.1.14` |
| TypeScript | `~5.8.3`, strict |
| Icons | `lucide-react` `^0.546.0` |
| Cloudflare adapter | `@opennextjs/cloudflare` `^1.20.6` |
| Wrangler | `^4.130.0` |
| Output mode | `standalone` in `next.config.ts` |

### Pages and routes on `main`

| Route | Purpose |
| --- | --- |
| `/` | Landing page with tool cards and FAQ |
| `/image-opt` | Batch image optimizer |
| `/cnic-opt` | CNIC / ID print suite |
| `/api/health` | Health check (`GET`) |

`app/error.tsx` and `app/not-found.tsx` are error/404 boundaries. On `main` there is no `/privacy`, `/terms`, sitemap, robots, or Open Graph image route. See `IMPROVE.md`.

### Hosting and analytics

- Cloudflare Worker `optipack-portal`, `nodejs_compat`, compatibility date `2026-09-08`.
- Assets binding `ASSETS` points at `.open-next/assets`.
- Live domain: https://zaibitools.com. Fallback: https://optipack-portal.asadbukhari65813.workers.dev.
- GA4 measurement ID: `G-3QKCPR8SR3`, loaded as literal scripts in `app/layout.tsx`.
- No GitHub Actions workflow exists in the repository.

### Ads

- Network: Adsterra via `lib/data/ads.ts`.
- Units: 300x250 medium rectangle, 728x90 leaderboard, 320x50 mobile banner.
- Each unit renders in an isolated `srcDoc` iframe with no `sandbox` attribute.
- Ad density on `main`: home has four units (two responsive, one 300x250, plus sticky mobile); each tool page has three (responsive, 300x250, plus sticky mobile). See `IMPROVE.md`.

### Verification status

- No test framework or automated test suite.
- Available checks: `npm run typecheck` / `npm run lint` (same command), `npm run build`, `npm run preview`, and manual browser checks.
- No deployment has been verified in this log yet.
- The repository currently tracks 89 `.open-next` build-output files. See `IMPROVE.md`.

---

## Deployment verification log

| Date | Commit | Environment | Result | Notes |
| --- | --- | --- | --- | --- |

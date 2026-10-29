# AGENTS.md

This is the rules file for AI agents and humans working on Zaibi Tools. Read it before changing anything.

## Project summary

- **App:** `optipack-portal`, branded **Zaibi Tools**.
- **Stack:** Next.js 15 App Router, React 19, Tailwind CSS v4, TypeScript strict.
- **Tools:** two 100% client-side Canvas tools at `/image-opt` and `/cnic-opt`. Files are processed in the browser and must never be uploaded.
- **Hosting:** Cloudflare Worker via OpenNext (`@opennextjs/cloudflare`) and Wrangler.
- **Deploy:** production deploys through Cloudflare Workers Builds when changes merge to `main`. There are no GitHub Actions. The Cloudflare dashboard is the source of truth for build settings; verify and log the result.
- **Live:** https://zaibitools.com (fallback: https://optipack-portal.asadbukhari65813.workers.dev)
- **Server surface:** only `/api/health`. There is no database and no other backend API.
- **Tests:** no test framework. Verification is `typecheck`, `build`, `preview`, and manual browser checks.

## Mandatory workflow

Every task follows this order:

1. **PLAN** — read the relevant code and write the plan in `WORKLOG.md`.
2. **BRANCH** — create a branch from `main`. Never edit or commit on `main`.
3. **BUILD** — make the smallest correct change.
4. **TEST** — run the checks that apply. Record exact results.
5. **UPDATE DOCS** — update `WORKLOG.md`, plus `IMPROVE.md`, `README.md`, or `CLAUDE.md` when affected.
6. **COMMIT** — stage only the intended files and write a clear message.
7. **PR/MERGE** — open a PR. Do not merge without the owner's approval.
8. **VERIFY DEPLOY** — after merge, confirm the Workers Build succeeds and the live site is healthy. Record it in `WORKLOG.md`.

### Plan rule

- Write the plan in `WORKLOG.md` before editing code.
- For anything bigger than a small fix, wait for the owner's approval before implementing.
- A plan lists the goal, files, steps, risks, and checks.

### Branch rules

- Prefixes: `feature/`, `fix/`, `perf/`, `docs/`, or `chore/`.
- One task per branch.
- Never commit directly to `main`.
- Never force-push.
- Delete the branch after merge when appropriate.

## Testing rules

### Commands

```bash
npm install
npm run dev
npm run typecheck
npm run lint
npm run build
npm run preview
npm run deploy
```

- `npm run typecheck` and `npm run lint` both run `tsc --noEmit`.
- Run `npm run typecheck` after every code change.
- Run `npm run build` for code, config, metadata, or dependency changes. It must pass before merge.
- Run `npm run preview` when config, routing, headers, assets, or dependencies change. It exercises the OpenNext + Wrangler output.
- `npm run deploy` is a manual fallback. Do not use it as the normal deploy path.
- Docs-only changes do not need `typecheck`, `build`, or `preview`. Still run `git diff --check` and fact-check the docs.

### Manual checklist

Run this for tool, UI, ad, metadata, or config changes:

- [ ] Light mode looks correct and the OS dark-mode setting does not change the site.
- [ ] Mobile (about 375 px wide) and desktop both work.
- [ ] Ads render in their isolated iframes, labeled, without breaking layout.
- [ ] Image tool: drag/drop and file picker, demo sample, JPEG/WebP/PNG/AVIF, target size, preset, compare slider, download, reset.
- [ ] CNIC tool: sample cards, front/back upload, every layout, every filter, every paper size, scale, watermark, preview, print, PDF, PNG.
- [ ] Browser DevTools Network shows **no upload of user files**.
- [ ] No console errors or unhandled rejections.
- [ ] `/api/health` returns healthy.
- [ ] Routes and static assets load in `npm run preview` when routing/config changed.
- [ ] No secrets, tokens, or `.env` values appear in the client bundle or logs.

### Honesty rule

- Never claim a check passed unless it was actually run.
- If a check was not run, write **NOT RUN** and the reason.
- If a check failed, say so and include the relevant output.
- Do not describe manual checks as done unless a person actually performed them.

## Docs rule

After **every** task, in the same commit:

- Update `WORKLOG.md` with the newest entry on top.
- Update `IMPROVE.md` if the task closes an item or reveals a new one.
- Update `README.md` or `CLAUDE.md` if commands, setup, architecture, or deployment changed.
- A task is not done until its docs are updated.

## Code conventions

- Server Components by default. Add `'use client'` only for state, effects, refs, or browser APIs.
- Use design tokens from `app/globals.css` (`ink`, `paper`, `doc`, `gold`, `stamp`, `rule`, `line`). No raw hex in components.
- Light-only. Do not add `dark:` variants or a theme switch.
- Use `lucide-react` icons only.
- Do not add code comments unless the owner asks.
- Keep components functional and typed. Prefer types from `lib/types.ts`.
- Use the `@/*` path alias.
- Keep Canvas engines in `lib/utils/` pure: no React, no network.
- Match the existing visual language: job-sheet cards, mono labels, print marks.

## Intentional decisions — do not simplify without asking

- **Build script:** `package.json` `build` must run `next build` (currently prefixed with the DNS flags). `opennextjs-cloudflare build` internally runs the package `build` script; pointing `build` at OpenNext causes infinite recursion.
- **DNS/IPv6 flags:** keep `NODE_OPTIONS="--dns-result-order=ipv4first --no-network-family-autoselection"` on `build`, `preview`, and `deploy`. The environment resolves IPv6 first without a route and hangs on font fetches.
- **Adsterra iframes:** every banner renders in its own `srcDoc` iframe. This isolates the global `atOptions`. Do **not** add `sandbox`; Adsterra's `invoke.js` needs cookies/localStorage and silently fails when sandboxed.
- **AVIF fallback:** `imageOptimizer.ts` maps `avif` to `image/webp`. Browser AVIF encoding is unreliable. Do not remove the fallback without a proven encoder.
- **UI-only options:** `stripExif` and `lossless` are present in the UI but ignored by the engine. Canvas re-encoding already drops EXIF. Do not assume they work.
- **jsPDF:** loaded at runtime from cdnjs in `CnicOptTool.tsx`. PDF export needs network access. Do not bundle it without approval.
- **GA tag:** GA4 `G-3QKCPR8SR3` is a literal script in `app/layout.tsx`, not a Next.js analytics package.
- **Output mode:** `next.config.ts` uses `output: "standalone"` because OpenNext needs it.
- **Light-only theme:** `<html lang="en">` with `color-scheme: light`; there is no theme switch or stored theme preference.
- **No new third-party scripts:** do not add analytics, ads, fonts, or CDN scripts without owner approval.

## Safety rules

- Never print, commit, or copy `.env`, `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, or other secrets.
- Do not change DNS, domains, custom domains, dashboard build settings, or Cloudflare account configuration.
- Do not create a new Cloudflare project or Worker.
- Do not add a dependency or third-party script without approval.
- Every claim shown on the site must be true and supported by the code.
- User files must never leave the browser. Do not add uploads, server processing, or remote storage for them.
- Do not delete user data or build artifacts without explicit permission.
- Do not merge to `main`, force-push, or rewrite history without explicit permission.

## When to stop and ask

Stop and ask the owner before:

- Adding a package, test framework, CDN script, or third-party service.
- Changing a claim, privacy statement, legal text, or security promise.
- Changing a deployment, DNS, domain, or Cloudflare setting.
- Changing any "Intentional decisions" item above.
- Removing a feature, a route, or user-facing copy.
- Choosing between competing product behaviors.
- Running `npm run deploy`, merging to `main`, force-pushing, or rewriting history.
- Continuing when tests are blocked, the tree has unrelated changes, or the scope is unclear.

## Start-of-session checklist

- [ ] Read `AGENTS.md`, the newest `WORKLOG.md` entry, and `CLAUDE.md`.
- [ ] Run `git status` and `git branch --show-current`.
- [ ] Confirm the working tree state and do not touch unrelated changes.
- [ ] Create or switch to the correct branch. Never work on `main`.
- [ ] Write the plan in `WORKLOG.md`.
- [ ] Identify the checks that apply.
- [ ] Ask for approval if the task is larger than a small fix.

## End-of-session checklist

- [ ] The change matches the approved plan.
- [ ] `npm run typecheck` passed, or the reason it was not run is recorded.
- [ ] `npm run build` passed when required, or the reason is recorded.
- [ ] `npm run preview` passed when required, or the reason is recorded.
- [ ] Manual checklist completed when required, or marked NOT RUN.
- [ ] `WORKLOG.md` updated in the same commit.
- [ ] `IMPROVE.md`, `README.md`, and `CLAUDE.md` updated if affected.
- [ ] `git diff --check` passes.
- [ ] Only intended files are staged.
- [ ] Commit created and PR opened.
- [ ] Deployment verified after merge, or left explicitly unverified.

## WORKLOG entry template

Copy this to the top of `WORKLOG.md`:

```markdown
## YYYY-MM-DD — Short title

Status: PLANNED | IN PROGRESS | TESTED | MERGED | DEPLOYED | ABANDONED
Branch: `type/short-name`

Goal:
- What problem does this solve?

Plan:
- Files and steps.

What changed:
- Concrete changes.

Tests run:
- `npm run typecheck` — PASS / FAIL / NOT RUN (reason)
- `npm run build` — PASS / FAIL / NOT RUN (reason)
- `npm run preview` — PASS / FAIL / NOT RUN (reason)
- Manual checklist — PASS / FAIL / NOT RUN (details)

Not tested:
- Anything skipped, and why.

Docs updated:
- `WORKLOG.md`, `IMPROVE.md`, `README.md`, `CLAUDE.md` as applicable.

Commit/PR:
- Commit hash and message; PR link or number.

Follow-ups:
- Remaining work, risks, or decisions.
```

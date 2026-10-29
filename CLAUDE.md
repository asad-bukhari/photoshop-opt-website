# CLAUDE.md

Read `AGENTS.md` first. It is the source of truth for workflow, branching, testing, docs, safety, and intentional decisions. Use this file only as a quick technical reference.

## Project

`optipack-portal` (branded **Zaibi Tools**) is a Next.js 15 App Router site with two 100% client-side Canvas tools: `/image-opt` and `/cnic-opt`. It runs as a Cloudflare Worker through OpenNext. User files never leave the browser.

Live: https://zaibitools.com (fallback: https://optipack-portal.asadbukhari65813.workers.dev)

## Commands

```bash
npm install
npm run dev          # Next dev server (localhost:3000)
npm run typecheck    # tsc --noEmit
npm run lint         # same as typecheck
npm run build        # next build (with the required NODE_OPTIONS prefix)
npm run preview      # OpenNext build + wrangler dev
npm run deploy       # manual fallback only
```

There is no test suite. Use `npm run dev` for changed routes, then `typecheck`, `build`, `preview`, and the manual checklist in `AGENTS.md`. Never claim a check passed unless it was run. The owner performs the final production deploy.

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

# CLAUDE.md

Guidance for AI agents working in this repository.

## Project

`optipack-portal` (branded **Zaibi Tools**) — a Next.js 15 App Router site hosting two 100% client-side Canvas tools: a batch image optimizer and a CNIC/ID print-layout suite. Deployed as a Cloudflare Worker via OpenNext.

Live: https://optipack-portal.asadbukhari65813.workers.dev

## Commands

```bash
npm install
npm run dev          # Next dev server (localhost:3000)
npm run build        # next build only
npm run lint         # tsc --noEmit (same as typecheck)
npm run typecheck    # tsc --noEmit
npm run preview      # opennextjs-cloudflare build && wrangler dev
npm run deploy       # opennextjs-cloudflare build && wrangler deploy
```

There is no test suite. Always run `npm run lint` after changes.

## Architecture

- `app/` — App Router. `layout.tsx` wires fonts, metadata, and `SiteShell`. Pages are thin wrappers around tool components. `api/health/route.ts` is the only server route.
- `components/` — UI. `SiteShell` owns the security-modal state; `Header`/`Footer` receive `onOpenSecurity`. Tool components (`ImageOptTool`, `CnicOptTool`) are `'use client'`.
- `lib/utils/` — pure Canvas processing engines (`imageOptimizer.ts`, `cnicOptimizer.ts`). No React, no network.
- `lib/data/initialData.ts` — all copy, presets, and tool metadata.
- `lib/types.ts` — shared domain types.

Path alias `@/*` → project root.

## Conventions

- Server Components by default; add `'use client'` only for interactivity (state, effects, refs, browser APIs).
- Tailwind CSS v4. Design tokens are defined in `app/globals.css` under `@theme` (e.g. `ink`, `paper`, `doc`, `gold`, `stamp`). Dark mode is class-based (`.dark`) and toggled by `ThemeToggle` via `localStorage` key `optipack-theme`. Use token classes, not raw hex.
- TypeScript is strict. Prefer the types in `lib/types.ts`.
- Match existing style: no code comments, functional components, `lucide-react` icons.

## Critical gotchas

- **Build recursion:** `package.json` `"build"` MUST be `next build`. `opennextjs-cloudflare build` internally runs the package `build` script, so pointing `build` at itself causes infinite recursion.
- **DNS/IPv6:** this environment resolves IPv6 first but has no IPv6 route, which hangs build-time font fetches. The `build`/`preview`/`deploy` scripts prefix `NODE_OPTIONS="--dns-result-order=ipv4first --no-network-family-autoselection"`. Do not remove it.
- **Deploy auth:** Wrangler reads `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` from a gitignored `.env`. Never commit them; never print the token.
- **AVIF fallback:** `imageOptimizer.ts` maps `avif` → `image/webp` (browser AVIF encoding is unreliable).
- **Unused options:** `stripExif` and `lossless` are UI-only; the engine ignores them (Canvas re-encoding already drops EXIF).
- **jsPDF** is loaded at runtime from cdnjs in `CnicOptTool.tsx`; PDF export needs network access.

## Deployment

Manual only — no CI. Pushing to GitHub does not deploy. Run `npm run deploy`. Config lives in `wrangler.jsonc`, `open-next.config.ts`, and `next.config.ts`.

## Do not

- Do not commit `.env`, secrets, or `node_modules`/`.next`/`.open-next` build output.
- Do not add a comment unless asked.
- Do not change the `build` script back to `opennextjs-cloudflare build`.

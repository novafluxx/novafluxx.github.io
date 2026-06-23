# AGENTS.md

Quick reference for agentic coding agents working in this repository.
For deeper architecture prose (animated background layering, Safari iOS status-bar theming, glass-card variants), see `CLAUDE.md` — but trust the code over `CLAUDE.md` when versions/details conflict.

## Commands
- `pnpm install` — install deps. Use pnpm (Corepack-pinned to `pnpm@11.8.0` in `package.json`); never Bun/npm, even though `.claude/settings.json` happens to allow `bun run build`.
- `pnpm dev` — dev server at `localhost:4321` (served from base `/`).
- `pnpm build` — production build to `./dist/` (served from base `/my-personal-website/`).
- `pnpm preview` — preview the production build locally before pushing.
- No lint, formatter, test, or typecheck command is configured. `astro check` is not set up either (`@astrojs/check` is not installed); running it prompts to install the package. Treat `pnpm build` as the de-facto verification step — a clean build is the signal that types and templates are valid.

## Dev vs prod base path
`astro.config.mjs` sets `base` to `/my-personal-website/` in production but `/` in dev. Use `import.meta.env.BASE_URL` for internal links/paths — never hardcode `/my-personal-website/...` or assume `/`.

## Astro version
This repo currently uses Astro 7 (`astro@^7.0.0`) with Tailwind CSS v4 via `@tailwindcss/vite`.

There are no Astro content collections or markdown-driven routes in the current tree. If content collections are reintroduced later, verify the current Astro APIs before copying older Astro 4/6 patterns.

## Routing & layouts
- `src/pages/index.astro` — home page.
- `src/pages/404.astro` — custom error page.
- `src/layouts/Layout.astro` — master layout (fixed header, footer, full-page animated background). Every page must use it.
- `src/components/Nav.astro` — navigation links and theme-toggle button.
- Client-side TS lives in `src/scripts/{nav,animations,smooth-scroll}.ts`: `nav.ts` is loaded from `Nav.astro`, while `animations.ts` and `smooth-scroll.ts` are loaded from `index.astro`. `Layout.astro` also contains a small inline pre-paint theme/status-bar script. There is no client framework.

## Styling
- Tailwind CSS v4 via `@tailwindcss/vite`; apply utility classes inline.
- All custom CSS lives in `src/styles/global.css` (~1100 lines) — do not scatter component-scoped CSS files.
- Theming via CSS custom properties on `:root` / `:root.dark`; dark mode is toggled by adding the `dark` class to `<html>` (see `src/scripts/nav.ts`). Animations are prefixed by purpose (e.g. `float-orb-refined`, `mesh-float`).

## Critical constraint: keep `<body>` transparent
The animated background uses negative `z-index` layers that are only visible because `body` has a transparent background. Do NOT set an opaque `background-color` on `body` — it breaks the parallax/background stack. Safari iOS 18.1+ status-bar theming is handled separately via `<html>` background + a near-transparent fixed `#site-header`; read `CLAUDE.md`'s "Safari iOS Status Bar Theming" section before touching `updateThemeColor()` in `nav.ts`, and do not raise header background opacity above 0.02.

## Toolchain quirks
- This is a **single package**, not a monorepo. `pnpm-workspace.yaml` declares `allowBuilds` (esbuild, sharp) and `minimumReleaseAge: 1440`.
- `sharp` is required for Astro's image optimization and needs install scripts to run (already allow-listed).

## Deploy
- GitHub Pages via `.github/workflows/deploy.yml` using `withastro/action@v6` (note: v6, not v5 as `CLAUDE.md` states).
- Triggers on push to `main` and via manual `workflow_dispatch`.
- Live URL: https://novafluxx.github.io/my-personal-website/

## Conventions
- Relative imports for local files (`../components/Nav.astro`) — no TS path alias is configured.
- PascalCase for `.astro` components, camelCase for TS, kebab-case for CSS classes.
- TypeScript extends `astro/tsconfigs/strict`; prefer explicit types over inference.

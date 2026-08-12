# AGENTS.md

Quick reference for agentic coding agents working in this repository.
For deeper architecture prose (animated background layering, Safari iOS status-bar theming, constellation canvas), see `CLAUDE.md`; however, trust the code over `CLAUDE.md` when versions/details conflict.

## Commands
- `pnpm install`: install deps. Use pnpm (version pinned via `packageManager` in `package.json`, honored by pnpm itself — no Corepack); never Bun/npm.
- `pnpm dev`: dev server at `localhost:4321` (served from base `/`).
- `pnpm build`: production build to `./dist/` (served from base `/`).
- `pnpm preview`: preview the production build locally before pushing.
- `pnpm check`: typecheck via `astro check` (`@astrojs/check` is a devDependency).
- No lint, formatter, or test command is configured. Treat `pnpm build` plus `pnpm check` as the verification steps.

## Base path and deploy target
This is a GitHub Pages user site (`novafluxx.github.io`), served from the domain root — `base` is `/` for every target. `DEPLOY_TARGET=pages` only selects `site` (canonical origin for canonical/OG URLs); root deploys elsewhere read `SITE_URL`. Still use `import.meta.env.BASE_URL` for internal links/paths rather than hardcoding `/`, so a future subpath deploy doesn't break every asset.

## Astro version
This repo currently uses Astro 7 (`astro@^7.0.0`) with Tailwind CSS v4 via `@tailwindcss/vite`.

There are no Astro content collections or markdown-driven routes in the current tree. If content collections are reintroduced later, verify the current Astro APIs before copying older Astro 4/6 patterns.

## Routing & layouts
- `src/pages/index.astro`: single-page portfolio (sections: `#hero`, `#work`, `#experience`, `#aviation`, `#contact`).
- `src/pages/404.astro`: custom error page.
- `src/layouts/Layout.astro`: master layout (skip link, fixed header, footer, full-page animated background, SEO/OG meta). Every page must use it. Optional `description` prop for meta/OG text.
- `src/components/Nav.astro`: section anchor links and theme-toggle button.
- Client-side TS in `src/scripts/`:
  - `nav.ts` — loaded from `Nav.astro` (theme, active section, adaptive nav).
  - `animations.ts`, `smooth-scroll.ts`, `hero-3d.ts` — loaded from `index.astro`.
  - `Layout.astro` also has a small inline pre-paint theme/status-bar script.
- There is no client framework.

## Styling
- Tailwind CSS v4 via `@tailwindcss/vite`; apply utility classes inline.
- All custom CSS lives in `src/styles/global.css` (~1750 lines); do not scatter component-scoped CSS files.
- Homepage surfaces use `.project-card`, `.section-shell`, toolkit/experience patterns, etc. Legacy `.glass-card*` rules may still exist in CSS; prefer matching nearby section styles rather than reintroducing glass-card as the default.
- Theming via CSS custom properties on `:root` / `:root.dark`; dark mode is toggled by adding the `dark` class to `<html>` (see `src/scripts/nav.ts`). Animations are prefixed by purpose (e.g. `float-orb-refined`, `mesh-float`).

## Images
- Source assets under `src/images/` (e.g. `flight-line.jpg`, FileCrypter screenshots). Optimize via `astro:assets` (`Image` / `getImage`) and `sharp`.
- Prefer `astro:assets` for new product stills and section backgrounds.

## Critical constraint: keep `<body>` transparent
The animated background uses negative `z-index` layers that are only visible because `body` has a transparent background. Do NOT set an opaque `background-color` on `body`; it breaks the parallax/background stack. Safari iOS 18.1+ status-bar theming is handled separately via `<html>` background + a near-transparent fixed `#site-header`; read `CLAUDE.md`'s "Safari iOS Status Bar Theming" section before touching `updateThemeColor()` in `nav.ts`, and do not raise header background opacity above 0.02.

## Toolchain quirks
- This is a **single package**, not a monorepo. `pnpm-workspace.yaml` declares `allowBuilds` (esbuild, sharp) and `minimumReleaseAge: 1440`.
- `sharp` is required for Astro's image optimization and needs install scripts to run (already allow-listed).

## Deploy
- GitHub Pages via `.github/workflows/deploy.yml` using `withastro/action@v6`, which sets `DEPLOY_TARGET=pages` to select the Pages base path in `astro.config.mjs`.
- Triggers on push to `main` and via manual `workflow_dispatch`.
- Live URL: https://novafluxx.github.io/

## Conventions
- Relative imports for local files (`../components/Nav.astro`); no TS path alias is configured.
- PascalCase for `.astro` components, camelCase for TS, kebab-case for CSS classes.
- TypeScript extends `astro/tsconfigs/strict`; prefer explicit types over inference.

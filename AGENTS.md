# AGENTS.md

Quick reference for agentic coding agents working in this repository.
For deeper architecture prose (animated background layering, Safari iOS status-bar theming, glass-card variants), see `CLAUDE.md` — but trust the code over `CLAUDE.md` when versions/details conflict.

## Commands
- `pnpm install` — install deps. Use pnpm (Corepack-pinned to `pnpm@11.5.1` in `package.json`); never Bun/npm, even though `.claude/settings.json` happens to allow `bun run build`.
- `pnpm dev` — dev server at `localhost:4321` (served from base `/`).
- `pnpm build` — production build to `./dist/` (served from base `/my-personal-website/`).
- `pnpm preview` — preview the production build locally before pushing.
- No lint, formatter, test, or typecheck command is configured. `astro check` is not set up either (`@astrojs/check` is not installed); running it prompts to install the package. Treat `pnpm build` as the de-facto verification step — a clean build is the signal that types and templates are valid.

## Dev vs prod base path
`astro.config.mjs` sets `base` to `/my-personal-website/` in production but `/` in dev. Use `import.meta.env.BASE_URL` for internal links/paths — never hardcode `/my-personal-website/...` or assume `/`.

## Astro 6 content collections (gotchas)
This repo uses the Astro 6 content-layer API, which differs from Astro 4:
- Config lives at `src/content.config.ts` (NOT `src/content/config.ts`).
- Use the `glob()` loader from `astro/loaders` (NOT `type: "content"`).
- Import `z` from `astro/zod` (NOT from `astro:content`).
- Render an entry with `render(entry)` imported from `astro:content` (NOT `entry.render()`).
- The entry identifier is `entry.id` (NOT `entry.slug`).

Markdown source files live in `src/content/pages/*.md`; frontmatter schema (`title`, `description`, `published`, `updated`, `heroImage`) is defined in `src/content.config.ts`.

## Routing & layouts
- `src/pages/index.astro` — home page.
- `src/pages/404.astro` — custom error page.
- `src/pages/[...slug].astro` — dynamic route that renders each markdown collection entry through `src/layouts/MarkdownLayout.astro`, which wraps `src/layouts/Layout.astro` and builds a TOC from `headings`. (README's "Project Structure" omits this route — trust the code.)
- `src/layouts/Layout.astro` — master layout (fixed header, footer, full-page animated background). Every page must use it.
- Client-side TS lives in `src/scripts/{nav,animations,smooth-scroll}.ts` and is loaded via `<script is:inline>` in `Layout.astro` for immediate execution (no client framework / view-transition lifecycle).

## Styling
- Tailwind CSS v4 via `@tailwindcss/vite`; apply utility classes inline.
- All custom CSS lives in `src/styles/global.css` (~1100 lines) — do not scatter component-scoped CSS files.
- Theming via CSS custom properties on `:root` / `:root.dark`; dark mode is toggled by adding the `dark` class to `<html>` (see `src/scripts/nav.ts`). Animations are prefixed by purpose (e.g. `float-orb-refined`, `mesh-float`).

## Critical constraint: keep `<body>` transparent
The animated background uses negative `z-index` layers that are only visible because `body` has a transparent background. Do NOT set an opaque `background-color` on `body` — it breaks the parallax/background stack. Safari iOS 18.1+ status-bar theming is handled separately via `<html>` background + a near-transparent fixed `#site-header`; read `CLAUDE.md`'s "Safari iOS Status Bar Theming" section before touching `updateThemeColor()` in `nav.ts`, and do not raise header background opacity above 0.02.

## Toolchain quirks
- This is a **single package**, not a monorepo. `pnpm-workspace.yaml` only declares `allowBuilds` (esbuild, sharp) and an `overrides` pin of `esbuild` to `0.28.1` — the pin is intentional, do not "fix" it.
- `sharp` is required for Astro's image optimization and needs install scripts to run (already allow-listed).

## Deploy
- GitHub Pages via `.github/workflows/deploy.yml` using `withastro/action@v6` (note: v6, not v5 as `CLAUDE.md` states).
- Triggers on push to `main` and via manual `workflow_dispatch`.
- Live URL: https://novafluxx.github.io/my-personal-website/

## Conventions
- Relative imports for local files (`../components/Nav.astro`) — no TS path alias is configured.
- PascalCase for `.astro` components, camelCase for TS, kebab-case for CSS classes.
- TypeScript extends `astro/tsconfigs/strict`; prefer explicit types over inference.

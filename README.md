[![Deploy to GitHub Pages](https://github.com/novafluxx/novafluxx.github.io/actions/workflows/deploy.yml/badge.svg?branch=main)](https://github.com/novafluxx/novafluxx.github.io/actions/workflows/deploy.yml)
# Personal Portfolio Website

Portfolio site for Justin High (QA Analyst & Automation Engineer) — Astro 7, Tailwind CSS v4, static deploy to GitHub Pages.

🌐 **Live Site**: [novafluxx.github.io](https://novafluxx.github.io)

## Tech Stack

- **Framework**: Astro 7 (static)
- **Styling**: Tailwind CSS v4 + `src/styles/global.css`
- **Package manager**: pnpm (version pinned via `packageManager` in `package.json`)
- **Icons**: Font Awesome 7 (CDN)
- **Fonts**: Space Grotesk (display) + Manrope (body) via Google Fonts
- **Images**: Astro assets + `sharp`
- **Deploy**: GitHub Pages via `withastro/action`

## Project structure

```text
src/
├── components/     # Nav.astro
├── images/         # Source images (optimized at build)
├── layouts/        # Layout.astro
├── pages/          # index.astro, 404.astro
├── scripts/        # Client TS (nav, animations, smooth-scroll, hero-3d)
└── styles/         # global.css
```

## Commands

| Command | Action |
| :------ | :----- |
| `pnpm install` | Install dependencies |
| `pnpm dev` | Dev server at `localhost:4321` (base `/`) |
| `pnpm build` | Production build to `./dist/` (Pages base when `DEPLOY_TARGET=pages`) |
| `pnpm preview` | Preview the production build |
| `pnpm check` | Typecheck via `astro check` |

Use **pnpm** (not npm/Bun). Treat `pnpm build` and `pnpm check` as the verification steps.

## Features

- Dual theme (sunrise light / cosmic dark) with localStorage + OS preference
- View-transition theme toggle where supported
- Full-page animated background + constellation canvas (`hero-3d.ts`)
- Section nav with active state + adaptive contrast over aviation
- Selected work (FileCrypter stack comparison, archived High Notes), quality practice (healthcare ROI), aviation, contact
- Project screenshots via `astro:assets`
- SEO basics: meta description, Open Graph / Twitter tags when `site` is set
- Skip link and theme-toggle accessibility state
- Custom 404
- Safari iOS status-bar theming (html + meta + near-transparent fixed header)

## Base path and deploy target

The repo is a GitHub Pages **user site** (`novafluxx.github.io`), so it is served from the domain root: `base` is `/` for every target. `DEPLOY_TARGET=pages` only selects `site` (the canonical origin used for canonical/OG URLs); for root deploys elsewhere, set `SITE_URL`.

Still use `import.meta.env.BASE_URL` for internal paths rather than a leading `/` — it keeps a future subpath deploy from breaking every asset.

## Deployment

- **Workflow**: `.github/workflows/deploy.yml`
- **Triggers**: push to `main`, or manual `workflow_dispatch`
- **Live URL**: https://novafluxx.github.io/

## Adding pages

1. Add `.astro` under `src/pages/`
2. Wrap content in `Layout`
3. Link from `Nav.astro` if it should appear in the shell
4. Prefer existing section / project-card / surface patterns in `global.css`

## License

Personal portfolio website © Justin High

---

Built with [Astro 7](https://astro.build)

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

A condensed quick-reference for coding agents also exists at `AGENTS.md`; when the two conflict, trust the code.

## Project Overview

Personal portfolio website for Justin High (QA Analyst & Automation Engineer) built with Astro 7 and Tailwind CSS 4. Deployed to GitHub Pages.

**Tech Stack:**
- Astro 7 (static site generator)
- Tailwind CSS 4 (via Vite plugin)
- TypeScript 6
- GitHub Pages (deployment)
- pnpm (package manager)

## Development Commands

| Command | Purpose |
|---------|---------|
| `pnpm install` | Install dependencies |
| `pnpm dev` | Start dev server at localhost:4321 |
| `pnpm build` | Build production site to ./dist/ |
| `pnpm preview` | Preview build locally |
| `pnpm check` | Run TypeScript type checking (`astro check`) |

**Note:** Use `pnpm` commands via Corepack, not Bun or npm. The project uses pnpm as its package manager. Treat `pnpm build` and `pnpm check` as the verification steps.

## Architecture

### File-Based Routing

Pages are located in `src/pages/` and use Astro's file-based routing:
- `index.astro` - Main portfolio page (home): `#hero`, `#work`, `#experience`, `#aviation`, `#contact`
- `404.astro` - Custom error page

Each page imports and uses the Layout component from `src/layouts/Layout.astro`.

### Component Structure

**Layout System:**
- `src/layouts/Layout.astro` - Master layout with skip link, header, footer, and full-page animated background
  - Optional `description` prop (default meta/OG description)
  - Open Graph / Twitter meta when `Astro.site` is set (Pages deploy)
  - Fixed navigation header (60px height)
  - Footer with social links (GitHub, LinkedIn)
  - Full-page animated background layers (orbs, gradients, grid, noise)

**Components:**
- `src/components/Nav.astro` - Navigation bar
  - Theme toggle (dynamic `aria-label` / `aria-pressed` via `nav.ts`)
  - Section anchor links with FontAwesome icons
  - Responsive mobile-friendly layout

### Styling System

All styles are centralized in `src/styles/global.css` (~1,750 lines):

**CSS Custom Properties:**
- Theme variables defined in `:root` and `:root.dark` for dark mode
- Fluid typography scale using `clamp()` (--text-xs through --text-5xl)
- Dual palette: sunrise/rose light theme and cosmic blue/slate dark theme

**Homepage surfaces (current):**
- Section shells, project cards (`.project-card`, featured/dotnet/notes variants), toolkit, experience highlights, practice flow, quality console
- Prefer matching those patterns for new work/experience UI
- Legacy `.glass-card*` rules may remain in CSS; they are not the primary homepage pattern

**Background System:**
The site uses a multi-layer full-page animated background:
1. HTML element - Solid background-color (for Safari iOS status bar detection)
2. Body element - **Transparent background** (allows layers below to show)
3. Base gradient (`body::before`, `body::after`)
4. Glow spots (`.page-glow-spots`)
5. Noise texture (`.page-noise`)
6. Grid overlay (`.page-grid`)
7. Floating orbs (`.page-orb-1`, `.page-orb-2`, `.page-orb-3`)

All layers animate independently with different timing and blend modes. The body must remain transparent to allow the background layers (which use negative z-index) to be visible.

**Key Animations:**
- `fadeInUp` - Scroll-triggered entrance animations
- `float-orb-refined` - Floating orb movement
- `mesh-float` - Organic mesh gradient animation
- `gradient-shift` - Animated gradient borders
- `glow-pulse` - Pulsing glow effects

### JavaScript/TypeScript

Located in `src/scripts/`. Loading: `nav.ts` is loaded from `Nav.astro`; `animations.ts`, `smooth-scroll.ts`, and `hero-3d.ts` are loaded from `index.astro`. `Layout.astro` contains only a small inline (`is:inline`) pre-paint script that sets the theme and Safari status-bar color before render. There is no client framework.

**nav.ts** (Theme & Navigation):
- Manages dark/light theme toggle with localStorage persistence and View Transitions when available
- Updates Safari iOS status bar color via `updateThemeColor()` function (see Safari iOS Status Bar Theming section)
- Syncs theme control accessible name/state (`aria-label`, `aria-pressed`)
- Active section via scroll position (activation line ~20% of viewport height), with end-of-document handling for the last section
- Applies adaptive navigation styling based on section background (e.g. aviation)
- Adds `.nav-over-dark` or `.nav-over-light` classes to nav element

**animations.ts** (Scroll Animations):
- Uses IntersectionObserver to trigger animations on scroll
- Applies `.animated` class to elements with `.animate-on-scroll`
- Re-initializes on Astro page transitions

**smooth-scroll.ts**:
- Handles smooth scrolling behavior for anchor links (accounts for fixed header offset)

**hero-3d.ts** (Constellation Background):
- Dependency-free canvas 2D particle field with perspective projection, constellation lines, pointer-driven camera parallax, and hero content tilt
- Renders to `#constellation-canvas` but is visible across the whole homepage; per-section intensity comes from the `SECTION_STRENGTHS` map keyed by section ID — update it when adding or renaming sections
- Theme-aware palettes (swaps when the `dark` class on `<html>` changes, via MutationObserver); pauses when the tab is hidden or the hero is off-screen; respects `prefers-reduced-motion` by painting a single static frame
- Also drives the occasional RGB-split "glitch" flicker on the hero name

All scripts self-initialize on load and re-initialize on `astro:page-load` transitions.

### Images

- `src/images/` holds sources optimized at build time with `sharp` via `astro:assets`
- Examples: aviation background (`flight-line.jpg`), FileCrypter product stills
- Prefer `Image` / `getImage` from `astro:assets` for new assets

### GitHub Pages Deployment

Automated deployment via GitHub Actions:
- Workflow file: `.github/workflows/deploy.yml`
- Uses official Astro action (`withastro/action@v6`)
- Configured with `site` and `base` in `astro.config.mjs`
- Serves static files from ./dist/ via GitHub Pages CDN

## Design Patterns

### Theme Toggle
- Theme state stored in localStorage as `'theme'` key
- HTML element gets `'dark'` or `'light'` class
- CSS uses `:root.dark` selector for dark mode overrides
- Theme is initialized before page render to prevent flash

### Safari iOS Status Bar Theming
**CRITICAL:** Safari iOS 18.1+ changed how it detects status bar colors. The implementation uses a three-pronged approach:

1. **HTML background-color** - Solid opaque color (light pearl / dark slate; see `THEME_COLORS` in `nav.ts` and the inline script in `Layout.astro`) set on `<html>`
2. **theme-color meta tag** - Updated dynamically and re-inserted into DOM to force Safari recognition
3. **Fixed header background-color** - Semi-transparent rgba color (~0.01 opacity) on `#site-header` element

**Why this approach:**
- Safari iOS 18.1+ reads `background-color` of fixed position elements for status bar theming
- The header uses very low opacity so Safari detects it without creating visible artifacts
- All three values must be synchronized when theme toggles

**Implementation locations:**
- Inline script in `Layout.astro` (sets initial state before render)
- `updateThemeColor()` function in `nav.ts` (updates on theme toggle)

**DO NOT:**
- Make body background opaque (breaks parallax and background layers)
- Remove background-color from fixed header (breaks Safari iOS 18.1+ detection)
- Increase header background opacity above 0.02 (creates visible block at top)

### Section-Based Navigation
- Navigation links are anchor links to section IDs (`#hero`, `#work`, `#experience`, `#aviation`, `#contact`)
- Active section is derived from scroll position (not a fixed 50% IntersectionObserver threshold)
- Navigation style adapts to background (light text over dark sections such as aviation)

### Responsive Design
- Mobile breakpoint: 768px (additional layout breakpoints exist for project cards, etc.)
- Touch-optimized backdrop-filter blur values where glass-like surfaces remain
- Navigation icons displayed prominently on mobile; labels hide except on the active link

## Adding New Pages

1. Create `.astro` file in `src/pages/` (e.g., `projects.astro`)
2. Import and use Layout component:
   ```astro
   ---
   import Layout from "../layouts/Layout.astro";
   ---
   <Layout title="Page Title">
     <!-- content here -->
   </Layout>
   ```
3. Add navigation link to `src/components/Nav.astro` with appropriate FontAwesome icon if it should appear in the shell
4. Follow existing section / project-card / surface patterns in `global.css` (prefer matching nearby homepage styles)

## Deployment

**Method:** GitHub Pages via GitHub Actions
- Workflow: `.github/workflows/deploy.yml`
- Triggers: Automatic on push to `main`, or manual via Actions tab
- Site URL: `https://novafluxx.github.io/my-personal-website/`

**Build Process:**
1. GitHub Actions runner checks out code
2. Uses official Astro action (`withastro/action@v6`) with pnpm
3. Builds site to ./dist/
4. Uploads artifact to GitHub Pages
5. Deploys to GitHub Pages CDN with automatic HTTPS

**Build Output:**
- Astro builds static HTML/CSS/JS to ./dist/
- No server-side rendering (pure static site)
- Assets served through GitHub Pages CDN

**Manual Deployment:**
- Navigate to Actions tab in GitHub repository
- Select "Deploy to GitHub Pages" workflow
- Click "Run workflow" button

**Configuration:**
- `astro.config.mjs` switches on the `DEPLOY_TARGET` env var: when set to `pages` (done in `deploy.yml`), `site` is `https://novafluxx.github.io` and `base` is `/my-personal-website/`; otherwise (dev, or root deploys like Coolify) `base` is `/` and `site` comes from the optional `SITE_URL` env var
- Because `base` differs between dev and Pages, use `import.meta.env.BASE_URL` for internal links/paths — never hardcode `/my-personal-website/...`
- GitHub Pages source set to "GitHub Actions" in repository settings

## Important Considerations

**TypeScript:**
- Configuration extends `astro/tsconfigs/strict`
- Type checking available via `pnpm check`
- All TypeScript files in src/scripts/ are client-side only

**Accessibility:**
- Skip link to `#main-content` in `Layout.astro`
- Maintain focus-visible states on interactive elements
- Respect prefers-reduced-motion media query (animations / constellation behavior reduced)
- Use semantic HTML and ARIA labels where appropriate
- Theme toggle exposes current mode via accessible name and `aria-pressed`

**Performance:**
- Keep backdrop-filter usage optimized (reduce blur on mobile)
- Avoid adding heavy images without `astro:assets` optimization
- Constellation canvas caps particle count and DPR; pauses when appropriate

**Image Optimization (sharp):**
- Astro's default image service uses `sharp` at build time to optimize images from `src/images/`
- `sharp` is listed as a **direct dependency** in `package.json` even though it's only consumed by Astro. This is intentional: Astro declares `sharp` as an `optionalDependency`, and pnpm's strict `node_modules` layout can leave that optional dep unresolvable. Astro's docs recommend installing `sharp` manually when using pnpm
- **Keep `sharp`'s version range aligned with Astro's** (Astro 7.0.6 accepts `^0.34.0 || ^0.35.0`; the direct dep uses `^0.35.3`). Don't bump `sharp` outside Astro's accepted range; the 0.x minors are disjoint, so pnpm would install a second, unused copy while Astro keeps using its own. Move them together when Astro widens its range, and run `pnpm dedupe` after changing the range — a stale lockfile can otherwise keep two resolved copies even when the ranges overlap

**Browser Compatibility:**
- Uses modern CSS features (backdrop-filter, custom properties, clamp())
- Includes -webkit- prefixes for backdrop-filter
- Supports latest 2 versions of major browsers

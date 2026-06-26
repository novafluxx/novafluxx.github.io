# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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
| `pnpm exec astro check` | Run TypeScript type checking |

**Note:** Use `pnpm` commands via Corepack, not Bun or npm. The project uses pnpm as its package manager.

## Architecture

### File-Based Routing

Pages are located in `src/pages/` and use Astro's file-based routing:
- `index.astro` - Main portfolio page (home)
- `404.astro` - Custom error page

Each page imports and uses the Layout component from `src/layouts/Layout.astro`.

### Component Structure

**Layout System:**
- `src/layouts/Layout.astro` - Master layout with header, footer, and full-page animated background
  - Includes fixed navigation header (60px height)
  - Main content area with max-width of 1200px
  - Footer with social links (GitHub, LinkedIn)
  - Full-page animated background layers (orbs, gradients, grid, noise)

**Components:**
- `src/components/Nav.astro` - Navigation bar with glassmorphism design
  - Theme toggle button (dark/light mode)
  - Section anchor links with FontAwesome icons
  - Responsive mobile-friendly layout

### Styling System

All styles are centralized in `src/styles/global.css` (~1,113 lines):

**CSS Custom Properties:**
- Theme variables defined in `:root` and `:root.dark` for dark mode
- Fluid typography scale using `clamp()` (--text-xs through --text-5xl)
- Color palette: blues (#60a5fa), purples (#a78bfa), slate grays

**Glass Card Variants:**
- `.glass-card` - Standard glassmorphic card with backdrop blur
- `.glass-card-primary` - Enhanced blur for main content
- `.glass-card-secondary` - Lighter variant for supporting content
- `.glass-card-accent` - Featured cards with animated gradient border

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

Located in `src/scripts/`:

**nav.ts** (Theme & Navigation):
- Manages dark/light theme toggle with localStorage persistence
- Updates Safari iOS status bar color via `updateThemeColor()` function (see Safari iOS Status Bar Theming section)
- Detects active section using IntersectionObserver
- Applies adaptive navigation styling based on section background
- Adds `.nav-over-dark` or `.nav-over-light` classes to nav element

**animations.ts** (Scroll Animations):
- Uses IntersectionObserver to trigger animations on scroll
- Applies `.animated` class to elements with `.animate-on-scroll`
- Re-initializes on Astro page transitions

**smooth-scroll.ts**:
- Handles smooth scrolling behavior for anchor links

These scripts are imported in the Layout component using `<script>` tags with `is:inline` for immediate execution.

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

1. **HTML background-color** - Solid opaque color (`#fdf2f8` light, `#0f172a` dark) set on `<html>` element
2. **theme-color meta tag** - Updated dynamically and re-inserted into DOM to force Safari recognition
3. **Fixed header background-color** - Semi-transparent rgba color (0.01 opacity) on `#site-header` element

**Why this approach:**
- Safari iOS 18.1+ reads `background-color` of fixed position elements for status bar theming
- The header uses very low opacity (0.01) so Safari detects it without creating visible artifacts
- All three values must be synchronized when theme toggles

**Implementation locations:**
- Inline script in `Layout.astro` (sets initial state before render)
- `updateThemeColor()` function in `nav.ts` (updates on theme toggle)

**DO NOT:**
- Make body background opaque (breaks parallax and background layers)
- Remove background-color from fixed header (breaks Safari iOS 18.1+ detection)
- Increase header background opacity above 0.02 (creates visible block at top)

### Section-Based Navigation
- Navigation links are anchor links to section IDs
- Active section detected via IntersectionObserver with 50% threshold
- Navigation style adapts to background (light text over dark sections, vice versa)

### Responsive Design
- Mobile breakpoint: 768px
- Parallax backgrounds disabled on mobile for performance
- Touch-optimized backdrop-filter blur values (reduced from 20px to 12px)
- Navigation icons displayed prominently on mobile

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
3. Add navigation link to `src/components/Nav.astro` with appropriate FontAwesome icon
4. Follow existing glass card patterns for consistent styling

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
- `astro.config.mjs` includes `site: 'https://novafluxx.github.io'` and a conditional `base` (`'/my-personal-website/'` in production, `'/'` in dev)
- GitHub Pages source set to "GitHub Actions" in repository settings

## Important Considerations

**TypeScript:**
- Configuration extends `astro/tsconfigs/strict`
- Type checking available via `pnpm exec astro check`
- All TypeScript files in src/scripts/ are client-side only

**Accessibility:**
- Maintain focus-visible states on interactive elements
- Respect prefers-reduced-motion media query (animations disabled if set)
- Use semantic HTML and ARIA labels where appropriate

**Performance:**
- Keep backdrop-filter usage optimized (reduce blur on mobile)
- Avoid adding heavy images without optimization
- Test parallax backgrounds on mobile devices

**Browser Compatibility:**
- Uses modern CSS features (backdrop-filter, custom properties, clamp())
- Includes -webkit- prefixes for backdrop-filter
- Supports latest 2 versions of major browsers

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio website for Justin High (QA Analyst & Automation Engineer) built with Astro 5 and Tailwind CSS 4. Deployed to Cloudflare Workers at novafluxx.org.

**Tech Stack:**
- Astro 5.16.4 (static site generator)
- Tailwind CSS 4.1.17 (via Vite plugin)
- TypeScript 5.9.3
- Cloudflare Workers (deployment)
- Wrangler 4.53.0 (deployment CLI)
- Bun (package manager)

## Development Commands

| Command | Purpose |
|---------|---------|
| `bun install` | Install dependencies |
| `bun dev` | Start dev server at localhost:4321 |
| `bun build` | Build production site to ./dist/ |
| `bun preview` | Preview build locally |
| `bun preview:worker` | Build and preview with Wrangler (Cloudflare) |
| `bun deploy:cf` | Build and deploy to Cloudflare Workers |
| `bun deploy:pages` | Build and deploy to Cloudflare Pages (alternative) |
| `bun astro check` | Run TypeScript type checking |

**Note:** Use `bun` commands, not `npm` or `pnpm`. The project uses Bun as its package manager.

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

All styles are centralized in `src/styles/global.css` (~1,146 lines):

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
1. Base gradient (`body::before`, `body::after`)
2. Glow spots (`.page-glow-spots`)
3. Noise texture (`.page-noise`)
4. Grid overlay (`.page-grid`)
5. Floating orbs (`.page-orb-1`, `.page-orb-2`, `.page-orb-3`)

All layers animate independently with different timing and blend modes.

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

### Cloudflare Workers

`src/index.js` is the Workers entry point:
- Minimal implementation that delegates to ASSETS binding
- Serves static files from ./dist/
- Configured via `wrangler.toml` with custom domains

## Design Patterns

### Theme Toggle
- Theme state stored in localStorage as `'theme'` key
- HTML element gets `'dark'` or `'light'` class
- CSS uses `:root.dark` selector for dark mode overrides
- Theme is initialized before page render to prevent flash

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

**Primary Method:** Cloudflare Workers via Wrangler
- Configured in `wrangler.toml`
- Custom domains: novafluxx.org, www.novafluxx.org
- Deploy with `bun deploy:cf`

**Alternative:** Cloudflare Pages
- Deploy with `bun deploy:pages`
- Uses same ./dist/ output directory

**Build Output:**
- Astro builds static HTML/CSS/JS to ./dist/
- No server-side rendering (pure static site)
- Assets served through Workers ASSETS binding

## Important Considerations

**TypeScript:**
- Configuration extends `astro/tsconfigs/strict`
- Type checking available via `bun astro check`
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

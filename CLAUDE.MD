# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal portfolio website for Justin High (QA Analyst & Automation Engineer) built with Astro and styled with Tailwind CSS v4. The site is deployed to Cloudflare Workers using custom domains (novafluxx.org).

**Recent Major Changes** (Commit bc8a79a, Dec 2, 2025):
- Redesigned from multi-page to **single-page application (SPA)** with smooth-scrolling sections
- Added intelligent navigation color switching based on section background
- Implemented scroll-triggered animations with IntersectionObserver
- Expanded global.css from ~200 to 829 lines with comprehensive animation system

## Tech Stack

- **Framework**: Astro 5.16.3 (Static Site Generation)
- **Styling**: Tailwind CSS 4.1.17 (integrated via Vite plugin)
- **Package Manager**: pnpm
- **Language**: TypeScript
- **Deployment**: Cloudflare Workers (migrated from Cloudflare Pages)
- **Icons**: Font Awesome 7.0.1
- **Fonts**: Google Fonts (Syne, Manrope)

## Project Structure

```
astro-personal-website/
├── public/                     # Static assets served directly
│   ├── images/                 # Image assets
│   │   └── flight-line.jpg    # Aviation section background
│   ├── favicon.png            # Site favicon (PNG)
│   └── favicon.svg            # Site favicon (SVG)
├── src/
│   ├── components/            # Reusable Astro components
│   │   └── Nav.astro         # Navigation with intelligent color switching (181 lines)
│   ├── layouts/              # Layout templates
│   │   └── Layout.astro      # Main layout with header/footer/structure (80 lines)
│   ├── pages/                # Page files
│   │   ├── index.astro       # Single-page application with all sections (407 lines)
│   │   └── 404.astro         # Custom 404 error page
│   ├── scripts/              # Client-side TypeScript
│   │   ├── animations.ts     # Intersection Observer scroll animations (39 lines)
│   │   └── smooth-scroll.ts  # Smooth scroll with fixed header offset (50 lines)
│   ├── styles/               # Global styles
│   │   └── global.css        # Comprehensive styling system (829 lines)
│   └── index.js              # Cloudflare Workers entry point (8 lines)
├── .astro/                   # Astro-generated types and cache
├── astro.config.mjs          # Astro configuration
├── wrangler.toml             # Cloudflare Workers configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Dependencies and scripts
```

## Development Commands

```bash
# Development
pnpm install              # Install dependencies
pnpm dev                  # Start dev server at localhost:4321
pnpm build                # Build for production to ./dist/

# Preview & Testing
pnpm preview              # Preview production build locally
pnpm preview:worker       # Build and preview with Wrangler

# Deployment
pnpm deploy:cf            # Build and deploy to Cloudflare Workers
pnpm deploy:pages         # Build and deploy to Cloudflare Pages (legacy)
```

## Architecture

### Single-Page Application Structure

The site is a **single-page application** with all content in `src/pages/index.astro`. The page contains 5 major sections accessible via hash-based anchor navigation:

1. **#hero** - Full-height hero with animated gradient background, floating orbs, and geometric shapes
2. **#about** - "What I Do" section with 3-column grid of glass cards (QA, Automation, Aviation)
3. **#experience** - Professional experience timeline and technical skills grid
4. **#aviation** - Aviation journey section with parallax background image
5. **#contact** - Contact section with social links (LinkedIn, GitHub)

**Navigation**: Uses smooth scrolling to section anchors with 60px offset for fixed header.

### Layout System
- **Layout.astro**: Main layout wrapper that provides the overall page structure
  - Fixed header with navigation (60px height, z-index 100)
  - Main content area with max-width of 1200px and `mt-[60px]` offset
  - Footer with social links (GitHub, LinkedIn)
  - Dark mode enabled by default (`class="dark"` on `<html>`)
  - Pointer-events-none on header except nav for click-through

### Navigation System
- **Nav.astro**: Glassmorphism-style navigation bar with intelligent color switching
  - **Intelligent Color Switching** (key feature):
    - `.nav-over-dark` class: Light text (#f1f5f9) for dark sections (hero, aviation)
    - `.nav-over-light` class: Dark text (#1e293b) for light sections (about, experience)
    - Uses IntersectionObserver to detect which section is underneath nav
  - **Active Section Detection**: Highlights current section in navigation
  - **Theme Toggle**: Sun/moon icons (fa-sun/fa-moon) with localStorage persistence
  - **Responsive Design**: Stacks vertically on mobile, horizontal on desktop
  - **Animations**: Hover scale (1.05x), active state with gradient underline (#60a5fa to #a78bfa)
  - Uses Font Awesome icons alongside text labels

### Client-Side Scripts

#### animations.ts
- IntersectionObserver-based scroll animations
- Adds `.animated` class to elements with `.animate-on-scroll`
- Threshold: 0.1, rootMargin: '0px 0px -50px 0px'
- Unobserves after animation to prevent re-triggering
- Re-initializes on `astro:page-load` event

#### smooth-scroll.ts
- Smooth scrolling for anchor links (hash-based navigation)
- Accounts for fixed 60px header offset
- Uses `window.scrollTo({ behavior: 'smooth' })`
- Updates browser history without jumping
- Re-initializes on page transitions

### Styling Architecture

#### global.css (829 lines)
Comprehensive styling system with:

**CSS Custom Properties:**
- **Light Mode Variables**: `--text-color: #1e293b`, `--background-color: #f8fafc`
- **Dark Mode Variables**: `--text-color: #f1f5f9`, `--background-color: #0a0f1e`
- **Fluid Typography**: Using `clamp()` for responsive font sizes (--text-xs through --text-5xl)
- **Theme Colors**: primary (#0f172a), secondary (#3b82f6), accent (#8b5cf6)

**Font System:**
- **Display Font**: 'Syne' (weights: 400, 600, 700, 800) - for headings
- **Sans Serif**: 'Manrope' (weights: 400, 500, 600, 700, 800) - for body text
- Both loaded from Google Fonts

**Glass Card Variants:**
- `.glass-card`: Base glassmorphism (blur 16px, saturate 150%)
- `.glass-card-primary`: Main content cards (blur 20px, saturate 180%)
- `.glass-card-secondary`: Supporting content (blur 16px, saturate 150%)
- `.glass-card-accent`: Featured content with animated gradient border
- All include hover effects: `translateY(-8px)` + `scale(1.02)`
- Dark mode variants with `rgba(30, 41, 59, 0.5-0.8)` backgrounds

**Animation Keyframes:**
- `fadeInUp`: Opacity + translateY(30px) - for scroll animations
- `slideInLeft`: From left with opacity
- `float`: Floating motion (-20px vertical)
- `gradient-shift`: Background position animation
- `gradient-rotate`: 360° gradient rotation for hero section
- `float-orb`: Complex 3D-like float with scale for floating orbs
- `iconBounce`: Scale + rotate combo for icon animations
- `pulse-glow`: Box shadow pulse animation

**Animation Utility Classes:**
- `.animate-on-scroll`: Triggers `fadeInUp` animation (0.6s) when entering viewport
- `.stagger-children`: Children animate with 0.1s-0.6s cascading delays

**Smart Section Styling:**
- `#about`: Radial gradient background (top, blue glow)
- `#experience`: Linear gradient background (purple glow)
- `#aviation`: Dark overlay with forced dark styling regardless of theme toggle
  - Background: `rgba(10, 15, 30, 0.85)` over parallax image
  - Text forced to white/light colors
  - Cards forced to dark mode styling

**Navigation Adaptive Styling:**
```css
/* nav-over-dark: Hero & Aviation sections */
nav.nav-over-dark {
  color: #f1f5f9 !important;
  background: rgba(15, 23, 42, 0.3);
}

/* nav-over-light: About & Experience sections */
nav.nav-over-light {
  color: #1e293b;
  background: rgba(255, 255, 255, 0.3);
}
```

### Routing & Navigation

**Hash-Based Navigation:**
- Navigation uses anchor links: `#hero`, `#about`, `#experience`, `#aviation`, `#contact`
- Smooth scroll handled by `smooth-scroll.ts`
- No traditional page routing (single HTML file)
- Only separate route: `/404` for custom error page

**Benefits of Single-Page Approach:**
- Instant navigation (no page loads)
- Seamless scroll animations
- Unified user experience
- Smaller build output (single HTML file)

## Deployment Configuration

### Cloudflare Workers (Current)
- Configured in `wrangler.toml`
- Custom domains: `novafluxx.org` and `www.novafluxx.org`
- Serves static assets from `./dist` directory
- Custom 404 page handling enabled
- Auto-trailing-slash HTML handling
- Entry point: `src/index.js` (simple asset fetch handler)

## Styling Guidelines

### Tailwind CSS v4
- Configured via `@tailwindcss/vite` plugin in `astro.config.mjs`
- Uses Tailwind utility classes extensively
- Custom theme values defined in `@theme` block in global.css
- **Class-based dark mode**: Configured using `@custom-variant dark (&:where(.dark, .dark *))` in global.css
- Dark mode utilities (e.g., `dark:bg-slate-900`) work by toggling `.dark` class on `<html>` element

### Global Styles Considerations
- Font Awesome icons may have global styles in `global.css`
- When using icons in components like navigation, may need to override with utility classes like `mb-0!` and text size classes
- Glass card styles are available via `.glass-card`, `.glass-card-primary`, `.glass-card-secondary`, `.glass-card-accent` classes
- **Theme-aware components**: Use `dark:` prefix for dark mode variants (e.g., `text-slate-900 dark:text-white`)
- **Forced dark sections**: Aviation section ignores theme toggle and stays dark

### Design System
- **Max Content Width**: 1200px
- **Primary Color Scheme**: Slate/Blue tones with purple accents
- **Font Families**:
  - Display: Syne (headings, hero text)
  - Sans: Manrope (body text, UI)
- **Icons**: Font Awesome 7.0.1 (loaded from CDN)
- **Default Theme**: Dark mode
- **Glassmorphism**: Consistent blur + saturation effects across all cards
- **Fluid Typography**: Responsive font sizes using CSS `clamp()`

## Key Conventions

### Component Development
- All pages should import and use `Layout.astro` for consistent structure
- Navigation links are defined in Nav.astro `links` array with Font Awesome icons
- Maintain the existing glassmorphism aesthetic for new components
- Use `.animate-on-scroll` class for scroll-triggered fade-in animations
- Use `.stagger-children` for cascading child animations

### Adding New Sections to Single-Page Layout
Since this is now a single-page site, adding content means adding sections to `src/pages/index.astro`:

1. **Add Section Markup**: Create new `<section id="section-name">` in index.astro
2. **Update Navigation**: Add link to `Nav.astro` links array with Font Awesome icon
3. **Add Section Styles**: Add section-specific styles to `global.css` if needed
4. **Consider Background**: Decide if section needs `.nav-over-dark` or `.nav-over-light` class
5. **Add Animations**: Use `.animate-on-scroll` and `.stagger-children` for entrance effects
6. **Update Observer**: If section needs special nav styling, update IntersectionObserver in Nav.astro

### Icon Usage
- Use Font Awesome 7.0.1 class names (e.g., `fa-solid fa-home`)
- Be aware of global icon styles in `global.css`
- Override global styles when necessary (especially in navigation/non-card contexts)
- Common icons in use:
  - Navigation: `fa-house`, `fa-user`, `fa-briefcase`, `fa-plane-up`, `fa-envelope`
  - Theme: `fa-sun`, `fa-moon`
  - Cards: `fa-code`, `fa-robot`, `fa-plane`, `fa-linkedin`, `fa-github`

### Animation Best Practices
- Use `.animate-on-scroll` for elements that should fade in when scrolling
- Use `.stagger-children` on parent containers for cascading animations
- Respect `prefers-reduced-motion` - animations are disabled for users who prefer reduced motion
- Keep animation durations reasonable (0.3s-0.6s)
- Use `will-change` sparingly for performance

### Performance Considerations
- Site generates single HTML file for main content (fast loading)
- Client-side scripts are minimal (~140 lines total TypeScript)
- Static assets served from Cloudflare Workers (global CDN)
- Font Awesome and Google Fonts loaded from CDN
- Intersection Observer used efficiently (unobserves after animation)

## Recent Changes Reference

**Commit bc8a79a** (Dec 2, 2025): "redesigned site to single page. Added intelligent text colors for navbar"
- Converted 4-page site to single-page application
- Added `src/scripts/animations.ts` and `src/scripts/smooth-scroll.ts`
- Expanded `global.css` from ~200 to 829 lines
- Removed `experience.astro`, `aviation.astro`, `contact.astro`
- Added intelligent navigation color switching
- Implemented scroll-triggered animations
- Added floating orbs and animated gradients to hero section

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal portfolio website for Justin High (QA Analyst & Automation Engineer) built with Astro and styled with Tailwind CSS v4. The site is deployed to Cloudflare Workers using custom domains (novafluxx.org).

## Tech Stack

- **Framework**: Astro 5.16.2 (Static Site Generation)
- **Styling**: Tailwind CSS 4.1.17 (integrated via Vite plugin)
- **Package Manager**: pnpm
- **Language**: TypeScript
- **Deployment**: Cloudflare Workers (migrated from Cloudflare Pages)
- **Icons**: Font Awesome 7.0.1
- **Fonts**: Google Fonts (Inter)

## Project Structure

```
astro-personal-website/
├── public/                     # Static assets served directly
│   ├── images/                 # Image assets
│   ├── favicon.png            # Site favicon (PNG)
│   └── favicon.svg            # Site favicon (SVG)
├── src/
│   ├── components/            # Reusable Astro components
│   │   └── Nav.astro         # Navigation component (glassmorphism style)
│   ├── layouts/              # Layout templates
│   │   └── Layout.astro      # Main layout with header/footer/structure
│   ├── pages/                # File-based routing (each file = route)
│   │   ├── index.astro       # Home page (/)
│   │   ├── experience.astro  # Experience/resume page (/experience)
│   │   ├── aviation.astro    # Aviation interests page (/aviation)
│   │   ├── contact.astro     # Contact page (/contact)
│   │   └── 404.astro         # Custom 404 error page
│   ├── styles/               # Global styles
│   │   └── global.css        # Global CSS with theme vars & utilities
│   └── index.js              # Cloudflare Workers entry point
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

### Layout System
- **Layout.astro**: Main layout wrapper that provides the overall page structure
  - Fixed header with navigation (60px height)
  - Main content area with max-width of 1200px
  - Footer with social links (GitHub, LinkedIn)
  - Dark mode enabled by default (`class="dark"` on `<html>`)
  - All pages use `mt-[60px]` to account for fixed header

### Navigation
- **Nav.astro**: Glassmorphism-style navigation bar
  - Uses Font Awesome icons alongside text labels
  - Responsive design (stacks vertically on mobile, horizontal on desktop)
  - Active state highlighting with different colors
  - Fixed positioning via Layout.astro header

### Styling Architecture
- **global.css**: Contains CSS custom properties for theming and reusable component classes
  - Theme variables for light/dark mode (`:root` and `:root.dark`)
  - `.glass-card` class for card components
  - `.hero-section` for hero/banner areas
  - Global icon styles that apply to all `<i>` elements (2rem font size, margin-bottom)
  - **IMPORTANT**: When adding icons in non-card contexts (like navbar), you may need to override global icon styles (especially `margin-bottom: 1rem`)

### Routing
File-based routing in `src/pages/`:
- `/` → index.astro (home)
- `/experience` → experience.astro
- `/aviation` → aviation.astro
- `/contact` → contact.astro
- `/404` → 404.astro (custom error page)

## Deployment Configuration

### Cloudflare Workers (Current)
- Configured in `wrangler.toml`
- Custom domains: `novafluxx.org` and `www.novafluxx.org`
- Serves static assets from `./dist` directory
- Custom 404 page handling enabled
- Auto-trailing-slash HTML handling

## Styling Guidelines

### Tailwind CSS v4
- Configured via `@tailwindcss/vite` plugin in `astro.config.mjs`
- Uses Tailwind utility classes extensively
- Custom theme values defined in `@theme` block in global.css

### Global Styles Considerations
- Font Awesome icons have global styles in `global.css` (lines 118-125)
- These global icon styles include `margin-bottom: 1rem` and `font-size: 2rem`
- When using icons in components like navigation, override these with utility classes like `!mb-0` and appropriate text size classes
- Glass card styles are available via `.glass-card` class for consistent component styling

### Design System
- Max content width: 1200px
- Primary color scheme: Slate/Blue tones
- Font family: Inter (Google Fonts)
- Icons: Font Awesome 7.0.1 (loaded from CDN)
- Dark mode is the default theme

## Key Conventions

### Component Development
- All pages should import and use `Layout.astro` for consistent structure
- Navigation links are defined in Nav.astro and should be updated there when adding new routes
- Maintain the existing glassmorphism aesthetic for new components

### Adding New Pages
1. Create `.astro` file in `src/pages/`
2. Import Layout component: `import Layout from "../layouts/Layout.astro"`
3. Add navigation link to `Nav.astro` links array with Font Awesome icon
4. Follow existing page structure patterns

### Icon Usage
- Use Font Awesome 7.0.1 class names (e.g., `fa-solid fa-home`)
- Be aware of global icon styles in `global.css`
- Override global styles when necessary (especially in navigation/non-card contexts)

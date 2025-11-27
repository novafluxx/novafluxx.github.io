# CLAUDE.MD

## Project Overview

This is a personal website built with Astro and styled with Tailwind CSS v4. The site showcases a portfolio/personal brand with multiple pages including home, experience, aviation, and contact sections.

## Tech Stack

- **Framework**: Astro 5.16.0
- **Styling**: Tailwind CSS 4.1.17 (with Vite plugin)
- **Package Manager**: pnpm
- **Language**: TypeScript

## Project Structure

```
/
├── public/              # Static assets (images, fonts, etc.)
├── src/
│   ├── components/      # Reusable Astro components
│   │   └── Nav.astro   # Navigation component
│   ├── layouts/        # Layout templates
│   │   └── Layout.astro # Main layout wrapper
│   ├── pages/          # File-based routing
│   │   ├── index.astro      # Home page
│   │   ├── experience.astro # Experience/resume page
│   │   ├── aviation.astro   # Aviation interests page
│   │   └── contact.astro    # Contact page
│   └── styles/         # Global styles
│       └── global.css  # Global CSS styles
├── astro.config.mjs    # Astro configuration
├── tsconfig.json       # TypeScript configuration
└── package.json        # Dependencies and scripts
```

## Development Commands

```bash
pnpm install    # Install dependencies
pnpm dev        # Start dev server at localhost:4321
pnpm build      # Build for production to ./dist/
pnpm preview    # Preview production build locally
```

## Key Features

### Routing
- Uses Astro's file-based routing
- Each `.astro` file in `src/pages/` becomes a route
- Routes: `/`, `/experience`, `/aviation`, `/contact`

### Styling
- Tailwind CSS v4 integrated via Vite plugin
- Global styles in `src/styles/global.css`
- Component-scoped styles available in `.astro` files

### Components
- **Layout.astro**: Main layout wrapper (likely contains common HTML structure)
- **Nav.astro**: Navigation component (shared across pages)

## Development Guidelines

### Adding New Pages
1. Create a new `.astro` file in `src/pages/`
2. Use the Layout component for consistent structure
3. The file name becomes the URL route

### Adding Components
1. Create `.astro` files in `src/components/`
2. Import and use in pages or layouts
3. Follow existing component patterns

### Styling Approach
- Use Tailwind utility classes for styling
- Global styles go in `src/styles/global.css`
- Component-specific styles can use `<style>` tags in `.astro` files

### TypeScript
- Project uses TypeScript
- Type checking available via `astro check`
- TypeScript config in `tsconfig.json`

## Build & Deployment

The production build outputs to `./dist/` directory. This static output can be deployed to any static hosting service (Vercel, Netlify, Cloudflare Pages, etc.).

## Notes for AI Assistants

- This is a static site using Astro's SSG (Static Site Generation)
- Tailwind CSS v4 is integrated via the Vite plugin (@tailwindcss/vite)
- When modifying pages, maintain consistency with the existing navigation structure
- The site appears to be a personal portfolio with aviation interests
- Always test changes locally with `pnpm dev` before building

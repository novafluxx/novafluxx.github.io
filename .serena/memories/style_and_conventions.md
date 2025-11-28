# Style and Conventions

## TypeScript Configuration
- Extends `astro/tsconfigs/strict`
- Strict type checking enabled
- Includes `.astro/types.d.ts` and all project files
- Excludes `dist` directory

## Code Style
- **File Format**: `.astro` files for pages and components
- **Component Structure**: Frontmatter (TypeScript) + Template (HTML-like)
- **Props**: Defined using TypeScript interfaces
- **Imports**: ES modules with `.astro` extension for components

## Styling Architecture

### Tailwind CSS v4
- Configured via `@tailwindcss/vite` plugin in `astro.config.mjs`
- Extensive use of Tailwind utility classes
- Custom theme values defined in `@theme` block in `global.css`

### Global CSS Variables (global.css)
- **Theme variables**: Defined for both light and dark modes in `:root` and `:root.dark`
- **Color scheme**: Slate/Blue tones
  - Primary: #0f172a (dark) / #f1f5f9 (light)
  - Secondary: #3b82f6 / #60a5fa
  - Accent: #8b5cf6 / #a78bfa
- **Dark mode**: Default theme (html has `class="dark"`)

### Reusable CSS Classes
- `.glass-card`: Glassmorphism card components with backdrop blur, rounded corners, hover effects
- `.hero-section`: Hero/banner areas with gradient backgrounds
- Global icon styles: `i` elements have `font-size: 2rem`, `margin-bottom: 1rem`

### Design System
- **Max content width**: 1200px
- **Font family**: Inter (Google Fonts)
- **Icons**: Font Awesome 7.0.1
- **Fixed header height**: 60px (all pages use `mt-[60px]` to account for this)

## Component Development Guidelines
1. All pages should import and use `Layout.astro` for consistent structure
2. Navigation links defined in `Nav.astro` - update when adding new routes
3. Maintain glassmorphism aesthetic for new components
4. When using icons outside of cards (e.g., navbar), override global icon styles with classes like `!mb-0`

## Adding New Pages
1. Create `.astro` file in `src/pages/`
2. Import Layout: `import Layout from "../layouts/Layout.astro"`
3. Add navigation link to `Nav.astro` with Font Awesome icon
4. Follow existing page structure patterns

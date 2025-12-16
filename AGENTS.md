# AGENTS.md

Quick reference for AI coding agents working in this repository.

## Commands
- `bun dev` - Start dev server (localhost:4321)
- `bun build` - Build for production
- `bun preview` - Preview production build
- `bun astro check` - TypeScript type checking
- **No test suite configured** - This is a static portfolio site

## Code Style
- **Package Manager**: Use `bun` only (not npm/pnpm/yarn)
- **TypeScript**: Strict mode (`astro/tsconfigs/strict`), explicit `:void` return types
- **Imports**: Relative paths only (no aliases) - `../components/Nav.astro`, `../scripts/nav.ts`
- **Formatting**: Astro frontmatter uses `---`, scripts included with `<script src="../scripts/file.ts">`
- **CSS**: Centralized in `src/styles/global.css`, uses CSS custom properties (`--variable-name`) for theming
- **Naming**: kebab-case for files/classes, camelCase for JS/TS variables, PascalCase for components
- **Theme System**: `:root` and `:root.dark` for light/dark modes, localStorage key is `'theme'`
- **Error Handling**: Use optional chaining (`?.`) for ALL DOM queries, early returns for guards
- **Comments**: Inline for complex logic, section headers for major blocks (CSS: `/* ======== SECTION ======== */`)
- **Responsive**: Mobile breakpoint at 768px, use `clamp()` for fluid typography with CSS variables
- **Inline Styles**: Mix Tailwind classes (spacing/colors) + inline styles for typography using CSS vars

## Architecture Patterns
- **Astro Lifecycle**: Re-initialize interactive features on `astro:page-load` event for view transitions
- **Animations**: Use Intersection Observer + CSS classes pattern - add `.animated` class when in viewport
- **View Transitions API**: Always check `document.startViewTransition` support, provide instant fallback
- **CSS Animations**: Wrap modern features in `@supports` checks, respect `prefers-reduced-motion`
- **Base URL**: Use `import.meta.env.BASE_URL` for asset paths (GitHub Pages deployment support)

## Progressive Enhancement
- **Feature Detection**: Check browser API support before use, never assume availability
- **Fallback Pattern**: Modern browsers get animations/transitions, older browsers get functional instant changes
- **View Transitions**: 600ms duration with `cubic-bezier(0.4, 0, 0.2, 1)` easing for smooth feel

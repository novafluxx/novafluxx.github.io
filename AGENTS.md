# AGENTS.md

Quick reference for agentic coding agents working in this repository.

## Commands
- `pnpm install` - Install dependencies (use pnpm via Corepack, not Bun/npm)
- `pnpm dev` - Start dev server at localhost:4321
- `pnpm build` - Build production site to ./dist/
- `pnpm exec astro check` - Run TypeScript type checking
- No test suite configured

## Code Style
- **Package Manager**: Always use `pnpm` commands via Corepack, never Bun/npm
- **TypeScript**: Extends `astro/tsconfigs/strict`, type all functions and parameters
- **Imports**: Use relative imports for local files (`../components/Nav.astro`)
- **Formatting**: Tailwind classes inline, CSS in `src/styles/global.css` only
- **Naming**: camelCase for functions/variables, PascalCase for components, kebab-case for CSS classes
- **Types**: Prefer explicit types over inference, use `const` assertions for readonly objects
- **Error Handling**: Use optional chaining (`?.`) and nullish coalescing (`??`)
- **Comments**: Document complex logic (especially Safari iOS workarounds), avoid obvious comments
- **CSS**: Use CSS custom properties for theming, prefix animations with purpose (e.g., `float-orb-refined`)
- **HTML**: Keep body background transparent (allows negative z-index layers), maintain semantic structure
- **Scripts**: Use `is:inline` for immediate execution, TypeScript for all client-side code
- **Astro**: Place pages in `src/pages/`, use Layout component, follow file-based routing

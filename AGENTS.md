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
- **Imports**: Relative paths for components (`../components/Nav.astro`)
- **Formatting**: Astro frontmatter uses `---`, scripts imported with `is:inline` for immediate execution
- **CSS**: Centralized in `src/styles/global.css` (~1,146 lines), uses CSS custom properties for theming
- **Naming**: kebab-case for files/classes, camelCase for JS/TS variables, PascalCase for components
- **Theme System**: `:root` and `:root.dark` for light/dark modes, localStorage key is `'theme'`
- **Error Handling**: Use optional chaining (`?.`) for DOM queries, early returns for guards
- **Comments**: Inline for complex logic, section headers for major blocks (e.g., `// Theme Management`)
- **Responsive**: Mobile breakpoint at 768px, use `clamp()` for fluid typography

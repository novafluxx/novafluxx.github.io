# Deployment and Configuration

## Cloudflare Workers Deployment (Current)

### Configuration (wrangler.toml)
```toml
name = "astro-personal-website"
compatibility_date = "2025-11-28"
main = "src/index.js"

[[routes]]
pattern = "novafluxx.org"
custom_domain = true

[[routes]]
pattern = "www.novafluxx.org"
custom_domain = true

[assets]
directory = "./dist"
not_found_handling = "404-page"
html_handling = "auto-trailing-slash"
```

### Deployment Process
1. Build static site: `astro build` (outputs to `./dist`)
2. Wrangler deploys from `src/index.js` with assets from `./dist`
3. Custom domains configured for novafluxx.org and www.novafluxx.org
4. Custom 404 page handling enabled
5. Auto-trailing-slash HTML handling

### Quick Deploy
```bash
pnpm deploy:cf
```

## Astro Configuration (astro.config.mjs)
- Vite integration with Tailwind CSS plugin
- Static site generation mode (default)
- TypeScript support enabled

## Build Output
- Location: `./dist/`
- Contains: Static HTML, CSS, JS, and assets
- Ignored in `.gitignore`

## Environment
- Node.js project with ES modules
- Package manager: pnpm
- TypeScript with strict mode

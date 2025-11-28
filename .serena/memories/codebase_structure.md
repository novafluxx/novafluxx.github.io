# Codebase Structure

## Directory Layout
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
├── tsconfig.json             # TypeScript configuration (strict)
└── package.json              # Dependencies and scripts
```

## File-Based Routing
- `/` → src/pages/index.astro (home)
- `/experience` → src/pages/experience.astro
- `/aviation` → src/pages/aviation.astro
- `/contact` → src/pages/contact.astro
- `/404` → src/pages/404.astro (custom error page)

## Key Components
- **Layout.astro**: Main layout wrapper providing overall page structure, fixed header (60px), footer
- **Nav.astro**: Glassmorphism navigation bar with Font Awesome icons

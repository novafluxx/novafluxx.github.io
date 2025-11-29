# Personal Portfolio Website

A modern, responsive portfolio website for Justin High (QA Analyst & Automation Engineer) built with Astro and styled with Tailwind CSS v4.

🌐 **Live Site**: [novafluxx.org](https://novafluxx.org)

## 🚀 Tech Stack

- **Framework**: Astro 5.16.3
- **Styling**: Tailwind CSS v4.1.17
- **Deployment**: Cloudflare Workers
- **Package Manager**: pnpm
- **Icons**: Font Awesome 7.0.1
- **Fonts**: Google Fonts (Inter)

## 📁 Project Structure

```text
astro-personal-website/
├── public/                 # Static assets (images, favicons)
├── src/
│   ├── components/        # Reusable components (Nav.astro)
│   ├── layouts/          # Layout templates (Layout.astro)
│   ├── pages/            # File-based routing
│   │   ├── index.astro       # Home page
│   │   ├── experience.astro  # Experience/resume
│   │   ├── aviation.astro    # Aviation interests
│   │   ├── contact.astro     # Contact information
│   │   └── 404.astro         # Custom error page
│   ├── styles/           # Global CSS styles
│   └── index.js          # Cloudflare Workers entry
├── astro.config.mjs      # Astro configuration
├── wrangler.toml         # Cloudflare Workers config
└── package.json
```

## 🧞 Commands

All commands are run from the root of the project:

| Command                | Action                                              |
| :--------------------- | :-------------------------------------------------- |
| `pnpm install`         | Install dependencies                                |
| `pnpm dev`             | Start local dev server at `localhost:4321`          |
| `pnpm build`           | Build production site to `./dist/`                  |
| `pnpm preview`         | Preview build locally before deploying              |
| `pnpm preview:worker`  | Build and preview with Wrangler (Cloudflare)        |
| `pnpm deploy:cf`       | Build and deploy to Cloudflare Workers              |
| `pnpm astro ...`       | Run CLI commands like `astro add`, `astro check`    |

## ✨ Features

- **Glassmorphism Design**: Modern UI with frosted glass effects
- **Dark Mode**: Theme toggle with localStorage persistence
- **Responsive Navigation**: Mobile-friendly navigation with Font Awesome icons
- **Custom 404 Page**: Branded error handling
- **Optimized Performance**: Static site generation with Astro
- **Custom Domain**: Deployed to novafluxx.org via Cloudflare Workers

## 🎨 Design System

- **Color Scheme**: Slate/Blue tones with dark mode default
- **Typography**: Inter font family from Google Fonts
- **Max Width**: 1200px content container
- **Components**: Reusable glass card styling via `.glass-card` class

## 🚢 Deployment

The site is deployed to Cloudflare Workers with custom domain configuration:
- Primary domain: `novafluxx.org`
- Alternate domain: `www.novafluxx.org`

Deploy with: `pnpm deploy:cf`

## 📝 Adding New Pages

1. Create a new `.astro` file in `src/pages/`
2. Import and use the Layout component
3. Add navigation link in `src/components/Nav.astro`
4. Follow existing page structure patterns

## 📄 License

Personal portfolio website © Justin High

---

Built with [Astro](https://astro.build) 🚀

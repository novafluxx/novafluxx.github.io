[![Deploy to GitHub Pages](https://github.com/novafluxx/my-personal-website/actions/workflows/deploy.yml/badge.svg?branch=main)](https://github.com/novafluxx/my-personal-website/actions/workflows/deploy.yml)
# Personal Portfolio Website

A modern, responsive portfolio website for Justin High (QA Analyst & Automation Engineer) built with Astro and styled with Tailwind CSS v4.

🌐 **Live Site**: [novafluxx.github.io/my-personal-website](https://novafluxx.github.io/my-personal-website)

## 🚀 Tech Stack

- **Framework**: Astro 7
- **Styling**: Tailwind CSS v4
- **Deployment**: GitHub Pages
- **Package Manager**: pnpm 11.8.0
- **Icons**: Font Awesome 7
- **Fonts**: Google Fonts (Syne and Manrope)

## 📁 Project Structure

```text
astro-personal-website/
├── public/                 # Static assets served as-is (favicons)
├── src/
│   ├── components/        # Reusable components (Nav.astro)
│   ├── images/            # Source images optimized by Astro
│   ├── layouts/          # Layout templates (Layout.astro)
│   ├── pages/            # File-based routing
│   │   ├── index.astro       # Home page
│   │   └── 404.astro         # Custom error page
│   ├── scripts/          # Client-side TypeScript
│   └── styles/           # Global CSS styles
├── .github/
│   └── workflows/
│       └── deploy.yml    # GitHub Actions deployment
├── astro.config.mjs      # Astro configuration
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

No lint, formatter, test, or typecheck command is configured. Treat `pnpm build` as the verification step before deploying.

## ✨ Features

- **Glassmorphism Design**: Modern UI with frosted glass effects
- **Dark Mode**: Theme toggle with localStorage persistence
- **Responsive Navigation**: Mobile-friendly navigation with Font Awesome icons
- **Custom 404 Page**: Branded error handling
- **Optimized Images**: Astro image optimization with `sharp`
- **Optimized Performance**: Static site generation with Astro
- **Automated Deployment**: GitHub Actions workflow with `withastro/action@v6`

## 🎨 Design System

- **Color Scheme**: Rose/slate theme with dark mode support
- **Typography**: Syne display font and Manrope body font from Google Fonts
- **Max Width**: 1200px content container
- **Components**: Reusable glass card variants via `.glass-card-primary`, `.glass-card-secondary`, and `.glass-card-accent`

## 🚢 Deployment

The site is deployed to GitHub Pages via GitHub Actions:
- **Live URL**: [novafluxx.github.io/my-personal-website](https://novafluxx.github.io/my-personal-website)
- **Workflow**: `.github/workflows/deploy.yml`
- **Build Action**: `withastro/action@v6`
- **Deploy Action**: `actions/deploy-pages@v5`
- **Trigger**: Automatic deployment on push to `main` branch
- **Manual Trigger**: Available via GitHub Actions tab

Deployment happens automatically when you push to the `main` branch.

## 📝 Adding New Pages

1. Create a new `.astro` file in `src/pages/`
2. Import and use the Layout component
3. Add navigation link in `src/components/Nav.astro`
4. Follow existing page structure patterns

## 📄 License

Personal portfolio website © Justin High

---

Built with [Astro 7](https://astro.build) 🚀

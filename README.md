[![Deploy to GitHub Pages](https://github.com/novafluxx/astro-personal-website/actions/workflows/deploy.yml/badge.svg?branch=main)](https://github.com/novafluxx/astro-personal-website/actions/workflows/deploy.yml)
# Personal Portfolio Website

A modern, responsive portfolio website for Justin High (QA Analyst & Automation Engineer) built with Astro and styled with Tailwind CSS v4.

🌐 **Live Site**: [novafluxx.github.io/astro-personal-website](https://novafluxx.github.io/astro-personal-website)

## 🚀 Tech Stack

- **Framework**: Astro 5
- **Styling**: Tailwind CSS v4
- **Deployment**: GitHub Pages
- **Package Manager**: Bun
- **Icons**: Font Awesome 7
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
| `bun install`          | Install dependencies                                |
| `bun dev`              | Start local dev server at `localhost:4321`          |
| `bun build`            | Build production site to `./dist/`                  |
| `bun preview`          | Preview build locally before deploying              |
| `bun astro check`      | Run TypeScript type checking                        |

## ✨ Features

- **Glassmorphism Design**: Modern UI with frosted glass effects
- **Dark Mode**: Theme toggle with localStorage persistence
- **Responsive Navigation**: Mobile-friendly navigation with Font Awesome icons
- **Custom 404 Page**: Branded error handling
- **Optimized Performance**: Static site generation with Astro
- **Automated Deployment**: GitHub Actions workflow with official Astro action

## 🎨 Design System

- **Color Scheme**: Slate/Blue tones with dark mode default
- **Typography**: Inter font family from Google Fonts
- **Max Width**: 1200px content container
- **Components**: Reusable glass card styling via `.glass-card` class

## 🚢 Deployment

The site is deployed to GitHub Pages via GitHub Actions:
- **Live URL**: [novafluxx.github.io/astro-personal-website](https://novafluxx.github.io/astro-personal-website)
- **Workflow**: Automatic deployment on push to `main` branch
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

Built with [Astro](https://astro.build) 🚀

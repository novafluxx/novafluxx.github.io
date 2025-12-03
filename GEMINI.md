# GEMINI Project Analysis: Astro Personal Website

## Project Overview

This is a personal portfolio website built with the [Astro](https://astro.build/) web framework (v5). The project is configured to use [Tailwind CSS](https://tailwindcss.com/) (v4) for styling. It is a website for a QA Analyst and Automation Engineer named Justin High, showcasing their skills and experience. The styling features a sophisticated dark mode theme with glassmorphism effects and complex animations.

The project structure is typical for an Astro project:
-   `src/pages`: Contains the site's pages: `index.astro` (main single-page application) and `404.astro`.
-   `src/layouts`: Contains reusable layout components. The main `Layout.astro` defines the common HTML structure.
-   `src/components`: Contains reusable components like the navigation bar (`Nav.astro`).
-   `src/styles`: Contains `global.css` which defines the design system, variables, and global animations.
-   `src/index.js`: The worker entry point for Cloudflare deployment.
-   `public`: For static assets like images and favicons.

## Building and Running

The project uses `pnpm` as the package manager. The following commands are essential for development and building the project:

| Command          | Action                                                       |
| ---------------- | ------------------------------------------------------------ |
| `pnpm install`   | Installs all the necessary dependencies.                     |
| `pnpm dev`       | Starts the local development server at `localhost:4321`.     |
| `pnpm build`     | Builds the production-ready site to the `./dist/` directory. |
| `pnpm preview`   | Serves the production build locally for preview.             |
| `pnpm preview:worker` | Builds and serves the worker locally using Wrangler.    |
| `pnpm deploy:cf` | Deploys the site to Cloudflare Workers.                      |
| `pnpm deploy:pages` | Deploys the site to Cloudflare Pages.                     |

## Development Conventions

*   **Styling:** The project uses Tailwind CSS v4 for utility-first styling. Global styles, including extensive CSS variables for theming and complex animations, are defined in `src/styles/global.css`.
*   **Components:** The code is structured into reusable Astro components, found in `src/components` and `src/layouts`.
*   **Icons:** The project uses [Font Awesome](https://fontawesome.com/) for icons, loaded via a CDN in the main layout file.
*   **Deployment:** The project is configured for deployment on Cloudflare (Workers or Pages) via `wrangler.toml`.
*   **Linting/Formatting:** No explicit linting or formatting tools are currently configured in `package.json`.

# GEMINI Project Analysis: Astro Personal Website

## Project Overview

This is a personal portfolio website built with the [Astro](https://astro.build/) web framework. The project is configured to use [Tailwind CSS](https://tailwindcss.com/) for styling. It appears to be a website for a QA Analyst and Automation Engineer named Justin High, showcasing their skills and experience. The styling includes a dark mode theme.

The project structure is typical for an Astro project:
-   `src/pages`: Contains the site's pages (e.g., `index.astro`, `about.astro`).
-   `src/layouts`: Contains reusable layout components. The main `Layout.astro` defines the common HTML structure, including the header, footer, and loading of global CSS and fonts.
-   `src/components`: Contains reusable components like the navigation bar (`Nav.astro`).
-   `public`: For static assets like images and favicons.

## Building and Running

The project uses `pnpm` as the package manager. The following commands are essential for development and building the project:

| Command          | Action                                                 |
| ---------------- | ------------------------------------------------------ |
| `pnpm install`   | Installs all the necessary dependencies.               |
| `pnpm dev`       | Starts the local development server at `localhost:4321`. |
| `pnpm build`     | Builds the production-ready site to the `./dist/` directory. |
| `pnpm preview`   | Serves the production build locally for preview.         |

## Development Conventions

*   **Styling:** The project uses Tailwind CSS for utility-first styling. Global styles are defined in `src/styles/global.css`.
*   **Components:** The code is structured into reusable Astro components, found in `src/components` and `src/layouts`.
*   **Icons:** The project uses [Font Awesome](https://fontawesome.com/) for icons, loaded via a CDN in the main layout file.
*   **Linting/Formatting:** While no explicit linting or formatting tools (like ESLint or Prettier) are configured in `package.json`, it's a good practice to use them in Astro projects. You can add them with `pnpm astro add eslint` and `pnpm astro add prettier`.

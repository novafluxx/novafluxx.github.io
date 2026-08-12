import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

const tailwindPlugin = tailwindcss();

// Deploy-target switch:
//   DEPLOY_TARGET=pages  → GitHub Pages user site at https://novafluxx.github.io
//   anything else (incl. unset) → domain root ("/"), e.g. Coolify or `astro dev`
// GitHub Pages sets DEPLOY_TARGET=pages in .github/workflows/deploy.yml.
// The repo is novafluxx.github.io (a user site), so it is served from the domain
// root — `base` is "/" for every target.
const isPages = process.env.DEPLOY_TARGET === "pages";

// https://astro.build/config
export default defineConfig({
    // On Pages this is the canonical origin. For root deploys set SITE_URL to your
    // Coolify domain (e.g. https://example.com); left unset, `site` is simply omitted.
    site: isPages ? "https://novafluxx.github.io" : process.env.SITE_URL,
    base: "/",
    vite: {
        plugins: [tailwindPlugin],
    },
});

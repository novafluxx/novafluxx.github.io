import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

const tailwindPlugin = tailwindcss();

// https://astro.build/config
export default defineConfig({
    site: "https://novafluxx.github.io",
    base: import.meta.env.PROD ? "/my-personal-website/" : "/",
    vite: {
        plugins: [tailwindPlugin],
    },
});

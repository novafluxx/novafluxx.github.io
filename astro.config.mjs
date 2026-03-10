import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

const tailwindPlugin = tailwindcss();

// https://astro.build/config
export default defineConfig({
    site: "https://novafluxx.github.io",
    base: import.meta.env.PROD ? "/my-personal-website/" : "/",
    security: {
        csp: {
            directives: [
                "default-src 'self'",
                "font-src 'self' https://cdnjs.cloudflare.com https://fonts.gstatic.com",
                "img-src 'self' data:",
                "connect-src 'self'",
            ],
            styleDirective: {
                resources: [
                    "'self'",
                    "'unsafe-inline'",
                    "https://cdnjs.cloudflare.com",
                    "https://fonts.googleapis.com",
                ],
            },
            scriptDirective: {
                resources: ["'self'"],
            },
        },
    },
    vite: {
        plugins: [tailwindPlugin],
    },
});

// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://novafluxx.github.io',
  base: import.meta.env.PROD ? '/astro-personal-website/' : '/',
  vite: {
    plugins: [tailwindcss()]
  }
});
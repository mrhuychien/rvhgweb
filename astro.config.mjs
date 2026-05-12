// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.rongvanghoanggia.com',
  trailingSlash: 'always', // CRITICAL: giữ nguyên URL cũ của WordPress
  build: { format: 'directory' }, // /gioi-thieu/index.html
  integrations: [
    sitemap({
      filter: (page) =>
        !page.includes('/chinh-sach-') &&
        !page.includes('/ban-tu-cong-bo-') &&
        !page.endsWith('/cong-bo/'),
    }),
    mdx(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  image: {
    service: { entrypoint: 'astro/assets/services/sharp' },
  },
});

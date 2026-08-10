import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://transcrab.dairui1.com',
  base: '/',
  output: 'static',
  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
    },
  },
});

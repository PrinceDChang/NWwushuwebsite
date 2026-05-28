import { defineConfig } from 'astro/config';

// https://docs.astro.build/en/guides/deploy/github/
export default defineConfig({
  site: 'https://princedchang.github.io',
  base: '/NWwushuwebsite/',
  output: 'static',
  build: {
    format: 'directory',
  },
});

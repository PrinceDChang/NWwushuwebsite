import { defineConfig } from 'astro/config';

// https://docs.astro.build/en/guides/deploy/github/
export default defineConfig({
  site: 'https://northwestwushu.com',
  output: 'static',
  build: {
    format: 'directory',
  },
});

import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://northwestwushu.com',
  output: 'static',
  build: {
    format: 'directory',
  },
});

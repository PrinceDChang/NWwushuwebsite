import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://nwwushu.com',
  output: 'static',
  build: {
    format: 'directory',
  },
});

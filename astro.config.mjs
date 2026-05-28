import { defineConfig } from 'astro/config';

// Custom domain — site is served from https://northwestwushu.com (not /NWwushuwebsite/)
export default defineConfig({
  site: 'https://northwestwushu.com',
  output: 'static',
  build: {
    format: 'directory',
  },
});

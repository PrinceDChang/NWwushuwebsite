import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://princedchang.github.io/NWwushuwebsite',
  output: 'static',
  build: {
    format: 'directory',
  },
});

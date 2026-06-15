import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://princedchang.github.io/NWwushuwebsite',
  output: 'static',
  build: {
    format: 'directory',
  },
  server: {
    host: '127.0.0.1',
    port: 4321,
  },
});

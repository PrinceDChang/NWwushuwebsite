import { defineConfig } from 'astro/config';

// GitHub project Pages URL: https://princedchang.github.io/NWwushuwebsite/
// When northwestwushu.com DNS is pointed at GitHub, switch site + remove base (see README).
export default defineConfig({
  site: 'https://princedchang.github.io',
  base: '/NWwushuwebsite/',
  output: 'static',
  build: {
    format: 'directory',
  },
});

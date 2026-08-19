import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  root: 'client',
  publicDir: fileURLToPath(new URL('./public', import.meta.url)),
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    port: 4321,
    strictPort: true,
    proxy: {
      '/api': 'http://127.0.0.1:3000',
    },
  },
  preview: {
    host: '127.0.0.1',
    port: 4173,
  },
  build: {
    outDir: fileURLToPath(new URL('./dist/client', import.meta.url)),
    emptyOutDir: true,
    assetsInlineLimit: 0,
  },
});

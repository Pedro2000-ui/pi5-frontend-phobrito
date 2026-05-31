import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';

const CURRENT_WORKDIR = process.cwd();

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@assets': resolve(CURRENT_WORKDIR, 'src/assets'),
      '@core': resolve(CURRENT_WORKDIR, 'src/core'),
      '@feature': resolve(CURRENT_WORKDIR, 'src/feature'),
      '@routes': resolve(CURRENT_WORKDIR, 'src/routes'),
      '@styles': resolve(CURRENT_WORKDIR, 'src/styles'),
      '@ui': resolve(CURRENT_WORKDIR, 'src/ui'),
    },
  },
});

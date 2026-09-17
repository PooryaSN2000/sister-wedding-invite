import { defineConfig } from 'vite';

export default defineConfig({
  base: './', // Ensures all asset paths are relative for GitHub Pages and subpaths
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false
  }
});

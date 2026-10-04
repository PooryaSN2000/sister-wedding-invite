import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs';

export default defineConfig({
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        hana: resolve(__dirname, 'hana.html'),
      }
    }
  },
  plugins: [
    {
      name: 'copy-hana-directory',
      closeBundle() {
        const distDir = resolve(__dirname, 'dist');
        const hanaDir = resolve(distDir, 'hana');
        const hanaHtml = resolve(distDir, 'hana.html');
        if (fs.existsSync(hanaHtml)) {
          if (!fs.existsSync(hanaDir)) {
            fs.mkdirSync(hanaDir, { recursive: true });
          }
          fs.copyFileSync(hanaHtml, resolve(hanaDir, 'index.html'));
        }
      }
    }
  ]
});

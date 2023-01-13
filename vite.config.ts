import { defineConfig } from "vite";
import nunjucks from 'vite-plugin-nunjucks';

export default defineConfig({
  plugins: [
    nunjucks(),
  ],
  root: './src',
  build: {
    outDir: '../build',
    rollupOptions: {
      input: {
        main: './src/index.html',
      }
    }
  }
});

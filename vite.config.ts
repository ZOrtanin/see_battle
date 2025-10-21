import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: resolve(__dirname, 'src'),
  build: {
    outDir: resolve(__dirname, 'dist'),
    minify: "esbuild",
    emptyOutDir: true,
    sourcemap: true,
    terserOptions: {
      mangle: false, // Отключить переименование переменных
    },
  },
  esbuild: {
    // Сохранять имена переменных (если minify: true)
    keepNames: true,
  },
});

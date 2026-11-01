import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

export default defineConfig({
  base: './',
  plugins: [preact()],
  build: { target: 'es2020', sourcemap: true },
  server: { port: 5174 },
});

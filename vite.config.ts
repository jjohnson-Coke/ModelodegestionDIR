import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// `base: './'` genera rutas relativas para que el build funcione en cualquier hosting o subcarpeta.
export default defineConfig({
  base: './',
  plugins: [react()],
  build: { chunkSizeWarningLimit: 800 },
});

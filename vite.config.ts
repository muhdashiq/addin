/// <reference types="vitest/config" />
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Has to match where the site is served from.
//   Under a path, as now (muhdashiq.com/addin/) → '/<REPO_NAME>/'
//   On its own domain                           → '/'
const BASE_PATH = '/addin/';

export default defineConfig({
  base: BASE_PATH,
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: /^three$/,
        replacement: fileURLToPath(new URL('./src/three/three-slim.ts', import.meta.url)),
      },
    ],
  },
  build: {
    target: 'es2020',
    // The lazy 3D chunk is measured gzipped against its own ~200 KB budget.
    chunkSizeWarningLimit: 800,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: { modules: { classNameStrategy: 'non-scoped' } },
  },
});

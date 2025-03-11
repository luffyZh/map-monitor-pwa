import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.VITE_BASE_PATH,
  plugins: [react()],
  build: {
    outDir: 'docs',
  },
  resolve: {
    alias: {
      '@/': '/src/',
      '@/pages': '/src/pages/',
      '@/components': '/src/components/',
      '@/utils': '/src/utils/',
      '@/hooks': '/src/hooks/',
      '@/stores': '/src/stores/',
    },
  }
});

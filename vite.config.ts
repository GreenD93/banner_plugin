import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig({
  root: 'src/ui',

  plugins: [
    react(),
    viteSingleFile(), // 🔥 핵심
  ],

  build: {
    outDir: '../../dist',
    emptyOutDir: true,
  },
});

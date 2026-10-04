import { defineConfig } from 'vite';
import { conversionAssets } from './print-conversion-assets';

// Serve the shared conversion worker, JavaScript runtime and WASM together.
export default defineConfig({
  server: {
    port: 5173
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  },
  optimizeDeps: {
    exclude: [
      '@imgly/plugin-print-ready-pdfs-web',
      '@imgly/pdf-conversion-utils'
    ]
  },
  plugins: [conversionAssets(import.meta.url)]
});

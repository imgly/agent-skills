import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Plugin to handle .archive files with correct MIME type.
 * CE.SDK scene archives are ZIP files that need application/zip Content-Type.
 */
function archiveMimePlugin(): Plugin {
  return {
    name: 'archive-mime',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url?.endsWith('.archive')) {
          res.setHeader('Content-Type', 'application/zip');
        }
        next();
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), archiveMimePlugin()],
  server: {
    port: 5173
  },
  resolve: {
    dedupe: ['react', 'react-dom']
  },
  optimizeDeps: {
    // The pdf-importer ships its pdfjs worker as a sibling file
    // (`./pdf.worker.mjs`) and resolves the URL relative to the importing
    // module. Vite's dev-mode pre-bundler copies @imgly/pdf-importer into
    // node_modules/.vite/deps/ but doesn't carry the worker along, which
    // breaks the relative URL. Excluding from pre-bundle keeps the
    // package at its real path so the worker stays alongside it.
    exclude: ['@imgly/pdf-importer']
  }
});

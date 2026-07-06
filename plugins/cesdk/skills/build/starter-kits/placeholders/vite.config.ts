import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vite';
/**
 * Plugin to handle .scene files with correct MIME type.
 * CE.SDK scene files need proper Content-Type handling.
 */
function sceneMimePlugin(): Plugin {
  return {
    name: 'scene-mime',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url?.endsWith('.scene')) {
          res.setHeader('Content-Type', 'application/octet-stream');
        }
        next();
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), sceneMimePlugin()],
  server: {
    port: 5173
  },
  resolve: {
    dedupe: ['react', 'react-dom']
  }
});

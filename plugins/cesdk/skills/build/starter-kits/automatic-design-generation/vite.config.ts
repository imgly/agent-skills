import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
// Plugin to serve .scene files with proper MIME type
function sceneFileMimeType(): Plugin {
  return {
    name: 'scene-file-mime-type',
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
  plugins: [react(), sceneFileMimeType()],
  resolve: {
    dedupe: ['react', 'react-dom']
  },
  server: {
    port: 5173
  }
});

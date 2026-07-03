import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173
  },
  // Prevent duplicate React instances in production builds
  // This is critical when using @cesdk/cesdk-js which bundles React components
  resolve: {
    dedupe: ['react', 'react-dom']
  }
});

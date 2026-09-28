import { defineKitVitestConfig } from '@imgly/kit-test-harness/vitest';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

export default defineKitVitestConfig({
  kitDir: fileURLToPath(new URL('..', import.meta.url)),
  plugins: [react()],
  stubWindow: true
});

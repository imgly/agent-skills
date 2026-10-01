import { defineKitVitestConfig } from '@imgly/kit-test-harness/vitest';
import { fileURLToPath } from 'node:url';

export default defineKitVitestConfig({
  kitDir: fileURLToPath(new URL('..', import.meta.url)),
  stubWindow: true
});

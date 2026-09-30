import { defineKitVitestConfig } from '@imgly/kit-test-harness/vitest';
import { fileURLToPath } from 'node:url';

export default defineKitVitestConfig({
  kitDir: fileURLToPath(new URL('..', import.meta.url)),
  // `src/imgly` reaches `@cesdk/cesdk-js`, which reads `window` at module scope.
  stubWindow: true
});

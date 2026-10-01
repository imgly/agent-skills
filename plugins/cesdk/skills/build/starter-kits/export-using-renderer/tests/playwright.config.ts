import { defineKitPlaywrightConfig } from '@imgly/kit-test-harness';
import { resolve } from 'node:path';

export default defineKitPlaywrightConfig({
  kitDir: resolve(__dirname, '..'),
  // Same-origin, so page.route can answer the Renderer without a cross-origin
  // request that the network guard would flag.
  env: { VITE_RENDERER_PROXY_URL: '/__renderer' }
});

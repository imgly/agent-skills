import { defineKitPlaywrightConfig } from '@imgly/kit-test-harness';
import { resolve } from 'node:path';

export default defineKitPlaywrightConfig({
  kitDir: resolve(__dirname, '..'),
  // The shipped template stores absolute cdn.img.ly URIs for Notable and the emoji font.
  cdnAllowlist: [
    /cdn\.img\.ly\/packages\/imgly\/cesdk-js\/[^/]+\/assets\/ly\.img\.typeface\/fonts\//,
    /cdn\.img\.ly\/assets\/v4\/emoji\//
  ]
});

import { defineKitPlaywrightConfig } from '@imgly/kit-test-harness';
import { resolve } from 'node:path';

export default defineKitPlaywrightConfig({
  kitDir: resolve(__dirname, '..'),
  // The seeded snapshot scenes store absolute cdn.img.ly URIs for their fonts.
  cdnAllowlist: [
    /cdn\.img\.ly\/packages\/imgly\/cesdk-js\/[^/]+\/assets\/ly\.img\.typeface\/fonts\//,
    /cdn\.img\.ly\/assets\/v4\/emoji\//
  ]
});

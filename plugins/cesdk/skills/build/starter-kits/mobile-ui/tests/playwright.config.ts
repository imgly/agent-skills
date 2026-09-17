import { defineKitPlaywrightConfig } from '@imgly/kit-test-harness';
import { resolve } from 'node:path';

export default defineKitPlaywrightConfig({
  kitDir: resolve(__dirname, '..'),
  // `public/social-media.scene` stores absolute cdn.img.ly URIs for its Manrope
  // fonts, so the scene fetches them wherever it is served from.
  cdnAllowlist: [
    /cdn\.img\.ly\/packages\/imgly\/cesdk-js\/[^/]+\/assets\/ly\.img\.typeface\/fonts\/Manrope\//
  ]
});

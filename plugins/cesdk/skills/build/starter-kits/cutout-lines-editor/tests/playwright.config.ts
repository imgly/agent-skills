import { defineKitPlaywrightConfig } from '@imgly/kit-test-harness';
import { resolve } from 'node:path';

export default defineKitPlaywrightConfig({
  kitDir: resolve(__dirname, '..'),
  // The kit's own demo scene stores absolute cdn.img.ly URIs for its three
  // fonts and its emoji sticker. See known issue 7 in TEST-PLAN.md.
  cdnAllowlist: [
    /cdn\.img\.ly\/packages\/imgly\/cesdk-js\/[\d.]+\/assets\/ly\.img\.typeface\/fonts\//,
    /cdn\.img\.ly\/assets\/v1\/ly\.img\.sticker\//
  ]
});

import { defineKitPlaywrightConfig } from '@imgly/kit-test-harness';
import { resolve } from 'node:path';

export default defineKitPlaywrightConfig({
  kitDir: resolve(__dirname, '..'),
  // The kit's demo design scenes store absolute font URIs at engine version
  // 1.68.0; nothing else in this kit reaches the CDN.
  cdnAllowlist: [
    /cdn\.img\.ly\/packages\/imgly\/cesdk-js\/1\.68\.0\/assets\/ly\.img\.typeface\/fonts\//
  ]
});

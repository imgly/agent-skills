import { defineKitPlaywrightConfig } from '@imgly/kit-test-harness';
import { resolve } from 'node:path';

export default defineKitPlaywrightConfig({
  kitDir: resolve(__dirname, '..'),
  // The kit's demo scene stores absolute cdn.img.ly font URIs from the CE.SDK
  // version it was authored with, plus the emoji font.
  cdnAllowlist: [
    /cdn\.img\.ly\/packages\/imgly\/cesdk-js\/[\d.]+\/assets\/ly\.img\.typeface\/fonts\//,
    /cdn\.img\.ly\/assets\/v\d+\/emoji\//
  ]
});

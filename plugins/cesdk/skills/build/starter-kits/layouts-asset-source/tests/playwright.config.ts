import { defineKitPlaywrightConfig } from '@imgly/kit-test-harness';
import { resolve } from 'node:path';

export default defineKitPlaywrightConfig({
  kitDir: resolve(__dirname, '..'),
  // The kit's demo scene and its layout scenes store absolute cdn.img.ly font
  // URIs from the CE.SDK version they were authored with.
  cdnAllowlist: [
    /cdn\.img\.ly\/packages\/imgly\/cesdk-js\/[\d.]+\/assets\/ly\.img\.typeface\/fonts\//
  ]
});

import { defineKitPlaywrightConfig } from '@imgly/kit-test-harness';
import { resolve } from 'node:path';

export default defineKitPlaywrightConfig({
  kitDir: resolve(__dirname, '..'),
  // The kit's own demo scene stores an absolute cdn.img.ly URI for its Manrope
  // font. See known issue 6 in TEST-PLAN.md.
  cdnAllowlist: [
    /cdn\.img\.ly\/packages\/imgly\/cesdk-js\/[\d.]+\/assets\/ly\.img\.typeface\/fonts\//
  ]
});

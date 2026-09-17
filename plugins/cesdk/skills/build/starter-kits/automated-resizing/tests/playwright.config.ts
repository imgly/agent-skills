import { defineKitPlaywrightConfig } from '@imgly/kit-test-harness';
import { resolve } from 'node:path';

export default defineKitPlaywrightConfig({
  kitDir: resolve(__dirname, '..'),
  // The demo templates store absolute cdn.img.ly URIs for their fonts.
  cdnAllowlist: [
    /cdn\.img\.ly\/packages\/imgly\/cesdk-js\/1\.68\.0\/assets\/ly\.img\.typeface\/fonts\//
  ]
});

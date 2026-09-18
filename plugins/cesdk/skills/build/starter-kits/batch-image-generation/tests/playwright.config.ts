import { defineKitPlaywrightConfig } from '@imgly/kit-test-harness';
import { resolve } from 'node:path';

export default defineKitPlaywrightConfig({
  kitDir: resolve(__dirname, '..'),
  // Both shipped scenes store absolute cdn.img.ly URIs for their Space Grotesk
  // fonts, so every render fetches them.
  cdnAllowlist: [
    /cdn\.img\.ly\/assets\/v3\/ly\.img\.typeface\/fonts\/SpaceGrotesk\//
  ]
});

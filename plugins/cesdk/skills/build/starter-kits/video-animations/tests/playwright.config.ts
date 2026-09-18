import { defineKitPlaywrightConfig } from '@imgly/kit-test-harness';
import { resolve } from 'node:path';

export default defineKitPlaywrightConfig({
  kitDir: resolve(__dirname, '..'),
  // The demo scenes store absolute cdn.img.ly URIs for their Caveat and
  // Manrope fonts.
  cdnAllowlist: [
    /cdn\.img\.ly\/assets\/v3\/ly\.img\.typeface\/fonts\/(Caveat|Manrope)\//
  ]
});

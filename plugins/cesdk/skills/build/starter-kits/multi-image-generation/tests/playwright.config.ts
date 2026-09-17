import { defineKitPlaywrightConfig } from '@imgly/kit-test-harness';
import { resolve } from 'node:path';

export default defineKitPlaywrightConfig({
  kitDir: resolve(__dirname, '..'),
  // The three demo scenes store absolute cdn.img.ly URIs for their typefaces.
  cdnAllowlist: [/cdn\.img\.ly\/assets\/v3\/ly\.img\.typeface\/fonts\//]
});

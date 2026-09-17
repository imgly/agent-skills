import { defineKitPlaywrightConfig } from '@imgly/kit-test-harness';
import { resolve } from 'node:path';

export default defineKitPlaywrightConfig({
  kitDir: resolve(__dirname, '..'),
  // The shipped scene stores absolute cdn.img.ly URIs for its Rasa and Roboto fonts.
  cdnAllowlist: [
    /cdn\.img\.ly\/assets\/v3\/ly\.img\.typeface\/fonts\/(Rasa|Roboto)\//
  ]
});

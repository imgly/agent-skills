import { defineKitPlaywrightConfig } from '@imgly/kit-test-harness';
import { resolve } from 'node:path';

export default defineKitPlaywrightConfig({
  kitDir: resolve(__dirname, '..'),
  // `photobook.scene` and the theme typefaces store absolute cdn.img.ly URIs
  // for the four faces the book uses.
  cdnAllowlist: [/cdn\.img\.ly\/assets\/v3\/ly\.img\.typeface\/fonts\//],
  // The bars appear only once every page preview has been exported, which
  // takes the CI runner's software GL 30 to 60 seconds.
  slowUI: { actionTimeoutSeconds: 90, expectTimeoutSeconds: 60 }
});

import { defineKitPlaywrightConfig } from '@imgly/kit-test-harness';
import { resolve } from 'node:path';

export default defineKitPlaywrightConfig({
  kitDir: resolve(__dirname, '..'),
  // The bars appear only once every page preview has been exported, which
  // takes the CI runner's software GL 30 to 60 seconds.
  slowUI: { actionTimeoutSeconds: 90, expectTimeoutSeconds: 60 }
});

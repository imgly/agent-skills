import { defineKitPlaywrightConfig, portForKit } from '@imgly/kit-test-harness';
import { resolve } from 'node:path';

const kitDir = resolve(__dirname, '..');

export default defineKitPlaywrightConfig({
  kitDir,
  // Point the transcription provider at a same-origin path the tests own, so
  // no run can reach fal.ai or the demo proxy.
  env: {
    VITE_AUTOCAPTION_PROXY_URL: `http://localhost:${portForKit(kitDir)}/__fal`
  }
});

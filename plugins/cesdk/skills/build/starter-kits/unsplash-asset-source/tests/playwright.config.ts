import { defineKitPlaywrightConfig, portForKit } from '@imgly/kit-test-harness';
import { devices } from '@playwright/test';
import { resolve } from 'node:path';
import { API_URL } from './e2e/unsplash-proxy';

const kitDir = resolve(__dirname, '..');

const base = defineKitPlaywrightConfig({
  kitDir,
  port: portForKit(kitDir),
  // A test proxy host, so the demo proxy is never contacted and every request
  // is answered by the route mock.
  env: { VITE_UNSPLASH_API_URL: API_URL }
});

export default {
  ...base,
  projects: [
    {
      name: 'chrome',
      testIgnore: /errors\.spec\.ts$/,
      use: { ...devices['Desktop Chrome'], channel: 'chrome' as const }
    },
    {
      name: 'chrome-proxy-errors',
      testMatch: /errors\.spec\.ts$/,
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome' as const,
        // Only this case makes the proxy fail. The kit's source rejects on an
        // API error by design, and the engine reports that rejection.
        consoleErrorAllowlist: [
          // Anchored to the proxy so a 500 from anywhere else still fails.
          new RegExp(
            `responded with a status of 500 .*${API_URL.replace(/\./g, '\\.')}`
          ),
          /findAssets callback threw/
        ]
      }
    }
  ]
};

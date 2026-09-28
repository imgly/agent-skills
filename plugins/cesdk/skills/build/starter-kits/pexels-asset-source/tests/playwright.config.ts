import {
  cdnPortForKit,
  defineKitPlaywrightConfig,
  portForKit,
  readTestLicense
} from '@imgly/kit-test-harness';
import { devices } from '@playwright/test';
import { resolve } from 'node:path';
import { API_BASE, API_KEY } from './e2e/pexels-api';

const kitDir = resolve(__dirname, '..');
const port = portForKit(kitDir);
// The unconfigured case needs the kit booted without an API key, and Vite bakes
// that value in at start-up, so it gets a second server outside the kit range.
const unconfiguredPort = port + 700;

const base = defineKitPlaywrightConfig({
  kitDir,
  port,
  env: { VITE_PEXELS_API_KEY: API_KEY }
});

const isDevMode = base.webServer != null;

export default {
  ...base,
  projects: [
    {
      name: 'chrome',
      testIgnore: /(unconfigured|errors)\.spec\.ts$/,
      use: { ...devices['Desktop Chrome'], channel: 'chrome' as const }
    },
    {
      name: 'chrome-api-errors',
      testMatch: /errors\.spec\.ts$/,
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome' as const,
        // Only these cases make the API fail, so only they may see the line the
        // kit logs when it swallows the failure, or Chrome's own network log.
        consoleErrorAllowlist: [
          /Pexels API error:/,
          // Anchored to the Pexels API so a 429 from anywhere else still fails.
          new RegExp(
            `responded with a status of 429 .*${API_BASE.replace(/\./g, '\\.')}`
          )
        ]
      }
    },
    ...(isDevMode
      ? [
          {
            name: 'chrome-unconfigured',
            testMatch: /unconfigured\.spec\.ts$/,
            use: {
              ...devices['Desktop Chrome'],
              channel: 'chrome' as const,
              baseURL: `http://localhost:${unconfiguredPort}/`,
              // Only this project boots without an API key, so only it may see
              // the message the kit logs on the second query.
              consoleErrorAllowlist: [/Pexels API key not configured\./]
            }
          }
        ]
      : [])
  ],
  webServer: isDevMode
    ? [
        base.webServer,
        {
          command: `npm run dev -- --port ${unconfiguredPort} --strictPort`,
          cwd: kitDir,
          url: `http://localhost:${unconfiguredPort}/`,
          timeout: 300 * 1000,
          reuseExistingServer: !process.env.CI,
          stdout: 'pipe' as const,
          stderr: 'pipe' as const,
          env: {
            ...process.env,
            IMGLY_LOCAL_CDN_PORT:
              process.env.IMGLY_LOCAL_CDN_PORT ?? String(cdnPortForKit(kitDir)),
            VITE_CESDK_LICENSE: readTestLicense(kitDir),
            VITE_ADD_CESDK_GLOBALS: 'true',
            VITE_PEXELS_API_KEY: ''
          } as Record<string, string>
        }
      ]
    : undefined
};

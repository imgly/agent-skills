import {
  cdnPortForKit,
  defineKitPlaywrightConfig,
  portForKit,
  readTestLicense
} from '@imgly/kit-test-harness';
import { devices } from '@playwright/test';
import { resolve } from 'node:path';
import { PROXY_URL } from './e2e/getty-proxy';

const kitDir = resolve(__dirname, '..');
const port = portForKit(kitDir);
// The unconfigured case needs the kit booted without a proxy URL, and Vite bakes
// that value in at start-up, so it gets a second server outside the kit range.
const unconfiguredPort = port + 700;

const base = defineKitPlaywrightConfig({
  kitDir,
  port,
  env: { VITE_GETTY_IMAGES_PROXY_URL: PROXY_URL }
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
      name: 'chrome-proxy-errors',
      testMatch: /errors\.spec\.ts$/,
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome' as const,
        // Only these cases make the proxy fail, so only they may see the line
        // the kit logs when it swallows the failure.
        consoleErrorAllowlist: [
          /Getty Images API error:/,
          // Chrome's own log line for the 502 the test makes the route return,
          // anchored to the proxy so a 502 from anywhere else still fails.
          new RegExp(
            `responded with a status of 502 .*${PROXY_URL.replace(/\./g, '\\.')}`
          ),
          // Known issue 4: a body with no `assets` field reaches the engine,
          // which rejects the query and reports it here.
          /findAssets callback threw/
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
              // Only this project boots without a proxy URL, so only it may see
              // the message the kit logs on the second query.
              consoleErrorAllowlist: [/Getty Images proxy URL not configured\./]
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
            VITE_GETTY_IMAGES_PROXY_URL: ''
          } as Record<string, string>
        }
      ]
    : undefined
};

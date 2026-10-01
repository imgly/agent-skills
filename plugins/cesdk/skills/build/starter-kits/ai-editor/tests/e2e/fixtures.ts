import { test as base } from '@imgly/kit-test-harness';
import { Gateway, type GatewayOptions } from './gateway';

export { expect } from '@imgly/kit-test-harness';
export { CURATED, EDITED_URL, MODEL_CATALOGUE } from './gateway';

/**
 * The kit test with the AI gateway mocked. The routes are installed on the
 * `page` fixture, because the `kit` fixture navigates as soon as it is built.
 */
export const test = base.extend<GatewayOptions & { gateway: Gateway }>({
  modelsStatus: [200, { option: true }],
  modelsAborted: [false, { option: true }],
  storedApiKey: ['sk_test_key', { option: true }],

  // Playwright requires the destructuring pattern; this one depends on nothing.
  // eslint-disable-next-line no-empty-pattern
  gateway: async ({}, use) => {
    await use(new Gateway());
  },

  page: async (
    { page, gateway, modelsStatus, modelsAborted, storedApiKey },
    use
  ) => {
    await gateway.install(page, { modelsStatus, modelsAborted, storedApiKey });
    await use(page);
    gateway.assertEveryRequestWasMocked();
  }
});

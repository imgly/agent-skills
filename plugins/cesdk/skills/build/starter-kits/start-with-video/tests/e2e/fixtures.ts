import { test as base } from '@imgly/kit-test-harness';

const LOCAL_CDN = 'http://localhost:5199';
const PUBLISHED_CDN = 'https://staticimgly.com';

/**
 * The repo's local CDN mirror answers a range request with the whole file, and
 * the engine's MP4 reader needs real ranges, so the demo videos are taken from
 * the published bucket the kit ships with. `cdn.img.ly` stays blocked.
 */
export const test = base.extend({
  page: async ({ page }, use) => {
    await page.route(
      `${LOCAL_CDN}/imgly/cesdk-web-examples-data/**`,
      async (route) => {
        const url = route.request().url().replace(LOCAL_CDN, PUBLISHED_CDN);
        const response = await route.fetch({ url });
        await route.fulfill({ response });
      }
    );
    await use(page);
    await page.unrouteAll({ behavior: 'ignoreErrors' });
  }
});

export { expect } from '@imgly/kit-test-harness';

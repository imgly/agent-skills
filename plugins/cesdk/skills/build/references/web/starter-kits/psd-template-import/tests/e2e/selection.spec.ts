import { expect, test } from '@imgly/kit-test-harness';

import { EXAMPLES, KitApp, SMALLEST_DEMO_FILE } from './kit-app';

test.describe('File selection', () => {
  test('PSD-01 the kit starts on the selection screen with no engine', async ({
    page
  }) => {
    const app = new KitApp(page);
    await app.open();

    await expect(
      page.getByText('Supports .psd and .psb Formats')
    ).toBeVisible();
    for (const name of EXAMPLES) {
      await expect(app.example(name)).toBeVisible();
    }

    await expect(app.newFile).toHaveCount(0);
    await expect(app.navigationBar).toHaveCount(0);
    expect(await page.evaluate(() => 'cesdk' in window)).toBe(false);
  });

  test('PSD-04 a dropped file is imported', async ({ page }) => {
    const app = new KitApp(page);
    await app.open();

    await app.drop(SMALLEST_DEMO_FILE);
    await app.waitForResult();

    await expect(page.getByText('No Preview Available')).toBeVisible();
    await expect(page.getByAltText('Imported Result')).toBeVisible();
  });

  test('PSD-05 a dropped file of another type is not imported', async ({
    page
  }) => {
    const app = new KitApp(page);
    await app.open();

    await app.drop('not-a-psd.txt', Buffer.from('x'.repeat(1024)));

    await expect(app.uploadInput).toBeAttached();
    await expect(app.newFile).toHaveCount(0);
    expect(await page.evaluate(() => 'cesdk' in window)).toBe(false);
  });

  test('PSD-05b a rejected drop says why', async ({ page }) => {
    const app = new KitApp(page);
    await app.open();

    await app.drop('not-a-psd.txt', Buffer.from('x'.repeat(1024)));

    await expect(
      page.getByText(/\.psd/i).and(page.getByRole('alert'))
    ).toBeVisible();
  });
});

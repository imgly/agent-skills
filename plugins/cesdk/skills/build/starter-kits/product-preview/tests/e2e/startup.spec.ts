import { expect, test } from '@imgly/kit-test-harness';
import {
  PRODUCTS,
  Preview,
  pageCount,
  previewSource,
  serveRepositoryFonts
} from './preview';

test.describe('Start-up and product switching', () => {
  test('PP-01 the postcard is selected and its mockup rendered', async ({
    kit
  }) => {
    const preview = new Preview(kit.page);

    await expect(preview.image).toBeVisible();
    const src = await preview.image.getAttribute('src');
    expect(src?.startsWith('blob:')).toBe(true);
    const natural = await preview.image.evaluate(
      (image) => (image as HTMLImageElement).naturalWidth
    );
    expect(natural).toBeGreaterThan(0);

    // The postcard design scene, not one of the other four.
    expect(await pageCount(kit)).toBe(2);
  });

  test('PP-02 five product controls', async ({ kit }) => {
    const preview = new Preview(kit.page);
    await serveRepositoryFonts(kit.page);

    for (const label of PRODUCTS) {
      await expect(preview.product(label)).toBeVisible();
    }

    const before = await previewSource(kit.page);
    await preview.product('Poster').click();

    await expect
      .poll(() => previewSource(kit.page), { timeout: 90_000 })
      .not.toBe(before);
    expect(await pageCount(kit)).toBe(1);
  });

  test('PP-03 the controls are disabled while a product loads', async ({
    kit
  }) => {
    const preview = new Preview(kit.page);
    // A cached scene loads faster than the first poll, so hold its response
    // until the loading state has been observed.
    let release!: () => void;
    const held = new Promise<void>((resolve) => {
      release = resolve;
    });
    await kit.page.route('**/apparel.scene', async (route) => {
      await held;
      await route.continue();
    });

    await preview.product('Apparel').click();

    await expect(preview.product('Poster')).toBeDisabled();
    release();
    await expect(preview.product('Poster')).toBeEnabled({ timeout: 60_000 });
    await expect(preview.image).toBeVisible();
  });
});

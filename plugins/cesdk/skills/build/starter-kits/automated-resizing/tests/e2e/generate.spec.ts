import { download, expect, pngSize, test } from '@imgly/kit-test-harness';

import { ResizingKit, VARIANT_LABELS } from './kit';

test.describe('Generate variants', () => {
  test('AR-04 generate one variant per preset', async ({ page }) => {
    const kit = new ResizingKit(page);
    await kit.open();

    await kit.generateButton.click();

    // Every card goes to the loading state before any of them has an image.
    await expect(kit.variantsSection.getByRole('img')).toHaveCount(
      VARIANT_LABELS.length
    );

    await expect(kit.variantDownloadButtons).toHaveCount(
      VARIANT_LABELS.length,
      { timeout: 120_000 }
    );
    await expect(kit.variantHeadings).toHaveText([...VARIANT_LABELS]);
    await expect(
      kit.variantsSection.getByRole('button', { name: 'Edit' })
    ).toHaveCount(VARIANT_LABELS.length);

    // Each card now renders an exported image rather than the platform icon.
    const previews = kit.variantsSection.locator('img[data-cy="export-image"]');
    await expect(previews).toHaveCount(VARIANT_LABELS.length);
  });

  test('AR-04b Generate before the engine is ready is silent', async ({
    page
  }) => {
    const kit = new ResizingKit(page);
    await kit.openWithoutEngine();

    await kit.generateButton.click();

    // Known issue 4: the kit shows no ready state and the click is dropped, so
    // nothing starts loading and nothing tells the user why.
    await expect(kit.variantDownloadButtons).toHaveCount(0);
    await expect(
      kit.variantsSection.locator('img[data-cy="export-image"]')
    ).toHaveCount(0);
  });

  test('AR-05 download a variant', async ({ page }) => {
    const kit = new ResizingKit(page);
    await kit.open();
    await kit.generate();

    const files = await download(page, () =>
      kit.variantDownloadButton(0).click()
    );

    expect(files).toHaveLength(1);
    expect(files[0].name).toBe('Instagram Story.png');
    expect(pngSize(files[0].buffer)).toEqual({ width: 1080, height: 1920 });
  });

  test('AR-05b every variant downloads at its preset size', async ({
    page
  }) => {
    const kit = new ResizingKit(page);
    await kit.open();
    await kit.generate();

    // The kit asks for `${label}.png`; Chrome replaces the colon in the
    // Instagram Post 4:5 label with an underscore.
    const expected = [
      ['Instagram Post 4_5.png', { width: 1080, height: 1350 }],
      ['X (Twitter) Post.png', { width: 1200, height: 675 }],
      ['Facebook Post.png', { width: 1200, height: 630 }]
    ] as const;

    for (const [index, [name, size]] of expected.entries()) {
      const files = await download(page, () =>
        kit.variantDownloadButton(index + 1).click()
      );
      expect(files[0].name).toBe(name);
      expect(pngSize(files[0].buffer)).toEqual(size);
    }
  });
});

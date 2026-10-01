import { expect, test } from '@imgly/kit-test-harness';

import { ResizingKit, VARIANT_LABELS } from './kit';

test.describe('Start-up and template selection', () => {
  test('AR-01 default state', async ({ page }) => {
    const kit = new ResizingKit(page);
    await kit.open();

    await expect(kit.templateSection.getByRole('img')).toHaveCount(3);

    // Only the selected card carries the Edit overlay, and the first one is
    // selected on load.
    await expect(kit.templateEditButton).toHaveCount(1);
    await expect(kit.templateCard(0)).toBeVisible();

    await expect(kit.variantHeadings).toHaveText([...VARIANT_LABELS]);
    await expect(kit.variantsSection.getByRole('img')).toHaveCount(
      VARIANT_LABELS.length
    );
    await expect(kit.variantDownloadButtons).toHaveCount(0);
    await expect(
      kit.variantsSection.getByRole('button', { name: 'Edit' })
    ).toHaveCount(0);
  });

  test('AR-02 selecting another template', async ({ page }) => {
    const kit = new ResizingKit(page);
    await kit.open();

    await kit.templateCard(1).click();

    // Selection moved: the Edit overlay is now inside the second card.
    await expect(kit.templateEditButton).toHaveCount(1);
    await expect(
      kit.templateCard(1).locator('..').getByRole('button', { name: 'Edit' })
    ).toHaveCount(1);

    await expect(kit.variantDownloadButtons).toHaveCount(0);
  });

  test('AR-02b the size text matches the presets', async ({ page }) => {
    const kit = new ResizingKit(page);
    await kit.open();

    await expect(kit.variantsSection.getByText(/^\d+ × \d+ px$/)).toHaveText([
      '1080 × 1920 px',
      '1080 × 1350 px',
      '1200 × 675 px',
      '1200 × 630 px'
    ]);
  });
});

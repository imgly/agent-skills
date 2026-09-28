import { expect, test } from '@imgly/kit-test-harness';

import { MultiImageGenerationKit } from './kit';

test.describe('Editing a template without a restaurant', () => {
  test('MIG-07 the advanced editor opens in Creator mode', async ({ page }) => {
    const kit = await MultiImageGenerationKit.open(page);

    await kit.openEditor('Square');

    // No restaurant is selected, so the kit picks the Creator configuration and
    // loads the bare template rather than a generated card. The view style is
    // left out: the kit resets it to 'default', pinned in MIG-U5.
    expect(await kit.creatorEditorState()).toEqual({
      role: 'Creator',
      theme: 'dark',
      title: 'Square',
      pageCount: 1
    });

    await expect(kit.backButton).toBeVisible();
    await expect(kit.saveButton).toBeVisible();
  });

  test('MIG-08 the Creator editor offers the template tools the Adopter one hides', async ({
    page
  }) => {
    const kit = await MultiImageGenerationKit.open(page);

    await kit.openEditor('Square');

    const features = await page.evaluate(() =>
      [
        'ly.img.placeholder',
        'ly.img.vectorEdit',
        'ly.img.shape.edit',
        'ly.img.rulers'
      ].map((id) => (window as any).cesdk.feature.isEnabled(id))
    );

    expect(features).toEqual([true, true, true, true]);
  });

  test('MIG-09 a Creator edit returns to the grid without touching the cards', async ({
    page
  }) => {
    const kit = await MultiImageGenerationKit.open(page);
    const before = await kit.cardSources();

    await kit.openEditor('Landscape');
    await kit.backButton.click();
    await kit.waitForEditorClosed();

    expect(await kit.cardSources()).toEqual(before);
  });
});

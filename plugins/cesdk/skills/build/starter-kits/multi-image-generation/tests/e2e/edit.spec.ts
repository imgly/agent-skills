import { download, expect, pngSize, test } from '@imgly/kit-test-harness';

import { MultiImageGenerationKit, RESTAURANT_NAMES } from './kit';

const RESTAURANT = RESTAURANT_NAMES[0];

async function openGenerated(page: Parameters<typeof download>[0]) {
  const kit = await MultiImageGenerationKit.open(page);
  await kit.selectRestaurant(RESTAURANT);
  await kit.waitForGenerated();
  return kit;
}

test.describe('Editing a generated card', () => {
  test('MIG-04 edit one card', async ({ page }) => {
    const kit = await openGenerated(page);

    await kit.openEditor('Portrait');

    // The kit picks the Adopter editor whenever a restaurant is selected, and
    // loads that card's saved scene rather than the blank template.
    expect(await kit.editorState()).toEqual({
      role: 'Adopter',
      theme: 'light',
      title: `${RESTAURANT} - Portrait`,
      name: RESTAURANT,
      pageCount: 1
    });
    await expect(
      page.getByRole('heading', { name: `${RESTAURANT} - Portrait` })
    ).toBeVisible();

    await expect(kit.backButton).toBeVisible();
    await expect(kit.saveButton).toBeVisible();
  });

  test('MIG-05 saving changes only that card', async ({ page }) => {
    const kit = await openGenerated(page);
    const before = await kit.cardSources();

    await kit.openEditor('Portrait');
    await kit.editRestaurantName('Saved by MIG-05');
    await kit.saveButton.click();
    await kit.waitForEditorClosed();

    await expect
      .poll(async () => (await kit.cardSources())[1])
      .not.toBe(before[1]);

    const after = await kit.cardSources();
    expect(after[0]).toBe(before[0]);
    expect(after[2]).toBe(before[2]);
  });

  test('MIG-05b a discarded edit changes nothing', async ({ page }) => {
    const kit = await openGenerated(page);
    const before = await kit.cardSources();

    await kit.openEditor('Landscape');
    await kit.editRestaurantName('Discarded by MIG-05b');
    await page.keyboard.press('Escape');
    await kit.waitForEditorClosed();

    expect(await kit.cardSources()).toEqual(before);
  });

  test('MIG-06 export the edited card', async ({ page }) => {
    const kit = await openGenerated(page);

    await kit.openEditor('Portrait');
    await kit.editRestaurantName('Exported by MIG-06');

    const files = await download(page, async () => {
      await kit.actionsDropdown.click();
      await kit.exportImagesButton.click();
    });

    expect(files).toHaveLength(1);
    expect(files[0].name).toMatch(/\.png$/);
    expect(pngSize(files[0].buffer).width).toBeGreaterThan(0);
  });
});

import { expect, test } from '@imgly/kit-test-harness';

import { EMPLOYEE_NAMES, Kit } from './kit';

test.describe('Start-up and template selection', () => {
  test('BIG-01 default state', async ({ page }) => {
    const kit = new Kit(page);
    await kit.open();

    await expect(kit.templateButton('Portrait')).toBeVisible();
    await expect(kit.templateButton('Landscape')).toBeVisible();

    for (const name of EMPLOYEE_NAMES) {
      await expect(kit.card(name)).toBeVisible();
    }

    // Only the selected template offers Edit, so there are seven in total.
    await expect(kit.editButtons).toHaveCount(EMPLOYEE_NAMES.length + 1);
    await expect(
      kit.templateButton('Portrait').getByRole('button', { name: 'Edit' })
    ).toBeVisible();
    await expect(
      kit.templateButton('Landscape').getByRole('button', { name: 'Edit' })
    ).toHaveCount(0);
  });

  test('BIG-02 switching template re-renders the cards at its size', async ({
    page
  }) => {
    const kit = new Kit(page);
    await kit.open();

    expect(await kit.card('Eray Basar').boundingBox()).toMatchObject({
      width: 180,
      height: 240
    });
    const portraitDigests = await kit.cardDigests();

    await kit.templateButton('Landscape').click();
    await expect(
      kit.templateButton('Landscape').getByRole('button', { name: 'Edit' })
    ).toBeVisible({ timeout: 120_000 });
    await expect
      .poll(async () => (await kit.card('Eray Basar').boundingBox())?.width, {
        timeout: 120_000
      })
      .toBe(260);

    expect(await kit.card('Eray Basar').boundingBox()).toMatchObject({
      width: 260,
      height: 150
    });
    expect(await kit.cardDigests()).not.toEqual(portraitDigests);
  });
});

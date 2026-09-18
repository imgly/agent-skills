import { download, expect, jpegSize, test } from '@imgly/kit-test-harness';
import {
  PRODUCTS,
  Preview,
  editDesign,
  navigationBars,
  previewSource,
  serveRepositoryFonts
} from './preview';

test.describe('The mockup preview', () => {
  for (const label of PRODUCTS) {
    test(`PP-04 an edit in the ${label} design reaches the mockup`, async ({
      kit
    }) => {
      const preview = new Preview(kit.page);
      await serveRepositoryFonts(kit.page);

      await preview.product(label).click();
      await expect(preview.product(label)).toBeEnabled({ timeout: 60_000 });
      await expect(preview.image).toBeVisible();
      const before = await previewSource(kit.page);

      await editDesign(kit);

      // The hook debounces for 1500 ms, then renders.
      await expect
        .poll(() => previewSource(kit.page), { timeout: 60_000 })
        .not.toBe(before);
    });
  }

  test('PP-05 fullscreen and Escape', async ({ kit }) => {
    const preview = new Preview(kit.page);
    await expect(preview.image).toBeVisible();
    const width = async () => (await preview.image.boundingBox())!.width;
    const split = await width();

    await preview.fullscreenButton.click();

    await expect(
      kit.page.getByRole('button', { name: 'Exit fullscreen' })
    ).toBeVisible();
    await expect.poll(width).toBeGreaterThan(split);

    await kit.page.keyboard.press('Escape');

    await expect(
      kit.page.getByRole('button', { name: 'View fullscreen' })
    ).toBeVisible();
    await expect.poll(width).toBe(split);
  });

  test('PP-06 download the mockup', async ({ kit }) => {
    const preview = new Preview(kit.page);
    await expect(preview.image).toBeVisible();

    const [file] = await download(kit.page, () =>
      preview.downloadButton.click()
    );

    expect(file.name).toBe('post-card-mockup.jpg');
    expect(jpegSize(file.buffer).width).toBeGreaterThan(0);
  });
});

test.describe('The mockup editor modal', () => {
  test('PP-07 edit the mockup scene', async ({ kit }) => {
    const preview = new Preview(kit.page);
    await expect(preview.image).toBeVisible();
    const before = await previewSource(kit.page);

    await preview.editButton.click();

    const back = preview.modalNavigationBar.getByRole('button', {
      name: 'Back'
    });
    const save = preview.modalNavigationBar.getByRole('button', {
      name: 'Save'
    });
    await expect(back).toBeVisible({ timeout: 60_000 });
    await expect(save).toBeVisible();
    await expect(navigationBars(kit.page)).toHaveCount(2);

    await save.click();

    await expect(navigationBars(kit.page)).toHaveCount(1);
    await expect
      .poll(() => previewSource(kit.page), { timeout: 60_000 })
      .not.toBe(before);
  });

  test('PP-08 an edited mockup survives further design edits', async ({
    kit
  }) => {
    const preview = new Preview(kit.page);
    await expect(preview.image).toBeVisible();

    await preview.editButton.click();
    const save = preview.modalNavigationBar.getByRole('button', {
      name: 'Save'
    });
    await expect(save).toBeVisible({ timeout: 60_000 });
    await save.click();
    await expect(navigationBars(kit.page)).toHaveCount(1);
    await expect(preview.image).toBeVisible({ timeout: 60_000 });

    const savedScene = await kit.page.evaluate(
      () => document.querySelectorAll('img[alt="Product mockup"]').length
    );
    expect(savedScene).toBe(1);

    const before = await previewSource(kit.page);
    await editDesign(kit);

    await expect
      .poll(() => previewSource(kit.page), { timeout: 60_000 })
      .not.toBe(before);
    // The kit re-renders from the saved scene string; switching product is
    // what discards it (test plan issue 4).
    await expect(preview.image).toBeVisible();
  });

  test('PP-09 Back leaves the mockup unchanged', async ({ kit }) => {
    const preview = new Preview(kit.page);
    await expect(preview.image).toBeVisible();
    const before = await previewSource(kit.page);

    await preview.editButton.click();
    const back = preview.modalNavigationBar.getByRole('button', {
      name: 'Back'
    });
    await expect(back).toBeVisible({ timeout: 60_000 });
    await back.click();

    await expect(navigationBars(kit.page)).toHaveCount(1);
    await kit.page.waitForTimeout(4000);
    expect(await previewSource(kit.page)).toBe(before);
  });
});

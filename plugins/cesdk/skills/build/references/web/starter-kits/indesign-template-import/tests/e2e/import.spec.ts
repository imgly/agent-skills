import { download, expect, test } from '@imgly/kit-test-harness';

import { EXAMPLES, KitApp, SMALLEST_DEMO_FILE } from './kit-app';

const HOLD_MS = 1500;

async function hold(route: { continue: () => Promise<void> }): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, HOLD_MS));
  await route.continue();
}

test.describe('Import', () => {
  test('IDML-02 a file picked in the dialog is imported', async ({ page }) => {
    const app = new KitApp(page);
    await app.open();

    await app.upload(SMALLEST_DEMO_FILE);
    await app.waitForResult();

    await expect(page.getByAltText('Imported Result')).toBeVisible();
    await expect(page.getByText('No Preview Available')).toBeVisible();
    await expect(page.getByAltText('Original InDesign File')).toHaveCount(0);
  });

  test('IDML-03 an example reports loading, then processing, then both previews', async ({
    page
  }) => {
    const app = new KitApp(page);
    await app.open();

    // Holding the two slowest requests makes the two states observable.
    await page.route('**/*.idml', hold);
    await page.route('**/*.wasm', hold);

    await app.example(EXAMPLES[2]).click();
    await expect(page.getByText('Loading IDML file...')).toBeVisible();
    await expect(page.getByText('Processing IDML file...')).toBeVisible();
    await expect(page.getByText(/^\d+\.\d\ds$/)).toBeVisible();

    await app.waitForResult();
    await expect(page.getByAltText('Original InDesign File')).toBeVisible();
    await expect(page.getByAltText('Imported Result')).toBeVisible();
  });

  test('IDML-07 the result screen puts the two files side by side', async ({
    page
  }) => {
    const app = new KitApp(page);
    await app.open();
    await app.importExample(EXAMPLES[2]);

    const original = page.getByRole('heading', { name: 'InDesign File' });
    const imported = page.getByRole('heading', { name: 'Imported Result' });
    await expect(original).toBeVisible();
    await expect(imported).toBeVisible();
    await expect(page.getByText('PNG Preview')).toHaveCount(2);
    await expect(app.edit).toBeVisible();
    await expect(app.downloadArchive).toBeVisible();

    const originalImage = (await page
      .getByAltText('Original InDesign File')
      .boundingBox())!;
    const importedImage = (await page
      .getByAltText('Imported Result')
      .boundingBox())!;
    const originalHeading = (await original.boundingBox())!;
    const importedHeading = (await imported.boundingBox())!;
    expect(importedHeading.y).toBeCloseTo(originalHeading.y, 0);
    expect(originalHeading.x + originalHeading.width).toBeLessThan(
      importedHeading.x
    );
    expect(originalImage.x + originalImage.width).toBeLessThan(importedImage.x);

    // The line between the columns: a painted strip that runs past both images.
    const strips = await imported.evaluate((heading) => {
      const grid = heading.parentElement!.parentElement!;
      return Array.from(grid.children).map((child) => {
        const style = getComputedStyle(child);
        const { x, y, width, height } = child.getBoundingClientRect();
        return {
          x,
          y,
          width,
          height,
          painted:
            parseFloat(style.borderLeftWidth) > 0 ||
            style.backgroundColor !== 'rgba(0, 0, 0, 0)'
        };
      });
    });
    const divider = strips.find(
      (strip) =>
        strip.painted &&
        strip.width <= 2 &&
        strip.x >= originalImage.x + originalImage.width &&
        strip.x <= importedImage.x
    );
    expect(divider).toBeDefined();
    expect(divider!.y).toBeLessThanOrEqual(
      Math.min(originalHeading.y, importedHeading.y)
    );
    expect(divider!.y + divider!.height).toBeGreaterThanOrEqual(
      Math.max(
        originalImage.y + originalImage.height,
        importedImage.y + importedImage.height
      )
    );
  });

  test('IDML-08 a clean import shows no warning and no error badge', async ({
    page
  }) => {
    const app = new KitApp(page);
    await app.open();
    await app.importExample(EXAMPLES[2]);

    // None of the three demo files makes the parser report anything; the badge
    // content itself is covered by the InfoButton component test.
    await expect(page.getByRole('button', { name: /Warning/ })).toHaveCount(0);
    await expect(page.getByRole('button', { name: /Error/ })).toHaveCount(0);
  });

  test('IDML-09 the archive downloads under the imported file name', async ({
    page
  }) => {
    const app = new KitApp(page);
    await app.open();
    await app.importExample(EXAMPLES[0]);

    const files = await download(page, () => app.downloadArchive.click());

    expect(files).toHaveLength(1);
    expect(files[0].name).toBe('socialmedia.imgly');
    expect(files[0].buffer.subarray(0, 2).toString()).toBe('PK');
  });

  test('IDML-10 New File returns to the selection screen', async ({ page }) => {
    const app = new KitApp(page);
    await app.open();
    await app.importExample(EXAMPLES[2]);

    await app.newFile.click();

    await expect(app.uploadInput).toBeAttached();
    await expect(page.getByAltText('Imported Result')).toHaveCount(0);
    for (const name of EXAMPLES) {
      await expect(app.example(name)).toBeVisible();
    }
  });

  test('IDML-06 each of the three examples imports', async ({ page }) => {
    test.slow();
    const app = new KitApp(page);
    await app.open();

    for (const name of EXAMPLES) {
      await app.importExample(name);
      await expect(page.getByAltText('Imported Result')).toBeVisible();

      const files = await download(page, () => app.downloadArchive.click());
      expect(files[0].buffer.subarray(0, 2).toString()).toBe('PK');

      await app.newFile.click();
      await expect(app.uploadInput).toBeAttached();
    }
  });
});

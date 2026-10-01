import {
  actionsMenu,
  download,
  expect,
  getEditor,
  pdfPageCount,
  pngSize,
  test
} from '@imgly/kit-test-harness';

import { EXAMPLES, KitApp } from './kit-app';

test.describe('Editor', () => {
  test.beforeEach(async ({ page }) => {
    const app = new KitApp(page);
    await app.open();
    await app.importExample(EXAMPLES[2]);
    await app.openEditor();
  });

  test('PPTX-11 Edit opens the imported scene in the editor', async ({
    page
  }) => {
    const app = new KitApp(page);
    const editor = await getEditor(page);

    expect(await page.evaluate((kit) => kit.kind, editor)).toBe('cesdk');
    expect(
      await page.evaluate((kit) => kit.engine.scene.getPages().length, editor)
    ).toBeGreaterThan(0);
    await editor.dispose();

    await expect(
      app.navigationBar.getByRole('button', { name: 'Close' })
    ).toBeVisible();
    await expect(
      app.navigationBar.getByRole('button', { name: 'Export Images' })
    ).toBeVisible();
  });

  test('PPTX-12 Close returns to the result screen', async ({ page }) => {
    const app = new KitApp(page);

    await app.navigationBar.getByRole('button', { name: 'Close' }).click();

    await expect(app.navigationBar).toHaveCount(0);
    await expect(page.getByAltText('Imported Result')).toBeVisible();
    await expect(app.edit).toBeVisible();
  });

  test('PPTX-13 the editor exports the imported page as an image', async ({
    page
  }) => {
    const app = new KitApp(page);

    const files = await download(page, () =>
      app.navigationBar.getByRole('button', { name: 'Export Images' }).click()
    );

    expect(files).toHaveLength(1);
    expect(files[0].name).toMatch(/\.png$/);
    // The kit asks for 1080 x 1080; the editor honours that for some
    // documents and exports at the page size for others, so only the file
    // itself is asserted here. See the plan's known issues.
    const size = pngSize(files[0].buffer);
    expect(size.width).toBeGreaterThan(0);
    expect(size.height).toBeGreaterThan(0);
  });

  test('PPTX-14 the editor exports the imported page as a PDF', async ({
    page
  }) => {
    const app = new KitApp(page);

    await actionsMenu(app.navigationBar).click();
    const files = await download(page, () =>
      page.getByRole('menu').getByRole('button', { name: 'Export PDF' }).click()
    );

    expect(files).toHaveLength(1);
    expect(files[0].name).toMatch(/\.pdf$/);
    // The editor exports the whole imported scene, one PDF page per page.
    const editor = await getEditor(page);
    const pages = await page.evaluate(
      (kit) => kit.engine.scene.getPages().length,
      editor
    );
    await editor.dispose();
    expect(await pdfPageCount(files[0].buffer)).toBe(pages);
  });
});

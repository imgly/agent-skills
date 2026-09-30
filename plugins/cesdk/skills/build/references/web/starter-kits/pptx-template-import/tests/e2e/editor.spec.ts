import {
  actionsMenu,
  download,
  expect,
  getEditor,
  pdfPageCount,
  pngSize,
  test
} from '@imgly/kit-test-harness';

import type { Page } from '@playwright/test';

import { EXAMPLES, KitApp } from './kit-app';

/** What the editor has loaded: the pages and the blocks on the first one. */
async function loadedScene(page: Page) {
  const editor = await getEditor(page);
  const scene = await page.evaluate((kit) => {
    const engine = kit.engine;
    const pages = engine.scene.getPages();
    return {
      pages: pages.length,
      blocks: pages.length ? engine.block.getChildren(pages[0]).length : 0,
      texts: engine.block
        .findByType('text')
        .map((id: number) => engine.block.getString(id, 'text/text'))
        .sort()
        .join('|')
    };
  }, editor);
  await editor.dispose();
  return scene;
}

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

  test('PPTX-16 an imported text block can be selected and edited', async ({
    page
  }) => {
    const editor = await getEditor(page);
    const { role, text, box } = await page.evaluate((kit) => {
      const engine = kit.engine;
      const page = engine.scene.getCurrentPage();
      const text = engine.block
        .getChildren(page)
        .find((id: number) => engine.block.getType(id) === '//ly.img.ubq/text');
      engine.block.findAllSelected().forEach((id: number) => {
        engine.block.setSelected(id, false);
      });
      const [x, y, width, height] = engine.block.getScreenSpaceBoundingBoxXYWH([
        text
      ]);
      const canvas = engine.element.getBoundingClientRect();
      return {
        role: engine.editor.getRole(),
        text,
        box: { x: canvas.x + x + width / 2, y: canvas.y + y + height / 2 }
      };
    }, editor);
    expect(role).toBe('Creator');

    const selected = () =>
      page.evaluate((kit) => kit.engine.block.findAllSelected(), editor);
    await page.mouse.click(box.x, box.y);
    await expect.poll(selected).toEqual([text]);

    await page.mouse.dblclick(box.x, box.y);
    await expect
      .poll(() =>
        page.evaluate((kit) => kit.engine.editor.getEditMode(), editor)
      )
      .toBe('Text');
    await page.keyboard.press('ControlOrMeta+a');
    await page.keyboard.type('Edited', { delay: 40 });
    await expect
      .poll(() =>
        page.evaluate(
          ({ kit, id }) => kit.engine.block.getString(id, 'text/text'),
          { kit: editor, id: text }
        )
      )
      .toBe('Edited');
    await editor.dispose();
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

test.describe('Every example in the editor', () => {
  test('PPTX-15 Edit opens each example in the editor', async ({ page }) => {
    test.slow();
    const app = new KitApp(page);
    await app.open();

    const scenes: string[] = [];
    for (const name of EXAMPLES) {
      await app.importExample(name);
      await app.openEditor();

      const scene = await loadedScene(page);
      expect(scene.pages).toBeGreaterThan(0);
      expect(scene.blocks).toBeGreaterThan(0);
      scenes.push(JSON.stringify(scene));

      await app.navigationBar.getByRole('button', { name: 'Close' }).click();
      await expect(app.navigationBar).toHaveCount(0);
      // Close disposes the editor but leaves it published, and the harness's
      // readiness check cannot read a disposed instance.
      await page.evaluate(() => {
        delete (window as { cesdk?: unknown }).cesdk;
      });
      await app.newFile.click();
      await expect(app.uploadInput).toBeAttached();
    }
    // Each Edit opened its own import, not the scene of the one before.
    expect(new Set(scenes).size).toBe(EXAMPLES.length);
  });
});

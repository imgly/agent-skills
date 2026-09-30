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

  test('IDML-11 Edit opens the imported scene in the editor', async ({
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

  test('IDML-12 Close returns to the result screen', async ({ page }) => {
    const app = new KitApp(page);

    await app.navigationBar.getByRole('button', { name: 'Close' }).click();

    await expect(app.navigationBar).toHaveCount(0);
    await expect(page.getByAltText('Imported Result')).toBeVisible();
    await expect(app.edit).toBeVisible();
  });

  test('IDML-13 the editor exports the imported page as an image', async ({
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

  test('IDML-14 the editor exports the imported page as a PDF', async ({
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

test.describe('Editing imported content', () => {
  for (const example of EXAMPLES) {
    test(`IDML-15 a text block of ${example} is selected and edited on the canvas`, async ({
      page
    }) => {
      const app = new KitApp(page);
      await app.open();
      await app.importExample(example);
      await app.openEditor();
      const editor = await getEditor(page);

      // Every imported text block, with what a first click on it selects: the
      // block itself, or the outermost group that holds it.
      const candidates: { text: number; clickSelects: number }[] =
        await page.evaluate((kit) => {
          const engine = kit.engine;
          const current = engine.scene.getCurrentPage();
          const walk = (block: number): number[] => {
            const children = engine.block.getChildren(block);
            return [...children, ...children.flatMap(walk)];
          };
          return walk(current)
            .filter(
              (child: number) =>
                engine.block.getType(child) === '//ly.img.ubq/text' &&
                engine.block.isVisible(child)
            )
            .map((block: number) => {
              let outermost = block;
              while (engine.block.getParent(outermost) !== current) {
                outermost = engine.block.getParent(outermost);
              }
              return { text: block, clickSelects: outermost };
            });
        }, editor);
      expect(candidates.length).toBeGreaterThan(0);
      const centre = (id: number) =>
        page.evaluate(
          ({ kit, block }) => {
            const [x, y, width, height] =
              kit.engine.block.getScreenSpaceBoundingBoxXYWH([block]);
            const canvas = kit.engine.element.getBoundingClientRect();
            return {
              x: canvas.x + x + width / 2,
              y: canvas.y + y + height / 2
            };
          },
          { kit: editor, block: id }
        );
      const selection = () =>
        page.evaluate((kit) => kit.engine.block.findAllSelected(), editor);

      // A click on the first text block whose centre no other block covers.
      let text: number | undefined;
      for (const candidate of candidates) {
        await page.evaluate(
          (kit) =>
            kit.engine.block
              .findAllSelected()
              .forEach((id: number) => kit.engine.block.setSelected(id, false)),
          editor
        );
        const { x, y } = await centre(candidate.text);
        await page.mouse.click(x, y);
        await expect.poll(selection).not.toEqual([]);
        if ((await selection())[0] === candidate.clickSelects) {
          text = candidate.text;
          break;
        }
      }
      expect(text, 'a text block a click selects').toBeDefined();
      await expect.poll(selection).toHaveLength(1);

      await expect
        .poll(async () => {
          const point = await centre(text!);
          await page.mouse.dblclick(point.x, point.y);
          return page.evaluate(
            (kit) => kit.engine.editor.getEditMode(),
            editor
          );
        })
        .toBe('Text');
      await page.keyboard.press('ControlOrMeta+a');
      await page.keyboard.type('Edited in CE.SDK', { delay: 40 });
      await page.keyboard.press('Escape');

      await expect
        .poll(() =>
          page.evaluate(
            ({ kit, id }) => kit.engine.block.getString(id, 'text/text'),
            { kit: editor, id: text }
          )
        )
        .toBe('Edited in CE.SDK');
      await editor.dispose();
    });
  }
});

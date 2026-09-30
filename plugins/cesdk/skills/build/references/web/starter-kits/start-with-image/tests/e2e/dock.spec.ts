import { expect, test } from '@imgly/kit-test-harness';
import { chooseImage, dockEntry } from './kit';

const PANELS = {
  Adjust: '//ly.img.panel/inspector/adjustments',
  Filter: '//ly.img.panel/inspector/filters',
  Effects: '//ly.img.panel/inspector/effects'
};

test.describe('The dock the kit builds', () => {
  test('SWI-04 no image library and no upload entry', async ({ page }) => {
    await page.goto('./');
    const editor = await chooseImage(page, 0);

    for (const label of [
      'Crop',
      'Adjust',
      'Filter',
      'Effects',
      'Text',
      'Shapes',
      'Stickers'
    ]) {
      await expect(dockEntry(page, label)).toBeVisible();
    }
    for (const label of ['Images', 'Uploads', 'Templates', 'Elements']) {
      await expect(dockEntry(page, label)).toHaveCount(0);
    }

    const features = await page.evaluate(({ engine, cesdk }) => {
      engine.block.select(engine.scene.getCurrentPage());
      return {
        canvasMenu: cesdk.feature.isEnabled('ly.img.canvas.menu', { engine }),
        inspectorBar: cesdk.feature.isEnabled('ly.img.inspector.bar', {
          engine
        })
      };
    }, editor);

    expect(features).toEqual({
      canvasMenu: false,
      inspectorBar: false
    });
  });

  test('SWI-05 crop', async ({ page }) => {
    await page.goto('./');
    const editor = await chooseImage(page, 0);
    const editMode = () =>
      page.evaluate(({ engine }) => engine.editor.getEditMode(), editor);

    await dockEntry(page, 'Crop').click();
    await expect.poll(editMode).toBe('Crop');

    await dockEntry(page, 'Crop').click();
    await expect.poll(editMode).toBe('Transform');
  });

  const PHOTO_TOOLS = [
    { id: 'SWI-06', label: 'Adjust', panel: PANELS.Adjust },
    { id: 'SWI-07', label: 'Filter', panel: PANELS.Filter },
    { id: 'SWI-08', label: 'Effects', panel: PANELS.Effects }
  ];

  for (const tool of PHOTO_TOOLS) {
    test(`${tool.id} ${tool.label.toLowerCase()}`, async ({ page }) => {
      await page.goto('./');
      const editor = await chooseImage(page, 0);
      const state = () =>
        page.evaluate(
          ({ kit, panel }) => ({
            open: kit.cesdk.ui.isPanelOpen(panel),
            selection: kit.engine.block.findAllSelected(),
            currentPage: kit.engine.scene.getCurrentPage()
          }),
          { kit: editor, panel: tool.panel }
        );

      await dockEntry(page, tool.label).click();
      await expect.poll(async () => (await state()).open).toBe(true);
      const opened = await state();
      expect(opened.selection).toEqual([opened.currentPage]);

      await dockEntry(page, tool.label).click();
      await expect.poll(async () => (await state()).open).toBe(false);
    });
  }
});

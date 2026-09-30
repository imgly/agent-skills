import { actionsMenu, expect, test } from '@imgly/kit-test-harness';

const DOCK_ENTRIES = [
  'Templates',
  'Elements',
  'Uploads',
  'Images',
  'Text',
  'Shapes',
  'Stickers'
];

test.describe('Design editor start-up', () => {
  test('DE-01 the editor loads the marketing template with the design editor layout', async ({
    kit
  }) => {
    const pageCount = await kit.page.evaluate(
      (cesdk) => cesdk.engine.scene.getPages().length,
      kit.editor
    );
    expect(pageCount).toBe(1);

    const editor = kit.page.locator('#cesdk_container');
    for (const entry of DOCK_ENTRIES) {
      await expect(
        editor.getByRole('button', { name: entry, exact: true })
      ).toBeVisible();
    }

    await expect(editor.getByRole('button', { name: 'Undo' })).toBeVisible();
    await expect(editor.getByRole('button', { name: 'Redo' })).toBeVisible();
    await expect(editor.getByRole('button', { name: 'Zoom In' })).toBeVisible();
    await expect(
      editor.getByRole('button', { name: 'Zoom Out' })
    ).toBeVisible();
    await expect(
      editor.getByRole('button', { name: 'Document', exact: true })
    ).toBeVisible();
  });

  test('DE-02 the actions dropdown carries the kit entries', async ({
    kit
  }) => {
    const editor = kit.page.locator('#cesdk_container');

    // `ly.img.saveScene.navigationBar` renders as its own button; the other
    // five kit entries live inside the dropdown next to it.
    await expect(editor.getByRole('button', { name: 'Save' })).toBeVisible();

    await actionsMenu(editor).click();

    const menu = kit.page.getByRole('menu');
    await expect(menu.getByRole('button')).toHaveText([
      'Export Images',
      'Export PDF',
      'Export Design',
      'Export Archive',
      'Import'
    ]);
  });

  test('DE-03 background removal is offered on an image block', async ({
    kit
  }) => {
    const selected = await kit.page.evaluate((cesdk) => {
      const { block } = cesdk.engine;
      const image = block
        .findAll()
        .find(
          (id: number) =>
            block.getType(id) === '//ly.img.ubq/graphic' &&
            block.supportsFill(id) &&
            block.getType(block.getFill(id)) === '//ly.img.ubq/fill/image'
        );
      if (image == null) {
        return null;
      }
      block.select(image);
      return image;
    }, kit.editor);
    expect(selected).not.toBeNull();

    await expect(
      kit.page.getByRole('button', { name: 'BG Removal' })
    ).toBeVisible();
  });
});

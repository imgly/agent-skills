import {
  actionsMenu,
  editorPanel,
  expect,
  test
} from '@imgly/kit-test-harness';

const DOCK_ENTRIES = [
  'Templates',
  'Elements',
  'Uploads',
  'Images',
  'Text',
  'Shapes',
  'Stickers'
];

test.describe('Advanced design editor start-up', () => {
  test('ADE-01 the editor loads the marketing template with the advanced layout', async ({
    kit
  }) => {
    const pageCount = await kit.page.evaluate(
      (cesdk) => cesdk.engine.scene.getPages().length,
      kit.editor
    );
    expect(pageCount).toBe(1);

    const editor = kit.page.locator('#cesdk_container');
    for (const entry of DOCK_ENTRIES) {
      const button = editor.getByRole('button', { name: entry, exact: true });
      await expect(button).toBeVisible();
      // The advanced configuration hides the dock labels; the design editor
      // configuration shows them. This is what tells the two kits apart.
      await expect(button).toHaveText('');
    }
  });

  test('ADE-02 the inspector opens on the right of the canvas', async ({
    kit
  }) => {
    await kit.page.evaluate((cesdk) => {
      const { block } = cesdk.engine;
      block.select(
        block
          .findAll()
          .find((id: number) => block.getType(id) === '//ly.img.ubq/text')
      );
    }, kit.editor);

    const inspector = editorPanel(kit.page, '//ly.img.panel/inspector');
    await expect(inspector).toBeVisible();

    const box = await inspector.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.x).toBeGreaterThan(700);
  });

  test('ADE-03 the actions dropdown carries the kit entries', async ({
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
});

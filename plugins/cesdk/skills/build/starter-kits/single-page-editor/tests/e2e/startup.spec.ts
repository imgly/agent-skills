import {
  actionsMenu,
  editorPanel,
  expect,
  test
} from '@imgly/kit-test-harness';
import { CanvasBar } from './page-select';

const DOCK_ENTRIES = [
  'Templates',
  'Elements',
  'Uploads',
  'Images',
  'Text',
  'Shapes',
  'Stickers'
];

test.describe('Single page editor start-up', () => {
  test('SPE-01 the editor loads the four-page archive in single-page mode', async ({
    kit
  }) => {
    const state = await kit.page.evaluate((cesdk) => {
      const { block, editor, scene } = cesdk.engine;
      const pages = scene.getPages();
      return {
        pages: pages.length,
        visible: pages.filter((id: number) => block.isVisible(id)).length,
        singlePageMode: editor.getSettingBool('features/singlePageModeEnabled')
      };
    }, kit.editor);

    expect(state).toEqual({ pages: 4, visible: 1, singlePageMode: true });

    const canvasBar = new CanvasBar(kit.page);
    await expect(canvasBar.pageSelect).toHaveText('Page 1 / 4');
    await expect(canvasBar.addPage).toBeVisible();

    const editorRegion = kit.page.locator('#cesdk_container');
    for (const entry of DOCK_ENTRIES) {
      await expect(
        editorRegion.getByRole('button', { name: entry, exact: true })
      ).toBeVisible();
    }
  });

  test('SPE-02 the inspector and the asset library dock on the left', async ({
    kit
  }) => {
    const editorRegion = kit.page.locator('#cesdk_container');
    await editorRegion
      .getByRole('button', { name: 'Images', exact: true })
      .click();

    const assets = editorPanel(kit.page, '//ly.img.panel/assetLibrary');
    await expect(assets).toBeVisible();
    const assetsBox = await assets.boundingBox();
    expect(assetsBox!.x).toBeLessThan(400);

    await kit.page.evaluate((cesdk) => {
      const { block } = cesdk.engine;
      block.select(
        block
          .findAll()
          .find((id: number) => block.getType(id) === '//ly.img.ubq/text')
      );
    }, kit.editor);

    await kit.page
      .locator('[name="InspectorBarBuilder-Button-inspectorToggle"]')
      .click();

    const inspector = editorPanel(kit.page, '//ly.img.panel/inspector');
    await expect(inspector).toBeVisible();
    const inspectorBox = await inspector.boundingBox();
    expect(inspectorBox!.x).toBeLessThan(400);
  });

  test('SPE-03 the navigation bar carries the two export entries only', async ({
    kit
  }) => {
    const editorRegion = kit.page.locator('#cesdk_container');

    // `ly.img.exportImage.navigationBar` renders as its own button; the actions
    // dropdown next to it holds the remaining entry.
    await expect(
      editorRegion.getByRole('button', { name: 'Export Images' })
    ).toBeVisible();

    await actionsMenu(editorRegion).click();

    await expect(kit.page.getByRole('menu').getByRole('button')).toHaveText([
      'Export PDF'
    ]);
  });
});

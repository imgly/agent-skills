import { expect, test } from '@imgly/kit-test-harness';
import { cutoutBlocks, waitForCutoutSource } from './cutouts';

test.describe('Start-up and the dock', () => {
  test('CL-01 editor loads with Cutout first in the dock', async ({ kit }) => {
    const page = await kit.page.evaluate((handle) => {
      const engine = handle.engine;
      const [first] = engine.scene.getPages();
      return {
        count: engine.scene.getPages().length,
        width: engine.block.getWidth(first),
        height: engine.block.getHeight(first),
        unit: engine.scene.getDesignUnit()
      };
    }, kit.editor);

    expect(page).toEqual({
      count: 1,
      width: 148,
      height: 105,
      unit: 'Millimeter'
    });

    const dock = kit.page.getByRole('region', { name: 'Left Dock' });
    await expect(
      dock.getByRole('button', { name: 'Cutout', exact: true })
    ).toBeVisible();
    for (const label of [
      'Elements',
      'Uploads',
      'Images',
      'Text',
      'Shapes',
      'Stickers'
    ]) {
      await expect(
        dock.getByRole('button', { name: label, exact: true })
      ).toBeVisible();
    }
    await expect(
      dock.getByRole('button', { name: 'Templates', exact: true })
    ).toBeHidden();

    const order = await kit.page.evaluate(
      (handle) =>
        handle.cesdk.ui
          .getComponentOrder({ in: 'ly.img.dock' })
          .map((entry: { key?: string }) => entry.key),
      kit.editor
    );
    expect(order.slice(0, 3)).toEqual([
      'ly.img.assetLibrary.dock',
      'ly.img.separator',
      'ly.img.elements'
    ]);
  });

  test('CL-02 the Cutout panel adds a rectangle and a circle', async ({
    kit
  }) => {
    await waitForCutoutSource(kit.page, kit.editor);
    const panel = kit.page.getByRole('complementary', { name: 'Cutout' });

    let count = (await cutoutBlocks(kit.page, kit.editor)).length;
    for (const asset of ['Cutout Rectangle', 'Cutout Circle']) {
      // Adding an asset closes the panel, so each one needs its own open.
      await kit.page
        .getByRole('region', { name: 'Left Dock' })
        .getByRole('button', { name: 'Cutout', exact: true })
        .click();
      await expect(
        panel.getByRole('heading', { name: 'Cutout' })
      ).toBeVisible();
      await panel.getByRole('button', { name: asset, exact: true }).click();
      await expect
        .poll(async () => (await cutoutBlocks(kit.page, kit.editor)).length)
        .toBe(count + 1);
      count += 1;

      const selected = await kit.page.evaluate((handle) => {
        const engine = handle.engine;
        return engine.block
          .findAllSelected()
          .map((id: number) => engine.block.getType(id));
      }, kit.editor);
      expect(selected).toEqual(['//ly.img.ubq/cutout']);
    }
  });
});

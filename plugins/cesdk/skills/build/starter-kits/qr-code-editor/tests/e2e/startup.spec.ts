import { editorPanel, expect, test } from '@imgly/kit-test-harness';
import { qrBlocks, select } from './qr';

const UPDATE_PANEL = '//ly.img.panel/update-qr';

test.describe('Start-up and the dock', () => {
  test('QR-01 editor loads with the QR Code entry at the bottom of the dock', async ({
    kit
  }) => {
    const scene = await kit.page.evaluate((handle) => {
      const engine = handle.engine;
      const [first] = engine.scene.getPages();
      return {
        pages: engine.scene.getPages().length,
        width: engine.block.getWidth(first),
        height: engine.block.getHeight(first),
        unit: engine.scene.getDesignUnit()
      };
    }, kit.editor);

    expect(scene).toEqual({
      pages: 1,
      width: 148,
      height: 105,
      unit: 'Millimeter'
    });
    expect(await qrBlocks(kit.page, kit.editor)).toHaveLength(2);

    const dock = await kit.page.evaluate(
      (handle) =>
        handle.cesdk.ui
          .getComponentOrder({ in: 'ly.img.dock' })
          .map((entry: { key?: string; id?: string }) => entry.key ?? entry.id),
      kit.editor
    );
    expect(dock.slice(-2)).toEqual([
      'ly.img.spacer',
      'ly.img.generate-qr.dock'
    ]);
    await expect(
      kit.page
        .locator('#cesdk_container')
        .getByRole('button', { name: 'QR Code', exact: true })
    ).toBeVisible();
  });

  test('QR-02 start-up selects a QR block', async ({ kit }) => {
    const [first] = await qrBlocks(kit.page, kit.editor);
    const selected = await kit.page.evaluate(
      (handle) => handle.engine.block.findAllSelected(),
      kit.editor
    );

    expect(selected).toEqual([first.id]);
  });

  test('QR-03 the demo QR codes point at img.ly', async ({ kit }) => {
    const blocks = await qrBlocks(kit.page, kit.editor);
    // The first demo code carries no scheme; whether a scanner opens it is
    // the encoder's contract, not the kit's.
    expect(blocks.map((block) => block.url)).toEqual([
      'img.ly',
      'https://img.ly/'
    ]);

    for (const block of blocks) {
      await select(kit.page, kit.editor, [block.id]);
      await kit.page
        .getByRole('region', { name: 'Canvas' })
        .getByRole('button', { name: 'Edit', exact: true })
        .click();
      await expect(
        editorPanel(kit.page, UPDATE_PANEL).getByRole('textbox')
      ).toHaveValue(block.url);
    }
  });
});

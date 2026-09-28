import { editorPanel, expect, test } from '@imgly/kit-test-harness';

const RESIZE_PANEL = '//ly.img.panel/inspector/pageResize';

test.describe('Start-up and the dock button', () => {
  test('PGS-01 the Resize Page panel is open on load', async ({ kit }) => {
    const isOpen = await kit.page.evaluate(
      (handle) =>
        handle.cesdk.ui.isPanelOpen('//ly.img.panel/inspector/pageResize'),
      kit.editor
    );
    expect(isOpen).toBe(true);
    await expect(editorPanel(kit.page, RESIZE_PANEL)).toBeVisible();
    await expect(
      kit.page.getByRole('button', { name: 'Page Sizes' })
    ).toBeVisible();
    const blocks = await kit.page.evaluate(
      (handle) =>
        handle.engine.block.getChildren(handle.engine.scene.getCurrentPage())
          .length,
      kit.editor
    );
    expect(blocks).toBeGreaterThan(0);
  });

  test('PGS-02 the dock button toggles the panel', async ({ kit }) => {
    const button = kit.page.getByRole('button', { name: 'Page Sizes' });
    const panel = editorPanel(kit.page, RESIZE_PANEL);
    const isOpen = () =>
      kit.page.evaluate(
        (handle) =>
          handle.cesdk.ui.isPanelOpen('//ly.img.panel/inspector/pageResize'),
        kit.editor
      );

    await button.click();
    await expect(panel).toBeHidden();
    expect(await isOpen()).toBe(false);

    await button.click();
    await expect(panel).toBeVisible();
    expect(await isOpen()).toBe(true);
  });

  test('PGS-03 dock order', async ({ kit }) => {
    const dock = await kit.page.evaluate(
      (handle) =>
        handle.cesdk.ui
          .getComponentOrder({ in: 'ly.img.dock' })
          .map((entry: { key?: string; id?: string } | string) =>
            typeof entry === 'string' ? entry : (entry.key ?? entry.id)
          ),
      kit.editor
    );

    expect(dock).toEqual([
      'ly.img.page.resize.dock',
      'ly.img.separator',
      'ly.img.templates',
      'ly.img.separator',
      'ly.img.elements',
      'ly.img.upload',
      'ly.img.image',
      'ly.img.text',
      'ly.img.vector.shape',
      'ly.img.sticker',
      'ly.img.spacer',
      'ly.img.separator.layers',
      'ly.img.layerList'
    ]);
  });
});

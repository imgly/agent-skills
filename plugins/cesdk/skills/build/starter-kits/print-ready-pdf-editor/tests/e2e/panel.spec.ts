import { expect, test } from '@imgly/kit-test-harness';
import { ExportPanel, PANEL_ID } from './export-panel';

test.describe('The panel', () => {
  test('PRP-01 the export panel is closed on start-up', async ({ kit }) => {
    const scene = await kit.page.evaluate((handle) => {
      const engine = handle.engine;
      const pages = engine.scene.getPages();
      return {
        count: pages.length,
        sizes: pages.map((id: number) => [
          Math.round(engine.block.getWidth(id)),
          Math.round(engine.block.getHeight(id))
        ]),
        open: handle.cesdk.ui.isPanelOpen(
          '//ly.img.panel/export-print-ready-pdf'
        )
      };
    }, kit.editor);

    expect(scene.count).toBe(2);
    expect(scene.sizes).toEqual([
      [1080, 1080],
      [1080, 1080]
    ]);
    expect(scene.open).toBe(false);

    const panel = new ExportPanel(kit.page);
    await expect(panel.navigationBarButton).toBeVisible();
    await expect(panel.root).toHaveCount(0);
  });

  test('PRP-02 the Export button toggles the panel', async ({ kit }) => {
    const panel = new ExportPanel(kit.page);
    const isOpen = () =>
      kit.page.evaluate(
        ([handle, id]) =>
          (
            handle as { cesdk: { ui: { isPanelOpen(p: string): boolean } } }
          ).cesdk.ui.isPanelOpen(id as string),
        [kit.editor, PANEL_ID] as const
      );

    await panel.open();
    expect(await isOpen()).toBe(true);

    await panel.navigationBarButton.click();
    await expect(panel.root).toHaveCount(0);
    expect(await isOpen()).toBe(false);
  });

  test('PRP-03 panel defaults', async ({ kit }) => {
    const panel = new ExportPanel(kit.page);
    await panel.open();

    await expect(panel.selectWithValue('PDF/X-4 (recommended)')).toBeVisible();
    await expect(
      panel.selectWithValue('ISO Coated v2 (ECI) (CMYK)')
    ).toBeVisible();
    await expect(panel.bleedCheckbox).toBeChecked();
    await expect(panel.bleedMargin).toHaveValue('3');
    await expect(panel.pagesButton('All')).toBeVisible();
    await expect(panel.pagesButton('All')).toHaveAttribute(
      'aria-pressed',
      'true'
    );
    await expect(panel.pageRange).toHaveCount(0);
  });

  test('PRP-04 bleed controls', async ({ kit }) => {
    const panel = new ExportPanel(kit.page);
    await panel.open();

    await panel.bleedMargin.fill('5');
    await panel.bleedMargin.blur();
    await expect(panel.bleedMargin).toHaveValue('5');

    await panel.bleedCheckbox.click();
    await expect(panel.bleedMargin).toHaveCount(0);
  });
});

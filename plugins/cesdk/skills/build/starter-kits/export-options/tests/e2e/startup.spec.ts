import { expect, test } from '@imgly/kit-test-harness';
import { ExportPanel } from './export-panel';

test.describe('Start-up and panel', () => {
  test('EO-01 editor loads with the export panel', async ({ kit }) => {
    const panel = new ExportPanel(kit.page);

    const pageCount = await kit.page.evaluate(
      (handle) => handle.engine.scene.getPages().length,
      kit.editor
    );
    expect(pageCount).toBe(2);

    const isOpen = await kit.page.evaluate(
      (handle) => handle.cesdk.ui.isPanelOpen('//ly.img.panel/export'),
      kit.editor
    );
    expect(isOpen).toBe(true);

    await expect(panel.root).toBeVisible();
    await expect(panel.exportButton).toBeEnabled();
  });

  test('EO-02 the Export button toggles the panel', async ({ kit }) => {
    const panel = new ExportPanel(kit.page);
    const isOpen = () =>
      kit.page.evaluate(
        (handle) => handle.cesdk.ui.isPanelOpen('//ly.img.panel/export'),
        kit.editor
      );

    await panel.navigationBarExportButton.click();
    await expect(panel.root).toBeHidden();
    expect(await isOpen()).toBe(false);

    await panel.navigationBarExportButton.click();
    await expect(panel.root).toBeVisible();
    expect(await isOpen()).toBe(true);
  });
});

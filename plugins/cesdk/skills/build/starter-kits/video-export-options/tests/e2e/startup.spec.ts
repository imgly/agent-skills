import { expect, test } from '@imgly/kit-test-harness';
import { ExportPanel } from './export-panel';

test.describe('Start-up and the panel toggle', () => {
  test('VEO-01 the export panel is open on the right at start-up', async ({
    kit
  }) => {
    const panel = new ExportPanel(kit.page);

    expect(await panel.isOpen()).toBe(true);
    await expect(panel.title).toBeVisible();
    await expect(panel.exportButton).toBeEnabled();

    const position = await kit.page.evaluate(
      (handle) =>
        handle.cesdk.ui.getPanelPosition('//ly.img.panel/video-export'),
      kit.editor
    );
    expect(position).toBe('right');
  });

  test('VEO-02 the Export Video button toggles the panel', async ({ kit }) => {
    const panel = new ExportPanel(kit.page);

    await panel.navigationBarExportButton.click();
    await expect(panel.root).toBeHidden();
    expect(await panel.isOpen()).toBe(false);

    await panel.navigationBarExportButton.click();
    await expect(panel.root).toBeVisible();
    expect(await panel.isOpen()).toBe(true);
  });

  test('VEO-03 the format note is shown', async ({ kit }) => {
    await expect(new ExportPanel(kit.page).formatNote).toBeVisible();
  });
});

test.describe('Defaults for this scene', () => {
  test('VEO-04 Full HD is selected and SD is filtered out', async ({ kit }) => {
    const panel = new ExportPanel(kit.page);

    await expect(panel.resolutionSelect).toHaveText('Full HD (FHD)');
    // The page is 16:9, so the 4:3 Standard Definition preset is not offered.
    expect(await panel.listResolutions()).toEqual([
      'High Definition (HD)',
      'Full HD (FHD)',
      'Quad HD (2K)',
      'Ultra HD (4K)',
      'Custom'
    ]);
  });

  test('VEO-05 30 FPS is selected and the control has a tooltip', async ({
    kit
  }) => {
    const panel = new ExportPanel(kit.page);

    await expect(panel.fpsSelect).toHaveText('30 FPS');

    await panel.fpsSelect.click();
    await expect(kit.page.getByRole('option')).toHaveText([
      '24 FPS',
      '30 FPS',
      '60 FPS',
      '120 FPS'
    ]);
    await kit.page.keyboard.press('Escape');

    await panel.fpsSelect.hover();
    await expect(
      kit.page.getByText(/Select the frames per second/)
    ).toBeVisible();
  });
});

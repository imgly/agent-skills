import { expect, test } from '@imgly/kit-test-harness';
import { Html5ExportPanel } from './export-panel';

const PANEL_ID = '//ly.img.panel/html5-export';

test.describe('Start-up and panel', () => {
  test('H5-01 editor loads with the banner scene', async ({ kit }) => {
    const panel = new Html5ExportPanel(kit.page);

    const scene = await kit.page.evaluate(
      (handle) => ({
        pages: handle.engine.scene.getPages().length,
        mode: handle.engine.scene.getMode(),
        panelOpen: handle.cesdk.ui.isPanelOpen('//ly.img.panel/html5-export')
      }),
      kit.editor
    );

    expect(scene.pages).toBe(1);
    expect(scene.mode).toBe('Video');
    expect(scene.panelOpen).toBe(false);
    await expect(panel.navigationBarButton).toBeVisible();
  });

  test('H5-02 Export opens the panel on the right', async ({ kit }) => {
    const panel = new Html5ExportPanel(kit.page);

    await panel.navigationBarButton.click();

    await expect(panel.title).toBeVisible();
    expect(
      await kit.page.evaluate(
        ([handle, id]) =>
          (handle as { cesdk: any }).cesdk.ui.getPanelPosition(id),
        [kit.editor, PANEL_ID] as const
      )
    ).toBe('right');
  });

  test('H5-03 Export closes the panel again', async ({ kit }) => {
    const panel = new Html5ExportPanel(kit.page);

    await panel.navigationBarButton.click();
    await expect(panel.root).toBeVisible();
    await panel.navigationBarButton.click();

    await expect(panel.root).toHaveCount(0);
  });

  test('H5-04 defaults and toggling', async ({ kit }) => {
    const panel = new Html5ExportPanel(kit.page);
    await panel.navigationBarButton.click();
    const active = (button: ReturnType<Html5ExportPanel['formatButton']>) =>
      button.getAttribute('data-active');

    expect(await active(panel.formatButton('Embedded'))).toBe('true');
    expect(await active(panel.formatButton('External'))).toBe('false');
    expect(await active(panel.textModeButton('HTML Text'))).toBe('true');
    expect(await active(panel.textModeButton('Vector'))).toBe('false');

    await panel.formatButton('External').click();
    expect(await active(panel.formatButton('External'))).toBe('true');
    expect(await active(panel.formatButton('Embedded'))).toBe('false');
    await panel.formatButton('Embedded').click();
    expect(await active(panel.formatButton('Embedded'))).toBe('true');

    await panel.textModeButton('Vector').click();
    expect(await active(panel.textModeButton('Vector'))).toBe('true');
    expect(await active(panel.textModeButton('HTML Text'))).toBe('false');
    await panel.textModeButton('HTML Text').click();
    expect(await active(panel.textModeButton('HTML Text'))).toBe('true');
  });

  test('H5-05 the description follows the selection', async ({ kit }) => {
    const panel = new Html5ExportPanel(kit.page);
    await panel.navigationBarButton.click();

    await expect(
      panel.root.getByText(
        'Single self-contained HTML file with base64-embedded assets'
      )
    ).toBeVisible();
    await panel.formatButton('External').click();
    await expect(
      panel.root.getByText('HTML file with separate image and font asset files')
    ).toBeVisible();

    await expect(
      panel.root.getByText('Selectable and searchable text with CSS styling')
    ).toBeVisible();
    await panel.textModeButton('Vector').click();
    await expect(
      panel.root.getByText('Pixel-perfect vectorized text (not selectable)')
    ).toBeVisible();
  });

  test('H5-06 the page input is hidden on a single-page scene', async ({
    kit
  }) => {
    const panel = new Html5ExportPanel(kit.page);
    await panel.navigationBarButton.click();

    await expect(panel.root).toBeVisible();
    await expect(panel.pageInput).toHaveCount(0);
    await expect(panel.root.getByText(/^Page \d+ of \d+$/)).toHaveCount(0);
  });
});

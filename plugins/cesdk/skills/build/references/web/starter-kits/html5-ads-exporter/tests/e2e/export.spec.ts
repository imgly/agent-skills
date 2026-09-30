import { download, expect, test } from '@imgly/kit-test-harness';
import { Html5ExportPanel } from './export-panel';

test.describe('Export and preview', () => {
  test('H5-07 Export & Preview opens a self-contained tab', async ({ kit }) => {
    const panel = new Html5ExportPanel(kit.page);
    await panel.navigationBarButton.click();

    const opened = kit.page.context().waitForEvent('page');
    await panel.previewButton.click();

    const preview = await opened;
    await preview.waitForLoadState('domcontentloaded');
    const html = await preview.content();
    await preview.close();

    expect(html).toContain('gsap');
    // Embedded: no separate asset file is referenced.
    expect(html).not.toMatch(/src="images\//);
  });

  test('H5-08 a newly added element reaches the preview', async ({ kit }) => {
    const panel = new Html5ExportPanel(kit.page);
    const marker = 'KIT_TEST_MARKER';
    await kit.page.evaluate(
      ([handle, text]) => {
        const engine = (handle as { engine: any }).engine;
        const block = engine.block.create('text');
        engine.block.replaceText(block, text as string);
        engine.block.appendChild(engine.scene.getPages()[0], block);
      },
      [kit.editor, marker] as const
    );

    await panel.navigationBarButton.click();
    const opened = kit.page.context().waitForEvent('page');
    await panel.previewButton.click();

    const preview = await opened;
    await preview.waitForLoadState('domcontentloaded');
    const html = await preview.content();
    await preview.close();

    expect(html).toContain(marker);
  });

  test('H5-09 Download ZIP produces a ZIP archive', async ({ kit }) => {
    const panel = new Html5ExportPanel(kit.page);
    await panel.navigationBarButton.click();

    const files = await download(kit.page, () => panel.zipButton.click());

    expect(files).toHaveLength(1);
    expect(files[0].name).toBe('html5-export.zip');
    expect(files[0].buffer.subarray(0, 2).toString()).toBe('PK');
    await expect(panel.zipButton).toBeEnabled();
  });
});

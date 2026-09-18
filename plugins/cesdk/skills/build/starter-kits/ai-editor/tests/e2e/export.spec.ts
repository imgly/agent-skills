import {
  actionsMenu,
  download,
  exportCalls,
  mp4Info,
  pdfPageCount,
  pngSize,
  spyExport,
  spyExportVideo,
  videoExportCalls
} from '@imgly/kit-test-harness';
import { expect, test } from './fixtures';
import { dismissExportDialog, switchMode } from './modes';

test.describe('Export', () => {
  test('AIE-15 Design mode exports a PNG and a PDF', async ({ kit }) => {
    await spyExport(kit.page);

    const pageCount = await kit.page.evaluate(
      (handle) => handle.engine.scene.getPages().length,
      kit.editor
    );

    const [png] = await download(kit.page, () =>
      kit.page.getByRole('button', { name: 'Export Images' }).click()
    );
    expect(pngSize(png.buffer).width).toBeGreaterThan(0);
    await dismissExportDialog(kit.page);

    await actionsMenu(kit.page).click();
    const [pdf] = await download(kit.page, () =>
      kit.page.getByRole('button', { name: 'Export PDF' }).click()
    );
    expect(await pdfPageCount(pdf.buffer)).toBe(pageCount);

    // The navigation-bar entries send no target size, so the kit's export is
    // the page's own size in both cases.
    const calls = await exportCalls(kit.page);
    expect(calls.map((call) => call.options?.mimeType)).toEqual([
      'image/png',
      'application/pdf'
    ]);
    calls.forEach((call) => {
      expect(call.options?.targetWidth).toBeUndefined();
      expect(call.options?.targetHeight).toBeUndefined();
    });
  });

  test('AIE-16 Photo mode exports the page at its own size', async ({
    kit
  }) => {
    const editor = await switchMode(kit.page, 'Photo');
    await spyExport(kit.page);

    const size = await kit.page.evaluate((handle) => {
      const [page] = handle.engine.scene.getPages();
      return {
        width: Math.round(handle.engine.block.getWidth(page)),
        height: Math.round(handle.engine.block.getHeight(page))
      };
    }, editor);

    const [png] = await download(kit.page, () =>
      kit.page.getByRole('button', { name: 'Export Images' }).click()
    );

    expect(pngSize(png.buffer)).toEqual(size);
    const [call] = await exportCalls(kit.page);
    expect(call.options).toMatchObject({ mimeType: 'image/png' });
    expect(call.options?.targetWidth).toBeUndefined();
    // Photo mode offers no second export entry.
    await expect(actionsMenu(kit.page)).toHaveCount(0);
    await editor.dispose();
  });

  test('AIE-17 Video mode exports an MP4', async ({ kit }) => {
    const editor = await switchMode(kit.page, 'Video');
    await spyExportVideo(kit.page, { intercept: true });

    const [video] = await download(kit.page, () =>
      kit.page.getByRole('button', { name: 'Export Video' }).click()
    );

    expect(video.name).toMatch(/\.mp4$/);
    expect(await videoExportCalls(kit.page)).toEqual([
      {
        block: expect.any(Number),
        options: expect.objectContaining({ mimeType: 'video/mp4' })
      }
    ]);
    // The encode was intercepted, so the bytes are the harness stub.
    expect(() => mp4Info(video.buffer)).toThrow();
    await editor.dispose();
  });
});

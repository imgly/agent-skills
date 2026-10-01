import {
  download,
  expect,
  mp4Info,
  spyExportVideo,
  test,
  videoExportCalls
} from '@imgly/kit-test-harness';
import type { Page } from '@playwright/test';
import { ExportPanel } from './export-panel';

async function lastExport(page: Page) {
  const calls = await videoExportCalls(page);
  return calls.at(-1)!.options;
}

test.describe('Export with the chosen options', () => {
  test('VEO-06 export with the defaults', async ({ kit }) => {
    const panel = new ExportPanel(kit.page);
    await spyExportVideo(kit.page, { intercept: true });

    await panel.exportButton.click();

    await expect
      .poll(async () => (await videoExportCalls(kit.page)).length)
      .toBe(1);
    const [call] = await videoExportCalls(kit.page);
    const currentPage = await kit.page.evaluate(
      (handle) => handle.engine.scene.getCurrentPage(),
      kit.editor
    );

    expect(call.block).toBe(currentPage);
    expect(call.options).toMatchObject({
      mimeType: 'video/mp4',
      videoBitrate: 'Auto',
      targetWidth: 1920,
      targetHeight: 1080,
      framerate: 30
    });
    await panel.closeExportDialog();
    await expect(panel.exportButton).toBeEnabled();
  });

  test('VEO-07 change the frame rate', async ({ kit }) => {
    const panel = new ExportPanel(kit.page);
    await spyExportVideo(kit.page, { intercept: true });

    await panel.setFps('24 FPS');
    await panel.exportButton.click();
    await expect
      .poll(async () => (await videoExportCalls(kit.page)).length)
      .toBe(1);
    expect(await lastExport(kit.page)).toMatchObject({
      framerate: 24,
      targetWidth: 1920,
      targetHeight: 1080
    });
    await panel.closeExportDialog();

    await panel.setFps('120 FPS');
    await panel.exportButton.click();
    await expect
      .poll(async () => (await videoExportCalls(kit.page)).length)
      .toBe(2);
    expect(await lastExport(kit.page)).toMatchObject({
      framerate: 120,
      targetWidth: 1920,
      targetHeight: 1080
    });
    await panel.closeExportDialog();
  });

  test('VEO-08 change the resolution', async ({ kit }) => {
    const panel = new ExportPanel(kit.page);
    await spyExportVideo(kit.page, { intercept: true });

    await panel.setResolution('High Definition (HD)');
    await panel.exportButton.click();
    await expect
      .poll(async () => (await videoExportCalls(kit.page)).length)
      .toBe(1);
    expect(await lastExport(kit.page)).toMatchObject({
      targetWidth: 1280,
      targetHeight: 720,
      framerate: 30
    });
    await panel.closeExportDialog();

    await panel.setResolution('Ultra HD (4K)');
    await panel.exportButton.click();
    await expect
      .poll(async () => (await videoExportCalls(kit.page)).length)
      .toBe(2);
    expect(await lastExport(kit.page)).toMatchObject({
      targetWidth: 3840,
      targetHeight: 2160
    });
    await panel.closeExportDialog();
  });

  test('VEO-09 a real export produces a playable MP4', async ({ kit }) => {
    test.setTimeout(300_000);
    const panel = new ExportPanel(kit.page);
    // Without an H.264 encoder the encode cannot run, so the case stops at the
    // options the kit hands over and the file is only decoded where one exists.
    const canEncode = kit.videoExportSupported;
    await spyExportVideo(kit.page, { intercept: !canEncode });

    // The shipped page is 9.7 s, which does not encode inside the test timeout.
    // Two seconds is enough to prove the requested size reaches the encoder.
    await kit.page.evaluate(
      (handle) =>
        handle.engine.block.setDuration(
          handle.engine.scene.getCurrentPage(),
          2
        ),
      kit.editor
    );

    await panel.setResolution('Custom');
    await panel.setNumber(panel.customHeight, 180);
    await expect(panel.customWidth).toHaveValue('320');
    await panel.setFps('24 FPS');

    if (!canEncode) {
      await panel.exportButton.click();
      await expect
        .poll(async () => (await videoExportCalls(kit.page)).length)
        .toBe(1);
      expect(await lastExport(kit.page)).toMatchObject({
        targetWidth: 320,
        targetHeight: 180,
        framerate: 24
      });
      return;
    }

    const [file] = await download(kit.page, () => panel.exportButton.click());

    expect(await lastExport(kit.page)).toMatchObject({
      targetWidth: 320,
      targetHeight: 180,
      framerate: 24
    });
    const info = mp4Info(file.buffer);
    expect(info.width).toBe(320);
    expect(info.height).toBe(180);
    expect(info.duration).toBeCloseTo(2, 0);
  });
});

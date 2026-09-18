import {
  editorPanel,
  expect,
  spyExportVideo,
  test,
  videoExportCalls
} from '@imgly/kit-test-harness';
import { CAPTION_PANEL, openMode } from './modes';

test.describe('Blank Video Editor', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('./');
  });

  test('VCA-08 the mode opens an empty 1280 x 720 scene', async ({ page }) => {
    const editor = await openMode(page, 'Blank Video Editor');

    const scene = await page.evaluate((handle) => {
      const [page_] = handle.engine.scene.getPages();
      return {
        width: handle.engine.block.getWidth(page_),
        height: handle.engine.block.getHeight(page_),
        captionTracks: handle.engine.block.findByType('captionTrack').length,
        graphics: handle.engine.block.findByType('graphic').length
      };
    }, editor);

    expect(scene).toEqual({
      width: 1280,
      height: 720,
      captionTracks: 0,
      graphics: 0
    });

    await expect(editorPanel(page, CAPTION_PANEL)).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Export Video' })
    ).toBeVisible();
    await editor.dispose();
  });

  test("VCA-09 export passes the kit's options", async ({ page }) => {
    const editor = await openMode(page, 'Blank Video Editor');
    await spyExportVideo(page, { intercept: true });

    await page.getByRole('button', { name: 'Export Video' }).click();

    await expect
      .poll(() => videoExportCalls(page).then((calls) => calls.length))
      .toBe(1);

    const [call] = await videoExportCalls(page);
    const currentPage = await page.evaluate(
      (handle) => handle.engine.scene.getCurrentPage(),
      editor
    );

    expect(call.block).toBe(currentPage);
    expect(call.options.mimeType).toBe('video/mp4');
    expect(call.options.videoBitrate).toBe('Auto');
    expect(call.options).not.toHaveProperty('targetWidth');
    expect(call.options).not.toHaveProperty('targetHeight');
    expect(call.options).not.toHaveProperty('framerate');
    await editor.dispose();
  });

  test('VCA-10 Close does not export', async ({ page }) => {
    const editor = await openMode(page, 'Blank Video Editor');
    await spyExportVideo(page, { intercept: true });
    await editor.dispose();

    await page.getByRole('button', { name: 'Close' }).first().click();

    await expect(page.getByRole('button', { name: 'Open Editor' })).toHaveCount(
      4
    );
    expect(await videoExportCalls(page)).toEqual([]);
  });
});

import {
  editorPanel,
  expect,
  spyExportVideo,
  test,
  videoExportCalls
} from '@imgly/kit-test-harness';
import { CAPTION_PANEL, openMode } from './modes';

test.describe('Caption Import', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('./');
  });

  test('VCA-11 the mode opens the sample video with no captions', async ({
    page
  }) => {
    const editor = await openMode(page, 'Caption Import');

    const scene = await page.evaluate(
      (handle) => ({
        playbackTime: handle.engine.block.getPlaybackTime(
          handle.engine.scene.getCurrentPage()
        ),
        captionTracks: handle.engine.block.findByType('captionTrack').length,
        graphics: handle.engine.block.findByType('graphic').length
      }),
      editor
    );

    expect(scene.playbackTime).toBe(0);
    expect(scene.captionTracks).toBe(0);
    expect(scene.graphics).toBeGreaterThan(0);

    await expect(editorPanel(page, CAPTION_PANEL)).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Import File' }).first()
    ).toBeVisible();
    await editor.dispose();
  });

  test("VCA-12 export passes the kit's options", async ({ page }) => {
    const editor = await openMode(page, 'Caption Import');
    await spyExportVideo(page, { intercept: true });

    await page.getByRole('button', { name: 'Export Video' }).click();

    await expect
      .poll(() => videoExportCalls(page).then((calls) => calls.length))
      .toBe(1);

    const [call] = await videoExportCalls(page);
    expect(call.options.mimeType).toBe('video/mp4');
    expect(call.options.videoBitrate).toBe('Auto');
    await editor.dispose();
  });

  test('VCA-13 Close does not export', async ({ page }) => {
    const editor = await openMode(page, 'Caption Import');
    await spyExportVideo(page, { intercept: true });
    await editor.dispose();

    await page.getByRole('button', { name: 'Close' }).first().click();

    await expect(page.getByRole('button', { name: 'Open Editor' })).toHaveCount(
      4
    );
    expect(await videoExportCalls(page)).toEqual([]);
  });
});

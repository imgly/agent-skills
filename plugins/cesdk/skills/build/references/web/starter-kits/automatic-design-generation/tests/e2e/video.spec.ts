import type { Page } from '@playwright/test';
import {
  CLIP_MP4_BASE64,
  expect,
  test,
  withVideoEncoder
} from '@imgly/kit-test-harness';

import {
  DEFAULT_MESSAGE_TEXT,
  editorRegion,
  expectDesign,
  nextButton,
  openAssetEditor,
  openKit,
  sizeCheckbox,
  waitForIdle
} from './kit';

// Encoding is the engine's, and Chrome on Linux has no encoder, so the browser
// reports one and every export returns a short clip. The kit's own video flow
// then runs everywhere. One size stays selected to keep the cases short.
async function openKitWithVideo(page: Page): Promise<void> {
  await withVideoEncoder(page);
  await openKit(page);
  await page.evaluate((clip) => {
    const bytes = Uint8Array.from(atob(clip), (c) => c.charCodeAt(0));
    (window as any).engine.block.exportVideo = async () =>
      new Blob([bytes], { type: 'video/mp4' });
  }, CLIP_MP4_BASE64);
}

test.describe('Video output', () => {
  test('ADG-07 switching to Video regenerates from the video templates', async ({
    page
  }) => {
    await openKitWithVideo(page);
    await nextButton(page).click();
    await waitForIdle(page);

    await sizeCheckbox(page, 'Instagram Post').uncheck();
    await sizeCheckbox(page, 'Facebook / X Post').uncheck();
    await waitForIdle(page);

    await page.getByRole('button', { name: 'Video', exact: true }).click();

    // The type control locks while the regeneration runs...
    await expect(
      page.getByRole('button', { name: 'Image', exact: true })
    ).toBeDisabled();
    await waitForIdle(page);

    await nextButton(page).click();
    const clip = page.locator('video').first();
    await expect(clip).toBeVisible();
    await expect(clip).toHaveJSProperty('paused', false);
  });

  test('ADG-10 a video asset opens in the video editor', async ({ page }) => {
    await openKitWithVideo(page);
    await nextButton(page).click();
    await waitForIdle(page);

    await sizeCheckbox(page, 'Instagram Post').uncheck();
    await sizeCheckbox(page, 'Facebook / X Post').uncheck();
    await waitForIdle(page);
    await page.getByRole('button', { name: 'Video', exact: true }).click();
    await waitForIdle(page);
    await expectDesign(page, { message: DEFAULT_MESSAGE_TEXT });

    await nextButton(page).click();
    const editor = await openAssetEditor(page, 'Instagram Story');

    expect(
      await page.evaluate(
        (handle) => handle.engine.block.getName(handle.engine.scene.get()),
        editor
      )
    ).toBe('Instagram Story');
    // The video config ships the timeline; the design config does not.
    await expect(
      editorRegion(page).getByRole('button', { name: 'Play' })
    ).toBeVisible();
    await editor.dispose();
  });
});

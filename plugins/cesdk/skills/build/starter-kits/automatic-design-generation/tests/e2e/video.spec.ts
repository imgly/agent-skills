import { expect, supportsVideoExport, test } from '@imgly/kit-test-harness';

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

// Video export is the slowest thing the kit does. These cases keep one size
// selected so they exercise the video path without generating three clips.
test.describe('Video output', () => {
  test.slow();

  test('ADG-07 switching to Video regenerates from the video templates', async ({
    page
  }) => {
    await openKit(page);
    test.skip(
      !(await supportsVideoExport(page)),
      'the kit disables video output on a browser without an H.264 encoder'
    );
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
    await openKit(page);
    test.skip(
      !(await supportsVideoExport(page)),
      'the kit disables video output on a browser without an H.264 encoder'
    );
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

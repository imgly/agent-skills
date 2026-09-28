import { editorPanel, expect, test } from '@imgly/kit-test-harness';
import { CAPTION_PANEL, openMode } from './modes';

test.describe('Pre-captioned Video', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('./');
  });

  test('VCA-14 the mode opens a video that already has captions, with the first one selected', async ({
    page
  }) => {
    const editor = await openMode(page, 'Pre-captioned Video');

    await expect
      .poll(() =>
        page.evaluate(
          (handle) => handle.engine.block.findByType('captionTrack').length,
          editor
        )
      )
      .toBe(1);

    const state = await page.evaluate((handle) => {
      const [track] = handle.engine.block.findByType('captionTrack');
      const children = handle.engine.block.getChildren(track);
      return {
        playbackTime: handle.engine.block.getPlaybackTime(
          handle.engine.scene.getCurrentPage()
        ),
        captions: children.length,
        selected: handle.engine.block.findAllSelected(),
        firstChild: children[0]
      };
    }, editor);

    expect(state.playbackTime).toBe(0);
    expect(state.captions).toBeGreaterThan(0);
    expect(state.selected).toEqual([state.firstChild]);
    await editor.dispose();
  });

  test('VCA-15 the panel opens in its edit view because captions exist', async ({
    page
  }) => {
    const editor = await openMode(page, 'Pre-captioned Video');

    const panel = editorPanel(page, CAPTION_PANEL);
    await expect(panel).toBeVisible();
    await expect(panel.getByRole('tab', { name: 'Content' })).toBeVisible();
    await expect(
      panel.getByRole('button', { name: 'Import File' })
    ).toHaveCount(0);
    await editor.dispose();
  });
});

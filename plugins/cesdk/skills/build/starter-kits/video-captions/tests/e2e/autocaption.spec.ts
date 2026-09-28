import { editorPanel, expect, test } from '@imgly/kit-test-harness';
import { mockFalProxy } from './fal-mock';
import { CAPTION_PANEL, openMode } from './modes';

test.describe('AI Auto Captions', () => {
  test.beforeEach(async ({ page }) => {
    await mockFalProxy(page);
    await page.goto('./');
  });

  test('VCA-04 the mode opens the sample video with no captions', async ({
    page
  }) => {
    const editor = await openMode(page, 'AI Auto Captions');

    const scene = await page.evaluate(
      (handle) => ({
        pages: handle.engine.scene.getPages().length,
        playbackTime: handle.engine.block.getPlaybackTime(
          handle.engine.scene.getCurrentPage()
        ),
        captionTracks: handle.engine.block.findByType('captionTrack').length,
        videos: handle.engine.block.findByType('graphic').length
      }),
      editor
    );

    expect(scene.pages).toBe(1);
    expect(scene.playbackTime).toBe(0);
    expect(scene.captionTracks).toBe(0);
    expect(scene.videos).toBeGreaterThan(0);

    await expect(editorPanel(page, CAPTION_PANEL)).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Add Captions' })
    ).toBeVisible();
    await editor.dispose();
  });

  test('VCA-05 Generate Automatically is offered at the top of the create view', async ({
    page
  }) => {
    const editor = await openMode(page, 'AI Auto Captions');

    const panel = editorPanel(page, CAPTION_PANEL);
    const actions = panel.getByRole('button');
    await expect(
      panel.getByRole('button', { name: 'Generate Automatically' })
    ).toBeVisible();

    const names = await actions.evaluateAll((nodes) =>
      nodes.map((node) => node.textContent?.trim() ?? '')
    );
    expect(names.filter((name) => name !== '')[0]).toBe(
      'Generate Automatically'
    );
    await editor.dispose();
  });

  test('VCA-06 generating captions with the mocked provider adds a caption track', async ({
    page
  }) => {
    const editor = await openMode(page, 'AI Auto Captions');
    // The plugin exports the clip's audio as AAC before uploading it. The
    // encoder is the engine's to test, and the mocked proxy drops the bytes.
    await page.evaluate((handle) => {
      handle.engine.block.exportAudio = async () =>
        new Blob(['audio'], { type: 'audio/mp4' });
    }, editor);

    await page.getByRole('button', { name: 'Generate Automatically' }).click();
    await page.getByRole('button', { name: 'Deselect All' }).click();
    await page.getByRole('checkbox', { name: 'Voiceover' }).click();
    // The timeline exposes each clip as a button labelled with its text, and
    // one clip reads "GENERATE CAPTIONS ...".
    await page
      .getByRole('button', { name: 'Generate Captions', exact: true })
      .click();

    await expect
      .poll(
        () =>
          page.evaluate((handle) => {
            const [track] = handle.engine.block.findByType('captionTrack');
            if (track == null) {
              return [];
            }
            return handle.engine.block
              .getChildren(track)
              .map((caption: number) =>
                handle.engine.block.getString(caption, 'caption/text')
              );
          }, editor),
        { timeout: 90_000 }
      )
      .toEqual(['generate captions']);

    await expect(page.getByRole('tab', { name: 'Content' })).toBeVisible();
    await editor.dispose();
  });
});

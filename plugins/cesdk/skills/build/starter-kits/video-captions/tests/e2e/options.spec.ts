import { editorPanel, expect, test } from '@imgly/kit-test-harness';
import { CAPTION_PANEL, MODES, openMode } from './modes';

test.describe('The demo option list', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('./');
  });

  test('VCA-01 four demo options are offered', async ({ page }) => {
    for (const mode of MODES) {
      await expect(page.getByRole('heading', { name: mode })).toBeVisible();
      await expect(
        page.getByRole('img', { name: `${mode} Preview` })
      ).toBeVisible();
    }

    await expect(page.getByRole('button', { name: 'Open Editor' })).toHaveCount(
      4
    );
    await expect(
      page.getByRole('button', { name: 'Download .srt File' })
    ).toHaveCount(1);
  });

  test('VCA-02 the sample SRT can be downloaded', async ({ page }) => {
    const downloaded = page
      .waitForEvent('download', { timeout: 10_000 })
      .catch(() => null);

    await page.getByRole('button', { name: 'Download .srt File' }).click();

    const download = await downloaded;
    expect(
      download,
      'The anchor is cross-origin, so `download` may be ignored. See known issue 1.'
    ).not.toBeNull();
    expect(download!.suggestedFilename()).toBe('captions.srt');
  });

  test('VCA-03 Close and overlay both return to the option list', async ({
    page
  }) => {
    const editor = await openMode(page, 'Blank Video Editor');
    await editor.dispose();

    await page.getByRole('button', { name: 'Close' }).first().click();
    await expect(page.getByRole('button', { name: 'Open Editor' })).toHaveCount(
      4
    );

    const reopened = await openMode(page, 'Blank Video Editor');
    await expect(editorPanel(page, CAPTION_PANEL)).toBeVisible();
    expect(
      await page.evaluate(
        (handle) => handle.engine.scene.getPages().length,
        reopened
      )
    ).toBe(1);
    await reopened.dispose();

    // The overlay fills the viewport behind the editor; a corner click lands
    // outside it, which is what `handleOverlayClick` checks for.
    await page.mouse.click(5, 5);
    await expect(page.getByRole('button', { name: 'Open Editor' })).toHaveCount(
      4
    );
  });
});

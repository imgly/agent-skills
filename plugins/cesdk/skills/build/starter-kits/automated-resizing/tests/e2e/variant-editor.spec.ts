import { expect, test } from '@imgly/kit-test-harness';

import { ResizingKit, firstText, setFirstText } from './kit';

test.describe('Variant editor', () => {
  test('AR-07 edit one variant', async ({ page }) => {
    const kit = new ResizingKit(page);
    await kit.open();
    await kit.generate();

    // The variant editor uses the design config, which is the light theme.
    const story = await kit.openVariantEditor(0);
    expect(
      await page.evaluate((handle) => handle.cesdk.ui.getTheme(), story)
    ).toBe('light');

    // It opens that variant's own scene: the Instagram Story page is 1080 x 1920.
    expect(
      await page.evaluate((handle) => {
        const [pageBlock] = handle.engine.scene.getPages();
        return [
          Math.round(handle.engine.block.getWidth(pageBlock)),
          Math.round(handle.engine.block.getHeight(pageBlock))
        ];
      }, story)
    ).toEqual([1080, 1920]);

    const original = await firstText(page, story);
    await setFirstText(page, story, 'EDITED STORY');
    await story.dispose();

    await kit.editorSaveButton.click();
    await kit.editorCloseButton.waitFor({ state: 'detached' });

    // Only the edited variant changed.
    const storyAgain = await kit.openVariantEditor(0);
    expect(await firstText(page, storyAgain)).toBe('EDITED STORY');
    await storyAgain.dispose();
    await kit.closeEditorWithoutSaving();

    const facebook = await kit.openVariantEditor(3);
    expect(await firstText(page, facebook)).toBe(original);

    // Discard an edit on that card: nothing changes.
    await setFirstText(page, facebook, 'DISCARDED');
    await facebook.dispose();
    await kit.closeEditorWithoutSaving();

    const facebookAgain = await kit.openVariantEditor(3);
    expect(await firstText(page, facebookAgain)).toBe(original);
    await facebookAgain.dispose();
  });
});

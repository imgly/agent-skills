import { download, expect, test } from '@imgly/kit-test-harness';

import {
  actionsDropdown,
  assetCard,
  DEFAULT_MESSAGE_TEXT,
  editorRegion,
  expectDesign,
  nextButton,
  openAssetEditor,
  openKit,
  sizeCheckbox,
  step,
  waitForEditorClosed,
  waitForIdle
} from './kit';

const LABELS = ['Instagram Story', 'Instagram Post', 'Facebook / X Post'];
const SIZES: Record<string, string> = {
  'Instagram Story': '1080 × 1920 px',
  'Instagram Post': '1080 × 1080 px',
  'Facebook / X Post': '1300 × 740 px'
};

/** Step 1 → 2 → 3 with the shipped defaults and one size, unless told otherwise. */
async function generate(
  page: Parameters<typeof openKit>[0],
  only?: string
): Promise<void> {
  await openKit(page);
  await nextButton(page).click();
  await expectDesign(page, { message: DEFAULT_MESSAGE_TEXT });

  if (only != null) {
    for (const label of LABELS.filter((entry) => entry !== only)) {
      await sizeCheckbox(page, label).uncheck();
    }
    await waitForIdle(page);
  }

  await nextButton(page).click();
  await expect(step(page, '3 Generate')).toBeEnabled();
}

test.describe('Generated assets', () => {
  test('ADG-08 every asset is labelled and downloadable', async ({ page }) => {
    await generate(page);

    for (const label of LABELS) {
      await expect(
        page.getByRole('img', { name: label, exact: true })
      ).toBeVisible();
      await expect(page.getByText(SIZES[label], { exact: true })).toBeVisible();
    }

    const files = await download(page, () =>
      page.getByRole('button', { name: 'Download' }).first().click()
    );
    expect(files).toHaveLength(1);
    expect(files[0].name).toBe('instagram-story.png');
    expect(files[0].buffer.length).toBeGreaterThan(0);
  });

  test('ADG-09 editing an asset opens the design editor on its own scene', async ({
    page
  }) => {
    await generate(page, 'Instagram Post');

    const editor = await openAssetEditor(page, 'Instagram Post');
    const scene = await page.evaluate(
      (handle) => ({
        name: handle.engine.block.getName(handle.engine.scene.get()),
        theme: handle.cesdk.ui.getTheme(),
        pageTitleShown: handle.engine.editor.getSettingBool('page/title/show')
      }),
      editor
    );

    expect(scene.name).toBe('Instagram Post');
    expect(scene.theme).toBe('light');
    expect(scene.pageTitleShown).toBe(false);
    await expect(
      editorRegion(page).getByRole('button', { name: 'Close' })
    ).toBeVisible();
    await editor.dispose();
  });

  test('ADG-09 the edited asset keeps its message', async ({ page }) => {
    // The kit puts the message into the asset, so an editor opened on that
    // asset still shows it: a scene string carries no variable values, so
    // the modal re-applies the ones the asset was rendered with.
    await generate(page, 'Instagram Post');
    const editor = await openAssetEditor(page, 'Instagram Post');

    // The text block holds the `{{Name}}` references; what decides whether
    // the canvas shows the message or the raw placeholder is the variable.
    const state = await page.evaluate((handle) => {
      const [block] = handle.engine.block.findByName('Message & Name');
      return {
        text: handle.engine.block.getString(block, 'text/text'),
        message: handle.engine.variable.getString('Message')
      };
    }, editor);

    expect(state.text).toContain('{{Message}}');
    expect(state.message).toBe(DEFAULT_MESSAGE_TEXT);
    await editor.dispose();
  });

  test('ADG-09 saving in the editor updates only that card', async ({
    page
  }) => {
    await generate(page);
    const others = ['Instagram Story', 'Facebook / X Post'];
    const before = await Promise.all(
      others.map((label) =>
        assetCard(page, label).getByRole('img').getAttribute('src')
      )
    );
    const edited = await assetCard(page, 'Instagram Post')
      .getByRole('img')
      .getAttribute('src');

    const editor = await openAssetEditor(page, 'Instagram Post');
    await page.evaluate((handle) => {
      const [block] = handle.engine.block.findByName('Message & Name');
      handle.engine.block.setString(
        block,
        'text/text',
        'Saved from the editor'
      );
    }, editor);
    await editor.dispose();

    await editorRegion(page).getByRole('button', { name: 'Save' }).click();
    await waitForEditorClosed(page);

    await expect(
      assetCard(page, 'Instagram Post').getByRole('img')
    ).not.toHaveAttribute('src', edited as string);
    for (const [index, label] of others.entries()) {
      await expect(assetCard(page, label).getByRole('img')).toHaveAttribute(
        'src',
        before[index] as string
      );
    }
  });

  test('ADG-09 closing the editor without saving changes nothing', async ({
    page
  }) => {
    await generate(page, 'Instagram Post');
    const before = await assetCard(page, 'Instagram Post')
      .getByRole('img')
      .getAttribute('src');

    const editor = await openAssetEditor(page, 'Instagram Post');
    await page.evaluate((handle) => {
      const [block] = handle.engine.block.findByName('Message & Name');
      handle.engine.block.setString(block, 'text/text', 'Edited but discarded');
    }, editor);
    await editor.dispose();
    await editorRegion(page).getByRole('button', { name: 'Close' }).click();
    await waitForEditorClosed(page);

    await expect(
      assetCard(page, 'Instagram Post').getByRole('img')
    ).toHaveAttribute('src', before as string);
  });

  test('ADG-09 the editor offers image export in the Actions dropdown', async ({
    page
  }) => {
    await generate(page, 'Instagram Post');
    const editor = await openAssetEditor(page, 'Instagram Post');
    await editor.dispose();

    await actionsDropdown(page).click();
    await expect(
      page.getByRole('button', { name: 'Export Images' })
    ).toBeVisible();
  });
});

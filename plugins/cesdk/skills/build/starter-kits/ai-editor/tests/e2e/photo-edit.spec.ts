import { EDITED_URL, expect, test } from './fixtures';
import {
  applyChanges,
  expandCapability,
  switchMode,
  toggleProvider
} from './modes';

const PANEL_ID = '@imgly/plugin-ai-photo-edit';

test.describe('Photo mode in-place AI edit', () => {
  test('AIE-12 the AI Edit panel opens with prompt, style and Generate only', async ({
    kit
  }) => {
    const editor = await switchMode(kit.page, 'Photo');
    await kit.page.getByRole('button', { name: 'AI Edit' }).click();

    await expect(
      kit.page.getByPlaceholder('Describe how to transform the photo…')
    ).toHaveValue('');
    await expect(
      kit.page.getByRole('button', { name: 'None', exact: true })
    ).toBeVisible();

    // The current page image is supplied automatically, so nothing has to be
    // picked before generating.
    const generate = kit.page.getByRole('button', { name: 'Generate' });
    await expect(generate).toBeEnabled();

    // The kit strips every output-shape control so the result keeps the
    // photo's aspect, and turns the history grid off.
    for (const control of ['Format', 'Aspect Ratio', 'Size', 'Width']) {
      await expect(
        kit.page.getByRole('button', { name: control }),
        `the panel offers no ${control} control`
      ).toHaveCount(0);
    }

    expect(
      await kit.page.evaluate(
        ({ handle, panelId }) => handle.cesdk.ui.isPanelOpen(panelId),
        { handle: editor, panelId: PANEL_ID }
      )
    ).toBe(true);
    await editor.dispose();
  });

  test('AIE-13 a photo edit replaces the image in place', async ({
    kit,
    gateway
  }) => {
    const editor = await switchMode(kit.page, 'Photo');
    await kit.page.getByRole('button', { name: 'AI Edit' }).click();

    const before = await kit.page.evaluate((handle) => {
      const [page] = handle.engine.scene.getPages();
      return {
        blocks: handle.engine.block.getChildren(page).length,
        width: handle.engine.block.getWidth(page),
        height: handle.engine.block.getHeight(page)
      };
    }, editor);

    await kit.page
      .getByPlaceholder('Describe how to transform the photo…')
      .fill('make it a watercolour');
    await kit.page.getByRole('button', { name: 'Generate' }).click();

    await kit.page.waitForFunction(
      (url) => {
        const handle = (window as any).cesdk;
        const [page] = handle.engine.scene.getPages();
        const fill = handle.engine.block.getFill(page);
        const sourceSet = handle.engine.block.getSourceSet(
          fill,
          'fill/image/sourceSet'
        );
        return sourceSet[0]?.uri === url;
      },
      EDITED_URL,
      { timeout: 60_000 }
    );

    const after = await kit.page.evaluate((handle) => {
      const [page] = handle.engine.scene.getPages();
      return {
        blocks: handle.engine.block.getChildren(page).length,
        width: handle.engine.block.getWidth(page),
        height: handle.engine.block.getHeight(page),
        canUndo: handle.engine.editor.canUndo()
      };
    }, editor);

    expect(after.blocks).toBe(before.blocks);
    expect(after.width).toBe(before.width);
    expect(after.height).toBe(before.height);
    expect(after.canUndo).toBe(true);

    // The typed prompt reaches the gateway together with the page image.
    expect(gateway.generateBodies).toHaveLength(1);
    expect(gateway.generateBodies[0]).toMatchObject({
      model: 'bfl/flux-2-edit',
      prompt: expect.stringContaining('make it a watercolour')
    });
    await expect(
      kit.page.getByPlaceholder('Describe how to transform the photo…')
    ).toHaveValue('make it a watercolour');
    await editor.dispose();
  });

  test('AIE-14 a second active model adds the provider select', async ({
    kit,
    gateway
  }) => {
    const photo = await switchMode(kit.page, 'Photo');
    await photo.dispose();

    await expandCapability(kit.page, 'Image to Image');
    await toggleProvider(kit.page, 'Second Edit');
    const editor = await applyChanges(kit.page);

    await kit.page.getByRole('button', { name: 'AI Edit' }).click();

    // The builder's Select carries its value as its accessible name. The kit
    // enables this control itself, because it bypasses the plugin that would.
    const select = kit.page.getByRole('button', { name: 'bfl/flux-2-edit' });
    await expect(select).toBeVisible();

    await select.click();
    await kit.page.getByText('test/second-edit', { exact: true }).click();
    await kit.page.getByRole('button', { name: 'Generate' }).click();

    await expect
      .poll(() => gateway.generateBodies.at(-1)?.model, { timeout: 60_000 })
      .toBe('test/second-edit');
    await editor.dispose();
  });
});

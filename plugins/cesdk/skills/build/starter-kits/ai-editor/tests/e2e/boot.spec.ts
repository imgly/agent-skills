import { expect, test } from './fixtures';
import {
  applyChanges,
  assetSourceIds,
  expandCapability,
  providerCheckbox,
  switchMode,
  toggleProvider
} from './modes';

test.describe('Boot and modes', () => {
  test('AIE-01 Design mode is the default and its scene loads', async ({
    kit,
    gateway
  }) => {
    const pages = await kit.page.evaluate(
      (handle) => handle.engine.scene.getPages().length,
      kit.editor
    );
    expect(pages).toBeGreaterThan(0);

    await expect(kit.page.getByRole('button', { name: 'AI' })).toBeVisible();
    await expect(kit.page.getByText('AI Models')).toBeVisible();
    expect(
      await kit.page.evaluate(
        (handle) => handle.cesdk.ui.getTheme(),
        kit.editor
      )
    ).toBe('light');

    // One preflight, authenticated, and no second catalogue fetch.
    expect(gateway.modelsRequests).toEqual([expect.stringMatching(/^Bearer /)]);
  });

  test('AIE-02 Video mode loads the video scene', async ({ kit, gateway }) => {
    const editor = await switchMode(kit.page, 'Video');

    expect(
      await kit.page.evaluate((handle) => handle.engine.scene.getMode(), editor)
    ).toBe('Video');
    await expect(
      kit.page.getByRole('button', { name: 'Videos' })
    ).toBeVisible();
    // The timeline exposes each audio clip as a button labelled "Audio, <time>".
    await expect(
      kit.page.getByRole('button', { name: 'Audio', exact: true })
    ).toBeVisible();
    await expect(
      kit.page.getByRole('button', { name: 'Export Video' })
    ).toBeVisible();

    // The preflight is not repeated for the new mode.
    expect(gateway.modelsRequests).toHaveLength(1);
    await editor.dispose();
  });

  test('AIE-03 Photo mode creates a scene from the default photo', async ({
    kit
  }) => {
    const editor = await switchMode(kit.page, 'Photo');

    const photo = await kit.page.evaluate((handle) => {
      const [page] = handle.engine.scene.getPages();
      const fill = handle.engine.block.getFill(page);
      return {
        pages: handle.engine.scene.getPages().length,
        uri: handle.engine.block.getString(fill, 'fill/image/imageFileURI'),
        theme: handle.cesdk.ui.getTheme()
      };
    }, editor);

    expect(photo.pages).toBe(1);
    expect(photo.uri).toContain('images.unsplash.com');
    expect(photo.theme).toBe('dark');
    await expect(
      kit.page.getByRole('button', { name: 'AI Edit' })
    ).toBeVisible();
    await expect(
      kit.page.getByRole('button', { name: 'Export Images' })
    ).toBeVisible();
    await editor.dispose();
  });

  test('AIE-04 the loaded scenes carry selectable blocks', async ({ kit }) => {
    const selectable = async (handle: typeof kit.editor) =>
      kit.page.evaluate((editor) => {
        const [page] = editor.engine.scene.getPages();
        const children = editor.engine.block.getChildren(page);
        if (children.length === 0) return null;
        editor.engine.block.setSelected(children[0], true);
        return editor.engine.block.findAllSelected().length;
      }, handle);

    expect(await selectable(kit.editor)).toBe(1);

    const video = await switchMode(kit.page, 'Video');
    expect(await selectable(video)).toBe(1);
    await video.dispose();
  });

  test('AIE-05 the mode is carried in the URL', async ({ kit }) => {
    const video = await switchMode(kit.page, 'Video');
    await video.dispose();
    expect(new URL(kit.page.url()).searchParams.get('mode')).toBe('Video');

    await kit.page.reload();
    await kit.page.waitForFunction(
      () => (window as unknown as { cesdk?: unknown }).cesdk != null
    );
    await expect(
      kit.page.getByRole('button', { name: 'Export Video' })
    ).toBeVisible();

    await kit.page.goto('./?mode=Nonsense');
    await kit.page.waitForFunction(
      () => (window as unknown as { cesdk?: unknown }).cesdk != null
    );
    await expect(
      kit.page.getByRole('button', { name: 'Export Images' })
    ).toBeVisible();
  });

  test('AIE-06 a mode switch keeps the applied model selection', async ({
    kit
  }) => {
    const sourcesBefore = await assetSourceIds(kit.page, kit.editor);
    expect(sourcesBefore).toContain('ly.img.ai.image-generation.history');

    await expandCapability(kit.page, 'Image to Image');
    await toggleProvider(kit.page, 'Flux 2 Edit');
    const applied = await applyChanges(kit.page);
    await applied.dispose();

    const video = await switchMode(kit.page, 'Video');
    const back = await switchMode(kit.page, 'Design');

    await expandCapability(kit.page, 'Image to Image');
    await expect(providerCheckbox(kit.page, 'Flux 2 Edit')).not.toBeChecked();
    expect(await assetSourceIds(kit.page, back)).toContain(
      'ly.img.ai.image-generation.history'
    );

    await video.dispose();
    await back.dispose();
  });
});

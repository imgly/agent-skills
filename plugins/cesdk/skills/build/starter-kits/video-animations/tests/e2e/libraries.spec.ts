import { editorPanel, expect, test } from '@imgly/kit-test-harness';

const ASSET_PANEL = '//ly.img.panel/assetLibrary';

test.describe('Libraries', () => {
  test('VAN-04 the Example Templates dock entry lists both scenes', async ({
    kit
  }) => {
    await kit.page.getByRole('button', { name: 'Example Templates' }).click();

    const panel = editorPanel(kit.page, ASSET_PANEL);
    await expect(
      panel.getByRole('heading', { name: 'Example Templates' })
    ).toBeVisible();
    await expect(
      panel.getByRole('button', { name: 'Lunar Cosmetics · Landscape Example' })
    ).toBeVisible();
    await expect(
      panel.getByRole('button', { name: 'Surf School · Portrait Example' })
    ).toBeVisible();
  });

  test('VAN-05 applying an example template loads it, fits it and records it in the URL', async ({
    kit
  }) => {
    const landscape = await kit.page.evaluate((handle) => {
      const [page] = handle.engine.scene.getPages();
      return (
        handle.engine.block.getWidth(page) > handle.engine.block.getHeight(page)
      );
    }, kit.editor);
    expect(landscape).toBe(true);

    await kit.page.getByRole('button', { name: 'Example Templates' }).click();
    await kit.page
      .getByRole('button', { name: 'Surf School · Portrait Example' })
      .click();

    await expect
      .poll(() =>
        kit.page.evaluate((handle) => {
          const [page] = handle.engine.scene.getPages();
          if (page == null) {
            return null;
          }
          return (
            handle.engine.block.getWidth(page) <
            handle.engine.block.getHeight(page)
          );
        }, kit.editor)
      )
      .toBe(true);

    await expect
      .poll(() => new URL(kit.page.url()).searchParams.get('template'))
      .toBe('surf-school');
  });

  test('VAN-06 the custom audio source replaces the demo audio', async ({
    kit
  }) => {
    await kit.page
      .getByRole('button', { name: 'Soundstripe', exact: true })
      .click();
    await expect(
      editorPanel(kit.page, ASSET_PANEL).getByRole('heading', {
        name: 'Soundstripe'
      })
    ).toBeVisible();

    const tracks = await kit.page.evaluate(async (handle) => {
      const result = await handle.engine.asset.findAssets('ly.img.audio', {
        page: 0,
        perPage: 50
      });
      return result.assets.map(
        (asset: { label: string; meta: { uri: string } }) => ({
          label: asset.label,
          uri: asset.meta.uri
        })
      );
    }, kit.editor);

    expect(tracks).toHaveLength(7);
    expect(tracks[0].label).toBe('Cody Martin Lemon Drop Instrumental');
    tracks.forEach((track: { uri: string }) => {
      expect(track.uri).toMatch(
        /starterkit-video-animations\/assets\/audio\/.+\.mp3$/
      );
    });
  });
});

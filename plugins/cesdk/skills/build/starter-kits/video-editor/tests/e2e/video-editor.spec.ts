import {
  expect,
  spyExportVideo,
  test,
  videoExportCalls
} from '@imgly/kit-test-harness';

const DOCK_LIBRARY_ENTRIES = [
  'Templates',
  'Elements',
  'Uploads',
  'Images',
  'Videos',
  'Audio',
  'Text',
  'Shapes',
  'Stickers'
];

test.describe('Start-up', () => {
  test('VED-01 the editor loads in video mode with the demo template', async ({
    kit
  }) => {
    const scene = await kit.page.evaluate(
      (handle) => ({
        mode: handle.engine.scene.getMode(),
        pages: handle.engine.scene.getPages().length
      }),
      kit.editor
    );

    expect(scene).toEqual({ mode: 'Video', pages: 1 });
    await expect(
      kit.page.getByRole('region', { name: 'Video Timeline' })
    ).toBeVisible();
  });

  test('VED-02 the debug hook is the editor instance', async ({ kit }) => {
    const hook = await kit.page.evaluate(
      (handle) => ({
        kind: handle.kind,
        hasEngine: typeof handle.engine.block.getType === 'function',
        hasUi: typeof handle.cesdk.ui.isPanelOpen === 'function'
      }),
      kit.editor
    );

    expect(hook).toEqual({ kind: 'cesdk', hasEngine: true, hasUi: true });
  });
});

test.describe('Libraries the kit asks for', () => {
  test('VED-03 every dock library entry opens the asset library panel', async ({
    kit
  }) => {
    for (const entry of DOCK_LIBRARY_ENTRIES) {
      await kit.page.getByRole('button', { name: entry, exact: true }).click();
      await expect
        .poll(() =>
          kit.page.evaluate(
            (handle) =>
              handle.cesdk.ui.isPanelOpen('//ly.img.panel/assetLibrary'),
            kit.editor
          )
        )
        .toBe(true);
    }
  });

  test('VED-04 the asset sources the kit includes are registered', async ({
    kit
  }) => {
    const sources = await kit.page.evaluate(
      (handle) => handle.engine.asset.findAllSources() as string[],
      kit.editor
    );

    expect(sources).toEqual(
      expect.arrayContaining([
        'ly.img.audio',
        'ly.img.audio.upload',
        'ly.img.blur',
        'ly.img.caption.presets',
        'ly.img.color.palette',
        'ly.img.colors.imageColors',
        'ly.img.crop.presets',
        'ly.img.effect',
        'ly.img.filter',
        'ly.img.image',
        'ly.img.image.upload',
        'ly.img.page.presets',
        'ly.img.sticker',
        'ly.img.templates',
        'ly.img.templates.premium',
        'ly.img.text',
        'ly.img.text.components',
        'ly.img.typeface',
        'ly.img.vector.shape',
        'ly.img.video',
        'ly.img.video.upload'
      ])
    );
  });
});

test.describe('Export', () => {
  test('VED-05 Export Video is the last entry of the navigation bar', async ({
    kit
  }) => {
    const order = await kit.page.evaluate(
      (handle) =>
        (
          handle.cesdk.ui.getComponentOrder({
            in: 'ly.img.navigation.bar'
          }) as { id: string }[]
        ).map((entry) => entry.id),
      kit.editor
    );

    expect(order.at(-1)).toBe('ly.img.exportVideo.navigationBar');
    await expect(
      kit.page.getByRole('button', { name: 'Export Video', exact: true })
    ).toBeEnabled();
  });

  test('VED-06 export passes the kit’s options and nothing else', async ({
    kit
  }) => {
    await spyExportVideo(kit.page, { intercept: true });

    await kit.page
      .getByRole('button', { name: 'Export Video', exact: true })
      .click();

    await expect
      .poll(async () => (await videoExportCalls(kit.page)).length)
      .toBe(1);

    const [call] = await videoExportCalls(kit.page);
    const currentPage = await kit.page.evaluate(
      (handle) => handle.engine.scene.getCurrentPage(),
      kit.editor
    );

    expect(call.block).toBe(currentPage);
    expect(call.options.mimeType).toBe('video/mp4');
    expect(call.options.videoBitrate).toBe('Auto');
    expect(Object.keys(call.options)).not.toContain('targetWidth');
    expect(Object.keys(call.options)).not.toContain('targetHeight');
    expect(Object.keys(call.options)).not.toContain('framerate');
  });
});

test.describe('Background removal', () => {
  test('VED-07 the plugin puts its entry in the canvas menu', async ({
    kit
  }) => {
    const canvasMenu = await kit.page.evaluate(
      (handle) =>
        (
          handle.cesdk.ui.getComponentOrder({ in: 'ly.img.canvas.menu' }) as {
            id: string;
          }[]
        ).map((entry) => entry.id),
      kit.editor
    );

    expect(canvasMenu).toContain(
      '@imgly/plugin-background-removal-web.canvasMenu'
    );
  });
});

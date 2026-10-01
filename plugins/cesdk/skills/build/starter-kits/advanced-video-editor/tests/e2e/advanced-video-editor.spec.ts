import {
  download,
  expect,
  spyExportVideo,
  test,
  videoExportCalls
} from '@imgly/kit-test-harness';
import { ActionsMenu } from './actions';

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
  test('AVE-01 the editor loads in video mode with the demo template', async ({
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

  test('AVE-02 the debug hook is the editor instance', async ({ kit }) => {
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
  test('AVE-03 the asset sources the kit includes are registered', async ({
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

  test('AVE-04 every dock library entry opens the asset library panel', async ({
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
});

test.describe('The actions entry', () => {
  test('AVE-05 Save is its own button and the dropdown holds the other four actions', async ({
    kit
  }) => {
    const menu = new ActionsMenu(kit.page);

    await expect(menu.saveButton).toBeEnabled();
    await menu.open();
    expect(await menu.items.allInnerTexts()).toEqual([
      'Export Video',
      'Export Design',
      'Export Archive',
      'Import'
    ]);
  });

  test('AVE-06 Export Video passes the kit’s options and nothing else', async ({
    kit
  }) => {
    await spyExportVideo(kit.page, { intercept: true });

    await new ActionsMenu(kit.page).click('Export Video');

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

  test('AVE-07 Save and Export Design download the same scene text', async ({
    kit
  }) => {
    const menu = new ActionsMenu(kit.page);

    const saved = kit.page.waitForEvent('download', { timeout: 15_000 });
    await menu.saveButton.click();
    const savedFile = await (await saved).createReadStream();

    const exported = kit.page.waitForEvent('download', { timeout: 15_000 });
    await menu.click('Export Design');
    const exportedFile = await (await exported).createReadStream();

    for (const stream of [savedFile, exportedFile]) {
      const chunks: Buffer[] = [];
      for await (const chunk of stream) {
        chunks.push(chunk as Buffer);
      }
      expect(Buffer.concat(chunks).subarray(0, 4).toString('latin1')).toMatch(
        /^UBQ\d$/
      );
    }
  });

  test('AVE-08 Export Archive downloads a zip', async ({ kit }) => {
    const [archive] = await download(kit.page, () =>
      new ActionsMenu(kit.page).click('Export Archive')
    );

    expect(archive.name).toMatch(/\.imgly$/);
    expect(archive.buffer.subarray(0, 2).toString('latin1')).toBe('PK');
  });
});

test.describe('Background removal', () => {
  test('AVE-09 the plugin puts its entry in the canvas menu', async ({
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

import {
  download,
  exportCalls,
  expect,
  pngSize,
  spyExport,
  test
} from '@imgly/kit-test-harness';
import { readPage, SelectionScreen } from './selection';

test.describe('Opening the editor', () => {
  test('FCE-03 the image fills the page in the chosen ratio', async ({
    page
  }) => {
    await page.goto('./');
    const screen = new SelectionScreen(page);
    const editor = await screen.openEditor();

    const shape = await readPage(page, editor);
    expect(shape.width / shape.height).toBeCloseTo(4 / 5, 3);
    expect(shape.image).toBe('image-1.png');
    expect(shape.editMode).toBe('Crop');

    const scene = await page.evaluate(
      (handle) => ({
        pages: handle.engine.scene.getPages().length,
        contentFillMode: handle.engine.block.getContentFillMode(
          handle.engine.scene.getCurrentPage()
        ),
        clipped: handle.engine.block.isClipped(
          handle.engine.scene.getCurrentPage()
        )
      }),
      editor
    );
    expect(scene).toEqual({
      pages: 1,
      contentFillMode: 'Cover',
      clipped: true
    });

    await expect(
      page.getByRole('complementary', { name: 'Crop', exact: true })
    ).toBeVisible();
    await editor.dispose();
  });

  test('FCE-04 only Always and If Needed open Crop mode', async ({ page }) => {
    await page.goto('./');
    const screen = new SelectionScreen(page);

    await screen.option('Mountain landscape').click();
    let editor = await screen.openEditor();
    expect((await readPage(page, editor)).editMode).toBe('Crop');
    await editor.dispose();
    await screen.closeEditor();

    await screen.mode('Silent').click();
    editor = await screen.openEditor();
    expect((await readPage(page, editor)).editMode).toBe('Transform');
    await editor.dispose();
    await screen.closeEditor();

    // A 1200 x 1200 image already matches the 1:1 preset, so If Needed has
    // nothing to ask the user for.
    await screen.mode('If Needed').click();
    await screen.option('LinkedIn Logo').click();
    await screen.option('Healthy salad bowl').click();
    editor = await screen.openEditor();
    expect((await readPage(page, editor)).editMode).toBe('Transform');
    await editor.dispose();
  });

  test('FCE-05 every preset works for every image', async ({ page }) => {
    test.setTimeout(300_000);
    await page.goto('./');
    const screen = new SelectionScreen(page);
    await screen.mode('Silent').click();

    const presets = [
      ['Instagram Logo', 4 / 5],
      ['LinkedIn Logo', 1],
      ['Facebook Logo', 1.91]
    ] as const;
    const images = [
      ['Photographer with camera', 'image-1.png'],
      ['Mountain landscape', 'image-2.png'],
      ['Healthy salad bowl', 'image-3.png']
    ] as const;

    let first = true;
    for (const [presetAlt, ratio] of presets) {
      for (const [imageAlt, file] of images) {
        if (!first) await screen.closeEditor();
        first = false;
        await screen.option(presetAlt).click();
        await screen.option(imageAlt).click();

        const editor = await screen.openEditor();
        // The editor is ready before `applyForceCrop` has resized the page,
        // so the first read can still be the image's own ratio.
        await expect
          .poll(
            async () => {
              const { width, height } = await readPage(page, editor);
              return width / height;
            },
            { message: `${presetAlt} on ${imageAlt}` }
          )
          .toBeCloseTo(ratio, 2);
        expect((await readPage(page, editor)).image).toBe(file);
        await editor.dispose();
      }
    }
  });

  test('FCE-06 only the chosen preset is offered in the Crop panel', async ({
    page
  }) => {
    await page.goto('./');
    const screen = new SelectionScreen(page);
    await screen.option('LinkedIn Logo').click();
    const editor = await screen.openEditor();

    const assets = await page.evaluate(async (handle) => {
      const result = await handle.engine.asset.findAssets(
        'ly.img.page.presets',
        {
          page: 0,
          perPage: 20
        }
      );
      return result.assets.map((asset: { id: string }) => asset.id);
    }, editor);
    expect(assets).toEqual(['custom-profile-photo']);

    const cropPanel = page.getByRole('complementary', {
      name: 'Crop',
      exact: true
    });
    await expect(
      cropPanel.getByRole('button', { name: 'Profile Photo (1:1)' })
    ).toBeVisible();
    await editor.dispose();
  });
});

test.describe('Editing', () => {
  test('FCE-07 the dock offers only Crop, Adjust, Filter and Shapes', async ({
    page
  }) => {
    await page.goto('./');
    const screen = new SelectionScreen(page);
    const editor = await screen.openEditor();

    const dock = await page.evaluate(
      (handle) =>
        handle.cesdk.ui
          .getComponentOrder({ in: 'ly.img.dock' })
          .map((entry: { id: string; key?: string }) => entry.key ?? entry.id),
      editor
    );
    expect(dock).toEqual([
      'ly.img.spacer',
      'ly.img.crop',
      'ly.img.adjustment',
      'ly.img.filter',
      'ly.img.vector.shape',
      'ly.img.spacer'
    ]);

    await page.evaluate(
      (handle) =>
        handle.engine.block.select(handle.engine.scene.getCurrentPage()),
      editor
    );
    await expect(
      page.getByRole('region', { name: 'Inspector Bar' })
    ).toHaveCount(0);
    await editor.dispose();
  });

  test('FCE-08 Crop, Adjust and Filter from the dock', async ({ page }) => {
    await page.goto('./');
    const screen = new SelectionScreen(page);
    await screen.mode('Silent').click();
    const editor = await screen.openEditor();

    const editMode = () =>
      page.evaluate((handle) => handle.engine.editor.getEditMode(), editor);
    const isOpen = (id: string) =>
      page.evaluate(
        ([handle, panel]: [unknown, string]) =>
          (
            handle as { cesdk: { ui: { isPanelOpen(id: string): boolean } } }
          ).cesdk.ui.isPanelOpen(panel),
        [editor, id] as const
      );

    await page.getByRole('button', { name: 'Crop', exact: true }).click();
    await expect.poll(editMode).toBe('Crop');
    await page.getByRole('button', { name: 'Crop', exact: true }).click();
    await expect.poll(editMode).toBe('Transform');

    for (const [label, panel] of [
      ['Adjust', '//ly.img.panel/inspector/adjustments'],
      ['Filter', '//ly.img.panel/inspector/filters']
    ] as const) {
      await page.getByRole('button', { name: label, exact: true }).click();
      await expect.poll(() => isOpen(panel)).toBe(true);
      await expect.poll(editMode).toBe('Transform');
      await page.getByRole('button', { name: label, exact: true }).click();
      await expect.poll(() => isOpen(panel)).toBe(false);
    }
    await editor.dispose();
  });

  test('FCE-09 the image cannot be replaced', async ({ page }) => {
    await page.goto('./');
    const screen = new SelectionScreen(page);
    await screen.mode('Silent').click();
    const editor = await screen.openEditor();

    const scopes = await page.evaluate((handle) => {
      const engine = handle.engine;
      const block = engine.scene.getCurrentPage();
      engine.block.select(block);
      return ['fill/change', 'fill/changeType', 'stroke/change'].map((scope) =>
        engine.block.isScopeEnabled(block, scope)
      );
    }, editor);
    expect(scopes).toEqual([false, false, false]);

    await expect(page.getByRole('button', { name: /replace/i })).toHaveCount(0);
    await editor.dispose();
  });
});

test.describe('Export', () => {
  test('FCE-10 export image', async ({ page }) => {
    await page.goto('./');
    const screen = new SelectionScreen(page);
    await screen.mode('Silent').click();
    const editor = await screen.openEditor();
    await spyExport(page);

    const files = await download(
      page,
      () =>
        page
          .getByRole('button', { name: 'Export Images', exact: true })
          .click(),
      1
    );

    expect(files[0].name).toMatch(/\.png$/);
    const size = pngSize(files[0].buffer);
    expect(size.width / size.height).toBeCloseTo(4 / 5, 2);

    const calls = await exportCalls(page);
    expect(calls).toHaveLength(1);
    expect(calls[0].options).toMatchObject({ mimeType: 'image/png' });
    await editor.dispose();
  });
});

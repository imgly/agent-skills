import {
  download,
  exportCalls,
  expect,
  pngSize,
  spyExport,
  test
} from '@imgly/kit-test-harness';
import type { Page } from '@playwright/test';
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

test.describe('Loading the editor', () => {
  interface VisibleFrame {
    ratio: number;
    editMode: string;
    cropPanelOpen: boolean;
  }

  /**
   * Record, on every animation frame, what the canvas shows once it is visible
   * to the user. Installed before Open Editor is clicked, so no frame is missed.
   */
  async function recordVisibleFrames(page: Page): Promise<void> {
    await page.evaluate(() => {
      const frames: unknown[] = [];
      (window as any).__visibleFrames = frames;
      const sample = () => {
        const cesdk = (window as any).cesdk;
        const canvas = cesdk?.engine?.element as HTMLElement | undefined;
        const pageBlock = cesdk?.engine?.scene?.getCurrentPage?.();
        if (
          canvas?.isConnected &&
          pageBlock != null &&
          canvas.checkVisibility({
            opacityProperty: true,
            visibilityProperty: true
          })
        ) {
          const engine = cesdk.engine;
          frames.push({
            ratio:
              engine.block.getWidth(pageBlock) /
              engine.block.getHeight(pageBlock),
            editMode: engine.editor.getEditMode(),
            cropPanelOpen: cesdk.ui.isPanelOpen('//ly.img.panel/inspector/crop')
          });
        }
        requestAnimationFrame(sample);
      };
      requestAnimationFrame(sample);
    });
  }

  /**
   * The frames from the moment the canvas becomes visible until one second
   * later, long enough to catch a late crop or a mode switch.
   */
  async function visibleFrames(page: Page): Promise<VisibleFrame[]> {
    const read = () =>
      page.evaluate(() => (window as any).__visibleFrames as VisibleFrame[]);
    await expect.poll(async () => (await read()).length).toBeGreaterThan(0);
    await page.waitForTimeout(1000);
    return read();
  }

  function expectEveryFrame(frames: VisibleFrame[], expected: VisibleFrame) {
    for (const frame of frames) {
      expect(frame.ratio).toBeCloseTo(expected.ratio, 2);
      expect(frame.editMode).toBe(expected.editMode);
      expect(frame.cropPanelOpen).toBe(expected.cropPanelOpen);
    }
  }

  test('FCE-11 the canvas first shows the image already cropped, in Crop mode', async ({
    page
  }) => {
    await page.goto('./');
    const screen = new SelectionScreen(page);
    await recordVisibleFrames(page);
    const editor = await screen.openEditor();

    expectEveryFrame(await visibleFrames(page), {
      ratio: 4 / 5,
      editMode: 'Crop',
      cropPanelOpen: true
    });
    // The kit zooms to the page itself, so the page must still fit the view.
    expect(
      await page.evaluate(
        (handle) =>
          handle.engine.scene.isZoomAutoFitEnabled(handle.engine.scene.get()!),
        editor
      )
    ).toBe(true);
    await editor.dispose();
  });

  test('FCE-12 Silent mode shows only the cropped image, without the Crop panel', async ({
    page
  }) => {
    await page.goto('./');
    const screen = new SelectionScreen(page);
    await screen.option('Mountain landscape').click();
    await screen.mode('Silent').click();
    await recordVisibleFrames(page);
    const editor = await screen.openEditor();

    expectEveryFrame(await visibleFrames(page), {
      ratio: 4 / 5,
      editMode: 'Transform',
      cropPanelOpen: false
    });
    await editor.dispose();
  });

  test('FCE-13 If Needed shows the cropped image in Crop mode when the ratio differs', async ({
    page
  }) => {
    await page.goto('./');
    const screen = new SelectionScreen(page);
    await screen.option('Mountain landscape').click();
    await screen.mode('If Needed').click();
    await recordVisibleFrames(page);
    const editor = await screen.openEditor();

    expectEveryFrame(await visibleFrames(page), {
      ratio: 4 / 5,
      editMode: 'Crop',
      cropPanelOpen: true
    });
    await editor.dispose();
  });

  test('FCE-14 If Needed leaves a matching image in Transform mode from the first frame', async ({
    page
  }) => {
    await page.goto('./');
    const screen = new SelectionScreen(page);
    await screen.mode('If Needed').click();
    await screen.option('LinkedIn Logo').click();
    await screen.option('Healthy salad bowl').click();
    await recordVisibleFrames(page);
    const editor = await screen.openEditor();

    expectEveryFrame(await visibleFrames(page), {
      ratio: 1,
      editMode: 'Transform',
      cropPanelOpen: false
    });
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

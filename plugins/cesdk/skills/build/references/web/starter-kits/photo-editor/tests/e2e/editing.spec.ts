import {
  download,
  expect,
  exportCalls,
  pngSize,
  spyExport,
  test
} from '@imgly/kit-test-harness';

/** Select the graphic block whose fill is the demo photo. */
async function selectPhoto(kit: { page: any; editor: any }): Promise<number> {
  return kit.page.evaluate((handle: any) => {
    const engine = handle.engine;
    const graphic = engine.block
      .findByType('graphic')
      .find(
        (id: number) =>
          engine.block.getType(engine.block.getFill(id)) ===
          '//ly.img.ubq/fill/image'
      );
    engine.block.select(graphic);
    return graphic;
  }, kit.editor);
}

test.describe('Background removal', () => {
  test('PE-04 remove the background of the demo image', async ({ kit }) => {
    // The plugin downloads about 40 MB of ONNX models on first use.
    test.setTimeout(240_000);

    const block = await selectPhoto(kit);
    const before = await kit.page.evaluate(
      ([handle, id]: [any, number]) =>
        handle.engine.block.getString(
          handle.engine.block.getFill(id),
          'fill/image/imageFileURI'
        ),
      [kit.editor, block] as const
    );

    await kit.page
      .getByRole('button', { name: 'BG Removal', exact: true })
      .click();

    await kit.page.waitForFunction(
      ([id, previous]: [number, string]) => {
        const engine = (window as any).cesdk.engine;
        return (
          engine.block.getString(
            engine.block.getFill(id),
            'fill/image/imageFileURI'
          ) !== previous
        );
      },
      [block, before] as const,
      { timeout: 200_000 }
    );

    const after = await kit.page.evaluate(
      ([handle, id]: [any, number]) =>
        handle.engine.block.getString(
          handle.engine.block.getFill(id),
          'fill/image/imageFileURI'
        ),
      [kit.editor, block] as const
    );
    expect(after).toMatch(/^blob:/);
  });
});

test.describe('Background removal on the sample photo', () => {
  test('PE-11 remove the background of the page photo', async ({ kit }) => {
    // The plugin downloads about 40 MB of ONNX models on first use.
    test.setTimeout(240_000);

    const { page, before } = await kit.page.evaluate((handle: any) => {
      const engine = handle.engine;
      const page = engine.scene.getCurrentPage();
      engine.block.select(page);
      return {
        page,
        before: engine.block.getString(
          engine.block.getFill(page),
          'fill/image/imageFileURI'
        )
      };
    }, kit.editor);

    const bgRemoval = kit.page.getByRole('button', {
      name: 'BG Removal',
      exact: true
    });
    await expect(bgRemoval).toBeEnabled();
    await bgRemoval.click();

    await expect
      .poll(
        () =>
          kit.page.evaluate(
            ([handle, id]: [any, number]) =>
              handle.engine.block.getString(
                handle.engine.block.getFill(id),
                'fill/image/imageFileURI'
              ),
            [kit.editor, page] as const
          ),
        { timeout: 200_000 }
      )
      .not.toBe(before);
    expect(
      await kit.page.evaluate(
        ([handle, id]: [any, number]) =>
          handle.engine.block.getString(
            handle.engine.block.getFill(id),
            'fill/image/imageFileURI'
          ),
        [kit.editor, page] as const
      )
    ).toMatch(/^blob:/);
  });
});

test.describe('Editing through the shared configuration', () => {
  test('PE-05 the page image is editable but not replaceable', async ({
    kit
  }) => {
    await kit.page.evaluate(
      (handle) =>
        handle.engine.block.select(handle.engine.scene.getCurrentPage()),
      kit.editor
    );

    await expect(
      kit.page.getByRole('button', { name: /replace/i })
    ).toHaveCount(0);

    for (const [label, panel] of [
      ['Adjust', '//ly.img.panel/inspector/adjustments'],
      ['Filter', '//ly.img.panel/inspector/filters'],
      ['Effects', '//ly.img.panel/inspector/effects']
    ] as const) {
      await kit.page.getByRole('button', { name: label, exact: true }).click();
      await expect
        .poll(() =>
          kit.page.evaluate(
            ([handle, id]: [any, string]) => handle.cesdk.ui.isPanelOpen(id),
            [kit.editor, panel] as const
          )
        )
        .toBe(true);
      await kit.page.getByRole('button', { name: label, exact: true }).click();
    }
  });
});

test.describe('Export', () => {
  test('PE-07 export image', async ({ kit }) => {
    await spyExport(kit.page);

    const files = await download(
      kit.page,
      () =>
        kit.page
          .getByRole('button', { name: 'Export Image', exact: true })
          .click(),
      1
    );

    expect(files[0].name).toMatch(/\.png$/);
    const calls = await exportCalls(kit.page);
    expect(calls).toHaveLength(1);
    expect(calls[0].options).toMatchObject({ mimeType: 'image/png' });
    expect(calls[0].options?.targetWidth).toBeUndefined();

    const scenePageSize = await kit.page.evaluate((handle) => {
      const page = handle.engine.scene.getPages()[0];
      return {
        width: Math.round(handle.engine.block.getWidth(page)),
        height: Math.round(handle.engine.block.getHeight(page))
      };
    }, kit.editor);
    expect(pngSize(files[0].buffer)).toEqual(scenePageSize);
  });
});

/** The image graphic on the page, which is not the sample photo itself. */
async function selectOverlayImage(kit: {
  page: any;
  editor: any;
}): Promise<{ overlay: number; page: number }> {
  return kit.page.evaluate((handle: any) => {
    const engine = handle.engine;
    const page = engine.scene.getCurrentPage();
    const overlay = engine.block.findByType('graphic')[0];
    engine.block.select(overlay);
    return { overlay, page };
  }, kit.editor);
}

const selection = (kit: { page: any; editor: any }): Promise<number[]> =>
  kit.page.evaluate(
    (handle: any) => handle.engine.block.findAllSelected(),
    kit.editor
  );

const isPanelOpen = (
  kit: { page: any; editor: any },
  panel: string
): Promise<boolean> =>
  kit.page.evaluate(
    ([handle, id]: [any, string]) => handle.cesdk.ui.isPanelOpen(id),
    [kit.editor, panel] as const
  );

test.describe('Photo tools target the sample photo', () => {
  test('PE-08 Adjust, Filter and Effects open for the page', async ({
    kit
  }) => {
    for (const [label, panel] of [
      ['Adjust', '//ly.img.panel/inspector/adjustments'],
      ['Filter', '//ly.img.panel/inspector/filters'],
      ['Effects', '//ly.img.panel/inspector/effects']
    ] as const) {
      const { page } = await selectOverlayImage(kit);
      await expect.poll(() => selection(kit)).not.toEqual([page]);

      await kit.page.getByRole('button', { name: label, exact: true }).click();

      await expect.poll(() => isPanelOpen(kit, panel)).toBe(true);
      expect(await selection(kit)).toEqual([page]);
      await kit.page.getByRole('button', { name: label, exact: true }).click();
      await expect.poll(() => isPanelOpen(kit, panel)).toBe(false);
    }
  });

  test('PE-09 Crop puts the sample photo into crop mode', async ({ kit }) => {
    const { page } = await selectOverlayImage(kit);
    await expect.poll(() => selection(kit)).not.toEqual([page]);

    // The overlay's inspector bar has a Crop button of its own.
    await kit.page
      .getByRole('region', { name: /Dock$/ })
      .getByRole('button', { name: 'Crop', exact: true })
      .click();

    await expect
      .poll(() =>
        kit.page.evaluate(
          (handle: any) => handle.engine.editor.getEditMode(),
          kit.editor
        )
      )
      .toBe('Crop');
    expect(await selection(kit)).toEqual([page]);
    await expect
      .poll(() => isPanelOpen(kit, '//ly.img.panel/inspector/crop'))
      .toBe(true);
  });

  test('PE-10 the selected sample photo offers no Replace control', async ({
    kit
  }) => {
    const inspectorBar = kit.page.getByRole('region', {
      name: 'Inspector Bar'
    });
    // An overlay image does get the inspector bar, so its absence below is
    // the page rule and not a bar that has not rendered yet.
    const { page } = await selectOverlayImage(kit);
    await expect(inspectorBar).toBeVisible();

    await kit.page.evaluate(
      ([handle, id]: [any, number]) => handle.engine.block.select(id),
      [kit.editor, page] as const
    );
    await expect.poll(() => selection(kit)).toEqual([page]);

    await expect(inspectorBar).toHaveCount(0);
    await expect(
      kit.page.getByRole('region', { name: 'Canvas Menu' })
    ).toHaveCount(0);
    await expect(
      kit.page.getByRole('button', { name: /replace/i })
    ).toHaveCount(0);
  });
});

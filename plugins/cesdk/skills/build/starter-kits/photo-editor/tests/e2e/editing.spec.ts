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

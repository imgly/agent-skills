import { editorPanel, expect, test } from '@imgly/kit-test-harness';
import { qrBlocks, select, typeUrl } from './qr';

const GENERATE_PANEL = '//ly.img.panel/generate-qr';
const UPDATE_PANEL = '//ly.img.panel/update-qr';

test.describe('Generating a QR code', () => {
  test('QR-04 generate a QR code from the dock panel', async ({ kit }) => {
    await kit.page
      .locator('#cesdk_container')
      .getByRole('button', { name: 'QR Code', exact: true })
      .click();

    const panel = editorPanel(kit.page, GENERATE_PANEL);
    await expect(
      panel.getByRole('heading', { name: 'Generate QR Code' })
    ).toBeVisible();
    await expect(
      panel.getByRole('button', { name: 'Foreground Color' })
    ).toBeVisible();
    await expect(
      panel.getByRole('button', { name: 'Generate QR Code' })
    ).toBeDisabled();

    const before = await qrBlocks(kit.page, kit.editor);
    await typeUrl(kit.page, GENERATE_PANEL, 'https://example.com/');
    await panel.getByRole('button', { name: 'Generate QR Code' }).click();

    await expect
      .poll(async () => (await qrBlocks(kit.page, kit.editor)).length)
      .toBe(before.length + 1);
    await expect(panel).toBeHidden();

    const added = (await qrBlocks(kit.page, kit.editor)).find(
      (block) => !before.some((old) => old.id === block.id)
    );
    // `shape` is the plugin's default block type and the kit does not
    // override it.
    expect(added).toMatchObject({
      url: 'https://example.com/',
      type: 'shape'
    });
    expect(
      await kit.page.evaluate(
        (handle) => handle.engine.block.findAllSelected(),
        kit.editor
      )
    ).toEqual([added!.id]);
  });

  test('QR-05 change the URL of a newly created QR code', async ({ kit }) => {
    await kit.page
      .locator('#cesdk_container')
      .getByRole('button', { name: 'QR Code', exact: true })
      .click();
    await typeUrl(kit.page, GENERATE_PANEL, 'https://example.com/');
    await editorPanel(kit.page, GENERATE_PANEL)
      .getByRole('button', { name: 'Generate QR Code' })
      .click();

    const [created] = await kit.page.evaluate(
      (handle) => handle.engine.block.findAllSelected(),
      kit.editor
    );
    const shapeBefore = await kit.page.evaluate(
      ({ handle, id }) =>
        handle.engine.block.getString(
          handle.engine.block.getShape(id),
          'shape/vector_path/path'
        ),
      { handle: kit.editor, id: created }
    );

    await kit.page
      .getByRole('region', { name: 'Canvas' })
      .getByRole('button', { name: 'Edit', exact: true })
      .click();
    await typeUrl(kit.page, UPDATE_PANEL, 'https://img.ly/pricing');

    await expect
      .poll(
        async () =>
          (await qrBlocks(kit.page, kit.editor)).find(
            (block) => block.id === created
          )?.url
      )
      .toBe('https://img.ly/pricing');
    await expect
      .poll(() =>
        kit.page.evaluate(
          ({ handle, id }) =>
            handle.engine.block.getString(
              handle.engine.block.getShape(id),
              'shape/vector_path/path'
            ),
          { handle: kit.editor, id: created }
        )
      )
      .not.toBe(shapeBefore);
  });
});

test.describe('Editing an existing QR code', () => {
  test('QR-06 edit and clear the URL of a demo QR code', async ({ kit }) => {
    const canvas = kit.page.getByRole('region', { name: 'Canvas' });
    const [demo] = await qrBlocks(kit.page, kit.editor);

    // An image block carries no QR metadata, so the plugin's Edit button is
    // not offered there.
    await kit.page.evaluate((handle) => {
      const engine = handle.engine;
      engine.block
        .findAllSelected()
        .forEach((id: number) => engine.block.setSelected(id, false));
      engine.block.select(engine.block.findByKind('image')[0]);
    }, kit.editor);
    await expect(
      canvas.getByRole('button', { name: 'Edit', exact: true })
    ).toBeHidden();

    await select(kit.page, kit.editor, [demo.id]);
    await canvas.getByRole('button', { name: 'Edit', exact: true }).click();
    await typeUrl(kit.page, UPDATE_PANEL, 'https://img.ly/docs');
    await expect
      .poll(
        async () =>
          (await qrBlocks(kit.page, kit.editor)).find(
            (block) => block.id === demo.id
          )?.url
      )
      .toBe('https://img.ly/docs');

    // Clearing the field pins the plugin's answer for an empty URL: the
    // metadata keeps the last value.
    const input = editorPanel(kit.page, UPDATE_PANEL).getByRole('textbox');
    await input.click();
    await input.fill('');
    await input.press('Enter');
    await expect
      .poll(
        async () =>
          (await qrBlocks(kit.page, kit.editor)).find(
            (block) => block.id === demo.id
          )?.url
      )
      .toBe('https://img.ly/docs');
  });

  test('QR-07 the plugin withholds replace, crop and adjustments', async ({
    kit
  }) => {
    const canvas = kit.page.getByRole('region', { name: 'Canvas' });
    const inspector = kit.page.getByRole('region', { name: 'Inspector Bar' });
    const [demo] = await qrBlocks(kit.page, kit.editor);
    await select(kit.page, kit.editor, [demo.id]);

    await expect(
      inspector.getByRole('button', { name: 'Color' })
    ).toBeVisible();
    for (const control of ['Crop', 'Style', 'Image']) {
      await expect(
        inspector.getByRole('button', { name: control, exact: true })
      ).toBeHidden();
    }
    await expect(
      canvas.getByRole('button', { name: 'Replace Image' })
    ).toBeHidden();

    // The kit enables all four features globally, so an image block still
    // gets them: the plugin's predicate only wins on a QR block.
    await kit.page.evaluate((handle) => {
      const engine = handle.engine;
      engine.block
        .findAllSelected()
        .forEach((id: number) => engine.block.setSelected(id, false));
      engine.block.select(engine.block.findByKind('image')[0]);
    }, kit.editor);
    await expect(
      inspector.getByRole('button', { name: 'Crop', exact: true })
    ).toBeVisible();
  });

  test('QR-08 stroke and shadow stay available', async ({ kit }) => {
    const inspector = kit.page.getByRole('region', { name: 'Inspector Bar' });
    const [demo] = await qrBlocks(kit.page, kit.editor);
    const enabled = (property: 'stroke' | 'shadow') =>
      kit.page.evaluate(
        ({ handle, id, which }) =>
          which === 'stroke'
            ? handle.engine.block.isStrokeEnabled(id)
            : handle.engine.block.isDropShadowEnabled(id),
        { handle: kit.editor, id: demo.id, which: property }
      );
    await select(kit.page, kit.editor, [demo.id]);

    // The stroke control carries its colour as its accessible name.
    await inspector.getByRole('button', { name: '#ABABAB' }).click();
    await kit.page
      .getByRole('button', { name: 'Enable Color' })
      .first()
      .click();
    await expect.poll(() => enabled('stroke')).toBe(true);

    await inspector.getByRole('button', { name: 'Shadow' }).click();
    await editorPanel(kit.page, '//ly.img.panel/inspector/shadow')
      .getByRole('button', { name: 'Enable Shadow' })
      .first()
      .click();
    await expect.poll(() => enabled('shadow')).toBe(true);
  });

  test('QR-09 duplicate, edit the copy, delete', async ({ kit }) => {
    const canvas = kit.page.getByRole('region', { name: 'Canvas' });
    const [demo] = await qrBlocks(kit.page, kit.editor);
    await select(kit.page, kit.editor, [demo.id]);

    await canvas.getByRole('button', { name: 'Duplicate' }).click();
    await expect
      .poll(async () => (await qrBlocks(kit.page, kit.editor)).length)
      .toBe(3);

    const [copy] = await kit.page.evaluate(
      (handle) => handle.engine.block.findAllSelected(),
      kit.editor
    );
    expect(copy).not.toBe(demo.id);

    await canvas.getByRole('button', { name: 'Edit', exact: true }).click();
    await typeUrl(kit.page, UPDATE_PANEL, 'https://img.ly/copy');

    await expect
      .poll(async () => {
        const blocks = await qrBlocks(kit.page, kit.editor);
        return [
          blocks.find((block) => block.id === copy)?.url,
          blocks.find((block) => block.id === demo.id)?.url
        ];
      })
      .toEqual(['https://img.ly/copy', demo.url]);

    await select(kit.page, kit.editor, [copy]);
    await canvas.getByRole('button', { name: 'Delete' }).click();
    await expect
      .poll(async () => (await qrBlocks(kit.page, kit.editor)).length)
      .toBe(2);
  });
});

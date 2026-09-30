import { editorPanel, expect, test } from '@imgly/kit-test-harness';
import {
  VECTORIZE_BUTTON,
  imageBlocks,
  selectByKind,
  selectedOnPage,
  uploadAndAdd,
  vectorizeStatus
} from './editor';

test.describe('Vectorization', () => {
  test('V-03 vectorize a sample image', async ({ kit }) => {
    const block = await selectByKind(kit.page, kit.editor, 'image');
    await expect(kit.page.getByRole('button', VECTORIZE_BUTTON)).toBeVisible();

    await kit.page.getByRole('button', VECTORIZE_BUTTON).click();

    // The plugin marks the block the moment it takes it over. The conversion
    // itself is the plugin's to test, so the case does not wait for it.
    await expect
      .poll(() => vectorizeStatus(kit.page, kit.editor, block))
      .toMatch(/^PROCESS(ING|ED)$/);

    const selected = await kit.page.evaluate(
      (handle) => handle.engine.block.findAllSelected(),
      kit.editor
    );
    expect(selected).toEqual([block]);
  });

  test('V-03b every sample image can be vectorized', async ({ kit }) => {
    // Captured once: a finished conversion can turn an image into a group.
    const images = await imageBlocks(kit.page, kit.editor);
    expect(images.length).toBeGreaterThan(0);

    for (const block of images) {
      await kit.page.evaluate(
        ({ handle, id }) => {
          const engine = handle.engine;
          engine.block
            .findAllSelected()
            .forEach((selected: number) =>
              engine.block.setSelected(selected, false)
            );
          engine.block.select(id);
        },
        { handle: kit.editor, id: block }
      );
      await kit.page.getByRole('button', VECTORIZE_BUTTON).click();
      await expect
        .poll(() => vectorizeStatus(kit.page, kit.editor, block))
        .toMatch(/^PROCESS(ING|ED)$/);
    }
  });

  test('V-04b a library image lands selected and is offered vectorization', async ({
    kit
  }) => {
    const label = await kit.page.evaluate(async (handle) => {
      const found = await handle.engine.asset.findAssets('ly.img.image', {
        page: 0,
        perPage: 1
      });
      return found.assets[0].label as string;
    }, kit.editor);
    const before = await imageBlocks(kit.page, kit.editor);

    await kit.page.getByRole('button', { name: 'Images', exact: true }).click();
    const panel = editorPanel(kit.page, '//ly.img.panel/assetLibrary');
    await panel
      .getByRole('button', { name: label, exact: true })
      .first()
      .click();

    await expect
      .poll(async () => (await imageBlocks(kit.page, kit.editor)).length)
      .toBe(before.length + 1);
    const [added] = (await imageBlocks(kit.page, kit.editor)).filter(
      (id) => !before.includes(id)
    );
    await expect
      .poll(() => selectedOnPage(kit.page, kit.editor))
      .toEqual({ selected: [added], onPage: true });
    await expect(kit.page.getByRole('button', VECTORIZE_BUTTON)).toBeVisible();
  });

  test('V-04 an uploaded image is offered vectorization', async ({ kit }) => {
    for (const name of ['sample.png', 'sample.jpg'] as const) {
      const before = await imageBlocks(kit.page, kit.editor);
      await uploadAndAdd(kit.page, name);
      await expect
        .poll(async () => (await imageBlocks(kit.page, kit.editor)).length)
        .toBe(before.length + 1);
      const [added] = (await imageBlocks(kit.page, kit.editor)).filter(
        (id) => !before.includes(id)
      );
      await expect
        .poll(() => selectedOnPage(kit.page, kit.editor))
        .toEqual({ selected: [added], onPage: true });
      await expect(
        kit.page.getByRole('button', VECTORIZE_BUTTON)
      ).toBeVisible();
    }

    const uploads = await kit.page.evaluate(async (handle) => {
      const found = await handle.engine.asset.findAssets(
        'ly.img.image.upload',
        { page: 0, perPage: 10 }
      );
      return found.assets.length;
    }, kit.editor);
    expect(uploads).toBe(2);
  });

  test('V-05 an SVG is offered vectorization too', async ({ kit }) => {
    await uploadAndAdd(kit.page, 'sample.svg');

    const fill = await kit.page.evaluate((handle) => {
      const engine = handle.engine;
      const [block] = engine.block.findAllSelected();
      return engine.block.getType(engine.block.getFill(block));
    }, kit.editor);
    // An uploaded SVG becomes an image fill, and the plugin offers its button
    // for any image fill, so the kit shows it here too.
    expect(fill).toBe('//ly.img.ubq/fill/image');
    await expect(kit.page.getByRole('button', VECTORIZE_BUTTON)).toBeVisible();
  });

  test('V-07 two images at a time', async ({ kit }) => {
    await kit.page.evaluate((handle) => {
      const engine = handle.engine;
      const [first, second] = engine.block.findByKind('image');
      engine.block
        .findAllSelected()
        .forEach((id: number) => engine.block.setSelected(id, false));
      engine.block.setSelected(first, true);
      engine.block.setSelected(second, true);
    }, kit.editor);

    // The plugin withholds its button for a multi-block selection.
    await expect(kit.page.getByRole('button', VECTORIZE_BUTTON)).toBeHidden();
  });

  test('V-08 an image keeps the editing features the kit enables', async ({
    kit
  }) => {
    await selectByKind(kit.page, kit.editor, 'image');

    const canvas = kit.page.getByRole('region', { name: 'Canvas' });
    const inspector = kit.page.getByRole('region', { name: 'Inspector Bar' });

    await expect(
      inspector.getByRole('button', { name: 'Crop', exact: true })
    ).toBeVisible();
    await inspector.getByRole('button', { name: 'Style', exact: true }).click();
    await expect(
      kit.page.getByRole('button', { name: 'Adjustments', exact: true })
    ).toBeVisible();
    await kit.page.keyboard.press('Escape');

    await expect(
      canvas.getByRole('button', { name: 'Replace Image' })
    ).toBeVisible();

    const images = () =>
      kit.page.evaluate(
        (handle) => handle.engine.block.findByKind('image').length,
        kit.editor
      );
    const before = await images();

    await canvas.getByRole('button', { name: 'Duplicate' }).click();
    await expect.poll(images).toBe(before + 1);

    await canvas.getByRole('button', { name: 'Delete' }).click();
    await expect.poll(images).toBe(before);
  });
});

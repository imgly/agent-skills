import { expect, test } from '@imgly/kit-test-harness';
import { cutoutBlocks, select, waitForCutoutSource } from './cutouts';

test.describe('Editing a cutout', () => {
  test('CL-03 a selected cutout exposes type, offset and smoothing', async ({
    kit
  }) => {
    const [cutout] = await cutoutBlocks(kit.page, kit.editor);
    await select(kit.page, kit.editor, [cutout]);

    const property = (name: string) =>
      kit.page.evaluate(
        ({ handle, id, key }) =>
          key === 'cutout/type'
            ? handle.engine.block.getEnum(id, key)
            : handle.engine.block.getFloat(id, key),
        { handle: kit.editor, id: cutout, key: name }
      );

    const inspector = kit.page.getByRole('region', { name: 'Inspector Bar' });
    for (const control of ['Type', 'Offset', 'Smoothing']) {
      await expect(
        inspector.getByRole('button', { name: control })
      ).toBeVisible();
    }

    await inspector.getByRole('button', { name: 'Type' }).click();
    await kit.page.getByRole('option', { name: 'Perforated' }).click();
    // The engine calls the perforated line type `Dashed`.
    await expect.poll(() => property('cutout/type')).toBe('Dashed');

    for (const [control, key] of [
      ['Offset', 'cutout/offset'],
      ['Smoothing', 'cutout/smoothing']
    ] as const) {
      await select(kit.page, kit.editor, [cutout]);
      await inspector.getByRole('button', { name: control }).click();
      const before = (await property(key)) as number;
      await kit.page
        .getByRole('button', { name: `Increase ${control}` })
        .click();
      await expect.poll(() => property(key)).toBeGreaterThan(before);
    }
  });

  test('CL-04 generate a cutout from the selection', async ({ kit }) => {
    const before = await cutoutBlocks(kit.page, kit.editor);

    await kit.page.evaluate((handle) => {
      const engine = handle.engine;
      engine.block
        .findAllSelected()
        .forEach((id: number) => engine.block.setSelected(id, false));
      engine.block.select(engine.block.findByKind('shape')[0]);
    }, kit.editor);

    const canvas = kit.page.getByRole('region', { name: 'Canvas' });
    await canvas.getByRole('button', { name: 'Cutout', exact: true }).click();

    await expect
      .poll(async () => (await cutoutBlocks(kit.page, kit.editor)).length)
      .toBe(before.length + 1);

    const selected = await kit.page.evaluate((handle) => {
      const engine = handle.engine;
      return engine.block
        .findAllSelected()
        .map((id: number) => engine.block.getType(id));
    }, kit.editor);
    expect(selected).toEqual(['//ly.img.ubq/cutout']);

    // The plugin withholds its canvas-menu button on a cutout, so the
    // "cutout from a cutout" notification is never reachable from here.
    await select(kit.page, kit.editor, [before[0]]);
    await expect(
      canvas.getByRole('button', { name: 'Cutout', exact: true })
    ).toBeHidden();
  });

  test('CL-05 combine two cutouts', async ({ kit }) => {
    const inspector = kit.page.getByRole('region', { name: 'Inspector Bar' });

    for (const operation of ['Union', 'Subtract', 'Intersect', 'Exclude']) {
      const before = await cutoutBlocks(kit.page, kit.editor);
      await select(kit.page, kit.editor, [before[0], before[1]]);

      await inspector.getByRole('button', { name: 'Combine' }).click();
      await kit.page.getByRole('menuitem', { name: operation }).click();

      await expect
        .poll(async () => (await cutoutBlocks(kit.page, kit.editor)).length)
        .toBe(before.length - 1);

      await kit.page.getByRole('button', { name: 'Undo' }).click();
      await expect
        .poll(async () => (await cutoutBlocks(kit.page, kit.editor)).length)
        .toBe(before.length);
    }
  });

  test('CL-06 a cutout survives a document format change', async ({ kit }) => {
    await waitForCutoutSource(kit.page, kit.editor);
    const [cutout] = await cutoutBlocks(kit.page, kit.editor);

    await kit.page.evaluate((handle) => {
      const engine = handle.engine;
      engine.block
        .findAllSelected()
        .forEach((id: number) => engine.block.setSelected(id, false));
      engine.block.select(engine.scene.getPages()[0]);
    }, kit.editor);

    await kit.page
      .getByRole('region', { name: 'Inspector Bar' })
      .getByRole('button', { name: 'Resize' })
      .click();
    await kit.page
      .getByRole('button', { name: 'DIN A4 Portrait', exact: true })
      .click();

    await expect
      .poll(() =>
        kit.page.evaluate(
          (handle) =>
            handle.engine.block.getWidth(handle.engine.scene.getPages()[0]),
          kit.editor
        )
      )
      .toBeGreaterThan(200);

    await select(kit.page, kit.editor, [cutout]);
    await expect(
      kit.page
        .getByRole('region', { name: 'Inspector Bar' })
        .getByRole('button', { name: 'Type' })
    ).toBeVisible();
  });
});

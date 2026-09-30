import { expect, test } from '@imgly/kit-test-harness';

test.describe('Start-up and library', () => {
  test('BGR-01 editor loads with the demo scene', async ({ kit }) => {
    const page = await kit.page.evaluate((handle) => {
      const engine = handle.engine;
      const [first] = engine.scene.getPages();
      return {
        count: engine.scene.getPages().length,
        width: engine.block.getWidth(first),
        height: engine.block.getHeight(first),
        unit: engine.scene.getDesignUnit()
      };
    }, kit.editor);

    expect(page).toEqual({
      count: 1,
      width: 148,
      height: 105,
      unit: 'Millimeter'
    });

    for (const label of [
      'Templates',
      'Elements',
      'Uploads',
      'Images',
      'Text',
      'Shapes',
      'Stickers'
    ]) {
      await expect(
        kit.page.getByRole('button', { name: label, exact: true })
      ).toBeVisible();
    }
  });

  test('BGR-02 add a pre-loaded image to the canvas', async ({ kit }) => {
    const countImages = () =>
      kit.page.evaluate(
        (handle) => handle.engine.block.findByKind('image').length,
        kit.editor
      );
    const before = await countImages();

    await kit.page.getByRole('button', { name: 'Images', exact: true }).click();
    await kit.page
      .getByRole('button', { name: 'Mountains', exact: true })
      .click();

    await expect.poll(countImages).toBe(before + 1);

    const selected = await kit.page.evaluate((handle) => {
      const engine = handle.engine;
      const blocks = engine.block.findAllSelected();
      return blocks.map((id: number) => ({
        kind: engine.block.getKind(id),
        hasImageFill:
          engine.block.getType(engine.block.getFill(id)) ===
          '//ly.img.ubq/fill/image'
      }));
    }, kit.editor);

    expect(selected).toEqual([{ kind: 'image', hasImageFill: true }]);
  });
});

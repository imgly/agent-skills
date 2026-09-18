import { expect, test } from '@imgly/kit-test-harness';
import {
  ProductEditor,
  addTextToCurrentPage,
  currentAreaId,
  pageNames,
  sceneMetadata,
  visibleBackdrop
} from './product-editor';

async function parentName(
  kit: Parameters<typeof addTextToCurrentPage>[0],
  block: number
): Promise<string> {
  return kit.page.evaluate(
    ({ handle, id }) =>
      handle.engine.block.getName(handle.engine.block.getParent(id)),
    { handle: kit.editor, id: block }
  );
}

test.describe('Areas and product switching', () => {
  test('PE-07 design content survives a product switch', async ({ kit }) => {
    const editor = new ProductEditor(kit.page);
    const text = await addTextToCurrentPage(kit);

    await editor.product('Tote Bag').click();
    await expect
      .poll(async () => sceneMetadata<{ id: string }>(kit, 'product'))
      .toMatchObject({ id: 'totebag' });

    expect(await parentName(kit, text)).toBe('front');
    expect(await currentAreaId(kit)).toBe('front');
  });

  test('PE-08 back content is not shown on a one-area product', async ({
    kit
  }) => {
    const editor = new ProductEditor(kit.page);

    await editor.areaButton('Back').click();
    await expect.poll(() => currentAreaId(kit)).toBe('back');
    const text = await addTextToCurrentPage(kit);

    await editor.product('Coffee Mug').click();
    await expect
      .poll(async () => sceneMetadata<{ id: string }>(kit, 'product'))
      .toMatchObject({ id: 'mug' });

    await expect(editor.areaButton('Front')).toHaveCount(0);
    expect(await currentAreaId(kit)).toBe('front');
    expect(await parentName(kit, text)).toBe('back');
    // Test plan issue 2: the `back` page itself stays in the scene.
    expect(await pageNames(kit)).toContain('back');
  });

  test('PE-09 back content carries over to the baseball cap', async ({
    kit
  }) => {
    const editor = new ProductEditor(kit.page);

    await editor.areaButton('Back').click();
    await expect.poll(() => currentAreaId(kit)).toBe('back');
    const text = await addTextToCurrentPage(kit);

    await editor.product('Coffee Mug').click();
    await expect
      .poll(async () => sceneMetadata<{ id: string }>(kit, 'product'))
      .toMatchObject({ id: 'mug' });

    await editor.product('Baseball Cap').click();
    await expect(editor.areaButton('Front')).toBeVisible();
    await editor.areaButton('Back').click();
    await expect.poll(() => currentAreaId(kit)).toBe('back');
    expect(await parentName(kit, text)).toBe('back');

    await editor.areaButton('Front').click();
    await expect.poll(() => currentAreaId(kit)).toBe('front');
    await editor.areaButton('Back').click();
    await expect.poll(() => currentAreaId(kit)).toBe('back');
    expect(await parentName(kit, text)).toBe('back');
  });

  test('PE-10 the colour resets when the product changes', async ({ kit }) => {
    const editor = new ProductEditor(kit.page);

    await editor.swatch('black').click();
    await expect
      .poll(async () => (await visibleBackdrop(kit))!.uri)
      .toContain('black_front.png');

    await editor.product('Baseball Cap').click();

    await expect
      .poll(async () => (await visibleBackdrop(kit))!.uri)
      .toContain('white_front.png');
    expect(await sceneMetadata<{ id: string }>(kit, 'color')).toMatchObject({
      id: 'white'
    });
  });

  test('PE-11 the arrow sign page is clipped to its silhouette', async ({
    kit
  }) => {
    const editor = new ProductEditor(kit.page);

    await editor.product('Arrow Sign').click();
    await expect
      .poll(async () => sceneMetadata<{ id: string }>(kit, 'product'))
      .toMatchObject({ id: 'arrowsign' });

    const shape = await kit.page.evaluate((handle) => {
      const engine = handle.engine;
      const page = engine.block.findByName('front')[0];
      const block = engine.block.getShape(page);
      return {
        type: engine.block.getType(block),
        path: engine.block.getString(block, 'shape/vector_path/path'),
        width: engine.block.getFloat(block, 'shape/vector_path/width'),
        height: engine.block.getFloat(block, 'shape/vector_path/height')
      };
    }, kit.editor);
    const product = await sceneMetadata<{
      areas: {
        mockup?: {
          pageShape?: string;
          printableAreaPx: { width: number; height: number };
        };
      }[];
    }>(kit, 'product');
    const area = product.areas[0];
    expect(shape.type).toBe('//ly.img.ubq/shape/vector_path');
    expect(shape.path).toBe(area.mockup!.pageShape);
    expect(shape.width).toBeCloseTo(area.mockup!.printableAreaPx.width, 3);
    expect(shape.height).toBeCloseTo(area.mockup!.printableAreaPx.height, 3);

    await editor.product('Coffee Mug').click();
    await expect
      .poll(async () => sceneMetadata<{ id: string }>(kit, 'product'))
      .toMatchObject({ id: 'mug' });

    const after = await kit.page.evaluate((handle) => {
      const engine = handle.engine;
      const page = engine.block.findByName('front')[0];
      return {
        type: engine.block.getType(engine.block.getShape(page)),
        orphans: engine.block.findByType('//ly.img.ubq/shape/vector_path')
          .length
      };
    }, kit.editor);
    expect(after.type).toBe('//ly.img.ubq/shape/rect');
    expect(after.orphans).toBe(0);
  });
});

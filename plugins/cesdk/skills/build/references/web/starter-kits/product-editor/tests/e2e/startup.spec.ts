import { expect, test, type Kit } from '@imgly/kit-test-harness';
import {
  ProductEditor,
  actionCalls,
  currentAreaId,
  sceneMetadata,
  spyActions,
  visibleBackdrop
} from './product-editor';

const PRODUCTS = [
  'Mens T-Shirt',
  'Baseball Cap',
  'Arrow Sign',
  'Coffee Mug',
  'Phone Case',
  'Tote Bag'
];

const SWATCHES = ['white', 'black', 'blue', 'gray', 'green', 'red'];

/** Labels of the sidebar buttons that carry the active border. */
async function highlighted(
  editor: ProductEditor,
  kit: Kit
): Promise<{ products: string[]; swatches: string[] }> {
  await kit.page.mouse.move(0, 0);
  const products = await editor.sidebar
    .getByRole('heading', { name: 'Product' })
    .locator('xpath=following-sibling::div[1]')
    .locator('button')
    .evaluateAll((buttons) =>
      buttons
        .filter(
          (button) =>
            getComputedStyle(button).borderColor === 'rgb(94, 88, 255)'
        )
        .map((button) => button.getAttribute('title'))
    );
  const swatches = await editor.sidebar
    .getByRole('heading', { name: 'Color' })
    .locator('xpath=following-sibling::div[1]')
    .locator('button')
    .evaluateAll((buttons) =>
      buttons
        .filter(
          (button) =>
            getComputedStyle(button.parentElement!).borderColor ===
            'rgb(0, 0, 0)'
        )
        .map((button) => button.getAttribute('title'))
    );
  return {
    products: products as string[],
    swatches: swatches as string[]
  };
}

test.describe('Start-up and the sidebar', () => {
  test('PE-01 the editor opens on the default product', async ({ kit }) => {
    const editor = new ProductEditor(kit.page);

    await expect(editor.areaButton('Front')).toHaveAttribute(
      'aria-pressed',
      'true'
    );
    expect(await currentAreaId(kit)).toBe('front');
    expect(await visibleBackdrop(kit)).toMatchObject({
      name: 'Backdrop-front'
    });
    const backdrop = await visibleBackdrop(kit);
    expect(backdrop!.uri).toContain('white_front.png');
    expect(backdrop!.uri).not.toContain('{{');
    expect(await sceneMetadata<{ id: string }>(kit, 'product')).toMatchObject({
      id: 'tshirt'
    });
    expect(await sceneMetadata<{ id: string }>(kit, 'color')).toMatchObject({
      id: 'white'
    });
  });

  test('PE-02 six products are offered', async ({ kit }) => {
    const editor = new ProductEditor(kit.page);

    await expect(
      editor.sidebar.getByRole('heading', { name: 'Product' })
    ).toBeVisible();
    for (const label of PRODUCTS) {
      const button = editor.product(label);
      await expect(button).toBeVisible();
      await expect(button.getByRole('img', { name: label })).toBeVisible();
    }
    const thumbnailsLoaded = await editor.sidebar
      .getByRole('img')
      .evaluateAll((images) =>
        images.every((image) => (image as HTMLImageElement).naturalWidth > 0)
      );
    expect(thumbnailsLoaded).toBe(true);
  });

  test('PE-03 the colour swatches swap the mockup', async ({ kit }) => {
    const editor = new ProductEditor(kit.page);

    for (const colorId of SWATCHES) {
      await expect(editor.swatch(colorId)).toBeVisible();
    }
    const backgrounds = await editor.sidebar
      .getByRole('heading', { name: 'Color' })
      .locator('xpath=following-sibling::div[1]')
      .locator('button')
      .evaluateAll((buttons) =>
        buttons.map((button) => (button as HTMLElement).style.backgroundColor)
      );
    expect(backgrounds).toEqual([
      'rgb(255, 255, 255)',
      'rgb(0, 0, 0)',
      'rgb(31, 64, 211)',
      'rgb(146, 146, 146)',
      'rgb(67, 211, 31)',
      'rgb(224, 45, 39)'
    ]);

    await editor.swatch('black').click();

    await expect
      .poll(async () => (await visibleBackdrop(kit))!.uri)
      .toContain('black_front.png');
    expect(await sceneMetadata<{ id: string }>(kit, 'color')).toMatchObject({
      id: 'black'
    });
  });

  test('PE-04 the sidebar sits right of the editor', async ({ kit }) => {
    const editor = new ProductEditor(kit.page);
    const canvas = kit.page.getByRole('region', {
      name: 'Canvas',
      exact: true
    });

    const sidebarBox = (await editor.sidebar.boundingBox())!;
    const canvasBox = (await canvas.boundingBox())!;

    expect(sidebarBox.x).toBeGreaterThanOrEqual(canvasBox.x + canvasBox.width);
    expect(sidebarBox.x + sidebarBox.width).toBeLessThanOrEqual(1400);
  });

  test('PE-05 area buttons appear only for two-area products', async ({
    kit
  }) => {
    const editor = new ProductEditor(kit.page);

    for (const label of ['Mens T-Shirt', 'Baseball Cap']) {
      await editor.product(label).click();
      await expect(editor.areaButton('Front')).toBeVisible();
      await expect(editor.areaButton('Back')).toBeVisible();
    }
    for (const label of [
      'Arrow Sign',
      'Coffee Mug',
      'Phone Case',
      'Tote Bag'
    ]) {
      await editor.product(label).click();
      await expect
        .poll(async () => sceneMetadata<{ id: string }>(kit, 'product'))
        .not.toMatchObject({ id: 'tshirt' });
      await expect(editor.areaButton('Front')).toHaveCount(0);
      await expect(editor.areaButton('Back')).toHaveCount(0);
    }
  });

  test('PE-06 the switch frames the backdrop, not the page', async ({
    kit
  }) => {
    const editor = new ProductEditor(kit.page);
    await spyActions(kit);

    await editor.product('Coffee Mug').click();
    await expect
      .poll(async () => (await visibleBackdrop(kit))!.name)
      .toBe('Backdrop-front');

    const zoom = (await actionCalls(kit)).filter(
      (call) => call.action === 'zoom.toBlock'
    );
    expect(zoom.length).toBeGreaterThan(0);
    const backdropIds = await kit.page.evaluate(
      (handle) => handle.engine.block.findByKind('backdrop_image'),
      kit.editor
    );
    expect(backdropIds).toContain(zoom.at(-1)!.args[0]);
    expect(zoom.at(-1)!.args[1]).toEqual({ animate: false, autoFit: true });
  });

  test('PE-14 only the product and colour shown are highlighted', async ({
    kit
  }) => {
    const editor = new ProductEditor(kit.page);

    await expect
      .poll(() => highlighted(editor, kit))
      .toEqual({ products: ['Mens T-Shirt'], swatches: ['white'] });

    await editor.swatch('red').click();
    await expect
      .poll(() => highlighted(editor, kit))
      .toEqual({ products: ['Mens T-Shirt'], swatches: ['red'] });

    await editor.product('Coffee Mug').click();
    await expect
      .poll(() => highlighted(editor, kit))
      .toEqual({ products: ['Coffee Mug'], swatches: ['red'] });

    await editor.swatch('green').click();
    await expect
      .poll(() => highlighted(editor, kit))
      .toEqual({ products: ['Coffee Mug'], swatches: ['green'] });
  });

  test('PE-15 every product loads with its pages and mockups', async ({
    kit
  }) => {
    const editor = new ProductEditor(kit.page);
    const expected: Record<string, { id: string; areas: string[] }> = {
      'Baseball Cap': { id: 'cap', areas: ['front', 'back'] },
      'Arrow Sign': { id: 'arrowsign', areas: ['front'] },
      'Coffee Mug': { id: 'mug', areas: ['front'] },
      'Phone Case': { id: 'phonecase', areas: ['front'] },
      'Tote Bag': { id: 'totebag', areas: ['front'] },
      'Mens T-Shirt': { id: 'tshirt', areas: ['front', 'back'] }
    };

    for (const [label, { id, areas }] of Object.entries(expected)) {
      await editor.product(label).click();
      await expect
        .poll(async () => sceneMetadata<{ id: string }>(kit, 'product'))
        .toMatchObject({ id });

      const product = await sceneMetadata<{
        areas: { id: string; pageSize: { width: number; height: number } }[];
      }>(kit, 'product');
      const pages = await kit.page.evaluate(
        ({ handle, ids }) =>
          ids.map((name) => {
            const [page] = handle.engine.block.findByName(name);
            return page == null
              ? null
              : {
                  width: handle.engine.block.getWidth(page),
                  height: handle.engine.block.getHeight(page)
                };
          }),
        { handle: kit.editor, ids: areas }
      );
      pages.forEach((page, index) => {
        expect(page, `${label} ${areas[index]}`).not.toBeNull();
        expect(page!.width).toBeCloseTo(product.areas[index].pageSize.width, 3);
        expect(page!.height).toBeCloseTo(
          product.areas[index].pageSize.height,
          3
        );
      });

      const mockups = await kit.page.evaluate(
        async ({ handle, ids }) => {
          const engine = handle.engine;
          const blocks = ids.map(
            (name) => engine.block.findByName(`Backdrop-${name}`)[0]
          );
          await engine.block.forceLoadResources(blocks).catch(() => undefined);
          return blocks.map((block) => ({
            uri: engine.block.getSourceSet(
              engine.block.getFill(block),
              'fill/image/sourceSet'
            )[0].uri,
            state: engine.block.getState(block).type
          }));
        },
        { handle: kit.editor, ids: areas }
      );
      expect(mockups, label).toHaveLength(areas.length);
      mockups.forEach((mockup) => {
        expect(mockup.uri).toContain(`/products/${id}/white`);
        expect(mockup.state, mockup.uri).toBe('Ready');
      });
    }
  });
});

import { expect, test } from '@imgly/kit-test-harness';
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
});

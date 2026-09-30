import { download, expect, pngSize, test } from '@imgly/kit-test-harness';

import {
  MultiImageGenerationKit,
  RESTAURANT_NAMES,
  TEMPLATE_LABELS,
  type TemplateLabel
} from './kit';

const RESTAURANT = RESTAURANT_NAMES[0];

type Page = Parameters<typeof download>[0];

async function openGenerated(page: Page, restaurant: string = RESTAURANT) {
  const kit = await MultiImageGenerationKit.open(page);
  await kit.selectRestaurant(restaurant);
  await kit.waitForGenerated();
  return kit;
}

/** A digest of the image a card shows, so a re-render of the same scene is told apart from an edit. */
function cardDigest(page: Page, label: TemplateLabel): Promise<string> {
  return page
    .getByRole('img', { name: `${label} template` })
    .evaluate(async (image: HTMLImageElement) => {
      const bytes = await (await fetch(image.src)).arrayBuffer();
      const digest = await crypto.subtle.digest('SHA-256', bytes);
      return Array.from(new Uint8Array(digest))
        .map((byte) => byte.toString(16).padStart(2, '0'))
        .join('');
    });
}

/** The open editor's page and the parts of it the kit filled in. */
function openScene(page: Page) {
  return page.evaluate(() => {
    const engine = (window as any).cesdk.engine;
    const [pageBlock] = engine.scene.getPages();
    const imageOf = (name: string) => {
      const [block] = engine.block.findByName(name);
      return engine.block.getString(
        engine.block.getFill(block),
        'fill/image/imageFileURI'
      ) as string;
    };
    const [nameBlock] = engine.block.findByName('RestaurantName');
    return {
      width: engine.block.getWidth(pageBlock) as number,
      height: engine.block.getHeight(pageBlock) as number,
      name: engine.block.getString(nameBlock, 'text/text') as string,
      photo: imageOf('RestaurantPhoto'),
      logo: imageOf('RestaurantLogo')
    };
  });
}

test.describe('Editing a generated card', () => {
  test('MIG-04 edit one card', async ({ page }) => {
    const kit = await openGenerated(page);

    await kit.openEditor('Portrait');

    // The kit picks the Adopter editor whenever a restaurant is selected, and
    // loads that card's saved scene rather than the blank template.
    expect(await kit.editorState()).toEqual({
      role: 'Adopter',
      theme: 'light',
      title: `${RESTAURANT} - Portrait`,
      name: RESTAURANT,
      pageCount: 1
    });
    await expect(
      page.getByRole('heading', { name: `${RESTAURANT} - Portrait` })
    ).toBeVisible();

    await expect(kit.backButton).toBeVisible();
    await expect(kit.saveButton).toBeVisible();
  });

  test('MIG-05 saving changes only that card', async ({ page }) => {
    const kit = await openGenerated(page);
    const before = await kit.cardSources();

    await kit.openEditor('Portrait');
    await kit.editRestaurantName('Saved by MIG-05');
    await kit.saveButton.click();
    await kit.waitForEditorClosed();

    await expect
      .poll(async () => (await kit.cardSources())[1])
      .not.toBe(before[1]);

    const after = await kit.cardSources();
    expect(after[0]).toBe(before[0]);
    expect(after[2]).toBe(before[2]);
  });

  test('MIG-05b a discarded edit changes nothing', async ({ page }) => {
    const kit = await openGenerated(page);
    const before = await kit.cardSources();

    await kit.openEditor('Landscape');
    await kit.editRestaurantName('Discarded by MIG-05b');
    await page.keyboard.press('Escape');
    await kit.waitForEditorClosed();

    expect(await kit.cardSources()).toEqual(before);
  });

  test('MIG-06 export the edited card', async ({ page }) => {
    const kit = await openGenerated(page);

    await kit.openEditor('Portrait');
    await kit.editRestaurantName('Exported by MIG-06');

    const files = await download(page, async () => {
      await kit.actionsDropdown.click();
      await kit.exportImagesButton.click();
    });

    expect(files).toHaveLength(1);
    expect(files[0].name).toMatch(/\.png$/);
    expect(pngSize(files[0].buffer).width).toBeGreaterThan(0);
  });

  test('MIG-10 a saved edit shows on its card and opens again', async ({
    page
  }) => {
    const kit = await openGenerated(page);
    const before = await cardDigest(page, 'Portrait');

    await kit.openEditor('Portrait');
    await kit.editRestaurantName('Saved by MIG-10');
    await kit.saveButton.click();
    await kit.waitForEditorClosed();

    await expect.poll(() => cardDigest(page, 'Portrait')).not.toBe(before);

    await kit.openEditor('Portrait');
    const portrait = await openScene(page);
    expect(portrait.name).toBe('Saved by MIG-10');
    expect(portrait.height).toBeGreaterThan(portrait.width);
    await kit.backButton.click();
    await kit.waitForEditorClosed();

    // Another card still opens on its own generated scene.
    await kit.openEditor('Landscape');
    const landscape = await openScene(page);
    expect(landscape.name).not.toBe('Saved by MIG-10');
    expect(landscape.width).toBeGreaterThan(landscape.height);
  });

  test('MIG-11 every card is generated from the clicked restaurant', async ({
    page
  }) => {
    const kit = await openGenerated(page, RESTAURANT_NAMES[1]);

    for (const label of TEMPLATE_LABELS) {
      await kit.openEditor(label);
      const scene = await openScene(page);
      expect(scene.photo).toMatch(/\/photo-scoop\.png$/);
      expect(scene.logo).toMatch(/\/logo-scoop\.png$/);
      await kit.backButton.click();
      await kit.waitForEditorClosed();
    }
  });

  test('MIG-12 an Adopter can select and change the texts and images', async ({
    page
  }) => {
    const kit = await openGenerated(page);

    for (const label of TEMPLATE_LABELS) {
      await kit.openEditor(label);
      const state = await page.evaluate(() => {
        const cesdk = (window as any).cesdk;
        const { block } = cesdk.engine;
        const parts = block
          .findAll()
          .filter(
            (id: number) =>
              block.getType(id) === '//ly.img.ubq/text' ||
              (block.supportsFill(id) &&
                block.getType(id) !== '//ly.img.ubq/page' &&
                block.getType(block.getFill(id)) === '//ly.img.ubq/fill/image')
          );
        const needed = (id: number) =>
          block.getType(id) === '//ly.img.ubq/text'
            ? ['editor/select', 'text/edit', 'text/character']
            : ['editor/select', 'fill/change'];
        return {
          role: cesdk.engine.editor.getRole(),
          names: parts.map((id: number) => block.getName(id)),
          denied: parts.flatMap((id: number) =>
            needed(id)
              .filter((scope) => !block.isAllowedByScope(id, scope))
              .map((scope) => `${block.getName(id) || id}: ${scope}`)
          )
        };
      });

      expect(state.role).toBe('Adopter');
      expect(state.names).toEqual(
        expect.arrayContaining([
          'RestaurantName',
          'RestaurantPhoto',
          'RestaurantLogo'
        ])
      );
      expect(state.denied).toEqual([]);
      await kit.backButton.click();
      await kit.waitForEditorClosed();
    }
  });
});

import { expect, test } from '@imgly/kit-test-harness';
import type { Kit } from '@imgly/kit-test-harness';

import {
  fillUri,
  openAddPanel,
  pageChildKinds,
  selectKind,
  selectedBlock,
  serveScenePhotos
} from './mobile-ui';

test.beforeEach(async ({ page }) => {
  await serveScenePhotos(page);
});

function shapeType(kit: Kit, block: number): Promise<string> {
  return kit.page.evaluate(
    ({ handle, id }) =>
      handle.engine.block.getType(handle.engine.block.getShape(id)),
    { handle: kit.editor, id: block }
  );
}

test('MB-11 add a shape', async ({ kit }) => {
  const before = await pageChildKinds(kit);

  await openAddPanel(kit.page, 'Shape');
  // The source is filtered to `ly.img.vector.shape.filled.*`, so an outline
  // shape such as `Quarter Circle Outline` is offered as a filled variant only.
  await kit.page.getByRole('button', { name: 'Star', exact: true }).click();

  await expect
    .poll(async () => (await pageChildKinds(kit)).length)
    .toBe(before.length + 1);
  const added = await selectedBlock(kit);
  expect(await shapeType(kit, added)).toContain('star');
});

test('MB-12 change a shape colour from the palette', async ({ kit }) => {
  const block = await selectKind(kit, 'shape');

  await kit.page.getByRole('button', { name: 'Color', exact: true }).click();
  const swatches = ['#ffffffff', '#000000ff', '#ff3333ff'];
  for (const swatch of swatches) {
    await expect(kit.page.getByRole('button', { name: swatch })).toBeVisible();
  }

  await kit.page.getByRole('button', { name: '#00d8a4ff' }).click();

  await expect
    .poll(() =>
      kit.page.evaluate(
        ({ handle, id }) =>
          handle.engine.block.getColor(id, 'fill/solid/color'),
        { handle: kit.editor, id: block }
      )
    )
    .toEqual({
      r: expect.closeTo(0),
      g: expect.closeTo(0.847, 2),
      b: expect.closeTo(0.643, 2),
      a: expect.closeTo(1)
    });
});

test('MB-13 add a sticker', async ({ kit }) => {
  const before = await pageChildKinds(kit);

  await openAddPanel(kit.page, 'Sticker');
  await kit.page.getByRole('button', { name: 'Unicorn' }).click();

  await expect
    .poll(async () => (await pageChildKinds(kit)).length)
    .toBe(before.length + 1);
  const added = await selectedBlock(kit);
  const fill = await kit.page.evaluate(
    ({ handle, id }) =>
      handle.engine.block.getString(
        handle.engine.block.getFill(id),
        'fill/image/imageFileURI'
      ),
    { handle: kit.editor, id: added }
  );
  expect(fill).toContain('ly.img.sticker');
});

test('MB-14 the sticker group filter narrows the list', async ({ kit }) => {
  await openAddPanel(kit.page, 'Sticker');
  const filter = kit.page.getByRole('combobox', { name: 'Sticker group' });

  // "All" leads, then the groups the source reports under the kit's own labels.
  await expect(filter.locator('option')).toHaveText([
    'All',
    'Emoji',
    'Emoticons',
    'Craft',
    '3D Grain',
    'Hands',
    'Doodle',
    'Florals'
  ]);

  const unicorn = kit.page.getByRole('button', { name: 'Unicorn' });
  const floral = kit.page.getByRole('button', {
    name: 'Floral 1',
    exact: true
  });
  await expect(unicorn).toBeVisible();
  await expect(floral).toBeVisible();

  await filter.selectOption({ label: 'Florals' });

  await expect(unicorn).toHaveCount(0);
  await expect(floral).toBeVisible();
});

test('MB-22 a click in the picker palette colours the text and the shape', async ({
  kit
}) => {
  for (const kind of ['shape', 'text']) {
    const block = await selectKind(kit, kind);
    const color = () =>
      kit.page.evaluate(
        ({ handle, id }) =>
          handle.engine.block.getColor(id, 'fill/solid/color'),
        { handle: kit.editor, id: block }
      );
    const before = await color();
    expect(before.r + before.g + before.b, kind).toBeGreaterThan(0.1);

    await kit.page.getByRole('button', { name: 'Color', exact: true }).click();
    const palette = kit.page.getByRole('slider', {
      name: 'Color',
      exact: true
    });
    const box = (await palette.boundingBox())!;
    // The bottom edge of the saturation and brightness area is black.
    await palette.click({ position: { x: box.width / 2, y: box.height - 1 } });

    await expect
      .poll(async () => {
        const { r, g, b } = await color();
        return Math.max(r, g, b);
      }, kind)
      .toBeLessThan(0.02);
    await kit.page.getByRole('button', { name: 'Collapse' }).click();
  }
});

test('MB-23 every sticker shows its thumbnail and can be added', async ({
  kit
}) => {
  test.setTimeout(5 * 60_000);
  // A sticker is known by its thumbnail: several share a label.
  const uriByThumbnail: Record<string, string> = await kit.page.evaluate(
    async (handle) =>
      Object.fromEntries(
        (
          await handle.engine.asset.findAssets('ly.img.sticker', {
            page: 0,
            perPage: 9999
          })
        ).assets.map((asset: { meta: { thumbUri: string; uri: string } }) => [
          asset.meta.thumbUri,
          asset.meta.uri
        ])
      ),
    kit.editor
  );
  const total = Object.keys(uriByThumbnail).length;
  expect(total).toBeGreaterThan(0);

  await openAddPanel(kit.page, 'Sticker');
  const cards = kit.page.locator('button:has(img)');
  await expect(cards).toHaveCount(total);
  const thumbnails = await cards.evaluateAll((buttons) =>
    buttons.map((button) => button.querySelector('img')!.getAttribute('src')!)
  );
  expect([...thumbnails].sort()).toEqual(Object.keys(uriByThumbnail).sort());
  await expect
    .poll(() =>
      cards.evaluateAll((buttons) =>
        buttons
          .filter((button) => {
            const image = button.querySelector('img')!;
            return !(image.complete && image.naturalWidth > 0);
          })
          .map((button) => button.getAttribute('aria-label'))
      )
    )
    .toEqual([]);

  // A card click adds its sticker, shown here with the first and the last card.
  const tapped = [thumbnails[0], thumbnails[thumbnails.length - 1]];
  for (const [index, thumbnail] of tapped.entries()) {
    if (index > 0) {
      await kit.page.evaluate(
        (handle) =>
          handle.engine.block
            .findAllSelected()
            .forEach((block: number) =>
              handle.engine.block.setSelected(block, false)
            ),
        kit.editor
      );
      await openAddPanel(kit.page, 'Sticker');
    }
    await kit.page.locator(`button:has(img[src="${thumbnail}"])`).click();
    await expect
      .poll(async () => {
        const block = await selectedBlock(kit);
        return block == null ? null : fillUri(kit, block);
      }, thumbnail)
      .toBe(uriByThumbnail[thumbnail]);
    // The panel closes once the kit shows the new sticker's bar.
    await expect(
      kit.page.getByRole('button', { name: 'Collapse' })
    ).toBeHidden();
  }

  // Every sticker then goes through the call a card click makes: the panel
  // closes after each add, and reopening it once per sticker outlasts CI.
  const failures: string[] = await kit.page.evaluate(async (handle) => {
    const { assets } = await handle.engine.asset.findAssets('ly.img.sticker', {
      page: 0,
      perPage: 9999
    });
    const added: { id: string; uri: string; block?: number }[] = [];
    for (const asset of assets) {
      added.push({
        id: asset.id,
        uri: asset.meta.uri,
        block: await handle.engine.asset.apply('ly.img.sticker', asset)
      });
    }
    const blocks = added.flatMap(({ block }) => (block == null ? [] : [block]));
    // It rejects on the first broken file; the state check names every one.
    await handle.engine.block.forceLoadResources(blocks).catch(() => {});
    return added.flatMap(({ id, uri, block }) => {
      if (block == null) {
        return [`${id}: no block`];
      }
      const kind = handle.engine.block.getKind(block);
      const fill = handle.engine.block.getString(
        handle.engine.block.getFill(block),
        'fill/image/imageFileURI'
      );
      const state = handle.engine.block.getState(block).type;
      return kind === 'sticker' && fill === uri && state === 'Ready'
        ? []
        : [`${id}: ${kind}, ${fill}, ${state}`];
    });
  }, kit.editor);
  expect(failures).toEqual([]);
  expect(
    (await pageChildKinds(kit)).filter((kind) => kind === 'sticker')
  ).toHaveLength(total + tapped.length);
});

import { expect, test } from '@imgly/kit-test-harness';
import type { Kit } from '@imgly/kit-test-harness';

import {
  openAddPanel,
  pageChildKinds,
  selectKind,
  selectedBlock
} from './mobile-ui';

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

import { expect, test } from '@imgly/kit-test-harness';
import type { Kit } from '@imgly/kit-test-harness';

import { canUndo, currentPage, selectFirstText } from './photobook';
import { mockUnsplash } from './unsplash';

test.beforeEach(async ({ page }) => {
  await mockUnsplash(page);
});

/** The six colours the kit hardcodes for the example photobook. */
const PALETTE = [
  '#dc1876ff',
  '#0027bcff',
  '#e2701dff',
  '#008625ff',
  '#7e18ceff',
  '#5bb1a7ff'
];

function solidColor(kit: Kit, block: number) {
  return kit.page.evaluate(
    ({ handle, id }) => handle.engine.block.getColor(id, 'fill/solid/color'),
    { handle: kit.editor, id: block }
  );
}

/** The block the theme uses as the page background. */
async function backgroundBlock(kit: Kit): Promise<number> {
  return kit.page.evaluate((handle) => {
    const walk = (block: number): number[] => {
      const children = handle.engine.block.getChildren(block);
      return [...children, ...children.flatMap(walk)];
    };
    const background = walk(handle.engine.scene.getCurrentPage()).find(
      (block: number) => handle.engine.block.getName(block) === 'BG Light'
    );
    if (background == null) {
      throw new Error('The page holds no BG Light block.');
    }
    return background;
  }, kit.editor);
}

test('PB-13 the colour bar offers the kit palette', async ({ kit }) => {
  await kit.page.getByRole('button', { name: 'Color', exact: true }).click();

  for (const swatch of PALETTE) {
    await expect(kit.page.getByRole('button', { name: swatch })).toBeVisible();
  }
  await expect(
    kit.page.getByRole('button', { name: 'Pick color' })
  ).toBeVisible();

  const page = await currentPage(kit);
  await kit.page.getByRole('button', { name: PALETTE[3] }).click();

  await expect
    .poll(() => solidColor(kit, page))
    .toEqual({
      r: expect.closeTo(0),
      g: expect.closeTo(0.525, 2),
      b: expect.closeTo(0.145, 2),
      a: expect.closeTo(1)
    });
});

test('PB-14 the picker writes the background colour', async ({ kit }) => {
  const page = await currentPage(kit);
  await kit.page.getByRole('button', { name: 'Color', exact: true }).click();
  await kit.page.getByRole('button', { name: 'Pick color' }).click();

  const hex = kit.page.getByRole('textbox').first();
  await hex.fill('#123456');
  await hex.press('Enter');

  await expect
    .poll(() => solidColor(kit, page))
    .toEqual({
      r: expect.closeTo(0.071, 2),
      g: expect.closeTo(0.204, 2),
      b: expect.closeTo(0.337, 2),
      a: expect.closeTo(1)
    });
});

test('PB-27 the text colour bar writes the text colour', async ({ kit }) => {
  const text = await selectFirstText(kit);
  await kit.page.getByRole('button', { name: 'Color', exact: true }).click();

  await kit.page.getByRole('button', { name: PALETTE[0] }).click();

  await expect
    .poll(() => solidColor(kit, text))
    .toEqual({
      r: expect.closeTo(0.862, 2),
      g: expect.closeTo(0.094, 2),
      b: expect.closeTo(0.463, 2),
      a: expect.closeTo(1)
    });
  await expect.poll(() => canUndo(kit)).toBe(true);
});

test('PB-28 the text colour picker ignores a malformed hex', async ({
  kit
}) => {
  const text = await selectFirstText(kit);
  const before = await solidColor(kit, text);

  await kit.page.getByRole('button', { name: 'Color', exact: true }).click();
  await kit.page.getByRole('button', { name: 'Pick color' }).click();

  const hex = kit.page.getByRole('textbox').first();
  await hex.fill('nothex');
  await hex.press('Enter');

  // `ColorSelect` drops a value `hexToRgba` cannot parse instead of writing it.
  expect(await solidColor(kit, text)).toEqual(before);
});

test('PB-30 undo and redo a background colour change', async ({ kit }) => {
  const page = await currentPage(kit);
  const background = await backgroundBlock(kit);
  const before = await solidColor(kit, page);

  await kit.page.getByRole('button', { name: 'Color', exact: true }).click();
  await kit.page.getByRole('button', { name: PALETTE[4] }).click();
  await expect.poll(() => solidColor(kit, page)).not.toEqual(before);
  const after = await solidColor(kit, page);

  // The bar suppresses per-change undo steps and emits one when it unmounts.
  await kit.page.getByRole('button', { name: 'Color', exact: true }).click();
  const undo = kit.page.getByRole('button', { name: 'Undo' });
  await expect(undo).toBeEnabled();
  await undo.click();
  await expect.poll(() => solidColor(kit, page)).toEqual(before);

  await kit.page.getByRole('button', { name: 'Redo' }).click();
  await expect.poll(() => solidColor(kit, page)).toEqual(after);

  // The undo did not take the page's own content with it.
  expect(
    await kit.page.evaluate(
      ({ handle, id }) => handle.engine.block.isValid(id),
      { handle: kit.editor, id: background }
    )
  ).toBe(true);
});

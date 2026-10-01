import { expect, test, type Kit } from '@imgly/kit-test-harness';
import { colorSwatch, undoButton } from './apparel';
import { mockUnsplash } from './unsplash';

test.beforeEach(async ({ page }) => {
  await mockUnsplash(page);
});

const selectedBlock = (kit: Kit): Promise<number> =>
  kit.page.evaluate(
    (handle) => handle.engine.block.findAllSelected()[0],
    kit.editor
  );

const solidColor = (kit: Kit, block: number) =>
  kit.page.evaluate(
    ({ handle, id }) => handle.engine.block.getColor(id, 'fill/solid/color'),
    { handle: kit.editor, id: block }
  );

async function addShape(kit: Kit): Promise<number> {
  await kit.page.getByRole('button', { name: 'Shape' }).click();
  await kit.page.getByRole('button', { name: 'Add shape 0' }).click();
  await expect
    .poll(() =>
      kit.page.evaluate(
        (handle) => handle.engine.block.findAllSelected().length,
        kit.editor
      )
    )
    .toBe(1);
  return selectedBlock(kit);
}

test('AP-15 add a shape', async ({ kit }) => {
  const block = await addShape(kit);
  const info = await kit.page.evaluate(
    ({ handle, id }) => {
      const engine = handle.engine;
      return {
        type: engine.block.getType(id),
        kind: engine.block.getKind(id),
        shape: engine.block.getType(engine.block.getShape(id)),
        parent: engine.block.getParent(id),
        page: engine.scene.getPages()[0]
      };
    },
    { handle: kit.editor, id: block }
  );
  expect(info.type).toBe('//ly.img.ubq/graphic');
  expect(info.kind).toBe('shape');
  expect(info.shape).toMatch(/^\/\/ly\.img\.ubq\/shape\//);
  expect(info.parent).toBe(info.page);
});

test('AP-15b only filled shapes are offered', async ({ kit }) => {
  const ids = await kit.page.evaluate(async (handle) => {
    const result = await handle.engine.asset.findAssets('ly.img.vector.shape', {
      page: 0,
      perPage: 999
    });
    return result.assets.map((asset: { id: string }) => asset.id);
  }, kit.editor);
  expect(ids.length).toBeGreaterThan(0);
  expect(
    ids.every((id: string) => id.startsWith('ly.img.vector.shape.filled.'))
  ).toBe(true);

  await kit.page.getByRole('button', { name: 'Shape' }).click();
  await expect(
    kit.page.getByRole('button', { name: /^Add shape/ })
  ).toHaveCount(ids.length);
});

test('AP-16 change the shape colour', async ({ kit }) => {
  const block = await addShape(kit);
  await kit.page.getByRole('button', { name: 'Color' }).click();

  await colorSwatch(kit.page, 4).click();
  const palette = await solidColor(kit, block);
  expect(palette.r).toBeCloseTo(0, 2);
  expect(palette.g).toBeCloseTo(0.847, 2);
  expect(palette.b).toBeCloseTo(0.643, 2);
  await expect(undoButton(kit.page)).toBeEnabled();

  await kit.page.getByRole('button', { name: 'Pick color' }).click();
  const hexInput = kit.page.getByRole('textbox');
  await hexInput.fill('112233');
  await hexInput.blur();
  await expect
    .poll(async () => {
      const color = await solidColor(kit, block);
      return Math.round(color.r * 255);
    })
    .toBe(0x11);

  // A malformed value is filtered out before it can reach the engine.
  await hexInput.fill('zzzzzz');
  await hexInput.blur();
  const after = await solidColor(kit, block);
  expect(Math.round(after.r * 255)).toBe(0x11);
});

test('AP-17 add a sticker', async ({ kit }) => {
  await kit.page.getByRole('button', { name: 'Sticker' }).click();
  await kit.page.getByRole('button', { name: 'Add sticker 0' }).click();
  await expect
    .poll(() =>
      kit.page.evaluate(
        (handle) => handle.engine.block.findAllSelected().length,
        kit.editor
      )
    )
    .toBe(1);

  const block = await selectedBlock(kit);
  const info = await kit.page.evaluate(
    ({ handle, id }) => {
      const engine = handle.engine;
      return {
        kind: engine.block.getKind(id),
        fill: engine.block.getType(engine.block.getFill(id))
      };
    },
    { handle: kit.editor, id: block }
  );
  expect(info.kind).toBe('sticker');
  expect(info.fill).toBe('//ly.img.ubq/fill/image');
});

test('AP-18 only emoticon stickers are offered', async ({ kit }) => {
  const stickers = await kit.page.evaluate(async (handle) => {
    const result = await handle.engine.asset.findAssets('ly.img.sticker', {
      page: 0,
      perPage: 9999
    });
    return result.assets.map((asset: { groups: string[] }) => asset.groups[0]);
  }, kit.editor);
  expect(stickers.length).toBeGreaterThan(0);
  expect(new Set(stickers)).toEqual(new Set(['emoticons']));

  await kit.page.getByRole('button', { name: 'Sticker' }).click();
  await expect(
    kit.page.getByRole('button', { name: /^Add sticker/ })
  ).toHaveCount(stickers.length);
});

test('AP-19 delete a block', async ({ kit }) => {
  const block = await addShape(kit);
  await kit.page.getByRole('button', { name: 'Delete' }).click();

  await expect
    .poll(() =>
      kit.page.evaluate(({ handle, id }) => handle.engine.block.isValid(id), {
        handle: kit.editor,
        id: block
      })
    )
    .toBe(false);
  await expect(undoButton(kit.page)).toBeEnabled();
});

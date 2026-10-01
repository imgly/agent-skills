import { expect, test } from '@imgly/kit-test-harness';
import type { JSHandle, Page } from '@playwright/test';
import type { KitEditor } from '@imgly/kit-test-harness';
import { colorSwatch, openTemplate, redoButton, undoButton } from './postcard';
import { mockUnsplash } from './unsplash';

test.beforeEach(async ({ page }) => {
  await mockUnsplash(page);
});

const selectedBlock = (
  page: Page,
  editor: JSHandle<KitEditor>
): Promise<number> =>
  page.evaluate((handle) => handle.engine.block.findAllSelected()[0], editor);

const solidColor = (page: Page, editor: JSHandle<KitEditor>, block: number) =>
  page.evaluate(
    ({ handle, id }) => handle.engine.block.getColor(id, 'fill/solid/color'),
    { handle: editor, id: block }
  );

async function addShape(
  page: Page,
  editor: JSHandle<KitEditor>
): Promise<number> {
  await page.getByRole('button', { name: 'Shape' }).click();
  await page.getByRole('button', { name: 'Add shape 0' }).click();
  await expect
    .poll(() =>
      page.evaluate(
        (handle) =>
          handle.engine.block.getKind(handle.engine.block.findAllSelected()[0]),
        editor
      )
    )
    .toBe('shape');
  return selectedBlock(page, editor);
}

test('PC-12 add a shape', async ({ page }) => {
  const editor = await openTemplate(page);
  const block = await addShape(page, editor);

  const info = await page.evaluate(
    ({ handle, id }) => {
      const engine = handle.engine;
      return {
        kind: engine.block.getKind(id),
        shape: engine.block.getType(engine.block.getShape(id)),
        parent: engine.block.getParent(id),
        front: engine.scene.getPages()[0]
      };
    },
    { handle: editor, id: block }
  );
  expect(info.kind).toBe('shape');
  expect(info.shape).toMatch(/^\/\/ly\.img\.ubq\/shape\//);
  expect(info.parent).toBe(info.front);

  const ids = await page.evaluate(async (handle) => {
    const result = await handle.engine.asset.findAssets('ly.img.vector.shape', {
      page: 0,
      perPage: 999
    });
    return result.assets.map((asset: { id: string }) => asset.id);
  }, editor);
  expect(
    ids.every((id: string) => id.startsWith('ly.img.vector.shape.filled.'))
  ).toBe(true);
});

test('PC-13 shape colour from the palette', async ({ page }) => {
  const editor = await openTemplate(page);
  const block = await addShape(page, editor);
  await page.getByRole('button', { name: 'Color' }).click();
  await colorSwatch(page, 2).click();

  const color = await solidColor(page, editor, block);
  expect(Math.round(color.r * 255)).toBe(0x76);
  expect(Math.round(color.g * 255)).toBe(0x1e);
  expect(Math.round(color.b * 255)).toBe(0x40);
  await expect(undoButton(page)).toBeEnabled();
});

test('PC-14 shape colour from the picker', async ({ page }) => {
  const editor = await openTemplate(page);
  const block = await addShape(page, editor);
  await page.getByRole('button', { name: 'Color' }).click();
  await page.getByRole('button', { name: 'Pick color' }).click();

  const hexInput = page.getByRole('textbox');
  await hexInput.fill('112233');
  await hexInput.blur();
  await expect
    .poll(async () =>
      Math.round((await solidColor(page, editor, block)).r * 255)
    )
    .toBe(0x11);
});

test('PC-15 add a sticker', async ({ page }) => {
  const editor = await openTemplate(page);
  await page.getByRole('button', { name: 'Sticker' }).click();
  await page.getByRole('button', { name: 'Add sticker 0' }).click();
  await expect
    .poll(() =>
      page.evaluate(
        (handle) =>
          handle.engine.block.getKind(handle.engine.block.findAllSelected()[0]),
        editor
      )
    )
    .toBe('sticker');

  const block = await selectedBlock(page, editor);
  const fill = await page.evaluate(
    ({ handle, id }) =>
      handle.engine.block.getType(handle.engine.block.getFill(id)),
    { handle: editor, id: block }
  );
  expect(fill).toBe('//ly.img.ubq/fill/image');

  const groups = await page.evaluate(async (handle) => {
    const result = await handle.engine.asset.findAssets('ly.img.sticker', {
      page: 0,
      perPage: 9999,
      groups: ['emoticons']
    });
    return result.assets.map((asset: { groups: string[] }) => asset.groups[0]);
  }, editor);
  expect(new Set(groups)).toEqual(new Set(['emoticons']));
});

test('PC-33 delete a block', async ({ page }) => {
  const editor = await openTemplate(page);
  const block = await addShape(page, editor);
  await page.getByRole('button', { name: 'Delete' }).click();

  await expect
    .poll(() =>
      page.evaluate(({ handle, id }) => handle.engine.block.isValid(id), {
        handle: editor,
        id: block
      })
    )
    .toBe(false);
  await expect(undoButton(page)).toBeEnabled();
});

test('PC-34 undo and redo an accent colour change', async ({ page }) => {
  const editor = await openTemplate(page);
  // Undo is already available on load: `PageSettingsContext` applies its own
  // accent, background, greeting colour and greeting size once the scene is
  // there, and each of those actions records an undo step (known issue 1).
  await expect(undoButton(page)).toBeEnabled();
  await expect(redoButton(page)).toBeDisabled();

  const accent = () =>
    page.evaluate((handle) => {
      const engine = handle.engine;
      const [block] = engine.block.findByName('Accent');
      return engine.block.getColor(block, 'fill/solid/color');
    }, editor);
  const before = await accent();

  await page.getByRole('button', { name: 'Accent' }).click();
  await colorSwatch(page, 4).click();
  await expect(undoButton(page)).toBeEnabled();
  const changed = await accent();
  expect(changed).not.toEqual(before);

  await undoButton(page).click();
  await expect.poll(accent).toEqual(before);
  await expect(redoButton(page)).toBeEnabled();

  await redoButton(page).click();
  await expect.poll(accent).toEqual(changed);
});

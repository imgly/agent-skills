import { expect, test } from '@imgly/kit-test-harness';
import type { Kit } from '@imgly/kit-test-harness';
import type { Page } from '@playwright/test';

import {
  PNG,
  imageState,
  pageImages,
  selectBlock,
  uploadFiles
} from './photobook';
import { FIXTURE_IMAGE, mockUnsplash } from './unsplash';

test.beforeEach(async ({ page }) => {
  await mockUnsplash(page);
});

/** The library thumbnails of the open Replace bar. */
const thumbnails = (page: Page) =>
  page.getByRole('button', { name: 'sample asset' });

/** Select an image whose placeholder the kit left switched on. */
async function selectPlaceholderImage(kit: Kit): Promise<number> {
  const images = await pageImages(kit);
  for (const image of images) {
    if ((await imageState(kit, image)).placeholder) {
      await selectBlock(kit, image);
      return image;
    }
  }
  throw new Error('The page holds no placeholder image.');
}

test('PB-02 the start-up pass keeps the intended placeholders', async ({
  kit
}) => {
  const images = await pageImages(kit);
  expect(images.length).toBeGreaterThan(0);

  const states = await Promise.all(
    images.map((image) => imageState(kit, image))
  );
  // The kit disables the placeholder of every image whose controls overlay is
  // off, so the two flags agree once the start-up pass has run.
  for (const state of states) {
    expect(state.placeholder, state.uri).toBe(state.overlay);
  }
  expect(states.some(({ overlay }) => overlay)).toBe(true);
});

test('PB-03 replace an image with a library one', async ({ kit }) => {
  const image = await selectPlaceholderImage(kit);
  const before = await imageState(kit, image);
  const images = await pageImages(kit);

  // A placeholder opens the Replace bar by itself.
  await expect(thumbnails(kit.page).first()).toBeVisible();
  await thumbnails(kit.page).first().click();

  await expect
    .poll(async () => (await imageState(kit, image)).uri)
    .not.toBe(before.uri);
  expect(await pageImages(kit)).toEqual(images);
});

test('PB-04 replace an image with an uploaded one', async ({ kit }) => {
  const image = await selectPlaceholderImage(kit);
  const before = await imageState(kit, image);

  await expect(kit.page.getByRole('button', { name: 'Upload' })).toBeVisible();
  await uploadFiles(kit.page, [
    { name: 'upload.png', mimeType: 'image/png', buffer: PNG }
  ]);

  await expect
    .poll(async () => (await imageState(kit, image)).uri)
    .not.toBe(before.uri);
  expect((await imageState(kit, image)).uri).toMatch(/^blob:/);
});

test('PB-05 replacing a placeholder enables cropping', async ({ kit }) => {
  const image = await selectPlaceholderImage(kit);
  // Crop is disabled while `placeholder/enabled` is on.
  await expect(kit.page.getByRole('button', { name: 'Crop' })).toBeDisabled();

  await thumbnails(kit.page).first().click();

  await expect
    .poll(async () => (await imageState(kit, image)).placeholder)
    .toBe(false);
  await expect(kit.page.getByRole('button', { name: 'Crop' })).toBeEnabled();
  // The engine's controls-overlay flag is not cleared with it.
  expect((await imageState(kit, image)).overlay).toBe(true);
});

test('PB-06 the same image can fill two blocks', async ({ kit }) => {
  const [first, second] = await pageImages(kit);

  for (const image of [first, second]) {
    await selectBlock(kit, image);
    // Only a placeholder opens the Replace bar by itself.
    if (!(await imageState(kit, image)).placeholder) {
      await kit.page.getByRole('button', { name: 'Replace' }).click();
    }
    await thumbnails(kit.page).first().click();
    await expect
      .poll(async () => (await imageState(kit, image)).uri)
      .toBe(FIXTURE_IMAGE);
  }

  expect(first).not.toBe(second);
  expect(await pageImages(kit)).toContain(first);
  expect(await pageImages(kit)).toContain(second);
});

test('PB-09 crop and confirm keeps the crop', async ({ kit }) => {
  const image = await selectPlaceholderImage(kit);
  // Crop is only offered once the block is no longer a placeholder.
  await thumbnails(kit.page).first().click();
  await expect
    .poll(async () => (await imageState(kit, image)).placeholder)
    .toBe(false);

  await kit.page.getByRole('button', { name: 'Crop' }).click();
  await expect.poll(() => editMode(kit)).toBe('Crop');

  await kit.page.evaluate(
    ({ handle, id }) => handle.engine.block.setCropScaleRatio(id, 2),
    { handle: kit.editor, id: image }
  );

  await kit.page.getByRole('button', { name: 'Done' }).click();

  await expect.poll(() => editMode(kit)).toBe('Transform');
  expect((await imageState(kit, image)).cropScale).toBeCloseTo(2);
});

test('PB-10 Reset returns the crop to its default', async ({ kit }) => {
  const image = await selectPlaceholderImage(kit);
  await thumbnails(kit.page).first().click();
  await expect
    .poll(async () => (await imageState(kit, image)).placeholder)
    .toBe(false);

  await kit.page.getByRole('button', { name: 'Crop' }).click();
  await kit.page.evaluate(
    ({ handle, id }) => handle.engine.block.setCropScaleRatio(id, 2),
    { handle: kit.editor, id: image }
  );
  expect((await imageState(kit, image)).cropScale).toBeCloseTo(2);

  await kit.page.getByRole('button', { name: 'Reset' }).click();

  await expect
    .poll(async () => (await imageState(kit, image)).cropScale)
    .toBeCloseTo(1);
});

function editMode(kit: Kit): Promise<string> {
  return kit.page.evaluate(
    (handle) => handle.engine.editor.getEditMode(),
    kit.editor
  );
}

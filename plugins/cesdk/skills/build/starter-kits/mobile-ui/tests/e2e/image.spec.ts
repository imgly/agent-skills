import { expect, test } from '@imgly/kit-test-harness';
import type { Kit } from '@imgly/kit-test-harness';

import {
  PNG,
  fillUri,
  openAddPanel,
  pageChildKinds,
  selectKind,
  selectedBlock,
  uploadFiles
} from './mobile-ui';

/** The library thumbnails of the open image panel, named by their asset. */
const thumbnails = (kit: Kit) =>
  kit.page.getByRole('button', {
    name: 'Clear blue beach at an island from above'
  });

function cropState(kit: Kit, block: number) {
  return kit.page.evaluate(
    ({ handle, id }) => ({
      scale: handle.engine.block.getCropScaleRatio(id),
      rotation: handle.engine.block.getFloat(id, 'crop/rotation'),
      editMode: handle.engine.editor.getEditMode()
    }),
    { handle: kit.editor, id: block }
  );
}

test('MB-07 add a pre-loaded image', async ({ kit }) => {
  const before = await pageChildKinds(kit);

  await openAddPanel(kit.page, 'Image');
  await thumbnails(kit).click();

  await expect
    .poll(async () => (await pageChildKinds(kit)).length)
    .toBe(before.length + 1);
  const added = await selectedBlock(kit);
  expect(await fillUri(kit, added)).toContain('ly.img.image');
});

test('MB-08 upload an image and apply it', async ({ kit }) => {
  const before = await pageChildKinds(kit);

  await openAddPanel(kit.page, 'Image');
  await uploadFiles(kit.page, [
    { name: 'upload.png', mimeType: 'image/png', buffer: PNG }
  ]);

  await expect
    .poll(async () => (await pageChildKinds(kit)).length)
    .toBe(before.length + 1);
  expect(await fillUri(kit, await selectedBlock(kit))).toMatch(/^blob:/);

  // Known issue 3: the kit registers `ly.img.image.upload` and never writes to it.
  const uploads = await kit.page.evaluate(async (handle) => {
    const result = await handle.engine.asset.findAssets('ly.img.image.upload', {
      page: 0,
      perPage: 9999
    });
    return result.assets.length;
  }, kit.editor);
  expect(uploads).toBe(0);
});

test('MB-09 replacing an image keeps the block and resets the crop', async ({
  kit
}) => {
  const block = await selectKind(kit, 'image');
  const before = await fillUri(kit, block);
  const children = (await pageChildKinds(kit)).length;

  await kit.page.getByRole('button', { name: 'Replace' }).click();
  await thumbnails(kit).click();

  await expect.poll(() => fillUri(kit, block)).not.toBe(before);
  expect((await pageChildKinds(kit)).length).toBe(children);
  expect((await cropState(kit, block)).scale).toBeCloseTo(1);
  // Applying from the library closes the panel again.
  await expect(thumbnails(kit)).toHaveCount(0);
});

test('MB-10 the crop panel scales, straightens and resets', async ({ kit }) => {
  const block = await selectKind(kit, 'image');

  await kit.page.getByRole('button', { name: 'Crop' }).click();
  await expect
    .poll(async () => (await cropState(kit, block)).editMode)
    .toBe('Crop');

  const scale = kit.page.getByRole('slider', { name: 'Scale' });
  await scale.focus();
  for (let step = 0; step < 5; step += 1) {
    await scale.press('ArrowRight');
  }
  await expect
    .poll(async () => (await cropState(kit, block)).scale)
    .toBeGreaterThan(1);

  const straighten = kit.page.getByRole('slider', { name: 'Straighten' });
  await straighten.focus();
  for (let step = 0; step < 5; step += 1) {
    await straighten.press('ArrowRight');
  }
  await expect
    .poll(async () => (await cropState(kit, block)).rotation)
    .not.toBe(0);

  await kit.page.getByRole('button', { name: 'Reset' }).click();
  await expect
    .poll(async () => (await cropState(kit, block)).rotation)
    .toBeCloseTo(0);

  await kit.page.getByRole('button', { name: 'Done' }).click();
  await expect
    .poll(async () => (await cropState(kit, block)).editMode)
    .toBe('Transform');
});

import {
  download,
  exportCalls,
  expect,
  jpegSize,
  spyExport,
  test
} from '@imgly/kit-test-harness';

import {
  dragSlider,
  pageEffectTypes,
  pageFillURI,
  pageFloat,
  slider,
  tab
} from './photo-ui';

const ADJUSTMENTS_EFFECT = '//ly.img.ubq/effect/adjustments';
const LUT_EFFECT = '//ly.img.ubq/effect/lut_filter';

/** Brighten the photo, so the kit sees an undoable change. */
async function editThePhoto(kit: Parameters<typeof pageFillURI>[0]) {
  await tab(kit.page, 'Adjust').click();
  await dragSlider(kit.page, slider(kit.page, '0'), 30);
  await expect
    .poll(async () => (await pageEffectTypes(kit)).includes(ADJUSTMENTS_EFFECT))
    .toBe(true);
}

test('PH-12 cancelling a photo swap keeps the photo and the edit', async ({
  kit
}) => {
  await editThePhoto(kit);
  const before = await pageFillURI(kit);

  await kit.page.getByRole('button', { name: 'Image 2' }).click();
  await kit.page.getByRole('button', { name: 'Cancel' }).click();

  await expect(kit.page.getByText('Unsaved Changes')).toHaveCount(0);
  expect(await pageFillURI(kit)).toBe(before);
  expect(await pageEffectTypes(kit)).toContain(ADJUSTMENTS_EFFECT);
});

test('PH-13 discarding the changes rebuilds the scene on the new photo', async ({
  kit
}) => {
  await editThePhoto(kit);

  await kit.page.getByRole('button', { name: 'Image 2' }).click();
  await kit.page.getByRole('button', { name: 'Discard Changes' }).click();

  await expect.poll(() => pageFillURI(kit)).toMatch(/dog\.jpg$/);
  expect(await pageEffectTypes(kit)).toEqual([]);
});

test('PH-14 keeping the changes carries the effects onto the new photo', async ({
  kit
}) => {
  await editThePhoto(kit);
  await tab(kit.page, 'Filter').click();
  await kit.page.getByRole('button', { name: 'ad1920 1920 A.D.' }).click();
  await expect
    .poll(async () => (await pageEffectTypes(kit)).includes(LUT_EFFECT))
    .toBe(true);

  await kit.page.getByRole('button', { name: 'Image 2' }).click();
  await kit.page.getByRole('button', { name: 'Apply Changes' }).click();

  await expect.poll(() => pageFillURI(kit)).toMatch(/dog\.jpg$/);
  const types = await pageEffectTypes(kit);
  expect(types).toContain(ADJUSTMENTS_EFFECT);
  expect(types).toContain(LUT_EFFECT);

  // `setImageSource` resets the crop and resizes the page to the new photo.
  const crop = await kit.page.evaluate((handle) => {
    const [page] = handle.engine.block.findByType('page');
    return handle.engine.block.getFloat(page, 'crop/rotation');
  }, kit.editor);
  expect(crop).toBe(0);
});

test('PH-14b keeping the changes starts the new photo uncropped at its own size', async ({
  kit
}) => {
  await tab(kit.page, 'Crop').click();
  await dragSlider(kit.page, slider(kit.page, '0°'), 8);
  await kit.page.getByRole('button', { name: 'Scale' }).click();
  await dragSlider(kit.page, slider(kit.page, /%$/), 20);
  await expect.poll(() => pageFloat(kit, 'crop/rotation')).not.toBe(0);
  await expect.poll(() => pageFloat(kit, 'crop/scaleRatio')).toBeGreaterThan(1);

  await kit.page.getByRole('button', { name: 'Image 2' }).click();
  await kit.page.getByRole('button', { name: 'Apply Changes' }).click();
  await expect.poll(() => pageFillURI(kit)).toMatch(/dog\.jpg$/);

  const photo = await kit.page.evaluate(
    async (uri) => {
      const image = new Image();
      image.src = uri;
      await image.decode();
      return { width: image.naturalWidth, height: image.naturalHeight };
    },
    await pageFillURI(kit)
  );
  const page = await kit.page.evaluate((handle) => {
    const engine = handle.engine;
    const [block] = engine.block.findByType('page');
    return {
      width: engine.block.getWidth(block),
      height: engine.block.getHeight(block),
      rotation: engine.block.getFloat(block, 'crop/rotation'),
      scaleRatio: engine.block.getFloat(block, 'crop/scaleRatio'),
      scaleX: engine.block.getFloat(block, 'crop/scaleX'),
      scaleY: engine.block.getFloat(block, 'crop/scaleY'),
      translationX: engine.block.getFloat(block, 'crop/translationX'),
      translationY: engine.block.getFloat(block, 'crop/translationY')
    };
  }, kit.editor);
  expect({ width: page.width, height: page.height }).toEqual(photo);
  expect(page.rotation).toBeCloseTo(0, 5);
  expect(page.scaleRatio).toBeCloseTo(1, 5);
  expect(page.scaleX).toBeCloseTo(1, 5);
  expect(page.scaleY).toBeCloseTo(1, 5);
  expect(page.translationX).toBeCloseTo(0, 5);
  expect(page.translationY).toBeCloseTo(0, 5);
});

test('PH-15 a clean swap needs no confirmation', async ({ kit }) => {
  await kit.page.getByRole('button', { name: 'Image 2' }).click();

  await expect(kit.page.getByText('Unsaved Changes')).toHaveCount(0);
  await expect.poll(() => pageFillURI(kit)).toMatch(/dog\.jpg$/);
});

test('PH-16 export writes a JPEG at the page size', async ({ kit }) => {
  await spyExport(kit.page);

  const size = await kit.page.evaluate((handle) => {
    const [page] = handle.engine.block.findByType('page');
    return {
      width: Math.round(handle.engine.block.getWidth(page)),
      height: Math.round(handle.engine.block.getHeight(page))
    };
  }, kit.editor);

  const files = await download(
    kit.page,
    () => kit.page.getByRole('button', { name: 'Export Image' }).click(),
    1
  );

  const calls = await exportCalls(kit.page);
  expect(calls).toHaveLength(1);
  expect(calls[0].options).toEqual({ mimeType: 'image/jpeg' });

  expect(jpegSize(files[0].buffer)).toEqual(size);
  // The kit sets no extension; the browser derives `.jpeg` from the blob type.
  expect(files[0].name).toBe('my-photo.jpeg');
});

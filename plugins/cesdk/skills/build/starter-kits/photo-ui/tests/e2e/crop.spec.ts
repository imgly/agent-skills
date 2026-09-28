import { expect, test } from '@imgly/kit-test-harness';

import {
  dragSlider,
  pageFloat,
  resetButton,
  slider,
  spyEngine,
  tab
} from './photo-ui';

const RADIANS_PER_DEGREE = Math.PI / 180;

test.beforeEach(async ({ kit }) => {
  await tab(kit.page, 'Crop').click();
  await expect(
    kit.page.getByRole('button', { name: 'Straighten' })
  ).toBeVisible();
});

test('PH-02 the crop mask follows the straighten slider', async ({ kit }) => {
  const calls = await spyEngine(kit, [
    'block.setFloat',
    'block.adjustCropToFillFrame',
    'editor.addUndoStep'
  ]);

  await dragSlider(kit.page, slider(kit.page, '0°'), 5);

  await expect(slider(kit.page, /^-?\d+°$/)).toHaveText('5°');
  expect(await pageFloat(kit, 'crop/rotation')).toBeCloseTo(
    5 * RADIANS_PER_DEGREE,
    4
  );

  const recorded = await calls();
  const rotations = recorded.filter(
    (call) =>
      call.method === 'block.setFloat' && call.args[1] === 'crop/rotation'
  );
  expect(rotations.length).toBeGreaterThan(0);
  expect(
    recorded.filter((call) => call.method === 'block.adjustCropToFillFrame')
      .length
  ).toBe(rotations.length);
  // One undo step per written value, plus one when the drag stops: the kit's
  // `useProperty` commits on every change, so a drag is not one undo step.
  expect(
    recorded.filter((call) => call.method === 'editor.addUndoStep')
  ).toHaveLength(rotations.length + 1);
});

test('PH-03 straighten stays inside -44 and 45 degrees', async ({ kit }) => {
  await dragSlider(kit.page, slider(kit.page, '0°'), 200);
  await expect(slider(kit.page, /°$/)).toHaveText('45°');

  await dragSlider(kit.page, slider(kit.page, '45°'), -200);
  await expect(slider(kit.page, /°$/)).toHaveText('-44°');
});

test('PH-04 scale writes a crop scale ratio and refills the frame', async ({
  kit
}) => {
  await kit.page.getByRole('button', { name: 'Scale' }).click();
  await expect(slider(kit.page, /%$/)).toBeVisible();

  const calls = await spyEngine(kit, [
    'block.setCropScaleRatio',
    'block.getCropScaleRatio',
    'block.adjustCropToFillFrame'
  ]);

  await dragSlider(kit.page, slider(kit.page, '0%'), 20);

  const recorded = await calls();
  const written = recorded.filter(
    (call) => call.method === 'block.setCropScaleRatio'
  );
  expect(written.length).toBeGreaterThan(0);
  for (const call of written) {
    expect(Number.isFinite(call.args[1] as number)).toBe(true);
    expect(call.args[1] as number).toBeGreaterThan(0);
  }
  expect(
    recorded.filter((call) => call.method === 'block.getCropScaleRatio').length
  ).toBeGreaterThan(0);
  expect(
    recorded.filter((call) => call.method === 'block.adjustCropToFillFrame')
      .length
  ).toBeGreaterThan(0);

  expect(await pageFloat(kit, 'crop/scaleRatio')).toBeGreaterThan(1);
});

test('PH-05 flip mirrors the crop once per click', async ({ kit }) => {
  const calls = await spyEngine(kit, [
    'block.flipCropHorizontal',
    'editor.addUndoStep'
  ]);

  await kit.page.getByRole('button', { name: 'Flip the image' }).click();

  const recorded = await calls();
  expect(
    recorded.filter((call) => call.method === 'block.flipCropHorizontal')
  ).toHaveLength(1);
  expect(
    recorded.filter((call) => call.method === 'editor.addUndoStep')
  ).toHaveLength(1);
});

test('PH-06 four rotations bring the crop back to where it started', async ({
  kit
}) => {
  const rotate = kit.page.getByRole('button', {
    name: 'Rotate the image counterclockwise'
  });

  const before = await pageFloat(kit, 'crop/rotation');
  for (let click = 0; click < 4; click++) {
    const previous = await pageFloat(kit, 'crop/rotation');
    await rotate.click();
    await expect.poll(() => pageFloat(kit, 'crop/rotation')).not.toBe(previous);
  }
  const after = await pageFloat(kit, 'crop/rotation');

  expect(
    Math.abs(Math.round((after - before) / RADIANS_PER_DEGREE) % 360)
  ).toBe(0);
});

test('PH-07 reset restores the photo size and clears the rotation', async ({
  kit
}) => {
  const size = await kit.page.evaluate((handle) => {
    const [page] = handle.engine.block.findByType('page');
    return {
      width: handle.engine.block.getWidth(page),
      height: handle.engine.block.getHeight(page)
    };
  }, kit.editor);

  await dragSlider(kit.page, slider(kit.page, '0°'), 8);
  expect(await pageFloat(kit, 'crop/rotation')).not.toBe(0);

  const calls = await spyEngine(kit, ['block.resetCrop']);
  await resetButton(kit.page).click();

  await expect.poll(() => pageFloat(kit, 'crop/rotation')).toBeCloseTo(0, 5);
  const after = await kit.page.evaluate((handle) => {
    const [page] = handle.engine.block.findByType('page');
    return {
      width: handle.engine.block.getWidth(page),
      height: handle.engine.block.getHeight(page)
    };
  }, kit.editor);
  expect(after).toEqual(size);
  expect(
    (await calls()).filter((call) => call.method === 'block.resetCrop').length
  ).toBeGreaterThan(0);
});

import { expect, test } from '@imgly/kit-test-harness';

import {
  dragSlider,
  effectFloat,
  pageEffectTypes,
  resetButton,
  slider,
  tab
} from './photo-ui';

const ADJUSTMENTS_EFFECT = '//ly.img.ubq/effect/adjustments';
const LUT_EFFECT = '//ly.img.ubq/effect/lut_filter';

test('PH-08 the adjust bar writes one adjustments effect', async ({ kit }) => {
  await tab(kit.page, 'Adjust').click();
  await expect(
    kit.page.getByRole('button', { name: 'Brightness' })
  ).toBeVisible();

  await dragSlider(kit.page, slider(kit.page, '0'), 30);
  const brightness = await effectFloat(
    kit,
    ADJUSTMENTS_EFFECT,
    'adjustments/brightness'
  );
  expect(brightness).toBeGreaterThan(0);
  expect(brightness).toBeLessThanOrEqual(1);

  await kit.page.getByRole('button', { name: 'Contrast' }).click();
  await dragSlider(kit.page, slider(kit.page, '0'), -20);
  const contrast = await effectFloat(
    kit,
    ADJUSTMENTS_EFFECT,
    'adjustments/contrast'
  );
  expect(contrast).toBeLessThan(0);
  expect(contrast).toBeGreaterThanOrEqual(-1);

  const types = await pageEffectTypes(kit);
  expect(types.filter((type) => type === ADJUSTMENTS_EFFECT)).toHaveLength(1);
});

test('PH-09 reset clears one adjustment, not the whole effect', async ({
  kit
}) => {
  await tab(kit.page, 'Adjust').click();
  await dragSlider(kit.page, slider(kit.page, '0'), 30);
  await kit.page.getByRole('button', { name: 'Contrast' }).click();
  await dragSlider(kit.page, slider(kit.page, '0'), 20);

  const contrastBefore = await effectFloat(
    kit,
    ADJUSTMENTS_EFFECT,
    'adjustments/contrast'
  );
  expect(contrastBefore).toBeGreaterThan(0);

  await kit.page.getByRole('button', { name: 'Brightness' }).click();
  await resetButton(kit.page).click();

  await expect
    .poll(() => effectFloat(kit, ADJUSTMENTS_EFFECT, 'adjustments/brightness'))
    .toBe(0);
  expect(
    await effectFloat(kit, ADJUSTMENTS_EFFECT, 'adjustments/contrast')
  ).toBeCloseTo(contrastBefore, 5);
});

test('PH-10 a filter writes one LUT effect from its manifest entry', async ({
  kit
}) => {
  await tab(kit.page, 'Filter').click();
  const filter = kit.page.getByRole('button', { name: 'ad1920 1920 A.D.' });
  await filter.click();

  const types = await pageEffectTypes(kit);
  expect(types.filter((type) => type === LUT_EFFECT)).toHaveLength(1);

  const lut = await kit.page.evaluate((handle) => {
    const [page] = handle.engine.block.findByType('page');
    const effect = handle.engine.block
      .getEffects(page)
      .find(
        (candidate: number) =>
          handle.engine.block.getString(candidate, 'type') ===
          '//ly.img.ubq/effect/lut_filter'
      );
    return {
      uri: handle.engine.block.getString(
        effect,
        'effect/lut_filter/lutFileURI'
      ),
      horizontal: handle.engine.block.getInt(
        effect,
        'effect/lut_filter/horizontalTileCount'
      ),
      vertical: handle.engine.block.getInt(
        effect,
        'effect/lut_filter/verticalTileCount'
      ),
      intensity: handle.engine.block.getFloat(
        effect,
        'effect/lut_filter/intensity'
      )
    };
  }, kit.editor);

  expect(lut.uri).toContain('imgly_lut_ad1920_5_5_128.png');
  expect(lut.horizontal).toBe(5);
  expect(lut.vertical).toBe(5);
  expect(lut.intensity).toBe(1);
});

test('PH-11 reset restores the intensity and None removes the filter', async ({
  kit
}) => {
  await tab(kit.page, 'Filter').click();
  await kit.page.getByRole('button', { name: 'ad1920 1920 A.D.' }).click();

  await dragSlider(kit.page, slider(kit.page, '100'), -40);
  expect(
    await effectFloat(kit, LUT_EFFECT, 'effect/lut_filter/intensity')
  ).toBeLessThan(1);

  await resetButton(kit.page).click();
  await expect
    .poll(() => effectFloat(kit, LUT_EFFECT, 'effect/lut_filter/intensity'))
    .toBe(1);

  await kit.page.getByRole('button', { name: 'none None' }).click();
  await expect
    .poll(async () =>
      (await pageEffectTypes(kit)).filter((type) => type === LUT_EFFECT)
    )
    .toEqual([]);
});

test('PH-11b clicking None a second time does nothing', async ({ kit }) => {
  await tab(kit.page, 'Filter').click();
  const none = kit.page.getByRole('button', { name: 'none None' });
  await none.click();
  await none.click();

  expect(await pageEffectTypes(kit)).toEqual([]);
});

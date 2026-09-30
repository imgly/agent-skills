import { expect, test } from '@imgly/kit-test-harness';
import type { JSHandle, Page } from '@playwright/test';
import type { KitEditor } from '@imgly/kit-test-harness';
import { POSTCARD_TEMPLATES } from '@/imgly/postcard-catalog';
import { colorSwatch, openTemplate } from './postcard';
import { mockUnsplash } from './unsplash';

const THANK_YOU = POSTCARD_TEMPLATES.thank_you;

test.beforeEach(async ({ page }) => {
  await mockUnsplash(page);
});

function colorsOfNamed(
  page: Page,
  editor: JSHandle<KitEditor>,
  name: string
): Promise<{ r: number; g: number; b: number; a: number }[]> {
  return page.evaluate(
    ({ handle, blockName }) => {
      const engine = handle.engine;
      return engine.block
        .findByName(blockName)
        .map((id: number) => engine.block.getColor(id, 'fill/solid/color'));
    },
    { handle: editor, blockName: name }
  );
}

function expectHex(
  color: { r: number; g: number; b: number; a: number },
  hex: string
): void {
  const [r, g, b] = [1, 3, 5].map((at) => parseInt(hex.slice(at, at + 2), 16));
  expect(Math.round(color.r * 255)).toBe(r);
  expect(Math.round(color.g * 255)).toBe(g);
  expect(Math.round(color.b * 255)).toBe(b);
  expect(color.a).toBe(1);
}

test('PC-03 accent colour from the template palette', async ({ page }) => {
  const editor = await openTemplate(page);
  await page.getByRole('button', { name: 'Accent' }).click();
  // The palette is exactly the template's five colours plus the picker.
  await expect(
    page.getByRole('button', { name: 'Pick color' }).locator('xpath=..')
  ).toBeVisible();

  await colorSwatch(page, 2).click();

  const accents = await colorsOfNamed(page, editor, 'Accent');
  expect(accents.length).toBeGreaterThan(1);
  for (const color of accents) {
    expectHex(color, THANK_YOU.colors[2]);
  }

  const strokes = await page.evaluate((handle) => {
    const engine = handle.engine;
    return engine.block
      .findByName('Accent')
      .filter((id: number) => engine.block.supportsStroke(id))
      .map((id: number) => engine.block.getStrokeColor(id));
  }, editor);
  for (const stroke of strokes) {
    expectHex(stroke, THANK_YOU.colors[2]);
  }
});

test('PC-04 accent colour from the picker', async ({ page }) => {
  const editor = await openTemplate(page);
  await page.getByRole('button', { name: 'Accent' }).click();
  await page.getByRole('button', { name: 'Pick color' }).click();

  const hexInput = page.getByRole('textbox');
  await hexInput.fill('112233');
  await hexInput.blur();
  await expect
    .poll(async () => (await colorsOfNamed(page, editor, 'Accent'))[0].r)
    .toBeCloseTo(0x11 / 255, 2);

  // A malformed value is filtered out before it can reach the action.
  await hexInput.fill('zzzzzz');
  await hexInput.blur();
  expectHex((await colorsOfNamed(page, editor, 'Accent'))[0], '#112233');
});

test('PC-05 background colour from the template palette', async ({ page }) => {
  const editor = await openTemplate(page);
  await page.getByRole('button', { name: 'Background' }).click();
  await colorSwatch(page, 3).click();

  const backgrounds = await colorsOfNamed(page, editor, 'Background');
  expect(backgrounds.length).toBeGreaterThan(0);
  for (const color of backgrounds) {
    expectHex(color, THANK_YOU.colors[3]);
  }
});

test('PC-06 background colour from the picker', async ({ page }) => {
  const editor = await openTemplate(page);
  await page.getByRole('button', { name: 'Background' }).click();
  await page.getByRole('button', { name: 'Pick color' }).click();

  const hexInput = page.getByRole('textbox');
  await hexInput.fill('445566');
  await hexInput.blur();

  await expect
    .poll(async () => (await colorsOfNamed(page, editor, 'Background'))[0].r)
    .toBeCloseTo(0x44 / 255, 2);
});

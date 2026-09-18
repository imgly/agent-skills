import { expect, test } from '@imgly/kit-test-harness';
import type { JSHandle, Page } from '@playwright/test';
import type { KitEditor } from '@imgly/kit-test-harness';
import {
  colorSwatch,
  enterTextMode,
  openTemplate,
  undoButton
} from './postcard';
import { mockUnsplash } from './unsplash';

test.beforeEach(async ({ page }) => {
  await mockUnsplash(page);
});

/** Open a template and switch to the Write step. */
async function openWriteStep(page: Page): Promise<JSHandle<KitEditor>> {
  const editor = await openTemplate(page);
  await page.getByRole('button', { name: 'Write' }).click();
  await expect(page.getByRole('button', { name: 'Size' })).toBeVisible();
  return editor;
}

const namedBlock = (
  page: Page,
  editor: JSHandle<KitEditor>,
  name: string
): Promise<number> =>
  page.evaluate(
    ({ handle, blockName }) => handle.engine.block.findByName(blockName)[0],
    { handle: editor, blockName: name }
  );

const textOf = (
  page: Page,
  editor: JSHandle<KitEditor>,
  block: number
): Promise<string> =>
  page.evaluate(
    ({ handle, id }) => handle.engine.block.getString(id, 'text/text'),
    { handle: editor, id: block }
  );

test('PC-22 edit the postcard text on the Write page', async ({ page }) => {
  const editor = await openWriteStep(page);

  await expect
    .poll(() =>
      page.evaluate((handle) => {
        const engine = handle.engine;
        return engine.scene
          .getPages()
          .map((id: number) => engine.block.isVisible(id));
      }, editor)
    )
    .toEqual([false, true]);
  await expect(page.getByRole('button', { name: 'Text' })).toHaveCount(0);

  const greeting = await namedBlock(page, editor, 'Greeting');
  await enterTextMode(page, editor, greeting);
  await page.keyboard.press('ControlOrMeta+a');
  await page.keyboard.type('Hello there', { delay: 40 });
  await expect.poll(() => textOf(page, editor, greeting)).toBe('Hello there');
});

test('PC-23 emoji on the Write page', async ({ page }) => {
  const editor = await openWriteStep(page);
  const greeting = await namedBlock(page, editor, 'Greeting');
  await enterTextMode(page, editor, greeting);
  await page.keyboard.press('ControlOrMeta+a');
  await page.keyboard.insertText('\u{1F339}');
  await expect.poll(() => textOf(page, editor, greeting)).toBe('\u{1F339}');
});

test('PC-24 change the greeting font', async ({ page }) => {
  const editor = await openWriteStep(page);
  const greeting = await namedBlock(page, editor, 'Greeting');

  await page.getByRole('button', { name: 'Font' }).click();
  await page.getByRole('button', { name: 'Parisienne' }).click();

  await expect
    .poll(() =>
      page.evaluate(
        ({ handle, id }) => handle.engine.block.getTypeface(id).name,
        { handle: editor, id: greeting }
      )
    )
    .toBe('Parisienne');
  const state = await page.evaluate(
    ({ handle, id }) => ({
      editMode: handle.engine.editor.getEditMode(),
      weight: handle.engine.block.getTextFontWeights(id)[0],
      style: handle.engine.block.getTextFontStyles(id)[0]
    }),
    { handle: editor, id: greeting }
  );
  expect(state.editMode).toBe('Transform');
  expect(state.weight).toBe('normal');
  expect(state.style).toBe('normal');
  await expect(undoButton(page)).toBeEnabled();
});

test('PC-25 greeting colour from the palette', async ({ page }) => {
  const editor = await openWriteStep(page);
  const greeting = await namedBlock(page, editor, 'Greeting');

  // Pinned behaviour: the Write toolbar's palette is the kit's hardcoded blue
  // ramp, not the template's five colours (known issue 1).
  const loaded = await page.evaluate(
    ({ handle, id }) => handle.engine.block.getColor(id, 'fill/solid/color'),
    { handle: editor, id: greeting }
  );
  expect(Math.round(loaded.r * 255)).toBe(0x26);
  expect(Math.round(loaded.g * 255)).toBe(0x3b);
  expect(Math.round(loaded.b * 255)).toBe(0xaa);

  await page.getByRole('button', { name: 'Color' }).click();
  await colorSwatch(page, 2).click();

  await expect
    .poll(async () =>
      Math.round(
        (
          await page.evaluate(
            ({ handle, id }) =>
              handle.engine.block.getColor(id, 'fill/solid/color'),
            { handle: editor, id: greeting }
          )
        ).b * 255
      )
    )
    .toBe(0x46);
});

test('PC-26 greeting colour from the picker', async ({ page }) => {
  const editor = await openWriteStep(page);
  const greeting = await namedBlock(page, editor, 'Greeting');

  await page.getByRole('button', { name: 'Color' }).click();
  await page.getByRole('button', { name: 'Pick color' }).click();
  const hexInput = page.getByRole('textbox');
  await hexInput.fill('445566');
  await hexInput.blur();

  await expect
    .poll(async () =>
      Math.round(
        (
          await page.evaluate(
            ({ handle, id }) =>
              handle.engine.block.getColor(id, 'fill/solid/color'),
            { handle: editor, id: greeting }
          )
        ).r * 255
      )
    )
    .toBe(0x44);
});

test('PC-27 change the greeting size', async ({ page }) => {
  const editor = await openWriteStep(page);
  const greeting = await namedBlock(page, editor, 'Greeting');
  const fontSize = () =>
    page.evaluate(
      ({ handle, id }) => handle.engine.block.getFloat(id, 'text/fontSize'),
      { handle: editor, id: greeting }
    );

  // Pinned behaviour: the context applies its own default of 22 on load.
  expect(await fontSize()).toBe(22);

  await page.getByRole('button', { name: 'Size' }).click();
  await page.getByRole('button', { name: 'S', exact: true }).click();
  await expect.poll(fontSize).toBe(14);

  await page.getByRole('button', { name: 'Size' }).click();
  await page.getByRole('button', { name: 'L', exact: true }).click();
  await expect.poll(fontSize).toBe(22);
});

test('PC-28 the size dropdown marks the chosen option', async ({ page }) => {
  await openWriteStep(page);
  await page.getByRole('button', { name: 'Size' }).click();
  for (const label of ['S', 'M', 'L']) {
    await expect(
      page.getByRole('button', { name: label, exact: true })
    ).toBeVisible();
  }

  await page.getByRole('button', { name: 'M', exact: true }).click();
  await page.getByRole('button', { name: 'Size' }).click();
  // The trigger keeps its static "Size" label; only the list marks the choice.
  await expect(
    page.getByRole('button', { name: 'M', exact: true })
  ).toHaveClass(/item--active/);
  await expect(
    page.getByRole('button', { name: 'S', exact: true })
  ).not.toHaveClass(/item--active/);
});

test('PC-29 edit the address text', async ({ page }) => {
  const editor = await openWriteStep(page);
  const street = await namedBlock(page, editor, 'Street');

  await enterTextMode(page, editor, street);
  await page.keyboard.press('ControlOrMeta+a');
  await page.keyboard.type('12 Rue Test', { delay: 40 });
  await expect.poll(() => textOf(page, editor, street)).toBe('12 Rue Test');

  // The toolbar addresses the Greeting block only, so it is untouched.
  const greeting = await namedBlock(page, editor, 'Greeting');
  expect(await textOf(page, editor, greeting)).not.toBe('12 Rue Test');
});

test('PC-30 emoji in the address text', async ({ page }) => {
  const editor = await openWriteStep(page);
  const town = await namedBlock(page, editor, 'Town');

  await enterTextMode(page, editor, town);
  await page.keyboard.press('ControlOrMeta+a');
  await page.keyboard.insertText('\u{1F339}');
  await expect.poll(() => textOf(page, editor, town)).toBe('\u{1F339}');
});

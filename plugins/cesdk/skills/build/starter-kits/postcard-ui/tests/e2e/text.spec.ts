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

const textOf = (
  page: Page,
  editor: JSHandle<KitEditor>,
  block: number
): Promise<string> =>
  page.evaluate(
    ({ handle, id }) => handle.engine.block.getString(id, 'text/text'),
    { handle: editor, id: block }
  );

const editMode = (page: Page, editor: JSHandle<KitEditor>): Promise<string> =>
  page.evaluate((handle) => handle.engine.editor.getEditMode(), editor);

async function addText(
  page: Page,
  editor: JSHandle<KitEditor>,
  typeface = 'Caveat'
): Promise<number> {
  await page.getByRole('button', { name: 'Text' }).click();
  await page.getByRole('button', { name: `Ag ${typeface}` }).click();
  await expect
    .poll(() =>
      page.evaluate(
        (handle) =>
          handle.engine.block.getType(
            handle.engine.block.findAllSelected()[0] ?? 0
          ),
        editor
      )
    )
    .toBe('//ly.img.ubq/text');
  return page.evaluate(
    (handle) => handle.engine.block.findAllSelected()[0],
    editor
  );
}

test('PC-16 add a text block', async ({ page }) => {
  const editor = await openTemplate(page);
  const block = await addText(page, editor);

  const props = await page.evaluate(
    ({ handle, id }) => {
      const engine = handle.engine;
      const front = engine.scene.getPages()[0];
      return {
        fontSize: engine.block.getFloat(id, 'text/fontSize'),
        alignment: engine.block.getEnum(id, 'text/horizontalAlignment'),
        heightMode: engine.block.getHeightMode(id),
        width: engine.block.getWidth(id),
        pageWidth: engine.block.getWidth(front),
        positionXMode: engine.block.getPositionXMode(id),
        positionYMode: engine.block.getPositionYMode(id),
        parent: engine.block.getParent(id),
        front,
        selected: engine.block.isSelected(id)
      };
    },
    { handle: editor, id: block }
  );
  expect(props.fontSize).toBe(40);
  expect(props.alignment).toBe('Center');
  expect(props.heightMode).toBe('Auto');
  expect(props.width).toBeCloseTo(props.pageWidth * 0.5, 3);
  expect(props.positionXMode).toBe('Absolute');
  expect(props.positionYMode).toBe('Absolute');
  expect(props.parent).toBe(props.front);
  expect(props.selected).toBe(true);
});

test('PC-17 edit the text', async ({ page }) => {
  const editor = await openTemplate(page);
  const block = await addText(page, editor);
  await enterTextMode(page, editor, block);
  await page.keyboard.press('ControlOrMeta+a');
  await page.keyboard.type('Bonjour', { delay: 40 });
  await expect.poll(() => textOf(page, editor, block)).toBe('Bonjour');

  await page.keyboard.press('Escape');
  await expect.poll(() => editMode(page, editor)).toBe('Transform');
});

test('PC-18 emoji in text', async ({ page }) => {
  const editor = await openTemplate(page);
  const block = await addText(page, editor);
  await enterTextMode(page, editor, block);
  await page.keyboard.press('ControlOrMeta+a');
  await page.keyboard.insertText('\u{1F339}');
  await expect.poll(() => textOf(page, editor, block)).toBe('\u{1F339}');
});

test('PC-19 text colour from the palette', async ({ page }) => {
  const editor = await openTemplate(page);
  const block = await addText(page, editor);
  await page.getByRole('button', { name: 'Color' }).click();
  await colorSwatch(page, 2).click();

  const color = await page.evaluate(
    ({ handle, id }) => handle.engine.block.getColor(id, 'fill/solid/color'),
    { handle: editor, id: block }
  );
  expect(Math.round(color.r * 255)).toBe(0x76);
  await expect(undoButton(page)).toBeEnabled();
});

test('PC-20 text colour from the picker', async ({ page }) => {
  const editor = await openTemplate(page);
  const block = await addText(page, editor);
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
            { handle: editor, id: block }
          )
        ).r * 255
      )
    )
    .toBe(0x44);
});

test('PC-21 change the text font', async ({ page }) => {
  const editor = await openTemplate(page);
  const block = await addText(page, editor);

  await page.getByRole('button', { name: 'Font' }).click();
  await page.getByRole('button', { name: 'Ag Roboto' }).click();

  // `replaceFontOnSelection` applies to every selected text block; PC-H2 pins
  // the multi-selection case, which the dock cannot reach.
  const typeface = await page.evaluate(
    ({ handle, id }) => handle.engine.block.getTypeface(id).name,
    { handle: editor, id: block }
  );
  expect(typeface).toBe('Roboto');
  await expect(undoButton(page)).toBeEnabled();
});

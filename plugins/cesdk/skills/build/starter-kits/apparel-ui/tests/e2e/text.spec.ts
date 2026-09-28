import { expect, test, type Kit } from '@imgly/kit-test-harness';
import { colorSwatch, undoButton } from './apparel';
import { mockUnsplash } from './unsplash';

test.beforeEach(async ({ page }) => {
  await mockUnsplash(page);
});

/** Add a text block through the dock and return its id. */
async function addText(kit: Kit, typeface = 'Oswald'): Promise<number> {
  await kit.page.getByRole('button', { name: 'Text' }).click();
  await kit.page.getByRole('button', { name: `Ag ${typeface}` }).click();
  return kit.page.evaluate(
    (handle) => handle.engine.block.findAllSelected()[0],
    kit.editor
  );
}

/** Double-click the block on the canvas, which puts the editor in text mode. */
async function enterTextMode(kit: Kit, block: number): Promise<void> {
  // The kit re-zooms the canvas after a block is added, so the block's screen
  // position is re-read on every attempt.
  await expect
    .poll(async () => {
      const box = await kit.page.evaluate(
        ({ handle, id }) => {
          const [x, y, width, height] =
            handle.engine.block.getScreenSpaceBoundingBoxXYWH([id]);
          const canvas = handle.engine.element.getBoundingClientRect();
          return { x: canvas.x + x + width / 2, y: canvas.y + y + height / 2 };
        },
        { handle: kit.editor, id: block }
      );
      await kit.page.mouse.dblclick(box.x, box.y);
      return kit.page.evaluate(
        (handle) => handle.engine.editor.getEditMode(),
        kit.editor
      );
    })
    .toBe('Text');
}

const textOf = (kit: Kit, block: number): Promise<string> =>
  kit.page.evaluate(
    ({ handle, id }) => handle.engine.block.getString(id, 'text/text'),
    { handle: kit.editor, id: block }
  );

test('AP-04 add a text block', async ({ kit }) => {
  const pageWidth = await kit.page.evaluate(
    (handle) => handle.engine.block.getWidth(handle.engine.scene.getPages()[0]),
    kit.editor
  );
  const block = await addText(kit);

  const props = await kit.page.evaluate(
    ({ handle, id }) => {
      const engine = handle.engine;
      return {
        type: engine.block.getType(id),
        fontSize: engine.block.getFloat(id, 'text/fontSize'),
        alignment: engine.block.getEnum(id, 'text/horizontalAlignment'),
        heightMode: engine.block.getHeightMode(id),
        width: engine.block.getWidth(id),
        positionXMode: engine.block.getPositionXMode(id),
        positionYMode: engine.block.getPositionYMode(id),
        parent: engine.block.getParent(id),
        page: engine.scene.getPages()[0],
        selected: engine.block.isSelected(id)
      };
    },
    { handle: kit.editor, id: block }
  );

  expect(props.type).toBe('//ly.img.ubq/text');
  expect(props.fontSize).toBe(40);
  expect(props.alignment).toBe('Center');
  expect(props.heightMode).toBe('Auto');
  expect(props.width).toBeCloseTo(pageWidth * 0.5, 3);
  expect(props.positionXMode).toBe('Absolute');
  expect(props.positionYMode).toBe('Absolute');
  expect(props.parent).toBe(props.page);
  expect(props.selected).toBe(true);
  // `autoPlaceBlockOnPage` ends with addUndoStep, so adding text is undoable.
  await expect(undoButton(kit.page)).toBeEnabled();

  await expect(kit.page.getByRole('button', { name: 'Font' })).toBeVisible();
  await expect(kit.page.getByRole('button', { name: 'Align' })).toBeVisible();
});

test('AP-05 edit the text', async ({ kit }) => {
  const block = await addText(kit);
  await enterTextMode(kit, block);
  await kit.page.keyboard.press('ControlOrMeta+a');
  await kit.page.keyboard.type('Skate', { delay: 40 });
  await expect.poll(() => textOf(kit, block)).toBe('Skate');

  await kit.page.keyboard.press('Escape');
  await expect
    .poll(() =>
      kit.page.evaluate(
        (handle) => handle.engine.editor.getEditMode(),
        kit.editor
      )
    )
    .toBe('Transform');
});

test('AP-06 emoji in text', async ({ kit }) => {
  const block = await addText(kit);
  await enterTextMode(kit, block);
  await kit.page.keyboard.press('ControlOrMeta+a');
  await kit.page.keyboard.insertText('\u{1F6F9}');
  await expect.poll(() => textOf(kit, block)).toBe('\u{1F6F9}');
});

test('AP-07 text colour from the palette', async ({ kit }) => {
  const block = await addText(kit);
  await kit.page.getByRole('button', { name: 'Color' }).click();
  await colorSwatch(kit.page, 2).click();

  const color = await kit.page.evaluate(
    ({ handle, id }) => handle.engine.block.getColor(id, 'fill/solid/color'),
    { handle: kit.editor, id: block }
  );
  expect(color.r).toBeCloseTo(1, 2);
  expect(color.g).toBeCloseTo(0.2, 2);
  expect(color.b).toBeCloseTo(0.2, 2);
  expect(color.a).toBe(1);
  await expect(undoButton(kit.page)).toBeEnabled();
});

test('AP-08 change the text font', async ({ kit }) => {
  const block = await addText(kit);
  await kit.page.getByRole('button', { name: 'Font' }).click();
  await kit.page.getByRole('button', { name: 'Ag Caveat' }).click();

  const typeface = await kit.page.evaluate(
    ({ handle, id }) => handle.engine.block.getTypeface(id).name,
    { handle: kit.editor, id: block }
  );
  expect(typeface).toBe('Caveat');
});

test('AP-09 change the text alignment', async ({ kit }) => {
  const block = await addText(kit);
  await kit.page.getByRole('button', { name: 'Align' }).click();
  const alignment = () =>
    kit.page.evaluate(
      ({ handle, id }) =>
        handle.engine.block.getEnum(id, 'text/horizontalAlignment'),
      { handle: kit.editor, id: block }
    );

  await kit.page.getByRole('button', { name: 'Left' }).click();
  expect(await alignment()).toBe('Left');
  await kit.page.getByRole('button', { name: 'Right' }).click();
  expect(await alignment()).toBe('Right');
});

import { expect, test } from '@imgly/kit-test-harness';
import type { Kit } from '@imgly/kit-test-harness';

import { PNG, pageChildCount } from './photobook';
import { mockUnsplash } from './unsplash';

test.beforeEach(async ({ page }) => {
  await mockUnsplash(page);
});

/** The blocks of the current page a user may select, with their kind. */
async function selectableBlocks(
  kit: Kit
): Promise<{ id: number; kind: string }[]> {
  return kit.page.evaluate((handle) => {
    const walk = (block: number): number[] => {
      const children = handle.engine.block.getChildren(block);
      return [...children, ...children.flatMap(walk)];
    };
    return walk(handle.engine.scene.getCurrentPage())
      .filter((id: number) =>
        handle.engine.block.isAllowedByScope(id, 'editor/select')
      )
      .map((id: number) => ({ id, kind: handle.engine.block.getKind(id) }));
  }, kit.editor);
}

/** The screen point at the centre of a block. */
async function centreOf(
  kit: Kit,
  block: number
): Promise<{ x: number; y: number }> {
  return kit.page.evaluate(
    ({ handle, id }) => {
      const [x, y, width, height] =
        handle.engine.block.getScreenSpaceBoundingBoxXYWH([id]);
      const canvas = handle.engine.element.getBoundingClientRect();
      return {
        x: canvas.x + x + width / 2,
        y: canvas.y + y + height / 2
      };
    },
    { handle: kit.editor, id: block }
  );
}

/**
 * The selection once it stopped changing. The kit corrects the selection
 * 200 ms after every change and ignores changes made in between.
 */
function selection(kit: Kit): Promise<number[]> {
  return kit.page.evaluate(async (handle) => {
    const read = () => handle.engine.block.findAllSelected().join();
    let last = read();
    for (;;) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const now = read();
      if (now === last) {
        return handle.engine.block.findAllSelected();
      }
      last = now;
    }
  }, kit.editor);
}

/**
 * The engine reports a selection change at the end of its next update, and the
 * kit undoes a click made in the 200 ms after that report, so wait them out.
 * A correction still pending from an earlier change can reselect a block, so
 * deselect again until nothing is selected.
 */
async function deselectAll(kit: Kit): Promise<void> {
  await expect
    .poll(async () => {
      await kit.page.evaluate(async (handle) => {
        const selected = handle.engine.block.findAllSelected();
        if (selected.length === 0) {
          return;
        }
        const reported = new Promise<void>((resolve) => {
          const unsubscribe = handle.engine.block.onSelectionChanged(() => {
            unsubscribe();
            resolve();
          });
        });
        selected.forEach((block: number) =>
          handle.engine.block.setSelected(block, false)
        );
        await reported;
        // Scheduled after the kit's own timer, so it fires after it.
        await new Promise((resolve) => setTimeout(resolve, 250));
      }, kit.editor);
      return selection(kit);
    })
    .toEqual([]);
}

function position(kit: Kit, block: number): Promise<[number, number]> {
  return kit.page.evaluate(
    ({ handle, id }) => [
      handle.engine.block.getPositionX(id),
      handle.engine.block.getPositionY(id)
    ],
    { handle: kit.editor, id: block }
  );
}

function blockCount(kit: Kit): Promise<number> {
  return kit.page.evaluate(
    (handle) => handle.engine.block.findAll().length,
    kit.editor
  );
}

async function drag(kit: Kit, block: number): Promise<void> {
  const { x, y } = await centreOf(kit, block);
  await kit.page.mouse.move(x, y);
  await kit.page.mouse.down();
  await kit.page.mouse.move(x + 60, y + 40, { steps: 10 });
  await kit.page.mouse.up();
}

/** Add the first sticker of the kit catalogue and return it. */
async function addSticker(kit: Kit): Promise<number> {
  // The dock shows only while nothing is selected.
  await deselectAll(kit);
  const before = await pageChildCount(kit);
  await kit.page.getByRole('button', { name: 'Sticker', exact: true }).click();
  await kit.page
    .getByRole('button', { name: /^Add sticker \d$/ })
    .first()
    .click();
  await expect.poll(() => pageChildCount(kit)).toBe(before + 1);
  const [sticker] = await selection(kit);
  return sticker;
}

async function clickToSelect(kit: Kit, block: number): Promise<void> {
  await deselectAll(kit);
  const { x, y } = await centreOf(kit, block);
  await kit.page.mouse.click(x, y);
}

test('PB-32 a click on the canvas selects images, text and stickers', async ({
  kit
}) => {
  const blocks = await selectableBlocks(kit);
  expect([...new Set(blocks.map(({ kind }) => kind))].sort()).toEqual([
    'image',
    'text'
  ]);
  for (const { id, kind } of blocks) {
    await clickToSelect(kit, id);
    await expect.poll(() => selection(kit), `${kind} ${id}`).toEqual([id]);
  }

  // The sticker covers some of the images, so it is added after them.
  const sticker = await addSticker(kit);
  await clickToSelect(kit, sticker);
  await expect.poll(() => selection(kit)).toEqual([sticker]);
});

for (const [id, kind] of [
  ['PB-08', 'image'],
  ['PB-25', 'text']
] as const) {
  test(`${id} dragging a ${kind} block leaves it in place`, async ({ kit }) => {
    const block = (await selectableBlocks(kit)).find(
      (candidate) => candidate.kind === kind
    )!.id;
    const before = await position(kit, block);
    await clickToSelect(kit, block);
    await expect.poll(() => selection(kit)).toEqual([block]);

    await drag(kit, block);

    expect(await position(kit, block)).toEqual(before);
  });
}

test('PB-23 a text block is edited in place', async ({ kit }) => {
  const text = (await selectableBlocks(kit)).find(
    ({ kind }) => kind === 'text'
  )!.id;

  await expect
    .poll(async () => {
      const { x, y } = await centreOf(kit, text);
      await kit.page.mouse.dblclick(x, y);
      return kit.page.evaluate(
        (handle) => handle.engine.editor.getEditMode(),
        kit.editor
      );
    })
    .toBe('Text');
  await kit.page.keyboard.press('ControlOrMeta+a');
  await kit.page.keyboard.type('Summer 2026', { delay: 40 });
  await kit.page.keyboard.press('Escape');

  await expect
    .poll(() =>
      kit.page.evaluate(
        ({ handle, id }) => handle.engine.block.getString(id, 'text/text'),
        { handle: kit.editor, id: text }
      )
    )
    .toBe('Summer 2026');
  await expect
    .poll(() =>
      kit.page.evaluate(
        (handle) => handle.engine.editor.getEditMode(),
        kit.editor
      )
    )
    .toBe('Transform');
});

test('PB-21 a sticker moves on the canvas and may rotate', async ({ kit }) => {
  const sticker = await addSticker(kit);
  const before = await position(kit, sticker);

  await drag(kit, sticker);

  await expect.poll(() => position(kit, sticker)).not.toEqual(before);
  // The rotation gesture itself is the engine's (`rotate-by-handle`).
  expect(
    await kit.page.evaluate(
      ({ handle, id }) =>
        handle.engine.block.isAllowedByScope(id, 'layer/rotate'),
      { handle: kit.editor, id: sticker }
    )
  ).toBe(true);
});

test('PB-22 a sticker cannot be duplicated', async ({ kit }) => {
  const sticker = await addSticker(kit);
  await clickToSelect(kit, sticker);
  await expect.poll(() => selection(kit)).toEqual([sticker]);
  const before = await blockCount(kit);

  // The sticker bar offers Delete and nothing that copies.
  await expect(
    kit.page.getByRole('button', { name: 'Delete', exact: true })
  ).toBeVisible();
  await expect(
    kit.page.getByRole('button', { name: /duplicate|copy|paste/i })
  ).toHaveCount(0);

  for (const keys of [
    'ControlOrMeta+d',
    'ControlOrMeta+c',
    'ControlOrMeta+v'
  ]) {
    await kit.page.keyboard.press(keys);
  }
  await kit.page.evaluate(
    () => new Promise((resolve) => requestAnimationFrame(resolve))
  );
  expect(await blockCount(kit)).toBe(before);
});

test('PB-33 dropping or pasting an image file adds no block', async ({
  kit
}) => {
  const before = await blockCount(kit);
  const image = (await selectableBlocks(kit)).find(
    ({ kind }) => kind === 'image'
  )!.id;
  await clickToSelect(kit, image);
  const { x, y } = await centreOf(kit, image);

  await kit.page.evaluate(
    ({ handle, png, point }) => {
      const bytes = Uint8Array.from(atob(png), (char) => char.charCodeAt(0));
      const file = new File([bytes], 'photo.png', { type: 'image/png' });
      const transfer = () => {
        const data = new DataTransfer();
        data.items.add(file);
        return data;
      };
      const canvas = handle.engine.element as HTMLElement;
      const init = {
        bubbles: true,
        cancelable: true,
        composed: true,
        clientX: point.x,
        clientY: point.y
      };
      const dataTransfer = transfer();
      for (const type of ['dragenter', 'dragover', 'drop']) {
        canvas.dispatchEvent(new DragEvent(type, { ...init, dataTransfer }));
      }
      for (const target of [canvas, document]) {
        target.dispatchEvent(
          new ClipboardEvent('paste', { ...init, clipboardData: transfer() })
        );
      }
    },
    { handle: kit.editor, png: PNG.toString('base64'), point: { x, y } }
  );
  await kit.page.keyboard.press('ControlOrMeta+v');

  // Let an asynchronous handler run before counting.
  await kit.page.evaluate(
    () => new Promise((resolve) => requestAnimationFrame(resolve))
  );
  expect(await blockCount(kit)).toBe(before);
});

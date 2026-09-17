import { expect, test } from '@imgly/kit-test-harness';
import type { Kit } from '@imgly/kit-test-harness';

import {
  openAddPanel,
  pageChildKinds,
  selectKind,
  selectedBlock
} from './mobile-ui';

/** Add a text block through the add-text panel and return it. */
async function addText(kit: Kit, typeface = 'Roboto'): Promise<number> {
  await openAddPanel(kit.page, 'Text');
  await kit.page.getByRole('button', { name: `Ag ${typeface}` }).click();
  await expect(kit.page.getByRole('button', { name: 'Font' })).toBeVisible();
  return selectedBlock(kit);
}

function textProperties(kit: Kit, block: number) {
  return kit.page.evaluate(
    ({ handle, id }) => {
      const engine = handle.engine;
      const [page] = engine.scene.getPages();
      return {
        kind: engine.block.getKind(id),
        fontSize: engine.block.getFloat(id, 'text/fontSize'),
        alignment: engine.block.getEnum(id, 'text/horizontalAlignment'),
        heightMode: engine.block.getHeightMode(id),
        widthRatio: engine.block.getWidth(id) / engine.block.getWidth(page),
        parent: engine.block.getParent(id),
        page,
        selected: engine.block.isSelected(id),
        typeface: engine.block.getTypeface(id).name
      };
    },
    { handle: kit.editor, id: block }
  );
}

test('MB-02 add a text block', async ({ kit }) => {
  const before = await pageChildKinds(kit);

  const block = await addText(kit);

  expect(await pageChildKinds(kit)).toHaveLength(before.length + 1);
  const properties = await textProperties(kit, block);
  expect(properties).toMatchObject({
    kind: 'text',
    fontSize: 40,
    alignment: 'Center',
    heightMode: 'Auto',
    widthRatio: 0.5,
    selected: true,
    typeface: 'Roboto'
  });
  expect(properties.parent).toBe(properties.page);
});

test('MB-03 edit the text of a block', async ({ kit }) => {
  const block = await selectKind(kit, 'text');

  await kit.page.evaluate(
    ({ handle, id }) => handle.engine.block.replaceText(id, 'Hello kit'),
    { handle: kit.editor, id: block }
  );

  await expect
    .poll(() =>
      kit.page.evaluate(
        ({ handle, id }) => handle.engine.block.getString(id, 'text/text'),
        { handle: kit.editor, id: block }
      )
    )
    .toBe('Hello kit');
});

test('MB-04 an emoji survives in the text', async ({ kit }) => {
  const block = await selectKind(kit, 'text');

  await kit.page.evaluate(
    ({ handle, id }) => handle.engine.block.replaceText(id, 'Party 🎉'),
    { handle: kit.editor, id: block }
  );

  await expect
    .poll(() =>
      kit.page.evaluate(
        ({ handle, id }) => handle.engine.block.getString(id, 'text/text'),
        { handle: kit.editor, id: block }
      )
    )
    .toBe('Party 🎉');
});

test('MB-05 the font panel offers the kit’s six typefaces', async ({ kit }) => {
  const block = await selectKind(kit, 'text');
  await kit.page.getByRole('button', { name: 'Font' }).click();

  // The kit filters the bundled typeface source down to its own list.
  const offered = [
    'Caveat',
    'Courier Prime',
    'Manrope',
    'Oswald',
    'Parisienne',
    'Roboto'
  ];
  for (const name of offered) {
    await expect(
      kit.page.getByRole('button', { name: `Ag ${name}` })
    ).toBeVisible();
  }
  await expect(kit.page.getByRole('button', { name: /^Ag / })).toHaveCount(
    offered.length
  );

  await kit.page.getByRole('button', { name: 'Ag Oswald' }).click();

  await expect
    .poll(() =>
      kit.page.evaluate(
        ({ handle, id }) => handle.engine.block.getTypeface(id).name,
        { handle: kit.editor, id: block }
      )
    )
    .toBe('Oswald');
});

test('MB-06 the text bar sets alignment and colour', async ({ kit }) => {
  const block = await selectKind(kit, 'text');

  await kit.page.getByRole('button', { name: 'Alignment' }).click();
  await kit.page.getByRole('button', { name: 'Left', exact: true }).click();

  await expect
    .poll(() =>
      kit.page.evaluate(
        ({ handle, id }) =>
          handle.engine.block.getEnum(id, 'text/horizontalAlignment'),
        { handle: kit.editor, id: block }
      )
    )
    .toBe('Left');

  await kit.page.getByRole('button', { name: 'Color', exact: true }).click();
  await kit.page.getByRole('button', { name: '#ff3333ff' }).click();

  await expect
    .poll(() =>
      kit.page.evaluate(
        ({ handle, id }) =>
          handle.engine.block.getColor(id, 'fill/solid/color'),
        { handle: kit.editor, id: block }
      )
    )
    .toEqual({
      r: expect.closeTo(1),
      g: expect.closeTo(0.2),
      b: expect.closeTo(0.2),
      a: expect.closeTo(1)
    });
});

test('MB-21 text edit mode leaves the camera alone until a cursor exists', async ({
  kit
}) => {
  const block = await selectKind(kit, 'text');
  const cameraY = () =>
    kit.page.evaluate((handle) => {
      const camera = handle.engine.block.findByType('camera')[0];
      return handle.engine.block.getPositionY(camera);
    }, kit.editor);
  const before = await cameraY();

  const cursorY = await kit.page.evaluate(
    ({ handle, id }) => {
      const engine = handle.engine;
      engine.block.setSelected(id, true);
      engine.editor.setEditMode('Text');
      return engine.editor.getTextCursorPositionInScreenSpaceY();
    },
    { handle: kit.editor, id: block }
  );

  await expect
    .poll(() =>
      kit.page.evaluate(
        (handle) => handle.engine.editor.getEditMode(),
        kit.editor
      )
    )
    .toBe('Text');
  // No gesture has laid a cursor out, so the kit's scroll-to-cursor helper
  // declines to move the camera. Only a canvas gesture produces a position.
  expect(cursorY).toBe(0);
  expect(await cameraY()).toBe(before);
});

import {
  download,
  exportCalls,
  expect,
  pngSize,
  spyExport,
  test
} from '@imgly/kit-test-harness';

import {
  addButton,
  openAddPanel,
  pageChildKinds,
  pageSize,
  selectKind,
  topBar
} from './mobile-ui';

test('MB-01 the editor loads with the social-media scene', async ({ kit }) => {
  await expect(topBar.download(kit.page)).toBeVisible();

  expect(await pageSize(kit)).toEqual({ width: 1080, height: 1920 });

  const scene = await kit.page.evaluate((handle) => {
    const root = handle.engine.scene.get();
    return {
      pages: handle.engine.scene.getPages().length,
      designUnit: handle.engine.block.getEnum(root, 'scene/designUnit'),
      dpi: handle.engine.block.getFloat(root, 'scene/dpi')
    };
  }, kit.editor);
  expect(scene).toEqual({ pages: 1, designUnit: 'Pixel', dpi: 300 });

  const sources = await kit.page.evaluate(
    (handle) => handle.engine.asset.findAllSources(),
    kit.editor
  );
  for (const id of [
    'ly.img.typeface',
    'ly.img.vector.shape',
    'ly.img.sticker',
    'ly.img.image',
    'ly.img.image.upload'
  ]) {
    expect(sources, id).toContain(id);
  }
});

test('MB-15 a size preset resizes the page', async ({ kit }) => {
  await topBar.size(kit.page).click();
  await expect(kit.page.getByRole('heading', { name: 'Size' })).toBeVisible();

  const presets = ['IG Post', 'IG Story', 'Full HD', '4K'];
  for (const name of presets) {
    await expect(
      kit.page.getByRole('heading', { name, exact: true })
    ).toBeVisible();
  }
  for (const label of ['1200x1200', '1080x1920', '1920x1080', '3840x2160']) {
    await expect(kit.page.getByText(label, { exact: true })).toBeVisible();
  }

  await kit.page.getByRole('heading', { name: 'Full HD', exact: true }).click();

  await expect
    .poll(() => pageSize(kit))
    .toEqual({
      width: 1920,
      height: 1080
    });
});

test('MB-16 the delete button destroys the selection and adds an undo step', async ({
  kit
}) => {
  const before = await pageChildKinds(kit);

  await selectKind(kit, 'image');
  await kit.page.getByRole('button', { name: 'Delete' }).click();

  await expect
    .poll(async () => (await pageChildKinds(kit)).length)
    .toBe(before.length - 1);
  await expect(topBar.undo(kit.page)).toBeEnabled();
});

test('MB-17 undo and redo are disabled until there is history', async ({
  kit
}) => {
  await expect(topBar.undo(kit.page)).toBeDisabled();
  await expect(topBar.redo(kit.page)).toBeDisabled();

  const before = await pageChildKinds(kit);
  await kit.page.evaluate((handle) => {
    const [page] = handle.engine.scene.getPages();
    const block = handle.engine.block.create('graphic');
    handle.engine.block.appendChild(page, block);
    handle.engine.editor.addUndoStep();
  }, kit.editor);

  await expect(topBar.undo(kit.page)).toBeEnabled();
  await topBar.undo(kit.page).click();

  await expect.poll(() => pageChildKinds(kit)).toEqual(before);
  await expect(topBar.redo(kit.page)).toBeEnabled();

  await topBar.redo(kit.page).click();
  await expect
    .poll(async () => (await pageChildKinds(kit)).length)
    .toBe(before.length + 1);
});

test('MB-18 download exports the current page as PNG', async ({ kit }) => {
  await spyExport(kit.page);

  const size = await pageSize(kit);
  const files = await download(
    kit.page,
    () => topBar.download(kit.page).click(),
    1
  );

  const calls = await exportCalls(kit.page);
  expect(calls).toHaveLength(1);
  expect(calls[0].options).toEqual({ mimeType: 'image/png' });
  expect(calls[0].block).toBe(
    await kit.page.evaluate(
      (handle) => handle.engine.scene.getPages()[0],
      kit.editor
    )
  );

  expect(pngSize(files[0].buffer)).toEqual(size);
  expect(files[0].name).toBe('my-design.png');
});

test('MB-19 an expanded panel pushes the canvas up', async ({ kit }) => {
  const canvasBottom = async () =>
    kit.page.evaluate((handle) => {
      const [page] = handle.engine.scene.getPages();
      const [, y, , height] = handle.engine.block.getScreenSpaceBoundingBoxXYWH(
        [page]
      );
      return y + height;
    }, kit.editor);

  const collapsed = await canvasBottom();
  await openAddPanel(kit.page, 'Sticker');

  const panelTop = await kit.page
    .getByRole('combobox', { name: 'Sticker group' })
    .evaluate((node) => node.getBoundingClientRect().top);
  await expect.poll(canvasBottom).toBeLessThan(panelTop);

  await kit.page.getByRole('button', { name: 'Collapse' }).click();
  await expect.poll(canvasBottom).toBe(collapsed);
});

test('MB-20 the selection drives which bottom bar is shown', async ({
  kit
}) => {
  await expect(addButton(kit.page, 'Text')).toBeVisible();

  await selectKind(kit, 'image');
  // The image bar replaces the four-button add bar with replace, crop and
  // delete, under the headline the kit gives the selection.
  for (const name of ['Replace', 'Crop', 'Delete']) {
    await expect(kit.page.getByRole('button', { name })).toBeVisible();
  }
  await expect(addButton(kit.page, 'Text')).toHaveCount(0);

  await selectKind(kit, 'text');
  for (const name of ['Font', 'Alignment', 'Color', 'Delete']) {
    await expect(
      kit.page.getByRole('button', { name, exact: true })
    ).toBeVisible();
  }

  await kit.page.evaluate((handle) => {
    handle.engine.block
      .findAllSelected()
      .forEach((block: number) =>
        handle.engine.block.setSelected(block, false)
      );
  }, kit.editor);

  await expect(addButton(kit.page, 'Text')).toBeVisible();
});

test('MB-A11Y the top bar and the add bar name their controls', async ({
  kit
}) => {
  for (const name of [
    'Canvas size',
    'Undo',
    'Redo',
    'Text',
    'Image',
    'Sticker',
    'Shape'
  ]) {
    await expect(
      kit.page.getByRole('button', { name, exact: true })
    ).toBeVisible();
  }
  await expect(topBar.download(kit.page)).toBeVisible();
});

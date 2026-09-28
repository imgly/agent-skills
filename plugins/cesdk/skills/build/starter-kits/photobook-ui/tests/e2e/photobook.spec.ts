import {
  download,
  exportCalls,
  expect,
  pdfPageCount,
  spyExport,
  test
} from '@imgly/kit-test-harness';
import {
  canUndo,
  currentPage,
  pageChildCount,
  pageCount,
  pageTree,
  selectFirstText
} from './photobook';
import { mockUnsplash } from './unsplash';

test.beforeEach(async ({ page }) => {
  await mockUnsplash(page);
});

test('PB-01 the editor loads the photobook one spread at a time', async ({
  kit
}) => {
  expect(await pageCount(kit)).toBeGreaterThan(1);

  const visible = await kit.page.evaluate((handle) => {
    const pages = handle.engine.scene.getPages();
    return pages.map((page: number) => handle.engine.block.isVisible(page));
  }, kit.editor);
  expect(visible.filter(Boolean)).toHaveLength(1);

  await expect(kit.page.getByRole('heading', { name: 'Pages' })).toBeVisible();
  await expect(
    kit.page.getByRole('button', { name: 'Add Page' })
  ).toBeVisible();
  for (const name of ['Theme', 'Layout', 'Color', 'Sticker', 'Export']) {
    await expect(
      kit.page.getByRole('button', { name, exact: true })
    ).toBeVisible();
  }
});

test('PB-07 the dock offers no way to add an image, text or shape', async ({
  kit
}) => {
  const names = await kit.page
    .getByRole('button')
    .evaluateAll((buttons) =>
      buttons.map((button) => (button.textContent ?? '').trim())
    );

  expect(names).toContain('Theme');
  expect(names).toContain('Layout');
  expect(names).toContain('Sticker');
  expect(names.filter((name) => /^Add (Image|Text|Shape)$/.test(name))).toEqual(
    []
  );
});

test('PB-11 applying a layout rearranges the page', async ({ kit }) => {
  const page = await currentPage(kit);
  const pagesBefore = await pageCount(kit);
  const urisBefore = (await pageTree(kit))
    .map(({ uri }) => uri)
    .filter((uri): uri is string => uri != null);

  await kit.page.getByRole('button', { name: 'Layout', exact: true }).click();
  const thumbnails = kit.page.getByRole('button', { name: 'Layout Preview' });
  await expect(thumbnails.first()).toBeVisible();
  await expect(thumbnails).toHaveCount(4);
  await thumbnails.nth(1).click();

  await expect.poll(() => pageCount(kit)).toBe(pagesBefore);
  expect(await currentPage(kit)).toBe(page);
  await expect.poll(() => pageChildCount(kit)).toBeGreaterThan(0);
  // The layout brings its own frames; the photos of the old page are carried
  // into them, so every image on the page is one that was there before.
  const urisAfter = (await pageTree(kit))
    .map(({ uri }) => uri)
    .filter((uri): uri is string => uri != null);
  expect(urisAfter.length).toBeGreaterThan(0);
  for (const uri of urisAfter) {
    expect(urisBefore, uri).toContain(uri);
  }

  await expect
    .poll(() =>
      kit.page.evaluate((handle) => handle.engine.editor.canUndo(), kit.editor)
    )
    .toBe(true);
});

test('PB-12 a theme restyles the page', async ({ kit }) => {
  const before = await pageTree(kit);
  const backgroundsBefore = before.filter(({ name }) =>
    ['BG Dark', 'BG Light'].includes(name)
  );
  expect(backgroundsBefore).toHaveLength(2);
  const fontsBefore = before.filter(({ font }) => font != null);
  expect(fontsBefore.length).toBeGreaterThan(0);

  await kit.page.getByRole('button', { name: 'Theme', exact: true }).click();
  for (const theme of ['jungle', 'sea', 'savanna', 'castle']) {
    await expect(
      kit.page.getByRole('button', { name: `${theme} Theme` })
    ).toBeVisible();
  }

  await kit.page.getByRole('button', { name: 'castle Theme' }).click();

  await expect
    .poll(async () =>
      (await pageTree(kit))
        .filter(({ name }) => ['BG Dark', 'BG Light'].includes(name))
        .map(({ uri }) => uri?.split('/').pop())
    )
    .toEqual(['castle-bg-dark.svg', 'castle-bg-light.svg']);

  const after = await pageTree(kit);
  for (const block of after.filter(({ font }) => font != null)) {
    expect(block.font, block.name).toContain('ElsieSwashCaps');
  }

  await expect
    .poll(() =>
      kit.page.evaluate((handle) => handle.engine.editor.canUndo(), kit.editor)
    )
    .toBe(true);
});

test('PB-15 Add Page appends a page from the first template', async ({
  kit
}) => {
  const before = await pageCount(kit);

  await kit.page.getByRole('button', { name: 'Add Page' }).click();

  await expect.poll(() => pageCount(kit)).toBe(before + 1);

  // The kit grants the added page `lifecycle/destroy`; the scene's own pages
  // stay deferred, which is what makes the trash button conditional.
  const destroyable = await kit.page.evaluate((handle) => {
    const pages = handle.engine.scene.getPages();
    return pages.map((page: number) =>
      handle.engine.block.isAllowedByScope(page, 'lifecycle/destroy')
    );
  }, kit.editor);
  expect(destroyable.at(-1)).toBe(true);
  expect(await currentPage(kit)).toBe(
    await kit.page.evaluate(
      (handle) => handle.engine.scene.getPages().at(-1),
      kit.editor
    )
  );
});

test('PB-19 a sticker is added from the kit catalogue', async ({ kit }) => {
  const before = await pageChildCount(kit);

  await kit.page.getByRole('button', { name: 'Sticker', exact: true }).click();
  const stickers = kit.page.getByRole('button', { name: /^Add sticker \d$/ });
  await expect(stickers).toHaveCount(6);
  await stickers.first().click();

  await expect.poll(() => pageChildCount(kit)).toBe(before + 1);

  const added = await kit.page.evaluate((handle) => {
    const [block] = handle.engine.block.findAllSelected();
    const fill = handle.engine.block.getFill(block);
    return {
      kind: handle.engine.block.getKind(block),
      uri: handle.engine.block.getString(fill, 'fill/image/imageFileURI')
    };
  }, kit.editor);
  expect(added.kind).toBe('sticker');
  expect(added.uri).toContain('/stickers/sticker-');
  expect(added.uri).not.toContain('{{base_url}}');
});

test('PB-20 the delete button destroys the sticker', async ({ kit }) => {
  const before = await pageChildCount(kit);
  await kit.page.getByRole('button', { name: 'Sticker', exact: true }).click();
  await kit.page
    .getByRole('button', { name: /^Add sticker \d$/ })
    .first()
    .click();
  await expect.poll(() => pageChildCount(kit)).toBe(before + 1);

  await kit.page.getByRole('button', { name: 'Delete', exact: true }).click();

  await expect.poll(() => pageChildCount(kit)).toBe(before);
  await expect.poll(() => canUndo(kit)).toBe(true);
});

test('PB-31 Export writes one PDF of the whole book', async ({ kit }) => {
  await spyExport(kit.page);
  const pages = await pageCount(kit);

  const files = await download(
    kit.page,
    () => kit.page.getByRole('button', { name: 'Export', exact: true }).click(),
    1
  );

  // The page rail exports a JPEG thumbnail per page, so filter to the export
  // the Export button itself makes.
  const pdfCalls = (await exportCalls(kit.page)).filter(
    (call) => call.options?.mimeType === 'application/pdf'
  );
  expect(pdfCalls).toHaveLength(1);
  expect(pdfCalls[0].block).toBe(
    await kit.page.evaluate((handle) => handle.engine.scene.get(), kit.editor)
  );
  expect(await pdfPageCount(files[0].buffer)).toBe(pages);

  const after = await kit.page.evaluate((handle) => {
    const scene = handle.engine.scene.get();
    return {
      dpi: handle.engine.block.getFloat(scene, 'scene/dpi'),
      visible: handle.engine.scene
        .getPages()
        .map((page: number) => handle.engine.block.isVisible(page))
    };
  }, kit.editor);
  // The kit restores a hardcoded 300 dpi, which happens to be the scene's own
  // value, and puts the single-page view back.
  expect(after.dpi).toBe(300);
  expect(after.visible.filter(Boolean)).toHaveLength(1);
});

test('PB-26 the align bar writes the text alignment', async ({ kit }) => {
  const text = await selectFirstText(kit);
  await kit.page.getByRole('button', { name: 'Align', exact: true }).click();

  for (const alignment of ['Left', 'Right'] as const) {
    await kit.page
      .getByRole('button', { name: alignment, exact: true })
      .click();
    await expect
      .poll(() =>
        kit.page.evaluate(
          ({ handle, block }) =>
            handle.engine.block.getEnum(block, 'text/horizontalAlignment'),
          { handle: kit.editor, block: text }
        )
      )
      .toBe(alignment);
  }

  await expect(
    kit.page.getByRole('button', { name: 'Center', exact: true })
  ).toBeVisible();
});

test('PB-29 the font picker offers the kit subset and sets the font', async ({
  kit
}) => {
  const text = await selectFirstText(kit);
  const before = await kit.page.evaluate(
    ({ handle, block }) =>
      handle.engine.block.getString(block, 'text/fontFileUri'),
    { handle: kit.editor, block: text }
  );

  await kit.page.getByRole('button', { name: 'Font', exact: true }).click();
  const fonts = kit.page.getByRole('button', { name: /^Ag / });
  await expect(fonts.first()).toBeVisible();

  // Known issue 17: the theme's savanna typeface is `Trash Hand`, while the
  // picker offers `TrashHand`, so the two cannot match.
  const subset = [
    'Aleo',
    'Caveat',
    'Coiny',
    'Elsie Swash Caps',
    'Nunito',
    'Source Serif Pro',
    'TrashHand'
  ];
  await expect(fonts).toHaveCount(subset.length);
  for (const name of subset) {
    await expect(
      kit.page.getByRole('button', { name: `Ag ${name}`, exact: true })
    ).toBeVisible();
  }

  await kit.page.getByRole('button', { name: 'Ag Caveat' }).click();

  await expect
    .poll(() =>
      kit.page.evaluate(
        ({ handle, block }) =>
          handle.engine.block.getString(block, 'text/fontFileUri'),
        { handle: kit.editor, block: text }
      )
    )
    .not.toBe(before);
  const after = await kit.page.evaluate(
    ({ handle, block }) =>
      handle.engine.block.getString(block, 'text/fontFileUri'),
    { handle: kit.editor, block: text }
  );
  expect(after).toContain('Caveat');
});

test('PB-A11Y the page rail and the colour swatches name their controls', async ({
  kit
}) => {
  await expect(kit.page.getByRole('button', { name: /^Page \d/ })).toHaveCount(
    await pageCount(kit)
  );
  for (const name of ['Move page up', 'Move page down', 'Undo', 'Redo']) {
    await expect(kit.page.getByRole('button', { name })).toBeVisible();
  }

  await kit.page.getByRole('button', { name: 'Color', exact: true }).click();
  await expect(
    kit.page.getByRole('button', { name: /^#[0-9a-f]{8}$/ })
  ).toHaveCount(6);
});

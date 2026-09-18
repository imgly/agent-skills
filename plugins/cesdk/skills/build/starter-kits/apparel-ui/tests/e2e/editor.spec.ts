import { expect, test } from '@imgly/kit-test-harness';
import { colorSwatch, redoButton, undoButton } from './apparel';
import { mockUnsplash } from './unsplash';

test.beforeEach(async ({ page }) => {
  await mockUnsplash(page);
});

test('AP-01 editor loads with the kiosk scene', async ({ kit }) => {
  const scene = await kit.page.evaluate(
    (handle) => ({
      pages: handle.engine.scene.getPages().length,
      pageTitle: handle.engine.editor.getSetting('page/title/show'),
      sources: handle.engine.asset.findAllSources()
    }),
    kit.editor
  );
  expect(scene.pages).toBe(1);
  expect(scene.pageTitle).toBe(false);
  expect(scene.sources).toContain('unsplash');
  expect(scene.sources).toContain('ly.img.colors.imageColors');

  await expect(kit.page.getByRole('button', { name: 'Export' })).toBeVisible();
  await expect(kit.page.getByRole('button', { name: 'Edit' })).toBeVisible();
  for (const label of ['Text', 'Image', 'Shape', 'Sticker']) {
    await expect(kit.page.getByRole('button', { name: label })).toBeVisible();
  }
});

test('AP-02 Edit and Preview', async ({ kit }) => {
  const readState = () =>
    kit.page.evaluate((handle) => {
      const engine = handle.engine;
      const page = engine.scene.getPages()[0];
      return {
        dim: engine.editor.getSetting('page/dimOutOfPageAreas'),
        clipped: engine.block.isClipped(page),
        fill: engine.block.getBool(page, 'fill/enabled'),
        selected: engine.block.findAllSelected().length,
        editMode: engine.editor.getEditMode()
      };
    }, kit.editor);

  await kit.page.getByRole('button', { name: 'Preview' }).click();
  await expect(kit.page.getByRole('button', { name: 'Text' })).toBeHidden();
  expect(await readState()).toEqual({
    dim: false,
    clipped: true,
    fill: false,
    selected: 0,
    editMode: 'Transform'
  });

  await kit.page.getByRole('button', { name: 'Edit' }).click();
  await expect(kit.page.getByRole('button', { name: 'Text' })).toBeVisible();
  expect(await readState()).toMatchObject({
    dim: true,
    clipped: false,
    fill: true
  });
});

test('AP-03 undo and redo start disabled', async ({ kit }) => {
  await expect(undoButton(kit.page)).toBeDisabled();
  await expect(redoButton(kit.page)).toBeDisabled();

  // Recolour the shape the scene already holds: undoing a *newly added* block
  // crashes the adjustment bar, which AP-21 pins.
  await kit.page.evaluate((handle) => {
    const engine = handle.engine;
    const shape = engine.block
      .getChildren(engine.scene.getPages()[0])
      .find((id: number) => engine.block.getKind(id) === 'shape');
    engine.block.setSelected(shape, true);
  }, kit.editor);
  await kit.page.getByRole('button', { name: 'Color' }).click();
  await colorSwatch(kit.page, 2).click();

  await expect(undoButton(kit.page)).toBeEnabled();
  await expect(redoButton(kit.page)).toBeDisabled();

  await undoButton(kit.page).click();
  await expect(redoButton(kit.page)).toBeEnabled();
});

test('AP-21 undoing an added block leaves the adjustment bar alive', async ({
  kit
}) => {
  await kit.page.getByRole('button', { name: 'Shape' }).click();
  await kit.page.getByRole('button', { name: 'Add shape 0' }).click();
  await expect(undoButton(kit.page)).toBeEnabled();
  await undoButton(kit.page).click();
  await expect(kit.page.getByRole('button', { name: 'Text' })).toBeVisible();
});

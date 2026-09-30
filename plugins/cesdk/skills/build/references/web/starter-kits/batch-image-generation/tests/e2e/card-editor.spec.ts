import { download, expect, test } from '@imgly/kit-test-harness';

import { EMPLOYEE_NAMES, Kit } from './kit';

const TARGET = 'Daniel Hauschildt';

test.describe('Card editor', () => {
  test('BIG-05 editing a card opens the Adopter editor with its values', async ({
    page
  }) => {
    const kit = new Kit(page);
    await kit.open();
    await kit.openEditor(kit.cardEditButton(TARGET));

    expect(await kit.editorState()).toEqual({
      role: 'Adopter',
      theme: 'light',
      variables: ['Daniel', 'Hauschildt', 'Co-Founder']
    });
  });

  test('BIG-05b the card editor opens that card with its own photo', async ({
    page
  }) => {
    const kit = new Kit(page);
    await kit.open();
    await kit.openEditor(kit.editButtons.first());
    const templatePhoto = await kit.photoUri();
    await kit.closeEditor();

    await kit.openEditor(kit.cardEditButton(TARGET));

    const photo = await kit.photoUri();
    expect(photo).toMatch(/\/images\/photo_imgly_10\.png$/);
    expect(photo).not.toBe(templatePhoto);
  });

  test('BIG-05c the Adopter can edit a card text and move it', async ({
    page
  }) => {
    const kit = new Kit(page);
    await kit.open();
    await kit.openEditor(kit.cardEditButton(TARGET));
    const editMode = () =>
      page.evaluate(() => (window as any).cesdk.engine.editor.getEditMode());

    await expect
      .poll(async () => {
        const centre = await kit.blockCentre('FirstName');
        await page.mouse.dblclick(centre.x, centre.y);
        return editMode();
      })
      .toBe('Text');
    await page.keyboard.press('Escape');
    await expect.poll(editMode).toBe('Transform');

    const firstNameX = () =>
      page.evaluate(() => {
        const engine = (window as any).cesdk.engine;
        const [block] = engine.block.findByName('FirstName');
        return engine.block.getPositionX(block);
      });
    const startX = await firstNameX();
    const from = await kit.blockCentre('FirstName');
    await page.mouse.move(from.x, from.y);
    await page.mouse.down();
    await page.mouse.move(from.x + 40, from.y, { steps: 8 });
    await page.mouse.up();

    await expect.poll(firstNameX).toBeGreaterThan(startX);
  });

  test('BIG-06 saving a card edit changes only that card', async ({ page }) => {
    const kit = new Kit(page);
    await kit.open();
    const before = await kit.cardDigests();

    await kit.openEditor(kit.cardEditButton(TARGET));
    await kit.recolourBlock('Background', { r: 0.2, g: 0.4, b: 0.9 });
    await kit.save();

    const after = await kit.digestsAfterRerender(before, TARGET);
    const changed = EMPLOYEE_NAMES.indexOf(TARGET);
    for (const [index, digest] of after.entries()) {
      if (index === changed) {
        expect(digest).not.toBe(before[index]);
      } else {
        expect(digest).toBe(before[index]);
      }
    }
  });

  test('BIG-06c a saved card edit is there when the card is edited again', async ({
    page
  }) => {
    const kit = new Kit(page);
    await kit.open();
    const before = await kit.cardDigests();
    const colour = { r: 0.2, g: 0.4, b: 0.9 };

    await kit.openEditor(kit.cardEditButton(TARGET));
    await kit.recolourBlock('Background', colour);
    await kit.save();
    await kit.digestsAfterRerender(before, TARGET);

    await kit.openEditor(kit.cardEditButton(TARGET));
    const saved = await kit.blockColour('Background');
    expect(saved.r).toBeCloseTo(colour.r);
    expect(saved.g).toBeCloseTo(colour.g);
    expect(saved.b).toBeCloseTo(colour.b);
  });

  test('BIG-06b discarding a card edit changes nothing', async ({ page }) => {
    const kit = new Kit(page);
    await kit.open();
    const before = await kit.cardDigests();

    await kit.openEditor(kit.cardEditButton('Olga Stadnicka'));
    await kit.recolourBlock('Background', { r: 0.9, g: 0.9, b: 0.1 });
    await kit.closeEditor();

    const after = await kit.saveCardEditAndSettle(TARGET, before);
    for (const [index, name] of EMPLOYEE_NAMES.entries()) {
      if (name !== TARGET) {
        expect(after[index]).toBe(before[index]);
      }
    }
  });

  test('BIG-07 exporting from the card editor downloads an image', async ({
    page
  }) => {
    const kit = new Kit(page);
    await kit.open();
    await kit.openEditor(kit.cardEditButton(TARGET));

    await kit.actionsDropdown.click();
    // The dropdown menu renders in a portal outside the editor region.
    const [file] = await download(page, () =>
      page.getByRole('button', { name: 'Export Images' }).click()
    );

    expect(file.name).toMatch(/\.png$/);
    expect(file.buffer.length).toBeGreaterThan(0);
  });
});

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

  test('BIG-06b discarding a card edit changes nothing', async ({ page }) => {
    const kit = new Kit(page);
    await kit.open();
    const before = await kit.cardDigests();

    await kit.openEditor(kit.cardEditButton('Olga Stadnicka'));
    await kit.recolourBlock('Background', { r: 0.9, g: 0.9, b: 0.1 });
    await kit.closeEditor();

    expect(await kit.cardDigests()).toEqual(before);
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

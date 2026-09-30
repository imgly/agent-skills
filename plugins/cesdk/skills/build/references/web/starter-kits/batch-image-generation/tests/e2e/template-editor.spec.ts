import { expect, test } from '@imgly/kit-test-harness';

import { EMPLOYEE_NAMES, Kit } from './kit';

test.describe('Template editor', () => {
  test('BIG-03 editing the template opens the Creator editor', async ({
    page
  }) => {
    const kit = new Kit(page);
    await kit.open();
    await kit.openEditor(kit.editButtons.first());

    expect(await kit.editorState()).toEqual({
      role: 'Creator',
      theme: 'dark',
      variables: ['Firstname', 'Lastname', 'Department']
    });
  });

  test('BIG-03b the navigation bar shows the template name', async ({
    page
  }) => {
    const kit = new Kit(page);
    await kit.open();
    await kit.openEditor(kit.editButtons.first());

    await expect(
      kit.editor.getByText('Portrait', { exact: true })
    ).toBeVisible();
  });

  test('BIG-03c the template editor opens the selected template', async ({
    page
  }) => {
    const kit = new Kit(page);
    await kit.open();

    await kit.openEditor(kit.editButtons.first());
    const portrait = await kit.pageSize();
    expect(portrait.width).toBeLessThan(portrait.height);
    await kit.closeEditor();

    const portraitCards = await kit.cardDigests();
    await kit.templateButton('Landscape').click();
    await kit.digestsAfterFullRerender(portraitCards);
    await kit.openEditor(
      kit.templateButton('Landscape').getByRole('button', { name: 'Edit' })
    );
    const landscape = await kit.pageSize();
    expect(landscape.width).toBeGreaterThan(landscape.height);
  });

  test('BIG-04 saving a template edit re-renders every card', async ({
    page
  }) => {
    const kit = new Kit(page);
    await kit.open();
    const before = await kit.cardDigests();

    await kit.openEditor(kit.editButtons.first());
    await kit.recolourBlock('Background', { r: 0.1, g: 0.7, b: 0.3 });
    await kit.save();

    const after = await kit.digestsAfterFullRerender(before);
    expect(after).toHaveLength(EMPLOYEE_NAMES.length);
  });

  test('BIG-04b discarding a template edit changes nothing', async ({
    page
  }) => {
    const kit = new Kit(page);
    await kit.open();
    const before = await kit.cardDigests();

    await kit.openEditor(kit.editButtons.first());
    const colour = await kit.blockColour('Background');
    await kit.recolourBlock('Background', { r: 0.9, g: 0.1, b: 0.1 });
    await kit.closeEditor();

    const settled = 'Daniel Hauschildt';
    const after = await kit.saveCardEditAndSettle(settled, before);
    for (const [index, name] of EMPLOYEE_NAMES.entries()) {
      if (name !== settled) {
        expect(after[index]).toBe(before[index]);
      }
    }
    await kit.openEditor(kit.editButtons.first());
    expect(await kit.blockColour('Background')).toEqual(colour);
  });
});

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

  test('BIG-04 saving a template edit re-renders every card', async ({
    page
  }) => {
    const kit = new Kit(page);
    await kit.open();
    const before = await kit.cardDigests();

    await kit.openEditor(kit.editButtons.first());
    await kit.recolourBlock('Background', { r: 0.1, g: 0.7, b: 0.3 });
    await kit.save();

    const after = await kit.digestsAfterRerender(before, EMPLOYEE_NAMES[0]);
    expect(after).toHaveLength(before.length);
    for (const [index, digest] of after.entries()) {
      expect(digest).not.toBe(before[index]);
    }
  });

  test('BIG-04b discarding a template edit changes nothing', async ({
    page
  }) => {
    const kit = new Kit(page);
    await kit.open();
    const before = await kit.cardDigests();

    await kit.openEditor(kit.editButtons.first());
    await kit.recolourBlock('Background', { r: 0.9, g: 0.1, b: 0.1 });
    await kit.closeEditor();

    expect(await kit.cardDigests()).toEqual(before);
  });
});

import { expect, test } from '@imgly/kit-test-harness';
import { selectFirstGraphic, switchRole } from './roles';

async function firstTextContent(kit: {
  page: import('@playwright/test').Page;
  editor: unknown;
}) {
  return kit.page.evaluate((handle) => {
    const [text] = (handle as any).engine.block.findByType('text');
    return (handle as any).engine.block.getString(text, 'text/text');
  }, kit.editor as any);
}

test.describe('Switching to Adopter', () => {
  test('VPL-05 Adopter mode is light', async ({ kit }) => {
    const editor = await switchRole(kit, 'Adopter');

    const state = await kit.page.evaluate(
      (handle) => ({
        role: handle.engine.editor.getRole(),
        theme: handle.cesdk.ui.getTheme()
      }),
      editor
    );

    expect(state.role).toBe('Adopter');
    expect(state.theme).toBe('light');
    await editor.dispose();
  });

  test('VPL-06 edits made as Creator survive the switch', async ({ kit }) => {
    await kit.page.evaluate((handle) => {
      const [text] = handle.engine.block.findByType('text');
      handle.engine.block.replaceText(text, 'PLACEHOLDER KIT TEST');
    }, kit.editor);

    const editor = await switchRole(kit, 'Adopter');

    await expect
      .poll(() => firstTextContent({ page: kit.page, editor } as any))
      .toBe('PLACEHOLDER KIT TEST');
    await editor.dispose();
  });

  test('VPL-07 placeholder scope set as Creator applies as Adopter', async ({
    kit
  }) => {
    const graphics = await kit.page.evaluate(
      (handle) => handle.engine.block.findByType('graphic'),
      kit.editor
    );
    const enabled = await selectFirstGraphic(kit);
    const untouched = await kit.page.evaluate(
      ([handle, list, skip]: any) =>
        list.find(
          (block: number) =>
            block !== skip && !handle.engine.block.isPlaceholderEnabled(block)
        ),
      [kit.editor, graphics, enabled] as any
    );

    await kit.page.getByRole('tab', { name: 'Placeholder' }).click();
    await expect(
      kit.page.getByRole('tab', { name: 'Placeholder' })
    ).toHaveAttribute('aria-selected', 'true');
    await kit.page.getByRole('checkbox', { name: 'Allow to Move' }).click();
    await expect
      .poll(() =>
        kit.page.evaluate(
          ([handle, block]: any) =>
            handle.engine.block.isPlaceholderEnabled(block),
          [kit.editor, enabled] as any
        )
      )
      .toBe(true);

    const editor = await switchRole(kit, 'Adopter');

    const flags = await kit.page.evaluate(
      ([handle, ids]: any) =>
        ids.map((block: number) =>
          handle.engine.block.isPlaceholderEnabled(block)
        ),
      [editor, [enabled, untouched]] as any
    );

    expect(flags).toEqual([true, false]);
    await editor.dispose();
  });

  test('VPL-08 an Adopter cannot add elements', async ({ kit }) => {
    const editor = await switchRole(kit, 'Adopter');

    const before = await kit.page.evaluate(
      (handle) => handle.engine.block.findAll().length,
      editor
    );

    // The role does not remove the dock entries, it disables them.
    for (const name of [
      'Templates',
      'Elements',
      'Uploads',
      'Images',
      'Videos'
    ]) {
      await expect(
        kit.page.getByRole('button', { name, exact: true })
      ).toBeDisabled();
    }

    const after = await kit.page.evaluate(
      (handle) => handle.engine.block.findAll().length,
      editor
    );
    expect(after).toBe(before);
    await editor.dispose();
  });

  test('VPL-09 switching back to Creator keeps the edits', async ({ kit }) => {
    await kit.page.evaluate((handle) => {
      const [text] = handle.engine.block.findByType('text');
      handle.engine.block.replaceText(text, 'ROUND TRIP');
    }, kit.editor);

    const adopter = await switchRole(kit, 'Adopter');
    await adopter.dispose();

    const creator = await switchRole(kit, 'Creator');
    const state = await kit.page.evaluate(
      (handle) => ({
        role: (handle as any).engine.editor.getRole(),
        theme: (handle as any).cesdk.ui.getTheme()
      }),
      creator as any
    );

    expect(state.role).toBe('Creator');
    expect(state.theme).toBe('dark');
    await expect
      .poll(() => firstTextContent({ page: kit.page, editor: creator } as any))
      .toBe('ROUND TRIP');
    await creator.dispose();
  });
});

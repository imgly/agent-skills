import { expect, test } from '@imgly/kit-test-harness';
import { selectFirstGraphic, switchRole } from './roles';

test.describe('Creator mode', () => {
  test('VPL-01 Creator is selected by default', async ({ kit }) => {
    await expect(
      kit.page.getByRole('button', { name: 'Creator', exact: true })
    ).toBeVisible();
    await expect(
      kit.page.getByRole('button', { name: 'Adopter', exact: true })
    ).toBeVisible();

    const state = await kit.page.evaluate(
      (handle) => ({
        role: handle.engine.editor.getRole(),
        pages: handle.engine.scene.getPages().length
      }),
      kit.editor
    );

    expect(state.role).toBe('Creator');
    expect(state.pages).toBe(1);
  });

  test('VPL-02 Creator mode is dark', async ({ kit }) => {
    const theme = await kit.page.evaluate(
      (handle) => handle.cesdk.ui.getTheme(),
      kit.editor
    );
    expect(theme).toBe('dark');
  });

  test('VPL-03 Creator mode offers the Design and Placeholder inspector views', async ({
    kit
  }) => {
    await selectFirstGraphic(kit);

    const views = kit.page.getByRole('tablist', { name: 'View' });
    await expect(views.getByRole('tab', { name: 'Design' })).toBeVisible();
    await expect(views.getByRole('tab', { name: 'Placeholder' })).toBeVisible();
  });

  test('VPL-04 a Creator can turn a placeholder on', async ({ kit }) => {
    const graphic = await selectFirstGraphic(kit);
    const isPlaceholder = () =>
      kit.page.evaluate(
        ([handle, block]) =>
          (
            handle as {
              engine: {
                block: { isPlaceholderEnabled(id: number): boolean };
              };
            }
          ).engine.block.isPlaceholderEnabled(block as number),
        [kit.editor, graphic] as const
      );

    expect(await isPlaceholder()).toBe(false);

    await kit.page.getByRole('tab', { name: 'Placeholder' }).click();
    await expect(
      kit.page.getByRole('tab', { name: 'Placeholder' })
    ).toHaveAttribute('aria-selected', 'true');
    await kit.page.getByRole('checkbox', { name: 'Allow to Move' }).click();

    await expect.poll(isPlaceholder).toBe(true);
  });

  test('VPL-15 Creator stays selected until Adopter is clicked', async ({
    kit
  }) => {
    const creator = kit.page.getByRole('button', {
      name: 'Creator',
      exact: true
    });
    const adopter = kit.page.getByRole('button', {
      name: 'Adopter',
      exact: true
    });
    const expectSelected = async (on: typeof creator, off: typeof creator) => {
      await expect(on).toHaveClass(/active/);
      await expect(off).not.toHaveClass(/active/);
    };
    await expectSelected(creator, adopter);

    await selectFirstGraphic(kit);
    await kit.page.evaluate((handle) => {
      const engine = handle.engine;
      const [graphic] = engine.block.findAllSelected();
      engine.block.setPositionX(
        graphic,
        engine.block.getPositionX(graphic) + 40
      );
      const [text] = engine.block.findByType('text');
      engine.block.replaceText(text, 'Edited as Creator');
      engine.editor.addUndoStep();
    }, kit.editor);
    await expectSelected(creator, adopter);

    // The editor's Preview shows the design as an Adopter by switching the
    // engine role; the kit's switch must not follow it.
    await kit.page.evaluate(
      (handle) => handle.engine.editor.setRole('Adopter'),
      kit.editor
    );
    await expect
      .poll(() =>
        kit.page.evaluate(
          (handle) => handle.engine.editor.getRole(),
          kit.editor
        )
      )
      .toBe('Adopter');
    await expectSelected(creator, adopter);
    await kit.page.evaluate(
      (handle) => handle.engine.editor.setRole('Creator'),
      kit.editor
    );

    const editor = await switchRole(kit, 'Adopter');
    await expectSelected(adopter, creator);
    await editor.dispose();
  });
});

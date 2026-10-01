import { expect, test } from '@imgly/kit-test-harness';
import { selectFirstGraphic } from './roles';

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
});

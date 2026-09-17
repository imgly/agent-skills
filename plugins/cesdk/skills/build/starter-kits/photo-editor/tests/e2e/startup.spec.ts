import { expect, test } from '@imgly/kit-test-harness';

const DOCK_LABELS = [
  'Crop',
  'Adjust',
  'Filter',
  'Effects',
  'BG Removal',
  'Text',
  'Shapes',
  'Stickers'
];

test.describe('Start-up', () => {
  test('PE-01 editor loads with the photo-editor dock', async ({ kit }) => {
    const pageCount = await kit.page.evaluate(
      (handle) => handle.engine.scene.getPages().length,
      kit.editor
    );
    expect(pageCount).toBe(1);

    for (const label of DOCK_LABELS) {
      await expect(
        kit.page.getByRole('button', { name: label, exact: true })
      ).toBeVisible();
    }

    await expect(
      kit.page.getByRole('button', { name: 'Export Image', exact: true })
    ).toBeVisible();
  });

  test('PE-02 background removal has its own dock entry', async ({ kit }) => {
    const dock = await kit.page.evaluate(
      (handle) =>
        handle.cesdk.ui
          .getComponentOrder({ in: 'ly.img.dock' })
          .map((entry: { id: string; key?: string }) => entry.key ?? entry.id),
      kit.editor
    );

    expect(dock.indexOf('@imgly/plugin-background-removal-web.dock')).toBe(
      dock.indexOf('ly.img.effects') + 1
    );
  });

  test('PE-03 the dock has no Apps panel', async ({ kit }) => {
    const dock = await kit.page.evaluate(
      (handle) =>
        handle.cesdk.ui
          .getComponentOrder({ in: 'ly.img.dock' })
          .map((entry: { id: string; key?: string }) => entry.key ?? entry.id),
      kit.editor
    );

    expect(dock.filter((id: string) => /apps/i.test(id))).toEqual([]);
    await expect(kit.page.getByRole('button', { name: /apps/i })).toHaveCount(
      0
    );
  });
});

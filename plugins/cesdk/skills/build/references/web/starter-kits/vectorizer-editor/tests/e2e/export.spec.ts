import {
  actionsMenu,
  download,
  expect,
  exportCalls,
  pdfPageCount,
  pngSize,
  spyExport,
  test
} from '@imgly/kit-test-harness';
import type { KitEditor } from '@imgly/kit-test-harness';
import type { JSHandle, Page } from '@playwright/test';

/**
 * The first child of the actions dropdown renders as its own navigation-bar
 * button; the rest sit behind the dropdown next to it.
 */
async function openActionsDropdown(page: Page): Promise<void> {
  await actionsMenu(page.locator('#cesdk_container')).click();
}

/** The page's pixel size at the scene's own resolution. */
async function pageSize(
  page: Page,
  editor: JSHandle<KitEditor>
): Promise<{ width: number; height: number }> {
  return page.evaluate((handle) => {
    const engine = handle.engine;
    const [first] = engine.scene.getPages();
    const scene = engine.scene.get()!;
    const perInch = engine.scene.getDesignUnit() === 'Millimeter' ? 25.4 : 1;
    const dpi = engine.block.getFloat(scene, 'scene/dpi');
    return {
      width: Math.round((engine.block.getWidth(first) / perInch) * dpi),
      height: Math.round((engine.block.getHeight(first) / perInch) * dpi)
    };
  }, editor);
}

test.describe('Export', () => {
  test('V-09 export image', async ({ kit }) => {
    await spyExport(kit.page);

    const files = await download(
      kit.page,
      () => kit.page.getByRole('button', { name: 'Export Images' }).click(),
      1
    );

    expect(files).toHaveLength(1);
    expect(files[0].name).toMatch(/\.png$/);

    // The editor's Export Image button runs `exportDesign` with the mime type
    // only, so the PNG comes out at the page's own resolution.
    const calls = await exportCalls(kit.page);
    expect(calls).toHaveLength(1);
    expect(calls[0].options).toMatchObject({ mimeType: 'image/png' });
    expect(calls[0].options?.targetWidth).toBeUndefined();
    expect(pngSize(files[0].buffer)).toEqual(
      await pageSize(kit.page, kit.editor)
    );
  });

  test('V-10 export PDF', async ({ kit }) => {
    await spyExport(kit.page);

    await openActionsDropdown(kit.page);
    const files = await download(
      kit.page,
      () =>
        kit.page
          .getByRole('menu')
          .getByRole('button', { name: 'Export PDF' })
          .click(),
      1
    );

    expect(files).toHaveLength(1);
    expect(files[0].name).toMatch(/\.pdf$/);
    expect(await pdfPageCount(files[0].buffer)).toBe(1);

    const calls = await exportCalls(kit.page);
    expect(calls).toHaveLength(1);
    expect(calls[0].options?.mimeType).toBe('application/pdf');
  });
});

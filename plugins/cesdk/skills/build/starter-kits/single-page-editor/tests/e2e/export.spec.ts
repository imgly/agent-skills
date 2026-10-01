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
import { CanvasBar, pageIds } from './page-select';

test.describe('Export', () => {
  test('SPE-07 export image writes the visible page', async ({ kit }) => {
    await spyExport(kit.page);
    const canvasBar = new CanvasBar(kit.page);
    const pages = await pageIds(kit.page, kit.editor);

    await canvasBar.nextPage.click();
    await expect(canvasBar.pageSelect).toHaveText('Page 2 / 4');

    const editorRegion = kit.page.locator('#cesdk_container');
    const files = await download(kit.page, () =>
      editorRegion.getByRole('button', { name: 'Export Images' }).click()
    );

    expect(files).toHaveLength(1);
    expect(files[0].name).toMatch(/\.png$/);
    expect(pngSize(files[0].buffer).width).toBeGreaterThan(0);

    const calls = await exportCalls(kit.page);
    expect(calls.map((call) => call.block)).toEqual([pages[1]]);
    expect(calls[0].options?.mimeType).toBe('image/png');
  });

  test('SPE-08 export PDF writes only the visible page', async ({ kit }) => {
    const editorRegion = kit.page.locator('#cesdk_container');
    await actionsMenu(editorRegion).click();

    const files = await download(kit.page, () =>
      kit.page
        .getByRole('menu')
        .getByRole('button', { name: 'Export PDF' })
        .click()
    );

    expect(files).toHaveLength(1);
    expect(files[0].name).toMatch(/\.pdf$/);
    // Single-page mode hides the other three pages, and a PDF export leaves
    // hidden pages out: a four-page archive exports as one page.
    expect(await pdfPageCount(files[0].buffer)).toBe(1);
  });
});

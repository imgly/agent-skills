import {
  download,
  exportCalls,
  pdfPageCount,
  pngSize,
  spyExport
} from '@imgly/kit-test-harness';
import { expect, test } from './fixtures';
import { ThemingSidebar } from './sidebar';

test.describe('Export', () => {
  test('TH-16 export image', async ({ kit }) => {
    const sidebar = new ThemingSidebar(kit.page);
    await spyExport(kit.page);

    const [file] = await download(kit.page, () =>
      sidebar.exportImageButton.click()
    );

    expect(file.name).toMatch(/\.png$/);
    expect(pngSize(file.buffer).width).toBeGreaterThan(0);
    const calls = await exportCalls(kit.page);
    expect(calls).toHaveLength(1);
    expect(calls[0].options).toMatchObject({ mimeType: 'image/png' });
    expect(calls[0].options?.targetWidth).toBeUndefined();
    expect(calls[0].options?.targetHeight).toBeUndefined();
  });

  test('TH-17 export PDF', async ({ kit }) => {
    const sidebar = new ThemingSidebar(kit.page);
    await spyExport(kit.page);

    await sidebar.actionsDropdown.click();
    const [file] = await download(kit.page, () =>
      sidebar.exportPdfItem.click()
    );

    expect(file.name).toMatch(/\.pdf$/);
    expect(await pdfPageCount(file.buffer)).toBe(2);
    const calls = await exportCalls(kit.page);
    expect(calls).toHaveLength(1);
    expect(calls[0].options).toMatchObject({ mimeType: 'application/pdf' });
  });
});

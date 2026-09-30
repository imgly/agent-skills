import {
  download,
  exportCalls,
  pdfPageCount,
  pngSize,
  spyExport
} from '@imgly/kit-test-harness';
import { expect, test } from './fixtures';
import { LocaleSwitcher } from './locale-switcher';

test.describe('Export', () => {
  test('TI-07 export image', async ({ kit }) => {
    const switcher = new LocaleSwitcher(kit.page);
    await spyExport(kit.page);

    const [file] = await download(kit.page, () =>
      switcher.exportImageButton.click()
    );

    expect(file.name).toMatch(/\.png$/);
    expect(pngSize(file.buffer).width).toBeGreaterThan(0);
    const calls = await exportCalls(kit.page);
    expect(calls).toHaveLength(1);
    expect(calls[0].options).toMatchObject({ mimeType: 'image/png' });
    expect(calls[0].options?.targetWidth).toBeUndefined();
    expect(calls[0].options?.targetHeight).toBeUndefined();
  });

  test('TI-08 export PDF', async ({ kit }) => {
    const switcher = new LocaleSwitcher(kit.page);
    await spyExport(kit.page);

    await switcher.actionsDropdown.click();
    const [file] = await download(kit.page, () =>
      switcher.exportPdfItem.click()
    );

    expect(file.name).toMatch(/\.pdf$/);
    expect(await pdfPageCount(file.buffer)).toBe(2);
    const calls = await exportCalls(kit.page);
    expect(calls).toHaveLength(1);
    expect(calls[0].options).toMatchObject({ mimeType: 'application/pdf' });
  });
});

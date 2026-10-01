import {
  download,
  exportCalls,
  expect,
  spyExport,
  test
} from '@imgly/kit-test-harness';
import { ExportPanel } from './export-panel';

const MAX_RESOLUTION = 4000;

test.describe('Input validation', () => {
  test('EO-16 an invalid page range is reported and blocks the export', async ({
    kit
  }) => {
    const panel = new ExportPanel(kit.page);
    await spyExport(kit.page);

    await panel.setPageRange('abc');
    await expect(panel.rangeHint).toHaveText('Invalid page range');

    await panel.exportButton.click();

    await expect(panel.rangeHint).toHaveText('Invalid page range');
    expect(await exportCalls(kit.page)).toEqual([]);
  });

  test('EO-16b a page range beyond the page count is reported and blocks the export', async ({
    kit
  }) => {
    const panel = new ExportPanel(kit.page);
    await spyExport(kit.page);

    await panel.setPageRange('3');
    await expect(panel.rangeHint).toHaveText('No page in that range');

    await panel.exportButton.click();

    expect(await exportCalls(kit.page)).toEqual([]);
  });

  test('EO-16c a range typed under Range does not apply to All', async ({
    kit
  }) => {
    const panel = new ExportPanel(kit.page);
    await spyExport(kit.page);

    await panel.setPageRange('1');
    await panel.pagesButton('All').click();

    await download(kit.page, () => panel.exportButton.click(), 2);

    expect(await exportCalls(kit.page)).toHaveLength(2);
  });

  test('EO-17 a custom size cannot exceed the limit', async ({ kit }) => {
    const panel = new ExportPanel(kit.page);
    await spyExport(kit.page);

    await panel.setResolution('Custom');
    await panel.setNumber(panel.customHeight, MAX_RESOLUTION + 1000);

    // Enter keeps the focus, so the height still shows the typed draft. The
    // width is derived from the committed value, which is clamped.
    await expect(panel.customWidth).toHaveValue(String(MAX_RESOLUTION));
    await expect(panel.exportButton).toBeEnabled();

    await download(kit.page, () => panel.exportButton.click(), 2);
    for (const call of await exportCalls(kit.page)) {
      expect(call.options?.targetWidth).toBeLessThanOrEqual(MAX_RESOLUTION);
      expect(call.options?.targetHeight).toBeLessThanOrEqual(MAX_RESOLUTION);
    }
  });
});

import {
  download,
  exportCalls,
  expect,
  pngSize,
  resetExportCalls,
  spyExport,
  test
} from '@imgly/kit-test-harness';
import { ExportPanel } from './export-panel';

test.describe('Export PNG', () => {
  test('EO-10 export with defaults', async ({ kit }) => {
    const panel = new ExportPanel(kit.page);
    await panel.selectFormat('PNG');

    const files = await download(kit.page, () => panel.exportButton.click(), 2);

    expect(files).toHaveLength(2);
    for (const file of files) {
      expect(file.name).toMatch(/\.png$/);
      expect(pngSize(file.buffer)).toEqual({ width: 1080, height: 1080 });
    }
  });

  test('EO-11 export a page range', async ({ kit }) => {
    const panel = new ExportPanel(kit.page);
    await spyExport(kit.page);
    await panel.selectFormat('PNG');
    await panel.setPageRange('2');

    const files = await download(kit.page, () => panel.exportButton.click(), 1);

    expect(files).toHaveLength(1);
    expect(pngSize(files[0].buffer)).toEqual({ width: 1080, height: 1080 });

    const secondPage = await kit.page.evaluate(
      (handle) => handle.engine.scene.getPages()[1],
      kit.editor
    );
    const calls = await exportCalls(kit.page);
    expect(calls.map((call) => call.block)).toEqual([secondPage]);
  });

  test('EO-12 change quality', async ({ kit }) => {
    const panel = new ExportPanel(kit.page);
    await spyExport(kit.page);
    await panel.selectFormat('PNG');

    await panel.setQuality('Low');
    await download(kit.page, () => panel.exportButton.click(), 2);
    expect(
      (await exportCalls(kit.page)).map(
        (call) => call.options?.pngCompressionLevel
      )
    ).toEqual([9, 9]);

    await resetExportCalls(kit.page);
    await panel.setQuality('Maximum');
    await download(kit.page, () => panel.exportButton.click(), 2);
    expect(
      (await exportCalls(kit.page)).map(
        (call) => call.options?.pngCompressionLevel
      )
    ).toEqual([1, 1]);
  });

  test('EO-13 change size', async ({ kit }) => {
    const panel = new ExportPanel(kit.page);
    await spyExport(kit.page);
    await panel.selectFormat('PNG');

    await panel.setResolution('Small');
    await expect(panel.sizeText).toHaveText('540 x 540 px');
    await download(kit.page, () => panel.exportButton.click(), 2);
    expect(
      (await exportCalls(kit.page)).map((call) => [
        call.options?.targetWidth,
        call.options?.targetHeight
      ])
    ).toEqual([
      [540, 540],
      [540, 540]
    ]);

    await resetExportCalls(kit.page);
    await panel.setResolution('Huge');
    await expect(panel.sizeText).toHaveText('2160 x 2160 px');
    await download(kit.page, () => panel.exportButton.click(), 2);
    expect(
      (await exportCalls(kit.page)).map((call) => [
        call.options?.targetWidth,
        call.options?.targetHeight
      ])
    ).toEqual([
      [2160, 2160],
      [2160, 2160]
    ]);

    await resetExportCalls(kit.page);
    await panel.setResolution('Custom');
    await panel.setNumber(panel.customWidth, 500);
    await download(kit.page, () => panel.exportButton.click(), 2);
    expect(
      (await exportCalls(kit.page)).map((call) => [
        call.options?.targetWidth,
        call.options?.targetHeight
      ])
    ).toEqual([
      [500, 500],
      [500, 500]
    ]);
  });
});

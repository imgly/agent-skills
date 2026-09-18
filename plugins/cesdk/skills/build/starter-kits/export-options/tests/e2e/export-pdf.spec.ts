import {
  download,
  exportCalls,
  expect,
  pdfPageCount,
  spyExport,
  test
} from '@imgly/kit-test-harness';
import { ExportPanel } from './export-panel';

test.describe('Export PDF', () => {
  test('EO-14 export with defaults', async ({ kit }) => {
    const panel = new ExportPanel(kit.page);
    await panel.selectFormat('PDF');

    const files = await download(kit.page, () => panel.exportButton.click(), 1);

    expect(files).toHaveLength(1);
    expect(files[0].name).toMatch(/\.pdf$/);
    expect(await pdfPageCount(files[0].buffer)).toBe(2);
  });

  test('EO-15 export a page range', async ({ kit }) => {
    const panel = new ExportPanel(kit.page);
    await spyExport(kit.page, {
      onCall: (engine) =>
        engine.scene.getPages().map((id: number) => engine.block.isVisible(id))
    });

    await panel.selectFormat('PDF');
    await panel.setPageRange('1');

    const files = await download(kit.page, () => panel.exportButton.click(), 1);

    expect(files).toHaveLength(1);
    expect(await pdfPageCount(files[0].buffer)).toBe(1);

    const calls = await exportCalls(kit.page);
    expect(calls).toHaveLength(1);
    expect(calls[0].options?.mimeType).toBe('application/pdf');

    // The kit hides the pages outside the range for the call and restores them.
    expect(calls[0].sample).toEqual([true, false]);
    expect(
      await kit.page.evaluate(
        (handle) =>
          handle.engine.scene
            .getPages()
            .map((id: number) => handle.engine.block.isVisible(id)),
        kit.editor
      )
    ).toEqual([true, true]);
  });
});

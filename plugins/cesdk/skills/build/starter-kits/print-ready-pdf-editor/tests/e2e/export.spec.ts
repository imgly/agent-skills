import {
  download,
  exportCalls,
  expect,
  pdfPageCount,
  spyExport,
  test
} from '@imgly/kit-test-harness';
import { ExportPanel } from './export-panel';

/** Every conversion runs Ghostscript on a WASM payload. */
const EXPORT_TIMEOUT = 240_000;

test.describe('Export', () => {
  test('PRP-05 export with the defaults', async ({ kit }) => {
    test.setTimeout(EXPORT_TIMEOUT);
    const panel = new ExportPanel(kit.page);
    await panel.open();

    const files = await download(kit.page, () => panel.exportButton.click(), 1);

    expect(files).toHaveLength(1);
    expect(await pdfPageCount(files[0].buffer)).toBe(2);
    expect(files[0].buffer.toString('latin1')).toContain('GTS_PDFXVersion');
  });

  test('PRP-06 export a page range', async ({ kit }) => {
    test.setTimeout(EXPORT_TIMEOUT);
    const panel = new ExportPanel(kit.page);
    await panel.open();
    await panel.pagesButton('Custom').click();
    await panel.pageRange.fill('1');

    await expect(panel.pageRangeHint).toHaveText('e.g.: 1,1-2');

    const files = await download(kit.page, () => panel.exportButton.click(), 1);

    expect(await pdfPageCount(files[0].buffer)).toBe(1);

    const visible = await kit.page.evaluate(
      (handle) =>
        handle.engine.scene
          .getPages()
          .map((id: number) => handle.engine.block.isVisible(id)),
      kit.editor
    );
    expect(visible).toEqual([true, true]);
  });

  test('PRP-07 a changed bleed margin reaches the export', async ({ kit }) => {
    test.setTimeout(EXPORT_TIMEOUT);
    const panel = new ExportPanel(kit.page);
    await panel.open();

    const before = await kit.page.evaluate(
      (handle) =>
        handle.engine.scene
          .getPages()
          .map((id: number) =>
            handle.engine.block.getFloat(id, 'page/margin/top')
          ),
      kit.editor
    );

    await spyExport(kit.page, {
      onCall: (engine) =>
        engine.scene
          .getPages()
          .map((id: number) => engine.block.getFloat(id, 'page/margin/top'))
    });
    await panel.bleedMargin.fill('5');
    await panel.bleedMargin.blur();
    await download(kit.page, () => panel.exportButton.click(), 1);

    const [call] = await exportCalls(kit.page);
    // 5 mm on a 300 dpi pixel scene.
    expect((call.sample as number[])[0]).toBeCloseTo((5 / 25.4) * 300, 2);

    const after = await kit.page.evaluate(
      (handle) =>
        handle.engine.scene
          .getPages()
          .map((id: number) =>
            handle.engine.block.getFloat(id, 'page/margin/top')
          ),
      kit.editor
    );
    expect(after).toEqual(before);
  });

  test('PRP-08 GRACoL 2006', async ({ kit }) => {
    test.setTimeout(EXPORT_TIMEOUT);
    const panel = new ExportPanel(kit.page);
    await panel.open();
    await panel.choose('ISO Coated v2 (ECI) (CMYK)', 'GRACoL 2006 (CMYK)');

    const files = await download(kit.page, () => panel.exportButton.click(), 1);

    expect(await pdfPageCount(files[0].buffer)).toBe(2);
    expect(files[0].buffer.toString('latin1')).toContain('GTS_PDFXVersion');
  });

  test('PRP-09 sRGB', async ({ kit }) => {
    test.setTimeout(EXPORT_TIMEOUT);
    const panel = new ExportPanel(kit.page);
    await panel.open();
    await panel.choose('ISO Coated v2 (ECI) (CMYK)', 'sRGB (RGB)');

    const files = await download(kit.page, () => panel.exportButton.click(), 1);

    expect(await pdfPageCount(files[0].buffer)).toBe(2);
    expect(files[0].buffer.toString('latin1')).toContain('GTS_PDFXVersion');
  });

  test('PRP-10 the design renders in the export', async ({ kit }) => {
    test.setTimeout(EXPORT_TIMEOUT);
    await kit.page.evaluate((handle) => {
      const engine = handle.engine;
      const text = engine.block.create('text');
      engine.block.replaceText(text, 'PrintReadyProof');
      engine.block.setWidth(text, 400);
      engine.block.setHeight(text, 100);
      engine.block.appendChild(engine.scene.getPages()[0], text);
    }, kit.editor);

    const panel = new ExportPanel(kit.page);
    await panel.open();

    const files = await download(kit.page, () => panel.exportButton.click(), 1);

    expect(await pdfPageCount(files[0].buffer)).toBe(2);
    expect(files[0].buffer.toString('latin1')).toContain('GTS_PDFXVersion');
  });

  test('PRP-11 an invalid page range is reported instead of exporting nothing', async ({
    kit
  }) => {
    test.setTimeout(EXPORT_TIMEOUT);
    const panel = new ExportPanel(kit.page);
    await panel.open();
    await panel.pagesButton('Custom').click();
    await panel.pageRange.fill('abc');
    await panel.pageRange.blur();

    await expect(panel.pageRangeHint).toHaveText('Invalid page range');

    // The notification is a second occurrence of the text; the hint is the
    // first, so a count of two is what proves the export reported the failure.
    await panel.exportButton.click();
    await expect(kit.page.getByText('Invalid page range')).toHaveCount(2);
  });
});

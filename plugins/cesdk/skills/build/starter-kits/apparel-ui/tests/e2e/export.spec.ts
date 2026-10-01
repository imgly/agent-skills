import {
  download,
  expect,
  exportCalls,
  pdfPageCount,
  spyExport,
  test
} from '@imgly/kit-test-harness';
import { mockUnsplash } from './unsplash';

test.beforeEach(async ({ page }) => {
  await mockUnsplash(page);
});

test('AP-20 export PDF', async ({ kit }) => {
  await spyExport(kit.page);

  const files = await download(kit.page, async () => {
    await kit.page.getByRole('button', { name: 'Export' }).click();
  });

  const calls = await exportCalls(kit.page);
  expect(calls).toHaveLength(1);
  expect(calls[0].options).toMatchObject({ mimeType: 'application/pdf' });
  const scene = await kit.page.evaluate(
    (handle) => handle.engine.scene.get(),
    kit.editor
  );
  expect(calls[0].block).toBe(scene);

  expect(files).toHaveLength(1);
  // The kit passes no extension; the browser derives it from the blob type.
  expect(files[0].name).toBe('my-t-shirt-design.pdf');
  expect(await pdfPageCount(files[0].buffer)).toBe(1);

  const after = await kit.page.evaluate((handle) => {
    const engine = handle.engine;
    return {
      dpi: engine.block.getFloat(engine.scene.get(), 'scene/dpi'),
      visible: engine.scene
        .getPages()
        .map((id: number) => engine.block.isVisible(id))
    };
  }, kit.editor);
  expect(after.dpi).toBe(300);
  expect(after.visible).toEqual([true]);
});

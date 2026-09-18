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

test.describe('Export', () => {
  test('CM-07a export an image', async ({ kit }) => {
    await spyExport(kit.page);
    const pageAspect = await kit.page.evaluate((handle) => {
      const page = handle.engine.scene.getPages()[0];
      return (
        handle.engine.block.getWidth(page) / handle.engine.block.getHeight(page)
      );
    }, kit.editor);

    const [png] = await download(kit.page, () =>
      kit.page
        .getByRole('button', { name: 'Export Images', exact: true })
        .click()
    );

    expect(png.name).toMatch(/\.png$/);
    // The navigation bar entry runs `exportDesign`, which sends no target size,
    // so the page's own pixel size decides.
    const size = pngSize(png.buffer);
    expect(size.width / size.height).toBeCloseTo(pageAspect, 2);
    const calls = await exportCalls(kit.page);
    expect(calls).toHaveLength(1);
    expect(calls[0].options).toMatchObject({ mimeType: 'image/png' });
    expect(calls[0].options?.targetWidth).toBeUndefined();
    expect(calls[0].options?.targetHeight).toBeUndefined();
  });

  test('CM-07b export a PDF', async ({ kit }) => {
    await spyExport(kit.page);
    await actionsMenu(kit.page).click();
    const menuButtons = kit.page.getByRole('menu').getByRole('button');
    await expect(menuButtons).toHaveText(['Export PDF']);

    const [pdf] = await download(kit.page, () => menuButtons.first().click());

    expect(pdf.name).toMatch(/\.pdf$/);
    expect(await pdfPageCount(pdf.buffer)).toBe(1);
    const calls = await exportCalls(kit.page);
    expect(calls).toHaveLength(1);
    expect(calls[0].options).toMatchObject({ mimeType: 'application/pdf' });
  });
});

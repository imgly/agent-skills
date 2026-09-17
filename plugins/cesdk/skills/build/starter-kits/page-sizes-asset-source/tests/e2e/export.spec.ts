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
  test('PGS-09 export image', async ({ kit }) => {
    await spyExport(kit.page);
    const files = await download(kit.page, () =>
      kit.page.getByRole('button', { name: 'Export Images' }).click()
    );

    expect(files[0].name).toMatch(/\.png$/);
    // The navigation bar entry runs `exportDesign`, which sends no target size,
    // so the page's own pixel size decides.
    expect(pngSize(files[0].buffer).width).toBeGreaterThan(0);
    const calls = await exportCalls(kit.page);
    expect(calls).toHaveLength(1);
    expect(calls[0].options).toMatchObject({ mimeType: 'image/png' });
    expect(calls[0].options?.targetWidth).toBeUndefined();
    expect(calls[0].options?.targetHeight).toBeUndefined();
  });

  test('PGS-10 export PDF', async ({ kit }) => {
    await spyExport(kit.page);
    await actionsMenu(kit.page).click();
    const files = await download(kit.page, () =>
      kit.page.getByRole('button', { name: 'Export PDF' }).click()
    );

    expect(files[0].name).toMatch(/\.pdf$/);
    expect(await pdfPageCount(files[0].buffer)).toBe(1);
    const calls = await exportCalls(kit.page);
    expect(calls).toHaveLength(1);
    expect(calls[0].options).toMatchObject({ mimeType: 'application/pdf' });
  });
});

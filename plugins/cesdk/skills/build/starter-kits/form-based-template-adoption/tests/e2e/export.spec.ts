import {
  actionsMenu,
  download,
  expect,
  exportCalls,
  spyExport,
  test
} from '@imgly/kit-test-harness';

test.describe('Export', () => {
  test('FTA-13 export image', async ({ kit }) => {
    await spyExport(kit.page);
    const files = await download(kit.page, () =>
      kit.page.getByRole('button', { name: 'Export Images' }).click()
    );

    expect(files.length).toBeGreaterThan(0);
    expect(files[0].buffer.subarray(1, 4).toString()).toBe('PNG');
    const calls = await exportCalls(kit.page);
    expect(calls).toHaveLength(1);
    expect(calls[0].options).toMatchObject({ mimeType: 'image/png' });
    expect(calls[0].options?.targetWidth).toBeUndefined();
    expect(calls[0].options?.targetHeight).toBeUndefined();
  });

  test('FTA-14 export PDF', async ({ kit }) => {
    await spyExport(kit.page);
    await actionsMenu(kit.page).click();

    const files = await download(kit.page, () =>
      kit.page.getByRole('button', { name: 'Export PDF' }).click()
    );

    expect(files).toHaveLength(1);
    expect(files[0].buffer.subarray(0, 4).toString()).toBe('%PDF');
    const calls = await exportCalls(kit.page);
    expect(calls).toHaveLength(1);
    expect(calls[0].options).toMatchObject({ mimeType: 'application/pdf' });
  });
});

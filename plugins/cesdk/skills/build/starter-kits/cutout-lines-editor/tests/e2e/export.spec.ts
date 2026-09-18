import {
  download,
  exportCalls,
  expect,
  pdfPageCount,
  spyExport,
  test
} from '@imgly/kit-test-harness';

test.describe('Export', () => {
  test('CL-07 export PDF with cutouts', async ({ kit }) => {
    await spyExport(kit.page);

    const navigation = kit.page.getByRole('region', { name: 'Navigation Bar' });
    // The actions dropdown has a single child, so it renders as its own
    // button and no dropdown is drawn.
    await expect(
      navigation.getByRole('button', { name: 'Export PDF' })
    ).toBeVisible();
    await expect(
      navigation.getByRole('button', { name: 'Export Images' })
    ).toBeHidden();

    const files = await download(kit.page, () =>
      navigation.getByRole('button', { name: 'Export PDF' }).click()
    );

    expect(files).toHaveLength(1);
    expect(files[0].name).toMatch(/\.pdf$/);
    expect(await pdfPageCount(files[0].buffer)).toBe(1);

    const calls = await exportCalls(kit.page);
    expect(calls).toHaveLength(1);
    expect(calls[0].options?.mimeType).toBe('application/pdf');
  });
});

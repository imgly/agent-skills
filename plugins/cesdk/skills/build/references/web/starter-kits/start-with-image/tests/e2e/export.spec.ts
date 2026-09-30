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
import { chooseImage, IMAGES } from './kit';

test.describe('Export', () => {
  test('SWI-09 export image', async ({ page }) => {
    await page.goto('./');
    await chooseImage(page, 0);
    await spyExport(page);

    const [file] = await download(page, () =>
      page.getByRole('button', { name: 'Export Images' }).click()
    );

    expect(file.name).toMatch(/\.png$/);
    const [width, height] = IMAGES[0].size;
    expect(pngSize(file.buffer)).toEqual({ width, height });
    const calls = await exportCalls(page);
    expect(calls).toHaveLength(1);
    expect(calls[0].options).toMatchObject({ mimeType: 'image/png' });
    // The kit sends no target size, so the page the chosen image made decides.
    expect(calls[0].options?.targetWidth).toBeUndefined();
  });

  test('SWI-10 export PDF', async ({ page }) => {
    await page.goto('./');
    await chooseImage(page, 0);
    await spyExport(page);

    await actionsMenu(page).click();
    const [file] = await download(page, () =>
      page.getByRole('menu').getByRole('button', { name: 'Export PDF' }).click()
    );

    expect(file.name).toMatch(/\.pdf$/);
    expect(await pdfPageCount(file.buffer)).toBe(1);
    const calls = await exportCalls(page);
    expect(calls).toHaveLength(1);
    expect(calls[0].options).toMatchObject({ mimeType: 'application/pdf' });
  });
});

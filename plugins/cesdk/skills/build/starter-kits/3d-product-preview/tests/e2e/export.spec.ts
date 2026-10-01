import {
  download,
  expect,
  exportCalls,
  pdfPageCount,
  pngSize,
  spyExport,
  test
} from '@imgly/kit-test-harness';
import { Preview, firstPageSize, waitForModel } from './preview';

test.describe('Export', () => {
  test('P3D-08 export PDF', async ({ kit }) => {
    const preview = new Preview(kit.page);
    await spyExport(kit.page);
    const pages = await kit.page.evaluate(
      (handle) => handle.engine.scene.getPages().length,
      kit.editor
    );

    await preview.actionsDropdown().click();
    const [file] = await download(kit.page, () =>
      kit.page.getByRole('button', { name: 'Export PDF' }).click()
    );

    expect(file.name.endsWith('.pdf')).toBe(true);
    expect(await pdfPageCount(file.buffer)).toBe(pages);
    const calls = await exportCalls(kit.page);
    expect(calls).toHaveLength(1);
    expect(calls[0].options).toMatchObject({ mimeType: 'application/pdf' });
  });

  test('P3D-09 export image', async ({ kit }) => {
    const preview = new Preview(kit.page);
    const size = await firstPageSize(kit);
    await spyExport(kit.page);

    const [file] = await download(kit.page, () =>
      preview.navigationBar
        .getByRole('button', { name: 'Export Images' })
        .click()
    );

    expect(file.name.endsWith('.png')).toBe(true);
    const pixels = pngSize(file.buffer);
    expect(pixels.width / pixels.height).toBeCloseTo(
      size.width / size.height,
      1
    );
    const calls = await exportCalls(kit.page);
    expect(calls).toHaveLength(1);
    expect(calls[0].options).toMatchObject({ mimeType: 'image/png' });
    // The navigation-bar entry passes no target size, so the page's own pixel
    // size decides, not the 1080 x 1080 the kit once hardcoded.
    expect(calls[0].options?.targetWidth).toBeUndefined();
    expect(calls[0].options?.targetHeight).toBeUndefined();
  });
});

test.describe('Failure path', () => {
  test('P3D-10 a failed texture render reports itself', async ({ kit }) => {
    const preview = new Preview(kit.page);
    await waitForModel(kit.page);
    await kit.page.route('**/textures/Material_baseColor.scene', (route) =>
      route.fulfill({ status: 200, body: 'not a scene' })
    );

    await preview.product('Business Card').click();

    await expect(kit.page.getByRole('alert')).toBeVisible({ timeout: 90_000 });
    await expect(kit.page.getByRole('alert')).toContainText(
      'The texture could not be rendered.'
    );
    await expect(preview.product('Apparel')).toBeEnabled();
  });
});

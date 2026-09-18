import {
  download,
  exportCalls,
  expect,
  pdfPageCount,
  pngSize,
  spyExport,
  test
} from '@imgly/kit-test-harness';
import { Preview, firstPageSize } from './preview';

test.describe('Export', () => {
  test('PP-10 export PDF', async ({ kit }) => {
    const preview = new Preview(kit.page);
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
  });

  test('PP-11 export image', async ({ kit }) => {
    const preview = new Preview(kit.page);
    await spyExport(kit.page);
    const size = await firstPageSize(kit);

    const [file] = await download(kit.page, () =>
      preview.designNavigationBar
        .getByRole('button', { name: 'Export Images' })
        .click()
    );

    expect(file.name.endsWith('.png')).toBe(true);
    // The navigation-bar entry passes no target size, so the PNG comes out at
    // the page's own pixel size, not the 1080 x 1080 the kit once hardcoded.
    // The placeholder exports the mockup renderer asks for always carry a
    // target size; the navigation bar's own export is the one that does not.
    const untargeted = (await exportCalls(kit.page)).filter(
      (call) => call.options?.targetWidth == null
    );
    expect(untargeted).toHaveLength(1);
    expect(untargeted[0].options).toMatchObject({ mimeType: 'image/png' });
    const pixels = pngSize(file.buffer);
    expect(pixels.width / pixels.height).toBeCloseTo(
      size.width / size.height,
      1
    );
    expect(pixels).not.toEqual({ width: 1080, height: 1080 });
  });
});

test.describe('Failure path', () => {
  test('PP-12 a failed mockup render reports itself', async ({ kit }) => {
    const preview = new Preview(kit.page);
    await expect(preview.image).toBeVisible();
    // A 200 with a body the engine cannot load; a 500 would also fire the
    // console guard with the browser's own network error.
    await kit.page.route('**/apparel-mockup.scene', (route) =>
      route.fulfill({ status: 200, body: 'not a scene' })
    );

    await preview.product('Apparel').click();

    await expect(kit.page.getByRole('alert')).toBeVisible({ timeout: 60_000 });
    await expect(kit.page.getByRole('alert')).toContainText(
      'The mockup could not be rendered.'
    );
    await expect(preview.product('Poster')).toBeEnabled();
  });
});

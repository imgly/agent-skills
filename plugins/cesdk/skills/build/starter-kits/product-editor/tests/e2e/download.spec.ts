import {
  download,
  expect,
  pdfPageCount,
  pngSize,
  test
} from '@imgly/kit-test-harness';
import { ProductEditor, sceneMetadata } from './product-editor';

test.describe('Download', () => {
  test('PE-12 no export in the navigation bar; "here" downloads the bundle', async ({
    kit
  }) => {
    const editor = new ProductEditor(kit.page);
    const navigationBar = kit.page.getByRole('region', {
      name: 'Navigation Bar'
    });

    await expect(
      navigationBar.getByRole('button', { name: 'Undo' })
    ).toBeVisible();
    await expect(
      navigationBar.getByRole('button', { name: /Export/ })
    ).toHaveCount(0);
    await expect(
      navigationBar.getByRole('button', { name: 'Actions' })
    ).toHaveCount(0);

    const files = await download(
      kit.page,
      () => editor.downloadLink.click(),
      5
    );

    const names = files.map((file) => file.name).sort();
    expect(names.filter((name) => name.endsWith('-front.pdf'))).toHaveLength(1);
    expect(names.filter((name) => name.endsWith('-back.pdf'))).toHaveLength(1);
    expect(names.filter((name) => name.endsWith('.imgly'))).toHaveLength(1);
    const thumbnails = files.filter((file) =>
      file.name.startsWith('scene-thumbnail-')
    );
    expect(thumbnails).toHaveLength(2);
    thumbnails.forEach((file) =>
      expect(pngSize(file.buffer)).toEqual({ width: 200, height: 200 })
    );
    for (const pdf of files.filter((file) => file.name.endsWith('.pdf'))) {
      expect(await pdfPageCount(pdf.buffer)).toBe(1);
    }
  });

  test('PE-13 a one-area product downloads three files', async ({ kit }) => {
    const editor = new ProductEditor(kit.page);

    await editor.product('Coffee Mug').click();
    await expect
      .poll(async () => sceneMetadata<{ id: string }>(kit, 'product'))
      .toMatchObject({ id: 'mug' });

    const files = await download(
      kit.page,
      () => editor.downloadLink.click(),
      3
    );

    expect(files.filter((file) => file.name.endsWith('.pdf'))).toHaveLength(1);
    expect(files.filter((file) => file.name.endsWith('.imgly'))).toHaveLength(
      1
    );
    const [thumbnail] = files.filter((file) => file.name.endsWith('.png'));
    // targetWidth/targetHeight bound the export, so a non-square page keeps
    // its aspect ratio inside the 200 px box.
    expect(pngSize(thumbnail.buffer).width).toBe(200);
  });
});

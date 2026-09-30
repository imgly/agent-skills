import {
  download,
  editorRoot,
  expect,
  pdfPageCount,
  pngSize,
  test
} from '@imgly/kit-test-harness';
import { Designer } from './designer';

test.describe('Sizes, price and cart', () => {
  test('TSD-09 default quantities and price', async ({ kit }) => {
    const designer = new Designer(kit.page);

    await expect(designer.sidebar.getByText('XS')).toBeVisible();
    const values = await designer.sidebar
      .getByRole('spinbutton')
      .evaluateAll((inputs) =>
        inputs.map((input) => (input as HTMLInputElement).value)
      );
    expect(values).toEqual(['0', '0', '1', '1', '0']);
    await expect(designer.cartButton).toHaveText('39,98 € • Add to Cart');
    await expect(designer.cartButton).toBeEnabled();
  });

  test('TSD-10 quantity changes drive the price', async ({ kit }) => {
    const designer = new Designer(kit.page);

    await designer.quantity(4).fill('3');
    await expect(designer.cartButton).toHaveText('99,95 € • Add to Cart');

    for (const index of [2, 3, 4]) {
      await designer.quantity(index).fill('0');
    }

    await expect(designer.cartButton).toHaveText('0,00 € • Add to Cart');
    await expect(designer.cartButton).toBeDisabled();
  });

  test('TSD-11 Add to Cart reports the selection', async ({ kit }) => {
    const designer = new Designer(kit.page);
    const messages: string[] = [];
    kit.page.on('dialog', (dialog) => {
      messages.push(dialog.message());
      void dialog.dismiss();
    });

    await designer.swatch('Blue').click();
    await designer.cartButton.click();

    await expect.poll(() => messages).toHaveLength(1);
    expect(messages[0]).toContain('Added 2 Mens T-Shirt(s) to cart!');
    expect(messages[0]).toContain('Color: blue');
    // Test plan issue 3: the sidebar prices in euro, the alert in dollars.
    expect(messages[0]).toContain('Total: $39.98');
  });
});

test.describe('Download', () => {
  test('TSD-12 the "here" link downloads the bundle', async ({ kit }) => {
    const designer = new Designer(kit.page);
    const editor = editorRoot(kit.page);

    await expect(editor.getByRole('button', { name: /Export/ })).toHaveCount(0);

    const files = await download(
      kit.page,
      () => designer.downloadLink.click(),
      5
    );

    const names = files.map((file) => file.name);
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

  test('TSD-13 the canvas bar offers no page-add button', async ({ kit }) => {
    const canvas = kit.page.getByRole('region', { name: 'Canvas' });

    await expect(
      canvas.getByRole('button', { name: 'Edit: Document' })
    ).toBeVisible();
    // One page per decoration area: a page added here would have no
    // backdrop, no area button, and would still land in the download bundle.
    await expect(canvas.getByRole('button', { name: /Add Page/i })).toHaveCount(
      0
    );
  });
});

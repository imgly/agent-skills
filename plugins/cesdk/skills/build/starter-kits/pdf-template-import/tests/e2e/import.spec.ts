import { download, expect, test } from '@imgly/kit-test-harness';

import { EXAMPLES, KitApp, SMALLEST_DEMO_FILE } from './kit-app';

const HOLD_MS = 1500;

async function hold(route: { continue: () => Promise<void> }): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, HOLD_MS));
  await route.continue();
}

test.describe('Import', () => {
  test('PDF-02 a file picked in the dialog is imported', async ({ page }) => {
    const app = new KitApp(page);
    await app.open();

    await app.upload(SMALLEST_DEMO_FILE);
    await app.waitForResult();

    await expect(page.getByAltText('Imported Result')).toBeVisible();
    await expect(page.getByText('No Preview Available')).toBeVisible();
    await expect(page.getByAltText('Original PDF File')).toHaveCount(0);
  });

  test('PDF-03 an example reports loading, then processing, then both previews', async ({
    page
  }) => {
    const app = new KitApp(page);
    await app.open();

    // Holding the two slowest requests makes the two states observable.
    await page.route('**/*.pdf', hold);
    await page.route('**/*.wasm', hold);

    await app.example(EXAMPLES[2]).click();
    await expect(page.getByText('Loading PDF file...')).toBeVisible();
    await expect(page.getByText('Processing PDF file...')).toBeVisible();
    await expect(page.getByText(/^\d+\.\d\ds$/)).toBeVisible();

    await app.waitForResult();
    await expect(page.getByAltText('Original PDF File')).toBeVisible();
    await expect(page.getByAltText('Imported Result')).toBeVisible();
  });

  test('PDF-07 the result screen puts the two files side by side', async ({
    page
  }) => {
    const app = new KitApp(page);
    await app.open();
    await app.importExample(EXAMPLES[2]);

    await expect(page.getByRole('heading', { name: 'PDF File' })).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Imported Result' })
    ).toBeVisible();
    await expect(page.getByText('PNG Preview')).toHaveCount(2);
    await expect(app.edit).toBeVisible();
    await expect(app.downloadArchive).toBeVisible();
  });

  test('PDF-08 the parser warnings are grouped in a badge', async ({
    page
  }) => {
    const app = new KitApp(page);
    await app.open();
    await app.importExample(EXAMPLES[0]);

    const badge = page.getByRole('button', { name: /Warnings?$/ });
    await expect(badge).toBeVisible();
    await expect(page.getByRole('button', { name: /Errors?$/ })).toHaveCount(0);

    await badge.click();
    const messages = await page.getByRole('listitem').allTextContents();
    expect(messages.length).toBeGreaterThan(0);
    for (const message of messages) {
      expect(message).toMatch(/\(\d+ occurrences?\)$/);
    }
  });

  test('PDF-09 the archive downloads under the imported file name', async ({
    page
  }) => {
    const app = new KitApp(page);
    await app.open();
    await app.importExample(EXAMPLES[0]);

    const files = await download(page, () => app.downloadArchive.click());

    expect(files).toHaveLength(1);
    expect(files[0].name).toBe('postcard.imgly');
    expect(files[0].buffer.subarray(0, 2).toString()).toBe('PK');
  });

  test('PDF-10 New File returns to the selection screen', async ({ page }) => {
    const app = new KitApp(page);
    await app.open();
    await app.importExample(EXAMPLES[2]);

    await app.newFile.click();

    await expect(app.uploadInput).toBeAttached();
    await expect(page.getByAltText('Imported Result')).toHaveCount(0);
    for (const name of EXAMPLES) {
      await expect(app.example(name)).toBeVisible();
    }
  });

  test('PDF-06 each of the three examples imports', async ({ page }) => {
    test.slow();
    const app = new KitApp(page);
    await app.open();

    for (const name of EXAMPLES) {
      await app.importExample(name);
      await expect(page.getByAltText('Imported Result')).toBeVisible();

      const files = await download(page, () => app.downloadArchive.click());
      expect(files[0].buffer.subarray(0, 2).toString()).toBe('PK');

      await app.newFile.click();
      await expect(app.uploadInput).toBeAttached();
    }
  });
});

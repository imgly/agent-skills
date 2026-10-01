import { expect, test } from '@imgly/kit-test-harness';
import type { JSHandle, Page } from '@playwright/test';
import type { KitEditor } from '@imgly/kit-test-harness';
import { openTemplate } from './postcard';
import { FIXTURE_IMAGE, mockUnsplash } from './unsplash';

/** A 1x1 PNG, small enough to inline and real enough for `new Image()`. */
const PNG = Buffer.from(FIXTURE_IMAGE.split(',')[1], 'base64');

let unsplashRequests: string[] = [];

test.beforeEach(async ({ page }) => {
  unsplashRequests = await mockUnsplash(page);
});

const thumbnails = (page: Page) =>
  page.getByRole('button', { name: 'sample asset' });

const uploadedAssetIds = (
  page: Page,
  editor: JSHandle<KitEditor>
): Promise<string[]> =>
  page.evaluate(async (handle) => {
    const result = await handle.engine.asset.findAssets('ly.img.image.upload', {
      page: 0,
      perPage: 9999
    });
    return result.assets.map((asset: { id: string }) => asset.id);
  }, editor);

function frontBlocks(page: Page, editor: JSHandle<KitEditor>) {
  return page.evaluate((handle) => {
    const engine = handle.engine;
    const front = engine.scene.getPages()[0];
    const image = engine.block
      .getChildren(front)
      .find((id: number) => engine.block.getKind(id) === 'image');
    return { front, image, children: engine.block.getChildren(front).length };
  }, editor);
}

function fillUri(
  page: Page,
  editor: JSHandle<KitEditor>,
  block: number
): Promise<string> {
  return page.evaluate(
    ({ handle, id }) =>
      handle.engine.block.getString(
        handle.engine.block.getFill(id),
        'fill/image/imageFileURI'
      ),
    { handle: editor, id: block }
  );
}

async function uploadFiles(
  page: Page,
  files: { name: string; mimeType: string; buffer: Buffer }[]
): Promise<void> {
  const chooser = page.waitForEvent('filechooser');
  await page.getByRole('button', { name: 'Upload' }).click();
  await (await chooser).setFiles(files);
}

test('PC-07 add a pre-loaded image', async ({ page }) => {
  const editor = await openTemplate(page);
  const before = await frontBlocks(page, editor);

  await page.getByRole('button', { name: 'Image' }).click();
  await thumbnails(page).first().click();

  // The kit queries Unsplash with the chosen template's keyword.
  const queries = unsplashRequests
    .map((url) => new URL(url).searchParams.get('query'))
    .filter((query) => query != null);
  expect(queries).toContain('Thank you flowers');
  expect(unsplashRequests.some((url) => url.endsWith('/download'))).toBe(true);

  await expect
    .poll(async () => (await frontBlocks(page, editor)).children)
    .toBe(before.children + 1);
  const selected = await page.evaluate(
    (handle) => handle.engine.block.findAllSelected()[0],
    editor
  );
  expect(await fillUri(page, editor, selected)).toBe(FIXTURE_IMAGE);
});

test('PC-08 upload an image', async ({ page }) => {
  const editor = await openTemplate(page);
  await page.getByRole('button', { name: 'Image' }).click();
  await expect(thumbnails(page)).toHaveCount(1);

  await uploadFiles(page, [
    { name: 'first.png', mimeType: 'image/png', buffer: PNG },
    { name: 'second.png', mimeType: 'image/png', buffer: PNG }
  ]);
  await expect.poll(() => uploadedAssetIds(page, editor)).toHaveLength(2);

  // Applying an upload selects the new block, which swaps the dock for the
  // image adjustment bar; its Replace panel shows the refreshed list.
  await page.getByRole('button', { name: 'Replace' }).click();
  await expect(thumbnails(page)).toHaveCount(3);

  const uploaded = await uploadedAssetIds(page, editor);
  // The kit reverses the uploads, so the newest one leads the list.
  await expect(thumbnails(page).first().locator('img')).toHaveAttribute(
    'src',
    uploaded[1]
  );
});

test('PC-09 replace a sample image with a pre-loaded one', async ({ page }) => {
  const editor = await openTemplate(page);
  const { image, children } = await frontBlocks(page, editor);
  await page.evaluate(
    ({ handle, id }) => handle.engine.block.setSelected(id, true),
    { handle: editor, id: image }
  );
  // The block is a placeholder, so the kit opens the Replace bar by itself.
  await expect(thumbnails(page).first()).toBeVisible();
  const before = await fillUri(page, editor, image);

  await thumbnails(page).first().click();

  await expect.poll(() => fillUri(page, editor, image)).not.toBe(before);
  expect(await fillUri(page, editor, image)).toBe(FIXTURE_IMAGE);
  expect((await frontBlocks(page, editor)).children).toBe(children);
});

test('PC-10 replace a sample image with an uploaded one', async ({ page }) => {
  const editor = await openTemplate(page);
  const { image } = await frontBlocks(page, editor);
  await page.evaluate(
    ({ handle, id }) => handle.engine.block.setSelected(id, true),
    { handle: editor, id: image }
  );
  await expect(thumbnails(page).first()).toBeVisible();

  await uploadFiles(page, [
    { name: 'upload.png', mimeType: 'image/png', buffer: PNG }
  ]);
  await expect.poll(() => uploadedAssetIds(page, editor)).toHaveLength(1);
  await page.evaluate(
    ({ handle, id }) => handle.engine.block.setSelected(id, true),
    { handle: editor, id: image }
  );
  await expect(thumbnails(page)).toHaveCount(2);
  await thumbnails(page).first().click();

  await expect.poll(() => fillUri(page, editor, image)).toMatch(/^blob:/);
});

test('PC-11 replacing a sample image clears the placeholder UI', async ({
  page
}) => {
  const editor = await openTemplate(page);
  const { image } = await frontBlocks(page, editor);
  const placeholderEnabled = () =>
    page.evaluate(
      ({ handle, id }) => handle.engine.block.isPlaceholderEnabled(id),
      { handle: editor, id: image }
    );

  await page.evaluate(
    ({ handle, id }) => handle.engine.block.setSelected(id, true),
    { handle: editor, id: image }
  );
  expect(await placeholderEnabled()).toBe(true);
  await expect(page.getByRole('button', { name: 'Crop' })).toBeDisabled();

  await thumbnails(page).first().click();

  await expect.poll(placeholderEnabled).toBe(false);
  await expect(page.getByRole('button', { name: 'Crop' })).toBeEnabled();
});

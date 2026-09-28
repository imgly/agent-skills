import { expect, test, type Kit } from '@imgly/kit-test-harness';
import { FIXTURE_IMAGE, mockUnsplash } from './unsplash';

/** A 1x1 PNG, small enough to inline and real enough for `new Image()`. */
const PNG = Buffer.from(FIXTURE_IMAGE.split(',')[1], 'base64');

let unsplashRequests: string[] = [];

test.beforeEach(async ({ page }) => {
  unsplashRequests = await mockUnsplash(page);
});

const thumbnails = (kit: Kit) =>
  kit.page.getByRole('button', { name: 'sample asset' });

const uploadedAssetIds = (kit: Kit): Promise<string[]> =>
  kit.page.evaluate(async (handle) => {
    const result = await handle.engine.asset.findAssets('ly.img.image.upload', {
      page: 0,
      perPage: 9999
    });
    return result.assets.map((asset: { id: string }) => asset.id);
  }, kit.editor);

/** Select a block through the engine; the kit's selection context follows. */
async function select(kit: Kit, block: number): Promise<void> {
  await kit.page.evaluate(
    ({ handle, id }) => handle.engine.block.setSelected(id, true),
    { handle: kit.editor, id: block }
  );
}

/** The image block on the page, and the garment backdrop above the stack. */
function sceneBlocks(kit: Kit) {
  return kit.page.evaluate((handle) => {
    const engine = handle.engine;
    const page = engine.scene.getPages()[0];
    const image = engine.block
      .getChildren(page)
      .find((id: number) => engine.block.getKind(id) === 'image');
    const backdrop = engine.block
      .getChildren(engine.scene.get())
      .find((id: number) => engine.block.getKind(id) === 'image');
    return { page, image, backdrop };
  }, kit.editor);
}

function fillUri(kit: Kit, block: number): Promise<string> {
  return kit.page.evaluate(
    ({ handle, id }) =>
      handle.engine.block.getString(
        handle.engine.block.getFill(id),
        'fill/image/imageFileURI'
      ),
    { handle: kit.editor, id: block }
  );
}

async function uploadFiles(
  kit: Kit,
  files: { name: string; mimeType: string; buffer: Buffer }[]
): Promise<void> {
  const chooser = kit.page.waitForEvent('filechooser');
  await kit.page.getByRole('button', { name: 'Upload' }).click();
  await (await chooser).setFiles(files);
}

test('AP-10 add a pre-loaded image', async ({ kit }) => {
  const { page: pageBlock } = await sceneBlocks(kit);
  const before = await kit.page.evaluate(
    ({ handle, id }) => handle.engine.block.getChildren(id).length,
    { handle: kit.editor, id: pageBlock }
  );

  await kit.page.getByRole('button', { name: 'Image' }).click();
  await thumbnails(kit).first().click();

  expect(unsplashRequests.some((url) => url.includes('query=Skateboard'))).toBe(
    true
  );
  expect(unsplashRequests.some((url) => url.endsWith('/download'))).toBe(true);

  await expect
    .poll(() =>
      kit.page.evaluate(
        ({ handle, id }) => handle.engine.block.getChildren(id).length,
        { handle: kit.editor, id: pageBlock }
      )
    )
    .toBe(before + 1);

  const selected = await kit.page.evaluate(
    (handle) => handle.engine.block.findAllSelected()[0],
    kit.editor
  );
  // The tracked-download endpoint's URL, not the asset's `meta.uri`.
  expect(await fillUri(kit, selected)).toBe(FIXTURE_IMAGE);
});

test('AP-11 upload an image', async ({ kit }) => {
  await kit.page.getByRole('button', { name: 'Image' }).click();
  await expect(thumbnails(kit)).toHaveCount(1);

  await uploadFiles(kit, [
    { name: 'first.png', mimeType: 'image/png', buffer: PNG },
    { name: 'second.png', mimeType: 'image/png', buffer: PNG }
  ]);
  await expect.poll(() => uploadedAssetIds(kit)).toHaveLength(2);

  // Applying an upload selects the new block, which swaps the dock for the
  // image adjustment bar; its Replace panel shows the refreshed list.
  await kit.page.getByRole('button', { name: 'Replace' }).click();
  await expect(thumbnails(kit)).toHaveCount(3);

  const uploaded = await uploadedAssetIds(kit);
  // The kit reverses the uploads, so the newest one leads the list.
  await expect(thumbnails(kit).first().locator('img')).toHaveAttribute(
    'src',
    uploaded[1]
  );
});

test('AP-12 replace an image with a pre-loaded one', async ({ kit }) => {
  const { page: pageBlock, image } = await sceneBlocks(kit);
  await select(kit, image);
  // The block is a placeholder, so the kit opens the Replace bar by itself.
  await expect(thumbnails(kit).first()).toBeVisible();
  const before = await fillUri(kit, image);

  await thumbnails(kit).first().click();

  await expect.poll(() => fillUri(kit, image)).not.toBe(before);
  expect(await fillUri(kit, image)).toBe(FIXTURE_IMAGE);
  const count = await kit.page.evaluate(
    ({ handle, id }) => handle.engine.block.getChildren(id).length,
    { handle: kit.editor, id: pageBlock }
  );
  expect(count).toBe(3);
});

test('AP-13 replace an image with an uploaded one', async ({ kit }) => {
  const { image } = await sceneBlocks(kit);
  await select(kit, image);
  await expect(thumbnails(kit).first()).toBeVisible();

  await uploadFiles(kit, [
    { name: 'upload.png', mimeType: 'image/png', buffer: PNG }
  ]);
  await expect.poll(() => uploadedAssetIds(kit)).toHaveLength(1);
  await select(kit, image);
  await expect(thumbnails(kit)).toHaveCount(2);
  await thumbnails(kit).first().click();

  await expect.poll(() => fillUri(kit, image)).toMatch(/^blob:/);
});

test('AP-14 replacing a sample image clears the placeholder UI', async ({
  kit
}) => {
  const { image } = await sceneBlocks(kit);
  await select(kit, image);
  const placeholderBefore = await kit.page.evaluate(
    ({ handle, id }) => handle.engine.block.isPlaceholderEnabled(id),
    { handle: kit.editor, id: image }
  );
  expect(placeholderBefore).toBe(true);
  await expect(kit.page.getByRole('button', { name: 'Crop' })).toBeDisabled();

  await thumbnails(kit).first().click();

  await expect
    .poll(() =>
      kit.page.evaluate(
        ({ handle, id }) => handle.engine.block.isPlaceholderEnabled(id),
        { handle: kit.editor, id: image }
      )
    )
    .toBe(false);
  await expect(kit.page.getByRole('button', { name: 'Crop' })).toBeEnabled();
});

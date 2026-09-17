import { editorPanel, expect, test } from '@imgly/kit-test-harness';
import type { JSHandle, Page } from '@playwright/test';

const PANEL = '//ly.img.panel/assetLibrary';
const REPLACE_PANEL = '//ly.img.panel/assetLibrary.replace';

interface Kit {
  page: Page;
  editor: JSHandle<{ engine: any }>;
}

interface PageContent {
  page: number;
  pages: number;
  children: number;
  texts: string[];
  images: string[];
}

async function readPage(kit: Kit): Promise<PageContent> {
  return kit.page.evaluate((handle) => {
    const engine = handle.engine;
    // The demo scene's images carry a source set rather than a plain file URI.
    const imageUri = (block: number): string => {
      const fill = engine.block.getFill(block);
      const uri = engine.block.getString(fill, 'fill/image/imageFileURI');
      if (uri !== '') return uri;
      const sourceSet = engine.block.getSourceSet(fill, 'fill/image/sourceSet');
      return sourceSet.length > 0 ? sourceSet[0].uri : '';
    };
    const page = engine.scene.getCurrentPage();
    const children = engine.block.getChildren(page);
    return {
      page,
      pages: engine.scene.getPages().length,
      children: children.length,
      texts: children
        .filter((child: number) => engine.block.getType(child).includes('text'))
        .map((child: number) => engine.block.getString(child, 'text/text')),
      images: children
        .filter((child: number) => engine.block.getKind(child) === 'image')
        .map(imageUri)
    };
  }, kit.editor);
}

async function selectedImage(kit: Kit): Promise<{
  uri: string;
  placeholder: boolean;
}> {
  return kit.page.evaluate((handle) => {
    const engine = handle.engine;
    const block = engine.block.findAllSelected()[0];
    const fill = engine.block.getFill(block);
    const plain = engine.block.getString(fill, 'fill/image/imageFileURI');
    const sourceSet = engine.block.getSourceSet(fill, 'fill/image/sourceSet');
    return {
      uri: plain !== '' ? plain : (sourceSet[0]?.uri ?? ''),
      placeholder: engine.block.isPlaceholderBehaviorEnabled(block)
    };
  }, kit.editor);
}

function contentOf(content: PageContent): string {
  return JSON.stringify([content.texts, content.images]);
}

async function applyLayout(kit: Kit, name: string): Promise<void> {
  await kit.page.getByRole('button', { name: 'Layouts' }).click();
  await editorPanel(kit.page, PANEL)
    .getByRole('button', { name })
    .first()
    .click();
}

test.describe('Applying a layout', () => {
  test('LAY-03 apply a layout', async ({ kit }) => {
    const before = await readPage(kit);
    expect(before.texts.length).toBeGreaterThan(0);
    expect(before.images.every((uri) => uri !== '')).toBe(true);

    await applyLayout(kit, 'layout with 2 images');

    await expect
      .poll(async () => (await readPage(kit)).children)
      .not.toBe(before.children);
    const after = await readPage(kit);

    expect(after.page).toBe(before.page);
    expect(after.pages).toBe(before.pages);
    expect(after.images).toHaveLength(2);
    // The layout's slots are filled from the old page top to bottom, so the
    // content that fits comes across and nothing new is invented.
    expect(before.images).toEqual(expect.arrayContaining(after.images));
    expect(before.texts).toEqual(expect.arrayContaining(after.texts));
    expect(after.texts.length).toBeGreaterThan(0);
  });

  test('LAY-04 undo returns to the previous layout', async ({ kit }) => {
    const before = await readPage(kit);

    await applyLayout(kit, 'layout with 2 images');
    await expect
      .poll(async () => (await readPage(kit)).children)
      .not.toBe(before.children);

    await kit.page.getByRole('button', { name: 'Undo' }).click();

    await expect
      .poll(async () => (await readPage(kit)).children)
      .toBe(before.children);
    const restored = await readPage(kit);
    expect(restored.texts).toEqual(before.texts);
    expect(restored.images).toEqual(before.images);
    // One undo step, so the editor is back at the start of the history.
    await expect(kit.page.getByRole('button', { name: 'Undo' })).toBeDisabled();
  });

  test('LAY-05 replace a sample image keeps the placeholder UI', async ({
    kit
  }) => {
    await kit.page.evaluate((handle) => {
      const engine = handle.engine;
      engine.block
        .findAllSelected()
        .forEach((block: number) => engine.block.setSelected(block, false));
      const image = engine.block
        .findAll()
        .find((block: number) => engine.block.getKind(block) === 'image');
      engine.block.setSelected(image, true);
    }, kit.editor);
    const before = await selectedImage(kit);

    await kit.page.getByRole('button', { name: 'Replace Image' }).click();
    const panel = editorPanel(kit.page, REPLACE_PANEL);
    await panel.getByRole('button', { name: 'Mountains', exact: true }).click();

    await expect
      .poll(async () => (await selectedImage(kit)).uri)
      .not.toBe(before.uri);
    expect((await selectedImage(kit)).placeholder).toBe(before.placeholder);
  });

  test('LAY-06 applying a second layout replaces the first', async ({
    kit
  }) => {
    await applyLayout(kit, 'layout with 2 images');
    await expect.poll(async () => (await readPage(kit)).images.length).toBe(2);
    const first = await readPage(kit);

    await applyLayout(kit, 'layout with 3 images');
    await expect
      .poll(async () => contentOf(await readPage(kit)))
      .not.toBe(contentOf(first));
  });
});

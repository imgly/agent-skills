import { editorPanel, expect, test } from '@imgly/kit-test-harness';
import { mockUnsplashProxy } from './unsplash-proxy';

const PANEL = '//ly.img.panel/assetLibrary';
const REPLACE_PANEL = '//ly.img.panel/assetLibrary.replace';

test.describe('Unsplash library', () => {
  test('UNS-02 the Unsplash panel lists photos', async ({ kit }) => {
    const proxy = await mockUnsplashProxy(kit.page);

    await kit.page.getByRole('button', { name: 'Unsplash' }).click();
    const panel = editorPanel(kit.page, PANEL);
    await expect(
      panel.getByRole('button', { name: 'Unsplash popular-p1-0' })
    ).toBeVisible();

    expect(proxy.requests).toHaveLength(1);
    expect(proxy.requests[0].pathname).toBe('/photos');
    expect(proxy.requests[0].searchParams.get('order_by')).toBe('popular');
    expect(proxy.requests[0].searchParams.get('page')).toBe('1');
    expect(
      Number(proxy.requests[0].searchParams.get('per_page'))
    ).toBeGreaterThan(0);
  });

  test('UNS-03 search calls the search endpoint', async ({ kit }) => {
    const proxy = await mockUnsplashProxy(kit.page);

    await kit.page.getByRole('button', { name: 'Unsplash' }).click();
    const panel = editorPanel(kit.page, PANEL);
    await expect(
      panel.getByRole('button', { name: 'Unsplash popular-p1-0' })
    ).toBeVisible();

    await panel.getByRole('textbox').fill('mountains');

    await expect(
      panel.getByRole('button', { name: 'Unsplash search-p1-0' })
    ).toBeVisible();
    expect(proxy.requests.at(-1)?.pathname).toBe('/search/photos');
    expect(proxy.requests.at(-1)?.searchParams.get('query')).toBe('mountains');
    expect(proxy.requests.at(-1)?.searchParams.get('page')).toBe('1');
  });

  test('UNS-04 scrolling requests the next page', async ({ kit }) => {
    const proxy = await mockUnsplashProxy(kit.page);

    await kit.page.getByRole('button', { name: 'Unsplash' }).click();
    const panel = editorPanel(kit.page, PANEL);
    await panel
      .getByRole('button', { name: 'Unsplash popular-p1-29' })
      .scrollIntoViewIfNeeded();

    // The first scroll must ask for Unsplash page 2, not page 1 again.
    await expect(
      panel.getByRole('button', { name: 'Unsplash popular-p2-0' })
    ).toBeVisible();
    expect(proxy.requests.map((url) => url.searchParams.get('page'))).toEqual([
      '1',
      '2'
    ]);

    // Every photo has been fetched, so the panel must stop asking.
    await panel
      .getByRole('button', { name: 'Unsplash popular-p2-29' })
      .scrollIntoViewIfNeeded();
    await kit.page.waitForTimeout(1000);
    expect(proxy.requests).toHaveLength(2);
  });

  test('UNS-05 apply a photo to the canvas', async ({ kit }) => {
    await mockUnsplashProxy(kit.page);
    const before = await kit.page.evaluate(
      (handle) => handle.engine.block.findAll().length,
      kit.editor
    );

    await kit.page.getByRole('button', { name: 'Unsplash' }).click();
    const panel = editorPanel(kit.page, PANEL);
    await panel.getByRole('button', { name: 'Unsplash popular-p1-0' }).click();

    const applied = await kit.page.evaluate((handle) => {
      const engine = handle.engine;
      const block = engine.block.findAllSelected()[0];
      return {
        total: engine.block.findAll().length,
        type: engine.block.getType(block),
        uri: engine.block.getString(
          engine.block.getFill(block),
          'fill/image/imageFileURI'
        )
      };
    }, kit.editor);

    expect(applied.total).toBe(before + 1);
    expect(applied.type).toBe('//ly.img.ubq/graphic');
    expect(applied.uri).toBe(
      'https://images.unsplash.test/popular-p1-0/full.png'
    );
  });

  test('UNS-06 replace a sample image offers Unsplash only', async ({
    kit
  }) => {
    await mockUnsplashProxy(kit.page);

    const isPlaceholder = await kit.page.evaluate((handle) => {
      const engine = handle.engine;
      engine.block
        .findAllSelected()
        .forEach((block: number) => engine.block.setSelected(block, false));
      const image = engine.block
        .findAll()
        .find((block: number) => engine.block.getKind(block) === 'image');
      engine.block.setSelected(image, true);
      return engine.block.isPlaceholderBehaviorEnabled(image);
    }, kit.editor);

    await kit.page.getByRole('button', { name: 'Replace Image' }).click();
    const panel = editorPanel(kit.page, REPLACE_PANEL);
    await expect(
      panel.getByRole('button', { name: 'Unsplash popular-p1-0' })
    ).toBeVisible();
    // The panel offers no other library to switch to.
    await expect(
      panel.getByRole('button', { name: 'Images', exact: true })
    ).toHaveCount(0);
    await expect(
      panel.getByRole('button', { name: 'Uploads', exact: true })
    ).toHaveCount(0);

    await panel.getByRole('button', { name: 'Unsplash popular-p1-0' }).click();

    const after = await kit.page.evaluate((handle) => {
      const engine = handle.engine;
      const block = engine.block.findAllSelected()[0];
      return {
        uri: engine.block.getString(
          engine.block.getFill(block),
          'fill/image/imageFileURI'
        ),
        placeholder: engine.block.isPlaceholderBehaviorEnabled(block)
      };
    }, kit.editor);

    expect(after.uri).toBe(
      'https://images.unsplash.test/popular-p1-0/full.png'
    );
    expect(after.placeholder).toBe(isPlaceholder);
  });
});

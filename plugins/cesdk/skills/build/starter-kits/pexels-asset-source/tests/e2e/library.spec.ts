import { editorPanel, expect, test } from '@imgly/kit-test-harness';
import { API_KEY, mockPexelsApi } from './pexels-api';

const PANEL = '//ly.img.panel/assetLibrary';
const REPLACE_PANEL = '//ly.img.panel/assetLibrary.replace';

test.describe('Pexels library', () => {
  test('PEX-02 the Pexels panel lists photos', async ({ kit }) => {
    const api = await mockPexelsApi(kit.page);

    await kit.page.getByRole('button', { name: 'Pexels' }).click();
    const panel = editorPanel(kit.page, PANEL);
    await expect(panel.getByRole('heading', { name: 'Pexels' })).toBeVisible();
    // One Close button plus a tile and an overflow button per photo.
    await expect
      .poll(() => panel.getByRole('button').count())
      .toBeGreaterThan(1);

    expect(api.requests).toHaveLength(1);
    expect(api.requests[0].url.pathname).toBe('/v1/curated');
    expect(api.requests[0].url.searchParams.get('page')).toBe('1');
    expect(
      Number(api.requests[0].url.searchParams.get('per_page'))
    ).toBeGreaterThan(0);
    expect(api.requests[0].authorization).toBe(API_KEY);
  });

  test('PEX-03 search calls the search endpoint', async ({ kit }) => {
    const api = await mockPexelsApi(kit.page);

    await kit.page.getByRole('button', { name: 'Pexels' }).click();
    const panel = editorPanel(kit.page, PANEL);
    await expect
      .poll(() => panel.getByRole('button').count())
      .toBeGreaterThan(1);

    await panel.getByRole('textbox').fill('forest');

    await expect
      .poll(() => api.requests.at(-1)?.url.pathname)
      .toBe('/v1/search');
    expect(api.requests.at(-1)?.url.searchParams.get('query')).toBe('forest');
  });

  test('PEX-04 scrolling requests the next page', async ({ kit }) => {
    const api = await mockPexelsApi(kit.page);

    await kit.page.getByRole('button', { name: 'Pexels' }).click();
    const panel = editorPanel(kit.page, PANEL);
    await expect
      .poll(() => panel.getByRole('button').count())
      .toBeGreaterThan(1);
    const firstPageButtons = await panel.getByRole('button').count();

    await panel.getByRole('button').last().scrollIntoViewIfNeeded();

    await expect
      .poll(() =>
        api.requests.map((request) => request.url.searchParams.get('page'))
      )
      .toEqual(['1', '2']);
    await expect
      .poll(() => panel.getByRole('button').count())
      .toBeGreaterThan(firstPageButtons);

    // The second page reports no next_page, so the panel must stop asking.
    await panel.getByRole('button').last().scrollIntoViewIfNeeded();
    await kit.page.waitForTimeout(1000);
    expect(api.requests).toHaveLength(2);
  });

  test('PEX-05 apply a photo to the canvas', async ({ kit }) => {
    await mockPexelsApi(kit.page);
    const before = await kit.page.evaluate(
      (handle) => handle.engine.block.findAll().length,
      kit.editor
    );

    await kit.page.getByRole('button', { name: 'Pexels' }).click();
    const panel = editorPanel(kit.page, PANEL);
    await expect
      .poll(() => panel.getByRole('button').count())
      .toBeGreaterThan(1);
    // The Close button comes first; the first photo tile follows it.
    await panel.getByRole('button').nth(1).click();

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
      'https://images.pexels.test/curated-p1-0/original.png'
    );
  });

  test('PEX-06 replace a sample image offers Pexels only', async ({ kit }) => {
    await mockPexelsApi(kit.page);

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
    await expect
      .poll(() => panel.getByRole('button').count())
      .toBeGreaterThan(1);
    // The panel offers no other library to switch to.
    await expect(
      panel.getByRole('button', { name: 'Images', exact: true })
    ).toHaveCount(0);
    await expect(
      panel.getByRole('button', { name: 'Uploads', exact: true })
    ).toHaveCount(0);

    await panel.getByRole('button').nth(1).click();

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
      'https://images.pexels.test/curated-p1-0/original.png'
    );
    expect(after.placeholder).toBe(isPlaceholder);
  });
});

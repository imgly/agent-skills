import { editorPanel, expect, test } from '@imgly/kit-test-harness';
import { mockProxy } from './getty-proxy';

const PANEL = '//ly.img.panel/assetLibrary';
const REPLACE_PANEL = '//ly.img.panel/assetLibrary.replace';

test.describe('Getty Images library', () => {
  test('GET-02 the Getty Images panel lists assets', async ({ kit }) => {
    const proxy = await mockProxy(kit.page);

    await kit.page.getByRole('button', { name: 'Getty Images' }).click();
    const panel = editorPanel(kit.page, PANEL);
    await expect(
      panel.getByRole('heading', { name: 'Getty Images' })
    ).toBeVisible();
    await expect(
      panel.getByRole('button', { name: 'Getty p1-0' })
    ).toBeVisible();

    expect(proxy.requests).toHaveLength(1);
    const query = proxy.requests[0].searchParams;
    expect(query.get('query')).toBe('business');
    expect(query.get('page')).toBe('1');
    expect(Number(query.get('perPage'))).toBeGreaterThan(0);
  });

  test('GET-03 search sends the query', async ({ kit }) => {
    const proxy = await mockProxy(kit.page);

    await kit.page.getByRole('button', { name: 'Getty Images' }).click();
    const panel = editorPanel(kit.page, PANEL);
    await expect(
      panel.getByRole('button', { name: 'Getty p1-0' })
    ).toBeVisible();

    const search = panel.getByRole('textbox');
    // The editor's search box debounces real key events: `fill` sets the value
    // without ever sending one, so the query never leaves the panel.
    await search.click();
    await search.pressSequentially('office');
    await expect(search).toHaveValue('office');

    // The library re-queries only after the request in flight settles, so the
    // typed query can take longer than the default poll budget to leave.
    await expect
      .poll(() => proxy.requests.at(-1)?.searchParams.get('query'), {
        timeout: 60_000
      })
      .toBe('office');
  });

  test('GET-04 scrolling requests the next page', async ({ kit }) => {
    const proxy = await mockProxy(kit.page);

    await kit.page.getByRole('button', { name: 'Getty Images' }).click();
    const panel = editorPanel(kit.page, PANEL);
    await panel
      .getByRole('button', { name: 'Getty p1-29' })
      .scrollIntoViewIfNeeded();

    await expect(
      panel.getByRole('button', { name: 'Getty p2-0' })
    ).toBeVisible();
    expect(proxy.requests.map((url) => url.searchParams.get('page'))).toEqual([
      '1',
      '2'
    ]);

    // The second page reports no nextPage, so the panel must stop asking.
    await panel
      .getByRole('button', { name: 'Getty p2-29' })
      .scrollIntoViewIfNeeded();
    await kit.page.waitForTimeout(1000);
    expect(proxy.requests).toHaveLength(2);
  });

  test('GET-05 apply an asset to the canvas', async ({ kit }) => {
    await mockProxy(kit.page);
    const before = await kit.page.evaluate(
      (handle) => handle.engine.block.findAll().length,
      kit.editor
    );

    await kit.page.getByRole('button', { name: 'Getty Images' }).click();
    const panel = editorPanel(kit.page, PANEL);
    await panel.getByRole('button', { name: 'Getty p1-0' }).click();

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
    expect(applied.uri).toBe('https://getty-proxy.test/images/p1-0.png');
  });

  test('GET-06 replace a sample image offers Getty Images only', async ({
    kit
  }) => {
    await mockProxy(kit.page);

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
    // Only the Getty source serves these ids, and the panel offers no other
    // library to switch to.
    await expect(
      panel.getByRole('button', { name: 'Getty p1-0' })
    ).toBeVisible();
    await expect(
      panel.getByRole('button', { name: 'Images', exact: true })
    ).toHaveCount(0);
    await expect(
      panel.getByRole('button', { name: 'Uploads', exact: true })
    ).toHaveCount(0);

    await panel.getByRole('button', { name: 'Getty p1-0' }).click();

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

    expect(after.uri).toBe('https://getty-proxy.test/images/p1-0.png');
    expect(after.placeholder).toBe(isPlaceholder);
  });
});

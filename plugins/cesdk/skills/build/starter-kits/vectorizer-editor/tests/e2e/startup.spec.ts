import { expect, test } from '@imgly/kit-test-harness';

test.describe('Start-up', () => {
  test('V-01 editor loads the demo archive', async ({ page, kit }) => {
    const scene = await page.evaluate((handle) => {
      const engine = handle.engine;
      const [first] = engine.scene.getPages();
      return {
        pages: engine.scene.getPages().length,
        width: engine.block.getWidth(first),
        height: engine.block.getHeight(first),
        unit: engine.scene.getDesignUnit(),
        graphics: engine.block
          .findAll()
          .filter(
            (id: number) => engine.block.getType(id) === '//ly.img.ubq/graphic'
          ).length
      };
    }, kit.editor);

    expect(scene).toEqual({
      pages: 1,
      width: 148,
      height: 105,
      unit: 'Millimeter',
      graphics: 8
    });

    for (const label of [
      'Templates',
      'Elements',
      'Uploads',
      'Images',
      'Text',
      'Shapes',
      'Stickers'
    ]) {
      await expect(
        kit.page.getByRole('button', { name: label, exact: true })
      ).toBeVisible();
    }
  });

  test('V-02 start-up selects an image', async ({ kit }) => {
    const selected = await kit.page.evaluate((handle) => {
      const engine = handle.engine;
      return engine.block.findAllSelected().map((id: number) => ({
        kind: engine.block.getKind(id),
        fill: engine.block.getType(engine.block.getFill(id))
      }));
    }, kit.editor);

    expect(selected).toEqual([
      { kind: 'image', fill: '//ly.img.ubq/fill/image' }
    ]);
  });

  test('V-02b the scene comes from the demo asset base URL', async ({
    page
  }) => {
    const requests: string[] = [];
    page.on('request', (request) => {
      if (request.url().endsWith('/assets/scene/scene.scene')) {
        requests.push(request.url());
      }
    });

    await page.goto('./');
    await page.waitForFunction(
      () => (window as { cesdk?: { engine?: unknown } }).cesdk?.engine != null
    );
    await expect.poll(() => requests).toHaveLength(1);
    // The demo-asset base differs per serving mode (local CDN daemon, CI's
    // /demo-data/ copy, the published CDN), so only the kit path is stable.
    expect(requests[0]).toMatch(
      /\/starterkit-vectorizer-editor\/assets\/scene\/scene\.scene$/
    );
    expect(requests[0]).not.toContain(
      '/examples/starterkit-vectorizer-editor/'
    );
  });
});

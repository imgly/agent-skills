import { expect, test } from '@imgly/kit-test-harness';

test.describe('Read-only viewer', () => {
  test('DV-01 viewer loads the three-page design with zoom controls only', async ({
    kit
  }) => {
    const pageCount = await kit.page.evaluate(
      (cesdk) => cesdk.engine.scene.getPages().length,
      kit.editor
    );
    expect(pageCount).toBe(3);

    const navigationBar = kit.page.getByRole('region', {
      name: 'Navigation Bar'
    });
    await expect(
      navigationBar.getByRole('button', { name: 'Zoom In' })
    ).toBeVisible();
    await expect(
      navigationBar.getByRole('button', { name: 'Zoom Out' })
    ).toBeVisible();
    await expect(navigationBar.getByRole('button')).toHaveCount(3);

    await expect(
      kit.page.getByRole('button', { name: 'Templates' })
    ).toHaveCount(0);
    await expect(
      kit.page.getByRole('region', { name: 'Inspector Bar' })
    ).toHaveCount(0);
    await expect(
      kit.page.getByRole('button', { name: 'Add Page' })
    ).toHaveCount(0);
  });

  test('DV-02 the first page is fitted after load', async ({ kit }) => {
    const fit = await kit.page.evaluate((cesdk) => {
      const { block, scene } = cesdk.engine;
      const [first] = scene.getPages();
      return {
        first,
        current: scene.getCurrentPage(),
        width: block.getFrameWidth(first),
        height: block.getFrameHeight(first),
        zoom: scene.getZoomLevel()
      };
    }, kit.editor);

    expect(fit.current).toBe(fit.first);
    expect(fit.zoom).toBeGreaterThan(0);
    // The whole page fits inside the 1400 x 900 viewport at that zoom.
    expect(fit.width * fit.zoom).toBeLessThanOrEqual(1400);
    expect(fit.height * fit.zoom).toBeLessThanOrEqual(900);
  });

  test('DV-03 a block cannot be selected', async ({ kit }) => {
    const canvas = kit.page.getByRole('region', {
      name: 'Canvas',
      exact: true
    });
    await canvas.click({ position: { x: 700, y: 450 } });

    const selected = await kit.page.evaluate(
      (cesdk) => cesdk.engine.block.findAllSelected(),
      kit.editor
    );
    expect(selected).toEqual([]);
    await expect(
      kit.page.getByRole('region', { name: 'Inspector Bar' })
    ).toHaveCount(0);
  });

  test('DV-04 the viewer denies adding and selecting, and offers no way to add', async ({
    kit
  }) => {
    const scopes = await kit.page.evaluate((cesdk) => {
      const { editor } = cesdk.engine;
      return {
        add: editor.getGlobalScope('editor/add'),
        select: editor.getGlobalScope('editor/select')
      };
    }, kit.editor);
    expect(scopes).toEqual({ add: 'Deny', select: 'Deny' });

    await expect(
      kit.page.getByRole('button', { name: 'Add Page' })
    ).toHaveCount(0);
    await expect(
      kit.page.getByRole('button', { name: 'Elements' })
    ).toHaveCount(0);
  });
});

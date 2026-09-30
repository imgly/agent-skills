import { editorPanel, expect, test } from '@imgly/kit-test-harness';
import type { Locator } from '@playwright/test';

const PANEL = '//ly.img.panel/assetLibrary';
const LAYOUT_COUNT = 12;

interface Thumbnail {
  src: string;
  decoded: boolean;
}

/** The tiles the grid has actually loaded; it loads them lazily. */
function loadedThumbnails(panel: Locator): Promise<Thumbnail[]> {
  return panel.getByRole('img').evaluateAll((nodes) =>
    nodes
      .map((node) => node as HTMLImageElement)
      .filter((image) => image.currentSrc !== '')
      .map((image) => ({
        src: image.currentSrc,
        decoded: image.naturalWidth > 0
      }))
  );
}

test.describe('Start-up and library', () => {
  test('LAY-01 editor loads with Layouts first in the dock', async ({
    kit
  }) => {
    const dock = await kit.page.evaluate(
      (handle) =>
        handle.cesdk.ui
          .getComponentOrder({ in: 'ly.img.dock' })
          .map((entry: { key?: string; id?: string } | string) =>
            typeof entry === 'string' ? entry : (entry.key ?? entry.id)
          ),
      kit.editor
    );

    expect(dock[0]).toBe('ly.img.layouts');
    expect(dock[1]).toBe('ly.img.separator');
    expect(dock).not.toContain('ly.img.templates');
    await expect(
      kit.page.getByRole('button', { name: 'Layouts' })
    ).toBeVisible();
    await expect(
      kit.page.getByRole('button', { name: 'Templates' })
    ).toHaveCount(0);

    const pageCount = await kit.page.evaluate(
      (handle) => handle.engine.scene.getPages().length,
      kit.editor
    );
    expect(pageCount).toBe(1);
  });

  test('LAY-02 layout thumbnails render', async ({ kit }) => {
    await kit.page.getByRole('button', { name: 'Layouts' }).click();
    const panel = editorPanel(kit.page, PANEL);
    await expect(panel.getByRole('img')).toHaveCount(LAYOUT_COUNT);

    // Every thumbnail the grid loaded resolves against the demo assets base URL
    // and decodes. Counting requests is not usable: the browser serves repeats
    // from its own cache.
    await expect
      .poll(async () => (await loadedThumbnails(panel)).length)
      .toBeGreaterThan(0);
    const thumbnails = await loadedThumbnails(panel);

    expect(
      thumbnails.filter(
        ({ src }) =>
          !/\/starterkit-layouts-asset-source\/assets\/thumbnail-\d+\.png$/.test(
            src
          )
      )
    ).toEqual([]);
    expect(thumbnails.filter(({ decoded }) => !decoded)).toEqual([]);
  });
});

import { editorPanel, expect, test } from '@imgly/kit-test-harness';
import { mockUnsplashProxy } from './unsplash-proxy';

const PANEL = '//ly.img.panel/assetLibrary';

test.describe('Proxy failures', () => {
  test('UNS-07 the proxy answers with 500', async ({ kit }) => {
    const proxy = await mockUnsplashProxy(kit.page);
    proxy.failWith(500);

    await kit.page.getByRole('button', { name: 'Unsplash' }).click();
    const panel = editorPanel(kit.page, PANEL);

    // The source rejects rather than returning an empty result, so the panel
    // reports a broken source instead of an empty one.
    // The engine reports the rejected query through the wasm boundary, which
    // can take longer than the default expect timeout on a loaded machine.
    await expect(panel.getByText('Cannot connect to asset source')).toBeVisible(
      { timeout: 60_000 }
    );
    await expect(
      kit.page.getByRole('button', { name: 'Templates' })
    ).toBeEnabled();
  });
});

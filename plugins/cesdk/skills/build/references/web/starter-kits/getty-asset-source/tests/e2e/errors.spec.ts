import { editorPanel, expect, test } from '@imgly/kit-test-harness';
import { mockProxy } from './getty-proxy';

const PANEL = '//ly.img.panel/assetLibrary';

test.describe('Proxy failures', () => {
  test('GET-07 the proxy answers with an error status', async ({ kit }) => {
    const proxy = await mockProxy(kit.page);
    proxy.respondWith(() => ({
      status: 502,
      body: { message: 'bad gateway' }
    }));

    await kit.page.getByRole('button', { name: 'Getty Images' }).click();
    const panel = editorPanel(kit.page, PANEL);

    await expect(
      panel.getByRole('heading', { name: 'Getty Images' })
    ).toBeVisible();
    await expect(panel.getByText('No Elements')).toBeVisible();
    await expect(
      kit.page.getByRole('button', { name: 'Templates' })
    ).toBeEnabled();
  });

  test('GET-07 the proxy answers with a body that is not an AssetsQueryResult', async ({
    kit
  }) => {
    const proxy = await mockProxy(kit.page);
    proxy.respondWith(() => ({ body: { error: 'quota exceeded' } }));

    await kit.page.getByRole('button', { name: 'Getty Images' }).click();
    const panel = editorPanel(kit.page, PANEL);

    // Known issue 4: the kit casts the body and hands it to the panel
    // unchecked, so the missing `assets` field makes the engine reject the
    // query and the panel reports a broken source rather than an empty one.
    await expect(
      panel.getByRole('heading', { name: 'Getty Images' })
    ).toBeVisible();
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

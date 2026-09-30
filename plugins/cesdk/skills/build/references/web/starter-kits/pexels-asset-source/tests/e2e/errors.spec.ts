import { editorPanel, expect, test } from '@imgly/kit-test-harness';
import { mockPexelsApi } from './pexels-api';

const PANEL = '//ly.img.panel/assetLibrary';

test.describe('API failures', () => {
  test('PEX-07 the API answers with 429', async ({ kit }) => {
    const api = await mockPexelsApi(kit.page);
    api.respondWith(() => ({ status: 429, body: { error: 'rate limited' } }));

    await kit.page.getByRole('button', { name: 'Pexels' }).click();
    const panel = editorPanel(kit.page, PANEL);

    await expect(panel.getByRole('heading', { name: 'Pexels' })).toBeVisible();
    await expect(panel.getByText('No Elements')).toBeVisible();
    await expect(
      kit.page.getByRole('button', { name: 'Templates' })
    ).toBeEnabled();
  });
});

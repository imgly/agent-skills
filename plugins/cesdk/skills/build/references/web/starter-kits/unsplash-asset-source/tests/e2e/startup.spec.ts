import { expect, test } from '@imgly/kit-test-harness';
import { mockUnsplashProxy } from './unsplash-proxy';

test.describe('Start-up', () => {
  test('UNS-01 editor loads with Unsplash in the dock', async ({ kit }) => {
    await mockUnsplashProxy(kit.page);

    const pageCount = await kit.page.evaluate(
      (handle) => handle.engine.scene.getPages().length,
      kit.editor
    );
    expect(pageCount).toBe(1);

    await expect(
      kit.page.getByRole('button', { name: 'Unsplash' })
    ).toBeVisible();
    await expect(
      kit.page.getByRole('button', { name: 'Images', exact: true })
    ).toHaveCount(0);
  });
});

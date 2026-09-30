import { expect, test } from '@imgly/kit-test-harness';
import { mockProxy } from './getty-proxy';

test.describe('Start-up', () => {
  test('GET-01 editor loads with Getty Images in the dock', async ({ kit }) => {
    await mockProxy(kit.page);

    const pageCount = await kit.page.evaluate(
      (cesdk) => cesdk.engine.scene.getPages().length,
      kit.editor
    );
    expect(pageCount).toBe(1);

    await expect(
      kit.page.getByRole('button', { name: 'Getty Images' })
    ).toBeVisible();
    await expect(
      kit.page.getByRole('button', { name: 'Images', exact: true })
    ).toHaveCount(0);
  });
});

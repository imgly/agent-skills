import { expect, test } from '@imgly/kit-test-harness';
import { mockPexelsApi } from './pexels-api';

test.describe('Start-up', () => {
  test('PEX-01 editor loads with Pexels in the dock', async ({ kit }) => {
    await mockPexelsApi(kit.page);

    const pageCount = await kit.page.evaluate(
      (handle) => handle.engine.scene.getPages().length,
      kit.editor
    );
    expect(pageCount).toBe(1);

    await expect(
      kit.page.getByRole('button', { name: 'Pexels' })
    ).toBeVisible();
    await expect(
      kit.page.getByRole('button', { name: 'Images', exact: true })
    ).toHaveCount(0);
  });
});

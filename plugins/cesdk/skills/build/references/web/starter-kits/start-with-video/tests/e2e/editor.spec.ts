import { actionsMenu } from '@imgly/kit-test-harness';
import { expect, test } from './fixtures';
import { chooseVideo, dockEntry } from './kit';

test.describe('The editor the kit builds', () => {
  test('SWV-05 dock and navigation bar', async ({ page }) => {
    await page.goto('./');
    await chooseVideo(page, 0);

    for (const label of [
      'Templates',
      'Elements',
      'Uploads',
      'Images',
      'Videos',
      'Audio',
      'Text',
      'Shapes',
      'Stickers'
    ]) {
      await expect(dockEntry(page, label)).toBeVisible();
    }

    await expect(
      page.getByRole('button', { name: 'Export Video' })
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: /^Export (Images|PDF)$/ })
    ).toHaveCount(0);
    await expect(actionsMenu(page)).toHaveCount(0);
  });
});

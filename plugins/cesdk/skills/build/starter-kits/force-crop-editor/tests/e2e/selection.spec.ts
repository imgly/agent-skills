import { expect, test } from '@imgly/kit-test-harness';
import { SelectionScreen } from './selection';

test.describe('The selection screen', () => {
  test('FCE-01 defaults on the selection screen', async ({ page }) => {
    await page.goto('./');
    const screen = new SelectionScreen(page);

    for (const title of ['Select Image', 'Select Crop Preset', 'Select Mode']) {
      await expect(page.getByRole('heading', { name: title })).toBeVisible();
    }

    await expect(screen.option('Photographer with camera')).toHaveClass(
      /selected/
    );
    await expect(screen.option('Mountain landscape')).not.toHaveClass(
      /selected/
    );
    await expect(screen.option('Instagram Logo')).toHaveClass(/selected/);
    await expect(
      page.getByText('Portrait Post', { exact: false })
    ).toBeVisible();
    await expect(screen.mode('Always')).toHaveClass(/selected/);
    await expect(screen.modeDescription).toHaveText(
      'This mode opens the Crop Mode always.'
    );
  });

  test('FCE-02 changing the image keeps the preset and the mode', async ({
    page
  }) => {
    await page.goto('./');
    const screen = new SelectionScreen(page);

    await screen.option('LinkedIn Logo').click();
    await screen.mode('If Needed').click();
    await screen.option('Healthy salad bowl').click();

    await expect(screen.option('Healthy salad bowl')).toHaveClass(/selected/);
    await expect(screen.option('Photographer with camera')).not.toHaveClass(
      /selected/
    );
    await expect(screen.option('LinkedIn Logo')).toHaveClass(/selected/);
    await expect(screen.mode('If Needed')).toHaveClass(/selected/);
    await expect(screen.modeDescription).toHaveText(
      'This mode opens the Crop Mode only if image does not match the aspect ratio.'
    );
  });
});

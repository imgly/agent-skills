import { waitForEditorReady } from '@imgly/kit-test-harness';
import { expect, test } from './fixtures';

/**
 * The onboarding screens replace the editor, so these cases drive `page`
 * directly: the `kit` fixture waits for an editor that never mounts.
 */
test.describe('Credentials', () => {
  test.describe('with a rejected key', () => {
    // The browser reports the mocked 401 itself; the kit turns it into the
    // onboarding screen rather than logging anything.
    test.use({
      modelsStatus: 401,
      consoleErrorAllowlist: [
        /status of 401 \(Unauthorized\).*gateway\.img\.ly/
      ]
    });

    test('AIE-19 a rejected key shows the invalid-key screen', async ({
      page
    }) => {
      await page.goto('./');

      await expect(
        page.getByRole('heading', { name: 'Your API key was rejected' })
      ).toBeVisible();
      expect(
        await page.evaluate(
          () => (window as unknown as { cesdk?: unknown }).cesdk == null
        )
      ).toBe(true);
    });
  });

  test.describe('with a forbidden key', () => {
    test.use({
      modelsStatus: 403,
      consoleErrorAllowlist: [/status of 403 \(Forbidden\).*gateway\.img\.ly/]
    });

    test('AIE-19 a forbidden key shows the same screen', async ({ page }) => {
      await page.goto('./');
      await expect(
        page.getByRole('heading', { name: 'Your API key was rejected' })
      ).toBeVisible();
    });
  });

  test.describe('with a failing gateway', () => {
    test.use({
      modelsStatus: 500,
      consoleErrorAllowlist: [
        /status of 500 \(Internal Server Error\).*gateway\.img\.ly/
      ]
    });

    test('AIE-20 a server error still boots the editor with the curated models', async ({
      page
    }) => {
      await page.goto('./');
      await waitForEditorReady(page);

      await expect(page.getByText('AI Models')).toBeVisible();
      // Only the curated model, because no catalogue arrived to merge.
      await expect(
        page.getByRole('button', { name: /^Image to Image/ })
      ).toContainText('1/1');
    });
  });

  test.describe('with an unreachable gateway', () => {
    test.use({
      modelsAborted: true,
      consoleErrorAllowlist: [/net::ERR_FAILED.*gateway\.img\.ly/]
    });

    test('AIE-20 an aborted request still boots the editor', async ({
      page
    }) => {
      await page.goto('./');
      await waitForEditorReady(page);

      await expect(page.getByText('AI Models')).toBeVisible();
      await expect(
        page.getByRole('button', { name: /^Text to Image/ })
      ).toContainText('1/1');
    });
  });
});

import { editorPanel, expect, test } from '@imgly/kit-test-harness';
import { PROXY_URL } from './getty-proxy';

const PANEL = '//ly.img.panel/assetLibrary';

test.describe('No proxy URL configured', () => {
  test('GET-08 the kit alerts once and asks for nothing', async ({ kit }) => {
    const alerts: string[] = [];
    kit.page.on('dialog', (dialog) => {
      alerts.push(dialog.message());
      return dialog.dismiss();
    });
    const proxyRequests: string[] = [];
    kit.page.on('request', (request) => {
      if (request.url().startsWith(PROXY_URL)) {
        proxyRequests.push(request.url());
      }
    });

    const dock = kit.page.getByRole('button', { name: 'Getty Images' });
    const panel = editorPanel(kit.page, PANEL);

    await dock.click();
    await expect(
      panel.getByRole('heading', { name: 'Getty Images' })
    ).toBeVisible();
    await expect(panel.getByText('No Elements')).toBeVisible();
    await expect.poll(() => alerts.length).toBe(1);
    expect(alerts[0]).toContain(
      'Please provide your Getty Images API proxy URL.'
    );

    // The kit only alerts once per session; the second query logs instead.
    const logged: string[] = [];
    kit.page.on('console', (message) => {
      if (message.type() === 'error') {
        logged.push(message.text());
      }
    });
    await panel.getByRole('textbox').fill('office');

    await expect
      .poll(() =>
        logged.filter((line) =>
          line.includes('Getty Images proxy URL not configured')
        )
      )
      .not.toEqual([]);
    expect(alerts).toHaveLength(1);
    expect(proxyRequests).toEqual([]);
  });
});

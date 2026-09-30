import { editorPanel, expect, test } from '@imgly/kit-test-harness';
import { API_BASE } from './pexels-api';

const PANEL = '//ly.img.panel/assetLibrary';

test.describe('No API key configured', () => {
  test('PEX-08 the kit alerts once and calls nothing', async ({ kit }) => {
    const alerts: string[] = [];
    kit.page.on('dialog', (dialog) => {
      alerts.push(dialog.message());
      return dialog.dismiss();
    });
    const apiRequests: string[] = [];
    kit.page.on('request', (request) => {
      if (request.url().startsWith(API_BASE)) {
        apiRequests.push(request.url());
      }
    });

    const panel = editorPanel(kit.page, PANEL);
    await kit.page.getByRole('button', { name: 'Pexels' }).click();

    await expect(panel.getByRole('heading', { name: 'Pexels' })).toBeVisible();
    await expect(panel.getByText('No Elements')).toBeVisible();
    await expect.poll(() => alerts.length).toBe(1);
    expect(alerts[0]).toContain('Please provide your Pexels API key.');
    expect(alerts[0]).toContain('https://www.pexels.com/api/');

    // The kit only alerts once per session; the second query logs instead.
    const logged: string[] = [];
    kit.page.on('console', (message) => {
      if (message.type() === 'error') {
        logged.push(message.text());
      }
    });
    await panel.getByRole('textbox').fill('forest');

    await expect
      .poll(() =>
        logged.filter((line) => line.includes('Pexels API key not configured'))
      )
      .not.toEqual([]);
    expect(alerts).toHaveLength(1);
    expect(apiRequests).toEqual([]);
  });
});

import type { Page, Route } from '@playwright/test';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,OPTIONS',
  'Access-Control-Allow-Headers': '*'
};

const UPLOAD_URL = 'https://fal-mock.test/upload';
const FILE_URL = 'https://fal-mock.test/audio.m4a';

const WORDS = [
  { text: 'generate', start: 0.2, end: 0.9, type: 'word', speaker_id: 'a' },
  { text: ' ', start: 0.9, end: 1.0, type: 'spacing', speaker_id: 'a' },
  { text: 'captions', start: 1.0, end: 1.8, type: 'word', speaker_id: 'a' }
];

/**
 * Answer the fal.ai proxy from fixtures. The provider posts to the proxy with
 * the real destination in `x-fal-target-url`, uploads the audio to the URL the
 * first answer names, then posts again to run the model.
 */
export async function mockFalProxy(page: Page): Promise<void> {
  const json = (route: Route, body: unknown) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      headers: CORS_HEADERS,
      body: JSON.stringify(body)
    });

  await page.route(/\/__fal(\?|$|\/)|proxy\.img\.ly/, async (route) => {
    if (route.request().method() === 'OPTIONS') {
      await route.fulfill({ status: 204, headers: CORS_HEADERS, body: '' });
      return;
    }
    const target = route.request().headers()['x-fal-target-url'] ?? '';
    if (target.includes('storage/upload/initiate')) {
      await json(route, { upload_url: UPLOAD_URL, file_url: FILE_URL });
      return;
    }
    if (target.includes('fal.run/')) {
      await json(route, {
        text: 'generate captions',
        language_code: 'eng',
        language_probability: 0.99,
        words: WORDS
      });
      return;
    }
    await route.fulfill({ status: 404, headers: CORS_HEADERS, body: '' });
  });

  await page.route('https://fal-mock.test/**', async (route) => {
    if (route.request().method() === 'OPTIONS') {
      await route.fulfill({ status: 204, headers: CORS_HEADERS, body: '' });
      return;
    }
    await json(route, {});
  });
}

import { afterEach, describe, expect, it, vi } from 'vitest';

import { checkImageContentAPI } from '../../src/app/moderation';
import { percentageToState } from '../../src/app/utils';

function respondWith(body: unknown): void {
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => new Response(JSON.stringify(body)))
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('CM-U1 percentageToState', () => {
  it.each([
    [1, 'failed'],
    [0.81, 'failed'],
    [0.8, 'warning'],
    [0.41, 'warning'],
    [0.4, 'success'],
    [0, 'success'],
    [-1, 'success']
  ])('maps %s to %s', (percentage, state) => {
    expect(percentageToState(percentage)).toBe(state);
  });

  it('still reports NaN as success, which is why the service response is validated', () => {
    expect(percentageToState(NaN)).toBe('success');
  });
});

describe('CM-U2 the category catalogue', () => {
  it('builds the four categories in order and inverts the nudity score', async () => {
    respondWith({
      weapon: 0.9,
      alcohol: 0.1,
      drugs: 0.5,
      nudity: { safe: 0.2 }
    });

    const results = await checkImageContentAPI('https://example.test/a.png');

    expect(results.map((result) => result.name)).toEqual([
      'Weapons',
      'Alcohol',
      'Drugs',
      'Nudity'
    ]);
    // Nudity is 1 - safe, so 0.8, and the failed threshold is strictly above 0.8.
    expect(results.map((result) => result.state)).toEqual([
      'failed',
      'success',
      'warning',
      'warning'
    ]);
    expect(results.map((result) => result.description)).toEqual([
      'Handguns, rifles, machine guns, threatening knives...',
      'Wine, beer, cocktails, champagne...',
      'Cannabis, syringes, glass pipes, bongs, pills...',
      'Images that contain either raw nudity or partial nudity.'
    ]);
  });

  it('sends the image URL to the moderation proxy', async () => {
    respondWith({ weapon: 0, alcohol: 0, drugs: 0, nudity: { safe: 1 } });

    await checkImageContentAPI('https://example.test/a b.png');

    const [url] = vi.mocked(fetch).mock.calls[0];
    expect(String(url)).toContain(
      `url=${encodeURIComponent('https://example.test/a b.png')}`
    );
  });

  it.each([
    ['an empty object', {}],
    ['a missing nudity score', { weapon: 0.1, alcohol: 0.1, drugs: 0.1 }],
    [
      'a non-numeric score',
      { weapon: 'high', alcohol: 0.1, drugs: 0.1, nudity: { safe: 1 } }
    ]
  ])('rejects %s rather than reporting a clean design', async (_case, body) => {
    respondWith(body);

    await expect(
      checkImageContentAPI('https://example.test/a.png')
    ).rejects.toThrow(/returned no ".*" score/);
  });
});

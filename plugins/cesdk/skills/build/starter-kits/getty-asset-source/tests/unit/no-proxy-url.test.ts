import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('@cesdk/cesdk-js', () => ({ default: { version: 'test' } }));

import { createGettyImagesAssetSource } from '../../src/imgly/plugins/getty-images';

// The warning latch is module state (known issue 2), so this case lives in its
// own file: Vitest gives every file a fresh module registry.
afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('GET-U4 no proxy URL', () => {
  it('alerts once, then logs, and never fetches', async () => {
    const alert = vi.fn();
    const fetch = vi.fn();
    vi.stubGlobal('alert', alert);
    vi.stubGlobal('fetch', fetch);
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const source = createGettyImagesAssetSource('');

    const first = await source.findAssets!({ page: 0, perPage: 20 });
    expect(alert).toHaveBeenCalledTimes(1);
    expect(alert.mock.calls[0][0]).toContain(
      'Please provide your Getty Images API proxy URL.'
    );
    expect(consoleError).not.toHaveBeenCalled();
    expect(first.assets).toEqual([]);

    const second = await source.findAssets!({ page: 0, perPage: 20 });
    expect(alert).toHaveBeenCalledTimes(1);
    expect(consoleError).toHaveBeenCalledTimes(1);
    expect(consoleError.mock.calls[0][0]).toBe(
      'Getty Images proxy URL not configured. Please set VITE_GETTY_IMAGES_PROXY_URL environment variable.'
    );
    expect(second.assets).toEqual([]);

    expect(fetch).not.toHaveBeenCalled();
  });
});

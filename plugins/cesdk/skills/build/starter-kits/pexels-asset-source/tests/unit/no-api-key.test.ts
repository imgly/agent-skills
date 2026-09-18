import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('@cesdk/cesdk-js', () => ({ default: { version: 'test' } }));

import { createPexelsAssetSource } from '../../src/imgly/plugins/pexels';

// The warning latch is module state (known issue 2), so this case lives in its
// own file: Vitest gives every file a fresh module registry.
afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('PEX-U5 no API key', () => {
  it('alerts once, then logs, and never calls the API', async () => {
    const alert = vi.fn();
    const fetch = vi.fn();
    vi.stubGlobal('alert', alert);
    vi.stubGlobal('fetch', fetch);
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const source = createPexelsAssetSource('');

    const first = await source.findAssets!({ page: 0, perPage: 20 });
    expect(alert).toHaveBeenCalledTimes(1);
    expect(alert.mock.calls[0][0]).toContain(
      'Please provide your Pexels API key.'
    );
    expect(consoleError).not.toHaveBeenCalled();
    expect(first.assets).toEqual([]);

    const second = await source.findAssets!({ page: 0, perPage: 20 });
    expect(alert).toHaveBeenCalledTimes(1);
    expect(consoleError).toHaveBeenCalledTimes(1);
    expect(consoleError.mock.calls[0][0]).toBe(
      'Pexels API key not configured. Please set VITE_PEXELS_API_KEY environment variable.'
    );
    expect(second.assets).toEqual([]);

    expect(fetch).not.toHaveBeenCalled();
  });
});

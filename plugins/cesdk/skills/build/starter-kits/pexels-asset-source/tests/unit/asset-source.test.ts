import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// The kit imports CreativeEditorSDK as a value for `CreativeEditorSDK.version`,
// and the browser bundle touches `window` at import time.
vi.mock('@cesdk/cesdk-js', () => ({ default: { version: 'test' } }));

import type { CreativeEngine, EditorPluginContext } from '@cesdk/cesdk-js';
import { createApiSpy } from '@imgly/kit-test-harness/vitest';

import {
  createPexelsAssetSource,
  PexelsAssetSourcePlugin
} from '../../src/imgly/plugins/pexels';

const API_KEY = 'test-pexels-key';

function photo(id: number) {
  return {
    id,
    width: 1200,
    height: 800,
    url: `https://www.pexels.com/photo/${id}/`,
    photographer: 'Ada Lovelace',
    photographer_url: 'https://www.pexels.com/@ada',
    photographer_id: 7,
    avg_color: '#123456',
    src: {
      original: `https://images.pexels.test/${id}/original.jpg`,
      large2x: `https://images.pexels.test/${id}/large2x.jpg`,
      large: `https://images.pexels.test/${id}/large.jpg`,
      medium: `https://images.pexels.test/${id}/medium.jpg`,
      small: `https://images.pexels.test/${id}/small.jpg`,
      portrait: `https://images.pexels.test/${id}/portrait.jpg`,
      landscape: `https://images.pexels.test/${id}/landscape.jpg`,
      tiny: `https://images.pexels.test/${id}/tiny.jpg`
    },
    liked: false,
    alt: 'a photo'
  };
}

function respondWith(body: unknown, ok = true): void {
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => ({
      ok,
      status: ok ? 200 : 429,
      statusText: ok ? 'OK' : 'Too Many Requests',
      json: async () => body
    }))
  );
}

function lastCall(): [string, { headers: Record<string, string> }] {
  return vi.mocked(globalThis.fetch).mock.calls.at(-1) as never;
}

let consoleError: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('PEX-U1 photo mapping', () => {
  it('maps a Pexels photo to an AssetResult with attribution', async () => {
    respondWith({
      page: 1,
      per_page: 20,
      photos: [photo(42)],
      total_results: 100,
      next_page: 'https://api.pexels.com/v1/curated?page=2'
    });
    const source = createPexelsAssetSource(API_KEY);

    const result = await source.findAssets!({ page: 0, perPage: 20 });

    expect(result.assets[0]).toEqual({
      id: '42',
      locale: 'en',
      meta: {
        thumbUri: 'https://images.pexels.test/42/medium.jpg',
        uri: 'https://images.pexels.test/42/original.jpg',
        width: 1200,
        height: 800,
        blockType: '//ly.img.ubq/graphic',
        fillType: '//ly.img.ubq/fill/image',
        kind: 'image'
      },
      credits: {
        name: 'Ada Lovelace',
        url: 'https://www.pexels.com/@ada'
      },
      utm: { source: 'CE.SDK Demo', medium: 'referral' }
    });
  });
});

describe('PEX-U2 request building', () => {
  it('calls curated with a 1-based page and the key in the header', async () => {
    respondWith({ page: 1, per_page: 20, photos: [], total_results: 0 });
    const source = createPexelsAssetSource(API_KEY);

    await source.findAssets!({ page: 0, perPage: 20 });

    const [url, init] = lastCall();
    expect(url).toBe('https://api.pexels.com/v1/curated?page=1&per_page=20');
    expect(init.headers.Authorization).toBe(API_KEY);
  });

  it('calls search with the query and keeps the key out of the URL', async () => {
    respondWith({ page: 3, per_page: 10, photos: [], total_results: 0 });
    const source = createPexelsAssetSource(API_KEY);

    await source.findAssets!({ query: 'forest', page: 2, perPage: 10 });

    const [url, init] = lastCall();
    expect(url).toBe(
      'https://api.pexels.com/v1/search?page=3&per_page=10&query=forest'
    );
    expect(url).not.toContain(API_KEY);
    expect(init.headers.Authorization).toBe(API_KEY);
  });
});

describe('PEX-U3 paging', () => {
  it('reports the next CE.SDK page while Pexels reports one', async () => {
    respondWith({
      page: 1,
      per_page: 20,
      photos: [photo(1)],
      total_results: 100,
      next_page: 'https://api.pexels.com/v1/curated?page=2'
    });
    const source = createPexelsAssetSource(API_KEY);

    const result = await source.findAssets!({ page: 0, perPage: 20 });

    expect(result.currentPage).toBe(0);
    expect(result.nextPage).toBe(1);
    expect(result.total).toBe(100);
  });

  it('reports no next page when Pexels omits one', async () => {
    respondWith({
      page: 5,
      per_page: 20,
      photos: [photo(1)],
      total_results: 100
    });
    const source = createPexelsAssetSource(API_KEY);

    await expect(
      source.findAssets!({ page: 4, perPage: 20 })
    ).resolves.toMatchObject({ nextPage: undefined });
  });

  it('reports no next page when the page came back empty', async () => {
    respondWith({
      page: 5,
      per_page: 20,
      photos: [],
      total_results: 100,
      next_page: 'https://api.pexels.com/v1/curated?page=6'
    });
    const source = createPexelsAssetSource(API_KEY);

    await expect(
      source.findAssets!({ page: 4, perPage: 20 })
    ).resolves.toMatchObject({ assets: [], nextPage: undefined });
  });
});

describe('PEX-U4 HTTP and network errors', () => {
  it('resolves to the empty result on a non-2xx response and logs once', async () => {
    respondWith(null, false);
    const source = createPexelsAssetSource(API_KEY);

    const result = await source.findAssets!({ page: 3, perPage: 20 });

    expect(result.assets).toEqual([]);
    expect(result.total).toBe(0);
    // Known issue 3: the shared empty result always reports page 0.
    expect(result.currentPage).toBe(0);
    expect(consoleError).toHaveBeenCalledTimes(1);
  });

  it('resolves to the empty result when fetch rejects', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new Error('offline');
      })
    );
    const source = createPexelsAssetSource(API_KEY);

    const result = await source.findAssets!({ page: 0, perPage: 20 });

    expect(result.assets).toEqual([]);
    expect(consoleError).toHaveBeenCalledTimes(1);
  });
});

describe('PEX-U6 source identity', () => {
  it('names the source, its credits and its licence', () => {
    const source = createPexelsAssetSource(API_KEY);

    expect(source.id).toBe('pexels');
    expect(source.credits).toEqual({
      name: 'Pexels',
      url: 'https://www.pexels.com/'
    });
    expect(source.license).toEqual({
      name: 'Pexels License (free)',
      url: 'https://www.pexels.com/license/'
    });
  });
});

describe('PEX-U20 the plugin without an editor', () => {
  it('registers nothing when the host runs the engine alone', async () => {
    const engine = createApiSpy<CreativeEngine>();
    await new PexelsAssetSourcePlugin().initialize({
      engine: engine.api
    } as EditorPluginContext);

    expect(engine.calls).toEqual([]);
  });
});

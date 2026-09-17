import type { AssetsQueryResult, AssetResult } from '@cesdk/cesdk-js';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// The kit imports CreativeEditorSDK as a value for `CreativeEditorSDK.version`,
// and the browser bundle touches `window` at import time.
vi.mock('@cesdk/cesdk-js', () => ({ default: { version: 'test' } }));

import type { CreativeEngine, EditorPluginContext } from '@cesdk/cesdk-js';
import { createApiSpy } from '@imgly/kit-test-harness/vitest';

import {
  createGettyImagesAssetSource,
  GettyImagesAssetSourcePlugin
} from '../../src/imgly/plugins/getty-images';

const PROXY = 'https://getty-proxy.test/api';

const RESULT: AssetsQueryResult<AssetResult> = {
  assets: [
    {
      id: 'getty-1',
      locale: 'en',
      meta: {
        uri: 'https://getty-proxy.test/images/1.jpg',
        thumbUri: 'https://getty-proxy.test/images/1-thumb.jpg',
        blockType: '//ly.img.ubq/graphic',
        fillType: '//ly.img.ubq/fill/image',
        kind: 'image',
        width: 1200,
        height: 800
      }
    }
  ],
  total: 42,
  currentPage: 1,
  nextPage: 2
};

function respondWith(body: unknown, ok = true): void {
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => ({
      ok,
      statusText: ok ? 'OK' : 'Bad Gateway',
      json: async () => body
    }))
  );
}

function requestedUrl(): string {
  return vi.mocked(globalThis.fetch).mock.calls[0][0] as string;
}

let consoleError: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('GET-U1 request building', () => {
  it('sends the default query and a 1-based page', async () => {
    respondWith(RESULT);
    const source = createGettyImagesAssetSource(PROXY);

    await source.findAssets!({ page: 0, perPage: 20 });

    expect(requestedUrl()).toBe(`${PROXY}?query=business&page=1&perPage=20`);
  });

  it('sends the search query instead of the default', async () => {
    respondWith(RESULT);
    const source = createGettyImagesAssetSource(PROXY);

    await source.findAssets!({ query: 'office', page: 2, perPage: 10 });

    expect(requestedUrl()).toBe(`${PROXY}?query=office&page=3&perPage=10`);
  });
});

describe('GET-U2 pass-through of the proxy result', () => {
  it('returns the proxy body unchanged', async () => {
    respondWith(RESULT);
    const source = createGettyImagesAssetSource(PROXY);

    await expect(source.findAssets!({ page: 0, perPage: 20 })).resolves.toEqual(
      RESULT
    );
  });
});

describe('GET-U3 HTTP and network errors', () => {
  it('resolves to the empty result on a non-2xx response and logs once', async () => {
    respondWith(null, false);
    const source = createGettyImagesAssetSource(PROXY);

    const result = await source.findAssets!({ page: 3, perPage: 20 });

    expect(result.assets).toEqual([]);
    expect(result.total).toBe(0);
    // Known issue 5: the shared empty result always reports page 0.
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
    const source = createGettyImagesAssetSource(PROXY);

    const result = await source.findAssets!({ page: 0, perPage: 20 });

    expect(result.assets).toEqual([]);
    expect(consoleError).toHaveBeenCalledTimes(1);
  });
});

describe('GET-U5 source identity', () => {
  it('names the source, its credits and its licence', () => {
    const source = createGettyImagesAssetSource(PROXY);

    expect(source.id).toBe('gettyImagesImageAssets');
    expect(source.credits).toEqual({
      name: 'Getty Images',
      url: 'https://www.gettyimages.com/'
    });
    expect(source.license).toEqual({
      name: 'Getty Images Content License Agreement',
      url: 'https://www.gettyimages.com/eula'
    });
  });
});

describe('GET-U20 the plugin without an editor', () => {
  it('registers nothing when the host runs the engine alone', async () => {
    const engine = createApiSpy<CreativeEngine>();
    await new GettyImagesAssetSourcePlugin().initialize({
      engine: engine.api
    } as EditorPluginContext);

    expect(engine.calls).toEqual([]);
  });
});

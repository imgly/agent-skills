import { afterEach, describe, expect, it, vi } from 'vitest';

// The kit imports CreativeEditorSDK as a value for `CreativeEditorSDK.version`,
// and the browser bundle touches `window` at import time.
vi.mock('@cesdk/cesdk-js', () => ({ default: { version: 'test' } }));

import type CreativeEditorSDK from '@cesdk/cesdk-js';
import type { CreativeEngine, EditorPluginContext } from '@cesdk/cesdk-js';
import { createApiSpy } from '@imgly/kit-test-harness/vitest';

import {
  createUnsplashAssetSource,
  UnsplashAssetSourcePlugin
} from '../../src/imgly/plugins/unsplash';

const API_URL = 'https://unsplash-proxy.test';

function photo(id: string, overrides: Record<string, unknown> = {}) {
  return {
    id,
    description: `description of ${id}`,
    alt_description: `alt of ${id}`,
    width: 1200,
    height: 800,
    urls: {
      full: `https://images.unsplash.test/${id}/full.jpg`,
      regular: `https://images.unsplash.test/${id}/regular.jpg`,
      small: `https://images.unsplash.test/${id}/small.jpg`,
      thumb: `https://images.unsplash.test/${id}/thumb.jpg`
    },
    user: {
      name: 'Grace Hopper',
      links: { html: 'https://unsplash.test/@grace' }
    },
    tags: [{ title: 'nature' }, { title: 'sky' }],
    ...overrides
  };
}

function respondWith(
  body: unknown,
  init: { status?: number; headers?: Record<string, string> } = {}
): void {
  vi.stubGlobal(
    'fetch',
    vi.fn(
      async () =>
        new Response(JSON.stringify(body), {
          status: init.status ?? 200,
          headers: { 'content-type': 'application/json', ...init.headers }
        })
    )
  );
}

function requestedUrl(): URL {
  return new URL(vi.mocked(globalThis.fetch).mock.calls.at(-1)![0] as string);
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('UNS-U1 photo mapping', () => {
  it('maps a photo to an AssetResult with attribution and UTM parameters', async () => {
    respondWith([photo('abc')], { headers: { 'x-total': '1' } });
    const source = createUnsplashAssetSource(API_URL);

    const result = await source.findAssets!({ page: 0, perPage: 20 });

    expect(result.assets[0]).toEqual({
      id: 'abc',
      locale: 'en',
      label: 'description of abc',
      tags: ['nature', 'sky'],
      meta: {
        mimeType: 'image/jpeg',
        uri: 'https://images.unsplash.test/abc/full.jpg',
        thumbUri: 'https://images.unsplash.test/abc/thumb.jpg',
        width: 1200,
        height: 800
      },
      credits: { name: 'Grace Hopper', url: 'https://unsplash.test/@grace' },
      utm: { source: 'CE.SDK Demo', medium: 'referral' }
    });
  });
});

describe('UNS-U2 missing fields', () => {
  it('falls back to the alt description and drops absent tags and credits', async () => {
    respondWith(
      [
        photo('a', { description: null }),
        photo('b', {
          description: null,
          alt_description: null,
          tags: undefined
        }),
        photo('c', { user: { name: undefined, links: { html: undefined } } })
      ],
      { headers: { 'x-total': '3' } }
    );
    const source = createUnsplashAssetSource(API_URL);

    const [withAlt, withNeither, withoutUser] = (
      await source.findAssets!({ page: 0, perPage: 20 })
    ).assets;

    expect(withAlt.label).toBe('alt of a');
    expect(withNeither.label).toBeUndefined();
    expect(withNeither.tags).toBeUndefined();
    expect(withoutUser.credits).toBeUndefined();
  });
});

describe('UNS-U3 paging without a query', () => {
  it('asks Unsplash for a 1-based page and answers in CE.SDK numbering', async () => {
    respondWith(
      Array.from({ length: 20 }, (_, index) => photo(`p${index}`)),
      { headers: { 'x-total': '100' } }
    );
    const source = createUnsplashAssetSource(API_URL);

    const result = await source.findAssets!({ page: 0, perPage: 20 });

    const url = requestedUrl();
    expect(url.pathname).toBe('/photos');
    expect(url.searchParams.get('page')).toBe('1');
    expect(url.searchParams.get('per_page')).toBe('20');
    expect(url.searchParams.get('order_by')).toBe('popular');
    expect(result.currentPage).toBe(0);
    expect(result.nextPage).toBe(1);
    expect(result.total).toBe(100);
  });

  it('reports no next page once every photo has been fetched', async () => {
    respondWith(
      Array.from({ length: 20 }, (_, index) => photo(`p${index}`)),
      { headers: { 'x-total': '40' } }
    );
    const source = createUnsplashAssetSource(API_URL);

    const result = await source.findAssets!({ page: 1, perPage: 20 });

    expect(requestedUrl().searchParams.get('page')).toBe('2');
    expect(result.nextPage).toBeUndefined();
  });
});

describe('UNS-U4 paging with a query', () => {
  it('searches with a 1-based page and derives the next page from total_pages', async () => {
    respondWith(
      { results: [photo('s1')], total: 100, total_pages: 5 },
      { headers: { 'x-total': '100' } }
    );
    const source = createUnsplashAssetSource(API_URL);

    const result = await source.findAssets!({
      query: 'mountains',
      page: 0,
      perPage: 20
    });

    const url = requestedUrl();
    expect(url.pathname).toBe('/search/photos');
    expect(url.searchParams.get('query')).toBe('mountains');
    expect(url.searchParams.get('page')).toBe('1');
    expect(result.currentPage).toBe(0);
    expect(result.nextPage).toBe(1);
  });

  it('reports no next page on the last search page', async () => {
    respondWith(
      { results: [photo('s1')], total: 100, total_pages: 5 },
      { headers: { 'x-total': '100' } }
    );
    const source = createUnsplashAssetSource(API_URL);

    const result = await source.findAssets!({
      query: 'mountains',
      page: 4,
      perPage: 20
    });

    expect(requestedUrl().searchParams.get('page')).toBe('5');
    expect(result.nextPage).toBeUndefined();
  });
});

describe('UNS-U5 API error', () => {
  it('rejects with the first error message', async () => {
    respondWith(
      { errors: ['Rate limit exceeded', 'and more'] },
      { status: 403 }
    );
    const source = createUnsplashAssetSource(API_URL);

    await expect(source.findAssets!({ page: 0, perPage: 20 })).rejects.toThrow(
      'Rate limit exceeded'
    );
  });
});

describe('UNS-U6 source identity', () => {
  it('names the source, its credits and its licence', () => {
    const source = createUnsplashAssetSource(API_URL);

    expect(source.id).toBe('unsplash');
    expect(source.credits).toEqual({
      name: 'Unsplash',
      url: 'https://unsplash.com/'
    });
    expect(source.license).toEqual({
      name: 'Unsplash license (free)',
      url: 'https://unsplash.com/license'
    });
  });
});

describe('UNS-U9 search API error', () => {
  it('rejects with the first error message of a failed search', async () => {
    respondWith({ errors: ['Bad request'] }, { status: 400 });
    const source = createUnsplashAssetSource(API_URL);

    await expect(
      source.findAssets!({ page: 0, perPage: 20, query: 'mountains' })
    ).rejects.toThrow('Bad request');
  });
});

describe('UNS-U10 the plugin without an editor', () => {
  it('registers nothing when the host runs the engine alone', async () => {
    const engine = createApiSpy<CreativeEngine>();
    await new UnsplashAssetSourcePlugin().initialize({
      engine: engine.api
    } as EditorPluginContext);

    expect(engine.calls).toEqual([]);
  });

  it('falls back to the public Unsplash API when no proxy URL is configured', async () => {
    const cesdk = createApiSpy<CreativeEditorSDK>();
    await new UnsplashAssetSourcePlugin().initialize({
      cesdk: cesdk.api
    } as EditorPluginContext);

    const source = cesdk.lastArgsOf('engine.asset.addSource')?.[0] as {
      id: string;
    };
    expect(source.id).toBe('unsplash');
  });
});

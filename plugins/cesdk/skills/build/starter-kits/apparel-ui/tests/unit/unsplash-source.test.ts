import type CreativeEngine from '@cesdk/engine';
import { afterEach, describe, expect, it, vi } from 'vitest';
import createUnsplashSource from '../../src/imgly/unsplash-source';

const PHOTO = {
  id: 'photo-1',
  width: 640,
  height: 480,
  description: 'A skateboard',
  alt_description: 'skateboard on asphalt',
  urls: { thumb: 'https://images.example/thumb.jpg' },
  links: { download_location: 'https://api.example/photos/photo-1/download' },
  user: { name: 'Fixture Author', links: { html: 'https://unsplash.com/@fix' } }
};

function stubFetch(
  body: unknown,
  { status = 200, total }: { status?: number; total?: number } = {}
): ReturnType<typeof vi.fn> {
  const headers = new Headers({ 'content-type': 'application/json' });
  if (total != null) headers.set('x-total', String(total));
  const fetchMock = vi.fn(async () => ({
    ok: status < 400,
    status,
    headers,
    json: async () => body,
    text: async () => JSON.stringify(body)
  }));
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

const source = () => createUnsplashSource({} as unknown as CreativeEngine);

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('AP-U4 Unsplash response mapping', () => {
  it('AP-U4 maps a photo to an AssetResult', async () => {
    stubFetch({ results: [PHOTO], total: 1, total_pages: 1 });

    const result = await source().findAssets!({
      page: 0,
      perPage: 10,
      query: 'Skateboard'
    });

    expect(result.assets).toHaveLength(1);
    expect(result.assets[0]).toMatchObject({
      id: 'photo-1',
      locale: 'en',
      label: 'A skateboard',
      meta: {
        uri: PHOTO.links.download_location,
        thumbUri: PHOTO.urls.thumb,
        blockType: '//ly.img.ubq/graphic',
        kind: 'image',
        fillType: '//ly.img.ubq/fill/image',
        width: 640,
        height: 480
      },
      credits: { name: 'Fixture Author', url: 'https://unsplash.com/@fix' },
      utm: { source: 'CE.SDK Demo', medium: 'referral' }
    });
  });

  it('AP-U4 falls back to alt_description, then to undefined', async () => {
    stubFetch({
      results: [
        { ...PHOTO, description: null },
        { ...PHOTO, id: 'photo-2', description: null, alt_description: null }
      ],
      total: 2,
      total_pages: 1
    });

    const result = await source().findAssets!({
      page: 0,
      perPage: 10,
      query: 'x'
    });
    expect(result.assets[0].label).toBe('skateboard on asphalt');
    expect(result.assets[1].label).toBeUndefined();
  });

  it('AP-U4 rejects with the first error message', async () => {
    stubFetch({ errors: ['Rate limit exceeded', 'second'] }, { status: 429 });
    await expect(
      source().findAssets!({ page: 0, perPage: 10, query: 'x' })
    ).rejects.toThrow('Rate limit exceeded');
  });
});

describe('AP-U5 Unsplash paging', () => {
  const searchPage = async (page: number) => {
    const fetchMock = stubFetch({ results: [], total: 40, total_pages: 4 });
    const result = await source().findAssets!({
      page,
      perPage: 10,
      query: 'x'
    });
    const url = new URL(String(fetchMock.mock.calls[0][0]));
    return { requested: url.searchParams.get('page'), result };
  };

  it('AP-U5 asks Unsplash for page 1 when CE.SDK asks for page 0', async () => {
    const { requested, result } = await searchPage(0);
    expect(requested).toBe('1');
    expect(result.currentPage).toBe(0);
    expect(result.nextPage).toBe(1);
  });

  it('AP-U5 asks Unsplash for page 2 when CE.SDK asks for page 1', async () => {
    const { requested, result } = await searchPage(1);
    expect(requested).toBe('2');
    expect(result.currentPage).toBe(1);
    expect(result.nextPage).toBe(2);
  });

  it('AP-U5 reports no next page on the last one', async () => {
    const { requested, result } = await searchPage(3);
    expect(requested).toBe('4');
    expect(result.nextPage).toBeUndefined();
  });

  it('AP-U5 pages the unqueried listing the same way', async () => {
    const fetchMock = stubFetch([PHOTO], { total: 25 });
    const result = await source().findAssets!({ page: 1, perPage: 10 });
    const url = new URL(String(fetchMock.mock.calls[0][0]));
    expect(url.searchParams.get('page')).toBe('2');
    expect(result.currentPage).toBe(1);
    expect(result.nextPage).toBe(2);
  });
});

describe('AP-U13 what Unsplash cannot answer', () => {
  it('AP-U13 rejects a failing listing with its first error', async () => {
    stubFetch({ errors: ['Service unavailable'] }, { status: 503 });
    await expect(
      source().findAssets!({ page: 0, perPage: 10 })
    ).rejects.toThrow('Service unavailable');
  });

  it('AP-U13 reports no next page once the listing is exhausted', async () => {
    stubFetch([PHOTO], { total: 1 });
    const result = await source().findAssets!({ page: 0, perPage: 10 });
    expect(result.nextPage).toBeUndefined();
  });

  it('AP-U13 offers no groups and refuses to change the library', async () => {
    const unsplash = source();
    await expect(unsplash.getGroups!()).resolves.toEqual([]);
    expect(() => unsplash.addAsset!({ id: 'x' })).toThrow('Not implemented');
    expect(() => unsplash.removeAsset!('x')).toThrow('Not implemented');
  });

  it('AP-U13 maps the tags Unsplash sends and omits absent credits', async () => {
    stubFetch({
      results: [{ ...PHOTO, user: undefined, tags: [{ title: 'sport' }] }],
      total: 1,
      total_pages: 1
    });

    const result = await source().findAssets!({
      page: 0,
      perPage: 10,
      query: 'x'
    });

    expect(result.assets[0].tags).toEqual(['sport']);
    expect(result.assets[0].credits).toBeUndefined();
  });
});

describe('AP-U14 the tracked download', () => {
  const engine = () =>
    ({
      asset: {
        defaultApplyAsset: vi.fn(async () => 42),
        defaultApplyAssetToBlock: vi.fn(async () => undefined)
      }
    }) as unknown as CreativeEngine;

  const ASSET = {
    id: 'photo-1',
    meta: {
      uri: 'https://api.example/photos/photo-1/download',
      thumbUri: 'https://images.example/thumb.jpg'
    }
  };

  it('AP-U14 applies the tracked URL to a new block', async () => {
    stubFetch({ url: 'https://images.example/full.jpg' });
    const cesdk = engine();

    const block = await createUnsplashSource(cesdk).applyAsset!(ASSET as never);

    expect(block).toBe(42);
    expect(cesdk.asset.defaultApplyAsset).toHaveBeenCalledWith(
      expect.objectContaining({
        meta: expect.objectContaining({
          uri: 'https://images.example/full.jpg',
          previewUri: ASSET.meta.thumbUri
        })
      })
    );
  });

  it('AP-U14 applies the tracked URL to an existing block', async () => {
    stubFetch({ url: 'https://images.example/full.jpg' });
    const cesdk = engine();

    await createUnsplashSource(cesdk).applyAssetToBlock!(ASSET as never, 7);

    expect(cesdk.asset.defaultApplyAssetToBlock).toHaveBeenCalledWith(
      expect.objectContaining({
        meta: expect.objectContaining({
          uri: 'https://images.example/full.jpg'
        })
      }),
      7
    );
  });

  it('AP-U14 reports every error the download endpoint returns', async () => {
    stubFetch({ errors: ['gone', 'really gone'] }, { status: 404 });

    await expect(
      createUnsplashSource(engine()).applyAsset!(ASSET as never)
    ).rejects.toThrow('gone. really gone');
  });

  it('AP-U14 refuses an asset with no URI before it calls the endpoint', async () => {
    const fetchMock = stubFetch({});

    await expect(
      createUnsplashSource(engine()).applyAsset!({
        id: 'no-uri',
        meta: {}
      } as never)
    ).rejects.toThrow('Cannot download without valid URI for asset no-uri');
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

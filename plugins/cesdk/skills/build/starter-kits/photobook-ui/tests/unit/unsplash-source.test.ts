import type CreativeEngine from '@cesdk/engine';
import type { AssetResult, AssetsQueryResult } from '@cesdk/engine';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const getPhotos = vi.fn();
const listPhotos = vi.fn();
const trackDownload = vi.fn();
const createApi = vi.fn(() => ({
  search: { getPhotos },
  photos: { list: listPhotos, trackDownload }
}));

vi.mock('unsplash-js', () => ({
  createApi,
  OrderBy: { LATEST: 'latest' }
}));

const { default: createUnsplashSource } =
  await import('../../src/imgly/unsplash-source');

function unsplashPhoto(id: string, extra: Record<string, unknown> = {}) {
  return {
    id,
    urls: {
      full: 'f',
      raw: 'r',
      regular: 'g',
      small: 's',
      thumb: `${id}-thumb`
    },
    alt_description: `${id} alt`,
    description: null,
    width: 800,
    height: 600,
    links: {
      self: 'self',
      html: 'html',
      download: 'download',
      download_location: `${id}-download`
    },
    user: { name: 'Ada', links: { html: 'https://unsplash.com/@ada' } },
    ...extra
  };
}

function fakeEngine() {
  return {
    asset: {
      defaultApplyAsset: vi.fn(async () => 42),
      defaultApplyAssetToBlock: vi.fn(async () => undefined)
    }
  } as unknown as CreativeEngine;
}

function source(engine: CreativeEngine = fakeEngine()) {
  return createUnsplashSource(engine);
}

async function find(
  parameters: Record<string, unknown>
): Promise<AssetsQueryResult> {
  return source().findAssets!({
    page: 0,
    perPage: 10,
    ...parameters
  } as never) as Promise<AssetsQueryResult>;
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('PB-U12 the Unsplash source', () => {
  it('declares the credits and the licence the kit is required to show', () => {
    const unsplash = source();
    expect(unsplash.id).toBe('unsplash');
    expect(unsplash.credits).toEqual({
      name: 'Unsplash',
      url: 'https://unsplash.com/'
    });
    expect(unsplash.license).toEqual({
      name: 'Unsplash license (free)',
      url: 'https://unsplash.com/license'
    });
  });

  it('points the client at the proxy rather than at Unsplash directly', () => {
    source();
    expect(createApi).toHaveBeenCalledWith({
      apiUrl: 'https://api.img.ly/unsplashProxy'
    });
  });

  it('offers no groups and refuses to write back to Unsplash', async () => {
    const unsplash = source();
    expect(await unsplash.getGroups!()).toEqual([]);
    expect(() => unsplash.addAsset!({} as never)).toThrow('Not implemented');
    expect(() => unsplash.removeAsset!('id')).toThrow('Not implemented');
  });
});

describe('PB-U13 querying Unsplash', () => {
  it('searches when a query is given and shifts the page number by one', async () => {
    getPhotos.mockResolvedValue({
      type: 'success',
      response: { results: [unsplashPhoto('a')], total: 30, total_pages: 3 }
    });

    const result = await find({ query: 'beach', page: 0 });

    expect(getPhotos).toHaveBeenCalledWith({
      query: 'beach',
      page: 1,
      perPage: 10,
      orderBy: 'relevant'
    });
    expect(result.total).toBe(30);
    expect(result.currentPage).toBe(0);
    expect(result.nextPage).toBe(1);
  });

  it('reports no next page once the search reaches the last one', async () => {
    getPhotos.mockResolvedValue({
      type: 'success',
      response: { results: [], total: 1, total_pages: 1 }
    });
    expect((await find({ query: 'beach', page: 0 })).nextPage).toBeUndefined();
  });

  it('lists the latest photos when no query is given', async () => {
    listPhotos.mockResolvedValue({
      type: 'success',
      response: { results: [unsplashPhoto('a'), unsplashPhoto('b')], total: 5 }
    });

    const result = await find({ page: 0 });

    expect(listPhotos).toHaveBeenCalledWith({
      orderBy: 'latest',
      page: 1,
      perPage: 10
    });
    expect(result.assets).toHaveLength(2);
    expect(result.nextPage).toBe(1);
  });

  it('reports no next page once the list is exhausted', async () => {
    listPhotos.mockResolvedValue({
      type: 'success',
      response: { results: [unsplashPhoto('a')], total: 1 }
    });
    expect((await find({ page: 0 })).nextPage).toBeUndefined();
  });

  it.each([
    ['a search', { query: 'beach' }, getPhotos],
    ['a listing', {}, listPhotos]
  ])('surfaces the first error %s returns', async (_label, parameters, api) => {
    api.mockResolvedValue({
      type: 'error',
      errors: ['rate limited', 'second']
    });
    await expect(find(parameters)).rejects.toThrow('rate limited');
  });

  it.each([
    ['a search', { query: 'beach' }, getPhotos],
    ['a listing', {}, listPhotos]
  ])('returns nothing when %s is aborted', async (_label, parameters, api) => {
    api.mockResolvedValue({ type: 'aborted' });
    expect(await find(parameters)).toEqual({
      assets: [],
      total: 0,
      currentPage: 0,
      nextPage: undefined
    });
  });
});

describe('PB-U14 translating an Unsplash photo', () => {
  async function firstAsset(
    photo: ReturnType<typeof unsplashPhoto>
  ): Promise<AssetResult> {
    listPhotos.mockResolvedValue({
      type: 'success',
      response: { results: [photo], total: 1 }
    });
    return (await find({ page: 0 })).assets[0];
  }

  it('maps the photo onto the image block the engine can place', async () => {
    const asset = await firstAsset(unsplashPhoto('a'));

    expect(asset.id).toBe('a');
    expect(asset.locale).toBe('en');
    expect(asset.meta).toEqual({
      uri: 'a-download',
      thumbUri: 'a-thumb',
      blockType: '//ly.img.ubq/graphic',
      kind: 'image',
      fillType: '//ly.img.ubq/fill/image',
      width: 800,
      height: 600
    });
    expect(asset.credits).toEqual({
      name: 'Ada',
      url: 'https://unsplash.com/@ada'
    });
    expect(asset.utm).toEqual({ source: 'CE.SDK Demo', medium: 'referral' });
  });

  it('prefers the description over the alt text, and drops both when absent', async () => {
    expect(
      (await firstAsset(unsplashPhoto('a', { description: 'A beach' }))).label
    ).toBe('A beach');
    expect(
      (
        await firstAsset(
          unsplashPhoto('a', { description: null, alt_description: null })
        )
      ).label
    ).toBeUndefined();
  });

  it('carries the tags through when the response has them', async () => {
    expect(
      (await firstAsset(unsplashPhoto('a', { tags: [{ title: 'sea' }] }))).tags
    ).toEqual(['sea']);
    expect((await firstAsset(unsplashPhoto('a'))).tags).toBeUndefined();
  });

  it('omits the credits when the photo names no artist', async () => {
    expect(
      (await firstAsset(unsplashPhoto('a', { user: undefined }))).credits
    ).toBeUndefined();
  });
});

describe('PB-U15 applying an Unsplash asset', () => {
  const asset = {
    id: 'a',
    meta: { uri: 'a-download', thumbUri: 'a-thumb' }
  } as unknown as AssetResult;

  it('tracks the download and hands the engine the resolved url', async () => {
    trackDownload.mockResolvedValue({
      type: 'success',
      response: { url: 'https://images.unsplash.com/a.jpg' }
    });
    const engine = fakeEngine();

    const blockId = await source(engine).applyAsset!(asset as never);

    expect(trackDownload).toHaveBeenCalledWith({
      downloadLocation: 'a-download'
    });
    expect(engine.asset.defaultApplyAsset).toHaveBeenCalledWith({
      id: 'a',
      meta: {
        uri: 'https://images.unsplash.com/a.jpg',
        thumbUri: 'a-thumb',
        previewUri: 'a-thumb'
      }
    });
    expect(blockId).toBe(42);
  });

  it('tracks the download when the asset replaces an existing block', async () => {
    trackDownload.mockResolvedValue({
      type: 'success',
      response: { url: 'https://images.unsplash.com/a.jpg' }
    });
    const engine = fakeEngine();

    await source(engine).applyAssetToBlock!(asset as never, 7);

    expect(engine.asset.defaultApplyAssetToBlock).toHaveBeenCalledWith(
      expect.objectContaining({
        meta: expect.objectContaining({
          uri: 'https://images.unsplash.com/a.jpg'
        })
      }),
      7
    );
  });

  it('refuses an asset that carries no download location', async () => {
    await expect(
      source().applyAsset!({ id: 'a', meta: {} } as never)
    ).rejects.toThrow('Cannot download without valid URI for asset a');
  });

  it('joins every tracking error into one message', async () => {
    trackDownload.mockResolvedValue({
      type: 'error',
      errors: ['expired', 'try again']
    });
    await expect(source().applyAsset!(asset as never)).rejects.toThrow(
      'expired. try again'
    );
  });
});

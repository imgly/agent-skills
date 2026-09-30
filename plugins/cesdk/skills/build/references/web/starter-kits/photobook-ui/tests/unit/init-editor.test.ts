import type CreativeEngine from '@cesdk/engine';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('unsplash-js', () => ({
  createApi: vi.fn(() => ({
    search: { getPhotos: vi.fn() },
    photos: { list: vi.fn(), trackDownload: vi.fn() }
  })),
  OrderBy: { LATEST: 'latest' }
}));

const { initPhotobookEditor } = await import('../../src/imgly');
const { PHOTOBOOK_LAYOUTS } = await import('../../src/imgly/photobook-layouts');
const { PHOTOBOOK_STICKERS } =
  await import('../../src/imgly/photobook-stickers');
const { default: loadAssetSourceFromContentJSON } =
  await import('../../src/imgly/loadAssetSourceFromContentJSON');

function fakeEngine() {
  return {
    getBaseURL: vi.fn(() => 'https://assets.example/'),
    editor: {
      setSetting: vi.fn(),
      setRole: vi.fn(),
      setGlobalScope: vi.fn()
    },
    asset: {
      addSource: vi.fn(),
      addLocalSource: vi.fn(),
      addLocalAssetSourceFromJSONURI: vi.fn(async () => undefined),
      addAssetToSource: vi.fn()
    }
  } as unknown as CreativeEngine;
}

let engine: CreativeEngine;

beforeEach(async () => {
  engine = fakeEngine();
  await initPhotobookEditor(engine, 'https://demo.example/photobook');
});

describe('PB-U20 setting the photobook editor up', () => {
  it('hides the page title and puts the engine in the adopter role', () => {
    expect(engine.editor.setSetting).toHaveBeenCalledWith(
      'page/title/show',
      false
    );
    expect(engine.editor.setRole).toHaveBeenCalledWith('Adopter');
  });

  it('loads every bundled source from the engine base URL', () => {
    const requested = (
      engine.asset.addLocalAssetSourceFromJSONURI as ReturnType<typeof vi.fn>
    ).mock.calls.map(([uri]) => uri);
    expect(requested).toEqual([
      'https://assets.example/ly.img.color.palette/content.json',
      'https://assets.example/ly.img.typeface/content.json',
      'https://assets.example/ly.img.text/content.json',
      'https://assets.example/ly.img.text.styles/content.json',
      'https://assets.example/ly.img.text.curves/content.json',
      'https://assets.example/ly.img.text.components/content.json',
      'https://assets.example/ly.img.vector.shape/content.json'
    ]);
  });

  it('narrows the shape source to the filled shapes this editor offers', () => {
    const shapes = (
      engine.asset.addLocalAssetSourceFromJSONURI as ReturnType<typeof vi.fn>
    ).mock.calls.find(([uri]) => String(uri).includes('ly.img.vector.shape'));
    expect(shapes?.[1]).toEqual({
      matcher: ['ly.img.vector.shape.filled.*']
    });
  });

  it('registers the three upload sources with their mime types', () => {
    const uploads = new Map(
      (engine.asset.addLocalSource as ReturnType<typeof vi.fn>).mock.calls
        .filter(([, mimeTypes]) => Array.isArray(mimeTypes))
        .map(([id, mimeTypes]) => [id, mimeTypes])
    );
    expect([...uploads.keys()]).toEqual([
      'ly.img.image.upload',
      'ly.img.video.upload',
      'ly.img.audio.upload'
    ]);
    expect(uploads.get('ly.img.image.upload')).toContain('image/png');
    expect(uploads.get('ly.img.audio.upload')).toEqual([
      'audio/mpeg',
      'audio/mp3',
      'audio/x-m4a',
      'audio/wav'
    ]);
  });

  it('adds this kit s own stickers and layouts against the demo base URL', () => {
    const added = (engine.asset.addAssetToSource as ReturnType<typeof vi.fn>)
      .mock.calls;
    expect(added).toHaveLength(
      PHOTOBOOK_STICKERS.assets.length + PHOTOBOOK_LAYOUTS.assets.length
    );
    for (const [, asset] of added) {
      expect(JSON.stringify(asset)).not.toContain('{{base_url}}');
      expect(JSON.stringify(asset)).toContain('https://demo.example/photobook');
    }
  });

  it('gives the layout source the handler that applies a layout', () => {
    const layouts = (
      engine.asset.addLocalSource as ReturnType<typeof vi.fn>
    ).mock.calls.find(([id]) => id === PHOTOBOOK_LAYOUTS.id);
    expect(typeof layouts?.[2]).toBe('function');
    const stickers = (
      engine.asset.addLocalSource as ReturnType<typeof vi.fn>
    ).mock.calls.find(([id]) => id === PHOTOBOOK_STICKERS.id);
    expect(stickers?.[2]).toBeUndefined();
  });

  it('registers the image-colours and Unsplash sources', () => {
    const sources = (
      engine.asset.addSource as ReturnType<typeof vi.fn>
    ).mock.calls.map(([source]) => source.id);
    expect(sources).toEqual(['ly.img.colors.imageColors', 'unsplash']);
  });

  it('defers the destroy scope so only pages the user added can be deleted', () => {
    expect(engine.editor.setGlobalScope).toHaveBeenCalledWith(
      'lifecycle/destroy',
      'Defer'
    );
  });
});

describe('PB-U21 resolving a content catalogue', () => {
  it('substitutes the base URL in a source set as well as in the meta', async () => {
    const target = fakeEngine();
    await loadAssetSourceFromContentJSON(
      target,
      {
        version: '1',
        id: 'demo',
        assets: [
          {
            id: 'a',
            meta: { uri: '{{base_url}}/a.png', width: 10 },
            payload: {
              sourceSet: [
                { uri: '{{base_url}}/a@2x.png', width: 20, height: 20 }
              ]
            }
          }
        ]
      } as never,
      'https://demo.example'
    );

    const [, asset] = (
      target.asset.addAssetToSource as ReturnType<typeof vi.fn>
    ).mock.calls[0];
    expect(asset.meta).toEqual({
      uri: 'https://demo.example/a.png',
      width: '10'
    });
    expect(asset.payload.sourceSet[0].uri).toBe(
      'https://demo.example/a@2x.png'
    );
  });

  it('leaves an asset with neither meta nor source set alone', async () => {
    const target = fakeEngine();
    await loadAssetSourceFromContentJSON(
      target,
      { version: '1', id: 'demo', assets: [{ id: 'a' }] } as never,
      'https://demo.example'
    );

    const [, asset] = (
      target.asset.addAssetToSource as ReturnType<typeof vi.fn>
    ).mock.calls[0];
    expect(asset).toEqual({ id: 'a', meta: undefined, payload: undefined });
  });
});

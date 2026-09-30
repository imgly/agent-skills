import type CreativeEngine from '@cesdk/engine';
import {
  createTestEngine,
  disposeTestEngine,
  type TestEngine
} from '@imgly/kit-test-harness/node';
import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi
} from 'vitest';
import { autoPlaceBlockOnPage } from '../../src/imgly/creative-engine-utils';
import createUnsplashSource from '../../src/imgly/unsplash-source';

let raw: TestEngine;
let engine: CreativeEngine;

beforeAll(async () => {
  raw = await createTestEngine();
  engine = raw as unknown as CreativeEngine;
});

afterAll(() => {
  disposeTestEngine();
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

function pageOfSize(width: number, height: number): number {
  const scene = engine.scene.create();
  const page = engine.block.create('page');
  engine.block.setWidth(page, width);
  engine.block.setHeight(page, height);
  engine.block.appendChild(scene, page);
  return page;
}

describe('AP-H5 autoPlaceBlockOnPage', () => {
  // The undo step the helper records only settles once the engine ticks, which
  // the headless engine never does; AP-04 proves it in the browser instead.
  it('AP-H5 appends the block and selects it', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const page = pageOfSize(1000, 1000);
    const block = engine.block.create('text');

    autoPlaceBlockOnPage(engine, page, block);

    expect(engine.block.getParent(block)).toBe(page);
    expect(engine.block.getPositionXMode(block)).toBe('Absolute');
    expect(engine.block.getPositionYMode(block)).toBe('Absolute');
    expect(engine.block.getPositionX(block)).toBeCloseTo(250, 3);
    expect(engine.block.isSelected(block)).toBe(true);
  });

  it('AP-H5 deselects whatever was selected before', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const page = pageOfSize(1000, 1000);
    const first = engine.block.create('text');
    autoPlaceBlockOnPage(engine, page, first);
    const second = engine.block.create('text');

    autoPlaceBlockOnPage(engine, page, second);

    expect(engine.block.isSelected(first)).toBe(false);
    expect(engine.block.findAllSelected()).toEqual([second]);
  });

  it('AP-H5 places by the page height on a non-square page', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const page = pageOfSize(1000, 2000);
    const block = engine.block.create('text');

    autoPlaceBlockOnPage(engine, page, block);

    expect(engine.block.getPositionY(block)).toBeCloseTo(500, 3);
  });
});

describe('AP-H6 Unsplash apply', () => {
  const PHOTO = {
    id: 'photo-1',
    meta: {
      uri: 'https://api.example/photos/photo-1/download',
      thumbUri: 'https://images.example/thumb.jpg',
      blockType: '//ly.img.ubq/graphic',
      kind: 'image',
      fillType: '//ly.img.ubq/fill/image',
      width: 640,
      height: 480
    }
  };

  function stubDownload(url: string): void {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ url }),
        text: async () => JSON.stringify({ url })
      }))
    );
  }

  it('AP-H6 applies the tracked-download URL, not the asset meta URI', async () => {
    const scene = engine.scene.create();
    const page = engine.block.create('page');
    engine.block.appendChild(scene, page);
    const applied = 'https://images.example/full.jpg';
    stubDownload(applied);

    const source = createUnsplashSource(engine);
    const block = await source.applyAsset!(PHOTO as never);

    expect(block).toBeDefined();
    const fill = engine.block.getFill(block!);
    expect(engine.block.getType(fill)).toBe('//ly.img.ubq/fill/image');
    expect(engine.block.getString(fill, 'fill/image/imageFileURI')).toBe(
      applied
    );
    expect(engine.block.getString(fill, 'fill/image/previewFileURI')).toBe(
      PHOTO.meta.thumbUri
    );
  });

  it('AP-H6 rejects a photo without a URI before it calls the endpoint', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const source = createUnsplashSource(engine);

    await expect(
      source.applyAsset!({ id: 'no-uri', meta: {} } as never)
    ).rejects.toThrow('Cannot download without valid URI for asset no-uri');
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

import {
  createTestEngine,
  disposeTestEngine,
  repoRoot
} from '@imgly/kit-test-harness/node';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import type CreativeEngine from '@cesdk/engine';
import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi
} from 'vitest';

import { ALL_SIZES } from '../../src/app/components/CanvasSizeModal/CanvasSizeModal';
import { autoPlaceBlockOnPage, UPLOAD_MIME_TYPES } from '../../src/imgly';

const FONT_SUBSET = [
  'Caveat',
  'Courier Prime',
  'Roboto',
  'Oswald',
  'Parisienne',
  'Manrope'
];

/**
 * The asset pack the kit is served in the browser. The shared test engine's own
 * base URL points at the repository's versioned `assets/`, which carries no
 * `ly.img.image` source.
 */
const ASSETS_BASE_URL = `${pathToFileURL(join(repoRoot, 'apps/cesdk_web/build/assets')).href}/`;

let engine: CreativeEngine;

/** A fresh 1080 x 1920 page, the shape this kit's scene ships. */
async function socialMediaPage(): Promise<number> {
  const existing = engine.scene.get();
  if (existing != null) engine.block.destroy(existing);
  const scene = engine.scene.create();
  const page = engine.block.create('page');
  engine.block.setWidth(page, 1080);
  engine.block.setHeight(page, 1920);
  engine.block.appendChild(scene, page);
  return page;
}

beforeAll(async () => {
  engine = (await createTestEngine()) as unknown as CreativeEngine;
});

afterEach(() => {
  vi.restoreAllMocks();
});

afterAll(() => {
  disposeTestEngine();
});

describe('MB-H1 autoPlaceBlockOnPage', () => {
  it('appends the block and pins both position modes to Absolute', async () => {
    const page = await socialMediaPage();
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const block = engine.block.create('graphic');

    autoPlaceBlockOnPage(engine, page, block);

    expect(engine.block.getParent(block)).toBe(page);
    expect(engine.block.getPositionXMode(block)).toBe('Absolute');
    expect(engine.block.getPositionYMode(block)).toBe('Absolute');
    expect(engine.block.getPositionX(block)).toBeCloseTo(270, 5);
  });

  it('places the block a quarter down a 1080 x 1920 page', async () => {
    const page = await socialMediaPage();
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const block = engine.block.create('graphic');

    autoPlaceBlockOnPage(engine, page, block);

    expect(engine.block.getPositionY(block)).toBeCloseTo(480, 5);
  });
});

describe('MB-H2 the previous selection is cleared before placing', () => {
  it('leaves only the new block selected', async () => {
    const page = await socialMediaPage();
    const first = engine.block.create('graphic');
    const second = engine.block.create('graphic');
    engine.block.appendChild(page, first);
    engine.block.appendChild(page, second);
    engine.block.setSelected(first, true);
    engine.block.setSelected(second, true);
    expect(engine.block.findAllSelected()).toHaveLength(2);

    const third = engine.block.create('graphic');
    autoPlaceBlockOnPage(engine, page, third);

    expect(engine.block.findAllSelected()).toEqual([third]);
  });
});

describe('MB-H3 the asset sources the kit registers', () => {
  it('registers the five sources with the matchers the kit chose', async () => {
    const baseURL = ASSETS_BASE_URL;

    await engine.asset.addLocalAssetSourceFromJSONURI(
      `${baseURL}ly.img.vector.shape/content.json`,
      { matcher: ['ly.img.vector.shape.filled.*'] }
    );
    await engine.asset.addLocalAssetSourceFromJSONURI(
      `${baseURL}ly.img.sticker/content.json`
    );
    await engine.asset.addLocalAssetSourceFromJSONURI(
      `${baseURL}ly.img.typeface/content.json`
    );
    engine.asset.addLocalSource('ly.img.image.upload', UPLOAD_MIME_TYPES);
    await engine.asset.addLocalAssetSourceFromJSONURI(
      `${baseURL}ly.img.image/content.json`,
      { matcher: ['ly.img.image.*'] }
    );

    const ids = engine.asset.findAllSources();
    for (const id of [
      'ly.img.typeface',
      'ly.img.vector.shape',
      'ly.img.sticker',
      'ly.img.image',
      'ly.img.image.upload'
    ]) {
      expect(ids, id).toContain(id);
    }

    expect(engine.asset.getSupportedMimeTypes('ly.img.image.upload')).toEqual(
      UPLOAD_MIME_TYPES
    );

    const shapes = await engine.asset.findAssets('ly.img.vector.shape', {
      page: 0,
      perPage: 100
    });
    expect(shapes.assets.length).toBeGreaterThan(0);
    for (const asset of shapes.assets) {
      expect(asset.id, asset.id).toMatch(/^ly\.img\.vector\.shape\.filled\./);
    }

    const images = await engine.asset.findAssets('ly.img.image', {
      page: 0,
      perPage: 100
    });
    expect(images.assets.length).toBeGreaterThan(0);
    for (const asset of images.assets) {
      expect(asset.id, asset.id).toMatch(/^ly\.img\.image\./);
    }

    const groups = await engine.asset.getGroups('ly.img.sticker');
    expect(groups.length).toBeGreaterThan(0);
  });
});

describe('MB-H4 the font subset', () => {
  it('resolves all six names the picker offers', async () => {
    const baseURL = ASSETS_BASE_URL;
    await engine.asset.addLocalAssetSourceFromJSONURI(
      `${baseURL}ly.img.typeface/content.json`
    );
    const result = await engine.asset.findAssets('ly.img.typeface', {
      page: 0,
      perPage: 200
    });
    const names = result.assets.map((asset) => asset.label);

    for (const font of FONT_SUBSET) {
      expect(names, font).toContain(font);
    }
  });
});

describe('MB-H5 the four size presets are usable', () => {
  it.each(ALL_SIZES)('resizes the page to $name', async ({ width, height }) => {
    const page = await socialMediaPage();

    engine.block.resizeContentAware([page], width, height);

    expect(engine.block.getWidth(page)).toBeCloseTo(width, 3);
    expect(engine.block.getHeight(page)).toBeCloseTo(height, 3);
  });
});

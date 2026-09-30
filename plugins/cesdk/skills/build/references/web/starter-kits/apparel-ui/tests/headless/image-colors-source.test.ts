import type CreativeEngine from '@cesdk/engine';
import {
  createTestEngine,
  disposeTestEngine,
  repoRoot,
  type TestEngine
} from '@imgly/kit-test-harness/node';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import {
  createImageColorsSource,
  IMAGE_COLORS_SOURCE_ID
} from '../../src/imgly';

const IMAGES = [
  'assets/demo/v5/ly.img.image/images/sample_12-512x341.jpg',
  'assets/demo/v5/ly.img.image/images/sample_5-512x366.jpg'
].map((path) => pathToFileURL(join(repoRoot, path)).href);

let raw: TestEngine;
let engine: CreativeEngine;

beforeAll(async () => {
  raw = await createTestEngine();
  engine = raw as unknown as CreativeEngine;
});

afterAll(() => {
  disposeTestEngine();
});

/** A fresh scene with the given image URIs, one graphic each. */
async function sceneWithImages(uris: string[]): Promise<number[]> {
  const scene = engine.scene.create();
  const page = engine.block.create('page');
  engine.block.setWidth(page, 800);
  engine.block.setHeight(page, 600);
  engine.block.appendChild(scene, page);

  const blocks: number[] = [];
  for (const uri of uris) {
    const block = engine.block.create('graphic');
    engine.block.setShape(block, engine.block.createShape('rect'));
    const fill = engine.block.createFill('image');
    engine.block.setString(fill, 'fill/image/imageFileURI', uri);
    engine.block.setFill(block, fill);
    engine.block.setWidth(block, 200);
    engine.block.setHeight(block, 200);
    engine.block.appendChild(page, block);
    blocks.push(block);
  }
  await engine.block.forceLoadResources(blocks);
  return blocks;
}

/** The cache has a 250 ms TTL, so each case waits it out before it queries. */
async function expireCache(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 300));
}

beforeEach(async () => {
  await expireCache();
});

describe('AP-H1 the image-colours source groups by image block', () => {
  it('AP-H1 reports one group per image block', async () => {
    const [first, second] = await sceneWithImages(IMAGES);
    engine.block.setName(first, 'Front print');
    const source = createImageColorsSource(engine);

    await expireCache();
    expect(await source.getGroups!()).toEqual(['Front print', 'Image 1']);

    const result = await source.findAssets!({ page: 0, perPage: 99 });
    expect(result.assets.length).toBeGreaterThan(0);
    expect(result.assets.length).toBeLessThanOrEqual(10);
    for (const asset of result.assets) {
      expect(asset.payload!.color).toMatchObject({ colorSpace: 'sRGB' });
      expect(asset.id.startsWith(IMAGE_COLORS_SOURCE_ID)).toBe(true);
    }
    expect(engine.block.getName(second)).toBe('');
  });

  it('AP-H1 caps each group at five deduped colours', async () => {
    await sceneWithImages([IMAGES[0]]);
    const source = createImageColorsSource(engine);
    await expireCache();

    const result = await source.findAssets!({ page: 0, perPage: 99 });
    expect(result.assets.length).toBeGreaterThan(0);
    expect(result.assets.length).toBeLessThanOrEqual(5);
    expect(new Set(result.assets.map((asset) => asset.id)).size).toBe(
      result.assets.length
    );
  });
});

describe('AP-H2 duplicate images collapse into one group', () => {
  it('AP-H2 keys on the image file URI', async () => {
    await sceneWithImages([IMAGES[0], IMAGES[0]]);
    const source = createImageColorsSource(engine);
    await expireCache();

    expect(await source.getGroups!()).toHaveLength(1);
  });
});

describe('AP-H3 group and query filters', () => {
  it('AP-H3 narrows to a group, matches a hex, and reports an empty result', async () => {
    const [first] = await sceneWithImages(IMAGES);
    engine.block.setName(first, 'Front print');
    const source = createImageColorsSource(engine);
    await expireCache();

    const all = await source.findAssets!({ page: 0, perPage: 99 });
    const grouped = await source.findAssets!({
      page: 0,
      perPage: 99,
      groups: ['Front print']
    });
    expect(grouped.assets.length).toBeGreaterThan(0);
    expect(grouped.assets.length).toBeLessThan(all.assets.length);
    expect(
      grouped.assets.every((asset) => asset.groups![0] === 'Front print')
    ).toBe(true);

    const color = grouped.assets[0].payload!.color as {
      r: number;
      g: number;
      b: number;
    };
    const hex = `#${[color.r, color.g, color.b]
      .map((value) =>
        Math.round(value * 255)
          .toString(16)
          .padStart(2, '0')
      )
      .join('')}`;
    expect(
      (await source.findAssets!({ page: 0, perPage: 99, query: hex })).total
    ).toBeGreaterThan(0);
    expect(
      (await source.findAssets!({ page: 0, perPage: 99, query: hex.slice(1) }))
        .total
    ).toBeGreaterThan(0);
    expect(
      (await source.findAssets!({ page: 0, perPage: 99, query: 'front' })).total
    ).toBeGreaterThan(0);

    const none = await source.findAssets!({
      page: 0,
      perPage: 99,
      query: 'nothingmatchesthis'
    });
    expect(none.assets).toEqual([]);
    expect(none.total).toBe(0);
    expect(none.nextPage).toBeUndefined();
  });
});

describe('AP-H4 the palette cache', () => {
  it('AP-H4 serves the palette it built until the TTL expires', async () => {
    const [first] = await sceneWithImages([IMAGES[0]]);
    const source = createImageColorsSource(engine);
    await expireCache();
    expect(await source.getGroups!()).toHaveLength(1);

    const second = engine.block.create('graphic');
    engine.block.setShape(second, engine.block.createShape('rect'));
    const fill = engine.block.createFill('image');
    engine.block.setString(fill, 'fill/image/imageFileURI', IMAGES[1]);
    engine.block.setFill(second, fill);
    engine.block.setWidth(second, 200);
    engine.block.setHeight(second, 200);
    engine.block.appendChild(engine.block.getParent(first)!, second);
    await engine.block.forceLoadResources([second]);

    // Inside the 250 ms window the source still reports the old palette.
    expect(await source.getGroups!()).toHaveLength(1);
    await expireCache();
    expect(await source.getGroups!()).toHaveLength(2);
  });
});

import type CreativeEngine from '@cesdk/engine';
import {
  createTestEngine,
  disposeTestEngine,
  repoRoot
} from '@imgly/kit-test-harness/node';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import createImageColorsSource from '@/imgly/plugins/image-colors';
import { FONT_SUBSET } from '@/imgly/constants';
import {
  canDeleteSelection,
  findAllAssets,
  findShapes,
  findStickers,
  findTypefaces,
  getSelectedTypeface
} from '@/imgly/utils';

const sourceURI = (id: string) =>
  pathToFileURL(join(repoRoot, `assets/v8/${id}/content.json`)).href;

const IMAGES = [
  'assets/demo/v5/ly.img.image/images/sample_12-512x341.jpg',
  'assets/demo/v5/ly.img.image/images/sample_5-512x366.jpg'
].map((path) => pathToFileURL(join(repoRoot, path)).href);

const KIT_ASSETS_BASE_URL = `${pathToFileURL(join(repoRoot, 'apps/cesdk_web/build/assets')).href}/`;

let engine: CreativeEngine;

beforeAll(async () => {
  engine = (await createTestEngine({
    baseURL: KIT_ASSETS_BASE_URL
  })) as unknown as CreativeEngine;
  await engine.asset.addLocalAssetSourceFromJSONURI(
    sourceURI('ly.img.vector.shape'),
    { matcher: ['ly.img.vector.shape.filled.*'] }
  );
  await engine.asset.addLocalAssetSourceFromJSONURI(
    sourceURI('ly.img.sticker')
  );
  await engine.asset.addLocalAssetSourceFromJSONURI(
    sourceURI('ly.img.typeface')
  );
});

afterAll(() => {
  disposeTestEngine();
});

/** A fresh scene with one graphic per image URI. */
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

describe('PC-H7 the asset-source helpers', () => {
  it('PC-H7 offers only filled shapes', async () => {
    const shapes = await findShapes(engine);
    expect(shapes.length).toBeGreaterThan(0);
    expect(
      shapes.every((shape) =>
        shape.id.startsWith('ly.img.vector.shape.filled.')
      )
    ).toBe(true);
  });

  it('PC-H7 offers only the emoticon stickers', async () => {
    const all = await findStickers(engine);
    const emoticons = await findStickers(engine, ['emoticons']);
    expect(emoticons.length).toBeGreaterThan(0);
    expect(emoticons.length).toBeLessThan(all.length);
    expect(
      emoticons.every((sticker) => sticker.groups?.[0] === 'emoticons')
    ).toBe(true);
  });

  it('PC-H7 narrows the typefaces to the kit subset', async () => {
    const typefaces = await findTypefaces(engine);
    expect(typefaces.length).toBeGreaterThan(0);
    expect(
      typefaces.every((typeface) =>
        (FONT_SUBSET as readonly string[]).includes(typeface.name)
      )
    ).toBe(true);
  });

  it('PC-H7 pages through a source larger than one page', async () => {
    const all = await findAllAssets(engine, 'ly.img.sticker');
    const firstPage = await engine.asset.findAssets('ly.img.sticker', {
      page: 0,
      perPage: 100
    });
    expect(firstPage.nextPage).toBe(1);
    expect(all.length).toBeGreaterThan(firstPage.assets.length);
    expect(all.length).toBe(firstPage.total);
  });
});

describe('PC-H8 canDeleteSelection and getSelectedTypeface', () => {
  it('PC-H8 reports false when a selected block denies destruction', async () => {
    const scene = engine.scene.create();
    const page = engine.block.create('page');
    engine.block.appendChild(scene, page);
    const text = engine.block.create('text');
    engine.block.appendChild(page, text);

    expect(canDeleteSelection(engine, [text])).toBe(true);
    engine.block.setScopeEnabled(text, 'lifecycle/destroy', false);
    engine.editor.setGlobalScope('lifecycle/destroy', 'Defer');
    expect(canDeleteSelection(engine, [text])).toBe(false);
    expect(canDeleteSelection(engine, [])).toBe(true);
  });

  it('PC-H8 reports a typeface only for a block that carries one', () => {
    const scene = engine.scene.create();
    const page = engine.block.create('page');
    engine.block.appendChild(scene, page);
    expect(getSelectedTypeface(engine)).toBeUndefined();

    engine.block.setSelected(page, true);
    expect(getSelectedTypeface(engine)).toBeUndefined();

    engine.block.setSelected(page, false);
    const text = engine.block.create('text');
    engine.block.appendChild(page, text);
    engine.block.setSelected(text, true);
    expect(getSelectedTypeface(engine)?.name).toBe('Inter');
  });
});

describe('PC-H9 the image-colours source', () => {
  it('PC-H9 groups by image block and dedupes identical images', async () => {
    const [first] = await sceneWithImages(IMAGES);
    engine.block.setName(first, 'Front print');
    const source = createImageColorsSource(engine);
    await new Promise((resolve) => setTimeout(resolve, 300));

    expect(await source.getGroups!()).toEqual(['Front print', 'Image 1']);
    const result = (await source.findAssets!({ page: 0, perPage: 99 }))!;
    expect(result.assets.length).toBeGreaterThan(0);
    expect(result.assets.length).toBeLessThanOrEqual(10);
    for (const asset of result.assets) {
      expect(asset.payload!.color).toMatchObject({ colorSpace: 'sRGB' });
    }

    const grouped = (await source.findAssets!({
      page: 0,
      perPage: 99,
      groups: ['Front print']
    }))!;
    expect(grouped.assets.length).toBeLessThan(result.assets.length);
    expect(
      (await source.findAssets!({ page: 0, perPage: 99, query: 'zzz' }))!.total
    ).toBe(0);

    await sceneWithImages([IMAGES[0], IMAGES[0]]);
    await new Promise((resolve) => setTimeout(resolve, 300));
    expect(await source.getGroups!()).toHaveLength(1);
  });
});

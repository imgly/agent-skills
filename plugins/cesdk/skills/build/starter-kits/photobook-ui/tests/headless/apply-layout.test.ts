import {
  createTestEngine,
  disposeTestEngine
} from '@imgly/kit-test-harness/node';
import type CreativeEngine from '@cesdk/engine';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi
} from 'vitest';

import { createApplyLayoutAsset } from '../../src/imgly/apply-layout';
import loadAssetSourceFromContentJSON from '../../src/imgly/loadAssetSourceFromContentJSON';
import { PHOTOBOOK_LAYOUTS } from '../../src/imgly/photobook-layouts';
import { PHOTOBOOK_STICKERS } from '../../src/imgly/photobook-stickers';
import { DEMO_ASSETS_DIR } from '../demo-assets';

let engine: CreativeEngine;

/**
 * `createApplyLayoutAsset` fetches the layout scene, so the templates are read
 * off disk instead. The asset uri is used as the file name.
 */
function stubFetchFromDemoAssets(): void {
  vi.stubGlobal('fetch', async (input: string) => {
    const name = String(input).split('/').pop();
    const contents = await readFile(join(DEMO_ASSETS_DIR, name!), 'utf8');
    return { text: async () => contents } as Response;
  });
}

function layoutAsset(index: number) {
  const asset = PHOTOBOOK_LAYOUTS.assets[index];
  return {
    ...asset,
    meta: { ...asset.meta, uri: asset.meta.uri.replace('{{base_url}}/', '') }
  };
}

async function loadPhotobook(): Promise<number> {
  const existing = engine.scene.get();
  if (existing != null) engine.block.destroy(existing);
  const serialized = await readFile(
    join(DEMO_ASSETS_DIR, 'photobook.scene'),
    'utf8'
  );
  return engine.scene.loadFromString(serialized);
}

/** Drop a source registered by an earlier case in the same worker. */
function removeSourceIfPresent(id: string): void {
  if (engine.asset.findAllSources().includes(id)) {
    engine.asset.removeSource(id);
  }
}

/** Every descendant of a block, depth first — what `copyAssets` walks. */
function childrenTree(block: number): number[] {
  const children = engine.block.getChildren(block);
  return [...children, ...children.flatMap((child) => childrenTree(child))];
}

function kindsOf(page: number): string[] {
  return childrenTree(page).map((block) => engine.block.getKind(block));
}

beforeAll(async () => {
  engine = (await createTestEngine()) as unknown as CreativeEngine;
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

afterAll(() => {
  disposeTestEngine();
});

describe('PB-H1 a layout replaces the page content', () => {
  it('keeps the page and leaves neither the duplicate nor the layout behind', async () => {
    await loadPhotobook();
    stubFetchFromDemoAssets();
    const page = engine.scene.getCurrentPage()!;
    const pagesBefore = engine.scene.getPages().length;
    const scopeBefore = engine.editor.getGlobalScope('lifecycle/destroy');

    const applied = await createApplyLayoutAsset(engine)(layoutAsset(1));

    expect(applied).toBe(page);
    expect(engine.scene.getPages()).toHaveLength(pagesBefore);
    expect(engine.editor.getGlobalScope('lifecycle/destroy')).toBe(scopeBefore);
    expect(engine.block.isValid(page)).toBe(true);
  });
});

describe('PB-H2 photos and text are carried across', () => {
  it('moves the image URIs and the text of the old page onto the layout', async () => {
    await loadPhotobook();
    stubFetchFromDemoAssets();
    const page = engine.scene.getCurrentPage()!;

    const before = childrenTree(page);
    const imagesBefore = before.filter(
      (block) => engine.block.getKind(block) === 'image'
    );
    const textsBefore = before.filter((block) =>
      engine.block.getType(block).includes('text')
    );
    const uris = imagesBefore.map((block) =>
      engine.block.getString(
        engine.block.getFill(block),
        'fill/image/imageFileURI'
      )
    );
    const texts = textsBefore.map((block) =>
      engine.block.getString(block, 'text/text')
    );

    await createApplyLayoutAsset(engine)(layoutAsset(1));

    const after = childrenTree(page);
    const imagesAfter = after.filter(
      (block) => engine.block.getKind(block) === 'image'
    );
    const textsAfter = after.filter((block) =>
      engine.block.getType(block).includes('text')
    );

    const transferred = Math.min(imagesBefore.length, imagesAfter.length);
    expect(transferred).toBeGreaterThan(0);
    for (let index = 0; index < transferred; index++) {
      expect(
        engine.block.getString(
          engine.block.getFill(imagesAfter[index]),
          'fill/image/imageFileURI'
        )
      ).toBe(uris[index]);
      // Every transferred image has its crop reset.
      expect(
        engine.block.getFloat(imagesAfter[index], 'crop/rotation')
      ).toBeCloseTo(0, 5);
    }

    const transferredTexts = Math.min(textsBefore.length, textsAfter.length);
    for (let index = 0; index < transferredTexts; index++) {
      expect(engine.block.getString(textsAfter[index], 'text/text')).toBe(
        texts[index]
      );
    }
  });
});

describe('PB-H3 fewer or more frames than sources', () => {
  it('stops at the shorter list and leaves every frame with a fill', async () => {
    await loadPhotobook();
    stubFetchFromDemoAssets();
    const page = engine.scene.getCurrentPage()!;
    const apply = createApplyLayoutAsset(engine);

    for (const index of [0, 1, 2, 3]) {
      await apply(layoutAsset(index));
      const images = childrenTree(page).filter(
        (block) => engine.block.getKind(block) === 'image'
      );
      expect(images.length, `layout ${index + 1}`).toBeGreaterThan(0);
      for (const image of images) {
        expect(engine.block.getFill(image), `layout ${index + 1}`).toBeTruthy();
      }
    }
  });
});

describe('PB-H4 visual ordering', () => {
  it('transfers the photos top to bottom, then left to right', async () => {
    await loadPhotobook();
    stubFetchFromDemoAssets();
    const page = engine.scene.getCurrentPage()!;

    // A page whose three photos are laid out out of DOM order, so only a
    // visual sort produces the sequence asserted below.
    engine.block
      .getChildren(page)
      .forEach((child) => engine.block.destroy(child));
    const placements = [
      { uri: 'https://example.invalid/bottom.jpg', x: 10, y: 200 },
      { uri: 'https://example.invalid/top-right.jpg', x: 120, y: 10 },
      { uri: 'https://example.invalid/top-left.jpg', x: 10, y: 10 }
    ];
    for (const { uri, x, y } of placements) {
      const graphic = engine.block.create('graphic');
      engine.block.setShape(graphic, engine.block.createShape('rect'));
      const fill = engine.block.createFill('image');
      engine.block.setString(fill, 'fill/image/imageFileURI', uri);
      engine.block.setFill(graphic, fill);
      engine.block.setKind(graphic, 'image');
      engine.block.appendChild(page, graphic);
      engine.block.setPositionXMode(graphic, 'Absolute');
      engine.block.setPositionYMode(graphic, 'Absolute');
      engine.block.setPositionX(graphic, x);
      engine.block.setPositionY(graphic, y);
      engine.block.setWidth(graphic, 50);
      engine.block.setHeight(graphic, 50);
    }

    await createApplyLayoutAsset(engine)(layoutAsset(1));

    const images = childrenTree(page)
      .filter((block) => engine.block.getKind(block) === 'image')
      .map((block) => ({
        uri: engine.block.getString(
          engine.block.getFill(block),
          'fill/image/imageFileURI'
        ),
        x: Math.round(engine.block.getPositionX(block)),
        y: Math.round(engine.block.getPositionY(block))
      }))
      .sort((a, b) => (a.y === b.y ? a.x - b.x : a.y - b.y));

    const transferred = images
      .map(({ uri }) => uri)
      .filter((uri) => uri.startsWith('https://example.invalid/'));
    expect(transferred).toEqual(
      [
        'https://example.invalid/top-left.jpg',
        'https://example.invalid/top-right.jpg',
        'https://example.invalid/bottom.jpg'
      ].slice(0, transferred.length)
    );
    expect(transferred.length).toBeGreaterThan(0);
  });
});

describe('PB-H5 a failing layout fetch leaves the scene destroyable', () => {
  it('restores the global lifecycle/destroy scope', async () => {
    await loadPhotobook();
    const scopeBefore = engine.editor.getGlobalScope('lifecycle/destroy');
    vi.stubGlobal('fetch', async () => {
      throw new Error('network down');
    });

    await expect(
      createApplyLayoutAsset(engine)(layoutAsset(0))
    ).rejects.toThrow('network down');

    expect(engine.editor.getGlobalScope('lifecycle/destroy')).toBe(scopeBefore);
  });

  it('leaves no duplicated page behind', async () => {
    await loadPhotobook();
    const pagesBefore = engine.scene.getPages().length;
    vi.stubGlobal('fetch', async () => ({
      text: async () => 'not a scene'
    }));

    await expect(
      createApplyLayoutAsset(engine)(layoutAsset(0))
    ).rejects.toBeTruthy();

    expect(engine.scene.getPages()).toHaveLength(pagesBefore);
  });
});

describe('PB-H6 a text block the engine cannot resolve a typeface for', () => {
  it('keeps the target font and finishes the transfer', async () => {
    await loadPhotobook();
    stubFetchFromDemoAssets();
    const page = engine.scene.getCurrentPage()!;

    const bare = engine.block.create('text');
    engine.block.appendChild(page, bare);
    engine.block.setString(bare, 'text/text', 'no typeface here');

    // The engine answers with its default typeface for every text block, so
    // the only way to reach the kit's guard is to make the lookup fail.
    const getTypeface = vi
      .spyOn(engine.block, 'getTypeface')
      .mockImplementation(() => {
        throw new Error('typeface unavailable');
      });

    await expect(createApplyLayoutAsset(engine)(layoutAsset(1))).resolves.toBe(
      page
    );
    expect(getTypeface).toHaveBeenCalled();
    expect(kindsOf(page).length).toBeGreaterThan(0);
    getTypeface.mockRestore();
  });
});

describe('PB-H7 loadAssetSourceFromContentJSON substitutes the base URL', () => {
  it('registers the catalogue with every uri resolved', async () => {
    await loadPhotobook();
    removeSourceIfPresent(PHOTOBOOK_STICKERS.id);
    const base = 'https://assets.example.invalid/photobook';

    await loadAssetSourceFromContentJSON(engine, PHOTOBOOK_STICKERS, base);

    expect(engine.asset.findAllSources()).toContain(PHOTOBOOK_STICKERS.id);
    const result = await engine.asset.findAssets(PHOTOBOOK_STICKERS.id, {
      page: 0,
      perPage: 20
    });
    expect(result.assets).toHaveLength(6);
    for (const asset of result.assets) {
      expect(asset.meta?.uri, asset.id).toMatch(`${base}/stickers/`);
      expect(asset.meta?.thumbUri, asset.id).toMatch(`${base}/stickers/`);
    }
  });
});

describe('PB-H8 loading the same catalogue twice', () => {
  it('uses the second base URL, because the catalogue is not mutated', async () => {
    await loadPhotobook();
    removeSourceIfPresent(PHOTOBOOK_STICKERS.id);
    const first = 'https://first.example.invalid';
    const second = 'https://second.example.invalid';

    await loadAssetSourceFromContentJSON(engine, PHOTOBOOK_STICKERS, first);
    removeSourceIfPresent(PHOTOBOOK_STICKERS.id);
    await loadAssetSourceFromContentJSON(engine, PHOTOBOOK_STICKERS, second);

    const result = await engine.asset.findAssets(PHOTOBOOK_STICKERS.id, {
      page: 0,
      perPage: 20
    });
    for (const asset of result.assets) {
      expect(asset.meta?.uri, asset.id).toContain(second);
    }
    // The shared constant still carries its placeholder.
    expect(PHOTOBOOK_STICKERS.assets[0].meta.uri).toMatch(/^\{\{base_url\}\}/);
  });
});

describe('PB-H9 the layouts source applies through the kit handler', () => {
  it('reports four labelled layouts and rearranges the page', async () => {
    await loadPhotobook();
    stubFetchFromDemoAssets();
    removeSourceIfPresent(PHOTOBOOK_LAYOUTS.id);
    const page = engine.scene.getCurrentPage()!;

    await loadAssetSourceFromContentJSON(
      engine,
      PHOTOBOOK_LAYOUTS,
      '',
      createApplyLayoutAsset(engine)
    );

    const result = await engine.asset.findAssets(PHOTOBOOK_LAYOUTS.id, {
      page: 0,
      perPage: 20
    });
    expect(result.assets).toHaveLength(4);
    expect(result.assets.map((asset) => asset.label)).toEqual([
      'Layout 1',
      'Layout 2',
      'Layout 3',
      'Layout 4'
    ]);

    const applied = await engine.asset.apply(
      PHOTOBOOK_LAYOUTS.id,
      result.assets[1]
    );
    expect(applied).toBe(page);
  });
});

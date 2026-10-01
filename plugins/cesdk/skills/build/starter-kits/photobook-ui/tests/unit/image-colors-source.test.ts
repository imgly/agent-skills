import type CreativeEngine from '@cesdk/engine';
import type { AssetResult, AssetsQueryResult } from '@cesdk/engine';
import { describe, expect, it, vi } from 'vitest';

import {
  IMAGE_COLORS_SOURCE_ID,
  createImageColorsSource
} from '../../src/imgly/image-colors-source';

const IMAGE_FILL_TYPE = '//ly.img.ubq/fill/image';

interface FakeBlock {
  id: number;
  /** `null` means the block has no fill at all and `getFill` throws. */
  fill: number | null;
  supportsFill?: boolean;
  fillEnabled?: boolean;
  fillType?: string;
  uri?: string;
  sourceSet?: { uri: string }[];
  externalReference?: string;
  name?: string;
  fallbackName?: string;
  /** Successful `getFill` reads before it starts throwing. */
  fillReads?: number;
  colors?: { r: number; g: number; b: number }[];
  colorsFail?: boolean;
}

/**
 * The source reads through `try`/`catch` on every property, so a fake that
 * merely returns `undefined` would take a different branch than the engine,
 * which throws for an absent property.
 */
function readOrThrow(value: string | undefined): string {
  if (value === undefined) throw new Error('property not found');
  return value;
}

function fakeEngine(blocks: FakeBlock[]): CreativeEngine {
  const byId = new Map(blocks.map((block) => [block.id, block]));
  const byFill = new Map(
    blocks
      .filter((block) => block.fill != null)
      .map((block) => [block.fill as number, block])
  );
  const block = (id: number): FakeBlock => {
    const found = byId.get(id);
    if (found == null) throw new Error(`unknown block ${id}`);
    return found;
  };
  const fill = (id: number): FakeBlock => {
    const found = byFill.get(id);
    if (found == null) throw new Error(`unknown fill ${id}`);
    return found;
  };

  return {
    block: {
      findByType: (type: string) =>
        type === 'graphic' ? [...byId.keys()] : [],
      supportsFill: (id: number) => block(id).supportsFill ?? true,
      isFillEnabled: (id: number) => block(id).fillEnabled ?? true,
      getFill: (id: number) => {
        const target = block(id);
        if (target.fill == null) throw new Error('block has no fill');
        if (target.fillReads != null) {
          if (target.fillReads === 0) throw new Error('block has no fill');
          target.fillReads -= 1;
        }
        return target.fill;
      },
      getType: (id: number) => fill(id).fillType ?? IMAGE_FILL_TYPE,
      getString: (id: number, property: string) => {
        const owner = fill(id);
        if (property === 'fill/image/imageFileURI')
          return readOrThrow(owner.uri);
        if (property === 'fill/image/externalReference')
          return readOrThrow(owner.externalReference);
        throw new Error(`unknown property ${property}`);
      },
      getSourceSet: (id: number, property: string) => {
        const owner = fill(id);
        if (property !== 'fill/image/sourceSet' || owner.sourceSet == null) {
          throw new Error(`unknown property ${property}`);
        }
        return owner.sourceSet;
      },
      getName: (id: number) => readOrThrow(block(id).name),
      getMetadata: (id: number, key: string) => {
        if (key !== 'fallback-name') throw new Error('unknown metadata');
        return readOrThrow(block(id).fallbackName);
      },
      getDominantColors: async (id: number) => {
        const target = block(id);
        if (target.colorsFail) throw new Error('decode failed');
        return target.colors ?? [];
      }
    }
  } as unknown as CreativeEngine;
}

const RED = { r: 1, g: 0, b: 0 };
const BLUE = { r: 0, g: 0, b: 1 };

function image(id: number, overrides: Partial<FakeBlock> = {}): FakeBlock {
  return {
    id,
    fill: id * 10,
    colors: [RED],
    uri: `img-${id}.png`,
    ...overrides
  };
}

async function query(
  engine: CreativeEngine,
  parameters: Record<string, unknown> = {}
): Promise<AssetsQueryResult<AssetResult>> {
  const source = createImageColorsSource(engine);
  return source.findAssets!({
    page: 0,
    perPage: 100,
    ...parameters
  } as never) as Promise<AssetsQueryResult<AssetResult>>;
}

describe('PB-U10 the image colours source', () => {
  it('registers under the id the editor looks up', () => {
    const source = createImageColorsSource(fakeEngine([]));
    expect(source.id).toBe(IMAGE_COLORS_SOURCE_ID);
    expect(IMAGE_COLORS_SOURCE_ID).toBe('ly.img.colors.imageColors');
  });

  it('turns each image block into a group of colour assets', async () => {
    const engine = fakeEngine([
      image(1, { colors: [RED, BLUE], name: 'Cover' })
    ]);
    const result = await query(engine);

    expect(result.total).toBe(2);
    expect(result.currentPage).toBe(0);
    expect(result.nextPage).toBeUndefined();
    expect(result.assets.map((asset) => asset.groups)).toEqual([
      ['Cover'],
      ['Cover']
    ]);
    expect(result.assets[0].payload).toEqual({
      color: { colorSpace: 'sRGB', r: 1, g: 0, b: 0 }
    });
    expect(result.assets[0].id).toBe(
      `${IMAGE_COLORS_SOURCE_ID}.Cover.rgb:1.000,0.000,0.000`
    );
  });

  it('reports one group per image block', async () => {
    const engine = fakeEngine([
      image(1, { name: 'Cover' }),
      image(2, { name: 'Back' })
    ]);
    expect(await createImageColorsSource(engine).getGroups!()).toEqual([
      'Cover',
      'Back'
    ]);
  });

  it('skips a block with no image fill', async () => {
    const engine = fakeEngine([
      image(1, { supportsFill: false }),
      image(2, { fillEnabled: false }),
      image(3, { fillType: '//ly.img.ubq/fill/color' }),
      image(4, { fill: null })
    ]);
    expect(await query(engine)).toMatchObject({ assets: [], total: 0 });
  });

  it('drops a duplicate of the same image, whichever property identifies it', async () => {
    const engine = fakeEngine([
      image(1, { uri: 'same.png' }),
      image(2, { uri: 'same.png' }),
      image(3, {
        uri: undefined,
        sourceSet: [{ uri: 'b.png' }, { uri: 'a.png' }]
      }),
      image(4, {
        uri: undefined,
        sourceSet: [{ uri: 'a.png' }, { uri: 'b.png' }]
      }),
      image(5, { uri: undefined, externalReference: 'ext' }),
      image(6, { uri: undefined, externalReference: 'ext' })
    ]);
    // One group survives per distinct image: the uri, the sorted source set and
    // the external reference.
    expect(await createImageColorsSource(engine).getGroups!()).toHaveLength(3);
  });

  it('keeps a block whose fill identifies nothing', async () => {
    const engine = fakeEngine([
      image(1, { uri: undefined, sourceSet: [{ uri: '' }] }),
      image(2, { uri: undefined, externalReference: '' })
    ]);
    expect(await createImageColorsSource(engine).getGroups!()).toEqual([
      'Image 1',
      'Image 2'
    ]);
  });

  it('names an unnamed block by position and falls back to the metadata name', async () => {
    const engine = fakeEngine([
      image(1),
      image(2, { fallbackName: '  Beach  ' }),
      image(3, { name: '   ' })
    ]);
    expect(await createImageColorsSource(engine).getGroups!()).toEqual([
      'Image 1',
      'Beach',
      'Image 2'
    ]);
  });

  it('disambiguates two blocks that carry the same name', async () => {
    const engine = fakeEngine([
      image(1, { name: 'Cover' }),
      image(2, { name: 'Cover' }),
      image(3, { name: 'Cover' })
    ]);
    expect(await createImageColorsSource(engine).getGroups!()).toEqual([
      'Cover',
      'Cover (2)',
      'Cover (3)'
    ]);
  });

  it('drops a colour the same image reports twice', async () => {
    const engine = fakeEngine([
      image(1, { colors: [RED, { r: 1, g: 0.0001, b: 0 }, BLUE] })
    ]);
    // The dedupe key rounds to three decimals, so the near-identical red goes.
    expect((await query(engine)).total).toBe(2);
  });

  it('keeps the editor running when an image cannot be decoded', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const engine = fakeEngine([
      image(1, { colorsFail: true }),
      image(2, { name: 'Back' })
    ]);

    expect(await createImageColorsSource(engine).getGroups!()).toEqual([
      'Back'
    ]);
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('[ImageColors] Failed to extract colors'),
      expect.any(Error)
    );
    warn.mockRestore();
  });

  it('drops an image that yields no colour at all', async () => {
    const engine = fakeEngine([image(1, { colors: [] })]);
    expect(await createImageColorsSource(engine).getGroups!()).toEqual([]);
  });
});

describe('PB-U11 filtering the image colours', () => {
  it('returns everything when no group filter is given', async () => {
    const engine = fakeEngine([
      image(1, { name: 'Cover' }),
      image(2, { name: 'Back' })
    ]);
    expect((await query(engine, { groups: [] })).total).toBe(2);
  });

  it.each([
    ['a single group name', 'Cover'],
    ['an array of group names', ['Cover']]
  ])('filters by %s', async (_label, groups) => {
    const engine = fakeEngine([
      image(1, { name: 'Cover' }),
      image(2, { name: 'Back' })
    ]);
    const result = await query(engine, { groups });
    expect(result.assets.map((asset) => asset.groups)).toEqual([['Cover']]);
  });

  it('matches a query against the hex value, with and without the hash', async () => {
    const engine = fakeEngine([image(1, { colors: [RED, BLUE] })]);
    expect((await query(engine, { query: '#ff0000' })).total).toBe(1);
    expect(
      (
        await query(fakeEngine([image(1, { colors: [RED, BLUE] })]), {
          query: 'ff0000'
        })
      ).total
    ).toBe(1);
  });

  it('matches a query against the group name and requires every word', async () => {
    const engine = fakeEngine([image(1, { name: 'Sunny beach' })]);
    expect((await query(engine, { query: 'sunny beach' })).total).toBe(1);
    expect(
      (
        await query(fakeEngine([image(1, { name: 'Sunny beach' })]), {
          query: 'sunny mountain'
        })
      ).total
    ).toBe(0);
  });

  it('treats a query made only of punctuation as no query', async () => {
    const engine = fakeEngine([image(1, { name: 'Cover' })]);
    expect((await query(engine, { query: '!!!' })).total).toBe(1);
  });

  it('reuses the palette for calls inside the same panel tick', async () => {
    const engine = fakeEngine([image(1)]);
    const findByType = vi.spyOn(engine.block, 'findByType');
    const source = createImageColorsSource(engine);

    await source.getGroups!();
    await source.findAssets!({ page: 0, perPage: 10 } as never);

    expect(findByType).toHaveBeenCalledTimes(1);
  });

  it('traverses the scene again once the cache has expired', async () => {
    vi.useFakeTimers();
    try {
      const engine = fakeEngine([image(1)]);
      const findByType = vi.spyOn(engine.block, 'findByType');
      const source = createImageColorsSource(engine);

      await source.getGroups!();
      vi.setSystemTime(Date.now() + 500);
      await source.getGroups!();

      expect(findByType).toHaveBeenCalledTimes(2);
    } finally {
      vi.useRealTimers();
    }
  });

  // PB-U20: the fill can go away between the two reads the source makes of it.
  it('still collects the colours of a block whose fill it can no longer read', async () => {
    const engine = fakeEngine([image(1, { fillReads: 1, name: 'Cover' })]);
    const result = await query(engine);

    expect(result.assets.map((asset) => asset.groups)).toEqual([['Cover']]);
  });
});

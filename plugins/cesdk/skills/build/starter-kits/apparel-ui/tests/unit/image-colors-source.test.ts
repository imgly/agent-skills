import type CreativeEngine from '@cesdk/engine';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createImageColorsSource } from '../../src/imgly/image-colors-source';

interface FakeBlock {
  supportsFill?: boolean;
  fillEnabled?: boolean;
  /** Throws out of `supportsFill`, the way an invalid block does. */
  invalid?: boolean;
  fillType?: string;
  name?: string;
  metadata?: string;
  imageFileURI?: string | null;
  sourceSet?: { uri: string }[] | null;
  externalReference?: string | null;
  colors?: { r: number; g: number; b: number }[] | 'throws';
}

const RED = { r: 1, g: 0, b: 0 };
const BLUE = { r: 0, g: 0, b: 1 };

function fakeEngine(blocks: Record<number, FakeBlock>): CreativeEngine {
  const get = (id: number) => blocks[id];
  const missing = (property: string) => {
    throw new Error(`no ${property}`);
  };
  return {
    block: {
      findByType: () => Object.keys(blocks).map(Number),
      supportsFill: (id: number) => {
        if (get(id).invalid) throw new Error(`unknown block ${id}`);
        return get(id).supportsFill ?? true;
      },
      isFillEnabled: (id: number) => get(id).fillEnabled ?? true,
      getFill: (id: number) => {
        if (get(id).fillType === 'no-fill') throw new Error('no fill');
        return id + 1000;
      },
      getType: (fill: number) =>
        get(fill - 1000).fillType ?? '//ly.img.ubq/fill/image',
      getString: (fill: number, property: string) => {
        const block = get(fill - 1000);
        if (property === 'fill/image/imageFileURI') {
          return block.imageFileURI ?? missing(property);
        }
        return block.externalReference ?? missing(property);
      },
      getSourceSet: (fill: number) =>
        get(fill - 1000).sourceSet ?? missing('sourceSet'),
      getName: (id: number) => get(id).name ?? missing('name'),
      getMetadata: (id: number) => get(id).metadata ?? missing('metadata'),
      getDominantColors: async (id: number) => {
        const colors = get(id).colors;
        if (colors === 'throws') throw new Error('decode failed');
        return colors ?? [RED];
      }
    }
  } as unknown as CreativeEngine;
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('AP-U9 which blocks contribute colours', () => {
  it.each([
    ['a block with no fill support', { supportsFill: false }],
    ['a block whose fill is switched off', { fillEnabled: false }],
    ['a block the engine refuses to answer about', { invalid: true }],
    [
      'a block whose fill is not an image',
      { fillType: '//ly.img.ubq/fill/color' }
    ]
  ])('AP-U9 skips %s', async (_case, block) => {
    const source = createImageColorsSource(
      fakeEngine({ 1: { ...block, imageFileURI: 'a.png' } })
    );

    expect(await source.getGroups!()).toEqual([]);
  });

  it('AP-U9 keeps a block whose colours cannot be extracted out of the palette', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const source = createImageColorsSource(
      fakeEngine({ 1: { imageFileURI: 'a.png', colors: 'throws' } })
    );

    expect(await source.getGroups!()).toEqual([]);
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('Failed to extract colors from block 1'),
      expect.any(Error)
    );
  });
});

describe('AP-U10 how a repeated image is recognised', () => {
  it.each([
    [
      'the image file URI',
      { imageFileURI: 'photo.png' },
      { imageFileURI: 'photo.png' }
    ],
    [
      'the source set',
      { sourceSet: [{ uri: 'b.png' }, { uri: 'a.png' }] },
      { sourceSet: [{ uri: 'a.png' }, { uri: 'b.png' }] }
    ],
    [
      'the external reference',
      { externalReference: 'unsplash:1' },
      { externalReference: 'unsplash:1' }
    ]
  ])('AP-U10 collapses two blocks that share %s', async (_case, a, b) => {
    const source = createImageColorsSource(fakeEngine({ 1: a, 2: b }));

    expect(await source.getGroups!()).toEqual(['Image 1']);
  });

  it('AP-U10 keeps a block whose identity is unknown', async () => {
    const source = createImageColorsSource(
      fakeEngine({
        1: { imageFileURI: null, sourceSet: null, externalReference: null },
        2: { imageFileURI: null, sourceSet: null, externalReference: null }
      })
    );

    expect(await source.getGroups!()).toEqual(['Image 1', 'Image 2']);
  });

  it('AP-U10 ignores an empty URI and an empty source set', async () => {
    const source = createImageColorsSource(
      fakeEngine({
        1: { imageFileURI: '', sourceSet: [{ uri: '' }], externalReference: '' }
      })
    );

    expect(await source.getGroups!()).toEqual(['Image 1']);
  });
});

describe('AP-U11 the group names', () => {
  it('AP-U11 prefers the block name, then its fallback metadata', async () => {
    const source = createImageColorsSource(
      fakeEngine({
        1: { imageFileURI: 'a.png', name: '  Front  ' },
        2: { imageFileURI: 'b.png', metadata: 'Back' },
        3: { imageFileURI: 'c.png', name: '   ', metadata: '  ' }
      })
    );

    expect(await source.getGroups!()).toEqual(['Front', 'Back', 'Image 1']);
  });

  it('AP-U11 numbers repeated names', async () => {
    const source = createImageColorsSource(
      fakeEngine({
        1: { imageFileURI: 'a.png', name: 'Logo' },
        2: { imageFileURI: 'b.png', name: 'Logo' }
      })
    );

    expect(await source.getGroups!()).toEqual(['Logo', 'Logo (2)']);
  });
});

describe('AP-U12 querying the palette', () => {
  const engine = () =>
    fakeEngine({
      1: { imageFileURI: 'a.png', name: 'Front', colors: [RED, RED, BLUE] },
      2: { imageFileURI: 'b.png', name: 'Back', colors: [BLUE] }
    });

  it('AP-U12 dedupes the colours of one block', async () => {
    const source = createImageColorsSource(engine());

    const result = await source.findAssets!({ page: 0, perPage: 99 });

    expect(result.assets.map(({ id }) => id)).toEqual([
      'ly.img.colors.imageColors.Front.rgb:1.000,0.000,0.000',
      'ly.img.colors.imageColors.Front.rgb:0.000,0.000,1.000',
      'ly.img.colors.imageColors.Back.rgb:0.000,0.000,1.000'
    ]);
    expect(result.total).toBe(3);
  });

  it.each<[string, string | string[], number]>([
    ['a single group', 'Front', 2],
    ['a list of groups', ['Front', 'Back'], 3]
  ])('AP-U12 narrows to %s', async (_case, groups, expected) => {
    const source = createImageColorsSource(engine());

    const result = await source.findAssets!({
      page: 0,
      perPage: 99,
      groups: groups as string[]
    });

    expect(result.assets).toHaveLength(expected);
  });

  it('AP-U12 treats an empty group list as no filter', async () => {
    const source = createImageColorsSource(engine());

    const result = await source.findAssets!({
      page: 0,
      perPage: 99,
      groups: []
    });

    expect(result.assets).toHaveLength(3);
  });

  it.each([
    ['a hex with the hash', '#ff0000', 1],
    ['a hex without the hash', 'ff0000', 1],
    ['the group name', 'back', 1],
    ['a word that matches nothing', 'green', 0],
    ['punctuation only', '!!!', 3]
  ])('AP-U12 matches %s', async (_case, query, expected) => {
    const source = createImageColorsSource(engine());

    const result = await source.findAssets!({ page: 0, perPage: 99, query });

    expect(result.assets).toHaveLength(expected);
  });
});

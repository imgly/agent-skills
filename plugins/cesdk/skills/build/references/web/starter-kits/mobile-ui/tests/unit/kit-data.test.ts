import { describe, expect, it } from 'vitest';

import {
  hexToRgba,
  isColorEqual,
  rgbaToHex,
  UPLOAD_MIME_TYPES
} from '../../src/imgly';
import { ALL_SIZES } from '../../src/app/components/CanvasSizeModal/CanvasSizeModal';
import { ALL_COLORS } from '../../src/app/components/ColorSelect/ColorSelect';
import {
  labelForGroup,
  STICKER_GROUP_LABELS
} from '../../src/app/components/StickerSelectFilter/StickerSelectFilter';

describe('MB-U1 hexToRgba', () => {
  it('reads a 7-character hex as fully opaque', () => {
    expect(hexToRgba('#ffffff')).toEqual({ r: 1, g: 1, b: 1, a: 1 });
    expect(hexToRgba('#000000')).toEqual({ r: 0, g: 0, b: 0, a: 1 });
  });

  it('reads the alpha out of a 9-character hex', () => {
    expect(hexToRgba('#00000080').a).toBeCloseTo(0.502, 3);
  });

  it('expands the 4-character short form', () => {
    expect(hexToRgba('#abc')).toEqual(hexToRgba('#aabbcc'));
  });

  it('expands the 2-character form into six repeats', () => {
    expect(hexToRgba('#f')).toEqual(hexToRgba('#ffffff'));
  });

  it.each(['#', '#abcde', '#abcdefghij', 'ffffff'])('throws on %s', (value) => {
    expect(() => hexToRgba(value)).toThrow(/hexToRgba expects a hex string/);
  });

  it('rejects a 9-character string that is not hex', () => {
    expect(() => hexToRgba('#abcdefgh')).toThrow();
  });
});

describe('MB-U2 rgbaToHex', () => {
  it('round-trips every palette colour the kit offers', () => {
    expect(ALL_COLORS).toHaveLength(6);
    for (const color of ALL_COLORS) {
      expect(hexToRgba(rgbaToHex(color))).toEqual(color);
    }
  });

  it('always emits the 9-character form', () => {
    expect(rgbaToHex({ r: 1, g: 0, b: 0, a: 1 })).toBe('#ff0000ff');
    expect(rgbaToHex({ r: 1, g: 0, b: 0, a: 0 })).toBe('#ff000000');
  });
});

describe('MB-U3 isColorEqual', () => {
  const black = { r: 0, g: 0, b: 0, a: 1 };

  it('treats a difference under the default precision as equal', () => {
    expect(isColorEqual(black, { r: 0.0005, g: 0, b: 0, a: 1 })).toBe(true);
  });

  it('treats a difference above the default precision as different', () => {
    expect(isColorEqual(black, { r: 0.01, g: 0, b: 0, a: 1 })).toBe(false);
  });

  it('honours an explicit precision', () => {
    expect(isColorEqual(black, { r: 0.01, g: 0, b: 0, a: 1 }, 0.1)).toBe(true);
  });
});

describe('MB-U4 the size presets', () => {
  it('offers four uniquely named presets', () => {
    expect(ALL_SIZES).toHaveLength(4);
    expect(new Set(ALL_SIZES.map((size) => size.name)).size).toBe(4);
  });

  it('gives every preset positive whole pixel dimensions', () => {
    for (const size of ALL_SIZES) {
      expect(Number.isInteger(size.width), size.name).toBe(true);
      expect(Number.isInteger(size.height), size.name).toBe(true);
      expect(size.width, size.name).toBeGreaterThan(0);
      expect(size.height, size.name).toBeGreaterThan(0);
    }
  });

  it('lists the four sizes the modal shows', () => {
    expect(
      ALL_SIZES.map((size) => `${size.name} ${size.width}x${size.height}`)
    ).toEqual([
      'IG Post 1200x1200',
      'IG Story 1080x1920',
      'Full HD 1920x1080',
      '4K 3840x2160'
    ]);
  });

  it('sizes the 4K preset at 3840 x 2160', () => {
    const fourK = ALL_SIZES.find((size) => size.name === '4K');
    expect(fourK).toEqual({ name: '4K', width: 3840, height: 2160 });
  });
});

describe('MB-U5 the sticker group labels', () => {
  it('gives every mapped group a display string', () => {
    for (const id of Object.keys(STICKER_GROUP_LABELS)) {
      expect(STICKER_GROUP_LABELS[id], id).toBeTruthy();
      expect(labelForGroup(id)).toBe(STICKER_GROUP_LABELS[id]);
    }
  });

  it('capitalises a group the map does not name', () => {
    expect(labelForGroup('seasonal')).toBe('Seasonal');
  });

  it('names the eight groups the kit ships', () => {
    expect(Object.values(STICKER_GROUP_LABELS)).toEqual([
      'Doodle',
      'Emoji',
      'Emoticons',
      'Craft',
      '3D Grain',
      'Florals',
      'Hands',
      'Stickers'
    ]);
  });
});

describe('MB-U6 the upload source mime types', () => {
  it('accepts the seven types the kit registers', () => {
    expect(UPLOAD_MIME_TYPES).toEqual([
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/svg+xml',
      'image/bmp',
      'image/gif',
      'image/apng'
    ]);
  });
});

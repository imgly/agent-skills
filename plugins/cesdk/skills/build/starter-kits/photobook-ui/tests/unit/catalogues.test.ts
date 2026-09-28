import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

import { PHOTOBOOK_LAYOUTS } from '../../src/imgly/photobook-layouts';
import { PHOTOBOOK_STICKERS } from '../../src/imgly/photobook-stickers';
import {
  hexToRgba,
  isColorEqual,
  rgbaToHex
} from '../../src/app/contexts/color-utilities';
import { isEqual } from '../../src/app/contexts/utils';
import { DEMO_ASSETS_DIR } from '../demo-assets';

describe('PB-U1 the layout catalogue', () => {
  it('ships four layouts with the ids the kit references', () => {
    expect(PHOTOBOOK_LAYOUTS.id).toBe('ly.img.layouts');
    expect(PHOTOBOOK_LAYOUTS.assets.map((asset) => asset.id)).toEqual([
      'layout-1',
      'layout-2',
      'layout-3',
      'layout-4'
    ]);
  });

  it('labels each layout in English and points both URIs at the base URL', () => {
    for (const asset of PHOTOBOOK_LAYOUTS.assets) {
      expect(asset.label.en, asset.id).toMatch(/^Layout \d$/);
      expect(asset.meta.uri, asset.id).toMatch(/^\{\{base_url\}\}\//);
      expect(asset.meta.thumbUri, asset.id).toMatch(/^\{\{base_url\}\}\//);
    }
  });

  it('names files that exist in the in-repo demo data', () => {
    for (const asset of PHOTOBOOK_LAYOUTS.assets) {
      for (const uri of [asset.meta.uri, asset.meta.thumbUri]) {
        const relative = uri.replace('{{base_url}}/', '');
        expect(existsSync(join(DEMO_ASSETS_DIR, relative)), relative).toBe(
          true
        );
      }
    }
  });
});

describe('PB-U2 the sticker catalogue', () => {
  it('ships six stickers with unique ids', () => {
    expect(PHOTOBOOK_STICKERS.assets).toHaveLength(6);
    expect(new Set(PHOTOBOOK_STICKERS.assets.map((a) => a.id)).size).toBe(6);
  });

  it('describes every sticker the way the engine needs', () => {
    for (const asset of PHOTOBOOK_STICKERS.assets) {
      expect(asset.meta.kind, asset.id).toBe('sticker');
      expect(asset.meta.fillType, asset.id).toBe('//ly.img.ubq/fill/image');
      expect(asset.meta.width, asset.id).toBeGreaterThan(0);
      expect(asset.meta.height, asset.id).toBeGreaterThan(0);
      expect(asset.meta.uri, asset.id).toMatch(/^\{\{base_url\}\}\//);
      expect(asset.meta.thumbUri, asset.id).toMatch(/^\{\{base_url\}\}\//);
    }
  });

  it('names files that exist in the in-repo demo data', () => {
    for (const asset of PHOTOBOOK_STICKERS.assets) {
      const relative = asset.meta.uri.replace('{{base_url}}/', '');
      expect(existsSync(join(DEMO_ASSETS_DIR, relative)), relative).toBe(true);
    }
  });

  // Known issue 9: the catalogue takes the id of the engine's bundled sticker
  // source. Nothing collides today because this kit registers only its own.
  it('takes the engine sticker source id for itself', () => {
    expect(PHOTOBOOK_STICKERS.id).toBe('ly.img.sticker');
  });
});

describe('PB-U3 colour helpers', () => {
  it('reads a 7-character hex as fully opaque', () => {
    expect(hexToRgba('#ffffff')).toEqual({ r: 1, g: 1, b: 1, a: 1 });
  });

  it('reads the alpha out of a 9-character hex', () => {
    expect(hexToRgba('#00000080').a).toBeCloseTo(0.502, 3);
  });

  it('expands the short forms', () => {
    expect(hexToRgba('#abc')).toEqual(hexToRgba('#aabbcc'));
    expect(hexToRgba('#f')).toEqual(hexToRgba('#ffffff'));
  });

  it.each(['#', '#abcde', 'ffffff'])('throws on %s', (value) => {
    expect(() => hexToRgba(value)).toThrow(/hexToRgba expects a hex string/);
  });

  it('always emits the 9-character form and round-trips', () => {
    const hex = '#3498dbff';
    expect(rgbaToHex(hexToRgba(hex))).toBe(hex);
    expect(rgbaToHex({ r: 1, g: 0, b: 0, a: 0 })).toBe('#ff000000');
  });

  it('compares colours with a default and an explicit precision', () => {
    const black = { r: 0, g: 0, b: 0, a: 1 };
    expect(isColorEqual(black, { r: 0.0005, g: 0, b: 0, a: 1 })).toBe(true);
    expect(isColorEqual(black, { r: 0.01, g: 0, b: 0, a: 1 })).toBe(false);
    expect(isColorEqual(black, { r: 0.01, g: 0, b: 0, a: 1 }, 0.1)).toBe(true);
  });
});

describe('PB-U4 isEqual', () => {
  it('compares arrays and nested objects by value', () => {
    expect(isEqual([1, 2, 3], [1, 2, 3])).toBe(true);
    expect(isEqual({ a: { b: [1] } }, { a: { b: [1] } })).toBe(true);
  });

  it('rejects different lengths, key counts and types', () => {
    expect(isEqual([1, 2], [1, 2, 3])).toBe(false);
    expect(isEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false);
    expect(isEqual(1, '1')).toBe(false);
  });

  it('treats null against an object as unequal, and null against null as equal', () => {
    expect(isEqual(null, {})).toBe(false);
    expect(isEqual(null, null)).toBe(true);
  });
});

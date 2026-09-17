import { describe, expect, it } from 'vitest';
import {
  hexToRgba,
  isColorEqual,
  rgbaToHex
} from '../../src/imgly/color-utilities';

const PALETTE = [
  '#ffffff',
  '#000000',
  '#ff3333',
  '#ffd333',
  '#00d8a4',
  '#335fff'
];

describe('AP-U1 hexToRgba', () => {
  it('AP-U1 maps #ffffff to opaque white', () => {
    expect(hexToRgba('#ffffff')).toEqual({ r: 1, g: 1, b: 1, a: 1 });
  });

  it('AP-U1 reads the alpha channel of a 9-character value', () => {
    const color = hexToRgba('#00000080');
    expect(color).toMatchObject({ r: 0, g: 0, b: 0 });
    expect(color.a).toBeCloseTo(0.502, 3);
  });

  it('AP-U1 expands the 4-character short form', () => {
    expect(hexToRgba('#abc')).toEqual(hexToRgba('#aabbcc'));
  });

  it('AP-U1 expands the 2-character form into six repeats', () => {
    expect(hexToRgba('#f')).toEqual(hexToRgba('#ffffff'));
  });

  it('AP-U1 throws for any other length', () => {
    expect(() => hexToRgba('#abcde')).toThrow(
      /hexToRgba expects a hex string of length 7/
    );
  });
});

describe('AP-U2 rgbaToHex', () => {
  it('AP-U2 round-trips every palette colour', () => {
    for (const hex of PALETTE) {
      expect(rgbaToHex(hexToRgba(hex))).toBe(`${hex}ff`);
    }
  });

  it('AP-U2 always emits the 9-character form', () => {
    expect(rgbaToHex({ r: 0, g: 0, b: 0, a: 0 })).toBe('#00000000');
  });
});

describe('AP-U3 isColorEqual', () => {
  const black = { r: 0, g: 0, b: 0, a: 1 };

  it('AP-U3 is true inside the default precision', () => {
    expect(isColorEqual(black, { ...black, r: 0.0005 })).toBe(true);
  });

  it('AP-U3 is false outside the default precision', () => {
    expect(isColorEqual(black, { ...black, r: 0.01 })).toBe(false);
  });

  it('AP-U3 honours an explicit precision', () => {
    expect(isColorEqual(black, { ...black, r: 0.01 }, 0.1)).toBe(true);
  });
});

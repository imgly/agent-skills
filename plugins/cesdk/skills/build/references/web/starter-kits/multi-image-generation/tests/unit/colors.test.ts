import { describe, expect, it } from 'vitest';

import { hexToRgba } from '../../src/imgly/utils';

const BLACK = { r: 0, g: 0, b: 0, a: 1 };

describe('MIG-U1 hexToRgba', () => {
  it.each([
    ['#050087', { r: 5 / 255, g: 0, b: 135 / 255, a: 1 }],
    ['050087', { r: 5 / 255, g: 0, b: 135 / 255, a: 1 }],
    ['#EB11D5', { r: 235 / 255, g: 17 / 255, b: 213 / 255, a: 1 }],
    ['#eb11d5', { r: 235 / 255, g: 17 / 255, b: 213 / 255, a: 1 }]
  ])('converts %s to 0-to-1 channels with alpha 1', (hex, expected) => {
    expect(hexToRgba(hex as string)).toEqual(expected);
  });

  it.each(['', 'not-a-colour', '#12345', '#1234567'])(
    'falls back to opaque black for %s',
    (hex) => {
      expect(hexToRgba(hex)).toEqual(BLACK);
    }
  );

  it('converts every brand colour the kit ships', () => {
    for (const hex of [
      '#050087',
      '#F1E1C7',
      '#EB11D5',
      '#85EAD1',
      '#2E573E',
      '#E4A341'
    ]) {
      expect(hexToRgba(hex)).not.toEqual(BLACK);
    }
  });

  it('expands the three-digit form (known issue 9)', () => {
    expect(hexToRgba('#abc')).toEqual(hexToRgba('#aabbcc'));
  });
});

import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { repoRoot } from '@imgly/kit-test-harness/node';
import { hexToRgba, isColorEqual, rgbaToHex } from '@/imgly/utils';
import { POSTCARD_TEMPLATES } from '@/imgly/postcard-catalog';
import { pickBlockToKeep } from '@/app/contexts/selectionReconciliation';

const DATA_DIR = join(
  repoRoot,
  'packages/cesdk-web-examples-data/data/starterkit-postcard-ui'
);

describe('PC-U1 the postcard catalogue', () => {
  it('PC-U1 holds the four templates the Style step offers', () => {
    expect(Object.keys(POSTCARD_TEMPLATES)).toEqual([
      'thank_you',
      'merry_christmas',
      'bonjour_paris',
      'wish_you_were_here'
    ]);
  });

  it('PC-U1 gives every template a name, five colours and a keyword', () => {
    for (const template of Object.values(POSTCARD_TEMPLATES)) {
      expect(template.name.length).toBeGreaterThan(0);
      expect(template.colors).toHaveLength(5);
      for (const color of template.colors) {
        expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
      }
      expect(template.keyword.length).toBeGreaterThan(0);
    }
  });

  it('PC-U1 points every scene and preview at a file in the demo data', () => {
    for (const template of Object.values(POSTCARD_TEMPLATES)) {
      for (const path of [template.scene, template.preview]) {
        expect(path.startsWith('/templates/')).toBe(true);
        const file = join(DATA_DIR, path.slice(1));
        expect(existsSync(file)).toBe(true);
        // `data/**` is git-LFS and fetch-excluded: an unfetched file is a
        // pointer, not a missing one.
        expect(readFileSync(file, 'utf8').slice(0, 40)).not.toContain(
          'git-lfs'
        );
      }
    }
  });
});

describe('PC-U2 colour helpers', () => {
  it('PC-U2 maps #ffffff to opaque white and reads a 9-character alpha', () => {
    expect(hexToRgba('#ffffff')).toEqual({ r: 1, g: 1, b: 1, a: 1 });
    expect(hexToRgba('#00000080').a).toBeCloseTo(0.502, 3);
  });

  it('PC-U2 expands the short forms and rejects any other length', () => {
    expect(hexToRgba('#abc')).toEqual(hexToRgba('#aabbcc'));
    expect(hexToRgba('#f')).toEqual(hexToRgba('#ffffff'));
    expect(() => hexToRgba('#abcde')).toThrow(
      /hexToRgba expects a hex string of length 7/
    );
  });

  it('PC-U2 round-trips every template colour in the 9-character form', () => {
    for (const template of Object.values(POSTCARD_TEMPLATES)) {
      for (const hex of template.colors) {
        expect(rgbaToHex(hexToRgba(hex))).toBe(`${hex.toLowerCase()}ff`);
      }
    }
  });

  it('PC-U2 compares colours at the default and an explicit precision', () => {
    const black = { r: 0, g: 0, b: 0, a: 1 };
    expect(isColorEqual(black, { ...black, r: 0.0005 })).toBe(true);
    expect(isColorEqual(black, { ...black, r: 0.01 })).toBe(false);
    expect(isColorEqual(black, { ...black, r: 0.01 }, 0.1)).toBe(true);
  });
});

describe('PC-U3 pickBlockToKeep', () => {
  it('PC-U3 keeps the block added in the current gesture', () => {
    expect(pickBlockToKeep([1, 2, 3], [1], 2)).toBe(2);
  });

  it('PC-U3 falls back to the newest block outside the previous selection', () => {
    expect(pickBlockToKeep([1, 2, 3], [1], undefined)).toBe(3);
    expect(pickBlockToKeep([1, 2, 3], [1], 9)).toBe(3);
  });

  it('PC-U3 falls back to the last selected id when nothing is new', () => {
    expect(pickBlockToKeep([1, 2], [1, 2], undefined)).toBe(2);
  });
});

import { describe, expect, it } from 'vitest';

import { DEFAULT_SIZES } from '../../src/imgly/sizes';
import type { SizePreset } from '../../src/imgly/types';

const PLATFORMS: SizePreset['platform'][] = [
  'instagram',
  'x',
  'facebook',
  'linkedin',
  'youtube',
  'custom'
];

// AR-U1: the size presets the kit ships.
describe('DEFAULT_SIZES', () => {
  it('ships the four presets the demo generates', () => {
    expect(DEFAULT_SIZES.map((size) => size.id)).toEqual([
      'ig-story',
      'ig-post-4-5',
      'x-post',
      'facebook-post'
    ]);
  });

  it('gives every preset a unique id', () => {
    const ids = DEFAULT_SIZES.map((size) => size.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it.each(DEFAULT_SIZES)(
    '$id has a positive integer size in Pixel on a known platform',
    (size) => {
      expect(Number.isInteger(size.width)).toBe(true);
      expect(Number.isInteger(size.height)).toBe(true);
      expect(size.width).toBeGreaterThan(0);
      expect(size.height).toBeGreaterThan(0);
      expect(size.designUnit).toBe('Pixel');
      expect(PLATFORMS).toContain(size.platform);
      expect(size.label).not.toBe('');
    }
  );

  it('uses the dimensions the variant cards show', () => {
    expect(
      DEFAULT_SIZES.map(({ label, width, height }) => [label, width, height])
    ).toEqual([
      ['Instagram Story', 1080, 1920],
      ['Instagram Post 4:5', 1080, 1350],
      ['X (Twitter) Post', 1200, 675],
      ['Facebook Post', 1200, 630]
    ]);
  });
});

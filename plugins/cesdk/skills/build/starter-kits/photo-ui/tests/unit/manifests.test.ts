import { describe, expect, it } from 'vitest';

import ADJUSTMENTS from '../../src/app/AdjustSecondary/Adjustments.json';
import FILTER_MANIFEST from '../../src/app/FilterSecondary/FilterManifest.json';

const FILTER_GROUP = FILTER_MANIFEST.assets[0];
const FILTERS = FILTER_GROUP.assets;
const CATEGORY_ID_PREFIX = '//ly.img.cesdk.filters.lut/';

describe('PH-U1 the filter manifest as data', () => {
  it('ships 61 filters with unique ids', () => {
    expect(FILTERS).toHaveLength(61);
    expect(new Set(FILTERS.map((filter) => filter.id)).size).toBe(61);
  });

  it('gives every filter the four fields the kit reads', () => {
    for (const filter of FILTERS) {
      expect(filter.lutImage, filter.id).toBeTruthy();
      expect(filter.thumbPath, filter.id).toBeTruthy();
      expect(filter.name, filter.id).toBeTruthy();
      expect(filter.horizontalTileCount, filter.id).toBeGreaterThan(0);
      expect(filter.verticalTileCount, filter.id).toBeGreaterThan(0);
    }
  });

  it('uses only square 5x5 and 8x8 LUT tilings', () => {
    const tilings = new Set(
      FILTERS.map(
        (filter) => `${filter.horizontalTileCount}x${filter.verticalTileCount}`
      )
    );
    expect([...tilings].sort()).toEqual(['5x5', '8x8']);
  });

  it('lists only existing filters in its categories', () => {
    const ids = new Set(FILTERS.map((filter) => filter.id));
    for (const category of FILTER_GROUP.categories) {
      for (const assetId of category.assets) {
        expect(assetId.startsWith(CATEGORY_ID_PREFIX), assetId).toBe(true);
        expect(ids).toContain(assetId.slice(CATEGORY_ID_PREFIX.length));
      }
    }
  });

  it('leaves lomo in no category, and the kit reads no category at all', () => {
    const categorised = new Set(
      FILTER_GROUP.categories.flatMap((category) =>
        category.assets.map((assetId) =>
          assetId.slice(CATEGORY_ID_PREFIX.length)
        )
      )
    );
    expect(categorised.has('lomo')).toBe(false);
    expect(FILTER_GROUP.categories).toHaveLength(6);
  });
});

describe('PH-U2 the adjustments manifest as data', () => {
  const entries = Object.entries(ADJUSTMENTS);

  it('ships 12 adjustments with unique keys', () => {
    expect(entries).toHaveLength(12);
    expect(new Set(Object.keys(ADJUSTMENTS)).size).toBe(12);
  });

  it('labels every entry and keys it by its own id', () => {
    for (const [key, entry] of entries) {
      expect(entry.label, key).toBeTruthy();
      expect(entry.id).toBe(key);
    }
  });
});

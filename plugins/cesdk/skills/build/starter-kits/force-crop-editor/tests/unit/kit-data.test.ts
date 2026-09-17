import { describe, expect, it } from 'vitest';

import { DEFAULT_CROP_PRESETS } from '../../src/app/crop-presets';
import {
  DEMO_ASSETS_BASE_URL,
  SAMPLE_IMAGES
} from '../../src/app/sample-images';

const ASSET_PATH = `${DEMO_ASSETS_BASE_URL}/assets/force-crop/`;

// FCE-U1
describe('DEFAULT_CROP_PRESETS', () => {
  it('offers three presets in the order the selection screen shows them', () => {
    expect(DEFAULT_CROP_PRESETS.map((preset) => preset.id)).toEqual([
      'custom-portrait-post',
      'custom-profile-photo',
      'custom-shared-image'
    ]);
  });

  it.each([
    ['custom-portrait-post', 'Portrait Post (4:5)', 4, 5],
    ['custom-profile-photo', 'Profile Photo (1:1)', 1, 1],
    ['custom-shared-image', 'Shared Image (1.91:1)', 1.91, 1]
  ])('%s is a fixed %s ratio', (id, label, width, height) => {
    const preset = DEFAULT_CROP_PRESETS.find((entry) => entry.id === id)!;

    expect(preset.label.en).toBe(label);
    expect(preset.payload.transformPreset).toEqual({
      type: 'FixedAspectRatio',
      width,
      height,
      designUnit: 'Pixel'
    });
    expect(preset.groups).toEqual(['custom-ratio']);
  });

  it('builds every icon and thumbnail URL from the demo asset base URL', () => {
    for (const preset of DEFAULT_CROP_PRESETS) {
      expect(preset.meta.icon.startsWith(ASSET_PATH)).toBe(true);
      expect(preset.meta.thumbUri.startsWith(ASSET_PATH)).toBe(true);
    }
  });
});

// FCE-U2
describe('SAMPLE_IMAGES', () => {
  it('offers the three documented images', () => {
    expect(
      SAMPLE_IMAGES.map(({ width, height, alt }) => ({ width, height, alt }))
    ).toEqual([
      { width: 800, height: 1200, alt: 'Photographer with camera' },
      { width: 1200, height: 800, alt: 'Mountain landscape' },
      { width: 1200, height: 1200, alt: 'Healthy salad bowl' }
    ]);
  });

  it('serves the full image and its thumbnail from the demo asset base URL', () => {
    for (const image of SAMPLE_IMAGES) {
      expect(image.full.startsWith(ASSET_PATH)).toBe(true);
      expect(image.thumb).toBe(image.full);
    }
  });
});

describe('DEMO_ASSETS_BASE_URL', () => {
  it("falls back to the kit's own URL", async () => {
    expect(DEMO_ASSETS_BASE_URL).toBe(
      (typeof location === 'undefined'
        ? import.meta.env.BASE_URL
        : new URL(import.meta.env.BASE_URL, location.href).href
      ).replace(/\/$/, '')
    );
  });
});

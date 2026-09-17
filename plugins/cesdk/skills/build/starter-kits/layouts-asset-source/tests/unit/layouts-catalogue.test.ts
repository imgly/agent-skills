import { describe, expect, it } from 'vitest';

import LAYOUTS from '../../src/imgly/plugins/layouts/custom-layouts.json';

interface LayoutAsset {
  id: string;
  locale?: string;
  label: Record<string, string>;
  meta: { blockType: string; uri: string; thumbUri: string };
}

const assets = LAYOUTS.assets as unknown as LayoutAsset[];

describe('LAY-U1 layout catalogue', () => {
  it('is the ly.img.layouts source with 12 unique layouts', () => {
    expect(LAYOUTS.id).toBe('ly.img.layouts');
    expect(assets).toHaveLength(12);
    expect(new Set(assets.map((asset) => asset.id)).size).toBe(12);
  });

  it.each(assets.map((asset) => [asset.id, asset] as const))(
    '%s resolves its scene and thumbnail against the base URL',
    (_id, asset) => {
      expect(asset.meta.blockType).toBe('acme.layouts');
      expect(asset.meta.uri).toMatch(/^\{\{base_url\}\}\//);
      expect(asset.meta.thumbUri).toMatch(/^\{\{base_url\}\}\//);
      expect(asset.label.en).toBeTruthy();
    }
  );
});

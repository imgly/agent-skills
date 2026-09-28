/**
 * Stand-ins for the CE.SDK asset source plugins, so the kit's init module can
 * run under Node. The real classes come from a browser bundle that touches
 * `document` while it is imported.
 */
const NAMES = [
  'BlurAssetSource',
  'CaptionPresetsAssetSource',
  'ColorPaletteAssetSource',
  'CropPresetsAssetSource',
  'DemoAssetSources',
  'EffectsAssetSource',
  'FiltersAssetSource',
  'ImageColorsAssetSource',
  'PagePresetsAssetSource',
  'PremiumTemplatesAssetSource',
  'StickerAssetSource',
  'TextAssetSource',
  'TextComponentAssetSource',
  'TypefaceAssetSource',
  'UploadAssetSources',
  'VectorShapeAssetSource'
];

export interface AssetSourceStub {
  pluginName: string;
  options?: { include?: string[] };
}

export function assetSourceStubs(): Record<string, unknown> {
  return Object.fromEntries(
    NAMES.map((name) => [
      name,
      class {
        pluginName = name;
        constructor(public options?: { include?: string[] }) {}
      }
    ])
  );
}

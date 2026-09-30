import type CreativeEngine from '@cesdk/engine';
import type { AssetDefinition, AssetResult } from '@cesdk/engine';

async function loadAssetSourceFromContentJSON(
  engine: CreativeEngine,
  content: ContentJSON,
  baseURL = '',
  applyAsset?: ((asset: AssetResult) => Promise<number | undefined>) | undefined
) {
  const { assets, id: sourceId } = content;

  engine.asset.addLocalSource(sourceId, undefined, applyAsset);
  assets.forEach((asset) => {
    // The catalogues are module-level constants, so the substitution has to
    // produce a copy: writing it back would pin the first base URL forever.
    const resolved: AssetDefinition = {
      ...asset,
      meta: asset.meta
        ? Object.fromEntries(
            Object.entries(asset.meta).map(([key, value]) => [
              key,
              value.toString().replace('{{base_url}}', baseURL)
            ])
          )
        : asset.meta,
      payload: asset.payload?.sourceSet
        ? {
            ...asset.payload,
            sourceSet: asset.payload.sourceSet.map((sourceSet) => ({
              ...sourceSet,
              uri: sourceSet.uri.replace('{{base_url}}', baseURL)
            }))
          }
        : asset.payload
    };

    engine.asset.addAssetToSource(sourceId, resolved);
  });
}
export type ContentJSON = {
  version: string;
  id: string;
  assets: AssetDefinition[];
};

export default loadAssetSourceFromContentJSON;

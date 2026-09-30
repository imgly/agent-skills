/**
 * Generated Assets Component
 *
 * Displays the grid of generated assets with download and edit options.
 */

import type { GeneratedAsset } from '../../imgly';

import { AssetCard } from './AssetCard';

import styles from './GeneratedAssets.module.css';

interface GeneratedAssetsProps {
  assets: GeneratedAsset[];
  onDownload: (asset: GeneratedAsset) => void;
  onEdit: (asset: GeneratedAsset) => void;
}

export function GeneratedAssets({
  assets,
  onDownload,
  onEdit
}: GeneratedAssetsProps) {
  const sortedAssets = [...assets].sort((a, b) => a.id - b.id);

  return (
    <>
      <div className={styles.assetsWrapper}>
        {sortedAssets.map((asset) => (
          <AssetCard
            key={asset.id}
            asset={asset}
            onDownload={() => onDownload(asset)}
            onEdit={() => onEdit(asset)}
          />
        ))}
      </div>
    </>
  );
}

import type { GeneratedAsset } from '../../imgly';

import { Button } from '../Button/Button';
import { resolveAssetPath } from '../resolveAssetPath';
import { Spinner } from '../Spinner/Spinner';

import styles from './GeneratedAssets.module.css';

interface AssetCardProps {
  asset: GeneratedAsset;
  onDownload: () => void;
  onEdit: () => void;
}

export function AssetCard({ asset, onDownload, onEdit }: AssetCardProps) {
  return (
    <div className={styles.assetWrapper}>
      {asset.isLoading ? (
        <div
          className={styles.loadingSpinnerWrapper}
          style={{ aspectRatio: `${asset.width} / ${asset.height}` }}
        >
          <Spinner />
        </div>
      ) : (
        <div
          className={styles.assetPreviewWrapper}
          style={{ aspectRatio: `${asset.width} / ${asset.height}` }}
        >
          {asset.type === 'image' ? (
            <img
              className={styles.assetPreview}
              src={asset.src || ''}
              alt={asset.label}
            />
          ) : (
            <video
              className={styles.assetPreview}
              src={asset.src || ''}
              autoPlay
              loop
              muted
            />
          )}
          <div className={styles.assetOverlay}>
            <button className={styles.editButton} onClick={onEdit}>
              <img
                src={resolveAssetPath('/icons/edit.svg')}
                alt=""
                width={16}
                height={16}
              />
              <span>Edit</span>
            </button>
          </div>
        </div>
      )}
      <div className={styles.assetDescription}>
        <div>
          <p className={styles.bold}>{asset.label}</p>
          <p>
            {asset.width} × {asset.height} px
          </p>
        </div>
        <Button
          variant="secondary"
          size="small"
          disabled={asset.isLoading}
          onClick={onDownload}
        >
          <img
            src={resolveAssetPath('/icons/download.svg')}
            alt=""
            width={16}
            height={16}
          />
          <span>Download</span>
        </Button>
      </div>
    </div>
  );
}

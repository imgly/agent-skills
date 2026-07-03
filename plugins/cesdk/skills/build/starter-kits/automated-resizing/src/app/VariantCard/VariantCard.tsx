import classNames from 'classnames';

import type { VariantImage } from '../../imgly';
import { EditOverlay } from '../EditOverlay/EditOverlay';
import { Spinner } from '../Spinner/Spinner';
import { getPlatformIconFilename, resolveAssetPath } from '../utils';

import styles from './VariantCard.module.css';

const DOWNLOAD_ICON_PATH = resolveAssetPath('icons/download.svg');

interface VariantCardProps {
  variant: VariantImage;
  onEdit: () => void;
  onDownload: () => void;
}

export function VariantCard({ variant, onEdit, onDownload }: VariantCardProps) {
  const { size, src, isLoading } = variant;
  const aspectRatio = size.width / size.height;
  const canEdit = !isLoading && src;

  return (
    <div className={styles.card} data-size-id={size.id}>
      {/* Header */}
      <div className={styles.header}>
        <img
          src={resolveAssetPath(getPlatformIconFilename(size.platform))}
          alt={size.label}
          className={styles.platformIcon}
        />
        <div className={styles.headerText}>
          <h4 className={styles.title}>{size.label}</h4>
          <span className={styles.dimensions}>
            {size.width} × {size.height} px
          </span>
        </div>
      </div>

      {/* Preview Container */}
      <div
        className={classNames(styles.preview, {
          [styles.loading]: isLoading,
          [styles.empty]: !isLoading && !src
        })}
        style={{ aspectRatio: String(aspectRatio) }}
      >
        {src && (
          <img
            src={src}
            alt={size.label}
            className={classNames({ [styles.imageLoading]: isLoading })}
            data-cy={!isLoading ? 'export-image' : undefined}
          />
        )}
        {isLoading && <Spinner />}
        {canEdit && <EditOverlay onClick={onEdit} />}
      </div>

      {/* Footer */}
      {src && (
        <div className={styles.footer}>
          <button className={styles.downloadBtn} onClick={onDownload}>
            <span>Download</span>
            <img src={DOWNLOAD_ICON_PATH} alt="" className={styles.icon} />
          </button>
        </div>
      )}
    </div>
  );
}

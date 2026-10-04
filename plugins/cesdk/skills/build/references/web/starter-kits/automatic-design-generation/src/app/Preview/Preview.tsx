/**
 * Preview Component
 *
 * Displays a preview of the generated asset.
 */

import classNames from 'classnames';

import type { GeneratedAsset, OutputType } from '../../imgly';

import { Spinner } from '../Spinner/Spinner';

import styles from './Preview.module.css';

interface PreviewProps {
  previewAsset: GeneratedAsset;
  outputType: OutputType;
}

export function Preview({ previewAsset, outputType }: PreviewProps) {
  return (
    <div className={styles.previewWrapper}>
      <h4 className={styles.label}>Preview</h4>
      <div
        className={classNames(
          styles.previewImageWrapper,
          previewAsset.isLoading && styles.loading
        )}
      >
        {previewAsset.isLoading ? (
          <Spinner />
        ) : outputType === 'image' ? (
          <img
            className={styles.previewImage}
            src={previewAsset.src || ''}
            alt={previewAsset.label}
          />
        ) : (
          <video
            className={styles.previewImage}
            src={previewAsset.src || ''}
            autoPlay
            loop
            muted
          />
        )}
      </div>
    </div>
  );
}

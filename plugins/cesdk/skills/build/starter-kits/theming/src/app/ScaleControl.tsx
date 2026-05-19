/**
 * Scale Control Component
 *
 * Provides UI scaling toggle between normal and large modes.
 */

import { useCallback } from 'react';
import classNames from 'classnames';
import type CreativeEditorSDK from '@cesdk/cesdk-js';

import styles from './ThemingSidebar.module.css';

export type Scale = 'normal' | 'large';

interface ScaleControlProps {
  cesdk: CreativeEditorSDK | null;
  currentScale: Scale;
  onScaleChange: (scale: Scale) => void;
}

export function ScaleControl({
  cesdk,
  currentScale,
  onScaleChange
}: ScaleControlProps) {
  const handleScaleChange = useCallback(
    (scale: Scale) => {
      if (!cesdk) return;
      onScaleChange(scale);
      cesdk.ui.setScale(scale);
    },
    [cesdk, onScaleChange]
  );

  return (
    <div className={styles.segmentedControlWrapper}>
      <span className={styles.segmentedLabel}>UI Scaling</span>
      <div className={styles.segmentedOptions}>
        <button
          className={classNames({ [styles.active]: currentScale === 'normal' })}
          onClick={() => handleScaleChange('normal')}
        >
          Normal
        </button>
        <button
          className={classNames({ [styles.active]: currentScale === 'large' })}
          onClick={() => handleScaleChange('large')}
        >
          Large
        </button>
      </div>
    </div>
  );
}

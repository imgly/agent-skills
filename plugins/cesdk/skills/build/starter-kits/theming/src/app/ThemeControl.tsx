/**
 * Theme Control Component
 *
 * Provides theme preset toggle between light and dark modes.
 */

import { useCallback } from 'react';
import classNames from 'classnames';
import type CreativeEditorSDK from '@cesdk/cesdk-js';

import styles from './ThemingSidebar.module.css';

export type Theme = 'light' | 'dark';

interface ThemeControlProps {
  cesdk: CreativeEditorSDK | null;
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
}

export function ThemeControl({
  cesdk,
  currentTheme,
  onThemeChange
}: ThemeControlProps) {
  const handleThemeChange = useCallback(
    (theme: Theme) => {
      if (!cesdk) return;
      onThemeChange(theme);
      cesdk.ui.setTheme(theme);
    },
    [cesdk, onThemeChange]
  );

  return (
    <div className={styles.segmentedControlWrapper}>
      <span className={styles.segmentedLabel}>Theme</span>
      <div className={styles.segmentedOptions}>
        <button
          className={classNames({ [styles.active]: currentTheme === 'light' })}
          onClick={() => handleThemeChange('light')}
        >
          Light
        </button>
        <button
          className={classNames({ [styles.active]: currentTheme === 'dark' })}
          onClick={() => handleThemeChange('dark')}
        >
          Dark
        </button>
      </div>
    </div>
  );
}

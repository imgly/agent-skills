/**
 * AI Editor Top Bar - Mode Selector Component
 *
 * Displays a mode selector that allows users to switch between
 * Design, Photo, and Video editing modes.
 */

import { useCallback } from 'react';
import classNames from 'classnames';

import type { EditorMode } from '../App';
import styles from './Topbar.module.css';

// ============================================================================
// Types
// ============================================================================

interface TopbarProps {
  modes: readonly EditorMode[];
  currentMode: EditorMode;
  onModeChange: (mode: EditorMode) => void;
}

// ============================================================================
// Topbar Component
// ============================================================================

export function Topbar({ modes, currentMode, onModeChange }: TopbarProps) {
  const handleModeClick = useCallback(
    (mode: EditorMode) => {
      if (mode !== currentMode) {
        onModeChange(mode);
      }
    },
    [currentMode, onModeChange]
  );

  return (
    <div className={styles.container}>
      <div className={styles.selector}>
        {modes.map((mode) => (
          <button
            type="button"
            key={mode}
            className={classNames(styles.button, {
              [styles.active]: mode === currentMode
            })}
            onClick={() => handleModeClick(mode)}
          >
            {mode}
          </button>
        ))}
      </div>
    </div>
  );
}

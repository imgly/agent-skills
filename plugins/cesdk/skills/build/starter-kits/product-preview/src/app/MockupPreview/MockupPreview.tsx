/**
 * CE.SDK Mockup Editor - Mockup Preview Panel
 *
 * Renders the mockup preview with controls for fullscreen, edit, and download.
 */

import { useEffect } from 'react';
import classNames from 'classnames';
import { Icon } from '../Icon/Icon';
import styles from './MockupPreview.module.css';

// ============================================================================
// Types
// ============================================================================

interface MockupPreviewProps {
  imageUrl: string | null;
  isLoading: boolean;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onEditMockup: () => void;
  onDownload: () => void;
}

// ============================================================================
// Component
// ============================================================================

export function MockupPreview({
  imageUrl,
  isLoading,
  isFullscreen,
  onToggleFullscreen,
  onEditMockup,
  onDownload
}: MockupPreviewProps) {
  // Handle Escape key to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        onToggleFullscreen();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, onToggleFullscreen]);

  return (
    <div
      className={classNames(styles.preview, {
        [styles.fullscreen]: isFullscreen
      })}
    >
      {/* Loading Indicator */}
      {isLoading && (
        <div className={styles.loadingIndicator}>
          <div className={styles.spinner} />
        </div>
      )}

      {/* Mockup Image */}
      {imageUrl && !isLoading && (
        <img className={styles.image} src={imageUrl} alt="Product mockup" />
      )}

      {/* Preview Controls */}
      <div className={styles.controls}>
        {/* Fullscreen Toggle */}
        <button
          className={styles.controlButton}
          title={isFullscreen ? 'Exit fullscreen' : 'View fullscreen'}
          onClick={onToggleFullscreen}
        >
          <Icon name={isFullscreen ? 'fullscreen-leave' : 'fullscreen'} />
        </button>

        {/* Edit Mockup */}
        <button className={styles.controlButton} onClick={onEditMockup}>
          <Icon name="edit" />
          Edit
        </button>

        {/* Download */}
        <button
          className={styles.controlButton}
          title="Download mockup"
          onClick={onDownload}
        >
          <Icon name="download" />
        </button>
      </div>
    </div>
  );
}

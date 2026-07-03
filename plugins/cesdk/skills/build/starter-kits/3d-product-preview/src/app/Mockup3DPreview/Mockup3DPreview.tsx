/**
 * CE.SDK 3D Mockup Editor - 3D Preview Panel
 *
 * Renders the 3D product mockup using Google's model-viewer component.
 * Applies the rendered texture to the 3D model material.
 */

import { useCallback, useEffect, useRef } from 'react';
import classNames from 'classnames';
import '@google/model-viewer';

import type { ModelViewerElement } from '../types';
import { Icon } from '../Icon/Icon';
import styles from './Mockup3DPreview.module.css';

// ============================================================================
// Types
// ============================================================================

interface Mockup3DPreviewProps {
  mockupImageUrl: string | null;
  modelUrl: string;
  cameraOrbit: string;
  baseColorTextureIndex: number;
  isLoading: boolean;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

// ============================================================================
// Component
// ============================================================================

export function Mockup3DPreview({
  mockupImageUrl,
  modelUrl,
  cameraOrbit,
  baseColorTextureIndex,
  isLoading,
  isFullscreen,
  onToggleFullscreen
}: Mockup3DPreviewProps) {
  const modelViewerRef = useRef<ModelViewerElement>(null);
  const currentTextureUrlRef = useRef<string | null>(null);

  /**
   * Apply texture to the model when mockupImageUrl changes.
   */
  const applyTexture = useCallback(async () => {
    const modelViewer = modelViewerRef.current;
    if (!modelViewer || !mockupImageUrl) return;

    // Wait for model to be loaded
    if (!modelViewer.model) return;

    try {
      // Create texture from the mockup image URL
      const texture = await modelViewer.createTexture(mockupImageUrl);

      // Get the material and apply texture
      const material = modelViewer.model.materials[baseColorTextureIndex];
      if (material?.pbrMetallicRoughness?.baseColorTexture) {
        material.pbrMetallicRoughness.baseColorTexture.setTexture(texture);
        currentTextureUrlRef.current = mockupImageUrl;
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to apply texture:', error);
    }
  }, [mockupImageUrl, baseColorTextureIndex]);

  // Apply texture when mockupImageUrl changes
  useEffect(() => {
    if (mockupImageUrl && mockupImageUrl !== currentTextureUrlRef.current) {
      applyTexture();
    }
  }, [mockupImageUrl, applyTexture]);

  // Handle model load event
  const handleModelLoad = useCallback(() => {
    if (mockupImageUrl) {
      applyTexture();
    }
  }, [mockupImageUrl, applyTexture]);

  // Update camera orbit when it changes
  useEffect(() => {
    const modelViewer = modelViewerRef.current;
    if (!modelViewer) return;
    modelViewer.cameraOrbit = cameraOrbit;
    modelViewer.jumpCameraToGoal?.();
  }, [cameraOrbit]);

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

      {/* 3D Model Viewer */}
      <model-viewer
        ref={modelViewerRef as React.RefObject<HTMLElement>}
        src={modelUrl}
        camera-controls
        camera-orbit={cameraOrbit}
        shadow-intensity="1"
        style={{ width: '100%', height: '100%' }}
        onLoad={handleModelLoad}
      />

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
      </div>
    </div>
  );
}

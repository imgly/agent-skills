/**
 * CE.SDK Force Crop Editor - Main Application Component
 *
 * This component manages the application state and renders either:
 * - SelectionUI: For choosing image, crop preset, and mode
 * - CreativeEditor: For editing with the selected configuration
 */

import React, { useCallback, useEffect, useState } from 'react';
import { CreativeEditor } from '@cesdk/cesdk-js/react';
import type CreativeEditorSDK from '@cesdk/cesdk-js';
import type { Configuration } from '@cesdk/cesdk-js';

import SelectionUI from './SelectionUI';
import {
  initForceCropEditor,
  type CropPreset,
  type CropModeId,
  type ImageConfig
} from '../imgly';
import { DEFAULT_CROP_PRESETS } from './crop-presets';
import { SAMPLE_IMAGES } from './sample-images';

import styles from './App.module.css';

// ============================================================================
// Types
// ============================================================================

interface AppProps {
  config: Partial<Configuration>;
}

// ============================================================================
// Main Application Component
// ============================================================================

export default function App({ config }: AppProps) {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isEditorMounted, setIsEditorMounted] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ImageConfig>(
    SAMPLE_IMAGES[0]
  );
  const [selectedPreset, setSelectedPreset] = useState<CropPreset>(
    DEFAULT_CROP_PRESETS[0]
  );
  const [selectedMode, setSelectedMode] = useState<CropModeId>('always');

  // Defer the editor mount one frame after isEditorOpen flips to true so the
  // container paints first and the editor's progressive paint happens inside
  // an already-laid-out parent (no perceived layout glitch).
  useEffect(() => {
    if (!isEditorOpen) {
      setIsEditorMounted(false);
      return;
    }
    const id = requestAnimationFrame(() => setIsEditorMounted(true));
    return () => cancelAnimationFrame(id);
  }, [isEditorOpen]);

  /**
   * Open the editor with the currently selected configuration.
   */
  const handleOpenEditor = () => {
    setIsEditorOpen(true);
  };

  /**
   * Close the editor and return to selection UI
   */
  const handleClose = () => {
    setIsEditorOpen(false);
  };

  /**
   * Initialize the editor with selected configuration
   */
  const handleEditorInit = useCallback(
    async (cesdk: CreativeEditorSDK) => {
      // Expose cesdk instance globally for automated testing
      (window as unknown as { cesdk: CreativeEditorSDK }).cesdk = cesdk;

      // Initialize the force crop editor with selected configuration
      await initForceCropEditor(cesdk, {
        preset: selectedPreset,
        mode: selectedMode,
        image: selectedImage
      });

      // Add back button to navigation bar
      cesdk.ui.insertOrderComponent(
        { in: 'ly.img.navigation.bar', position: 'start' },
        {
          id: 'ly.img.close.navigationBar',
          onClick: () => handleClose()
        }
      );
    },
    [selectedPreset, selectedMode, selectedImage]
  );

  // ============================================================================
  // Render
  // ============================================================================

  return (
    <>
      <SelectionUI
        images={SAMPLE_IMAGES}
        presets={DEFAULT_CROP_PRESETS}
        selectedImage={selectedImage}
        selectedPreset={selectedPreset}
        selectedMode={selectedMode}
        onImageChange={setSelectedImage}
        onPresetChange={setSelectedPreset}
        onModeChange={setSelectedMode}
        onOpenEditor={handleOpenEditor}
      />
      {isEditorOpen && (
        <div className={styles.editorContainer}>
          {isEditorMounted && (
            <CreativeEditor config={config} init={handleEditorInit} />
          )}
        </div>
      )}
    </>
  );
}

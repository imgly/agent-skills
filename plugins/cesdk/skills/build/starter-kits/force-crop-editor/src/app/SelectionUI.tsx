/**
 * CE.SDK Force Crop Editor - Selection UI Component
 *
 * This component provides the initial selection interface where users can:
 * - Choose an image from sample images
 * - Select a crop preset (Instagram, LinkedIn, Facebook)
 * - Pick a crop mode (Always, If Needed, Silent)
 */

import React from 'react';
import classNames from 'classnames';
import type { CropPreset, CropModeId, ImageConfig } from '../imgly';

import styles from './SelectionUI.module.css';

// ============================================================================
// Types
// ============================================================================

interface SelectionUIProps {
  images: ImageConfig[];
  presets: CropPreset[];
  selectedImage: ImageConfig;
  selectedPreset: CropPreset;
  selectedMode: CropModeId;
  onImageChange: (image: ImageConfig) => void;
  onPresetChange: (preset: CropPreset) => void;
  onModeChange: (mode: CropModeId) => void;
  onOpenEditor: () => void;
}

interface CropModeOption {
  id: CropModeId;
  label: string;
  description: string;
}

// ============================================================================
// Configuration
// ============================================================================

/**
 * Available crop modes for the force crop feature.
 */
const CROP_MODES: CropModeOption[] = [
  {
    id: 'always',
    label: 'Always',
    description: 'This mode opens the Crop Mode always.'
  },
  {
    id: 'ifNeeded',
    label: 'If Needed',
    description:
      'This mode opens the Crop Mode only if image does not match the aspect ratio.'
  },
  {
    id: 'silent',
    label: 'Silent',
    description: 'This mode applies cropping silently without user interaction.'
  }
];

// ============================================================================
// Selection UI Component
// ============================================================================

export default function SelectionUI({
  images,
  presets,
  selectedImage,
  selectedPreset,
  selectedMode,
  onImageChange,
  onPresetChange,
  onModeChange,
  onOpenEditor
}: SelectionUIProps) {
  const selectedModeOption = CROP_MODES.find((m) => m.id === selectedMode);

  return (
    <div className={styles.selectionWrapper}>
      <div className={styles.selectionPage}>
        {/* Image Selection Card */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Select Image</h2>
          <div className={styles.imageGrid}>
            {images.map((image, index) => (
              <div
                key={index}
                className={classNames(styles.imageOption, {
                  [styles.selected]: image === selectedImage,
                  [styles.tall]: index === 0
                })}
                onClick={() => onImageChange(image)}
              >
                <img src={image.thumb} alt={image.alt} loading="lazy" />
              </div>
            ))}
          </div>
        </div>

        {/* Preset Selection Card */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Select Crop Preset</h2>
          <div className={styles.presetGrid}>
            {presets.map((preset) => {
              const { width, height } = preset.payload.transformPreset;
              const ratio = width === height ? '1:1' : `${width}:${height}`;

              return (
                <div
                  key={preset.id}
                  className={classNames(styles.presetOption, {
                    [styles.selected]: preset.id === selectedPreset.id
                  })}
                  onClick={() => onPresetChange(preset)}
                >
                  <div className={styles.presetIconWrapper}>
                    <img src={preset.meta.icon} alt={preset.meta.thumbAlt} />
                  </div>
                  <span className={styles.presetLabel}>
                    {preset.label.en.replace(/\s*\([^)]*\)/, '')}
                    <br />({ratio})
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mode Selection Card */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Select Mode</h2>
          <div className={styles.modeSelector}>
            <div className={styles.modeTabs}>
              {CROP_MODES.map((mode) => (
                <button
                  key={mode.id}
                  className={classNames(styles.modeTab, {
                    [styles.selected]: mode.id === selectedMode
                  })}
                  onClick={() => onModeChange(mode.id)}
                >
                  {mode.label}
                </button>
              ))}
            </div>
            <p className={styles.modeDescription}>
              {selectedModeOption?.description}
            </p>
          </div>
        </div>

        {/* Open Editor Button */}
        <button
          className={styles.openButton}
          onClick={onOpenEditor}
          data-cy="applyButton"
        >
          Open Editor
        </button>
      </div>
    </div>
  );
}

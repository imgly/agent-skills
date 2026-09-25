/**
 * Customization Panel Component
 *
 * Allows users to customize their design with message, colors, sizes, and output type.
 */

import classNames from 'classnames';
import { useRef, useState, useCallback } from 'react';
import { HexAlphaColorPicker, HexColorInput } from 'react-colorful';

import type { OutputType } from '../../imgly';

import { SIZES } from '../api/transformer';

import { PRESET_COLORS } from '../constants';
import { resolveAssetPath } from '../resolveAssetPath';

import { CaretBottom } from './CaretBottom';
import styles from './CustomizationPanel.module.css';
import { useOnClickOutside } from './useOnClickOutside';

interface CustomizationPanelProps {
  message: string;
  backgroundColor: string;
  selectedSizeIndexes: number[];
  outputType: OutputType;
  videoSupported: boolean;
  isLoading: boolean;
  onMessageChange: (message: string) => void;
  onColorChange: (color: string) => void;
  onSizeToggle: (index: number) => void;
  onTypeChange: (type: OutputType) => void;
}

export function CustomizationPanel({
  message,
  backgroundColor,
  selectedSizeIndexes,
  outputType,
  videoSupported,
  isLoading,
  onMessageChange,
  onColorChange,
  onSizeToggle,
  onTypeChange
}: CustomizationPanelProps) {
  const isTypeDisabled = !videoSupported || isLoading;
  const [pickerOpen, setPickerOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement | null>(null);

  const closePickerCallback = useCallback(() => {
    if (pickerOpen) {
      setPickerOpen(false);
    }
  }, [pickerOpen]);

  useOnClickOutside(pickerRef, closePickerCallback);

  return (
    <div className={styles.inputsWrapper}>
      {/* Message Input */}
      <div className={styles.inputWrapper}>
        <p className={styles.label}>Message</p>
        <input
          className={styles.messageInput}
          type="text"
          value={message}
          placeholder="Don't miss the latest episode"
          onChange={(e) => onMessageChange(e.target.value)}
        />
      </div>

      {/* Background Color */}
      <div className={styles.inputWrapper}>
        <p className={styles.label}>Background Color</p>
        <div className={styles.colorPickerWrapper}>
          <div className={styles.colorPickerSelectionWrapper}>
            <div className={styles.presetColors}>
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  className={styles.colorPreset}
                  style={{ backgroundColor: color }}
                  onClick={() => onColorChange(color)}
                  aria-label={`Select color ${color}`}
                />
              ))}
            </div>
            <button
              className={styles.colorInputWrapper}
              onClick={(e) => {
                setPickerOpen((prev) => !prev);
                e.stopPropagation();
              }}
              aria-label="Toggle color picker"
            >
              <span
                className={styles.colorPreviewSpan}
                style={{ backgroundColor }}
              />
              <CaretBottom />
            </button>
            <div
              className={classNames(
                styles.pickerModal,
                pickerOpen && styles.pickerModalOpen
              )}
              ref={pickerRef}
            >
              <HexAlphaColorPicker
                color={backgroundColor}
                onChange={onColorChange}
              />
              <div className={styles.hexInputWrapper}>
                <span>#</span>
                <HexColorInput
                  color={backgroundColor}
                  onChange={onColorChange}
                  className={styles.hexInput}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sizes */}
      <div className={styles.inputWrapper}>
        <p className={styles.label}>Sizes</p>
        <div className={styles.sizeInputsWrapper}>
          {SIZES.map((size, index) => (
            <label
              key={size.label}
              className={classNames(
                styles.sizeInputWrapper,
                selectedSizeIndexes.includes(index) && styles.selectedSizeInput
              )}
            >
              <input
                className={styles.sizeInput}
                type="checkbox"
                checked={selectedSizeIndexes.includes(index)}
                onChange={() => onSizeToggle(index)}
              />
              <p className={styles.bold}>{size.label}</p>
              <p>
                {size.width} × {size.height} px
              </p>
            </label>
          ))}
        </div>
      </div>

      {/* Type */}
      <div className={styles.inputWrapper}>
        <p className={styles.label}>Type</p>
        <div className={styles.typeInputWrapper}>
          <div className={styles.segmentedControl}>
            <button
              className={classNames(
                styles.segment,
                outputType === 'image' && styles.active,
                isTypeDisabled && styles.disabled
              )}
              onClick={() => !isTypeDisabled && onTypeChange('image')}
              disabled={isTypeDisabled}
            >
              Image
            </button>
            <button
              className={classNames(
                styles.segment,
                outputType === 'video' && styles.active,
                isTypeDisabled && styles.disabled
              )}
              onClick={() => !isTypeDisabled && onTypeChange('video')}
              disabled={isTypeDisabled}
            >
              Video
            </button>
          </div>
        </div>

        {!videoSupported && (
          <div className={styles.warningText}>
            <span>
              <img
                src={resolveAssetPath('/icons/alert.svg')}
                alt=""
                width={16}
                height={16}
              />
            </span>
            <p>Video is only supported in Chromium-based browsers.</p>
          </div>
        )}
      </div>
    </div>
  );
}

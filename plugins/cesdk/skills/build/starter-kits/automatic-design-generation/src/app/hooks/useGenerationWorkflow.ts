/**
 * useGenerationWorkflow Hook
 *
 * Orchestrates the asset generation workflow, handling debounced updates
 * and coordinating between customization inputs and asset generation.
 */

import { useCallback, useEffect, useRef } from 'react';

import type CreativeEngine from '@cesdk/engine';

import type { GeneratedAsset, OutputType } from '../../imgly';

import type { Podcast } from '../api/transformer';
import { downloadAsset } from '../utils/download';

interface GenerationConfig {
  podcast: Podcast;
  backgroundColor: string;
  message: string;
  outputType: OutputType;
  sizes: number[];
}

interface UseGenerationWorkflowProps {
  engine: CreativeEngine | null;
  isReady: boolean;
  currentPodcast: Podcast;
  backgroundColor: string;
  message: string;
  outputType: OutputType;
  selectedSizeIndexes: number[];
  setMessage: (message: string) => void;
  setBackgroundColor: (color: string) => void;
  setOutputType: (type: OutputType) => void;
  toggleSize: (index: number) => void;
  handlePodcastSelect: (podcast: Podcast) => Promise<string>;
  generateAssets: (engine: CreativeEngine, config: GenerationConfig) => void;
  generateSingleAsset: (
    engine: CreativeEngine,
    index: number,
    config: Omit<GenerationConfig, 'sizes'>
  ) => void;
  removeAsset: (index: number) => void;
  finalAssets: GeneratedAsset[];
}

interface UseGenerationWorkflowResult {
  onPodcastSelect: (podcast: Podcast) => Promise<void>;
  onMessageChange: (message: string) => void;
  onColorChange: (color: string) => void;
  onSizeToggle: (index: number) => void;
  onTypeChange: (type: OutputType) => void;
  onDownload: (asset: GeneratedAsset) => void;
}

export function useGenerationWorkflow({
  engine,
  isReady,
  currentPodcast,
  backgroundColor,
  message,
  outputType,
  selectedSizeIndexes,
  setMessage,
  setBackgroundColor,
  setOutputType,
  toggleSize,
  handlePodcastSelect,
  generateAssets,
  generateSingleAsset,
  removeAsset,
  finalAssets: _finalAssets
}: UseGenerationWorkflowProps): UseGenerationWorkflowResult {
  // Refs for debounce and initial generation tracking
  const messageDebounceRef = useRef<number | null>(null);
  const colorDebounceRef = useRef<number | null>(null);
  const hasGeneratedRef = useRef(false);

  // Initial generation when engine is ready (runs only once)
  useEffect(() => {
    if (isReady && engine && !hasGeneratedRef.current) {
      hasGeneratedRef.current = true;
      generateAssets(engine, {
        podcast: currentPodcast,
        backgroundColor,
        message,
        outputType,
        sizes: selectedSizeIndexes
      });
    }
  }, [
    isReady,
    engine,
    generateAssets,
    currentPodcast,
    backgroundColor,
    message,
    outputType,
    selectedSizeIndexes
  ]);

  // Handle podcast selection - extracts color and regenerates
  const onPodcastSelect = useCallback(
    async (podcast: Podcast) => {
      const mainColor = await handlePodcastSelect(podcast);
      setBackgroundColor(mainColor);

      if (engine) {
        generateAssets(engine, {
          podcast,
          backgroundColor: mainColor,
          message,
          outputType,
          sizes: selectedSizeIndexes
        });
      }
    },
    [
      handlePodcastSelect,
      setBackgroundColor,
      engine,
      generateAssets,
      message,
      outputType,
      selectedSizeIndexes
    ]
  );

  // Handle message change with debounce
  const onMessageChange = useCallback(
    (newMessage: string) => {
      setMessage(newMessage);

      if (messageDebounceRef.current) {
        clearTimeout(messageDebounceRef.current);
      }

      messageDebounceRef.current = window.setTimeout(() => {
        if (engine) {
          generateAssets(engine, {
            podcast: currentPodcast,
            backgroundColor,
            message: newMessage,
            outputType,
            sizes: selectedSizeIndexes
          });
        }
      }, 300);
    },
    [
      setMessage,
      engine,
      generateAssets,
      currentPodcast,
      backgroundColor,
      outputType,
      selectedSizeIndexes
    ]
  );

  // Handle color change with debounce
  const onColorChange = useCallback(
    (color: string) => {
      setBackgroundColor(color);

      if (colorDebounceRef.current) {
        clearTimeout(colorDebounceRef.current);
      }

      colorDebounceRef.current = window.setTimeout(() => {
        if (engine) {
          generateAssets(engine, {
            podcast: currentPodcast,
            backgroundColor: color,
            message,
            outputType,
            sizes: selectedSizeIndexes
          });
        }
      }, 300);
    },
    [
      setBackgroundColor,
      engine,
      generateAssets,
      currentPodcast,
      message,
      outputType,
      selectedSizeIndexes
    ]
  );

  // Handle size toggle
  const onSizeToggle = useCallback(
    (index: number) => {
      if (selectedSizeIndexes.includes(index)) {
        toggleSize(index);
        removeAsset(index);
      } else {
        toggleSize(index);
        if (engine) {
          generateSingleAsset(engine, index, {
            podcast: currentPodcast,
            backgroundColor,
            message,
            outputType
          });
        }
      }
    },
    [
      selectedSizeIndexes,
      toggleSize,
      removeAsset,
      engine,
      generateSingleAsset,
      currentPodcast,
      backgroundColor,
      message,
      outputType
    ]
  );

  // Handle output type change
  const onTypeChange = useCallback(
    (type: OutputType) => {
      setOutputType(type);
      if (engine) {
        generateAssets(engine, {
          podcast: currentPodcast,
          backgroundColor,
          message,
          outputType: type,
          sizes: selectedSizeIndexes
        });
      }
    },
    [
      setOutputType,
      engine,
      generateAssets,
      currentPodcast,
      backgroundColor,
      message,
      selectedSizeIndexes
    ]
  );

  // Handle asset download
  const onDownload = useCallback((asset: GeneratedAsset) => {
    downloadAsset(asset);
  }, []);

  return {
    onPodcastSelect,
    onMessageChange,
    onColorChange,
    onSizeToggle,
    onTypeChange,
    onDownload
  };
}

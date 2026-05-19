/**
 * useAssetGeneration Hook
 *
 * Manages preview and final asset generation using the CE.SDK Engine.
 */

import { useCallback, useState } from 'react';

import type CreativeEngine from '@cesdk/engine';

import type { GeneratedAsset, OutputType } from '../../imgly';
import { generateAsset } from '../../imgly';

import type { Podcast } from '../api/transformer';
import {
  createAssetOptions,
  createPreviewOptions,
  PREVIEW_SIZE,
  SIZES
} from '../api/transformer';

export interface GenerationOptions {
  podcast: Podcast | null;
  backgroundColor: string;
  message: string;
  outputType: OutputType;
  sizes: number[];
}

interface UseAssetGenerationReturn {
  previewAsset: GeneratedAsset;
  finalAssets: GeneratedAsset[];
  isLoading: boolean;
  generateAssets: (
    engine: CreativeEngine,
    options: GenerationOptions
  ) => Promise<void>;
  generateSingleAsset: (
    engine: CreativeEngine,
    sizeIndex: number,
    options: Omit<GenerationOptions, 'sizes'>
  ) => Promise<void>;
  updateAsset: (asset: GeneratedAsset) => void;
  removeAsset: (id: number) => void;
}

const initialPreviewAsset: GeneratedAsset = {
  id: -1,
  label: 'Preview',
  isLoading: true,
  width: PREVIEW_SIZE,
  height: PREVIEW_SIZE,
  src: null,
  type: 'image',
  sceneString: null
};

export function useAssetGeneration(): UseAssetGenerationReturn {
  const [previewAsset, setPreviewAsset] =
    useState<GeneratedAsset>(initialPreviewAsset);
  const [finalAssets, setFinalAssets] = useState<GeneratedAsset[]>([]);

  const isLoading =
    previewAsset.isLoading || finalAssets.some((a) => a.isLoading);

  const setFinalAssetsLoading = useCallback(
    (sizes: number[], outputType: OutputType) => {
      setFinalAssets(
        sizes.map((index) => ({
          id: index,
          label: SIZES[index].label,
          isLoading: true,
          width: SIZES[index].width,
          height: SIZES[index].height,
          src: null,
          type: outputType,
          sceneString: null
        }))
      );
    },
    []
  );

  const generateAssets = useCallback(
    async (engine: CreativeEngine, options: GenerationOptions) => {
      const { podcast, backgroundColor, message, outputType, sizes } = options;

      // Set preview to loading
      setPreviewAsset((prev) => ({ ...prev, isLoading: true, src: null }));

      // Generate preview
      const previewOptions = createPreviewOptions(
        outputType,
        podcast,
        backgroundColor,
        message
      );
      const preview = await generateAsset(engine, previewOptions);
      setPreviewAsset({ ...preview, type: outputType });

      // Set all selected sizes to loading
      setFinalAssetsLoading(sizes, outputType);

      // Generate assets for all selected sizes
      for (const sizeIndex of sizes) {
        const assetOptions = createAssetOptions(
          sizeIndex,
          outputType,
          podcast,
          backgroundColor,
          message
        );
        const asset = await generateAsset(engine, assetOptions);
        setFinalAssets((prev) =>
          prev.map((a) => (a.id === sizeIndex ? asset : a))
        );
      }
    },
    [setFinalAssetsLoading]
  );

  const generateSingleAsset = useCallback(
    async (
      engine: CreativeEngine,
      sizeIndex: number,
      options: Omit<GenerationOptions, 'sizes'>
    ) => {
      const { podcast, backgroundColor, message, outputType } = options;

      // Add loading placeholder for the new asset
      setFinalAssets((prev) => [
        ...prev,
        {
          id: sizeIndex,
          label: SIZES[sizeIndex].label,
          isLoading: true,
          width: SIZES[sizeIndex].width,
          height: SIZES[sizeIndex].height,
          src: null,
          type: outputType,
          sceneString: null
        }
      ]);

      // Generate the asset
      const assetOptions = createAssetOptions(
        sizeIndex,
        outputType,
        podcast,
        backgroundColor,
        message
      );
      const asset = await generateAsset(engine, assetOptions);

      setFinalAssets((prev) =>
        prev.map((a) => (a.id === sizeIndex ? asset : a))
      );
    },
    []
  );

  const updateAsset = useCallback((asset: GeneratedAsset) => {
    setFinalAssets((prev) => prev.map((a) => (a.id === asset.id ? asset : a)));
  }, []);

  const removeAsset = useCallback((id: number) => {
    setFinalAssets((prev) => prev.filter((a) => a.id !== id));
  }, []);

  return {
    previewAsset,
    finalAssets,
    isLoading,
    generateAssets,
    generateSingleAsset,
    updateAsset,
    removeAsset
  };
}

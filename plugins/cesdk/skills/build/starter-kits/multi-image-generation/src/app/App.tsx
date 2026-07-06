/**
 * CE.SDK Multi-Image Generation Starterkit - Main App Component
 *
 * Demonstrates automated image generation using CE.SDK headless engine.
 * Users can select restaurant data and generate branded assets in multiple formats,
 * then edit the generated templates in a full-featured editor.
 *
 * Editor Mode:
 * - No restaurant selected (Creator mode): Advanced design editor
 * - Restaurant selected (Adopter mode): Standard design editor
 */

import { useCallback, useState } from 'react';
import type CreativeEngine from '@cesdk/engine';

import { renderSceneToImage, generateAssets } from '../imgly';

import { RESTAURANTS } from './restaurant-catalog';
import { TEMPLATES } from './template-catalog';
import SCENES from './scenes.json';
import type { Restaurant, Template, GeneratedAsset } from './types';
import { resolveAssetPath } from './resolveAssetPath';

import RestaurantSelector from './RestaurantSelector/RestaurantSelector';
import AssetGrid from './AssetGrid/AssetGrid';
import EditorModal from './EditorModal/EditorModal';

import styles from './App.module.css';

const templates = Object.values(TEMPLATES);

function createInitialAssets(): GeneratedAsset[] {
  return templates.map((template) => ({
    isLoading: false,
    src: null,
    sceneString: null,
    label: template.label
  }));
}

import type { Configuration } from '@cesdk/cesdk-js';

interface AppProps {
  /** Initialized headless engine for batch image generation */
  engine: CreativeEngine;
  /** Base configuration for the editor */
  editorBaseConfig: Partial<Configuration>;
}

export default function App({ engine, editorBaseConfig }: AppProps) {
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<Restaurant | null>(null);
  const [assets, setAssets] = useState<GeneratedAsset[]>(createInitialAssets);
  const [isGenerating, setIsGenerating] = useState(false);

  // Editor modal state
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [editingIndex, setEditingIndex] = useState<number>(0);

  // Handle restaurant selection
  const handleRestaurantSelect = useCallback(
    async (restaurant: Restaurant | null) => {
      setSelectedRestaurant(restaurant);

      if (restaurant == null) {
        // Reset assets
        setAssets(createInitialAssets());
        return;
      }

      // Set loading state
      setIsGenerating(true);
      setAssets((prevAssets) =>
        prevAssets.map((asset) => ({ ...asset, isLoading: true }))
      );

      // Resolve asset paths for the current deployment context
      const restaurantWithResolvedPaths: Restaurant = {
        ...restaurant,
        photoPath: resolveAssetPath(restaurant.photoPath),
        logoPath: resolveAssetPath(restaurant.logoPath),
        cardPath: resolveAssetPath(restaurant.cardPath)
      };

      // Generate assets
      await generateAssets(
        engine,
        SCENES,
        templates,
        restaurantWithResolvedPaths,
        (index, generatedAsset) => {
          setAssets((prevAssets) => {
            const nextAssets = [...prevAssets];
            nextAssets[index] = generatedAsset;
            return nextAssets;
          });
        }
      );

      setIsGenerating(false);
    },
    [engine]
  );

  // Handle edit button click
  const handleEdit = useCallback((template: Template, index: number) => {
    setEditingTemplate(template);
    setEditingIndex(index);
    setEditorOpen(true);
  }, []);

  // Handle editor close
  const handleEditorClose = useCallback(() => {
    setEditorOpen(false);
    setEditingTemplate(null);
  }, []);

  // Handle editor save
  const handleEditorSave = useCallback(
    async (sceneString: string) => {
      if (editingTemplate == null) return;

      // Re-render the asset from the saved scene
      const src = await renderSceneToImage(
        engine,
        sceneString,
        editingTemplate.outputFormat
      );

      setAssets((prevAssets) => {
        const nextAssets = [...prevAssets];
        nextAssets[editingIndex] = {
          isLoading: false,
          src,
          sceneString,
          label: editingTemplate.label
        };
        return nextAssets;
      });

      handleEditorClose();
    },
    [engine, editingTemplate, editingIndex, handleEditorClose]
  );

  return (
    <div className={styles.app}>
      <RestaurantSelector
        restaurants={RESTAURANTS}
        selectedRestaurant={selectedRestaurant}
        disabled={isGenerating}
        onSelect={handleRestaurantSelect}
      />

      <AssetGrid templates={templates} assets={assets} onEdit={handleEdit} />

      <EditorModal
        isOpen={editorOpen}
        template={editingTemplate}
        sceneString={assets[editingIndex]?.sceneString ?? null}
        selectedRestaurant={selectedRestaurant}
        editorBaseConfig={editorBaseConfig}
        onBack={handleEditorClose}
        onClose={handleEditorClose}
        onSave={handleEditorSave}
      />
    </div>
  );
}

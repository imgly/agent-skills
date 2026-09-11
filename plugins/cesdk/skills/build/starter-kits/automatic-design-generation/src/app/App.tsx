/**
 * Automatic Design Generation - Main App Component
 */

import { useState, useCallback } from 'react';
import type { Configuration } from '@cesdk/cesdk-js';

import type { OutputType } from '../imgly';
import type { Podcast } from './api/transformer';

import { useAssetGeneration } from './hooks/useAssetGeneration';
import { useCustomization } from './hooks/useCustomization';
import { useEditorModal } from './hooks/useEditorModal';
import { useEngine } from './hooks/useEngine';
import { useGenerationWorkflow } from './hooks/useGenerationWorkflow';
import { usePodcastSearch } from './hooks/usePodcastSearch';

import { CustomizationPanel } from './CustomizationPanel/CustomizationPanel';
import { EditorModal } from './EditorModal/EditorModal';
import { GeneratedAssets } from './GeneratedAssets/GeneratedAssets';
import { PodcastSearch } from './PodcastSearch/PodcastSearch';
import { Preview } from './Preview/Preview';
import { StepIndicator } from './StepIndicator/StepIndicator';

import styles from './App.module.css';

interface AppProps {
  config: Configuration;
}

export default function App({ config }: AppProps) {
  const [currentStep, setCurrentStep] = useState(1);

  // Engine lifecycle
  const { engine, isReady, videoSupported } = useEngine(config);

  // Podcast search
  const {
    searchQuery,
    searchResults,
    isSearching,
    currentPodcast,
    handleSearchChange,
    handlePodcastSelect
  } = usePodcastSearch();

  // Customization state
  const {
    message,
    backgroundColor,
    selectedSizeIndexes,
    outputType,
    setMessage,
    setBackgroundColor,
    toggleSize,
    setOutputType
  } = useCustomization();

  // Asset generation
  const {
    previewAsset,
    finalAssets,
    isLoading,
    generateAssets,
    generateSingleAsset,
    updateAsset,
    removeAsset
  } = useAssetGeneration();

  // Editor modal
  const { editingAsset, openEditor, closeEditor, saveAndClose } =
    useEditorModal(updateAsset);

  // Generation workflow orchestration
  const {
    onPodcastSelect,
    onMessageChange,
    onColorChange,
    onSizeToggle,
    onTypeChange,
    onDownload
  } = useGenerationWorkflow({
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
    finalAssets
  });

  // Podcast selection → advance to step 2
  const handleSelectPodcast = useCallback(
    async (podcast: Podcast) => {
      await onPodcastSelect(podcast);
      setCurrentStep(2);
    },
    [onPodcastSelect]
  );

  // Type change wrapper
  const handleTypeChange = useCallback(
    (type: OutputType) => {
      onTypeChange(type);
    },
    [onTypeChange]
  );

  // Step navigation — only allow going back to completed steps
  const handleStepClick = useCallback(
    (step: number) => {
      if (step <= currentStep) {
        setCurrentStep(step);
      }
    },
    [currentStep]
  );

  const handleBack = useCallback(() => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  }, [currentStep]);

  const handleNext = useCallback(() => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  }, [currentStep]);

  return (
    <div className={styles.app}>
      <StepIndicator
        currentStep={currentStep}
        onStepClick={handleStepClick}
        onBack={handleBack}
        onNext={handleNext}
        canGoNext={currentStep === 2 ? selectedSizeIndexes.length > 0 : true}
      />

      <div className={styles.contentPanel}>
        {/* Step 1: Select Podcast */}
        {currentStep === 1 && (
          <PodcastSearch
            searchQuery={searchQuery}
            searchResults={searchResults}
            isSearching={isSearching}
            selectedPodcast={currentPodcast}
            onSearchChange={handleSearchChange}
            onPodcastSelect={handleSelectPodcast}
          />
        )}

        {/* Step 2: Customize Design */}
        {currentStep === 2 && (
          <div className={styles.customizationWrapper}>
            <CustomizationPanel
              message={message}
              backgroundColor={backgroundColor}
              selectedSizeIndexes={selectedSizeIndexes}
              outputType={outputType}
              videoSupported={videoSupported}
              isLoading={isLoading}
              onMessageChange={onMessageChange}
              onColorChange={onColorChange}
              onSizeToggle={onSizeToggle}
              onTypeChange={handleTypeChange}
            />
            <Preview previewAsset={previewAsset} outputType={outputType} />
          </div>
        )}

        {/* Step 3: Generated Assets */}
        {currentStep === 3 && (
          <GeneratedAssets
            assets={finalAssets}
            onDownload={onDownload}
            onEdit={openEditor}
          />
        )}
      </div>

      {/* Editor Modal */}
      {editingAsset && (
        <EditorModal
          asset={editingAsset}
          config={config}
          onClose={closeEditor}
          onSave={saveAndClose}
        />
      )}
    </div>
  );
}

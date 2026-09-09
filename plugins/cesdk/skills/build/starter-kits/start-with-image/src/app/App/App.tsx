/**
 * Start With Image Editor - App Component
 *
 * Root component that manages image selection and CE.SDK editor initialization.
 * Uses key-based re-creation to switch between images.
 */

import { useEffect, useCallback, useState } from 'react';
import { CreativeEditor } from '@cesdk/cesdk-js/react';
import type CreativeEditorSDK from '@cesdk/cesdk-js';
import type { Configuration } from '@cesdk/cesdk-js';

import { initStartWithImageEditor } from '../../imgly';
import { IMAGE_CATALOG, type ImageAsset } from '../image-catalog';
import { ImageSelector } from '../ImageSelector/ImageSelector';

import classes from './App.module.css';

// START_HIDDEN_BLOCK
import {
  reportDemoPhase,
  reportDemoLoadingState
} from '../../../../shared/demo-preview/lifecycle';
// END_HIDDEN_BLOCK

interface AppProps {
  editorConfig: Configuration;
}

export function App({ editorConfig }: AppProps) {
  const [selectedImage, setSelectedImage] = useState<ImageAsset | null>(null);

  // START_HIDDEN_BLOCK
  // This demo mounts no editor until the visitor picks something, so
  // the selector being on screen is the end of its automatic load.
  useEffect(() => {
    reportDemoPhase('shell');
  }, []);
  // END_HIDDEN_BLOCK
  const [editorKey, setEditorKey] = useState(0);

  // highlight-handle-init
  const handleInit = useCallback(
    async (cesdk: CreativeEditorSDK) => {
      // START_HIDDEN_BLOCK
      reportDemoPhase('created');
      // END_HIDDEN_BLOCK
      // Debug access (remove in production)
      (window as unknown as { cesdk: CreativeEditorSDK }).cesdk = cesdk;

      // START_HIDDEN_BLOCK

      // Nothing is selected on arrival, so the editor mounting IS the

      // end of this demo's automatic load. A later selection re-runs

      // init, and the beacon reports each phase once.

      reportDemoPhase('shell');

      // END_HIDDEN_BLOCK

      if (selectedImage == null) return;

      // Initialize with the selected image (absolute URL required by engine)
      await initStartWithImageEditor(cesdk, selectedImage.full);
    },
    [selectedImage]
  );
  // highlight-handle-init

  // highlight-image-switching
  const handleSelectImage = useCallback((image: ImageAsset) => {
    // Update selected image and force re-render of editor
    setSelectedImage(image);
    setEditorKey((prev) => prev + 1);
  }, []);
  // highlight-image-switching

  return (
    <div className={classes.container}>
      <ImageSelector
        images={IMAGE_CATALOG}
        selectedImage={selectedImage}
        onSelect={handleSelectImage}
      />
      <div className={classes.editorWrapper}>
        {selectedImage != null && (
          <CreativeEditor
            key={editorKey}
            className={classes.editor}
            config={editorConfig}
            // START_HIDDEN_BLOCK
            onLoadingStateChange={reportDemoLoadingState}
            // END_HIDDEN_BLOCK
            init={handleInit}
          />
        )}
      </div>
    </div>
  );
}

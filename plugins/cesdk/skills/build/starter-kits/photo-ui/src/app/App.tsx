/**
 * CE.SDK Photo UI Starterkit - Main App Component
 *
 * A custom photo editing UI featuring:
 * - Crop, rotate, and flip tools
 * - Filters and adjustments
 * - Mobile-optimized interface
 * - Image replacement
 */

import { useState } from 'react';
import { CANVAS_COLOR, EditorProvider } from './contexts/EditorContext';
import ImageSelection from './ImageSelection/ImageSelection';
import PhotoUI from './PhotoUI/PhotoUI';
import UnsavedChangesModal from './UnsavedChangesModal/UnsavedChangesModal';

import classes from './App.module.css';

interface AppProps {
  engineConfig: {
    license?: string;
    baseURL?: string;
    featureFlags?: Record<string, string | boolean>;
  };
}

export default function App({ engineConfig }: AppProps) {
  const [confirmModalImage, setConfirmModalImage] = useState<
    string | undefined
  >();
  const { r, g, b } = CANVAS_COLOR;

  return (
    <EditorProvider engineConfig={engineConfig}>
      <div className={classes.fullHeightWrapper} id="scroll-container">
        <div className={classes.caseWrapper}>
          <div className={classes.headerBar}>
            <ImageSelection
              images={['woman', 'mountains', 'dog']}
              onShowModal={(imageUrl) => setConfirmModalImage(imageUrl)}
            />
          </div>
          <div className={classes.wrapper}>
            <div
              className={classes.kioskWrapper}
              style={{ backgroundColor: `rgb(${r},${g},${b})` }}
            >
              {confirmModalImage && (
                <UnsavedChangesModal
                  imageUrl={confirmModalImage}
                  onClose={() => setConfirmModalImage(undefined)}
                />
              )}
              <PhotoUI />
            </div>
          </div>
        </div>
      </div>
    </EditorProvider>
  );
}

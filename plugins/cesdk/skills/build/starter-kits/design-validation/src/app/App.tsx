/**
 * Design Validation Editor - App Component
 *
 * Root component that renders the CE.SDK editor and validation sidebar.
 * Uses the CreativeEditor React wrapper for lifecycle management.
 */

import { useCallback, useRef, useState } from 'react';
import CreativeEditorSDK, { type Configuration } from '@cesdk/cesdk-js';
import CreativeEditor from '@cesdk/cesdk-js/react';

import { initDesignValidationEditor } from '../imgly';
import { resolveAssetPath } from '../imgly/resolveAssetPath';
import { Sidebar } from './Sidebar/Sidebar';

import classes from './App.module.css';

interface AppProps {
  editorConfig: Configuration;
}

export function App({ editorConfig }: AppProps) {
  const [cesdk, setCesdk] = useState<CreativeEditorSDK | null>(null);
  const cesdkRef = useRef<CreativeEditorSDK | null>(null);

  const handleInit = useCallback(async (instance: CreativeEditorSDK) => {
    cesdkRef.current = instance;

    // Debug access (remove in production)
    (window as any).cesdk = instance;

    // Initialize editor with CE.SDK configuration
    await initDesignValidationEditor(instance);

    // Load the scene
    await instance.loadFromURL(resolveAssetPath('/assets/example.scene'));

    setCesdk(instance);
  }, []);

  const handleError = useCallback(
    (error: { message: string; cause?: unknown }) => {
      // eslint-disable-next-line no-console
      console.error('Failed to initialize CE.SDK:', error.message, error.cause);
    },
    []
  );

  return (
    <div className={classes.container}>
      <div className={classes.editorWrapper}>
        <CreativeEditor
          config={editorConfig}
          init={handleInit}
          onError={handleError}
          className={classes.editor}
        />
      </div>
      <Sidebar cesdk={cesdk} />
    </div>
  );
}

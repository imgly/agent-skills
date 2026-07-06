/**
 * Theming Editor Starterkit - Main App Component
 *
 * Provides layout with theme controls sidebar and editor.
 */

import { useCallback, useRef, useState } from 'react';
import CreativeEditorSDK, { type Configuration } from '@cesdk/cesdk-js';
import { CreativeEditor } from '@cesdk/cesdk-js/react';

import { initThemingEditor } from '../imgly';
import { resolveAssetPath } from '../imgly/resolveAssetPath';
import { ThemingSidebar } from './ThemingSidebar';

import styles from './App.module.css';

interface AppProps {
  editorConfig: Configuration;
}

export function App({ editorConfig }: AppProps) {
  const [cesdk, setCesdk] = useState<CreativeEditorSDK | null>(null);

  const handleEditorInit = useCallback(async (instance: CreativeEditorSDK) => {
    // Debug access (remove in production)
    (window as unknown as { cesdk: CreativeEditorSDK }).cesdk = instance;

    // Initialize the theming editor
    await initThemingEditor(instance);

    // ============================================================================
    // Scene Loading
    // ============================================================================

    await instance.loadFromURL(resolveAssetPath('/assets/example-1.scene'));

    setCesdk(instance);
  }, []);

  return (
    <div className={styles.appWrapper}>
      <div className={styles.editorWrapper}>
        <div className={styles.editorContainer}>
          <CreativeEditor config={editorConfig} init={handleEditorInit} />
        </div>
      </div>
      <ThemingSidebar cesdk={cesdk} />
    </div>
  );
}

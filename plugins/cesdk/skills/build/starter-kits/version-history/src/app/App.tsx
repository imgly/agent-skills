/**
 * CE.SDK Version History - Main App Component
 *
 * Uses the React wrapper for CE.SDK with state management for snapshots.
 * The onSave callback is passed to the editor to handle snapshot creation.
 */

import { useState, useRef, useCallback } from 'react';
import CreativeEditorSDK, { Configuration } from '@cesdk/cesdk-js';
import CreativeEditor from '@cesdk/cesdk-js/react';
import { HistoryPanel } from './HistoryPanel/HistoryPanel';
import { Snapshot } from './types';
import {
  initVersionHistoryEditor,
  loadSnapshot,
  createSnapshot,
  INITIAL_SNAPSHOTS,
  getInitialSceneUrl
} from '../imgly';
import './App.css';
import './HistoryPanel/HistoryPanel.css';

interface AppProps {
  editorConfig: Configuration;
}

export default function App({ editorConfig }: AppProps) {
  const [snapshots, setSnapshots] = useState<Snapshot[]>(INITIAL_SNAPSHOTS);
  const cesdkRef = useRef<CreativeEditorSDK | null>(null);
  // Use a ref to always get the latest snapshots in callbacks
  const snapshotsRef = useRef<Snapshot[]>(snapshots);
  snapshotsRef.current = snapshots;

  // Load snapshot handler
  const handleLoadSnapshot = useCallback(async (snapshot: Snapshot) => {
    const cesdk = cesdkRef.current;
    if (cesdk) {
      await loadSnapshot(cesdk, snapshot);
    }
  }, []);

  // highlight-onSave
  // Memoized init callback to prevent editor re-initialization on state changes
  // Uses refs for dynamic data (snapshotsRef) to avoid dependencies
  const handleInit = useCallback(async (cesdk: CreativeEditorSDK) => {
    // Store ref for snapshot loading
    cesdkRef.current = cesdk;

    // Debug access (remove in production)
    (window as unknown as { cesdk: CreativeEditorSDK }).cesdk = cesdk;

    // Initialize editor with SDK config (plugins, asset sources, theme)
    await initVersionHistoryEditor(cesdk);

    // ============================================================================
    // Scene Loading
    // ============================================================================

    // highlight-scene-loading
    // Load the first snapshot as the initial scene
    await cesdk.loadFromURL(getInitialSceneUrl());
    // highlight-scene-loading

    // Register save action (app-layer callback)
    cesdk.actions.register('saveScene', async () => {
      const sceneString = await cesdk.engine.scene.saveToString();
      // Create snapshot with thumbnail and scene URL
      const { thumbnailUrl, sceneUrl } = await createSnapshot(
        cesdk,
        sceneString
      );

      // Create the snapshot object
      const newSnapshot: Snapshot = {
        thumbnailUrl,
        sceneUrl,
        createdAt: new Date().toISOString(),
        userName: 'Anonymous'
      };

      // Add to snapshots (newest first)
      setSnapshots([newSnapshot, ...snapshotsRef.current]);
    });
  }, []);
  // highlight-onSave

  // Memoized error handler
  const handleError = useCallback((error: Error) => {
    // eslint-disable-next-line no-console
    console.error('Failed to initialize CE.SDK:', error);
  }, []);

  return (
    <div className="wrapper">
      <div className="cesdk-wrapper">
        <CreativeEditor
          config={editorConfig}
          init={handleInit}
          onError={handleError}
          width="100%"
          height="100%"
        />
      </div>
      <HistoryPanel snapshots={snapshots} onLoadSnapshot={handleLoadSnapshot} />
    </div>
  );
}

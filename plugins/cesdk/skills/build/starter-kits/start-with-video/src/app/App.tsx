/**
 * CE.SDK Start with Video - Main App Component
 *
 * Orchestrates video selection and editor initialization.
 */

import { useEffect, useCallback, useState } from 'react';
import CreativeEditor from '@cesdk/cesdk-js/react';
import type CreativeEditorSDK from '@cesdk/cesdk-js';
import type { Configuration } from '@cesdk/cesdk-js';

import { initStartWithVideoEditor } from '../imgly';
import { VIDEO_CATALOG, VideoAsset } from './video-catalog';
import VideoSelector from './VideoSelector/VideoSelector';
import styles from './App.module.css';

// START_HIDDEN_BLOCK
import {
  reportDemoPhase,
  reportDemoLoadingState
} from '../../../shared/demo-preview/lifecycle';
// END_HIDDEN_BLOCK

// ============================================================================
// Types
// ============================================================================

// highlight-props-type
interface AppProps {
  config: Configuration;
}
// highlight-props-type

// ============================================================================
// App Component
// ============================================================================

// highlight-app-component
export default function App({ config }: AppProps) {
  const [selectedVideo, setSelectedVideo] = useState<VideoAsset | null>(null);

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
      (window as any).cesdk = cesdk;

      // START_HIDDEN_BLOCK

      // Nothing is selected on arrival, so the editor mounting IS the

      // end of this demo's automatic load. A later selection re-runs

      // init, and the beacon reports each phase once.

      reportDemoPhase('shell');

      // END_HIDDEN_BLOCK

      if (selectedVideo == null) return;

      // Initialize with the selected video
      await initStartWithVideoEditor(cesdk, selectedVideo.full);
    },
    [selectedVideo]
  );
  // highlight-handle-init

  // highlight-video-switching
  const handleVideoSelect = useCallback((video: VideoAsset) => {
    // Update selected video and force re-render of editor
    setSelectedVideo(video);
    setEditorKey((prev) => prev + 1);
  }, []);
  // highlight-video-switching

  return (
    <div className={styles.app}>
      <VideoSelector
        videos={VIDEO_CATALOG}
        selectedVideo={selectedVideo}
        onSelect={handleVideoSelect}
      />
      <div className={styles.editorWrapper}>
        {selectedVideo != null && (
          <CreativeEditor
            key={editorKey}
            className={styles.editor}
            config={config}
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
// highlight-app-component

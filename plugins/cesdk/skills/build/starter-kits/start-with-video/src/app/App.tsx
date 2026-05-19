/**
 * CE.SDK Start with Video - Main App Component
 *
 * Orchestrates video selection and editor initialization.
 */

import { useCallback, useState } from 'react';
import CreativeEditor from '@cesdk/cesdk-js/react';
import type CreativeEditorSDK from '@cesdk/cesdk-js';
import type { Configuration } from '@cesdk/cesdk-js';

import { initStartWithVideoEditor } from '../imgly';
import { VIDEO_CATALOG, VideoAsset } from './video-catalog';
import VideoSelector from './VideoSelector/VideoSelector';
import styles from './App.module.css';

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
  const [editorKey, setEditorKey] = useState(0);

  // highlight-handle-init
  const handleInit = useCallback(
    async (cesdk: CreativeEditorSDK) => {
      // Debug access (remove in production)
      (window as any).cesdk = cesdk;

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
            init={handleInit}
          />
        )}
      </div>
    </div>
  );
}
// highlight-app-component

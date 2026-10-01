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


// ============================================================================
// Types
// ============================================================================

interface AppProps {
  config: Configuration;
}

// ============================================================================
// App Component
// ============================================================================

export default function App({ config }: AppProps) {
  const [selectedVideo, setSelectedVideo] = useState<VideoAsset | null>(null);

  const [editorKey, setEditorKey] = useState(0);

  const handleInit = useCallback(
    async (cesdk: CreativeEditorSDK) => {


      if (selectedVideo == null) return;

      // Initialize with the selected video
      await initStartWithVideoEditor(cesdk, selectedVideo.full);
    },
    [selectedVideo]
  );

  const handleVideoSelect = useCallback((video: VideoAsset) => {
    // Update selected video and force re-render of editor
    setSelectedVideo(video);
    setEditorKey((prev) => prev + 1);
  }, []);

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

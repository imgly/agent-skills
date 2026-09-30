/**
 * CE.SDK Start with Video - Video Selector Component
 *
 * A sidebar component that displays video thumbnails for selection.
 */

import classNames from 'classnames';

import type { VideoAsset } from '../video-catalog';

import styles from './VideoSelector.module.css';

// ============================================================================
// Types
// ============================================================================

interface VideoSelectorProps {
  /** List of available videos */
  videos: VideoAsset[];
  /** Currently selected video */
  selectedVideo: VideoAsset | null;
  /** Callback when a video is selected */
  onSelect: (video: VideoAsset) => void;
}

// ============================================================================
// Component
// ============================================================================

// highlight-video-selector
export default function VideoSelector({
  videos,
  selectedVideo,
  onSelect
}: VideoSelectorProps) {
  return (
    <aside className={styles.sidebar}>
      <h3 className={styles.title}>Select Video</h3>
      <div className={styles.videoList}>
        {videos.map((video, index) => (
          <button
            key={video.full}
            className={classNames(styles.videoButton, {
              [styles.selected]: selectedVideo === video
            })}
            data-index={index}
            title={video.alt}
            onClick={() => onSelect(video)}
          >
            <img
              className={styles.thumbnail}
              src={video.thumbUri}
              alt={video.alt}
            />
          </button>
        ))}
      </div>
    </aside>
  );
}
// highlight-video-selector

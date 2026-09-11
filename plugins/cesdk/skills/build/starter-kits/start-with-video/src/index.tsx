/**
 * CE.SDK Start with Video Starterkit - React Entry Point
 *
 * Demonstrates creating a video editor scene from a selected video file.
 * Users select a video thumbnail, then the editor initializes with that video.
 *
 * @see https://img.ly/docs/cesdk/js/getting-started/
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import type { Configuration } from '@cesdk/cesdk-js';

import App from './app/App';

// ============================================================================
// Editor Configuration
// ============================================================================

// highlight-config
/**
 * Static CE.SDK configuration.
 */
export const editorConfig: Configuration = {
  baseURL: import.meta.env.VITE_IMGLY_LOCAL_ASSETS_URL,
  userId: 'starterkit-start-with-video-user',

  // Local assets for development

  license: import.meta.env.VITE_CESDK_LICENSE
};
// highlight-config

// ============================================================================
// React App Bootstrap
// ============================================================================

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root container not found');
}

const root = createRoot(container);
root.render(
  <StrictMode>
    <App config={editorConfig} />
  </StrictMode>
);

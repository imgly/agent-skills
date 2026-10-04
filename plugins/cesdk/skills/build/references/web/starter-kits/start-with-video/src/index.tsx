/**
 * CE.SDK Start with Video Starterkit - React Entry Point
 *
 * Demonstrates creating a video editor scene from a selected video file.
 * Users select a video thumbnail, then the editor initializes with that video.
 *
 * @see https://img.ly/docs/cesdk/js/get-started/overview-e18f40/
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import type { Configuration } from '@cesdk/cesdk-js';

import App from './app/App';

// ============================================================================
// Editor Configuration
// ============================================================================

/**
 * Static CE.SDK configuration.
 */
export const editorConfig: Configuration = {
  userId: 'starterkit-start-with-video-user',

  // Local assets for development

};

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

/**
 * CE.SDK Placeholders Video Editor Starterkit - React Entry Point
 *
 * Demonstrates the CE.SDK placeholder feature for video template creation.
 * Placeholders allow template creators to define editable regions that
 * adopters can fill with their own content in a video editing context.
 *
 * @see https://img.ly/docs/cesdk/js/features/placeholders/
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import type { Configuration } from '@cesdk/cesdk-js';

import App from './app/App';
import { resolveAssetPath } from './resolveAssetPath';

// ============================================================================
// Editor Configuration
// ============================================================================

// highlight-config
/**
 * Static CE.SDK configuration.
 * Role-specific settings are applied in the init functions.
 */
export const editorConfig: Configuration = {
  baseURL: import.meta.env.VITE_IMGLY_LOCAL_ASSETS_URL,
  userId: 'starterkit-video-placeholders-user',

  // Local assets for development

  license: import.meta.env.VITE_CESDK_LICENSE
};
// highlight-config

// ============================================================================
// Scene URL
// ============================================================================

// highlight-scene-url
/**
 * Demo scene URL for the placeholders video editor.
 */
export const SCENE_URL = resolveAssetPath(
  '/cases/placeholders-video/example.scene'
);
// highlight-scene-url

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
    <App config={editorConfig} sceneUrl={SCENE_URL} />
  </StrictMode>
);

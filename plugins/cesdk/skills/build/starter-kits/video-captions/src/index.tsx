/**
 * CE.SDK Video Captions Starterkit - React Entry Point
 *
 * Demonstrates video captioning with multiple modes:
 * - AI Auto Captions: Generate captions with AI
 * - Blank: Start with empty editor
 * - Import: Import SRT caption files
 * - Pre-captioned: Edit existing captions
 *
 * @see https://img.ly/docs/cesdk/js/getting-started/
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import type { Configuration } from '@cesdk/cesdk-js';

import './app/global.css';
import { App } from './app/App';

export const editorConfig: Configuration = {
  baseURL: import.meta.env.VITE_IMGLY_LOCAL_ASSETS_URL,
  userId: 'starterkit-video-captions-user',

  featureFlags: {
    archiveSceneEnabled: true
  },

  // Local assets for development

  license: import.meta.env.VITE_CESDK_LICENSE
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App editorConfig={editorConfig} />
  </StrictMode>
);

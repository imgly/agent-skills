/**
 * CE.SDK Version History Starterkit - React Entry Point
 *
 * A design editor with version history (snapshot) functionality.
 * Allows users to save snapshots, view history, and load previous versions.
 *
 * @see https://img.ly/docs/cesdk/js/getting-started/
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Configuration } from '@cesdk/cesdk-js';
import App from './app/App';

export const editorConfig: Configuration = {
  baseURL: import.meta.env.VITE_IMGLY_LOCAL_ASSETS_URL,
  userId: 'starterkit-version-history-user',

  // Local assets for development

  // Role: Creator has full editing capabilities
  role: 'Creator',

  license: import.meta.env.VITE_CESDK_LICENSE
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App editorConfig={editorConfig} />
  </StrictMode>
);

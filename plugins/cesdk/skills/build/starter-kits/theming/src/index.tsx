/**
 * CE.SDK Theming Editor Starterkit - React Entry Point
 *
 * Demonstrates how to customize the CE.SDK editor appearance with themes.
 * Shows both built-in themes (light/dark) and custom theme configuration.
 *
 * @see https://img.ly/docs/cesdk/js/configuration-2c1c3d/
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import type { Configuration } from '@cesdk/cesdk-js';

import { App } from './app/App';

export const editorConfig: Configuration = {
  baseURL: import.meta.env.VITE_IMGLY_LOCAL_ASSETS_URL,
  userId: 'starterkit-theming-user',

  // Local assets for development
  

  license: import.meta.env.VITE_CESDK_LICENSE
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App editorConfig={editorConfig} />
  </StrictMode>
);

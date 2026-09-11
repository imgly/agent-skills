/**
 * CE.SDK Start With Image Editor Starterkit - React Entry Point
 *
 * A design editor that starts with an image, perfect for photo editing
 * workflows, social media editors, or image-based design tools.
 *
 * @see https://img.ly/docs/cesdk/js/getting-started/
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import type { Configuration } from '@cesdk/cesdk-js';

import { App } from './app/App/App';

export const editorConfig: Configuration = {
  baseURL: import.meta.env.VITE_IMGLY_LOCAL_ASSETS_URL,
  userId: 'starterkit-start-with-image-user',

  // Local assets for development

  license: import.meta.env.VITE_CESDK_LICENSE
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App editorConfig={editorConfig} />
  </StrictMode>
);

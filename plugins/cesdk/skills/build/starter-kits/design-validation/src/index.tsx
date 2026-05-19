/**
 * CE.SDK Design Validation Editor Starterkit - React Entry Point
 *
 * Demonstrates design validation checks using CE.SDK engine APIs.
 * Validates elements for issues like protruding from page, low resolution, etc.
 *
 * @see https://img.ly/docs/cesdk/js/getting-started/
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import type { Configuration } from '@cesdk/cesdk-js';

import { App } from './app/App';

export const editorConfig: Configuration = {
  baseURL: import.meta.env.VITE_IMGLY_LOCAL_ASSETS_URL,
  userId: 'starterkit-design-validation-user',

  // Local assets for development

  license: import.meta.env.VITE_CESDK_LICENSE
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App editorConfig={editorConfig} />
  </StrictMode>
);

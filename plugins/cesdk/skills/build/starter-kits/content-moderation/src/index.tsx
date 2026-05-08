/**
 * CE.SDK Content Moderation Editor Starterkit - React Entry Point
 *
 * Demonstrates content moderation by checking images for inappropriate content
 * using external moderation APIs.
 *
 * @see https://img.ly/docs/cesdk/js/getting-started/
 */

import type { Configuration } from '@cesdk/cesdk-js';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './app/App';

// highlight-license
const config: Configuration = {
  baseURL: import.meta.env.VITE_IMGLY_LOCAL_ASSETS_URL,
  userId: 'starterkit-content-moderation-user',

  // Local assets for development

  role: 'Creator',
  license: import.meta.env.VITE_CESDK_LICENSE
};
// highlight-license

const root = createRoot(document.getElementById('root')!);
root.render(
  <StrictMode>
    <App config={config} />
  </StrictMode>
);

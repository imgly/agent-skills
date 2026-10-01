/**
 * CE.SDK Content Moderation Editor Starterkit - React Entry Point
 *
 * Demonstrates content moderation by checking images for inappropriate content
 * using external moderation APIs.
 *
 * @see https://img.ly/docs/cesdk/js/get-started/overview-e18f40/
 */

import type { Configuration } from '@cesdk/cesdk-js';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './app/App';

const config: Configuration = {
  userId: 'starterkit-content-moderation-user',

  // Local assets for development

  role: 'Creator',
};

const root = createRoot(document.getElementById('root')!);
root.render(
  <StrictMode>
    <App config={config} />
  </StrictMode>
);

/**
 * CE.SDK Airtable Asset Source Starterkit - React Entry Point
 *
 * A design editor with Airtable integration for managing and browsing
 * images from your Airtable database directly within the editor.
 *
 * @see https://img.ly/docs/cesdk/js/getting-started/
 * @see https://airtable.com/developers/web/api
 */

import type { Configuration } from '@cesdk/cesdk-js';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './app/App';

// highlight-license
const config: Configuration = {
  baseURL: import.meta.env.VITE_IMGLY_LOCAL_ASSETS_URL,
  userId: 'starterkit-airtable-asset-source-user',

  // Local assets for development

  license: import.meta.env.VITE_CESDK_LICENSE
};
// highlight-license

const root = document.getElementById('root');
if (!root) {
  throw new Error('Root element not found');
}

createRoot(root).render(
  <StrictMode>
    <App config={config} />
  </StrictMode>
);

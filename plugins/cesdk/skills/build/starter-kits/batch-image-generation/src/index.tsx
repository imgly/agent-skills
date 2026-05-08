/**
 * CE.SDK Batch Image Generation Starterkit - React Entry Point
 *
 * Demonstrates batch rendering of personalized images from templates.
 * Uses @cesdk/engine for headless batch rendering and @cesdk/cesdk-js
 * for modal-based template and instance editing.
 *
 * @see https://img.ly/docs/cesdk/js/getting-started/
 */

import type { Configuration } from '@cesdk/cesdk-js';
import { createRoot } from 'react-dom/client';

import App from './app/App';

/**
 * Application configuration for CE.SDK.
 * Customize license and baseURL for production use.
 */
const config: Configuration = {
  baseURL: import.meta.env.VITE_IMGLY_LOCAL_ASSETS_URL,
  userId: 'starterkit-batch-image-generation-user',
  license: import.meta.env.VITE_CESDK_LICENSE,

  // Local assets for development
  
};

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root container not found');
}

const root = createRoot(container);
root.render(<App config={config} />);

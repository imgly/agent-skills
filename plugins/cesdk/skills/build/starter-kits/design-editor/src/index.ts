/**
 * CE.SDK Design Editor Starterkit - Main Entry Point
 *
 * A complete design editor for creating graphics, templates, and multi-page documents.
 *
 * @see https://img.ly/docs/cesdk/js/getting-started/
 */

import CreativeEditorSDK from '@cesdk/cesdk-js';

import { initDesignEditor } from './imgly';

// ============================================================================
// Configuration
// ============================================================================

// highlight-license
const config = {
  userId: 'starterkit-design-editor-user',

  // IMG.LY CDN (for quick testing only, NOT recommended for production)
  // baseURL: `https://cdn.img.ly/packages/imgly/cesdk-js/${CreativeEditorSDK.version}/assets`,

  // Local assets for development
  ...(import.meta.env.CESDK_USE_LOCAL && {
    baseURL: import.meta.env.VITE_CESDK_ASSETS_BASE_URL
  }),

  // license: 'YOUR_LICENSE_KEY',
};
// highlight-license

// ============================================================================
// Initialize Design Editor
// ============================================================================

CreativeEditorSDK.create('#cesdk_container', config)
  .then(async (cesdk) => {
    // Debug access (remove in production)
    (window as any).cesdk = cesdk;

    await initDesignEditor(cesdk);
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Failed to initialize CE.SDK:', error);
  });

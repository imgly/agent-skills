/**
 * CE.SDK Unsplash Editor Starterkit - Main Entry Point
 *
 * A design editor with Unsplash image integration for creating graphics,
 * templates, and multi-page documents with free high-quality images.
 *
 * @see https://img.ly/docs/cesdk/js/getting-started/
 * @see https://unsplash.com/documentation
 */

import CreativeEditorSDK from '@cesdk/cesdk-js';

import { initUnsplashEditor, UnsplashEditorOptions } from './imgly';
import { resolveAssetPath } from './imgly/resolveAssetPath';

// ============================================================================
// CE.SDK Configuration
// ============================================================================

// highlight-license
const config = {
  baseURL: import.meta.env.VITE_IMGLY_LOCAL_ASSETS_URL,
  userId: 'starterkit-unsplash-asset-source-user',

  // IMG.LY CDN (for quick testing only, NOT recommended for production)
  // baseURL: import.meta.env.VITE_IMGLY_LOCAL_ASSETS_URL,

  // Local assets for development

  license: import.meta.env.VITE_CESDK_LICENSE
};
// highlight-license

// ============================================================================
// Unsplash Editor Options
// ============================================================================

// highlight-unsplash-config
// Option 1: Read from environment variable (recommended for new projects)
// Set VITE_UNSPLASH_API_URL in your .env file
const editorOptions: UnsplashEditorOptions = {
  unsplashApiUrl: import.meta.env.VITE_UNSPLASH_API_URL
};

// Option 2: Direct configuration (for existing projects)
// Uncomment and modify the line below instead of using environment variables:
// const editorOptions: UnsplashEditorOptions = {
//   unsplashApiUrl: 'https://your-proxy.example.com/unsplash'
// };

// Option 3: Use demo proxy (development only, no configuration needed)
// const editorOptions: UnsplashEditorOptions = {};
// highlight-unsplash-config

// ============================================================================
// Initialize Unsplash Editor
// ============================================================================

CreativeEditorSDK.create('#cesdk_container', config)
  .then(async (cesdk) => {
    // Debug access (remove in production)
    (window as any).cesdk = cesdk;

    await initUnsplashEditor(cesdk, editorOptions);
    // ============================================================================
    // Scene Loading
    // ============================================================================

    // highlight-scene-loading
    // Load the Unsplash demo scene from CDN
    // This scene showcases images that can be replaced with photos from Unsplash
    await cesdk.loadFromURL(resolveAssetPath('/assets/unsplash.scene'));
    // highlight-scene-loading
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Failed to initialize CE.SDK:', error);
  });

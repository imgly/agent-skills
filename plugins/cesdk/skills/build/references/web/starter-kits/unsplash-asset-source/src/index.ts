/**
 * CE.SDK Unsplash Editor Starterkit - Main Entry Point
 *
 * A design editor with Unsplash image integration for creating graphics,
 * templates, and multi-page documents with free high-quality images.
 *
 * @see https://img.ly/docs/cesdk/js/get-started/overview-e18f40/
 * @see https://unsplash.com/documentation
 */

import CreativeEditorSDK from '@cesdk/cesdk-js';

import { initUnsplashEditor, UnsplashEditorOptions } from './imgly';
import { DEMO_ASSETS_BASE_URL } from './imgly/demo-assets';


// ============================================================================
// CE.SDK Configuration
// ============================================================================

const config = {
  userId: 'starterkit-unsplash-asset-source-user',

  // IMG.LY CDN (for quick testing only, NOT recommended for production)

  // Local assets for development

};

// ============================================================================
// Unsplash Editor Options
// ============================================================================

// Option 1: Read from environment variable (recommended for new projects)
// Set VITE_UNSPLASH_API_URL in your .env file
const editorOptions: UnsplashEditorOptions = {
  unsplashApiUrl: (undefined as string | undefined)
};

// Option 2: Direct configuration (for existing projects)
// Uncomment and modify the line below instead of using environment variables:
// const editorOptions: UnsplashEditorOptions = {
//   unsplashApiUrl: 'https://your-proxy.example.com/unsplash'
// };

// Option 3: Use demo proxy (development only, no configuration needed)
// const editorOptions: UnsplashEditorOptions = {};

// ============================================================================
// Initialize Unsplash Editor
// ============================================================================

CreativeEditorSDK.create('#cesdk_container', config)
  .then(async (cesdk) => {

    await initUnsplashEditor(cesdk, editorOptions);
    // ============================================================================
    // Scene Loading
    // ============================================================================

    // Load the Unsplash demo scene from CDN
    // This scene showcases images that can be replaced with photos from Unsplash
    await cesdk.load(`${DEMO_ASSETS_BASE_URL}/assets/unsplash.scene`);
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Failed to initialize CE.SDK:', error);
  });

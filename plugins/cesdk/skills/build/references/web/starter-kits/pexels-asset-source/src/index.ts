/**
 * CE.SDK Pexels Image Editor Starterkit - Main Entry Point
 *
 * A design editor with Pexels stock photos integrated as the primary image source.
 * Search and browse millions of free stock photos from Pexels directly within the editor.
 *
 * ## Configuration Approaches
 *
 * There are two ways to configure the Pexels API key:
 *
 * ### 1. Environment Variables (Recommended for new projects)
 * Create a `.env` file with:
 * ```
 * VITE_PEXELS_API_KEY=your-pexels-api-key
 * ```
 *
 * ### 2. Direct Parameters (For existing projects)
 * Pass the API key directly to the init function:
 * ```typescript
 * await initPexelsImageEditor(cesdk, {
 *   pexelsApiKey: 'your-pexels-api-key'
 * });
 * ```
 *
 * @see https://img.ly/docs/cesdk/js/get-started/overview-e18f40/
 * @see https://www.pexels.com/api/documentation/
 */

import CreativeEditorSDK from '@cesdk/cesdk-js';

import { initPexelsImageEditor } from './imgly';
import { DEMO_ASSETS_BASE_URL } from './imgly/demo-assets';


// ============================================================================
// Configuration
// ============================================================================

const config = {
  userId: 'starterkit-pexels-asset-source-user',

  // IMG.LY CDN (for quick testing only, NOT recommended for production)

  // Local assets for development

};

// ============================================================================
// Pexels Configuration
// ============================================================================

// Option 1: Read from environment variables (recommended for new projects with .env)
const pexelsConfig = {
  pexelsApiKey: (undefined as string | undefined) as string | undefined
};

// Option 2: Direct configuration (for existing projects or custom setups)
// Uncomment to use direct configuration instead of environment variables:
// const pexelsConfig = {
//   pexelsApiKey: 'your-pexels-api-key'
// };

// ============================================================================
// Initialize Pexels Image Editor
// ============================================================================

CreativeEditorSDK.create('#cesdk_container', config)
  .then(async (cesdk) => {

    // Initialize the editor with Pexels integration
    await initPexelsImageEditor(cesdk, pexelsConfig);
    // ============================================================================
    // Scene Loading
    // ============================================================================

    // Load the Pexels demo scene from CDN
    // This scene showcases images that can be replaced with photos from Pexels
    await cesdk.load(`${DEMO_ASSETS_BASE_URL}/assets/pexels.scene`);
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Failed to initialize CE.SDK:', error);
  });

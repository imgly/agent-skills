/**
 * CE.SDK Page Sizes Editor Starterkit - Main Entry Point
 *
 * A design editor with a custom dock button that opens the built-in
 * page resize panel, allowing users to change page dimensions.
 *
 * @see https://img.ly/docs/cesdk/js/get-started/overview-e18f40/
 */

import CreativeEditorSDK from '@cesdk/cesdk-js';

import { initPageSizesAssetSource } from './imgly';
import { DEMO_ASSETS_BASE_URL } from './imgly/demo-assets';


// ============================================================================
// Configuration
// ============================================================================

const config = {
  userId: 'starterkit-page-sizes-asset-source-user',

  // IMG.LY CDN (for quick testing only, NOT recommended for production)

  // Local assets for development

};

// ============================================================================
// Initialize Page Sizes Editor
// ============================================================================

CreativeEditorSDK.create('#cesdk_container', config)
  .then(async (cesdk) => {

    await initPageSizesAssetSource(cesdk);
    // ============================================================================
    // Scene Loading
    // ============================================================================

    // Load the page sizes scene with pre-designed content
    await cesdk.load(`${DEMO_ASSETS_BASE_URL}/assets/page-sizes.scene`);

    cesdk.ui.openPanel('//ly.img.panel/inspector/pageResize');
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Failed to initialize CE.SDK:', error);
  });

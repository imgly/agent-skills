/**
 * CE.SDK Print-Ready PDF Editor Starterkit - Main Entry Point
 *
 * A professional design editor with PDF/X-4 and PDF/X-3 export compliance, CMYK color profiles,
 * and bleed margin support for print-ready production.
 *
 * @see https://img.ly/docs/cesdk/js/get-started/overview-e18f40/
 */

import CreativeEditorSDK from '@cesdk/cesdk-js';

import { initPrintReadyPdfEditor } from './imgly';
import { DEMO_ASSETS_BASE_URL } from './imgly/demo-assets';


// ============================================================================
// Configuration
// ============================================================================

const config = {
  userId: 'starterkit-print-ready-pdf-editor-user',

  // IMG.LY CDN (for quick testing only, NOT recommended for production)

  // Local assets for development

};

// ============================================================================
// Initialize Design Editor
// ============================================================================

CreativeEditorSDK.create('#cesdk_container', config)
  .then(async (cesdk) => {

    await initPrintReadyPdfEditor(cesdk);

    // ============================================================================
    // Scene Loading
    // ============================================================================

    // Load the example scene for print-ready PDF export
    await cesdk.load(`${DEMO_ASSETS_BASE_URL}/assets/example-1.scene`);
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Failed to initialize CE.SDK:', error);
  });

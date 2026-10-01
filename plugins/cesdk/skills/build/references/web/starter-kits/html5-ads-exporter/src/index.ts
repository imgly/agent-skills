/**
 * CE.SDK HTML5 Exporter Starterkit - Main Entry Point
 *
 * A design editor with HTML5 export capabilities including embedded/external
 * format options, GSAP animation support, and ZIP download.
 *
 * @see https://img.ly/docs/cesdk/js/get-started/overview-e18f40/
 */

import CreativeEditorSDK from '@cesdk/cesdk-js';

import { initHtml5ExporterEditor } from './imgly';
import { DEMO_ASSETS_BASE_URL } from './imgly/demo-assets';


// ============================================================================
// Configuration
// ============================================================================

const config = {
  userId: 'starterkit-html5-ads-exporter-user',

  // IMG.LY CDN (for quick testing only, NOT recommended for production)

  // Local assets for development

};

// ============================================================================
// Initialize Editor
// ============================================================================

/**
 * Initialize the CE.SDK HTML5 Exporter Editor
 */
async function initializeEditor(): Promise<void> {
  try {
    // Create new CE.SDK instance
    const cesdk = await CreativeEditorSDK.create('#cesdk_container', config);


    // Initialize with HTML5 exporter configuration
    await initHtml5ExporterEditor(cesdk);

    // ============================================================================
    // Load Scene
    // ============================================================================

    // Load the HTML5 banner demo scene (an animated banner template)
    await cesdk.load(`${DEMO_ASSETS_BASE_URL}/assets/html5-banner.zip`);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to initialize CE.SDK:', error);
  }
}

// Start the editor
initializeEditor();

/**
 * CE.SDK HTML5 Exporter Starterkit - Main Entry Point
 *
 * A design editor with HTML5 export capabilities including embedded/external
 * format options, GSAP animation support, and ZIP download.
 *
 * @see https://img.ly/docs/cesdk/js/getting-started/
 */

import CreativeEditorSDK from '@cesdk/cesdk-js';

import { initHtml5ExporterEditor } from './imgly';
import { resolveAssetPath } from './imgly/resolveAssetPath';

// ============================================================================
// Configuration
// ============================================================================

// highlight-config
const config = {
  baseURL: import.meta.env.VITE_IMGLY_LOCAL_ASSETS_URL,
  userId: 'starterkit-html5-ads-exporter-user',

  // IMG.LY CDN (for quick testing only, NOT recommended for production)
  // baseURL: import.meta.env.VITE_IMGLY_LOCAL_ASSETS_URL,

  // Local assets for development

  license: import.meta.env.VITE_CESDK_LICENSE
};
// highlight-config

// ============================================================================
// Initialize Editor
// ============================================================================

/**
 * Initialize the CE.SDK HTML5 Exporter Editor
 */
// highlight-init
async function initializeEditor(): Promise<void> {
  try {
    // Create new CE.SDK instance
    const cesdk = await CreativeEditorSDK.create('#cesdk_container', config);

    // Debug access (remove in production)
    (window as any).cesdk = cesdk;

    // Initialize with HTML5 exporter configuration
    await initHtml5ExporterEditor(cesdk);

    // ============================================================================
    // Load Scene
    // ============================================================================

    // highlight-load-scene
    // Load the HTML5 banner demo scene (an animated banner template)
    await cesdk.loadFromArchiveURL(
      resolveAssetPath('/assets/html5-banner.zip')
    );
    // highlight-load-scene
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to initialize CE.SDK:', error);
  }
}

// Start the editor
initializeEditor();
// highlight-init

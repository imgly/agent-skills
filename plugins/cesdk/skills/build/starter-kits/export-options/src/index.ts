/**
 * CE.SDK Export Options Editor Starterkit - Main Entry Point
 *
 * A design editor with advanced export options including format selection
 * (JPEG, PNG, PDF), quality settings, resolution control, and page range
 * selection for multi-page documents.
 *
 * @see https://img.ly/docs/cesdk/js/getting-started/
 */

import CreativeEditorSDK from '@cesdk/cesdk-js';

import { initExportOptionsEditor } from './imgly';
import { resolveAssetPath } from './imgly/resolveAssetPath';

// ============================================================================
// Configuration
// ============================================================================

// highlight-config
const config = {
  baseURL: import.meta.env.VITE_IMGLY_LOCAL_ASSETS_URL,
  userId: 'starterkit-export-options-user',

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
 * Initialize the CE.SDK Export Options Editor
 */
// highlight-init
async function initializeEditor(): Promise<void> {
  try {
    // Create new CE.SDK instance
    const cesdk = await CreativeEditorSDK.create('#cesdk_container', config);

    // Debug access (remove in production)
    (window as any).cesdk = cesdk;

    // Initialize with export options configuration
    await initExportOptionsEditor(cesdk);

    // ============================================================================
    // Load Scene
    // ============================================================================

    // highlight-load-scene
    // Load the demo scene
    await cesdk.loadFromURL(resolveAssetPath('/assets/example-1.scene'));
    // highlight-load-scene
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to initialize CE.SDK:', error);
  }
}

// Start the editor
initializeEditor();
// highlight-init

/**
 * CE.SDK Viewer - Initialization Module
 *
 * This module provides the main entry point for initializing the viewer.
 * Import and call `initDesignViewer()` to configure a CE.SDK instance for viewing.
 *
 * @see https://img.ly/docs/cesdk/js/getting-started/
 */

import type CreativeEditorSDK from '@cesdk/cesdk-js';

// Configuration
import { ViewerConfig } from '@cesdk/core-configs-web/viewer-editor';

// Re-export for external use
export { ViewerConfig } from '@cesdk/core-configs-web/viewer-editor';

/**
 * Initialize the CE.SDK Viewer with a complete configuration.
 *
 * This function configures a CE.SDK instance with:
 * - Viewer UI configuration (read-only viewing mode)
 * - Navigation controls (pan, zoom)
 * - Page navigation for multi-page designs
 *
 * @param cesdk - The CreativeEditorSDK instance to configure
 */
export async function initDesignViewer(cesdk: CreativeEditorSDK) {
  // ============================================================================
  // Configuration Plugin
  // ============================================================================

  await cesdk.addPlugin(new ViewerConfig());

  // ============================================================================
  // Theme and Locale
  // ============================================================================

  // highlight-theme
  // cesdk.setTheme('dark');
  // cesdk.setLocale('en');
  // highlight-theme
}

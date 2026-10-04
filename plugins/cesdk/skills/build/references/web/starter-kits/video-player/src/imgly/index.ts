/**
 * CE.SDK Player - Initialization Module
 *
 * This module provides the main entry point for initializing the player.
 * Import and call `initVideoPlayer()` to configure a CE.SDK instance for playback.
 *
 * @see https://img.ly/docs/cesdk/js/get-started/overview-e18f40/
 */

import type CreativeEditorSDK from '@cesdk/cesdk-js';

// Configuration
import { PlayerConfig } from './config/plugin';

// Re-export for external use
export { PlayerConfig } from './config/plugin';

/**
 * Initialize the CE.SDK Player with a complete configuration.
 *
 * This function configures a CE.SDK instance with:
 * - Player UI configuration (read-only playback mode)
 * - Playback controls (play, pause, seek)
 * - Timeline scrubbing
 * - Zoom controls
 *
 * @param cesdk - The CreativeEditorSDK instance to configure
 */
export async function initVideoPlayer(cesdk: CreativeEditorSDK) {
  // ============================================================================
  // Configuration Plugin
  // ============================================================================

  await cesdk.addPlugin(new PlayerConfig());

  // ============================================================================
  // Theme and Locale
  // ============================================================================

  // cesdk.setTheme('dark');
  // cesdk.setLocale('en');
}

/**
 * Panel Configuration - Inspector Panel and Asset Library Panel
 *
 * Configure panel positioning (left/right) and floating state.
 * Panels can be docked to push the canvas or float over it.
 *
 * ## Panel IDs
 *
 * - `'//ly.img.panel/inspector'` - Inspector panel (block properties)
 * - `'//ly.img.panel/assets'` - Asset library panel
 * - `'//ly.img.panel/assetLibrary'` - Alternative asset library panel ID
 *
 * ## Panel Options
 *
 * - **Position**: `'left'` | `'right'`
 * - **Floating**: `true` (float over canvas) | `false` (push canvas)
 *
 * @see https://img.ly/docs/cesdk/js/user-interface/ui-extensions/create-custom-panel-d87b83/
 */

import type CreativeEditorSDK from '@cesdk/cesdk-js';

/**
 * Configure panel positioning and behavior.
 *
 * @param cesdk - The CreativeEditorSDK instance to configure
 */
export function setupPanels(cesdk: CreativeEditorSDK): void {
  // ============================================================================
  // VIEW CONFIGURATION
  // Set the default view mode
  // ============================================================================

  // #region View Configuration
  cesdk.ui.setView('default');
  // #endregion

  // ============================================================================
  // INSPECTOR PANEL
  // Configure the block properties panel
  // ============================================================================

  // #region Inspector Panel
  // Position: 'left' | 'right'
  cesdk.ui.setPanelPosition('//ly.img.panel/inspector', 'left');

  // Floating: true (float over canvas) | false (push canvas)
  cesdk.ui.setPanelFloating('//ly.img.panel/inspector', false);
  // #endregion

  // ============================================================================
  // ASSETS PANEL
  // Configure the asset library panel
  // ============================================================================

  // #region Assets Panel
  // Position: 'left' | 'right'
  cesdk.ui.setPanelPosition('//ly.img.panel/assets', 'left');

  // Floating: true (float over canvas) | false (push canvas)
  cesdk.ui.setPanelFloating('//ly.img.panel/assets', false);
  // #endregion

  // ============================================================================
  // SETTINGS PANEL
  // Configure the settings panel (for development/debugging)
  // ============================================================================

  // #region Settings Panel
  // Position: 'left' | 'right'
  cesdk.ui.setPanelPosition('//ly.img.panel/settings', 'right');

  // Floating: true (float over canvas) | false (push canvas)
  cesdk.ui.setPanelFloating('//ly.img.panel/settings', true);
  // #endregion
}

/**
 * Panel Configuration - Panel Positions and Behavior
 *
 * Configure panel positions and floating/docking behavior.
 *
 * ## Panel IDs
 *
 * - `'//ly.img.panel/inspector'` - Right-side property inspector
 * - `'//ly.img.panel/assets'` - Left-side asset library
 * - `'//ly.img.panel/settings'` - Settings panel
 *
 * ## Panel Positions
 *
 * - `'left'` - Dock to left side
 * - `'right'` - Dock to right side
 *
 * ## Floating Mode
 *
 * - `true` - Panel floats over canvas
 * - `false` - Panel docked to side
 *
 * @see https://img.ly/docs/cesdk/js/user-interface/customization/panel/
 */

import type CreativeEditorSDK from '@cesdk/cesdk-js';

/**
 * Configure panel positions and behavior.
 *
 * @param cesdk - The CreativeEditorSDK instance to configure
 */
export function setupPanels(cesdk: CreativeEditorSDK): void {
  // ============================================================================
  // PANEL POSITIONS
  // Configure where panels are docked
  // ============================================================================

  // #region Panel Positions
  // Inspector panel on the right
  cesdk.ui.setPanelPosition('//ly.img.panel/inspector', 'right');

  // Asset library panel on the left
  cesdk.ui.setPanelPosition('//ly.img.panel/assets', 'left');
  // #endregion

  // ============================================================================
  // PANEL FLOATING
  // Configure whether panels float or are docked
  // ============================================================================

  // #region Panel Floating
  // Panels are docked by default (not floating)
  cesdk.ui.setPanelFloating('//ly.img.panel/inspector', false);
  cesdk.ui.setPanelFloating('//ly.img.panel/assets', false);
  // #endregion
}

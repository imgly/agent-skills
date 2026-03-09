/**
 * Panel Configuration - Inspector Panel and Custom Panels
 *
 * Configure panel positioning (left/right) and floating state.
 * Register custom panels with the builder API.
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
  // PANEL POSITION & FLOATING
  // ============================================================================
  // Position: 'left' | 'right' (default: inspector=right, assetLibrary=left)
  // Floating: true (float over canvas) | false (push canvas, default)

  // cesdk.ui.setPanelPosition('//ly.img.panel/inspector', 'left');
  // cesdk.ui.setPanelPosition('//ly.img.panel/assetLibrary', 'right');
  // cesdk.ui.setPanelFloating('//ly.img.panel/inspector', true);
  // cesdk.ui.setPanelFloating('//ly.img.panel/assetLibrary', true);

  // Suppress unused variable warning (remove when uncommenting code above)
  void cesdk;
}

/**
 * Custom Components Configuration - Register Custom UI Components
 *
 * This file registers custom UI components for product editing,
 * including the area selector (Front/Back) for multi-area products.
 *
 * ## Component Registration
 *
 * Custom components are registered using `cesdk.ui.registerComponent()`.
 * Components receive a builder object for creating UI elements.
 *
 * ## Builder API
 *
 * - `builder.Button(id, options)` - Create a button
 * - `builder.ButtonGroup(id, options)` - Create a group of buttons
 * - `builder.Checkbox(id, options)` - Create a checkbox
 * - `builder.Dropdown(id, options)` - Create a dropdown
 * - `builder.Label(id, options)` - Create a text label
 * - `builder.Slider(id, options)` - Create a slider
 * - `builder.TextInput(id, options)` - Create a text input
 *
 * @see https://img.ly/docs/cesdk/js/user-interface/customization/register-new-component-b04a04/
 */

import type CreativeEditorSDK from '@cesdk/cesdk-js';

/**
 * Configure custom UI components.
 *
 * @param cesdk - The CreativeEditorSDK instance to configure
 */
export function setupComponents(cesdk: CreativeEditorSDK): void {
  // ============================================================================
  // CUSTOM COMPONENTS
  // Register additional custom components as needed.
  // Area selection is handled by the sidebar, not the canvas bar.
  // ============================================================================

  // #region Custom Components
  // Example: Register a custom export button
  //
  // cesdk.ui.registerComponent('custom-export-button', ({ builder }) => {
  //   builder.Button('export', {
  //     label: 'Export Design',
  //     onClick: async () => {
  //       await cesdk.actions.run('exportDesign', { mimeType: 'image/png' });
  //     }
  //   });
  // });
  // #endregion

  // Keep the function body to maintain the setupComponents API
  void cesdk;
}

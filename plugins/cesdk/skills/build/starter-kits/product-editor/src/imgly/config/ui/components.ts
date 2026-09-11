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

import type { ProductMetadata } from '../../types';

/**
 * Configure custom UI components.
 *
 * @param cesdk - The CreativeEditorSDK instance to configure
 */
export function setupComponents(cesdk: CreativeEditorSDK): void {
  // ============================================================================
  // AREA SELECTOR
  // Shows Front/Back buttons for scenes with multiple areas.
  // Reads area configuration from scene metadata.
  // ============================================================================

  // #region Area Selector
  cesdk.ui.registerComponent('product-area-select', ({ builder, engine }) => {
    // Read getCurrentPage FIRST to establish CE.SDK reactivity dependency.
    // This ensures the component re-renders when the page changes.
    const currentPage = engine.scene.getCurrentPage();

    // Get product from metadata (stored by App.tsx during scene setup)
    const scene = engine.scene.get();
    if (scene == null) return;
    if (!engine.block.hasMetadata(scene, 'product')) return;

    const product = JSON.parse(
      engine.block.getMetadata(scene, 'product')
    ) as ProductMetadata;

    // Only render for products with multiple areas
    if (product.areas.length <= 1) {
      return;
    }

    // Determine current area from page name
    const currentAreaId = currentPage
      ? engine.block.getName(currentPage)
      : product.areas[0].id;

    // Build the button group with Front/Back buttons
    builder.ButtonGroup('product-areas', {
      children: () => {
        product.areas
          .filter((area) => !area.disabled)
          .forEach((area) => {
            builder.Button(area.id, {
              label: area.label,
              isActive: currentAreaId === area.id,
              onClick: () => {
                // Switch to the selected area
                cesdk.actions
                  .run('product.switchArea', area.id)
                  .catch((err) => {
                    // eslint-disable-next-line no-console
                    console.error(
                      '[area-select] product.switchArea error:',
                      err
                    );
                  });
              }
            });
          });
      }
    });
  });
  // #endregion

  // ============================================================================
  // CUSTOM COMPONENTS
  // Register additional custom components as needed
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
}

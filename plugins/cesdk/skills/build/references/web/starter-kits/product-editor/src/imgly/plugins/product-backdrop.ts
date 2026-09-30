/**
 * Product Backdrop Plugin
 *
 * Exposes the product editor scene lifecycle as custom actions. The scene
 * building itself lives in `product-scene.ts`, which needs no editor and so
 * also runs in a headless engine; this plugin adds the editor-only verbs —
 * area navigation and framing.
 *
 * The plugin registers these custom actions:
 * - `product.setupScene(options)` — create/update pages and backdrops
 * - `product.switchArea(areaId)` — focus a specific area page
 * - `product.getVisibleAreaId()` — name of the currently visible area
 * - `product.applyVariables(variables, areas)` — substitute `{{key}}` tokens in backdrop image URIs
 *
 * Mockup image URIs may embed `{{key}}` tokens that are substituted at
 * setup and on demand via `product.applyVariables`. The kit decides which
 * variable names to use — the plugin only provides the substitution engine.
 *
 * ## Usage
 *
 * ```typescript
 * import { ProductBackdrop } from './plugins/product-backdrop';
 *
 * await cesdk.addPlugin(new ProductBackdrop());
 * await cesdk.actions.run('product.setupScene', {
 *   areas: [{ id: 'front', pageSize: { width: 10, height: 10 }, mockup: {...} }],
 *   designUnit: 'Inch',
 *   variables: { color: 'white' }
 * });
 * ```
 */

import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import CreativeEditorSDK from '@cesdk/cesdk-js';

import {
  applyBackdropVariables,
  setupScene,
  BACKDROP_BLOCK_KIND,
  type SetupSceneArea,
  type SetupSceneOptions
} from './product-scene';

/**
 * Product Backdrop plugin.
 *
 * Registers every product-editor verb as a custom action so callers can
 * orchestrate the scene through `cesdk.actions.run(...)` without importing
 * any implementation functions.
 *
 * @public
 */
export class ProductBackdrop implements EditorPlugin {
  name = 'cesdk-product-backdrop';

  version = CreativeEditorSDK.version;

  async initialize({ cesdk }: EditorPluginContext) {
    if (!cesdk) return;
    const engine = cesdk.engine;

    // Allow non-rectangular page shapes. Defaults to false in the engine.
    engine.editor.setSetting('page/allowShapeChange', true);

    // #region Setup Scene Action
    // Create or update pages and backdrops for the given areas. Hidden
    // backdrops are created behind each page. When an area defines a
    // `pageShape`, the page is clipped to that silhouette via the engine's
    // native vector-path shape.
    cesdk.actions.register('product.setupScene', (options: SetupSceneOptions) =>
      setupScene(engine, options)
    );
    // #endregion

    // #region Switch Area Action
    // Switch the editor view to a specific product area (page).
    // Deselects any current selection, switches to the area's page,
    // reveals its backdrop, and zooms to frame it.
    cesdk.actions.register('product.switchArea', async (areaId: string) => {
      engine.block
        .findAllSelected()
        .forEach((block) => engine.block.setSelected(block, false));

      const [pageBlock] = engine.block.findByName(areaId);
      if (pageBlock == null) return;
      await cesdk.unstable_switchPage(pageBlock);

      // Hide all backdrops, show only the target area's backdrop
      engine.block
        .findByKind(BACKDROP_BLOCK_KIND)
        .forEach((block) => engine.block.setVisible(block, false));

      const backdropBlock = engine.block.findByName(`Backdrop-${areaId}`)[0];
      if (backdropBlock != null) {
        engine.block.setVisible(backdropBlock, true);
        await cesdk.actions.run('zoom.toBlock', backdropBlock, {
          animate: false,
          autoFit: true
        });
      }
    });
    // #endregion

    // #region Get Visible Area ID Action
    // Return the ID (block name) of the currently visible area page,
    // or null if no page is currently focused.
    cesdk.actions.register('product.getVisibleAreaId', (): string | null => {
      const pageBlock = engine.scene.getCurrentPage();
      return pageBlock != null ? engine.block.getName(pageBlock) : null;
    });
    // #endregion

    // #region Apply Variables Action
    // Swap the backdrop images of every area by substituting `{{key}}` tokens
    // in each image URI with values from the given variables map.
    cesdk.actions.register(
      'product.applyVariables',
      (variables: Record<string, string>, areas: SetupSceneArea[]) =>
        applyBackdropVariables(engine, variables, areas)
    );
    // #endregion
  }
}

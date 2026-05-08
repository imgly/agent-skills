/**
 * Cutout Library Plugin
 *
 * Adds cutout line creation using @imgly/plugin-cutout-library-web.
 * Creates a dock entry for accessing the cutout library.
 *
 * ## Installation
 *
 * ```bash
 * npm install @imgly/plugin-cutout-library-web
 * ```
 *
 * ## Usage
 *
 * ```typescript
 * import { setupCutoutLibraryPlugin } from './plugins/cutout-library';
 *
 * // After cesdk initialization
 * await setupCutoutLibraryPlugin(cesdk);
 * ```
 *
 * @see https://img.ly/docs/cesdk/js/plugins/cutout-library/
 */

import type CreativeEditorSDK from '@cesdk/cesdk-js';
import CutoutLibraryPlugin from '@imgly/plugin-cutout-library-web';

/**
 * Sets up the cutout library plugin with canvas menu and dock entry.
 *
 * - Canvas menu: Adds "Create Cutout" option in the canvas context menu
 * - Dock: Adds Cutout Library button that opens the cutout panel
 *
 * The cutout creates die-cut lines around shapes for print-ready PDFs.
 *
 * @param cesdk - The CreativeEditorSDK instance
 */
export async function setupCutoutLibraryPlugin(
  cesdk: CreativeEditorSDK
): Promise<void> {
  // Add official cutout library plugin
  await cesdk.addPlugin(
    CutoutLibraryPlugin({
      ui: { locations: ['canvasMenu'] },
      createCutoutFromBlocks: (blockIds, engine) => {
        // Parameters: blockIds, offset (0), miterLimit (2), dashOverride (true)
        return engine.block.createCutoutFromBlocks(blockIds, 0, 2, true);
      }
    })
  );

  // Get the cutout asset entry for the dock icon
  const cutoutAssetEntry = cesdk.ui.getAssetLibraryEntry('ly.img.cutout.entry');

  // Add Cutout button to the dock at the beginning
  // This creates a "Cutout" panel with access to saved cutouts
  cesdk.ui.setComponentOrder({ in: 'ly.img.dock' }, [
    {
      id: 'ly.img.assetLibrary.dock',
      label: 'Cutout',
      key: 'ly.img.assetLibrary.dock',
      icon: cutoutAssetEntry?.icon,
      entries: ['ly.img.cutout.entry']
    },
    ...cesdk.ui
      .getComponentOrder({ in: 'ly.img.dock' })
      .filter(({ key }) => key !== 'ly.img.template')
  ]);
}

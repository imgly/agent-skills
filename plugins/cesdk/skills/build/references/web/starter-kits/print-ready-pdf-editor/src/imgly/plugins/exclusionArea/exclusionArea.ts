/**
 * Exclusion Area Asset Source Plugin
 *
 * Supplies the exclusion area assets this kit offers in its dock:
 * - A rectangular and a circular zone, placed on the current page
 *
 * @see https://img.ly/docs/cesdk/js/import-media/asset-panel/customize-c9a4de/
 */

import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import CreativeEditorSDK from '@cesdk/cesdk-js';

import { DEMO_ASSETS_BASE_URL } from '../../demo-assets';

import EXCLUSION_AREA_ASSETS from './exclusion-areas.json';

// ============================================================================
// Constants
// ============================================================================

const SOURCE_ID = 'ly.img.exclusionArea';

/**
 * Thumbnails are served from this kit's `public/assets` directory. The asset
 * JSON references them through `{{base_url}}`, which resolves against this path.
 */
const DEFAULT_BASE_URL = `${DEMO_ASSETS_BASE_URL}/assets`;

// ============================================================================
// Plugin
// ============================================================================

/**
 * Provides exclusion area assets for this starter kit.
 */
export class ExclusionAreaAssetSource implements EditorPlugin {
  name = 'exclusion-area-asset-source';

  version = CreativeEditorSDK.version;

  async initialize({ engine, cesdk }: EditorPluginContext) {
    if (engine.asset.findAllSources().includes(SOURCE_ID)) {
      return;
    }

    await engine.asset.addLocalAssetSourceFromJSONString(
      JSON.stringify(EXCLUSION_AREA_ASSETS),
      DEFAULT_BASE_URL
    );

    if (cesdk == null) return;

    // The zone controls sit behind this key. Enabling `ly.img.page` switches on
    // every page child, including this one.
    cesdk.feature.enable(['ly.img.page.printMarks.exclusionArea']);

    cesdk.ui.addAssetLibraryEntry({
      id: SOURCE_ID,
      sourceIds: [SOURCE_ID],
      previewLength: 3,
      gridColumns: 2,
      gridItemHeight: 'square',
      cardBackgroundPreferences: [{ path: 'meta.thumbUri', type: 'image' }]
    });

    cesdk.ui.insertOrderComponent(
      { in: 'ly.img.dock', before: 'ly.img.spacer.layers' },
      {
        id: 'ly.img.assetLibrary.dock',
        key: SOURCE_ID,
        icon: '@imgly/ForbiddenZone',
        label: 'libraries.ly.img.exclusionArea.label',
        entries: [SOURCE_ID]
      }
    );
  }
}

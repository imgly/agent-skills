/**
 * Player Editor Plugin - Playback-Only Configuration for CE.SDK
 *
 * This plugin provides a production-ready player configuration optimized for
 * video playback with minimal controls and no editing capabilities.
 *
 * @example Basic usage
 * ```typescript
 * import CreativeEditorSDK from '@cesdk/cesdk-js';
 * import { PlayerConfig } from './plugin';
 *
 * const cesdk = await CreativeEditorSDK.create('#player', config);
 * await cesdk.addPlugin(new PlayerConfig());
 * await cesdk.loadScene('path/to/scene.scene');
 * ```
 *
 * @see https://img.ly/docs/cesdk/js/user-interface/customization/disable-or-enable-f058e2/
 * @see https://img.ly/docs/cesdk/js/configuration-2c1c3d/
 */

import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import CreativeEditorSDK from '@cesdk/cesdk-js';

import { setupActions } from './actions';
import { setupFeatures } from './features';
import { setupTranslations } from './i18n';
import { setupSettings } from './settings';
import { setupUI } from './ui';

/**
 * Player configuration plugin.
 *
 * Provides a read-only playback experience optimized for viewing
 * video content with minimal playback controls. All editing capabilities
 * are disabled for a clean, distraction-free viewing experience.
 *
 * @public
 */
export class PlayerConfig implements EditorPlugin {
  /**
   * Unique identifier for this plugin.
   * Used to identify the plugin in the CE.SDK plugin registry.
   */
  name = 'cesdk-player';

  /**
   * Plugin version - matches the CE.SDK version for compatibility.
   */
  version = CreativeEditorSDK.version;

  /**
   * Initialize the player configuration.
   *
   * This method is called when the plugin is added to CE.SDK via addPlugin().
   * It sets up playback-only features and disables all editing capabilities.
   *
   * @param ctx - The editor plugin context containing cesdk and engine instances
   */
  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) return;

    // #region Editor Reset
    // Reset editor to clear any previous configuration
    // This ensures a clean slate when applying the player config
    cesdk.resetEditor();
    // #endregion

    // #region Feature Configuration
    // Configure which features are available (playback only)
    // See features.ts for all available feature options
    setupFeatures(cesdk);
    // #endregion

    // #region UI Configuration
    // Configure minimal UI layout for playback
    // See ui/ folder for UI configuration options
    setupUI(cesdk);
    // #endregion

    // #region Actions Configuration
    // Configure export, save, and share actions
    // See actions.ts for action configuration
    setupActions(cesdk);
    // #endregion

    // #region Translation Configuration
    // Set custom translations and labels for the UI
    // See i18n.ts for translation configuration
    setupTranslations(cesdk);
    // #endregion

    // #region Engine Settings
    // Configure engine settings (read-only mode, disable editing)
    // See settings.ts for all available settings
    setupSettings(cesdk);
    // #endregion

    // Re-applies deprecated configuration options (e.g. callbacks,
    // ui.elements.*, locale, i18n) that were cleared by resetEditor() above.
    // If you have already migrated to the respective API calls, you can
    // safely remove this line.
    cesdk.reapplyLegacyUserConfiguration();
  }
}

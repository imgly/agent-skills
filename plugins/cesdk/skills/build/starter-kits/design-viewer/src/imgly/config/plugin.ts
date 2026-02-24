/**
 * Viewer Editor Plugin - Read-Only Design Viewing Configuration for CE.SDK
 *
 * This plugin provides a production-ready viewer configuration optimized for
 * displaying designs without editing capabilities. Perfect for showcasing,
 * previewing, or sharing design content in a read-only mode.
 *
 * @example Basic usage
 * ```typescript
 * import CreativeEditorSDK from '@cesdk/cesdk-js';
 * import { ViewerConfig } from './plugin';
 *
 * const cesdk = await CreativeEditorSDK.create('#viewer', config);
 * await cesdk.addPlugin(new ViewerConfig());
 * await cesdk.actions.run('scene.create');
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
 * Viewer configuration plugin.
 *
 * Provides a complete read-only viewing experience optimized for displaying
 * designs, templates, and creative content without editing capabilities.
 *
 * @public
 */
export class ViewerConfig implements EditorPlugin {
  /**
   * Unique identifier for this plugin.
   * Used to identify the plugin in the CE.SDK plugin registry.
   */
  name = 'cesdk-viewer';

  /**
   * Plugin version - matches the CE.SDK version for compatibility.
   */
  version = CreativeEditorSDK.version;

  /**
   * Initialize the viewer configuration.
   *
   * This method is called when the plugin is added to CE.SDK via addPlugin().
   * It sets up minimal features, UI components, and settings for view-only mode.
   *
   * @param ctx - The editor plugin context containing cesdk and engine instances
   */
  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) return;

    // #region Editor Reset
    // Reset editor to clear any previous configuration
    // This ensures a clean slate when applying the viewer config
    cesdk.resetEditor();
    // #endregion

    // #region Feature Configuration
    // Configure minimal features for view-only mode
    // See features.ts for all disabled feature options
    setupFeatures(cesdk);
    // #endregion

    // #region UI Configuration
    // Configure minimal UI layout (navigation bar with zoom only)
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
    // Configure engine settings for read-only mode
    // See settings.ts for viewer-specific settings
    setupSettings(cesdk);
    // #endregion

    // Re-applies deprecated configuration options (e.g. callbacks,
    // ui.elements.*, locale, i18n) that were cleared by resetEditor() above.
    // If you have already migrated to the respective API calls, you can
    // safely remove this line.
    cesdk.reapplyLegacyUserConfiguration();
  }
}

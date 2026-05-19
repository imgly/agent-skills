/**
 * AI Apps Plugin - AI-Powered Generation Capabilities
 *
 * Sets up the AI Apps plugin with text, image, video, and audio generation
 * providers. Configures the dock order to show AI Apps at the top and adds
 * AI-generated content history to asset libraries.
 *
 * ## Installation
 *
 * ```bash
 * npm install @imgly/plugin-ai-apps-web
 * npm install @imgly/plugin-ai-image-generation-web
 * npm install @imgly/plugin-ai-text-generation-web
 * npm install @imgly/plugin-ai-video-generation-web
 * npm install @imgly/plugin-ai-audio-generation-web
 * ```
 *
 * ## Usage
 *
 * ```typescript
 * import { AiAppsConfig } from './plugins/ai-apps';
 * import { createAIProviders } from './plugins/ai-providers';
 *
 * const providers = createAIProviders('Design');
 * await cesdk.addPlugin(new AiAppsConfig(providers, 'Design'));
 * ```
 *
 * @see https://img.ly/docs/cesdk/js/plugins/ai-generation/
 */

import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import CreativeEditorSDK from '@cesdk/cesdk-js';
import AiApps from '@imgly/plugin-ai-apps-web';

import type { AiEditorMode, AiProviderMap } from './ai-providers';

/**
 * AI Apps configuration plugin.
 *
 * Provides AI-powered generation capabilities including text, image,
 * video, and audio generation.
 */
export class AiAppsConfig implements EditorPlugin {
  name = 'cesdk-ai-apps';

  version = CreativeEditorSDK.version;

  private providers: AiProviderMap;

  private mode: AiEditorMode;

  /**
   * @param providers - Provider map for `AiApps({ providers: … })`
   * @param mode - Editor mode; controls which asset libraries get AI history
   */
  constructor(providers: AiProviderMap, mode: AiEditorMode) {
    this.providers = providers;
    this.mode = mode;
  }

  async initialize({ cesdk }: EditorPluginContext) {
    if (!cesdk) return;

    // ========================================================================
    // Configure Dock with AI Apps at top
    // ========================================================================
    cesdk.ui.insertOrderComponent(
      { in: 'ly.img.dock', position: 'start' },
      {
        id: 'ly.img.ai/apps.dock'
      }
    );

    // ========================================================================
    // Configure Canvas Menu with AI Options
    // ========================================================================
    cesdk.ui.insertOrderComponent(
      {
        in: 'ly.img.canvas.menu',
        position: 'start',
        when: { editMode: 'Transform' }
      },
      [
        'ly.img.ai.text.canvasMenu',
        'ly.img.ai.image.canvasMenu',
        'ly.img.separator'
      ]
    );

    // ========================================================================
    // Add AI Apps Plugin
    // ========================================================================

    await cesdk.addPlugin(AiApps({ providers: this.providers }));

    // ========================================================================
    // Add AI Generation History to Asset Libraries
    // ========================================================================

    cesdk.ui.updateAssetLibraryEntry('ly.img.image', {
      sourceIds: ({ currentIds }) => [
        ...currentIds,
        'ly.img.ai.image-generation.history'
      ]
    });

    // Video mode: add video and audio AI history
    if (this.mode === 'Video') {
      cesdk.ui.updateAssetLibraryEntry('ly.img.video', {
        sourceIds: ({ currentIds }) => [
          ...currentIds,
          'ly.img.ai.video-generation.history'
        ]
      });

      cesdk.ui.updateAssetLibraryEntry('ly.img.audio', {
        sourceIds: ({ currentIds }) => [
          ...currentIds,
          'ly.img.ai.audio-generation.history'
        ]
      });
    }
  }
}

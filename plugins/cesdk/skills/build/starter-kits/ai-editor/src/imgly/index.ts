/**
 * CE.SDK AI Editor - Initialization Module
 *
 * Main entry point for wiring up the AI editor into a CE.SDK instance.
 * Supports Design, Photo, and Video editing modes.
 *
 * Before calling any of the init functions below, the hosting application
 * is expected to have registered the `ly.img.ai.getToken` action on the
 * CE.SDK instance — the gateway providers invoke it before every
 * generation request. See `createAIProviders` in `./plugins/ai-providers`
 * for the full rationale and the three common credential flows.
 *
 * @see https://img.ly/docs/cesdk/js/getting-started/
 * @see https://img.ly/docs/cesdk/js/plugins/ai-generation/
 * @see https://img.ly/docs/cesdk/js/user-interface/ai-integration/gateway-provider-06df22/
 */

import type CreativeEditorSDK from '@cesdk/cesdk-js';

import {
  BlurAssetSource,
  ColorPaletteAssetSource,
  CropPresetsAssetSource,
  DemoAssetSources,
  EffectsAssetSource,
  FiltersAssetSource,
  PagePresetsAssetSource,
  StickerAssetSource,
  TextAssetSource,
  TextComponentAssetSource,
  TypefaceAssetSource,
  UploadAssetSources,
  VectorShapeAssetSource
} from '@cesdk/cesdk-js/plugins';

import { AiAppsConfig } from './plugins/ai-apps';
import { AiPhotoEditConfig } from './plugins/ai-photo-edit';
import type { AiProviderMap } from './plugins/ai-providers';
import { DesignEditorConfig } from './config/design-editor/plugin';
import { PhotoEditorConfig } from './config/photo-editor/plugin';
import { VideoEditorConfig } from './config/video-editor/plugin';

// ============================================================================
// Plugins & Config Re-Exports
// ============================================================================

export { AiAppsConfig } from './plugins/ai-apps';
export { AiPhotoEditConfig } from './plugins/ai-photo-edit';
export {
  CURATED_MODELS,
  capabilitiesForMode,
  createAIProviders,
  instantiateGatewayProvider
} from './plugins/ai-providers';
export type {
  AiCapability,
  AiEditorMode,
  AiProviderMap,
  GatewayProviderOptions
} from './plugins/ai-providers';

export { DesignEditorConfig } from './config/design-editor/plugin';
export { PhotoEditorConfig } from './config/photo-editor/plugin';
export { VideoEditorConfig } from './config/video-editor/plugin';

// ============================================================================
// Design Editor Initialization
// ============================================================================

/**
 * Initialize the AI Design Editor.
 *
 * Sets up CE.SDK with the design editor configuration, standard asset
 * sources, and the AI Apps plugin wired to the given provider map. The
 * caller is responsible for loading scene content (e.g. via
 * `cesdk.loadFromArchiveURL(url)`) after this function resolves.
 *
 * @param cesdk     - The CreativeEditorSDK instance
 * @param providers - Provider map for `AiApps({ providers: … })`; use
 *                    `createAIProviders('Design')` for the curated defaults
 */
export async function initAiDesignEditor(
  cesdk: CreativeEditorSDK,
  providers: AiProviderMap
): Promise<void> {
  await cesdk.addPlugin(new DesignEditorConfig());
  cesdk.ui.setTheme('light');

  await Promise.all([
    cesdk.addPlugin(new ColorPaletteAssetSource()),
    cesdk.addPlugin(new TypefaceAssetSource()),
    cesdk.addPlugin(new TextAssetSource()),
    cesdk.addPlugin(new TextComponentAssetSource()),
    cesdk.addPlugin(new VectorShapeAssetSource()),
    cesdk.addPlugin(new StickerAssetSource()),
    cesdk.addPlugin(new EffectsAssetSource()),
    cesdk.addPlugin(new FiltersAssetSource()),
    cesdk.addPlugin(new BlurAssetSource()),
    cesdk.addPlugin(new PagePresetsAssetSource()),
    cesdk.addPlugin(new CropPresetsAssetSource())
  ]);
  await cesdk.addPlugin(
    new UploadAssetSources({
      include: ['ly.img.image.upload']
    })
  );
  await cesdk.addPlugin(
    new DemoAssetSources({
      include: ['ly.img.image.*']
    })
  );

  await cesdk.addPlugin(new AiAppsConfig(providers, 'Design'));
}

// ============================================================================
// Photo Editor Initialization
// ============================================================================

/**
 * Initialize the AI Photo Editor.
 *
 * Sets up CE.SDK with the photo editor configuration, standard asset
 * sources, and the AI Apps plugin wired to the given provider map. The
 * caller is responsible for creating a scene (e.g. via
 * `cesdk.createFromImage(url)`) after this function resolves.
 *
 * @param cesdk     - The CreativeEditorSDK instance
 * @param providers - Provider map for `AiApps({ providers: … })`; use
 *                    `createAIProviders('Photo')` for the curated defaults
 */
export async function initAiPhotoEditor(
  cesdk: CreativeEditorSDK,
  providers: AiProviderMap
): Promise<void> {
  await cesdk.addPlugin(new PhotoEditorConfig());
  cesdk.ui.setTheme('dark');

  await Promise.all([
    cesdk.addPlugin(new ColorPaletteAssetSource()),
    cesdk.addPlugin(new TypefaceAssetSource()),
    cesdk.addPlugin(new TextAssetSource()),
    cesdk.addPlugin(new TextComponentAssetSource()),
    cesdk.addPlugin(new VectorShapeAssetSource()),
    cesdk.addPlugin(new StickerAssetSource()),
    cesdk.addPlugin(new EffectsAssetSource()),
    cesdk.addPlugin(new FiltersAssetSource()),
    cesdk.addPlugin(new BlurAssetSource()),
    cesdk.addPlugin(new PagePresetsAssetSource()),
    cesdk.addPlugin(new CropPresetsAssetSource())
  ]);
  await cesdk.addPlugin(
    new UploadAssetSources({
      include: ['ly.img.image.upload']
    })
  );
  await cesdk.addPlugin(
    new DemoAssetSources({
      include: ['ly.img.image.*']
    })
  );

  await cesdk.addPlugin(new AiPhotoEditConfig(providers));
}

// ============================================================================
// Video Editor Initialization
// ============================================================================

/**
 * Initialize the AI Video Editor.
 *
 * Sets up CE.SDK with the video editor configuration, video/audio asset
 * sources, and the AI Apps plugin wired to the given provider map. The
 * caller is responsible for loading scene content (e.g. via
 * `cesdk.loadFromArchiveURL(url)`) after this function resolves.
 *
 * @param cesdk     - The CreativeEditorSDK instance
 * @param providers - Provider map for `AiApps({ providers: … })`; use
 *                    `createAIProviders('Video')` for the curated defaults
 */
export async function initAiVideoEditor(
  cesdk: CreativeEditorSDK,
  providers: AiProviderMap
): Promise<void> {
  await cesdk.addPlugin(new VideoEditorConfig());
  cesdk.ui.setTheme('light');

  await Promise.all([
    cesdk.addPlugin(new ColorPaletteAssetSource()),
    cesdk.addPlugin(new TypefaceAssetSource()),
    cesdk.addPlugin(new TextAssetSource()),
    cesdk.addPlugin(new TextComponentAssetSource()),
    cesdk.addPlugin(new VectorShapeAssetSource()),
    cesdk.addPlugin(new StickerAssetSource()),
    cesdk.addPlugin(new EffectsAssetSource()),
    cesdk.addPlugin(new FiltersAssetSource()),
    cesdk.addPlugin(new BlurAssetSource()),
    cesdk.addPlugin(new PagePresetsAssetSource()),
    cesdk.addPlugin(new CropPresetsAssetSource())
  ]);
  await cesdk.addPlugin(
    new UploadAssetSources({
      include: [
        'ly.img.image.upload',
        'ly.img.video.upload',
        'ly.img.audio.upload'
      ]
    })
  );
  await cesdk.addPlugin(
    new DemoAssetSources({
      include: [
        'ly.img.templates.video.*',
        'ly.img.image.*',
        'ly.img.video.*',
        'ly.img.audio.*'
      ]
    })
  );

  await cesdk.addPlugin(new AiAppsConfig(providers, 'Video'));
}

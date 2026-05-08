/**
 * CE.SDK Video Animations - Initialization Module
 *
 * This module provides a video editor focused on animations with:
 * - Custom scene templates
 * - Custom audio assets
 * - Animation panel auto-open
 * - Template switching via URL parameter
 *
 * @see https://img.ly/docs/cesdk/js/getting-started/
 */

import type CreativeEditorSDK from '@cesdk/cesdk-js';

import {
  BlurAssetSource,
  CaptionPresetsAssetSource,
  ColorPaletteAssetSource,
  CropPresetsAssetSource,
  DemoAssetSources,
  EffectsAssetSource,
  FiltersAssetSource,
  PagePresetsAssetSource,
  StickerAssetSource,
  TextComponentAssetSource,
  TypefaceAssetSource,
  TextAssetSource,
  VectorShapeAssetSource,
  UploadAssetSources
} from '@cesdk/cesdk-js/plugins';

import type { AssetDefinition, AssetResult } from '@cesdk/cesdk-js';

// Configuration and plugins
import { VideoEditorConfig } from './config/plugin';
import { resolveAssetPath } from './resolveAssetPath';

// Re-export for external use
export { VideoEditorConfig } from './config/plugin';

// ============================================================================
// Types
// ============================================================================

interface ContentJSON {
  version: string;
  id: string;
  assets: AssetDefinition[];
}

// ============================================================================
// Asset Definitions
// ============================================================================

// Remote CDN base URL for initial scene loading
const SCENES_CDN_URL = resolveAssetPath('/assets/templates');

// highlight-video-scene-assets
const VIDEO_SCENES_ASSETS: ContentJSON = {
  version: '1.0.0',
  id: 'ly.img.video.scene',
  assets: [
    {
      id: 'lunar-cosmetics',
      label: {
        en: 'Lunar Cosmetics · Landscape Example'
      },
      meta: {
        uri: '{{base_url}}/lunar-cosmetics.scene',
        thumbUri: '{{base_url}}/lunar-cosmetics.png',
        blockType: '//ly.img.ubq/scene'
      }
    },
    {
      id: 'surf-school',
      label: {
        en: 'Surf School · Portrait Example'
      },
      meta: {
        uri: '{{base_url}}/surf-school.scene',
        thumbUri: '{{base_url}}/surf-school.png',
        blockType: '//ly.img.ubq/scene'
      }
    }
  ]
};
// highlight-video-scene-assets

// highlight-audio-assets
const AUDIO_ASSETS: ContentJSON = {
  version: '1.0.0',
  id: 'ly.img.audio',
  assets: [
    {
      id: 'Cody_Martin_Lemon_Drop_instrumental_4_19',
      label: { en: 'Cody Martin Lemon Drop Instrumental' },
      meta: {
        uri: '{{base_url}}/Cody_Martin_Lemon_Drop_instrumental_4_19.mp3',
        thumbUri: '{{base_url}}/thumbnails/cody-martin.jpeg',
        blockType: '//ly.img.ubq/audio',
        mimeType: 'audio/mpeg',
        duration: '259'
      }
    },
    {
      id: 'Daniele_Musto_Hiphoppin_instrumental_2_08',
      label: { en: 'Daniele Musto Hiphoppin Instrumental' },
      meta: {
        uri: '{{base_url}}/Daniele_Musto_Hiphoppin_instrumental_2_08.mp3',
        thumbUri: '{{base_url}}/thumbnails/daniele-musto.jpeg',
        blockType: '//ly.img.ubq/audio',
        mimeType: 'audio/mpeg',
        duration: '128'
      }
    },
    {
      id: 'Daniele_Musto_Not_Scurred_background_vocals_2_37',
      label: { en: 'Daniele Musto Not Scurred Background Vocals' },
      meta: {
        uri: '{{base_url}}/Daniele_Musto_Not_Scurred_background_vocals_2_37.mp3',
        thumbUri: '{{base_url}}/thumbnails/daniele-musto.jpeg',
        blockType: '//ly.img.ubq/audio',
        mimeType: 'audio/mpeg',
        duration: '158'
      }
    },
    {
      id: 'PALA_Cabo_Cantina_background_vocals_3_25',
      label: { en: 'Pala Cabo Cantina Background Vocals' },
      meta: {
        uri: '{{base_url}}/PALA_Cabo_Cantina_background_vocals_3_25.mp3',
        thumbUri: '{{base_url}}/thumbnails/pala-cabo.png',
        blockType: '//ly.img.ubq/audio',
        mimeType: 'audio/mpeg',
        duration: '205'
      }
    },
    {
      id: 'Sam_Barsh_That_Corner_In_Harlem_instrumental_3_14',
      label: { en: 'Sam Barsh That Corner In Harlem Instrumental' },
      meta: {
        uri: '{{base_url}}/Sam_Barsh_That_Corner_In_Harlem_instrumental_3_14.mp3',
        thumbUri: '{{base_url}}/thumbnails/sam-barsh.png',
        blockType: '//ly.img.ubq/audio',
        mimeType: 'audio/mpeg',
        duration: '194'
      }
    },
    {
      id: 'TAYME_Then_Now_instrumental_3_28',
      label: { en: 'Tayme Then Now Instrumental' },
      meta: {
        uri: '{{base_url}}/TAYME_Then_Now_instrumental_3_28.mp3',
        thumbUri: '{{base_url}}/thumbnails/Tayme.png',
        blockType: '//ly.img.ubq/audio',
        mimeType: 'audio/mpeg',
        duration: '208'
      }
    },
    {
      id: 'Tiger_Gang_The_Goat_instrumental_2_56',
      label: { en: 'Tiger Gang The Goat Instrumental' },
      meta: {
        uri: '{{base_url}}/Tiger_Gang_The_Goat_instrumental_2_56.mp3',
        thumbUri: '{{base_url}}/thumbnails/tiger-gang.jpeg',
        blockType: '//ly.img.ubq/audio',
        mimeType: 'audio/mpeg',
        duration: '177'
      }
    }
  ]
};
// highlight-audio-assets

// ============================================================================
// URL Parameter Helpers
// ============================================================================

function persistSelectedTemplateToURL(templateName: string) {
  const url = new URL(window.location.href);
  url.searchParams.set('template', templateName);
  window.history.pushState({}, '', url);
}

// ============================================================================
// Animation Panel Helper
// ============================================================================

export async function openAnimationPanel(instance: CreativeEditorSDK) {
  const engine = instance.engine;
  for (const block of engine.block.findAll()) {
    // Get background clips
    if (engine.block.isAlwaysOnBottom(block)) {
      for (const child of engine.block.getChildren(block)) {
        // Select the first one that is visible
        if (engine.block.isVisibleAtCurrentPlaybackTime(child)) {
          engine.block.select(child);
          await new Promise((resolve) => setTimeout(resolve, 100));
          instance.ui.openPanel('//ly.img.panel/inspector/animation');
          break;
        }
      }
      break;
    }
  }
}

/**
 * Initialize the CE.SDK Video Animations Editor.
 *
 * This function configures a CE.SDK instance with:
 * - Video editor UI configuration
 * - Background removal plugin
 * - Custom scene templates
 * - Custom audio assets
 * - Animation panel auto-open
 *
 * @param cesdk - The CreativeEditorSDK instance to configure
 */
export async function initVideoAnimationsEditor(cesdk: CreativeEditorSDK) {
  const engine = cesdk.engine;

  // ============================================================================
  // Configuration Plugin
  // ============================================================================

  await cesdk.addPlugin(new VideoEditorConfig());

  // ============================================================================
  // Asset Source Plugins
  // ============================================================================

  await cesdk.addPlugin(new BlurAssetSource());
  await cesdk.addPlugin(new CaptionPresetsAssetSource());
  await cesdk.addPlugin(new ColorPaletteAssetSource());
  await cesdk.addPlugin(new CropPresetsAssetSource());
  await cesdk.addPlugin(
    new UploadAssetSources({
      include: [
        'ly.img.image.upload',
        'ly.img.video.upload',
        'ly.img.audio.upload'
      ]
    })
  );

  // Demo assets (without audio - we use custom audio)
  await cesdk.addPlugin(
    new DemoAssetSources({
      include: ['ly.img.templates.video.*', 'ly.img.image.*', 'ly.img.video.*']
    })
  );

  await cesdk.addPlugin(new EffectsAssetSource());
  await cesdk.addPlugin(new FiltersAssetSource());
  await cesdk.addPlugin(
    new PagePresetsAssetSource({
      include: [
        'ly.img.page.presets.instagram.*',
        'ly.img.page.presets.facebook.*',
        'ly.img.page.presets.x.*',
        'ly.img.page.presets.linkedin.*',
        'ly.img.page.presets.pinterest.*',
        'ly.img.page.presets.tiktok.*',
        'ly.img.page.presets.youtube.*',
        'ly.img.page.presets.video.*'
      ]
    })
  );
  await cesdk.addPlugin(new StickerAssetSource());
  await cesdk.addPlugin(new TextAssetSource());
  await cesdk.addPlugin(new TextComponentAssetSource());
  await cesdk.addPlugin(new TypefaceAssetSource());
  await cesdk.addPlugin(new VectorShapeAssetSource());

  // ============================================================================
  // Custom Asset Sources
  // ============================================================================

  // highlight-custom-assets
  // Load custom video scene templates from CDN with custom applyAsset callback
  engine.asset.addLocalSource(
    VIDEO_SCENES_ASSETS.id,
    undefined,
    async (asset: AssetResult) => {
      // Stop the current playing scene before loading a new one
      const page = engine.scene.getCurrentPage();
      if (page && engine.block.isPlaying(page)) {
        engine.block.setPlaying(page, false);
      }
      if (!asset.meta || !asset.meta.uri) {
        throw new Error('Asset does not have a uri');
      }
      await engine.scene.loadFromURL(asset.meta.uri as string);
      // Zoom auto-fit to page
      cesdk.actions.run('zoom.toPage', {
        autoFit: true
      });
      persistSelectedTemplateToURL(asset.id);
      return undefined;
    }
  );

  // Add video scene assets with base_url replacement
  for (const asset of VIDEO_SCENES_ASSETS.assets) {
    const processedAsset = structuredClone(asset);
    if (processedAsset.meta) {
      for (const [key, value] of Object.entries(processedAsset.meta)) {
        if (typeof value === 'string' && value.includes('{{base_url}}')) {
          (processedAsset.meta as Record<string, unknown>)[key] = value.replace(
            '{{base_url}}',
            SCENES_CDN_URL
          );
        }
      }
    }
    await engine.asset.addAssetToSource(VIDEO_SCENES_ASSETS.id, processedAsset);
  }

  // Load custom audio assets using built-in JSON loader
  await engine.asset.addLocalAssetSourceFromJSONString(
    JSON.stringify(AUDIO_ASSETS),
    resolveAssetPath('/assets/audio')
  );
  // highlight-custom-assets
}

/**
 * Podcast Generation - Product-Specific Configuration
 *
 * This module contains all podcast-specific types, constants, and helpers
 * for generating podcast promotional assets.
 */

import type CreativeEngine from '@cesdk/engine';
import type { RGBAColor } from '@cesdk/engine';

import type { GenerateAssetOptions, OutputType } from '../../imgly';

import { resolveAssetPath } from '../resolveAssetPath';

// ============================================================================
// Types
// ============================================================================

/**
 * Podcast data from iTunes Search API
 */
export interface Podcast {
  artistName: string;
  artworkUrl600: string;
  collectionId: number;
  collectionName: string;
  collectionViewUrl: string;
}

/**
 * Size preset for generated assets
 */
export interface Size {
  label: string;
  width: number;
  height: number;
}

// ============================================================================
// Constants
// ============================================================================

/**
 * Available size presets for podcast promotional assets
 */
export const SIZES: Size[] = [
  { label: 'Instagram Story', width: 1080, height: 1920 },
  { label: 'Instagram Post', width: 1080, height: 1080 },
  { label: 'Facebook / X Post', width: 1300, height: 740 }
];

/**
 * Preview size for the preview asset
 */
export const PREVIEW_SIZE = 800;

// ============================================================================
// Helpers
// ============================================================================

/**
 * Convert hex color to RGBA (0-1 range)
 */
function hexToRgba(hex: string): RGBAColor {
  let cleanHex = hex;
  if (cleanHex[0] === '#') cleanHex = cleanHex.substring(1);

  if (cleanHex.length < 6) {
    return {
      r: parseInt(cleanHex[0] + cleanHex[0], 16) / 255,
      g: parseInt(cleanHex[1] + cleanHex[1], 16) / 255,
      b: parseInt(cleanHex[2] + cleanHex[2], 16) / 255,
      a: 1
    };
  }

  return {
    r: parseInt(cleanHex.substring(0, 2), 16) / 255,
    g: parseInt(cleanHex.substring(2, 4), 16) / 255,
    b: parseInt(cleanHex.substring(4, 6), 16) / 255,
    a: 1
  };
}

/**
 * Determine theme (light/dark) based on background color luminance
 */
function getTheme(rgba: RGBAColor): 'light' | 'dark' {
  const { r, g, b } = rgba;
  const [R, G, B] = [r, g, b].map((i) =>
    i <= 0.04045 ? i / 12.92 : ((i + 0.055) / 1.055) ** 2.4
  );
  const luminance = 0.299 * R + 0.587 * G + 0.114 * B;
  return luminance > 0.38 ? 'light' : 'dark';
}

/**
 * Get the template URL for a given size and output type
 */
function getTemplateUrl(size: Size, outputType: OutputType): string {
  const templateType = outputType === 'image' ? 'static' : 'video';
  const sizePart = size.label
    .replace('/', '')
    .replace('  ', '-')
    .replace(' ', '-')
    .toLowerCase();
  return resolveAssetPath(`/${templateType}-${sizePart}-template.scene`);
}

/**
 * Get the preview template URL for a given output type
 */
function getPreviewTemplateUrl(outputType: OutputType): string {
  const templateType = outputType === 'image' ? 'static' : 'video';
  return resolveAssetPath(`/${templateType}-instagram-post-template.scene`);
}

/**
 * Create a fill callback for podcast templates
 */
function createFillCallback(
  podcast: Podcast | null,
  backgroundColor: string,
  message: string
): (engine: CreativeEngine, page: number) => void {
  return (engine, page) => {
    const rgba = hexToRgba(backgroundColor);
    const theme = getTheme(rgba);

    // Set background color
    engine.block.setColor(page, 'fill/solid/color', rgba);

    // Set podcast cover image
    if (podcast) {
      const coverBlocks = engine.block.findByName('PodcastCover');
      for (const block of coverBlocks) {
        const fill = engine.block.getFill(block);
        engine.block.setString(
          fill,
          'fill/image/imageFileURI',
          podcast.artworkUrl600
        );
      }
    }

    // Set badge image based on theme
    const [badgeBlock] = engine.block.findByName('PodcastBadge');
    if (badgeBlock) {
      const badgeUrl =
        theme === 'light'
          ? resolveAssetPath('/podcast-badge-black.png')
          : resolveAssetPath('/podcast-badge-white.png');
      engine.block.setString(
        engine.block.getFill(badgeBlock),
        'fill/image/imageFileURI',
        badgeUrl
      );
    }

    // Set text variables
    engine.variable.setString('Message', message || '');
    engine.variable.setString('PodcastName', podcast?.collectionName ?? '');

    // Set text colors based on theme
    const [textBlock] = engine.block.findByName('Message & Name');
    if (textBlock) {
      const rgb =
        theme === 'dark' ? { r: 1, g: 1, b: 1 } : { r: 0, g: 0, b: 0 };
      const messageLength = message.length;

      if (messageLength > 0) {
        engine.block.setTextColor(
          textBlock,
          { ...rgb, a: 0.75 },
          0,
          messageLength
        );
      }
      engine.block.setTextColor(textBlock, { ...rgb, a: 1.0 }, messageLength);
    }
  };
}

// ============================================================================
// Public API
// ============================================================================

/**
 * Create options for generating a podcast asset at a specific size
 */
export function createAssetOptions(
  sizeIndex: number,
  outputType: OutputType,
  podcast: Podcast | null,
  backgroundColor: string,
  message: string
): GenerateAssetOptions {
  const size = SIZES[sizeIndex];
  return {
    templateUrl: getTemplateUrl(size, outputType),
    fill: createFillCallback(podcast, backgroundColor, message),
    outputType,
    width: size.width,
    height: size.height,
    id: sizeIndex,
    label: size.label,
    saveSceneString: true
  };
}

/**
 * Create options for generating a podcast preview asset
 */
export function createPreviewOptions(
  outputType: OutputType,
  podcast: Podcast | null,
  backgroundColor: string,
  message: string
): GenerateAssetOptions {
  return {
    templateUrl: getPreviewTemplateUrl(outputType),
    fill: createFillCallback(podcast, backgroundColor, message),
    outputType,
    width: PREVIEW_SIZE,
    height: PREVIEW_SIZE,
    id: -1,
    label: 'Preview',
    zoomToPage: true,
    saveSceneString: false
  };
}

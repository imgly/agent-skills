/**
 * CE.SDK Multi-Image Generation - Generation Utilities
 *
 * Functions for generating branded images using CE.SDK engine.
 * Includes template filling, color application, and batch generation.
 */

import type CreativeEngine from '@cesdk/engine';

import type { Restaurant, Template, GeneratedAsset } from '../app/types';
import type { RgbaColor } from './types';
import { hexToRgba, replaceImageByName, exportSceneAsImage } from './utils';

/**
 * Scene catalog type - maps scene keys to scene strings.
 */
export type SceneCatalog = Record<string, string>;

// =============================================================================
// Public API
// =============================================================================

/**
 * Fill a template with restaurant-specific data.
 *
 * This function knows about:
 * - Restaurant data structure
 * - Specific block names in templates:
 *   - Images: RestaurantPhoto, RestaurantLogo
 *   - Ratings: Rating1-5
 * - Template variables: Name, $$, Count
 * - Color replacement logic (white→secondary, black→primary)
 *
 * @param engine - The CE.SDK engine instance
 * @param scenes - Scene catalog mapping scene keys to scene strings
 * @param sceneKey - Key identifying the scene template to use
 * @param restaurant - Restaurant data to fill into the template
 */
export async function fillTemplate(
  engine: CreativeEngine,
  scenes: SceneCatalog,
  sceneKey: string,
  restaurant: Restaurant
): Promise<void> {
  const sceneString = scenes[sceneKey];
  if (!sceneString) {
    throw new Error(`Scene not found: ${sceneKey}`);
  }
  await engine.scene.loadFromString(sceneString);

  // Replace restaurant images
  replaceImageByName(engine, 'RestaurantPhoto', restaurant.photoPath);
  replaceImageByName(engine, 'RestaurantLogo', restaurant.logoPath);

  // Apply restaurant data (variables and colors)
  await applyRestaurantColors(engine, restaurant);

  // Set rating stars visibility
  for (let i = 1; i <= 5; i++) {
    const ratingBlocks = engine.block.findByName(`Rating${i}`);
    for (const ratingBlock of ratingBlocks) {
      engine.block.setVisible(ratingBlock, i <= restaurant.rating);
    }
  }
}

/**
 * Apply restaurant colors to an already-loaded scene (for editing).
 */
export async function applyRestaurantColors(
  engine: CreativeEngine,
  restaurant: Restaurant
): Promise<void> {
  // Set variables only if they exist in the scene
  engine.variable.setString('Name', restaurant.name);
  engine.variable.setString('$$', restaurant.price);
  engine.variable.setString('Count', restaurant.reviewCount.toString());

  applyBrandColors(engine, restaurant.primaryColor, restaurant.secondaryColor);
}

/**
 * Apply brand colors to all blocks in the scene.
 * White colors become secondary, black colors become primary.
 */
function applyBrandColors(
  engine: CreativeEngine,
  primaryHex: string,
  secondaryHex: string
): void {
  const primaryColor = hexToRgba(primaryHex);
  const secondaryColor = hexToRgba(secondaryHex);

  const allBlocks = engine.block.findAll();
  for (const block of allBlocks) {
    const blockType = engine.block.getType(block);

    if (blockType === '//ly.img.ubq/text') {
      applyTextColor(engine, block, primaryColor, secondaryColor);
    } else if (engine.block.supportsFill(block)) {
      applyFillColor(engine, block, primaryColor, secondaryColor);
    }
  }
}

function applyTextColor(
  engine: CreativeEngine,
  block: number,
  primaryColor: RgbaColor,
  secondaryColor: RgbaColor
): void {
  const textColors = engine.block.getTextColors(block);
  if (textColors.length === 0) return;

  const preColor = textColors[0] as { r: number; g: number; b: number };
  if (preColor.r === 1 && preColor.g === 1 && preColor.b === 1) {
    engine.block.setTextColor(block, secondaryColor);
  } else if (preColor.r === 0 && preColor.g === 0 && preColor.b === 0) {
    engine.block.setTextColor(block, primaryColor);
  }
}

function applyFillColor(
  engine: CreativeEngine,
  block: number,
  primaryColor: RgbaColor,
  secondaryColor: RgbaColor
): void {
  const fillBlock = engine.block.getFill(block);
  if (engine.block.getType(fillBlock) !== '//ly.img.ubq/fill/color') return;

  // Color fills always have the fill/color/value property
  const preColor = engine.block.getColor(fillBlock, 'fill/color/value') as {
    r: number;
    g: number;
    b: number;
  };
  if (preColor.r === 1 && preColor.g === 1 && preColor.b === 1) {
    engine.block.setColor(fillBlock, 'fill/color/value', secondaryColor);
  } else if (preColor.r === 0 && preColor.g === 0 && preColor.b === 0) {
    engine.block.setColor(fillBlock, 'fill/color/value', primaryColor);
  }
}

/**
 * Generate assets for all templates using restaurant data.
 *
 * @param engine - The CE.SDK engine instance
 * @param scenes - Scene catalog mapping scene keys to scene strings
 * @param templates - Array of template configurations to generate
 * @param restaurant - Restaurant data to fill into templates
 * @param onAssetUpdate - Callback invoked when each asset is generated
 */
export async function generateAssets(
  engine: CreativeEngine,
  scenes: SceneCatalog,
  templates: Template[],
  restaurant: Restaurant,
  onAssetUpdate: (index: number, asset: GeneratedAsset) => void
): Promise<void> {
  for (let index = 0; index < templates.length; index++) {
    const template = templates[index];

    try {
      await fillTemplate(engine, scenes, template.sceneKey, restaurant);

      const src = await exportSceneAsImage(engine, 'image/jpeg');
      const sceneString = await engine.scene.saveToString();

      onAssetUpdate(index, {
        isLoading: false,
        src,
        sceneString,
        label: template.label
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`Failed to generate ${template.label} template:`, error);
      onAssetUpdate(index, {
        isLoading: false,
        src: null,
        sceneString: null,
        label: template.label
      });
    }
  }
}

/**
 * Load a scene from string and export as image.
 */
export async function renderSceneToImage(
  engine: CreativeEngine,
  sceneString: string,
  mimeType: 'image/png' | 'image/jpeg' = 'image/jpeg'
): Promise<string | null> {
  try {
    await engine.scene.loadFromString(sceneString);
    return exportSceneAsImage(engine, mimeType);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to render scene:', error);
    return null;
  }
}

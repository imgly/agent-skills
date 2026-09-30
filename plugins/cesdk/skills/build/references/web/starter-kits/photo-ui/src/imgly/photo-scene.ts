/**
 * Photo Scene
 *
 * Builds the one-page scene this kit edits: the page carries the photo as its
 * image fill, and the page is sized to the photo.
 */

import type CreativeEngine from '@cesdk/engine';

import { getImageSize } from './engine-utils';
import { DEMO_ASSETS_BASE_URL } from './demo-assets';
export { DEMO_ASSETS_BASE_URL };

export const INITIAL_PORTRAIT_IMAGE_PATH = `${DEMO_ASSETS_BASE_URL}/images/mountains.jpg`;
export const INITIAL_LANDSCAPE_IMAGE_PATH = `${DEMO_ASSETS_BASE_URL}/images/woman.jpg`;

export interface ImageSize {
  width: number;
  height: number;
}

/**
 * For demonstration purposes we initially use either a portrait or a landscape
 * image, picked from the viewport the editor opens in.
 */
export function pickInitialImagePath(
  viewportWidth: number,
  viewportHeight: number
): string {
  return viewportWidth / viewportHeight > 1
    ? INITIAL_PORTRAIT_IMAGE_PATH
    : INITIAL_LANDSCAPE_IMAGE_PATH;
}

/**
 * Set up a photo editing scene with a single page containing an image fill.
 *
 * @param size - The photo's pixel size. Measured from the image when omitted.
 */
export async function setupPhotoScene(
  engine: CreativeEngine,
  src: string,
  size?: ImageSize
): Promise<void> {
  engine.editor.setSetting('page/dimOutOfPageAreas', false);
  engine.editor.setSetting('highlightColor', { r: 1, g: 1, b: 1, a: 1 });
  engine.editor.setSetting('cropOverlayColor', { r: 1, g: 1, b: 1, a: 0.55 });
  engine.editor.setGlobalScope('design/arrange' as any, 'Allow');

  // We recreate the scene to discard all changes
  const existingScene = engine.scene.get();
  if (existingScene) await engine.block.destroy(existingScene);

  const scene = await engine.scene.create();
  engine.block.setEnum(scene, 'scene/designUnit', 'Pixel');

  const page = await engine.block.create('page');
  engine.block.setVisible(page, false);
  engine.block.setBool(page, 'page/marginEnabled', false);

  const fill = await engine.block.createFill('image');
  await engine.block.appendChild(scene, page);
  await engine.block.setFill(page, fill);

  await setImageSource(engine, page, src, size);
  await engine.block.setClipped(page, false);
}

/**
 * Set the image source on a page block and resize the page to the photo.
 *
 * @param size - The photo's pixel size. Measured from the image when omitted.
 */
export async function setImageSource(
  engine: CreativeEngine,
  pageBlock: number,
  imageSrc: string,
  size?: ImageSize
): Promise<void> {
  engine.editor.setGlobalScope('design/arrange' as any, 'Allow');
  const imageFill = engine.block.getFill(pageBlock);
  const { height, width } = size ?? (await getImageSize(imageSrc));
  engine.block.setWidth(pageBlock, width);
  engine.block.setHeight(pageBlock, height);
  await engine.block.setString(imageFill, 'fill/image/imageFileURI', imageSrc);
  engine.block.resetCrop(pageBlock);
  engine.editor.setGlobalScope('design/arrange' as any, 'Deny');
  engine.editor.setSetting('doubleClickToCropEnabled', false);
}

/**
 * CE.SDK Operations and Utilities
 *
 * This module provides engine utilities and operations.
 * It's self-contained and doesn't depend on React or app-level code.
 */

import type CreativeEngine from '@cesdk/engine';

import { setupPhotoScene, type ImageSize } from './photo-scene';

export * from './crop-math';
export * from './engine-utils';
export * from './photo-scene';
export * from './upload';

/**
 * Configure an engine for photo editing and load the first photo into it.
 *
 * @param engine - A `CreativeEngine` created with `CreativeEngine.init()`
 * @param imageSrc - URL of the photo to edit
 * @param size - The photo's pixel size. Measured from the image when omitted.
 */
export async function initPhotoEditor(
  engine: CreativeEngine,
  imageSrc: string,
  size?: ImageSize
): Promise<void> {
  engine.editor.setSetting('mouse/enableScroll', false);
  engine.editor.setSetting('mouse/enableZoom', false);
  engine.editor.setSetting('page/title/show', false);

  await setupPhotoScene(engine, imageSrc, size);
}

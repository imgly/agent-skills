/**
 * CE.SDK Integration Layer
 *
 * Public API exports for all engine utilities and helpers.
 */

import type CreativeEngine from '@cesdk/engine';

export * from './color-utilities';
export * from './creative-engine-utils';
export * from './upload';
export * from './utils';

/** Mime types the upload source accepts. */
export const UPLOAD_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/svg+xml',
  'image/bmp',
  'image/gif',
  'image/apng'
];

/**
 * Register the asset sources this editor offers and load its scene.
 *
 * The sources are parsed from `${engine.getBaseURL()}<sourceId>/content.json`,
 * so they need no server of their own.
 *
 * @param engine - A `CreativeEngine` created with `CreativeEngine.init()`
 * @param sceneURL - Absolute URL of the scene to open
 */
export async function initMobileEditor(
  engine: CreativeEngine,
  sceneURL: string
): Promise<void> {
  engine.editor.setSetting('mouse/enableScroll', false);
  engine.editor.setSetting('mouse/enableZoom', false);
  engine.editor.setSetting('page/title/show', false);

  const baseURL = engine.getBaseURL();

  // Typefaces
  await engine.asset.addLocalAssetSourceFromJSONURI(
    `${baseURL}ly.img.typeface/content.json`
  );
  // Filled vector shapes only
  await engine.asset.addLocalAssetSourceFromJSONURI(
    `${baseURL}ly.img.vector.shape/content.json`,
    { matcher: ['ly.img.vector.shape.filled.*'] }
  );
  // Stickers
  await engine.asset.addLocalAssetSourceFromJSONURI(
    `${baseURL}ly.img.sticker/content.json`
  );
  // Local source for user image uploads
  engine.asset.addLocalSource('ly.img.image.upload', UPLOAD_MIME_TYPES);
  // Demo images
  await engine.asset.addLocalAssetSourceFromJSONURI(
    `${baseURL}ly.img.image/content.json`,
    { matcher: ['ly.img.image.*'] }
  );

  await engine.scene.load(sceneURL);
}

/**
 * CE.SDK Operations - Public API
 *
 * This module exports all CE.SDK-specific operations and utilities.
 * It provides a clean interface for the application layer to interact
 * with the Creative Engine.
 */

import type CreativeEngine from '@cesdk/engine';

import createImageColorsSource from './image-colors-source';
import createUnsplashSource from './unsplash-source';

export { hexToRgba, rgbaToHex, isColorEqual } from './color-utilities';
export {
  zoomToSelectedText,
  pixelToCanvasUnit,
  autoPlaceBlockOnPage,
  getImageSize
} from './creative-engine-utils';
export { default as createUnsplashSource } from './unsplash-source';
export {
  default as createImageColorsSource,
  IMAGE_COLORS_SOURCE_ID
} from './image-colors-source';

const UPLOAD_MIME_TYPES = {
  image: [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/svg+xml',
    'image/bmp',
    'image/gif',
    'image/apng'
  ],
  video: [
    'application/json',
    'video/mp4',
    'video/quicktime',
    'video/webm',
    'video/matroska',
    'image/gif',
    'image/apng'
  ],
  audio: ['audio/mpeg', 'audio/mp3', 'audio/x-m4a', 'audio/wav']
};

/**
 * Initialize the CE.SDK Apparel Editor.
 *
 * @param engine - The CreativeEngine instance to configure
 */
export async function initApparelEditor(engine: CreativeEngine): Promise<void> {
  engine.editor.setSetting('page/title/show', false);

  // `getBaseURL()` returns the configured assets base, already trailing-slash
  // normalized.
  const baseURL = engine.getBaseURL();
  const addContentSource = (sourceId: string, matcher?: string[]) =>
    engine.asset.addLocalAssetSourceFromJSONURI(
      `${baseURL}${sourceId}/content.json`,
      matcher ? { matcher } : undefined
    );

  // Dominant colors extracted from the scene's image blocks.
  engine.asset.addSource(createImageColorsSource(engine));

  // Content sources loaded from their bundled `content.json`.
  await addContentSource('ly.img.color.palette');
  await addContentSource('ly.img.sticker');
  await addContentSource('ly.img.typeface');
  // Text style presets live in three engine-side sources.
  await addContentSource('ly.img.text');
  await addContentSource('ly.img.text.styles');
  await addContentSource('ly.img.text.curves');
  await addContentSource('ly.img.text.components');
  await addContentSource('ly.img.vector.shape', [
    'ly.img.vector.shape.filled.*'
  ]);
  await addContentSource('ly.img.templates', ['ly.img.templates.*']);

  // Local upload sources (empty until the user uploads).
  engine.asset.addLocalSource('ly.img.image.upload', UPLOAD_MIME_TYPES.image);
  engine.asset.addLocalSource('ly.img.video.upload', UPLOAD_MIME_TYPES.video);
  engine.asset.addLocalSource('ly.img.audio.upload', UPLOAD_MIME_TYPES.audio);

  engine.editor.setGlobalScope('lifecycle/destroy', 'Defer');

  engine.asset.addSource(createUnsplashSource(engine));

  // Only emoticon stickers are offered in this kit.
  const stickers = await engine.asset.findAssets('ly.img.sticker', {
    page: 0,
    perPage: 9999
  });
  stickers.assets.forEach((sticker) => {
    if (sticker.groups?.[0] !== 'emoticons') {
      engine.asset.removeAssetFromSource('ly.img.sticker', sticker.id);
    }
  });
}

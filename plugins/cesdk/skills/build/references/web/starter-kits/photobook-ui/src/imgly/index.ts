/**
 * CE.SDK Photobook Operations
 * Public API for photobook functionality
 */

import type CreativeEngine from '@cesdk/engine';

import { createApplyLayoutAsset } from './apply-layout';
import { createImageColorsSource } from './image-colors-source';
import loadAssetSourceFromContentJSON from './loadAssetSourceFromContentJSON';
import { PHOTOBOOK_LAYOUTS } from './photobook-layouts';
import { PHOTOBOOK_STICKERS } from './photobook-stickers';
import createUnsplashSource from './unsplash-source';

export { PHOTOBOOK_LAYOUTS } from './photobook-layouts';
export { PHOTOBOOK_STICKERS } from './photobook-stickers';
export { createApplyLayoutAsset } from './apply-layout';
export { createImageColorsSource } from './image-colors-source';
export { default as createUnsplashSource } from './unsplash-source';
export { default as loadAssetSourceFromContentJSON } from './loadAssetSourceFromContentJSON';

/** Bundled asset sources this editor offers, and the matcher each one uses. */
const BUNDLED_SOURCES: { id: string; matcher?: string[] }[] = [
  { id: 'ly.img.color.palette' },
  { id: 'ly.img.typeface' },
  // Text style presets live in three engine-side sources.
  { id: 'ly.img.text' },
  { id: 'ly.img.text.styles' },
  { id: 'ly.img.text.curves' },
  { id: 'ly.img.text.components' },
  { id: 'ly.img.vector.shape', matcher: ['ly.img.vector.shape.filled.*'] }
];

const UPLOAD_SOURCES: { id: string; mimeTypes: string[] }[] = [
  {
    id: 'ly.img.image.upload',
    mimeTypes: [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/svg+xml',
      'image/bmp',
      'image/gif',
      'image/apng'
    ]
  },
  {
    id: 'ly.img.video.upload',
    mimeTypes: [
      'application/json',
      'video/mp4',
      'video/quicktime',
      'video/webm',
      'video/matroska',
      'image/gif',
      'image/apng'
    ]
  },
  {
    id: 'ly.img.audio.upload',
    mimeTypes: ['audio/mpeg', 'audio/mp3', 'audio/x-m4a', 'audio/wav']
  }
];

/**
 * Register everything the photobook editor offers: the bundled asset sources,
 * the upload sources, this kit's own sticker and layout catalogues, the
 * image-colours source and Unsplash.
 *
 * @param engine - A `CreativeEngine` created with `CreativeEngine.init()`
 * @param demoAssetsBaseURL - Where this kit's stickers, layouts and themes live
 */
export async function initPhotobookEditor(
  engine: CreativeEngine,
  demoAssetsBaseURL: string
): Promise<void> {
  engine.editor.setSetting('page/title/show', false);
  engine.editor.setRole('Adopter');

  // Image colors: virtual source built from the scene's images.
  engine.asset.addSource(createImageColorsSource(engine));

  const baseURL = engine.getBaseURL();
  await Promise.all(
    BUNDLED_SOURCES.map(({ id, matcher }) =>
      engine.asset.addLocalAssetSourceFromJSONURI(
        `${baseURL}${id}/content.json`,
        { matcher }
      )
    )
  );

  UPLOAD_SOURCES.forEach(({ id, mimeTypes }) =>
    engine.asset.addLocalSource(id, mimeTypes)
  );

  loadAssetSourceFromContentJSON(engine, PHOTOBOOK_STICKERS, demoAssetsBaseURL);
  loadAssetSourceFromContentJSON(
    engine,
    PHOTOBOOK_LAYOUTS,
    demoAssetsBaseURL,
    createApplyLayoutAsset(engine)
  );

  // Deferred globally, then granted per page on the pages the user added.
  engine.editor.setGlobalScope('lifecycle/destroy', 'Defer');

  engine.asset.addSource(createUnsplashSource(engine));
}

/**
 * CE.SDK Postcard Editor - Initialization Module
 *
 * This module configures the headless CreativeEngine for the postcard editor:
 * - Editor settings, role and scopes
 * - Asset sources for shapes, stickers, typefaces, text and uploads
 * - Custom asset sources (Unsplash, image colors)
 * - Postcard-specific actions on the engine's Actions API
 *
 * @see https://img.ly/docs/cesdk/js/get-started/overview-e18f40/
 */

import type CreativeEngine from '@cesdk/engine';

import { setupActions } from './config/actions';
import createImageColorsSource from './plugins/image-colors';
import createUnsplashSource from './plugins/unsplash';

/**
 * Initialize the CE.SDK Postcard Editor.
 *
 * @param engine - The CreativeEngine instance to configure
 */
export async function initPostcardEditor(
  engine: CreativeEngine
): Promise<void> {
  engine.editor.setSetting('page/title/show', false);

  // Postcard-specific actions (add text, export, style-by-block-name).
  setupActions(engine);

  // `getBaseURL()` returns the configured assets base, trailing-slash normalized.
  const baseURL = engine.getBaseURL();

  // Add default asset sources directly through the engine-native asset API.
  engine.asset.addSource(createImageColorsSource(engine));
  await engine.asset.addLocalAssetSourceFromJSONURI(
    `${baseURL}ly.img.color.palette/content.json`
  );
  await engine.asset.addLocalAssetSourceFromJSONURI(
    `${baseURL}ly.img.typeface/content.json`
  );
  // Text style presets live in three engine-side sources.
  await engine.asset.addLocalAssetSourceFromJSONURI(
    `${baseURL}ly.img.text/content.json`
  );
  await engine.asset.addLocalAssetSourceFromJSONURI(
    `${baseURL}ly.img.text.styles/content.json`
  );
  await engine.asset.addLocalAssetSourceFromJSONURI(
    `${baseURL}ly.img.text.curves/content.json`
  );
  await engine.asset.addLocalAssetSourceFromJSONURI(
    `${baseURL}ly.img.text.components/content.json`
  );
  await engine.asset.addLocalAssetSourceFromJSONURI(
    `${baseURL}ly.img.vector.shape/content.json`,
    { matcher: ['ly.img.vector.shape.filled.*'] }
  );
  await engine.asset.addLocalAssetSourceFromJSONURI(
    `${baseURL}ly.img.sticker/content.json`
  );

  // Local upload sources for images, videos, and audio.
  engine.asset.addLocalSource('ly.img.image.upload', [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/svg+xml',
    'image/bmp',
    'image/gif',
    'image/apng'
  ]);
  engine.asset.addLocalSource('ly.img.video.upload', [
    'application/json',
    'video/mp4',
    'video/quicktime',
    'video/webm',
    'video/matroska',
    'image/gif',
    'image/apng'
  ]);
  engine.asset.addLocalSource('ly.img.audio.upload', [
    'audio/mpeg',
    'audio/mp3',
    'audio/x-m4a',
    'audio/wav'
  ]);

  // Demo asset sources (templates, audio, video).
  await engine.asset.addLocalAssetSourceFromJSONURI(
    `${baseURL}ly.img.templates/content.json`,
    { matcher: ['ly.img.templates.design.*'] }
  );
  await engine.asset.addLocalAssetSourceFromJSONURI(
    `${baseURL}ly.img.audio/content.json`,
    { matcher: ['ly.img.audio.*'] }
  );
  await engine.asset.addLocalAssetSourceFromJSONURI(
    `${baseURL}ly.img.video/content.json`,
    { matcher: ['ly.img.video.*'] }
  );

  engine.editor.setGlobalScope('lifecycle/destroy', 'Defer');
  engine.editor.setRole('Adopter');

  engine.asset.addSource(createUnsplashSource(engine));
}

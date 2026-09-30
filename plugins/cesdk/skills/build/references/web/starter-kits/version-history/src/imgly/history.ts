/**
 * CE.SDK Version History - Snapshot Creation
 *
 * Pure functions for creating scene snapshots with thumbnails.
 * No React or state management - just CE.SDK operations.
 */

import type CreativeEditorSDK from '@cesdk/cesdk-js';

/**
 * Create a snapshot from the current editor state.
 *
 * Generates a thumbnail image and creates blob URLs for both
 * the thumbnail and the scene data.
 *
 * @param cesdk - The CreativeEditorSDK instance
 * @param sceneString - The serialized scene string
 * @returns Object containing thumbnailUrl and sceneUrl blob URLs
 */
// highlight-createSnapshot
export async function createSnapshot(
  cesdk: CreativeEditorSDK,
  sceneString: string
): Promise<{ thumbnailUrl: string; sceneUrl: string }> {
  const engine = cesdk.engine;
  const scene = engine.scene.get();
  if (!scene) {
    throw new Error('No scene available');
  }

  // Create thumbnail from current scene
  const thumbnailBlob = await engine.block.export(scene, {
    mimeType: 'image/jpeg',
    targetWidth: 168,
    targetHeight: 168
  });
  const thumbnailUrl = URL.createObjectURL(thumbnailBlob);

  // Create blob URL for scene data
  const sceneBlob = new Blob([sceneString], { type: 'text/plain' });
  const sceneUrl = URL.createObjectURL(sceneBlob);

  return { thumbnailUrl, sceneUrl };
}
// highlight-createSnapshot

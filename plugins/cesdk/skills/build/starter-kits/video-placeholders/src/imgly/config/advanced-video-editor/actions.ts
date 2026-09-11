/**
 * Actions Configuration - Override Default Actions and Add Custom Actions
 *
 * This file shows how to override CE.SDK's default actions with your own
 * implementations, and how to register custom actions for the Advanced Video Editor.
 *
 * ## Actions API
 *
 * - `cesdk.actions.register(id, handler)` - Register or override an action
 * - `cesdk.actions.run(id, ...args)` - Execute an action (async, throws if not found)
 * - `cesdk.actions.get(id)` - Get action handler (returns undefined if not found)
 * - `cesdk.actions.list()` - List all registered action IDs
 *
 * ## Built-in Utility Functions
 *
 * CE.SDK provides utilities for common operations:
 *
 * ## Built-in Utility Functions
 *
 * CE.SDK provides utilities for common operations that you can use in your actions:
 *
 * - `cesdk.utils.export(options)` - Export current design to various formats
 *   - Options: mimeType, targetWidth, targetHeight, jpegQuality, pngCompressionLevel
 *   - Returns: { blobs: Blob[], options: ExportOptions }
 *
 * - `cesdk.utils.downloadFile(data, mimeType, filename?)` - Trigger browser file download
 *   - data: Blob, string, or ArrayBuffer
 *   - mimeType: MIME type (e.g., 'image/png', 'application/json')
 *   - filename: Optional filename (auto-generated if not provided)
 *
 * - `cesdk.utils.loadFile(options)` - Open browser file picker
 *   - Options: accept (file extensions), returnType ('text', 'arrayBuffer', 'objectURL')
 *   - Returns: Promise<string | ArrayBuffer | string> based on returnType
 *
 * - `cesdk.utils.localUpload(file, context)` - Create local blob URL for uploads
 *   - file: File object from input or drag-drop
 *   - context: Upload context ('image', 'video', 'audio', etc.)
 *   - Returns: Promise<string> - Blob URL that can be used with engine
 *
 * @see https://img.ly/docs/cesdk/js/actions-6ch24x
 * @see https://img.ly/docs/cesdk/js/export/
 */

import type CreativeEditorSDK from '@cesdk/cesdk-js';

/**
 * Register actions and configure the navigation bar for Advanced Video Editor.
 *
 * Override default actions to integrate with your backend, or register
 * entirely custom actions for your application's needs.
 *
 * @param cesdk - The CreativeEditorSDK instance to configure
 *
 * @example Running actions programmatically
 * ```typescript
 * // Run built-in actions
 * await cesdk.actions.run('saveScene');
 * await cesdk.actions.run('exportVideo');
 * await cesdk.actions.run('exportDesign', { mimeType: 'video/mp4' });
 * await cesdk.actions.run('zoom.toPage', { page: 'current' });
 *
 * // Run custom actions
 * await cesdk.actions.run('myCustomAction', arg1, arg2);
 * ```
 *
 * @example Export video with custom settings
 * ```typescript
 * const { blobs } = await cesdk.utils.export({
 *   mimeType: 'video/mp4',
 *   fps: 60,
 *   quality: 0.95,
 *   targetWidth: 1920,
 *   targetHeight: 1080
 * });
 * ```
 */
export function setupActions(cesdk: CreativeEditorSDK): void {
  // ============================================================================
  // SCENE MANAGEMENT ACTIONS
  // Save and load scene files for editing workflows
  // ============================================================================

  // #region Save Scene Action
  // Save the current scene as a .scene JSON file
  // Users can reload this file later to continue editing
  cesdk.actions.register('saveScene', async () => {
    const scene = await cesdk.engine.scene.saveToString();
    await cesdk.utils.downloadFile(scene, 'text/plain;charset=UTF-8');
  });
  // #endregion

  // #region Import Scene Action
  // Load a previously saved scene file
  // Supports both .scene (JSON) and .zip (archive) formats
  cesdk.actions.register('importScene', async ({ format = 'scene' }) => {
    if (format === 'scene') {
      // Load from .scene JSON file
      const scene = await cesdk.utils.loadFile({
        accept: '.scene',
        returnType: 'text'
      });
      await cesdk.engine.scene.loadFromString(scene);
    } else {
      // Load from .zip archive file
      const blobURL = await cesdk.utils.loadFile({
        accept: '.zip',
        returnType: 'objectURL'
      });
      try {
        await cesdk.engine.scene.loadFromArchiveURL(blobURL);
      } finally {
        URL.revokeObjectURL(blobURL);
      }
    }

    // Zoom to fit the first page after loading
    await cesdk.actions.run('zoom.toPage', { page: 'first' });
  });
  // #endregion

  // #region Export Scene Action
  // Export the scene for storage or version control
  // Archive format includes all embedded assets
  cesdk.actions.register('exportScene', async ({ format = 'scene' }) => {
    await cesdk.utils.downloadFile(
      format === 'archive'
        ? await cesdk.engine.scene.saveToArchive()
        : await cesdk.engine.scene.saveToString(),
      format === 'archive' ? 'application/zip' : 'text/plain;charset=UTF-8'
    );
  });
  // #endregion

  // ============================================================================
  // VIDEO EXPORT ACTIONS
  // Export the final video in various formats
  // ============================================================================

  // #region Export Video Action
  // Export the timeline as an MP4 video file
  // Uses default export settings (30fps, 0.85 quality)
  cesdk.actions.register('exportVideo', async () => {
    const { blobs, options } = await cesdk.utils.export({
      mimeType: 'video/mp4'
    });
    await cesdk.utils.downloadFile(blobs[0], options.mimeType);
  });
  // #endregion

  // #region Export Design Action
  // Generic export action supporting multiple formats
  // Used by the UI for exporting with custom options
  cesdk.actions.register('exportDesign', async (exportOptions) => {
    const { blobs, options } = await cesdk.utils.export(exportOptions);
    await cesdk.utils.downloadFile(blobs[0], options.mimeType);
  });
  // #endregion

  // ============================================================================
  // ASSET UPLOAD ACTIONS
  // Handle user file uploads for videos, images, and audio
  // ============================================================================

  // #region Upload File Action
  // Process uploaded files and create local blob URLs
  // Called when users upload videos, images, or audio files
  cesdk.actions.register('uploadFile', (file, onProgress, context) => {
    return cesdk.utils.localUpload(file, context);
  });
  // #endregion

  // ============================================================================
  // CUSTOM ACTIONS (COMMENTED OUT)
  // Example custom actions you can enable and modify
  // ============================================================================

  // #region Add Clip Action
  // Custom action to open asset library for adding video/image clips
  // cesdk.actions.register('addClip', async () => {
  //   cesdk.ui.openPanel('//ly.img.panel/assetLibrary', {
  //     payload: {
  //       entries: ['ly.img.image', 'ly.img.video'],
  //       applyAssetContext: {
  //         clipType: 'clip'
  //       }
  //     }
  //   });
  // });
  // #endregion

  // #region Share Action
  // Share video using the Web Share API or fallback to download
  // cesdk.actions.register('share', async () => {
  //   const { blobs } = await cesdk.utils.export({ mimeType: 'video/mp4' });
  //   const file = new File([blobs[0]], 'video.mp4', { type: 'video/mp4' });
  //
  //   if (navigator.share && navigator.canShare({ files: [file] })) {
  //     await navigator.share({
  //       files: [file],
  //       title: 'My Video',
  //       text: 'Check out my video!'
  //     });
  //   } else {
  //     await cesdk.utils.downloadFile(blobs[0], 'video/mp4');
  //   }
  // });
  // #endregion
}

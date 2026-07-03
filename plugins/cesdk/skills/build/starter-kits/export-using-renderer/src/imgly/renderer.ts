/**
 * CE.SDK Renderer Export Module
 *
 * This module provides functionality to export scenes using a CE.SDK Renderer API server.
 * The renderer performs server-side video encoding for faster exports.
 *
 * @see https://img.ly/docs/cesdk/renderer/overview/
 */

import type CreativeEditorSDK from '@cesdk/cesdk-js';


/**
 * Gets the renderer proxy URL from environment or returns the default.
 */
export function getRendererURL(): string {
  const envUrl = import.meta.env.VITE_RENDERER_PROXY_URL;
  return envUrl;
}

/**
 * Export state tracking for timing information.
 */
interface ExportState {
  uploadFinished: number;
  renderFinished: number;
}

/**
 * Fully exports a scene by sending an archived version of it to a CE.SDK Renderer API server,
 * listens for partial progress updates and downloads the scene when done.
 *
 * @param archiveBlob - The archived scene data to send to the server for export
 * @param cesdk - The CE.SDK instance to use for progress updates
 * @param notificationId - The notification ID to use for progress updates
 */
export async function exportUsingRenderer(
  archiveBlob: Blob,
  cesdk: CreativeEditorSDK,
  notificationId: string
): Promise<void> {
  const rendererURL = getRendererURL();

  cesdk.ui.updateNotification(notificationId, {
    message: 'Uploading the archive...',
    duration: 'infinite',
    type: 'loading'
  });

  const state: ExportState = {
    uploadFinished: 0,
    renderFinished: 0
  };

  // Use an XMLHttpRequest for its flexible progress notifications
  const xhr = new XMLHttpRequest();

  // Track upload progress
  xhr.upload.addEventListener('progress', (event) => {
    if (!event.lengthComputable) {
      return;
    }
    const progress = Math.round(100.0 * (event.loaded / event.total));
    if (progress >= 100 && !state.uploadFinished) {
      state.uploadFinished = Date.now();
    }
    cesdk.ui.updateNotification(notificationId, {
      message:
        progress >= 100
          ? 'Rendering on the server...'
          : `Uploading the archive... (${progress}% complete)`,
      duration: 'infinite',
      type: 'loading'
    });
  });

  // Track download progress
  xhr.addEventListener('progress', (event) => {
    if (!event.lengthComputable) {
      return;
    }
    if (!state.renderFinished) {
      state.renderFinished = Date.now();
    }
    const progress = Math.round(100.0 * (event.loaded / event.total));
    cesdk.ui.updateNotification(notificationId, {
      message: `Downloading the export... (${progress}% complete)`,
      duration: 'infinite',
      type: 'loading'
    });
  });

  // Execute the request
  await new Promise<void>((resolve, reject) => {
    xhr.addEventListener('error', (err) => {
      reject(err);
    });
    xhr.addEventListener('loadend', () => {
      if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
        resolve();
      } else {
        reject(new Error(xhr.statusText || 'Export failed'));
      }
    });
    xhr.open('POST', rendererURL, true);
    xhr.responseType = 'blob';
    const payload = new FormData();
    payload.set('scene', archiveBlob);
    xhr.send(payload);
  });

  // Show success message with timing info
  const renderTime =
    Math.round((state.renderFinished - state.uploadFinished) / 100.0) / 10.0;
  cesdk.ui.updateNotification(notificationId, {
    message: `Export downloaded, server render took ${renderTime} seconds`,
    duration: 'infinite',
    type: 'success'
  });

  // Download the file
  const mimeType = xhr.getResponseHeader('content-type') || 'video/mp4';
  cesdk.utils.downloadFile(xhr.response, mimeType as 'video/mp4');
}

/**
 * Registers the renderer export action and UI components with CE.SDK.
 *
 * @param cesdk - The CreativeEditorSDK instance
 */
export function setupRendererExport(cesdk: CreativeEditorSDK): void {
  // Register the export action
  cesdk.actions.register('exportUsingRenderer', async () => {
    const progressNotification = cesdk.ui.showNotification({
      message: 'Archiving...',
      duration: 'infinite',
      type: 'loading'
    });

    try {
      const archive = await cesdk.engine.scene.saveToArchive();
      await exportUsingRenderer(archive, cesdk, progressNotification);
    } catch (error) {
      console.error('Error encountered during scene export:', error);
      cesdk.ui.dismissNotification(progressNotification);
      cesdk.ui.showNotification({
        message: 'Export failed',
        type: 'error'
      });
    }
  });

  // Add translations
  cesdk.i18n.setTranslations({
    en: {
      'actions.export.using.renderer': 'Export using CE.SDK Renderer'
    }
  });

  // Configure navigation bar with custom actions
  cesdk.ui.setComponentOrder({ in: 'ly.img.navigation.bar' }, [
    'ly.img.documentSettings.navigationBar',
    'ly.img.undoRedo.navigationBar',
    'ly.img.spacer',
    'ly.img.zoom.navigationBar',
    {
      id: 'ly.img.actions.navigationBar',
      children: [
        {
          id: 'ly.img.action.navigationBar',
          key: 'export-using-renderer',
          label: 'actions.export.using.renderer',
          icon: '@imgly/Video',
          onClick: () => cesdk.actions.run('exportUsingRenderer')
        },
        'ly.img.importArchive.navigationBar',
        'ly.img.importScene.navigationBar',
        'ly.img.exportScene.navigationBar',
        'ly.img.exportArchive.navigationBar'
      ]
    }
  ]);
}

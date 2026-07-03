/**
 * CE.SDK QR Code Editor Starterkit - Main Entry Point
 *
 * A design editor with QR code generation prominently featured.
 * Use the QR Code button in the dock or the canvas menu to generate QR codes.
 *
 * @see https://img.ly/docs/cesdk/js/plugins/qr-code/
 */

import CreativeEditorSDK from '@cesdk/cesdk-js';

import { initQRCodeEditor } from './imgly';
import { resolveAssetPath } from './imgly/resolveAssetPath';

// ============================================================================
// Configuration
// ============================================================================

const config = {
  baseURL: import.meta.env.VITE_IMGLY_LOCAL_ASSETS_URL,
  userId: 'starterkit-qr-code-editor-user',

  // IMG.LY CDN (for quick testing only, NOT recommended for production)
  // baseURL: import.meta.env.VITE_IMGLY_LOCAL_ASSETS_URL,

  // Local assets for development

  license: import.meta.env.VITE_CESDK_LICENSE
};

// ============================================================================
// Initialize QR Code Editor
// ============================================================================

CreativeEditorSDK.create('#cesdk_container', config)
  .then(async (cesdk) => {
    // Debug access (remove in production)
    (window as any).cesdk = cesdk;

    await initQRCodeEditor(cesdk);

    // ============================================================================
    // Scene Loading
    // ============================================================================

    // Load the QR code demo scene from the public showcases URL
    // This scene contains pre-made QR code elements for demonstration
    await cesdk.loadFromArchiveURL(resolveAssetPath('/assets/scene.archive'));

    // Select the first QR code block for immediate editing
    const qrCodeBlock = cesdk.engine.block.findByName('QR Code 1')[0];
    if (qrCodeBlock) {
      cesdk.engine.block.select(qrCodeBlock);
    }
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Failed to initialize CE.SDK:', error);
  });

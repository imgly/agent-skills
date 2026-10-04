/**
 * CE.SDK QR Code Editor Starterkit - Main Entry Point
 *
 * A design editor with QR code generation prominently featured.
 * Use the QR Code button in the dock or the canvas menu to generate QR codes.
 *
 * @see https://img.ly/docs/cesdk/js/stickers-and-shapes/insert-qr-code-b6cc53/
 */

import CreativeEditorSDK from '@cesdk/cesdk-js';

import { initQRCodeEditor } from './imgly';
import { DEMO_ASSETS_BASE_URL } from './imgly/demo-assets';


// ============================================================================
// Configuration
// ============================================================================

const config = {
  userId: 'starterkit-qr-code-editor-user',

  // IMG.LY CDN (for quick testing only, NOT recommended for production)

  // Local assets for development

};

// ============================================================================
// Initialize QR Code Editor
// ============================================================================

CreativeEditorSDK.create('#cesdk_container', config)
  .then(async (cesdk) => {

    await initQRCodeEditor(cesdk);

    // ============================================================================
    // Scene Loading
    // ============================================================================

    // Load the QR code demo scene from the public showcases URL
    // This scene contains pre-made QR code elements for demonstration
    await cesdk.load(`${DEMO_ASSETS_BASE_URL}/assets/scene.archive`);

    // Select the first QR code block for immediate editing. The plugin writes
    // this metadata key on every QR block it creates.
    const qrCodeBlock = cesdk.engine.block
      .findAll()
      .find((block) =>
        cesdk.engine.block
          .findAllMetadata(block)
          .includes('@imgly/plugin-qr-code-web')
      );
    if (qrCodeBlock) {
      cesdk.engine.block.select(qrCodeBlock);
    }
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Failed to initialize CE.SDK:', error);
  });

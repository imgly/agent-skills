/**
 * QR Code Plugin
 *
 * Adds QR code generation using @imgly/plugin-qr-code-web.
 * Creates both a canvas menu entry and a dock panel button.
 *
 * ## Installation
 *
 * ```bash
 * npm install @imgly/plugin-qr-code-web
 * ```
 *
 * ## Usage
 *
 * ```typescript
 * import { setupQRCodePlugin } from './plugins/qr-code';
 *
 * // After cesdk initialization
 * await setupQRCodePlugin(cesdk);
 * ```
 *
 * @see https://img.ly/docs/cesdk/js/plugins/qr-code/
 */

import type CreativeEditorSDK from '@cesdk/cesdk-js';
import QRCodePlugin from '@imgly/plugin-qr-code-web';

/**
 * Sets up the QR code plugin with both canvas menu and dock entry.
 *
 * - Canvas menu: Adds "Generate QR Code" option in the canvas context menu
 * - Dock: Adds QR Code Generator button that opens the QR code panel
 *
 * @param cesdk - The CreativeEditorSDK instance
 */
export async function setupQRCodePlugin(
  cesdk: CreativeEditorSDK
): Promise<void> {
  // Add official QR code plugin
  // This automatically adds "Generate QR Code" to the canvas context menu
  await cesdk.addPlugin(QRCodePlugin());

  // Add QR Code Generator button to the dock
  // Uses setComponentOrder to append the QR code dock entry at the bottom
  cesdk.ui.setComponentOrder({ in: 'ly.img.dock' }, [
    ...cesdk.ui.getComponentOrder({ in: 'ly.img.dock' }),
    // The spacer pushes it to the bottom of the dock
    'ly.img.spacer',
    // The dock component ID is provided by the QR code plugin
    'ly.img.generate-qr.dock'
  ]);
}

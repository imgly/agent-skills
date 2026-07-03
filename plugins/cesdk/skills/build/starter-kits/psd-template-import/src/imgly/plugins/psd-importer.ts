/**
 * PSD Importer
 *
 * Provides PSD file import functionality using @imgly/psd-importer.
 * Processes PSD files headlessly and returns scene data for the CE.SDK editor.
 *
 * ## Installation
 *
 * ```bash
 * npm install @imgly/psd-importer
 * ```
 *
 * ## Usage
 *
 * ```typescript
 * import { importPsdFile } from './plugins/psd-importer';
 *
 * // Import a PSD file
 * const result = await importPsdFile(psdBlob, 'design.psd', {
 *   baseURL: import.meta.env.VITE_IMGLY_LOCAL_ASSETS_URL
 * });
 *
 * // Load into editor
 * await cesdk.loadFromArchiveURL(result.sceneArchiveUrl);
 *
 * // Clean up when done (at app level)
 * URL.revokeObjectURL(result.imageUrl);
 * URL.revokeObjectURL(result.sceneArchiveUrl);
 * ```
 *
 * @see https://img.ly/docs/cesdk/js/features/import-psd/
 */

import CreativeEngine from '@cesdk/engine';
import {
  PSDParser,
  addGfontsAssetLibrary,
  createWebEncodeBufferToPNG
} from '@imgly/psd-importer';
import type { LogMessage } from '@imgly/psd-importer';

/**
 * Configuration options for PSD import.
 */
export interface PsdImportConfig {
  /** CE.SDK license key */
  license?: string;
  /** Base URL for CE.SDK assets (for local development) */
  baseURL?: string;
  /** Target width for preview image (default: 1000) */
  previewWidth?: number;
  /** Target height for preview image (default: 1000) */
  previewHeight?: number;
}

/**
 * Result of a PSD import operation.
 */
export interface PsdImportResult {
  /** Object URL for the preview image */
  imageUrl: string;
  /** Object URL for the scene archive */
  sceneArchiveUrl: string;
  /** Messages from the PSD parser (warnings, errors) */
  messages: LogMessage[];
  /** Original file name */
  fileName: string;
}

/**
 * Imports a PSD file and returns scene data for the editor.
 *
 * This function:
 * 1. Initializes a headless CreativeEngine instance
 * 2. Parses the PSD file using @imgly/psd-importer
 * 3. Exports a preview image
 * 4. Saves the scene as an archive
 * 5. Returns URLs and parser messages
 *
 * @param file - The PSD file as a Blob or File
 * @param fileName - The file name for the result
 * @param config - Optional configuration
 * @returns Promise with import result containing URLs and messages
 *
 * @example
 * ```typescript
 * const result = await importPsdFile(psdBlob, 'design.psd', {
 *   baseURL: import.meta.env.VITE_IMGLY_LOCAL_ASSETS_URL
 * });
 * console.log('Preview:', result.imageUrl);
 * console.log('Warnings:', result.messages.filter(m => m.type === 'warning'));
 * ```
 */
export async function importPsdFile(
  file: Blob,
  fileName: string,
  config: PsdImportConfig = {}
): Promise<PsdImportResult> {
  const {
    license,
    baseURL,
    previewWidth = 1000,
    previewHeight = 1000
  } = config;

  let engine: CreativeEngine | null = null;

  try {
    // Initialize headless engine for processing
    engine = await CreativeEngine.init({
      baseURL: import.meta.env.VITE_IMGLY_LOCAL_ASSETS_URL,
      ...(license && { license }),
      ...(baseURL && { baseURL })
    });

    // Add Google Fonts support
    await addGfontsAssetLibrary(engine);

    // Convert Blob to ArrayBuffer
    const blobBuffer = await file.arrayBuffer();

    // Parse the PSD file
    const parser = await PSDParser.fromFile(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      engine as any,
      blobBuffer,
      createWebEncodeBufferToPNG()
    );

    const parseResult = await parser.parse();

    // Get the first page for preview
    const pages = engine.scene.getPages();
    const firstPage = pages[0];

    if (firstPage == null) {
      throw new Error('No pages found in PSD file');
    }

    // Export preview image
    const imageBlob = await engine.block.export(firstPage, 'image/png', {
      targetWidth: previewWidth,
      targetHeight: previewHeight
    });

    // Save the scene as an archive
    const sceneArchive = await engine.scene.saveToArchive();

    // Create URLs
    const imageUrl = URL.createObjectURL(imageBlob);
    const sceneArchiveUrl = URL.createObjectURL(sceneArchive);

    return {
      imageUrl,
      sceneArchiveUrl,
      messages: parseResult.logger?.getMessages() ?? [],
      fileName
    };
  } finally {
    // Clean up the headless engine
    if (engine) {
      engine.dispose();
    }
  }
}

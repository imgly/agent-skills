/**
 * PPTX Importer
 *
 * Provides PPTX file import functionality using @imgly/pptx-importer.
 * Processes PPTX files headlessly and returns scene data for the CE.SDK editor.
 *
 * ## Installation
 *
 * ```bash
 * npm install @imgly/pptx-importer
 * ```
 *
 * ## Usage
 *
 * ```typescript
 * import { importPptxFile } from './plugins/pptx-importer';
 *
 * // Import a PPTX file
 * const result = await importPptxFile(pptxBlob, 'presentation.pptx', {
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
 * @see https://img.ly/docs/cesdk/js/features/import-pptx/
 */

import CreativeEngine from '@cesdk/engine';
import { PPTXParser, addGfontsAssetLibrary } from '@imgly/pptx-importer';
import type { LogMessage } from '@imgly/pptx-importer';

/**
 * Configuration options for PPTX import.
 */
export interface PptxImportConfig {
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
 * Result of a PPTX import operation.
 */
export interface PptxImportResult {
  /** Object URL for the preview image */
  imageUrl: string;
  /** Object URL for the scene archive */
  sceneArchiveUrl: string;
  /** Messages from the PPTX parser (warnings, errors) */
  messages: LogMessage[];
  /** Original file name */
  fileName: string;
}

/**
 * Imports a PPTX file and returns scene data for the editor.
 *
 * This function:
 * 1. Initializes a headless CreativeEngine instance
 * 2. Parses the PPTX file using @imgly/pptx-importer
 * 3. Exports a preview image
 * 4. Saves the scene as an archive
 * 5. Returns URLs and parser messages
 *
 * @param file - The PPTX file as a Blob or File
 * @param fileName - The file name for the result
 * @param config - Optional configuration
 * @returns Promise with import result containing URLs and messages
 *
 * @example
 * ```typescript
 * const result = await importPptxFile(pptxBlob, 'presentation.pptx', {
 *   baseURL: import.meta.env.VITE_IMGLY_LOCAL_ASSETS_URL
 * });
 * console.log('Preview:', result.imageUrl);
 * console.log('Warnings:', result.messages.filter(m => m.type === 'warning'));
 * ```
 */
export async function importPptxFile(
  file: Blob,
  fileName: string,
  config: PptxImportConfig = {}
): Promise<PptxImportResult> {
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

    // Add Google Fonts support for better text rendering
    await addGfontsAssetLibrary(engine);

    // Convert Blob to ArrayBuffer
    const blobBuffer = await file.arrayBuffer();

    // Parse the PPTX file
    const parser = await PPTXParser.fromFile(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      engine as any,
      blobBuffer
    );

    const parseResult = await parser.parse();

    // Get the first page for preview
    const pages = engine.scene.getPages();
    const firstPage = pages[0];

    if (firstPage == null) {
      throw new Error('No pages found in PPTX file');
    }

    // Export preview image
    const imageBlob = await engine.block.export(firstPage, {
      mimeType: 'image/png',
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

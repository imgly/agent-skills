/**
 * PDF Importer
 *
 * Provides PDF file import functionality using @imgly/pdf-importer.
 * Processes PDF files headlessly and returns scene data for the CE.SDK editor.
 *
 * ## Installation
 *
 * ```bash
 * npm install @imgly/pdf-importer
 * ```
 *
 * ## Usage
 *
 * ```typescript
 * import { importPdfFile } from './plugins/pdf-importer';
 *
 * // Import a PDF file
 * const result = await importPdfFile(pdfBlob, 'document.pdf', {
 *   baseURL: '/assets/'
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
 * @see https://img.ly/docs/cesdk/js/features/import-pdf/
 */

import CreativeEngine from '@cesdk/engine';
import { PDFParser, addGfontsAssetLibrary } from '@imgly/pdf-importer';
import type { LogMessage } from '@imgly/pdf-importer';

/**
 * Configuration options for PDF import.
 */
export interface PdfImportConfig {
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
 * Result of a PDF import operation.
 */
export interface PdfImportResult {
  /** Object URL for the preview image */
  imageUrl: string;
  /** Object URL for the scene archive */
  sceneArchiveUrl: string;
  /** Messages from the PDF parser (warnings, errors) */
  messages: LogMessage[];
  /** Original file name */
  fileName: string;
}

/**
 * Imports a PDF file and returns scene data for the editor.
 *
 * This function:
 * 1. Initializes a headless CreativeEngine instance
 * 2. Parses the PDF file using @imgly/pdf-importer
 * 3. Exports a preview image
 * 4. Saves the scene as an archive
 * 5. Returns URLs and parser messages
 *
 * @param file - The PDF file as a Blob or File
 * @param fileName - The file name for the result
 * @param config - Optional configuration
 * @returns Promise with import result containing URLs and messages
 *
 * @example
 * ```typescript
 * const result = await importPdfFile(pdfBlob, 'document.pdf', {
 *   baseURL: '/assets/'
 * });
 * console.log('Preview:', result.imageUrl);
 * console.log('Warnings:', result.messages.filter(m => m.type === 'warning'));
 * ```
 */
export async function importPdfFile(
  file: Blob,
  fileName: string,
  config: PdfImportConfig = {}
): Promise<PdfImportResult> {
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
      ...(license && { license }),
      ...(baseURL && { baseURL })
    });

    // Add Google Fonts support for better text rendering
    await addGfontsAssetLibrary(engine);

    // Convert Blob to ArrayBuffer
    const blobBuffer = await file.arrayBuffer();

    // Parse the PDF file
    const parser = await PDFParser.fromFile(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      engine as any,
      blobBuffer
    );

    const parseResult = await parser.parse();

    // Get the first page for preview
    const pages = engine.scene.getPages();
    const firstPage = pages[0];

    if (firstPage == null) {
      throw new Error('No pages found in PDF file');
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

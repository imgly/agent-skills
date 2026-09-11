/**
 * IDML Importer
 *
 * Provides InDesign IDML file import functionality using @imgly/idml-importer.
 * Processes IDML files headlessly and returns scene data for the CE.SDK editor.
 *
 * ## Installation
 *
 * ```bash
 * npm install @imgly/idml-importer
 * ```
 *
 * ## Usage
 *
 * ```typescript
 * import { importIdmlFile } from './plugins/idml-importer';
 *
 * // Import an IDML file
 * const result = await importIdmlFile(idmlBlob, 'design.idml', {
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
 * @see https://img.ly/docs/cesdk/js/features/import-indesign/
 */

import CreativeEngine from '@cesdk/engine';
import { IDMLParser, addGfontsAssetLibrary } from '@imgly/idml-importer';
import type { LogMessage } from '@imgly/idml-importer';

/**
 * Configuration options for IDML import.
 */
export interface IdmlImportConfig {
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
 * Result of an IDML import operation.
 */
export interface IdmlImportResult {
  /** Object URL for the preview image */
  imageUrl: string;
  /** Object URL for the scene archive */
  sceneArchiveUrl: string;
  /** Messages from the IDML parser (warnings, errors) */
  messages: LogMessage[];
  /** Original file name */
  fileName: string;
}

/**
 * Imports an IDML file and returns scene data for the editor.
 *
 * This function:
 * 1. Initializes a headless CreativeEngine instance
 * 2. Parses the IDML file using @imgly/idml-importer
 * 3. Exports a preview image
 * 4. Saves the scene as an archive
 * 5. Returns URLs and parser messages
 *
 * @param file - The IDML file as a Blob or File
 * @param fileName - The file name for the result
 * @param config - Optional configuration
 * @returns Promise with import result containing URLs and messages
 *
 * @example
 * ```typescript
 * const result = await importIdmlFile(idmlBlob, 'design.idml', {
 *   baseURL: import.meta.env.VITE_IMGLY_LOCAL_ASSETS_URL
 * });
 * console.log('Preview:', result.imageUrl);
 * console.log('Warnings:', result.messages.filter(m => m.type === 'warning'));
 * ```
 */
export async function importIdmlFile(
  file: Blob,
  fileName: string,
  config: IdmlImportConfig = {}
): Promise<IdmlImportResult> {
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

    // Create XML parser function for IDML parsing
    // IDML files are ZIP archives containing XML documents
    const xmlParser = (xmlString: string) => {
      const domParser = new DOMParser();
      return domParser.parseFromString(xmlString, 'text/xml');
    };

    // Parse the IDML file
    const parser = await IDMLParser.fromFile(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      engine as any,
      file,
      xmlParser
    );

    const parseResult = await parser.parse();

    // Get the first page for preview
    const pages = engine.scene.getPages();
    const firstPage = pages[0];

    if (firstPage == null) {
      throw new Error('No pages found in IDML file');
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

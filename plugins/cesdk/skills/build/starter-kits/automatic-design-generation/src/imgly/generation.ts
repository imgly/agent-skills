/**
 * Asset Generation - CE.SDK Engine Operations
 *
 * Generic asset generation function.
 * All product-specific logic is handled by the caller via the fill callback.
 */

import type CreativeEngine from '@cesdk/engine';

// ============================================================================
// Types
// ============================================================================

/**
 * Output type for generated assets
 */
export type OutputType = 'image' | 'video';

/**
 * Generated asset result
 */
export interface GeneratedAsset {
  id: number;
  label: string;
  isLoading: boolean;
  width: number;
  height: number;
  src: string | null;
  type: OutputType;
  sceneString: string | null;
}

export interface GenerateAssetOptions {
  templateUrl: string;
  fill: (engine: CreativeEngine, page: number) => void | Promise<void>;
  outputType: OutputType;
  width: number;
  height: number;
  id?: number;
  label?: string;
  zoomToPage?: boolean;
  saveSceneString?: boolean;
}

// ============================================================================
// Functions
// ============================================================================

/**
 * Generate an asset from a template.
 * Template filling is handled by the caller via the fill callback.
 */
export async function generateAsset(
  engine: CreativeEngine,
  options: GenerateAssetOptions
): Promise<GeneratedAsset> {
  const {
    templateUrl,
    fill,
    outputType,
    width,
    height,
    id = 0,
    label = '',
    zoomToPage = false,
    saveSceneString = true
  } = options;

  // Load template
  await engine.scene.loadFromURL(templateUrl);

  // Get page
  const [page] = engine.block.findByKind('page');

  // Optionally zoom to page
  if (zoomToPage) {
    engine.scene.zoomToBlock(page, { padding: 0 });
  }

  // Fill template (caller handles all product-specific logic)
  await fill(engine, page);

  // Export asset
  let blob: Blob;
  if (outputType === 'image') {
    blob = await engine.block.export(engine.scene.get() as number, {
      mimeType: 'image/png',
      targetWidth: width,
      targetHeight: height
    });
  } else {
    blob = await engine.block.exportVideo(page, {
      mimeType: 'video/mp4',
      targetWidth: width,
      targetHeight: height
    });
  }

  // Optionally save scene string
  const sceneString = saveSceneString
    ? await engine.scene.saveToString()
    : null;

  return {
    id,
    label,
    isLoading: false,
    width,
    height,
    src: URL.createObjectURL(blob),
    type: outputType,
    sceneString
  };
}

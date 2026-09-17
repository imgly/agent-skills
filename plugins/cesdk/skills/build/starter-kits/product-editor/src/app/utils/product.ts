/**
 * Product helpers used by App.tsx to bridge the product catalog
 * with the `product.*` actions registered by the ProductBackdrop plugin.
 */

import type { CreativeEngine } from '@cesdk/cesdk-js';

import type { ProductConfig, ProductColor } from '../product-catalog';

/** One printable PDF and one thumbnail per area, plus the scene archive. */
export interface ProductAssets {
  pdfs: Record<string, Blob>;
  thumbnails: Record<string, Blob>;
  archive: Blob;
}

/** Pixel size of the thumbnail exported next to each area's PDF. */
const THUMBNAIL_SIZE = 200;

/**
 * Map a product + color to the narrow payload the
 * `product.setupScene` action accepts.
 */
export function setupSceneOptions(product: ProductConfig, color: ProductColor) {
  return {
    areas: product.areas
      .filter((area) => !area.disabled)
      .map((area) => ({
        id: area.id,
        pageSize: area.pageSize,
        mockup: area.mockup
      })),
    designUnit: product.designUnit,
    variables: { color: color.id }
  };
}

/**
 * Persist the current product and color on scene metadata so they
 * survive scene reloads and can be recovered by handlers like
 * `handleColorChange`.
 */
export function storeProductMetadata(
  engine: CreativeEngine,
  product: ProductConfig,
  color: ProductColor
): void {
  const scene = engine.scene.get();
  if (scene == null) return;
  engine.block.setMetadata(scene, 'product', JSON.stringify(product));
  engine.block.setMetadata(scene, 'color', JSON.stringify(color));
}

/**
 * Read the product previously stored on scene metadata.
 * Returns null when no scene or no product metadata exists.
 */
export function readProductFromMetadata(
  engine: CreativeEngine
): ProductConfig | null {
  const scene = engine.scene.get();
  if (scene == null) return null;
  const productData = engine.block.getMetadata(scene, 'product');
  return productData ? (JSON.parse(productData) as ProductConfig) : null;
}

/**
 * Export every enabled area of the current product as a printable PDF and a
 * 200x200 PNG thumbnail, and save the whole scene as an archive.
 *
 * Only pages named after an enabled area are exported, so pages left behind by
 * a previously selected product are skipped.
 *
 * @param engine - The engine holding the product scene
 * @returns The PDFs and thumbnails keyed by area id, plus the scene archive
 */
export async function exportProductAssets(
  engine: CreativeEngine
): Promise<ProductAssets> {
  const archive = await engine.scene.saveToArchive();
  const product = readProductFromMetadata(engine);
  const enabledAreaIds = new Set(
    (product?.areas ?? [])
      .filter((area) => !area.disabled)
      .map((area) => area.id)
  );
  const pages = engine.block
    .findByType('page')
    .filter((page) => enabledAreaIds.has(engine.block.getName(page)));
  const pdfs: Record<string, Blob> = {};
  const thumbnails: Record<string, Blob> = {};

  for (const page of pages) {
    const areaId = engine.block.getName(page);
    // Temporarily disable page stroke so it doesn't appear in the export
    engine.block.setStrokeEnabled(page, false);
    try {
      pdfs[areaId] = await engine.block.export(page, {
        mimeType: 'application/pdf'
      });
      thumbnails[areaId] = await engine.block.export(page, {
        mimeType: 'image/png',
        targetWidth: THUMBNAIL_SIZE,
        targetHeight: THUMBNAIL_SIZE
      });
    } finally {
      engine.block.setStrokeEnabled(page, true);
    }
  }

  return { pdfs, thumbnails, archive };
}

/**
 * Export every product area and trigger one browser download per file plus
 * the scene archive.
 */
export async function downloadProductAssets(
  engine: CreativeEngine
): Promise<void> {
  const { pdfs, thumbnails, archive } = await exportProductAssets(engine);

  const timestamp = new Date().toISOString();
  for (const [areaId, pdf] of Object.entries(pdfs)) {
    localDownload(pdf, `scene-${timestamp}-${areaId}.pdf`);
  }
  for (const [areaId, thumbnail] of Object.entries(thumbnails)) {
    localDownload(thumbnail, `scene-thumbnail-${timestamp}-${areaId}.png`);
  }
  localDownload(archive, `scene-${timestamp}.imgly`);
}

function localDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  URL.revokeObjectURL(url);
  a.remove();
}

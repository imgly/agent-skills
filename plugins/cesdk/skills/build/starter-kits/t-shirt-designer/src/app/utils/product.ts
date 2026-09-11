/**
 * Product helpers used by App.tsx to bridge the product catalog
 * with the `product.*` actions registered by the ProductBackdrop plugin.
 */

import type CreativeEditorSDK from '@cesdk/cesdk-js';

import type { ProductConfig, ProductColor } from '../product-catalog';

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
  cesdk: CreativeEditorSDK,
  product: ProductConfig,
  color: ProductColor
): void {
  const scene = cesdk.engine.scene.get();
  if (scene == null) return;
  cesdk.engine.block.setMetadata(scene, 'product', JSON.stringify(product));
  cesdk.engine.block.setMetadata(scene, 'color', JSON.stringify(color));
}

/**
 * Export every product area as a printable PDF and a 200×200 PNG thumbnail,
 * and trigger one browser download per file plus the scene archive.
 * Mirrors the behaviour of the `product-editor-ui` showcase.
 */
export async function downloadProductAssets(
  cesdk: CreativeEditorSDK
): Promise<void> {
  const engine = cesdk.engine;
  const archive = await engine.scene.saveToArchive();
  const pages = engine.block.findByType('page');
  const pdfs: Record<string, Blob> = {};
  const thumbnails: Record<string, Blob> = {};

  for (const page of pages) {
    const areaId = engine.block.getName(page);
    // Temporarily disable page stroke so it doesn't appear in the export
    engine.block.setStrokeEnabled(page, false);
    pdfs[areaId] = await engine.block.export(page, {
      mimeType: 'application/pdf'
    });
    thumbnails[areaId] = await engine.block.export(page, {
      mimeType: 'image/png',
      targetWidth: 200,
      targetHeight: 200
    });
    engine.block.setStrokeEnabled(page, true);
  }

  const timestamp = new Date().toISOString();
  for (const [areaId, pdf] of Object.entries(pdfs)) {
    localDownload(pdf, `scene-${timestamp}-${areaId}.pdf`);
  }
  for (const [areaId, thumbnail] of Object.entries(thumbnails)) {
    localDownload(thumbnail, `scene-thumbnail-${timestamp}-${areaId}.png`);
  }
  localDownload(archive, `scene-${timestamp}.zip`);
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

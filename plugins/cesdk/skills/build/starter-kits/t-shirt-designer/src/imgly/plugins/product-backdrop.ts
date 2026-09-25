/**
 * Product Backdrop Plugin
 *
 * Owns the end-to-end product editor scene lifecycle: pages, backdrops,
 * area navigation, and variable substitution on backdrop image URIs.
 * Backdrops are graphic blocks parented to the scene, sized and positioned
 * so the printable area of the mockup aligns with the page rect. Non-
 * rectangular products define an optional `pageShape` SVG path that is
 * applied to the page via the engine's native vector-path shape, clipping
 * design content to the silhouette both on screen and at export.
 *
 * The plugin registers these custom actions:
 * - `product.setupScene(options)` — create/update pages and backdrops
 * - `product.switchArea(areaId)` — focus a specific area page
 * - `product.getVisibleAreaId()` — name of the currently visible area
 * - `product.applyVariables(variables, areas)` — substitute `{{key}}` tokens in backdrop image URIs
 *
 * Mockup image URIs may embed `{{key}}` tokens that are substituted at
 * setup and on demand via `product.applyVariables`. The kit decides which
 * variable names to use — the plugin only provides the substitution engine.
 *
 * ## Usage
 *
 * ```typescript
 * import { ProductBackdrop } from './plugins/product-backdrop';
 *
 * await cesdk.addPlugin(new ProductBackdrop());
 * await cesdk.actions.run('product.setupScene', {
 *   areas: [{ id: 'front', pageSize: { width: 10, height: 10 }, mockup: {...} }],
 *   designUnit: 'Inch',
 *   variables: { color: 'white' }
 * });
 * ```
 */

import type {
  CreativeEngine,
  DesignUnit,
  EditorPlugin,
  EditorPluginContext
} from '@cesdk/cesdk-js';
import CreativeEditorSDK from '@cesdk/cesdk-js';

import type { BackdropConfig, Source } from '../types';

// ─── Internal Constants ───────────────────────────────────────────────────────

/** Block-kind tag used to identify backdrop graphic blocks in the scene. */
const BACKDROP_BLOCK_KIND = 'backdrop_image';

/** Metadata key under which each page stores its backdrop config. */
const BACKDROP_CONFIG_METADATA_KEY = 'backdrop_config';

// ─── Input Types ──────────────────────────────────────────────────────────────

interface SetupSceneArea {
  id: string;
  pageSize: { width: number; height: number };
  mockup?: {
    images?: Source[];
    printableAreaPx: { x: number; y: number; width: number; height: number };
    /**
     * Optional SVG path Coordinates are expected in the `printableAreaPx` box:
     * `(0, 0)` to `(printableAreaPx.width, printableAreaPx.height)`.
     */
    pageShape?: string;
  };
}

interface SetupSceneOptions {
  areas: SetupSceneArea[];
  designUnit: DesignUnit;
  /** Replaces `{{key}}` tokens in mockup image URIs with the given values. */
  variables?: Record<string, string>;
}

// ─── Private Helpers ──────────────────────────────────────────────────────────

function calculateBlockLayout(pageWidth: number, config: BackdropConfig) {
  const image = config.images[0];
  if (!image) {
    throw new Error('Backdrop configuration must include images');
  }
  const scale = pageWidth / config.printableAreaPx.width;
  return {
    width: image.width * scale,
    height: image.height * scale,
    x: -config.printableAreaPx.x * scale,
    y: -config.printableAreaPx.y * scale
  };
}

function applyVariables(
  images: Source[],
  variables: Record<string, string>
): Source[] {
  return images.map((img) => {
    let uri = img.uri;
    for (const [key, value] of Object.entries(variables)) {
      uri = uri.split(`{{${key}}}`).join(value);
    }
    return { ...img, uri };
  });
}

function createPage(engine: CreativeEngine): number {
  const page = engine.block.create('page');
  engine.block.appendChild(engine.scene.get()!, page);

  // Transparent background
  const fill = engine.block.getFill(page);
  engine.block.setFill(page, fill);
  engine.block.setColor(fill, 'fill/color/value', { r: 0, g: 0, b: 0, a: 0 });

  // Black stroke
  engine.block.setStrokeColor(page, { r: 0, g: 0, b: 0, a: 1 });
  engine.block.setStrokeEnabled(page, true);
  engine.block.setStrokeStyle(page, 'Solid');

  // Non-selectable and clipped
  engine.block.setScopeEnabled(page, 'editor/select', false);
  engine.editor.setSelectionEnabled(page, false);
  engine.block.setClipped(page, true);

  return page;
}

function setupPage(
  engine: CreativeEngine,
  page: number,
  area: SetupSceneArea
): void {
  const { width, height } = area.pageSize;
  engine.block.resizeContentAware([page], width, height);
  engine.block.setPositionX(page, 0);
  engine.block.setPositionY(page, 0);
  engine.block.setStrokeWidth(page, width * 0.005);
  engine.block.setStrokeEnabled(page, true);
  engine.block.setName(page, area.id);
}

/**
 * Replace the page's shape, destroying the previously attached one so
 * switching between products never leaves an old silhouette behind. When
 * `options` is given a `vector_path` shape carries the provided `path`
 * inside a coordinate box of the given `size`; otherwise the page is reset
 * to the default rectangular shape.
 */
function applyPageShape(
  engine: CreativeEngine,
  page: number,
  options?: { path: string; size: { width: number; height: number } }
): void {
  const oldShape = engine.block.getShape(page);

  let newShape: number;
  if (options) {
    newShape = engine.block.createShape('vector_path');
    engine.block.setString(newShape, 'shape/vector_path/path', options.path);
    engine.block.setFloat(
      newShape,
      'shape/vector_path/width',
      options.size.width
    );
    engine.block.setFloat(
      newShape,
      'shape/vector_path/height',
      options.size.height
    );
  } else {
    newShape = engine.block.createShape('rect');
  }

  engine.block.setShape(page, newShape);
  engine.block.destroy(oldShape);
}

function createBackdropBlock(
  engine: CreativeEngine,
  areaId: string,
  config: BackdropConfig,
  pageBlock: number
): number {
  const block = engine.block.create('graphic');
  engine.block.setKind(block, BACKDROP_BLOCK_KIND);
  engine.block.setName(block, `Backdrop-${areaId}`);

  engine.block.setShape(block, engine.block.createShape('rect'));
  const fill = engine.block.createFill('image');
  engine.block.setFill(block, fill);

  engine.block.setScopeEnabled(block, 'editor/select', false);
  engine.editor.setSelectionEnabled(block, false);

  if (config.images.length) {
    engine.block.setSourceSet(fill, 'fill/image/sourceSet', config.images);
    const layout = calculateBlockLayout(
      engine.block.getWidth(pageBlock),
      config
    );
    engine.block.setWidth(block, layout.width);
    engine.block.setHeight(block, layout.height);
    engine.block.setPositionX(block, layout.x);
    engine.block.setPositionY(block, layout.y);
    engine.block.resetCrop(block);
  }

  // Insert behind other elements
  engine.block.insertChild(engine.scene.get()!, block, 0);
  engine.block.setVisible(block, false);
  return block;
}

// ─── Plugin ───────────────────────────────────────────────────────────────────

/**
 * Product Backdrop plugin.
 *
 * Registers every product-editor verb as a custom action so callers can
 * orchestrate the scene through `cesdk.actions.run(...)` without importing
 * any implementation functions.
 *
 * @public
 */
export class ProductBackdrop implements EditorPlugin {
  name = 'cesdk-product-backdrop';

  version = CreativeEditorSDK.version;

  async initialize({ cesdk }: EditorPluginContext) {
    if (!cesdk) return;
    const engine = cesdk.engine;

    // Allow non-rectangular page shapes. Defaults to false in the engine.
    engine.editor.setSetting('page/allowShapeChange', true);

    // #region Setup Scene Action
    // Create or update pages and backdrops for the given areas. Hidden
    // backdrops are created behind each page. When an area defines a
    // `pageShape`, the page is clipped to that silhouette via the engine's
    // native vector-path shape.
    cesdk.actions.register(
      'product.setupScene',
      (options: SetupSceneOptions) => {
        const { areas, designUnit, variables } = options;

        if (engine.scene.get() == null) engine.scene.create('Free');
        engine.scene.setDesignUnit(designUnit);

        // Create/update pages by area.id
        const usedPages = areas.map((area) => {
          const existing = engine.block.findByName(area.id);
          const page = existing.length ? existing[0] : createPage(engine);
          setupPage(engine, page, area);
          applyPageShape(
            engine,
            page,
            area.mockup?.pageShape
              ? {
                  path: area.mockup.pageShape,
                  size: area.mockup.printableAreaPx
                }
              : undefined
          );
          return page;
        });

        // Remove pages that no longer correspond to an area
        engine.block
          .findByType('page')
          .filter((page) => !usedPages.includes(page))
          .forEach((page) => engine.block.destroy(page));

        // Rebuild backdrops for every area
        engine.block
          .findByKind(BACKDROP_BLOCK_KIND)
          .forEach((block) => engine.block.destroy(block));

        for (const area of areas) {
          if (!area.mockup) continue;

          const images = variables
            ? applyVariables(area.mockup.images ?? [], variables)
            : (area.mockup.images ?? []);

          const [pageBlock] = engine.block.findByName(area.id);
          if (!pageBlock) {
            throw new Error(`No page block found for area: ${area.id}`);
          }

          const backdropConfig: BackdropConfig = {
            images,
            printableAreaPx: area.mockup.printableAreaPx
          };
          engine.block.setMetadata(
            pageBlock,
            BACKDROP_CONFIG_METADATA_KEY,
            JSON.stringify(backdropConfig)
          );
          createBackdropBlock(engine, area.id, backdropConfig, pageBlock);
        }
      }
    );
    // #endregion

    // #region Switch Area Action
    // Switch the editor view to a specific product area (page).
    // Deselects any current selection, switches to the area's page,
    // reveals its backdrop, and zooms to frame it.
    cesdk.actions.register('product.switchArea', async (areaId: string) => {
      engine.block
        .findAllSelected()
        .forEach((block) => engine.block.setSelected(block, false));

      const [pageBlock] = engine.block.findByName(areaId);
      if (pageBlock == null) return;
      await cesdk.unstable_switchPage(pageBlock);

      // Hide all backdrops, show only the target area's backdrop
      engine.block
        .findByKind(BACKDROP_BLOCK_KIND)
        .forEach((block) => engine.block.setVisible(block, false));

      const backdropBlock = engine.block.findByName(`Backdrop-${areaId}`)[0];
      if (backdropBlock != null) {
        engine.block.setVisible(backdropBlock, true);
        await cesdk.actions.run('zoom.toBlock', backdropBlock, {
          animate: false,
          autoFit: true
        });
      }
    });
    // #endregion

    // #region Get Visible Area ID Action
    // Return the ID (block name) of the currently visible area page,
    // or null if no page is currently focused.
    cesdk.actions.register('product.getVisibleAreaId', (): string | null => {
      const pageBlock = engine.scene.getCurrentPage();
      return pageBlock != null ? engine.block.getName(pageBlock) : null;
    });
    // #endregion

    // #region Apply Variables Action
    // Swap the backdrop images of every area by substituting `{{key}}` tokens
    // in each image URI with values from the given variables map.
    cesdk.actions.register(
      'product.applyVariables',
      (variables: Record<string, string>, areas: SetupSceneArea[]) => {
        for (const area of areas) {
          if (!area.mockup?.images) continue;
          const images = applyVariables(area.mockup.images, variables);
          const block = engine.block.findByName(`Backdrop-${area.id}`)[0];
          if (block == null || !images.length) continue;
          const fill = engine.block.getFill(block)!;
          engine.block.setSourceSet(fill, 'fill/image/sourceSet', images);
        }
      }
    );
    // #endregion
  }
}

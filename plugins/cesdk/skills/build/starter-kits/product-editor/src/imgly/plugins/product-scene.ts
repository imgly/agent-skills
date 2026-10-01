/**
 * Product Scene Building
 *
 * The engine-only half of the product editor: pages, backdrops, page shapes
 * and variable substitution on backdrop image URIs. Backdrops are graphic
 * blocks parented to the scene, sized and positioned so the printable area of
 * the mockup aligns with the page rect. Non-rectangular products define an
 * optional `pageShape` SVG path that is applied to the page via the engine's
 * native vector-path shape, clipping design content to the silhouette both on
 * screen and at export.
 *
 * Nothing here touches the editor UI, so the same functions run in a headless
 * engine — for a server-side render or a batch job. The `ProductBackdrop`
 * plugin wraps them as `product.*` actions.
 */

import type { CreativeEngine } from '@cesdk/cesdk-js';

import type { BackdropConfig, SceneDesignUnit, Source } from '../types';

// ─── Constants ────────────────────────────────────────────────────────────────

/** Block-kind tag used to identify backdrop graphic blocks in the scene. */
export const BACKDROP_BLOCK_KIND = 'backdrop_image';

/** Metadata key under which each page stores its backdrop config. */
export const BACKDROP_CONFIG_METADATA_KEY = 'backdrop_config';

// ─── Input Types ──────────────────────────────────────────────────────────────

export interface SetupSceneArea {
  id: string;
  pageSize: { width: number; height: number };
  mockup?: {
    images?: Source[];
    printableAreaPx: { x: number; y: number; width: number; height: number };
    /**
     * Optional SVG path (`d` attribute) defining a non-rectangular printable
     * silhouette. Coordinates are expected in the `printableAreaPx` box:
     * `(0, 0)` to `(printableAreaPx.width, printableAreaPx.height)`.
     */
    pageShape?: string;
  };
}

export interface SetupSceneOptions {
  areas: SetupSceneArea[];
  designUnit: SceneDesignUnit;
  /** Replaces `{{key}}` tokens in mockup image URIs with the given values. */
  variables?: Record<string, string>;
}

// ─── Geometry and variables ───────────────────────────────────────────────────

/**
 * Size and offset of the backdrop block so that the mockup's printable area
 * lands exactly on the page rect.
 *
 * @param pageWidth - Page width in the scene's design unit
 * @param config - Backdrop images plus the printable area in image pixels
 * @returns The backdrop's width, height, x and y in the scene's design unit
 */
export function calculateBlockLayout(
  pageWidth: number,
  config: BackdropConfig
) {
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

/**
 * Substitute `{{key}}` tokens in every image URI.
 *
 * @param images - The mockup images, left unmodified
 * @param variables - Token name to value, for example `{ color: 'black' }`
 * @returns New sources with the tokens replaced
 */
export function applyVariables(
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

// ─── Blocks ───────────────────────────────────────────────────────────────────

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

// ─── Scene ────────────────────────────────────────────────────────────────────

/**
 * Create or update one page and one hidden backdrop per area.
 *
 * Pages are matched by `area.id`, so re-running this for another product keeps
 * the design content already placed on a page of the same name. Pages from
 * previous products that are not part of the current area list are kept alive
 * so their content survives product switches.
 *
 * @param engine - The engine holding the scene, created here when absent
 * @param options - Areas, the scene design unit and the backdrop variables
 */
export function setupScene(
  engine: CreativeEngine,
  options: SetupSceneOptions
): void {
  const { areas, designUnit, variables } = options;

  if (engine.scene.get() == null) engine.scene.create('Free');

  engine.scene.setDesignUnit(designUnit);

  areas.forEach((area) => {
    const existing = engine.block.findByName(area.id);
    const page = existing.length ? existing[0] : createPage(engine);
    setupPage(engine, page, area);
    applyPageShape(
      engine,
      page,
      area.mockup?.pageShape
        ? { path: area.mockup.pageShape, size: area.mockup.printableAreaPx }
        : undefined
    );
  });

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

/**
 * Swap the backdrop images of every area by substituting `{{key}}` tokens in
 * each image URI. Geometry and crop are left untouched.
 *
 * @param engine - The engine holding the scene
 * @param variables - Token name to value, for example `{ color: 'black' }`
 * @param areas - The areas whose backdrops should be updated
 */
export function applyBackdropVariables(
  engine: CreativeEngine,
  variables: Record<string, string>,
  areas: SetupSceneArea[]
): void {
  for (const area of areas) {
    if (!area.mockup?.images) continue;
    const images = applyVariables(area.mockup.images, variables);
    const block = engine.block.findByName(`Backdrop-${area.id}`)[0];
    if (block == null || !images.length) continue;
    const fill = engine.block.getFill(block)!;
    engine.block.setSourceSet(fill, 'fill/image/sourceSet', images);
  }
}

import type CreativeEngine from '@cesdk/engine';
import type {
  AssetQueryData,
  CompleteAssetResult,
  RGBAColor,
  Typeface
} from '@cesdk/engine';
import { ASSET_SOURCES, FONT_SUBSET } from './constants';

// ---------------------------------------------------------------------------
// Color helpers
// ---------------------------------------------------------------------------

// Convert a hex color string to an RGBA color object
export function hexToRgba(hex: string): RGBAColor {
  if (hex.length === 2) {
    hex = hex.replace(/#([0-9a-fA-F])/g, '#$1$1$1$1$1$1');
  }
  if (hex.length === 4) {
    hex = hex.replace(
      /#([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])/g,
      '#$1$1$2$2$3$3'
    );
  }
  const alphaHex = hex.length === 9 ? hex.slice(7, 9) : 'FF';

  if (![7, 9].includes(hex.length)) {
    throw new Error(
      'hexToRgba expects a hex string of length 7 (including #).' + hex
    );
  }

  const color = {
    r: parseInt(hex.slice(1, 3), 16) / 255,
    g: parseInt(hex.slice(3, 5), 16) / 255,
    b: parseInt(hex.slice(5, 7), 16) / 255,
    a: parseInt(alphaHex, 16) / 255 // Assuming the alpha channel is always fully opaque for hex colors
  };
  return color;
}

// Convert an RGBA color object to a hex color string
export function rgbaToHex({ r, g, b, a }: RGBAColor): string {
  const to255Int = (value: number) => Math.round(value * 255);
  r = to255Int(r);
  g = to255Int(g);
  b = to255Int(b);
  a = to255Int(a);

  const toHex = (value: number) => value.toString(16).padStart(2, '0');

  // Convert values to a hex string, including alpha
  return `#${toHex(r)}${toHex(g)}${toHex(b)}${toHex(a)}`;
}

const PRECISION = 0.001;

export const isColorEqual = (
  colorA: RGBAColor,
  colorB: RGBAColor,
  precision = PRECISION
) => {
  return (
    Math.abs(colorB.r - colorA.r) < precision &&
    Math.abs(colorB.g - colorA.g) < precision &&
    Math.abs(colorB.b - colorA.b) < precision &&
    Math.abs(colorB.a - colorA.a) < precision
  );
};

// ---------------------------------------------------------------------------
// Engine helpers
// ---------------------------------------------------------------------------

export const zoomToSelectedText = async (
  engine: CreativeEngine,
  paddingTop: number = 0,
  paddingBottom: number = 0
): Promise<void> => {
  // `engine.element` and `window.visualViewport` can be absent in non-browser
  // environments (e.g. server-side rendering or certain test setups).
  if (!engine.element || !window.visualViewport) return;
  const canvasBounding = engine.element.getBoundingClientRect();
  const canvasHeight = canvasBounding.height * window.devicePixelRatio;
  const overlapBottom = Math.max(
    (canvasBounding.top +
      canvasBounding.height -
      window.visualViewport.height) *
      window.devicePixelRatio,
    0
  );
  const selectedTexts = engine.block.findAllSelected();
  if (selectedTexts.length === 1) {
    const cursorPosY = engine.editor.getTextCursorPositionInScreenSpaceY();
    // The first cursorPosY is 0 if no cursor has been laid out yet. Then we ignore zoom commands.
    const cursorPosIsValid = cursorPosY !== 0;
    if (!cursorPosIsValid) {
      return;
    }
    const visiblePageAreaY = canvasHeight - overlapBottom - paddingBottom;
    const camera = engine.block.findByType('camera')[0];

    const cursorPosYCanvas =
      pixelToCanvasUnit(
        engine,
        engine.editor.getTextCursorPositionInScreenSpaceY()
      ) +
      engine.block.getPositionY(camera) -
      pixelToCanvasUnit(engine, visiblePageAreaY);
    if (
      cursorPosY > visiblePageAreaY ||
      cursorPosY < paddingTop * window.devicePixelRatio
    ) {
      engine.block.setPositionY(camera, cursorPosYCanvas);
    }
  }
};

export const pixelToCanvasUnit = (
  engine: CreativeEngine,
  pixel: number
): number => {
  // engine.scene.get() returns null when no scene is loaded. This function is
  // only called inside zoomToSelectedText, which is guarded by the caller
  // checking that the scene exists and selected text is present. Early-return
  // with 0 is safe because the calling code discards the result when not in
  // text-edit mode.
  const sceneId = engine.scene.get();
  if (sceneId === null) return 0;
  const sceneUnit = engine.block.getEnum(sceneId, 'scene/designUnit');
  let densityFactor = 1;
  if (sceneUnit === 'Millimeter') {
    densityFactor = engine.block.getFloat(sceneId, 'scene/dpi') / 25.4;
  }
  if (sceneUnit === 'Inch') {
    densityFactor = engine.block.getFloat(sceneId, 'scene/dpi');
  }
  return (
    pixel /
    (window.devicePixelRatio * densityFactor * engine.scene.getZoomLevel())
  );
};

interface AutoPlaceConfig {
  basePosX: number;
  basePosY: number;
  randomPosX: number;
  randomPosY: number;
}

// Appends a block into the scene and positions it somewhat randomly.
export const autoPlaceBlockOnPage = (
  engine: CreativeEngine,
  page: number,
  block: number,
  config: AutoPlaceConfig = {
    basePosX: 0.25,
    basePosY: 0.25,
    randomPosX: 0.05,
    randomPosY: 0.05
  }
): void => {
  engine.block
    .findAllSelected()
    .forEach((blockId) => engine.block.setSelected(blockId, false));
  engine.block.appendChild(page, block);

  const pageWidth = engine.block.getWidth(page);
  const posX =
    pageWidth * (config.basePosX + Math.random() * config.randomPosX);
  engine.block.setPositionXMode(block, 'Absolute');
  engine.block.setPositionX(block, posX);

  const pageHeight = engine.block.getHeight(page);
  const posY =
    pageHeight * (config.basePosY + Math.random() * config.randomPosY);
  engine.block.setPositionYMode(block, 'Absolute');
  engine.block.setPositionY(block, posY);

  engine.block.setSelected(block, true);
  engine.editor.addUndoStep();
};

export function getImageSize(
  url: string
): Promise<{ width: number; height: number }> {
  const img = document.createElement('img');

  const promise = new Promise<{ width: number; height: number }>(
    (resolve, reject) => {
      img.onload = () => {
        // Natural size is the actual image size regardless of rendering.
        // The 'normal' `width`/`height` are for the **rendered** size.
        const width = img.naturalWidth;
        const height = img.naturalHeight;

        // Resolve promise with the width and height
        resolve({ width, height });
      };

      // Reject promise on error
      img.onerror = reject;
    }
  );

  // Setting the source makes it start downloading and eventually call `onload`
  img.src = url;

  return promise;
}

/** Trigger a browser download of a blob. */
export function downloadBlob(data: Blob, filename: string): void {
  const url = window.URL.createObjectURL(data);
  const element = document.createElement('a');
  element.setAttribute('href', url);
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
  // Revoke on the next tick so the browser has started the download.
  setTimeout(() => window.URL.revokeObjectURL(url), 0);
}

// ---------------------------------------------------------------------------
// Read-only queries against the engine's asset sources and selection
// ---------------------------------------------------------------------------

const ASSET_PAGE_SIZE = 100;

// findAssets is paginated; page through until the SDK reports no next page.
export async function findAllAssets(
  engine: CreativeEngine,
  sourceId: string,
  query: Partial<AssetQueryData> = {}
): Promise<CompleteAssetResult[]> {
  const all: CompleteAssetResult[] = [];
  let page = 0;
  for (;;) {
    const result = await engine.asset.findAssets(sourceId, {
      ...query,
      page,
      perPage: ASSET_PAGE_SIZE
    });
    all.push(...result.assets);
    if (result.nextPage === undefined) break;
    page = result.nextPage;
  }
  return all;
}

export function findShapes(
  engine: CreativeEngine
): Promise<CompleteAssetResult[]> {
  return findAllAssets(engine, ASSET_SOURCES.shape);
}

export function findStickers(
  engine: CreativeEngine,
  groups?: string[]
): Promise<CompleteAssetResult[]> {
  // Filter by group in the query (e.g. ['emoticons']) instead of fetching all
  // stickers and discarding the rest.
  return findAllAssets(engine, ASSET_SOURCES.sticker, groups ? { groups } : {});
}

export async function findTypefaces(
  engine: CreativeEngine,
  subset: readonly string[] = FONT_SUBSET
): Promise<Typeface[]> {
  const assets = await findAllAssets(engine, ASSET_SOURCES.typeface);
  return assets
    .map((asset) => asset.payload?.typeface)
    .filter(
      (typeface): typeface is Typeface =>
        typeface != null && subset.includes(typeface.name)
    );
}

export async function findImageAssets(
  engine: CreativeEngine,
  keyword?: string
): Promise<CompleteAssetResult[]> {
  const uploads = await findAllAssets(engine, ASSET_SOURCES.imageUpload);

  const hasUnsplash = engine.asset
    .findAllSources()
    .includes(ASSET_SOURCES.unsplash);

  let unsplashAssets: CompleteAssetResult[] = [];
  if (hasUnsplash) {
    // Unsplash is a remote, query-driven source: show the top matches for the
    // template keyword rather than paging the entire (effectively infinite) set.
    const unsplash = await engine.asset.findAssets(ASSET_SOURCES.unsplash, {
      page: 0,
      perPage: 10,
      query: keyword
    });
    unsplashAssets = unsplash.assets;
  }

  return [...uploads.reverse(), ...unsplashAssets];
}

/**
 * Read the typeface of the first selected block.
 * Returns undefined for new text blocks that have no typeface yet
 * (getTypeface throws in that case).
 */
export function getSelectedTypeface(
  engine: CreativeEngine
): Typeface | undefined {
  const [block] = engine.block.findAllSelected();
  if (block == null) return undefined;
  try {
    return engine.block.getTypeface(block);
  } catch {
    return undefined;
  }
}

/** Whether every block in the selection may be destroyed by the current role. */
export function canDeleteSelection(
  engine: CreativeEngine,
  selection: number[]
): boolean {
  return selection.every((block) =>
    engine.block.isAllowedByScope(block, 'lifecycle/destroy')
  );
}

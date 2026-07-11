/**
 * Image Colors Asset Source
 *
 * Engine-native port of the `ImageColorsAssetSource` core plugin. Provides a
 * dynamic color palette extracted from the dominant colors of every image
 * block currently in the scene. All editor/UI (`cesdk`) coupling from the
 * original plugin has been dropped; this is a plain `engine.asset.addSource`
 * source built only on `@cesdk/engine`.
 */

import type CreativeEngine from '@cesdk/engine';
import type {
  AssetColor,
  AssetQueryData,
  AssetResult,
  AssetSource,
  AssetsQueryResult,
  DesignBlockId
} from '@cesdk/engine';

export const IMAGE_COLORS_SOURCE_ID = 'ly.img.colors.imageColors';

const IMAGE_FILL_TYPE = '//ly.img.ubq/fill/image';
const DOMINANT_COLORS_PER_IMAGE = 5;
const DEDUPE_PRECISION = 3;

// `getGroups()` and `findAssets()` fire within the same panel-open tick; the
// short TTL collapses N+1 scene traversals into one without spanning user edits.
const PALETTE_CACHE_TTL_MS = 250;

/**
 * Creates an asset source that surfaces the dominant colors of the scene's
 * image blocks. Register it via `engine.asset.addSource(...)`.
 */
export function createImageColorsSource(engine: CreativeEngine): AssetSource {
  return {
    id: IMAGE_COLORS_SOURCE_ID,
    findAssets: (query) => findAssets(engine, query),
    getGroups: () => getGroups(engine)
  };
}

async function findAssets(
  engine: CreativeEngine,
  query: AssetQueryData
): Promise<AssetsQueryResult<AssetResult>> {
  const requestedGroups = normalizeGroupFilter(query?.groups);
  const queryWords = parseQueryWords(query?.query);
  const palette = await getSharedPalette(engine);
  const assets = palette
    .filter(({ group }) =>
      requestedGroups == null ? true : requestedGroups.has(group)
    )
    .flatMap(({ assets: groupAssets }) => groupAssets)
    .filter((asset) => assetMatchesQuery(asset, queryWords));
  return {
    assets,
    total: assets.length,
    currentPage: 0,
    nextPage: undefined
  };
}

async function getGroups(engine: CreativeEngine): Promise<string[]> {
  const palette = await getSharedPalette(engine);
  return palette.map(({ group }) => group);
}

function hasImageFill(engine: CreativeEngine, block: DesignBlockId): boolean {
  try {
    if (!engine.block.hasFill(block) || !engine.block.isFillEnabled(block)) {
      return false;
    }
    const fill = engine.block.getFill(block);
    return engine.block.getType(fill) === IMAGE_FILL_TYPE;
  } catch {
    return false;
  }
}

function readImageIdentity(
  engine: CreativeEngine,
  block: DesignBlockId
): string | null {
  let fill: DesignBlockId;
  try {
    fill = engine.block.getFill(block);
  } catch {
    return null;
  }

  try {
    const uri = engine.block.getString(fill, 'fill/image/imageFileURI');
    if (uri.length > 0) return `uri:${uri}`;
  } catch {}

  try {
    const sources = engine.block.getSourceSet(fill, 'fill/image/sourceSet');
    const joined = sources
      .map((s) => s.uri)
      .filter((uri) => uri.length > 0)
      .sort()
      .join('|');
    if (joined.length > 0) return `set:${joined}`;
  } catch {}

  try {
    const ref = engine.block.getString(fill, 'fill/image/externalReference');
    if (ref.length > 0) return `ref:${ref}`;
  } catch {}

  return null;
}

interface ImagePaletteEntry {
  group: string;
  assets: AssetResult[];
}

interface PaletteCacheEntry {
  palette: Promise<ImagePaletteEntry[]>;
  createdAt: number;
}

const paletteCache = new WeakMap<CreativeEngine, PaletteCacheEntry>();

function getSharedPalette(
  engine: CreativeEngine
): Promise<ImagePaletteEntry[]> {
  const existing = paletteCache.get(engine);
  const now = Date.now();
  if (existing != null && now - existing.createdAt < PALETTE_CACHE_TTL_MS) {
    return existing.palette;
  }
  const palette = collectBlockPalette(engine);
  paletteCache.set(engine, { palette, createdAt: now });
  return palette;
}

async function collectBlockPalette(
  engine: CreativeEngine
): Promise<ImagePaletteEntry[]> {
  const graphicBlocks = engine.block.findByType('graphic');
  const labelCounts = new Map<string, number>();
  // Kept separate so `Image N` numbering stays sequential regardless of how
  // many named blocks precede each unnamed one.
  const unnamedCounter = { count: 0 };
  const palette: ImagePaletteEntry[] = [];
  const seenImageIdentities = new Set<string>();

  for (const block of graphicBlocks) {
    if (!hasImageFill(engine, block)) continue;

    const identity = readImageIdentity(engine, block);
    if (identity != null) {
      if (seenImageIdentities.has(identity)) continue;
      seenImageIdentities.add(identity);
    }

    const blockAssets: AssetResult[] = [];
    const seen = new Set<string>();
    const group = makeGroupName(engine, block, labelCounts, unnamedCounter);

    try {
      const dominant = await engine.block.getDominantColors(block, {
        count: DOMINANT_COLORS_PER_IMAGE,
        ignoreWhite: true
      });
      for (const { r, g, b } of dominant) {
        addColorAsset(
          blockAssets,
          seen,
          { colorSpace: 'sRGB', r, g, b },
          group
        );
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn(
        `[ImageColors] Failed to extract colors from block ${block}:`,
        error
      );
    }

    if (blockAssets.length > 0) {
      palette.push({ group, assets: blockAssets });
    }
  }

  return palette;
}

function makeGroupName(
  engine: CreativeEngine,
  block: DesignBlockId,
  labelCounts: Map<string, number>,
  unnamedCounter: { count: number }
): string {
  const named = readBlockLabel(engine, block);
  const base = named ?? `Image ${++unnamedCounter.count}`;
  const seen = labelCounts.get(base) ?? 0;
  labelCounts.set(base, seen + 1);
  return seen === 0 ? base : `${base} (${seen + 1})`;
}

function readBlockLabel(
  engine: CreativeEngine,
  block: DesignBlockId
): string | null {
  try {
    const name = engine.block.getName(block);
    if (name && name.trim().length > 0) return name.trim();
  } catch {}
  try {
    const fallback = engine.block.getMetadata(block, 'fallback-name');
    if (fallback && fallback.trim().length > 0) return fallback.trim();
  } catch {}
  return null;
}

function addColorAsset(
  collected: AssetResult[],
  seen: Set<string>,
  assetColor: AssetColor,
  group: string
): void {
  const key = dedupeKey(assetColor);
  if (seen.has(key)) return;
  seen.add(key);
  collected.push({
    id: `${IMAGE_COLORS_SOURCE_ID}.${encodeURIComponent(group)}.${key}`,
    payload: { color: assetColor },
    groups: [group]
  });
}

function dedupeKey(color: AssetColor): string {
  switch (color.colorSpace) {
    case 'sRGB':
      return `rgb:${color.r.toFixed(DEDUPE_PRECISION)},${color.g.toFixed(
        DEDUPE_PRECISION
      )},${color.b.toFixed(DEDUPE_PRECISION)}`;
    case 'CMYK':
      return `cmyk:${color.c.toFixed(DEDUPE_PRECISION)},${color.m.toFixed(
        DEDUPE_PRECISION
      )},${color.y.toFixed(DEDUPE_PRECISION)},${color.k.toFixed(
        DEDUPE_PRECISION
      )}`;
    case 'SpotColor':
      return `spot:${color.name} ${color.externalReference}`;
    default: {
      const _exhaustive: never = color;
      return `unknown:${(_exhaustive as AssetColor).colorSpace}`;
    }
  }
}

function normalizeGroupFilter(
  groups: string | string[] | undefined
): Set<string> | null {
  if (groups == null) return null;
  const arr = Array.isArray(groups) ? groups : [groups];
  if (arr.length === 0) return null;
  return new Set(arr);
}

function parseQueryWords(query: string | undefined): string[] {
  if (query == null) return [];
  const matches = query.toLowerCase().match(/\w+/g);
  return matches ?? [];
}

function assetMatchesQuery(asset: AssetResult, queryWords: string[]): boolean {
  if (queryWords.length === 0) return true;
  const tokens = getSearchTokens(asset);
  return queryWords.every((word) =>
    tokens.some((token) => token.includes(word))
  );
}

function getSearchTokens(asset: AssetResult): string[] {
  const tokens: string[] = [];
  const color = asset.payload?.color;
  if (color != null) {
    switch (color.colorSpace) {
      case 'sRGB': {
        const hex = rgbToHexLower(color.r, color.g, color.b);
        tokens.push(hex, hex.slice(1));
        break;
      }
      case 'CMYK': {
        tokens.push(
          'c',
          String(Math.round(color.c * 100)),
          'm',
          String(Math.round(color.m * 100)),
          'y',
          String(Math.round(color.y * 100)),
          'k',
          String(Math.round(color.k * 100))
        );
        break;
      }
      case 'SpotColor': {
        tokens.push(color.name.toLowerCase());
        break;
      }
      default:
        break;
    }
  }
  for (const group of asset.groups ?? []) {
    const matches = group.toLowerCase().match(/\w+/g);
    if (matches != null) tokens.push(...matches);
  }
  return tokens;
}

function rgbToHexLower(r: number, g: number, b: number): string {
  const toHex = (v: number) =>
    Math.round(Math.max(0, Math.min(1, v)) * 255)
      .toString(16)
      .padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export default createImageColorsSource;

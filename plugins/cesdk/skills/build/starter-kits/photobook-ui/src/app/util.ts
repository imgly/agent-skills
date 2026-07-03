/**
 * Convert a relative path to an absolute URL for CE.SDK engine.
 * The engine requires full URLs for loading assets.
 * Uses BASE_URL for nested deployment support.
 */
export const caseAssetPath = (path: string): string => {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  return new URL(import.meta.env.BASE_URL + path.slice(1), window.location.href)
    .href;
};

// Alias for compatibility
export const assetPath = caseAssetPath;

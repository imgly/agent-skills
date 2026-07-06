/**
 * Convert a relative path to an absolute URL for CE.SDK engine.
 * The engine requires full URLs for loading assets.
 */
export const caseAssetPath = (path: string): string => {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
  return new URL(
    import.meta.env.BASE_URL + normalizedPath,
    window.location.href
  ).href;
};

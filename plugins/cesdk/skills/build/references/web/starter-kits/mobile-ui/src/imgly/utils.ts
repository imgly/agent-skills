/**
 * Asset path utility for loading scene files and other resources.
 * Returns absolute URLs for the engine (which requires full URLs with origin).
 * Uses import.meta.env.BASE_URL which is set by Vite during build based on --base flag.
 */
export const caseAssetPath = (path: string): string => {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  return new URL(import.meta.env.BASE_URL + path.slice(1), window.location.href)
    .href;
};

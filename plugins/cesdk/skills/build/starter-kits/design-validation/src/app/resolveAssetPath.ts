/**
 * Resolves root-relative asset paths for the current deployment context.
 * Handles nested deployments where BASE_URL may be '/feature-branch/app/'.
 *
 * @param path - Root-relative path starting with '/' (e.g., '/images/photo.png')
 * @returns Absolute URL that works in current deployment context
 */
export function resolveAssetPath(path: string): string {
  // Pass through non-root-relative paths unchanged
  if (!path.startsWith('/')) {
    return path;
  }

  // Combine BASE_URL with the path (removing leading slash to avoid double slashes)
  // BASE_URL always ends with '/' in Vite
  return new URL(import.meta.env.BASE_URL + path.slice(1), window.location.href)
    .href;
}

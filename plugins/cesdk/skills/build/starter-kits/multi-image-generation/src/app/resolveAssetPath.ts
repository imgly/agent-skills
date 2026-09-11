/**
 * Multi-Image Generation App - Utility Functions
 *
 * App-layer utilities for path resolution and environment handling.
 */

/**
 * Resolve an asset path to an absolute URL.
 *
 * Handles root-relative paths (e.g., `/images/photo.png`) by prepending
 * the app's base URL, which respects Vite's `base` configuration for
 * deployments under nested paths.
 *
 * @param path - Asset path (root-relative or absolute URL)
 * @returns Absolute URL that works in any deployment context
 */
export function resolveAssetPath(path: string): string {
  if (!path.startsWith('/')) {
    // Already absolute URL or relative path - return as-is
    return path;
  }
  // Combine BASE_URL with the path (removing leading slash to avoid double slashes)
  // import.meta.env.BASE_URL always ends with '/' in Vite
  return new URL(import.meta.env.BASE_URL + path.slice(1), window.location.href)
    .href;
}

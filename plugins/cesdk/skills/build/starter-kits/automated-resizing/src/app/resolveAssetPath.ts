/**
 * Resolves asset paths for the current deployment context.
 * Handles nested deployments where BASE_URL may be '/feature-branch/app/'.
 *
 * This is an app-layer utility - library code should remain environment-agnostic
 * and receive already-resolved URLs.
 *
 * @param path - Relative path to asset (e.g., 'example-1.png', 'icons/edit.svg')
 * @returns Absolute URL that works in current deployment context
 */
export function resolveAssetPath(path: string): string {
  // Pass through absolute URLs (including blob: and data:) unchanged
  if (/^(https?:|blob:|data:)/.test(path)) {
    return path;
  }

  // BASE_URL always ends with '/' in Vite
  const baseUrl = import.meta.env.BASE_URL || '/';

  // Combine BASE_URL with the path
  return new URL(baseUrl + path, window.location.href).href;
}

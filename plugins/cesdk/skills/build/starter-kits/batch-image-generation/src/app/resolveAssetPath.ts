/**
 * Asset Path Resolution for Nested Deployments
 *
 * Resolves root-relative asset paths for the current deployment context.
 * Handles nested deployments where BASE_URL may be '/feature-branch/app/'.
 */

/**
 * Resolves root-relative asset paths for the current deployment context.
 * Handles nested deployments where BASE_URL may be '/feature-branch/app/'.
 *
 * @param path - Root-relative path starting with '/' (e.g., '/images/photo.png')
 *               or relative path starting with './' (e.g., './images/photo.png')
 * @returns Absolute URL that works in current deployment context
 */
export function resolveAssetPath(path: string): string {
  // Pass through non-root-relative and non-relative paths unchanged
  if (!path.startsWith('/') && !path.startsWith('./')) {
    return path;
  }

  // Normalize relative paths by removing leading './'
  const normalizedPath = path.startsWith('./') ? path.slice(2) : path.slice(1);

  // Combine BASE_URL with the path
  return new URL(
    import.meta.env.BASE_URL + normalizedPath,
    window.location.href
  ).href;
}

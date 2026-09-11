/**
 * App-layer utilities for the Automated Resizing demo.
 *
 * This module consolidates all utility functions including:
 * - Asset path resolution (environment-aware)
 * - Size preset helpers
 * - Platform icon mapping
 * - Download utilities
 */

import type { SizePreset } from '../imgly/types';
import { resolveAssetPath } from './resolveAssetPath';

// Re-export resolveAssetPath for convenience
export { resolveAssetPath } from './resolveAssetPath';

// ============================================================================
// Scene URL Resolution
// ============================================================================

/**
 * Resolve a scene URL from a relative path.
 * Uses the app-layer resolveAssetPath for proper deployment context handling.
 */
export function resolveSceneUrl(relativePath: string): string {
  return resolveAssetPath(relativePath);
}

// ============================================================================
// Size Preset Utilities
// ============================================================================

/**
 * Get a subset of sizes by platform.
 *
 * @param platforms - Array of platform identifiers to filter by
 * @param sizes - Array of sizes to filter
 * @returns Filtered array of size presets
 *
 * @example
 * ```typescript
 * const instagramSizes = getSizesByPlatform(['instagram'], DEFAULT_SIZES);
 * ```
 */
export function getSizesByPlatform(
  platforms: SizePreset['platform'][],
  sizes: SizePreset[]
): SizePreset[] {
  return sizes.filter((size) => platforms.includes(size.platform));
}

/**
 * Get a single size by ID.
 *
 * @param id - The size ID to find
 * @param sizes - Array of sizes to search
 * @returns The matching size preset, or undefined if not found
 */
export function getSizeById(
  id: string,
  sizes: SizePreset[]
): SizePreset | undefined {
  return sizes.find((size) => size.id === id);
}

// ============================================================================
// Platform Icon Utilities
// ============================================================================

/**
 * Platform icon filename mapping.
 */
const PLATFORM_ICON_MAP: Record<SizePreset['platform'], string> = {
  instagram: 'instagram.svg',
  x: 'x.svg',
  facebook: 'facebook.svg',
  linkedin: 'linkedin.svg',
  youtube: 'youtube.svg',
  custom: 'custom.svg'
};

/**
 * Get the icon filename for a platform.
 *
 * @param platform - The platform identifier
 * @returns Raw filename (e.g., 'instagram.svg')
 */
export function getPlatformIconFilename(
  platform: SizePreset['platform']
): string {
  return PLATFORM_ICON_MAP[platform] || 'custom.svg';
}

// ============================================================================
// Download Utilities
// ============================================================================

/**
 * Download a file from a URL (blob URL or data URL).
 *
 * Creates a temporary anchor element to trigger a browser download.
 * This approach is compatible with all modern browsers.
 */
export function downloadFromUrl(url: string, filename: string): void {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

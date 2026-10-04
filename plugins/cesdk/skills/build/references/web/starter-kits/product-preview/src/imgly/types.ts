/**
 * CE.SDK Mockup Utilities - Type Definitions
 */

import type CreativeEngine from '@cesdk/engine';

// ============================================================================
// Engine Configuration
// ============================================================================

/**
 * Configuration for initializing a headless CreativeEngine instance.
 */
export interface HeadlessEngineConfig {
  license?: string;
  userId?: string;
  baseURL?: string;
}

// ============================================================================
// Render Configuration
// ============================================================================

/**
 * Scene source for mockup rendering - either a URL or a scene string.
 */
export type SceneSource = string | { sceneString: string };

/**
 * Placeholder mapping - placeholder name to image source.
 * Values can be Blob objects or URL strings.
 */
export type Placeholders = Record<string, Blob | string>;

/**
 * Options for renderMockup function.
 */
export interface RenderMockupOptions {
  /** MIME type for mockup export (default: 'image/jpeg') */
  exportMimeType?: 'image/jpeg' | 'image/png';
}

// ============================================================================
// Render Results
// ============================================================================

/**
 * Result of rendering a mockup.
 */
export interface RenderResult {
  /** URL of the rendered mockup image (blob URL) */
  mockupUrl: string;
  /** Serialized mockup scene string (for subsequent edits) */
  sceneString: string;
  /** Blob URLs created during rendering (caller must revoke when done) */
  blobUrls: string[];
}

// ============================================================================
// Public API Types
// ============================================================================

/**
 * The renderMockup function signature.
 */
export type RenderMockupFn = (
  engine: CreativeEngine,
  sceneSource: SceneSource,
  placeholders: Placeholders,
  options?: RenderMockupOptions
) => Promise<RenderResult>;

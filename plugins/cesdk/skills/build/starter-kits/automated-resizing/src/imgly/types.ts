/**
 * Type definitions for the Automated Resizing module
 *
 * This file consolidates all type definitions for the imgly module,
 * making it self-contained and reusable.
 */

import type { CreativeEngine, ExportOptions } from '@cesdk/cesdk-js';

// ============================================================================
// Configuration Types
// ============================================================================

/**
 * Application configuration passed to CE.SDK
 */
export interface AppConfig {
  /** License key for production use */
  license?: string;
  /** Base URL for CE.SDK assets */
  baseURL?: string;
}

// ============================================================================
// Size Types
// ============================================================================

/**
 * Represents a social media size preset for content-aware resizing.
 */
export interface SizePreset {
  /** Unique identifier for this size */
  id: string;
  /** Display label */
  label: string;
  /** Width in design units (pixels) */
  width: number;
  /** Height in design units (pixels) */
  height: number;
  /** Design unit for the dimensions */
  designUnit: 'Pixel' | 'Millimeter' | 'Inch';
  /** Platform identifier for grouping/filtering */
  platform: 'instagram' | 'x' | 'facebook' | 'linkedin' | 'youtube' | 'custom';
}

// ============================================================================
// Template Types
// ============================================================================

/**
 * Template data structure for source designs.
 */
export interface Template {
  /** Unique identifier */
  id: string;
  /** Scene string (if loaded/edited) */
  sceneString?: string;
  /** URL to load the scene from */
  sceneUrl: string;
  /** Preview image path */
  previewImagePath: string;
}

// ============================================================================
// Resize API Types
// ============================================================================

/**
 * Options for the resize() function.
 */
export interface ResizeOptions {
  /** The CreativeEngine instance to use */
  engine: CreativeEngine;
  /** Array of size presets to generate */
  sizes: SizePreset[];
  /** Scene string to resize */
  scene: string;
  /** Export options (mimeType, quality, etc.) - uses CE.SDK's ExportOptions */
  exportOptions?: ExportOptions;
  /** Callback called after each variant is generated */
  onProgress?: (completed: number, total: number, variant: VariantBlob) => void;
}

/**
 * Result of generating a single variant.
 * Contains the blob (not URL) - caller handles URL creation.
 */
export interface VariantBlob {
  /** The size preset used for this variant */
  size: SizePreset;
  /** The exported image as a Blob */
  blob: Blob;
  /** The scene string for this variant (can be loaded later for editing) */
  sceneString: string;
}

// ============================================================================
// App State Types (for demo app)
// ============================================================================

/**
 * Generated variant image data for rendering in the UI.
 * The app creates this from VariantBlob by adding the URL.
 */
export interface VariantImage {
  /** The size preset */
  size: SizePreset;
  /** Object URL for the image (null if not yet generated) */
  src: string | null;
  /** Scene string for editing */
  sceneString: string | null;
  /** Loading state */
  isLoading: boolean;
}

/**
 * Design Validation Types
 *
 * Type definitions for the validation module.
 */

// ============================================================================
// Validation Types
// ============================================================================

export type ValidationState = 'success' | 'warning' | 'failed';

export interface BlockValidationResult {
  blockId: number;
  state: ValidationState;
  blockType: string;
}

// ============================================================================
// Internal Types
// ============================================================================

export type BoundingBox = [number, number, number, number];

/** An image's own pixel resolution. */
export interface ImageSize {
  width: number;
  height: number;
}

/** Reads the resolution of the image behind a URL. */
export type MeasureImage = (url: string) => Promise<ImageSize>;

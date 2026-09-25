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

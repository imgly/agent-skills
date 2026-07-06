/**
 * Content Moderation Types
 */

export type ModerationState = 'success' | 'warning' | 'failed';

export interface ModerationCheckResult {
  name: string;
  description: string;
  state: ModerationState;
}

export interface ImageBlockData {
  blockId: number;
  url: string;
  blockType: string;
  blockName: string | null;
}

export interface ModerationResult
  extends ModerationCheckResult, ImageBlockData {}

/**
 * Demo Constants - Sample Data for AI Editor Starterkit
 *
 * This file contains demo-specific constants for showcasing the AI Editor.
 * In production, replace these with your own assets and scene files.
 *
 * NOTE: These constants are intentionally kept outside the imgly/ folder
 * to separate demo-specific code from reusable configuration code.
 */
import { resolveAssetPath } from './resolveAssetPath';

// ============================================================================
// Scene URLs
// ============================================================================

/**
 * Scene archive URLs for Design and Video modes.
 * These are sample scenes that demonstrate the AI editor capabilities.
 */
export const SCENE_URLS = {
  /** Design mode scene archive URL */
  Design: resolveAssetPath('/assets/ai_editor_design_v3.archive'),
  /** Video mode scene archive URL */
  Video: resolveAssetPath('/assets/ai_editor_video.archive')
} as const;

// ============================================================================
// Default Photo URL
// ============================================================================

/**
 * Default photo for Photo mode.
 * Photo mode creates a scene from an image rather than loading an archive.
 */
export const DEFAULT_PHOTO_URL =
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&dl=dom-hill-nimElTcTNyY-unsplash.jpg&w=1920';

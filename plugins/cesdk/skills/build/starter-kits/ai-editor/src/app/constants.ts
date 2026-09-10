/**
 * Demo Constants - Sample Data for AI Editor Starterkit
 *
 * This file contains demo-specific constants for showcasing the AI Editor.
 * In production, replace these with your own assets and scene files.
 *
 * NOTE: These constants are intentionally kept outside the imgly/ folder
 * to separate demo-specific code from reusable configuration code.
 */
/**
 * Demo assets for this example (scene archives, …) are loaded from the
 * IMG.LY CDN by default. To host them yourself, copy this kit's asset
 * folder to your own CDN or server and change this constant — or set it to
 * `''` and place the files in this app's `public/` directory. No trailing
 * slash.
 */
export const DEMO_ASSETS_BASE_URL: string =
  import.meta.env.VITE_DEMO_ASSETS_BASE_URL ||
  'https://staticimgly.com/imgly/cesdk-web-examples-data/1.82.0/starterkit-ai-editor';

// ============================================================================
// Scene URLs
// ============================================================================

/**
 * Scene URLs for Design and Video modes.
 * These are sample scenes that demonstrate the AI editor capabilities.
 */
export const SCENE_URLS = {
  /** Design mode scene URL */
  Design: `${DEMO_ASSETS_BASE_URL}/assets/ai_editor_design_v3/scene.scene`,
  /** Video mode scene URL */
  Video: `${DEMO_ASSETS_BASE_URL}/assets/ai_editor_video/scene.scene`
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

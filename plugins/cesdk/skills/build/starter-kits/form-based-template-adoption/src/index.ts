/**
 * CE.SDK Form-Based Template Adoption Starterkit - Main Entry Point
 *
 * Demonstrates form-based template editing where users modify template
 * content through structured form controls instead of direct canvas manipulation.
 *
 * Features:
 * - Edit images through file upload controls
 * - Edit text through form inputs
 * - Edit colors across all elements
 * - Simplified UI with hidden dock/inspector
 *
 * @see https://img.ly/docs/cesdk/js/key-capabilities-dbb5b1/
 */

import CreativeEditorSDK, { Configuration } from '@cesdk/cesdk-js';

import { initFormBasedTemplateAdoption } from './imgly';

// START_HIDDEN_BLOCK
import { reportDemoPhase } from '../../shared/demo-preview/lifecycle';
// END_HIDDEN_BLOCK

/**
 * Demo assets for this example (scene archives, …) are loaded from the
 * IMG.LY CDN by default. To host them yourself, copy this kit's asset
 * folder to your own CDN or server and change this constant — or set it to
 * `''` and place the files in this app's `public/` directory. No trailing
 * slash.
 */
export const DEMO_ASSETS_BASE_URL: string =
  import.meta.env.VITE_DEMO_ASSETS_BASE_URL ||
  'https://staticimgly.com/imgly/cesdk-web-examples-data/1.82.0/starterkit-form-based-template-adoption';

// ============================================================================
// Scene URL
// ============================================================================

// highlight-scene-url
const SCENE_URL = `${DEMO_ASSETS_BASE_URL}/cases/form-based-template-adoption/scene/scene.scene`;
// highlight-scene-url

// ============================================================================
// Configuration
// ============================================================================

// highlight-config
const config: Configuration = {
  baseURL: import.meta.env.VITE_IMGLY_LOCAL_ASSETS_URL,
  userId: 'starterkit-form-based-template-adoption-user',

  // IMG.LY CDN (for quick testing only, NOT recommended for production)
  // baseURL: import.meta.env.VITE_IMGLY_LOCAL_ASSETS_URL,

  // Local assets for development

  license: import.meta.env.VITE_CESDK_LICENSE
};
// highlight-config

// ============================================================================
// Initialize Editor
// ============================================================================

// highlight-init
CreativeEditorSDK.create('#cesdk_container', config)
  .then(async (cesdk) => {
    // START_HIDDEN_BLOCK
    reportDemoPhase('created');
    // END_HIDDEN_BLOCK
    // Debug access (remove in production)
    (window as any).cesdk = cesdk;

    // Initialize with form-based template adoption configuration
    await initFormBasedTemplateAdoption(cesdk);

    // Load the template scene
    await cesdk.engine.scene.load(SCENE_URL);
    // START_HIDDEN_BLOCK
    reportDemoPhase('ready');
    // END_HIDDEN_BLOCK
  })
  .catch((error) => {
    // START_HIDDEN_BLOCK
    reportDemoPhase('failed');
    // END_HIDDEN_BLOCK
    // eslint-disable-next-line no-console
    console.error('Failed to initialize CE.SDK:', error);
  });
// highlight-init

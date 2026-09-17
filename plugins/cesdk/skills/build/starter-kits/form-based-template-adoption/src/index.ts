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
import { DEMO_ASSETS_BASE_URL } from './imgly/demo-assets';

// START_HIDDEN_BLOCK
import { reportDemoPhase } from '../../shared/demo-preview/lifecycle';
export { DEMO_ASSETS_BASE_URL };
// END_HIDDEN_BLOCK

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
    // START_HIDDEN_BLOCK
    (window as any).cesdk = cesdk;
    // END_HIDDEN_BLOCK

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

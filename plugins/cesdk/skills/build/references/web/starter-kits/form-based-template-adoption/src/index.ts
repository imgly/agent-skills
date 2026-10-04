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


// ============================================================================
// Scene URL
// ============================================================================

const SCENE_URL = `${DEMO_ASSETS_BASE_URL}/cases/form-based-template-adoption/scene/scene.scene`;

// ============================================================================
// Configuration
// ============================================================================

const config: Configuration = {
  userId: 'starterkit-form-based-template-adoption-user',

  // IMG.LY CDN (for quick testing only, NOT recommended for production)

  // Local assets for development

};

// ============================================================================
// Initialize Editor
// ============================================================================

CreativeEditorSDK.create('#cesdk_container', config)
  .then(async (cesdk) => {

    // Initialize with form-based template adoption configuration
    await initFormBasedTemplateAdoption(cesdk);

    // Load the template scene
    await cesdk.engine.scene.load(SCENE_URL);
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Failed to initialize CE.SDK:', error);
  });

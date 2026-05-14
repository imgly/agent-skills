/**
 * UI Configuration - Minimal View-Only Interface
 *
 * @see https://img.ly/docs/cesdk/js/user-interface/overview-41101a/
 */

import type CreativeEditorSDK from '@cesdk/cesdk-js';

import { setupCanvas } from './canvas';
import { setupComponents } from './components';
import { setupDock } from './dock';
import { setupInspectorBar } from './inspectorBar';
import { setupNavigationBar } from './navigationBar';
import { setupPanels } from './panel';

/**
 * Set up all UI components for the viewer.
 *
 * @param cesdk - The CreativeEditorSDK instance to configure
 */
export function setupUI(cesdk: CreativeEditorSDK): void {
  setupNavigationBar(cesdk); // Navigation bar configuration
  setupCanvas(cesdk); // Canvas bar and context menu
  setupDock(cesdk); // Asset library dock
  setupInspectorBar(cesdk); // Inspector bar for selected elements
  setupPanels(cesdk); // Panel positioning
  setupComponents(cesdk); // Custom UI components
}

// Re-export for selective use
export { setupCanvas };
export { setupComponents };
export { setupDock };
export { setupInspectorBar };
export { setupNavigationBar };
export { setupPanels };

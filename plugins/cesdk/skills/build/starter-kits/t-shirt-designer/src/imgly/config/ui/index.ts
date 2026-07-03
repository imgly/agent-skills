/**
 * UI Configuration - Product Editor
 *
 * This file orchestrates all UI setup for the product editor.
 */

import type CreativeEditorSDK from '@cesdk/cesdk-js';

import { setupCanvas } from './canvas';
import { setupComponents } from './components';
import { setupDock } from './dock';
import { setupInspectorBar } from './inspectorBar';
import { setupNavigationBar } from './navigationBar';
import { setupPanels } from './panel';

/**
 * Configure the complete UI for the product editor.
 *
 * @param cesdk - The CreativeEditorSDK instance to configure
 */
export function setupUI(cesdk: CreativeEditorSDK): void {
  setupPanels(cesdk);
  setupComponents(cesdk);
  setupNavigationBar(cesdk);
  setupCanvas(cesdk);
  setupInspectorBar(cesdk);
  setupDock(cesdk);
}

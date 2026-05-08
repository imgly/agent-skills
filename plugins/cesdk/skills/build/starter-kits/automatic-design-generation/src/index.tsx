/**
 * CE.SDK Automatic Design Generation Starterkit - Main Entry Point
 *
 * A design generation tool that automatically creates social media
 * assets from podcast information using the CE.SDK Engine.
 *
 * Editor configuration is defined here and can be customized as needed.
 * Editor initializations are handled internally by the EditorModal component.
 *
 * @see https://img.ly/docs/cesdk/engine/
 */

import type { Configuration } from '@cesdk/cesdk-js';
import { createRoot } from 'react-dom/client';

import './app/index.css';

import App from './app/App';

// ============================================================================
// CE.SDK Configuration
// ============================================================================

/**
 * Configuration for CE.SDK Engine and Editor
 * This config is shared between the headless engine and the editor UI.
 */
const config: Configuration = {
  baseURL: import.meta.env.VITE_IMGLY_LOCAL_ASSETS_URL,
  userId: 'starterkit-automatic-design-generation-user',
  license: import.meta.env.VITE_CESDK_LICENSE
};

// ============================================================================
// React Application
// ============================================================================

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root container not found');
}

const root = createRoot(container);
root.render(<App config={config} />);

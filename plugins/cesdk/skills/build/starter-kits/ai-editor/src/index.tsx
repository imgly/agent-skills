/**
 * CE.SDK AI Editor Starterkit - React Entry Point
 *
 * An AI-powered design editor with text, image, video, and audio generation capabilities.
 * Features a sidebar panel for selecting AI providers and a mode selector for switching
 * between Design and Video editing modes.
 *
 * @see https://img.ly/docs/cesdk/js/getting-started/
 * @see https://img.ly/docs/cesdk/js/plugins/ai-generation/
 */

import { createRoot } from 'react-dom/client';

import App from './app/App';

// ============================================================================
// Editor Configuration
// ============================================================================

/**
 * CE.SDK configuration passed to the CreativeEditor component.
 *
 * Customize this object to configure the editor for your application.
 *
 * @see https://img.ly/docs/cesdk/js/configuration-2c1c3d/
 */
const editorConfig = {
  baseURL: import.meta.env.VITE_IMGLY_LOCAL_ASSETS_URL,
  userId: 'starterkit-ai-editor-user',
  license: import.meta.env.VITE_CESDK_LICENSE
};

// ============================================================================
// Application Bootstrap
// ============================================================================

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root container not found');
}

const root = createRoot(container);
root.render(<App config={editorConfig} />);

/**
 * CE.SDK Multi-Image Generation Starterkit - React Entry Point
 *
 * This starterkit demonstrates batch image generation using CE.SDK.
 * A headless engine handles batch rendering while the editor provides
 * interactive template editing.
 *
 * @see https://img.ly/docs/cesdk/js/getting-started/
 */

import type { Configuration } from '@cesdk/cesdk-js';
import type CreativeEngine from '@cesdk/engine';
import { createRoot } from 'react-dom/client';

import { initMultiImageGenerationHeadlessEngine } from './imgly';
import App from './app/App';

// ============================================================================
// Configuration
// ============================================================================

const config: Partial<Configuration> = {
  baseURL: import.meta.env.VITE_IMGLY_LOCAL_ASSETS_URL,
  // Unique user identifier for analytics (customize for your app)
  userId: 'starterkit-multi-image-generation-user',

  // Local assets (uncomment and set path for self-hosted assets)
  // baseURL: import.meta.env.VITE_IMGLY_LOCAL_ASSETS_URL,

  license: import.meta.env.VITE_CESDK_LICENSE,

  // Development: use local assets when CESDK_USE_LOCAL is set
  
};

// ============================================================================
// Initialize React Application
// ============================================================================

async function main(): Promise<void> {
  // Initialize headless engine for batch image generation
  const engine = await initMultiImageGenerationHeadlessEngine({
    license: config.license,
    baseURL: config.baseURL
  });

  // Debug access (remove in production)
  (window as unknown as { engine: CreativeEngine }).engine = engine;

  // Render application with initialized instances
  const container = document.getElementById('root');
  if (container == null) {
    throw new Error('Root container not found');
  }

  const root = createRoot(container);
  root.render(<App engine={engine} editorBaseConfig={config} />);
}

main().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Failed to initialize application:', error);
});

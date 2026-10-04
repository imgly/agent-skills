/**
 * CE.SDK Mockup Editor Starterkit - React Entry Point
 *
 * A mockup editor that renders designs on product mockups in real-time.
 */

import type { Configuration } from '@cesdk/cesdk-js';
import { createRoot } from 'react-dom/client';
import App from './app/App';

// ============================================================================
// Configuration
// ============================================================================

const config: Configuration = {
  userId: 'starterkit-3d-product-preview-user',

  // Local assets for development

};

// ============================================================================
// Render
// ============================================================================

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root container not found');
}

const root = createRoot(container);
root.render(<App config={config} />);

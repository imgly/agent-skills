/**
 * CE.SDK Postcard UI Starterkit - Entry Point
 *
 * Custom postcard editor with step-by-step workflow:
 * - Style selection
 * - Design customization
 * - Message writing
 *
 * @see https://img.ly/docs/cesdk/
 */

import { createRoot } from 'react-dom/client';
import App from './app/App';

// ============================================================================
// Configuration
// ============================================================================

const engineConfig = {
  license: import.meta.env.VITE_CESDK_LICENSE,
  featureFlags: {
    preventScrolling: true
  }
};

// ============================================================================
// Application Bootstrap
// ============================================================================

function main(): void {
  const container = document.getElementById('root');
  if (container == null) {
    throw new Error('Root container not found');
  }

  createRoot(container).render(
    <App engineConfig={engineConfig} />
  );
}

main();

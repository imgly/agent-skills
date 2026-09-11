/**
 * CE.SDK Photo UI Starterkit - Entry Point
 *
 * Demonstrates a custom photo editing UI built with CE.SDK.
 * Features crop, filters, adjustments, and a mobile-optimized interface.
 *
 * @see https://img.ly/docs/cesdk/js/getting-started/
 */

import { createRoot } from 'react-dom/client';
import type CreativeEngine from '@cesdk/engine';

import App from './app/App';

// ============================================================================
// Configuration
// ============================================================================

const engineConfig = {
  baseURL: import.meta.env.VITE_IMGLY_LOCAL_ASSETS_URL,
  userId: 'starterkit-photo-ui-user',
  license: import.meta.env.VITE_CESDK_LICENSE,
  featureFlags: {
    preventScrolling: true
  }
};

// ============================================================================
// Application Bootstrap
// ============================================================================

async function main(): Promise<void> {
  // Render application
  const container = document.getElementById('root');
  if (container == null) {
    throw new Error('Root container not found');
  }

  createRoot(container).render(<App engineConfig={engineConfig} />);
}

main().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Failed to initialize application:', error);
});

// Debug access (remove in production)
declare global {
  interface Window {
    cesdk?: CreativeEngine;
  }
}

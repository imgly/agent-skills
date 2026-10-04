/**
 * CE.SDK Photo UI Starterkit - Entry Point
 *
 * Demonstrates a custom photo editing UI built with CE.SDK.
 * Features crop, filters, adjustments, and a mobile-optimized interface.
 *
 * @see https://img.ly/docs/cesdk/js/get-started/overview-e18f40/
 */

import { createRoot } from 'react-dom/client';
import type CreativeEngine from '@cesdk/engine';

import App from './app/App';

// ============================================================================
// Configuration
// ============================================================================

const engineConfig = {
  userId: 'starterkit-photo-ui-user',
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


/**
 * CE.SDK Photobook UI Starterkit - Entry Point
 *
 * A complete custom photobook editor with React.
 * Features multi-page navigation, custom layouts, stickers, and full editing controls.
 *
 * @see https://img.ly/docs/cesdk
 */

import { createRoot } from 'react-dom/client';

import App from './app/App';
import { injectFonts } from './app/fonts';

// ============================================================================
// Configuration
// ============================================================================

const engineConfig = {
  featureFlags: {
    preventScrolling: true
  }
};

// ============================================================================
// Application Bootstrap
// ============================================================================

function main(): void {
  injectFonts();

  const container = document.getElementById('root');
  if (container == null) {
    throw new Error('Root container not found');
  }

  createRoot(container).render(<App engineConfig={engineConfig} />);
}

main();

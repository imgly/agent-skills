/**
 * CE.SDK Apparel UI Starterkit - Entry Point
 *
 * A custom React-based apparel design interface built on CE.SDK.
 * This starterkit provides a complete custom UI for designing
 * apparel products like t-shirts with a streamlined editor experience.
 *
 * @see https://img.ly/docs/cesdk/
 */

import { createRoot } from 'react-dom/client';
import App from './app/App';

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
  const container = document.getElementById('root');
  if (container == null) {
    throw new Error('Root container not found');
  }

  createRoot(container).render(<App engineConfig={engineConfig} />);
}

main();

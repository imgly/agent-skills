/**
 * CE.SDK Product Editor Starterkit - React Entry Point
 *
 * Creates the editor at the top level and passes it to App as children.
 * This separation allows App to focus on product logic while keeping
 * editor instantiation centralized.
 */

import { useState, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import CreativeEditor from '@cesdk/cesdk-js/react';
import type CreativeEditorSDK from '@cesdk/cesdk-js';

import App from './app/App';
import styles from './app/App.module.css';

// ============================================================================
// Configuration
// ============================================================================

const config = {
  baseURL: import.meta.env.VITE_IMGLY_LOCAL_ASSETS_URL,
  userId: 'starterkit-product-editor-user',

  // Enable single page mode for product editing (Front/Back areas)
  featureFlags: {
    singlePageMode: true
  },

  // Local assets for development

  license: import.meta.env.VITE_CESDK_LICENSE
};

// ============================================================================
// Main Component
// ============================================================================

function ProductEditor() {
  const [cesdk, setCesdk] = useState<CreativeEditorSDK | null>(null);

  const handleInit = useCallback((sdk: CreativeEditorSDK) => {
    // Debug access (remove in production)
    (window as any).cesdk = sdk;
    setCesdk(sdk);
  }, []);

  return (
    <App cesdk={cesdk}>
      <CreativeEditor
        className={styles.editor}
        config={config}
        init={handleInit}
      />
    </App>
  );
}

// ============================================================================
// Render
// ============================================================================

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root container not found');
}

const root = createRoot(container);
root.render(<ProductEditor />);

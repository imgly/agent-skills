/**
 * CE.SDK Airtable Asset Source - Main App Component
 *
 * This component manages the CE.SDK instance and the Airtable sidebar,
 * providing a complete image editing experience with Airtable integration.
 */

import { useCallback } from 'react';
import CreativeEditor from '@cesdk/cesdk-js/react';
import type CreativeEditorSDK from '@cesdk/cesdk-js';
import type { Configuration } from '@cesdk/cesdk-js';
import { initAirtableImageEditor, AirtableEditorOptions } from '../imgly';
import { resolveAssetPath } from '../imgly/resolveAssetPath';
import AirtableSidebar from './AirtableSidebar/AirtableSidebar';
import styles from './App.module.css';

// ============================================================================
// Airtable Editor Options
// ============================================================================

// highlight-airtable-config
// Configuration options (pick ONE):
//
// Option 1: Proxy URL (recommended for production)
//   - Set VITE_AIRTABLE_PROXY_URL in your .env file
//   - Your proxy server adds the API key server-side
//
// Option 2: API Key (for development/testing only)
//   - Set VITE_AIRTABLE_API_KEY in your .env file
//   - WARNING: This exposes your API key in client-side code
//
const editorOptions: AirtableEditorOptions = {
  // Use proxy URL if available, otherwise fall back to API key
  proxyUrl: import.meta.env.VITE_AIRTABLE_PROXY_URL,
  apiKey: import.meta.env.VITE_AIRTABLE_API_KEY
};
// highlight-airtable-config

interface AppProps {
  config: Configuration;
}

/**
 * Main App Component
 *
 * Sets up the CE.SDK instance with Airtable integration and displays
 * the editor alongside an embedded Airtable sidebar.
 */
export default function App({ config }: AppProps) {
  const handleInit = useCallback(async (cesdk: CreativeEditorSDK) => {
    (window as any).cesdk = cesdk;
    await initAirtableImageEditor(cesdk, editorOptions);
    // ============================================================================
    // Scene Loading
    // ============================================================================

    // highlight-scene-loading
    // Load the Airtable demo scene.
    // This scene showcases images that can be replaced with photos from Airtable.
    await cesdk.loadFromURL(resolveAssetPath('/assets/airtable.scene'));
    // highlight-scene-loading
  }, []);

  return (
    <div className={styles.appWrapper}>
      <CreativeEditor
        className={styles.cesdkContainer}
        config={config}
        init={handleInit}
      />
      <AirtableSidebar />
    </div>
  );
}

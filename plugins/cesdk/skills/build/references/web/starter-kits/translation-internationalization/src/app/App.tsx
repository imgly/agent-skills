/**
 * App Component - Translation & Internationalization Starterkit
 *
 * Main application component that demonstrates dynamic locale switching
 * in the CE.SDK design editor. Users can switch between English and German
 * locales using the i18n runtime API.
 *
 * @see https://img.ly/docs/cesdk/js/user-interface/localization-508e20/
 */

import { useCallback, useRef, useState } from 'react';
import { CreativeEditor } from '@cesdk/cesdk-js/react';
import type CreativeEditorSDK from '@cesdk/cesdk-js';
import type { Configuration } from '@cesdk/cesdk-js';

import { initTranslationInternationalizationEditor } from '../imgly';
import { DEMO_ASSETS_BASE_URL } from '../imgly/demo-assets';

import { LocaleSwitcher, type Locale } from './LocaleSwitcher';
import styles from './App.module.css';

// START_HIDDEN_BLOCK
import { reportDemoPhase } from '../../../shared/demo-preview/lifecycle';
// END_HIDDEN_BLOCK

interface AppProps {
  editorConfig: Configuration;
}

/**
 * Get the browser's preferred locale (en or de), defaulting to 'en'
 */
function getBrowserLocale(): Locale {
  const browserLang = navigator.language.split('-')[0];
  return browserLang === 'de' ? 'de' : 'en';
}

/**
 * App Component
 *
 * Renders the locale switcher and the Creative Editor.
 * When the locale changes, the editor updates dynamically using the i18n API.
 */
export function App({ editorConfig }: AppProps) {
  const [selectedLocale, setSelectedLocale] =
    useState<Locale>(getBrowserLocale());
  const cesdkRef = useRef<CreativeEditorSDK | null>(null);
  const initialLocaleRef = useRef<Locale>(getBrowserLocale());

  // ============================================================================
  // Locale Change Handler
  // ============================================================================

  // highlight-locale-switching
  const handleLocaleChange = useCallback((newLocale: Locale) => {
    setSelectedLocale(newLocale);

    // Use i18n runtime API to change locale without recreating the editor
    if (cesdkRef.current) {
      cesdkRef.current.i18n.setLocale(newLocale);
    }
  }, []);
  // highlight-locale-switching

  // ============================================================================
  // Editor Initialization
  // ============================================================================

  const handleEditorInit = useCallback(async (cesdk: CreativeEditorSDK) => {
    // START_HIDDEN_BLOCK
    reportDemoPhase('created');
    // END_HIDDEN_BLOCK
    // Store reference for locale switching
    cesdkRef.current = cesdk;

    // START_HIDDEN_BLOCK
    (window as unknown as { cesdk: CreativeEditorSDK }).cesdk = cesdk;
    // END_HIDDEN_BLOCK

    // Initialize the translation & internationalization editor
    await initTranslationInternationalizationEditor(cesdk);

    // highlight-locale
    // Start in the browser's language; the editor setup above defaults to English
    cesdk.i18n.setLocale(initialLocaleRef.current);
    // highlight-locale

    // ============================================================================
    // Scene Loading
    // ============================================================================

    // highlight-scene-loading
    await cesdk.load(`${DEMO_ASSETS_BASE_URL}/assets/example-1.scene`);
    // highlight-scene-loading
    // START_HIDDEN_BLOCK
    reportDemoPhase('ready');
    // END_HIDDEN_BLOCK
  }, []);

  // ============================================================================
  // Render
  // ============================================================================

  return (
    <div className={styles.appContainer}>
      {/* Locale Switcher */}
      <LocaleSwitcher
        selectedLocale={selectedLocale}
        onLocaleChange={handleLocaleChange}
      />

      {/* Creative Editor */}
      <div className={styles.cesdkWrapper}>
        <CreativeEditor config={editorConfig} init={handleEditorInit} />
      </div>
    </div>
  );
}

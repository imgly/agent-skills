/**
 * Internationalization Configuration - Product Editor
 *
 * This file configures custom translations and labels for the product editor.
 *
 * @see https://img.ly/docs/cesdk/js/localization/
 */

import type CreativeEditorSDK from '@cesdk/cesdk-js';

/**
 * Configure translations for the photo editor.
 *
 * Translations allow you to:
 * - Customize button labels and UI text
 * - Support multiple languages
 * - Match your brand voice
 * - Provide context-specific terminology
 *
 * @param cesdk - The CreativeEditorSDK instance to configure
 *
 * @example Changing the locale
 * ```typescript
 * cesdk.i18n.setLocale('de');
 * ```
 */
export function setupTranslations(cesdk: CreativeEditorSDK): void {
  // ============================================================================
  // CUSTOM TRANSLATIONS
  // Add custom translations here as needed
  // ============================================================================
  // Example:
  // cesdk.i18n.setTranslations({
  //   en: {
  //     'component.fileOperation.export': 'Download Design',
  //     'common.done': 'Done'
  //   }
  // });
  void cesdk;
}

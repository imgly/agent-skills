/**
 * Internationalization Configuration - Customize Labels and Translations
 *
 * This file configures custom translations for the viewer UI.
 * You can override any built-in label or add translations for new languages.
 *
 * @see https://img.ly/docs/cesdk/js/user-interface/localization-508e20/
 */

import type CreativeEditorSDK from '@cesdk/cesdk-js';

/**
 * Configure translations for the viewer.
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
  // Example: Override built-in labels with custom text
  // cesdk.i18n.setTranslations({
  //   en: {
  //     'component.zoom.fitPage': 'Fit to Screen',
  //     'component.zoom.in': 'Zoom In',
  //     'component.zoom.out': 'Zoom Out',
  //   },
  //   de: {
  //     'component.zoom.fitPage': 'An Bildschirm anpassen',
  //     'component.zoom.in': 'Vergrößern',
  //     'component.zoom.out': 'Verkleinern',
  //   }
  // });

  // Suppress unused variable warning
  void cesdk;
}

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
  //     'component.navigation.zoom.fit': 'Fit to Screen',
  //     'component.navigation.zoom.in': 'Zoom In',
  //     'component.navigation.zoom.out': 'Zoom Out',
  //   },
  //   de: {
  //     'component.navigation.zoom.fit': 'An Bildschirm anpassen',
  //     'component.navigation.zoom.in': 'Vergrößern',
  //     'component.navigation.zoom.out': 'Verkleinern',
  //   }
  // });

  // Suppress unused variable warning
  void cesdk;
}

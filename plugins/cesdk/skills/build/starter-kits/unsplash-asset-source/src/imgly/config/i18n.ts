/**
 * Internationalization Configuration - Customize Labels and Translations
 *
 * This file configures custom translations for the Unsplash editor UI.
 * You can override any built-in label or add translations for new languages.
 *
 * @see https://img.ly/docs/cesdk/js/user-interface/localization-508e20/
 */

import type CreativeEditorSDK from '@cesdk/cesdk-js';

/**
 * Configure translations for the Unsplash editor.
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
  // highlight-unsplash-translations
  // Add Unsplash-specific translations
  cesdk.i18n.setTranslations({
    en: {
      // Unsplash dock label
      'libraries.unsplash.label': 'Unsplash'
    },
    de: {
      'libraries.unsplash.label': 'Unsplash'
    },
    es: {
      'libraries.unsplash.label': 'Unsplash'
    },
    fr: {
      'libraries.unsplash.label': 'Unsplash'
    }
  });
  // highlight-unsplash-translations

  // Example: Override additional built-in labels with custom text
  // cesdk.i18n.setTranslations({
  //   en: {
  //     'libraries.ly.img.templates.label': 'Templates',
  //     'component.fileOperation.export': 'Download',
  //     'common.done': 'Finish',
  //   },
  //   de: {
  //     'libraries.ly.img.templates.label': 'Vorlagen',
  //     'component.fileOperation.export': 'Herunterladen',
  //     'common.done': 'Fertig',
  //   }
  // });
}

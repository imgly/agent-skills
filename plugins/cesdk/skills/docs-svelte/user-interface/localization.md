> This is one page of the CE.SDK Svelte documentation. For a complete overview, see the [Svelte Documentation Index](https://img.ly/svelte.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [User Interface](./user-interface.md) > [Localization](./user-interface/localization.md)

---

Translate and customize the CE.SDK editor interface for different languages using the built-in I18n API.

![Localization interface showing language selection](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/guides-user-interface-localization-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/main/guides-user-interface-localization-browser)
>
> - [Live demo](https://img.ly/examples/guides-user-interface-localization-browser/)

CE.SDK includes a localization system that lets you translate the editor interface, add custom languages, and white-label UI text. The I18n API manages translations programmatically at runtime, enabling you to switch languages dynamically and customize terminology for your brand.

```typescript file=@cesdk_web_examples/guides-user-interface-localization-browser/browser.ts reference-only
import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';

import {
  BlurAssetSource,
  ColorPaletteAssetSource,
  CropPresetsAssetSource,
  DemoAssetSources,
  EffectsAssetSource,
  FiltersAssetSource,
  PagePresetsAssetSource,
  StickerAssetSource,
  TextAssetSource,
  TextComponentAssetSource,
  TypefaceAssetSource,
  UploadAssetSources,
  VectorShapeAssetSource
} from '@cesdk/cesdk-js/plugins';
import { DesignEditorConfig } from './design-editor/plugin';
import packageJson from './package.json';

class LocalizationExample implements EditorPlugin {
  name = packageJson.name;
  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    await cesdk.addPlugin(new DesignEditorConfig());

    // Add asset source plugins
    await cesdk.addPlugin(new BlurAssetSource());
    await cesdk.addPlugin(new ColorPaletteAssetSource());
    await cesdk.addPlugin(new CropPresetsAssetSource());
    await cesdk.addPlugin(new UploadAssetSources({ include: ['ly.img.image.upload'] }));
    await cesdk.addPlugin(
      new DemoAssetSources({
        include: [
          'ly.img.templates.blank.*',
          'ly.img.templates.presentation.*',
          'ly.img.templates.print.*',
          'ly.img.templates.social.*',
          'ly.img.image.*'
        ]
      })
    );
    await cesdk.addPlugin(new EffectsAssetSource());
    await cesdk.addPlugin(new FiltersAssetSource());
    await cesdk.addPlugin(new PagePresetsAssetSource());
    await cesdk.addPlugin(new StickerAssetSource());
    await cesdk.addPlugin(new TextAssetSource());
    await cesdk.addPlugin(new TextComponentAssetSource());
    await cesdk.addPlugin(new TypefaceAssetSource());
    await cesdk.addPlugin(new VectorShapeAssetSource());

    await cesdk.actions.run('scene.create', {
      page: { width: 800, height: 600, unit: 'Pixel' }
    });

    const engine = cesdk.engine;
    const page = engine.block.findByType('page')[0]!;

    // Get the currently active locale
    const currentLocale = cesdk.i18n.getLocale();
    console.log('Current locale:', currentLocale);
    // Output: "en" (default fallback locale)

    // List all available locales
    const allLocales = cesdk.i18n.listLocales();
    console.log('Available locales:', allLocales);
    // Output: ["en", "de"] (default English and German)

    // Find English variants using wildcard
    const englishLocales = cesdk.i18n.listLocales({ matcher: 'en*' });
    console.log('English locales:', englishLocales);

    // Switch to German locale
    cesdk.i18n.setLocale('de');
    console.log('Switched to locale:', cesdk.i18n.getLocale());
    // The UI will now display in German

    // Add French translations
    cesdk.i18n.setTranslations({
      fr: {
        'common.save': 'Enregistrer',
        'common.cancel': 'Annuler',
        'common.back': 'Retour',
        'meta.currentLanguage': 'Français'
      }
    });

    // Switch to French
    cesdk.i18n.setLocale('fr');
    console.log('Switched to French locale');

    // Override specific labels for English while keeping defaults
    cesdk.i18n.setTranslations({
      en: {
        'common.save': 'Save Design',
        'common.export': 'Download'
      }
    });

    // White-label with custom terminology across multiple locales
    cesdk.i18n.setTranslations({
      en: {
        'action.save': 'Publish Design',
        'action.export': 'Download Design',
        'panel.adjustments.title': 'Enhance'
      },
      de: {
        'action.save': 'Design Veröffentlichen',
        'action.export': 'Design Herunterladen',
        'panel.adjustments.title': 'Verbessern'
      }
    });

    // Retrieve translations for specific locales
    const frenchTranslations = cesdk.i18n.getTranslations(['fr']);
    console.log('French translations:', frenchTranslations);

    // Get all translations
    const allTranslations = cesdk.i18n.getTranslations();
    console.log('All translations loaded:', Object.keys(allTranslations));

    // Translate custom keys programmatically
    const saveLabel = cesdk.i18n.translate('common.save');
    console.log('Save label:', saveLabel);

    // Use fallback keys
    const actionLabel = cesdk.i18n.translate(['custom.action', 'common.save']);
    console.log('Action label with fallback:', actionLabel);

    // Build language selector data
    const availableLocales = cesdk.i18n.listLocales();
    console.log('Building language selector with locales:', availableLocales);

    // Simulate dynamic language switching
    const switchLanguage = (locale: string) => {
      cesdk.i18n.setLocale(locale);
      console.log(`Switched to ${locale}`);
    };

    // Example: Switch between languages
    switchLanguage('en');
    switchLanguage('de');
    switchLanguage('fr');

    // Simulate loading translations from external source
    const loadExternalTranslations = async () => {
      // In a real application, you would fetch from a server:
      // const response = await fetch('/api/translations/es.json');
      // const translations = await response.json();

      // Simulate external Spanish translations
      const externalTranslations = {
        es: {
          'common.save': 'Guardar',
          'common.cancel': 'Cancelar',
          'common.back': 'Volver',
          'meta.currentLanguage': 'Español'
        }
      };

      cesdk.i18n.setTranslations(externalTranslations);
      console.log('Loaded external Spanish translations');
    };

    await loadExternalTranslations();

    // Add Italian with comprehensive translations for a fully localized UI
    cesdk.i18n.setTranslations({
      it: {
        // === NAVIGATION BAR (Top Bar) ===

        // Undo/Redo
        'common.undo': 'Annulla',
        'common.redo': 'Ripeti',
        'component.undo.undo': 'Annulla',
        'component.undo.redo': 'Ripeti',

        // File Operations
        'common.save': 'Salva',
        'common.export': 'Esporta',
        'common.download': 'Scarica',
        'component.fileOperation.save': 'Salva',
        'component.fileOperation.exportImage': 'Esporta Immagini',
        'component.fileOperation.exportPDF': 'Esporta PDF',
        'component.fileOperation.exportVideo': 'Esporta Video',
        'component.fileOperation.exportScene': 'Esporta Design',
        'component.fileOperation.importScene': 'Importa Design',
        'component.fileOperation.more': 'Mostra altre opzioni',

        // Zoom Controls
        'component.zoom.in': 'Aumenta Zoom',
        'component.zoom.out': 'Diminuisci Zoom',
        'component.zoom.fitPage': 'Adatta Pagina',
        'component.zoom.fitSelection': 'Adatta Selezione',
        'component.zoom.autoFit': 'Adattamento Automatico',
        'component.zoom.options': 'Vedi altre opzioni di zoom',

        // Top Bar Controls
        'component.topbar.back': 'Indietro',
        'component.topbar.close': 'Chiudi',
        'common.close': 'Chiudi',
        'component.settings.toggle': 'Personalizza Editor',
        'component.settings.toggle.description':
          "Apri impostazioni per personalizzare l'editor",

        // === DOCK (Left Sidebar) ===

        // Library/Asset Panel
        'component.library': 'Libreria',
        'component.library.elements': 'Elementi',
        'component.canvas.openLibrary': 'Aggiungi Elementi',
        'component.library.addFile': 'Aggiungi File',
        'component.library.searchPlaceholder': 'Cerca …',
        'component.library.clearSearch': 'Cancella ricerca',
        'component.library.noItems': 'Nessun Elemento',
        'component.library.loading': 'Caricamento …',

        // Library Categories
        'libraries.ly.img.image.label': 'Immagini',
        'libraries.ly.img.image.upload.label': 'Caricamenti Immagini',
        'libraries.ly.img.video.label': 'Video',
        'libraries.ly.img.video.upload.label': 'Caricamenti Video',
        'libraries.ly.img.audio.label': 'Audio',
        'libraries.ly.img.audio.upload.label': 'Caricamenti Audio',
        'libraries.ly.img.text.label': 'Testo',
        'libraries.ly.img.text.title.label': 'Titolo',
        'libraries.ly.img.text.headline.label': 'Intestazione',
        'libraries.ly.img.text.paragraph.label': 'Paragrafo',
        'libraries.ly.img.vectorpath.label': 'Forme',
        'libraries.ly.img.sticker.label': 'Adesivi',
        'libraries.ly.img.upload.label': 'Caricamenti',
        'libraries.ly.img.template.label': 'Modelli',
        'libraries.unsplash.label': 'Unsplash',

        // Inspector Panel
        'component.inspectorBar': 'Barra Ispettore',
        'action.showInspector': 'Mostra Ispettore',
        'action.closeInspector': 'Chiudi Ispettore',
        'component.propertyPopover.header': 'Proprietà',

        // === COMMON ELEMENTS ===

        // Basic Actions
        'common.cancel': 'Annulla',
        'common.back': 'Indietro',
        'common.done': 'Fatto',
        'common.apply': 'Applica',
        'common.reset': 'Ripristina',
        'common.delete': 'Elimina',
        'common.duplicate': 'Duplica',
        'common.add': 'Aggiungi',
        'common.replace': 'Sostituisci',
        'common.edit': 'Modifica',
        'common.load': 'Carica',
        'common.more': 'Altro',

        // Canvas
        'component.canvas': 'Area Editor',
        'common.mode.design': 'Design',
        'common.mode.preview': 'Anteprima',

        // Properties & Adjustments
        'common.properties': 'Proprietà',
        'common.opacity': 'Opacità',
        'common.fill': 'Riempimento',
        'common.color': 'Colore',
        'common.position': 'Posizione',
        'common.size': 'Dimensione',
        'common.rotation': 'Rotazione',
        'common.transform': 'Trasforma',

        // Adjustments
        'input.adjustments': 'Regolazioni',
        'property.adjustments.brightness': 'Luminosità',
        'property.adjustments.contrast': 'Contrasto',
        'property.adjustments.saturation': 'Saturazione',
        'property.adjustments.exposure': 'Esposizione',
        'property.adjustments.highlights': 'Luci',
        'property.adjustments.shadows': 'Ombre',
        'property.adjustments.temperature': 'Temperatura',
        'property.adjustments.sharpness': 'Nitidezza',

        // Blur & Effects
        'input.blur': 'Sfocatura',
        'input.effect': 'Effetto',
        'input.filter': 'Filtro',
        'component.assetSettings.blur': 'Sfocatura',
        'component.assetSettings.effects': 'Effetti',
        'component.assetSettings.filters': 'Filtri',
        'component.assetSettings.adjustments': 'Regolazioni',

        // Text Properties
        'input.text.advanced': 'Avanzate',
        'property.letterSpacing': 'Spaziatura Lettere',
        'property.lineHeight': 'Altezza Riga',
        'typography.typeface': 'Carattere',
        'typography.size': 'Dimensione',
        'typography.bold': 'Grassetto',
        'typography.italic': 'Corsivo',

        // Block Types
        'block.image': 'Immagine',
        'block.video': 'Video',
        'block.audio': 'Audio',
        'block.text': 'Testo',
        'block.shape': 'Forma',
        'block.sticker': 'Adesivo',
        'block.group': 'Gruppo',
        'block.page': 'Pagina',

        // Actions
        'action.align': 'Allinea',
        'action.arrange': 'Disponi',
        'action.group': 'Raggruppa',
        'action.ungroup': 'Separa',
        'common.lock': 'Blocca',
        'common.unlock': 'Sblocca',

        // Pages
        'common.page': 'Pagina',
        'action.page.add': 'Aggiungi Pagina',
        'action.page.delete': 'Elimina Pagina',

        // Metadata
        'meta.currentLanguage': 'Italiano'
      }
    });

    // Verify the new locale is available
    console.log('Available after Italian:', cesdk.i18n.listLocales());

    // Switch to Italian to display the fully translated UI
    cesdk.i18n.setLocale('it');
    console.log('UI now displaying in Italian');

    // Add a sample image to the canvas for visual content
    const imageUri = 'https://img.ly/static/ubq_samples/sample_1.jpg';
    const image = await engine.block.addImage(imageUri, { x: 0, y: 0 });
    engine.block.setWidth(image, 800);
    engine.block.setHeight(image, 600);
  }
}

export default LocalizationExample;
```

This guide covers setting locales, adding translations, discovering available languages, white-labeling with custom terminology, and loading external translation files.

## Default Languages and System Overview

CE.SDK ships with English (`en`) and German (`de`) translations. The system falls back to English when translations are missing, ensuring the UI always displays text. When you add custom translations using `setTranslations()`, they override the built-in defaults for the same keys, while all other keys continue using CE.SDK's standard translations.

During development, missing translation keys are logged to the console to help identify gaps in your translations.

## Programmatic Localization

We manage all localization using the `cesdk.i18n` API after initializing CreativeEditorSDK. The I18n API provides methods for setting languages, adding translations, and managing locales at runtime.

```typescript highlight-setup
    await cesdk.addPlugin(new DesignEditorConfig());

    // Add asset source plugins
    await cesdk.addPlugin(new BlurAssetSource());
    await cesdk.addPlugin(new ColorPaletteAssetSource());
    await cesdk.addPlugin(new CropPresetsAssetSource());
    await cesdk.addPlugin(new UploadAssetSources({ include: ['ly.img.image.upload'] }));
    await cesdk.addPlugin(
      new DemoAssetSources({
        include: [
          'ly.img.templates.blank.*',
          'ly.img.templates.presentation.*',
          'ly.img.templates.print.*',
          'ly.img.templates.social.*',
          'ly.img.image.*'
        ]
      })
    );
    await cesdk.addPlugin(new EffectsAssetSource());
    await cesdk.addPlugin(new FiltersAssetSource());
    await cesdk.addPlugin(new PagePresetsAssetSource());
    await cesdk.addPlugin(new StickerAssetSource());
    await cesdk.addPlugin(new TextAssetSource());
    await cesdk.addPlugin(new TextComponentAssetSource());
    await cesdk.addPlugin(new TypefaceAssetSource());
    await cesdk.addPlugin(new VectorShapeAssetSource());

    await cesdk.actions.run('scene.create', {
      page: { width: 800, height: 600, unit: 'Pixel' }
    });
```

### Getting the Current Locale

We use `cesdk.i18n.getLocale()` to retrieve the currently active locale. The method returns the locale code (e.g., `'en'`, `'de'`) or the fallback locale if none is explicitly set.

```typescript highlight-get-current-locale
// Get the currently active locale
const currentLocale = cesdk.i18n.getLocale();
console.log('Current locale:', currentLocale);
// Output: "en" (default fallback locale)
```

### Setting the Initial Locale

We use `cesdk.i18n.setLocale()` to switch the active language. The UI updates immediately to display text in the specified locale.

```typescript highlight-set-locale
// Switch to German locale
cesdk.i18n.setLocale('de');
console.log('Switched to locale:', cesdk.i18n.getLocale());
// The UI will now display in German
```

### Discovering Available Locales

We use `cesdk.i18n.listLocales()` to get an array of all loaded locales. The method supports optional wildcard matching using the `matcher` parameter to find locale variants.

```typescript highlight-list-available-locales
    // List all available locales
    const allLocales = cesdk.i18n.listLocales();
    console.log('Available locales:', allLocales);
    // Output: ["en", "de"] (default English and German)

    // Find English variants using wildcard
    const englishLocales = cesdk.i18n.listLocales({ matcher: 'en*' });
    console.log('English locales:', englishLocales);
```

### Adding Custom Translations

We use `cesdk.i18n.setTranslations()` to add new languages or override existing translations. The structure requires the locale as the key with a nested translation object. We only need to provide keys we want to change—the rest fall back to defaults.

```typescript highlight-add-custom-translations
    // Add French translations
    cesdk.i18n.setTranslations({
      fr: {
        'common.save': 'Enregistrer',
        'common.cancel': 'Annuler',
        'common.back': 'Retour',
        'meta.currentLanguage': 'Français'
      }
    });

    // Switch to French
    cesdk.i18n.setLocale('fr');
    console.log('Switched to French locale');
```

### Overriding Specific Labels

We can override individual UI labels while keeping the rest of the default translations. This is useful for adjusting specific terminology without replacing entire translation sets.

```typescript highlight-partial-override
// Override specific labels for English while keeping defaults
cesdk.i18n.setTranslations({
  en: {
    'common.save': 'Save Design',
    'common.export': 'Download'
  }
});
```

### Retrieving Translations

We use `cesdk.i18n.getTranslations()` to retrieve loaded translations for specific locales or all available translations. This is useful for debugging or exporting translation data.

```typescript highlight-get-translations
    // Retrieve translations for specific locales
    const frenchTranslations = cesdk.i18n.getTranslations(['fr']);
    console.log('French translations:', frenchTranslations);

    // Get all translations
    const allTranslations = cesdk.i18n.getTranslations();
    console.log('All translations loaded:', Object.keys(allTranslations));
```

### Translating Keys Programmatically

We use `cesdk.i18n.translate()` to translate custom keys in our own UI elements. The method accepts a single key string or array of keys for fallback behavior. When an array is provided, the first key with a translation is used.

```typescript highlight-translate-keys
    // Translate custom keys programmatically
    const saveLabel = cesdk.i18n.translate('common.save');
    console.log('Save label:', saveLabel);

    // Use fallback keys
    const actionLabel = cesdk.i18n.translate(['custom.action', 'common.save']);
    console.log('Action label with fallback:', actionLabel);
```

## Dynamic Language Switching

We can build user-facing language selectors and switch languages at runtime without reloading the editor. We use `cesdk.i18n.listLocales()` to populate selector options and `cesdk.i18n.setLocale()` to switch languages.

```typescript highlight-dynamic-switching
    // Build language selector data
    const availableLocales = cesdk.i18n.listLocales();
    console.log('Building language selector with locales:', availableLocales);

    // Simulate dynamic language switching
    const switchLanguage = (locale: string) => {
      cesdk.i18n.setLocale(locale);
      console.log(`Switched to ${locale}`);
    };

    // Example: Switch between languages
    switchLanguage('en');
    switchLanguage('de');
    switchLanguage('fr');
```

## White-labeling and Custom Terminology

We can override specific UI labels for brand consistency while maintaining default translations for everything else. We use partial translation objects to change only targeted labels across multiple locales.

```typescript highlight-white-labeling
// White-label with custom terminology across multiple locales
cesdk.i18n.setTranslations({
  en: {
    'action.save': 'Publish Design',
    'action.export': 'Download Design',
    'panel.adjustments.title': 'Enhance'
  },
  de: {
    'action.save': 'Design Veröffentlichen',
    'action.export': 'Design Herunterladen',
    'panel.adjustments.title': 'Verbessern'
  }
});
```

## Complete Language Addition

We add support for new languages by providing translation objects with UI keys. We can provide a complete translation set or accept English fallbacks for missing keys. The example project demonstrates adding Italian with 100+ translations covering the navigation bar, dock, properties, and adjustments—see `browser.ts` for the complete implementation.

## Loading External Translation Files

We can load translation JSON files from external sources at runtime using `fetch()` and `cesdk.i18n.setTranslations()`. This is useful for loading translations from CDN or backend services.

```typescript highlight-external-translations
    // Simulate loading translations from external source
    const loadExternalTranslations = async () => {
      // In a real application, you would fetch from a server:
      // const response = await fetch('/api/translations/es.json');
      // const translations = await response.json();

      // Simulate external Spanish translations
      const externalTranslations = {
        es: {
          'common.save': 'Guardar',
          'common.cancel': 'Cancelar',
          'common.back': 'Volver',
          'meta.currentLanguage': 'Español'
        }
      };

      cesdk.i18n.setTranslations(externalTranslations);
      console.log('Loaded external Spanish translations');
    };

    await loadExternalTranslations();
```

## Troubleshooting

### Missing Translation Keys

In development mode, missing keys are logged to the console with trace information. Missing keys fall back to the key string itself or English translation. Check `window.missingKeys` set for debugging.

### Locale Not Loading

Verify translations are correctly added with `cesdk.i18n.setTranslations()` before calling `cesdk.i18n.setLocale()`. Use `cesdk.i18n.listLocales()` to confirm the locale is loaded.

### Fallback Behavior

The system falls back to English (`en`) for missing translations. The fallback locale cannot be changed. Ensure critical UI elements have English translations as a safety net.

## API Reference

| Method                                                                 | Purpose                                   |
| ---------------------------------------------------------------------- | ----------------------------------------- |
| `cesdk.i18n.getLocale()`                                               | Get currently active locale string        |
| `cesdk.i18n.setLocale(locale)`                                         | Set active locale for UI                  |
| `cesdk.i18n.listLocales(options?)`                                     | List all loaded locales with filtering    |
| `cesdk.i18n.setTranslations(definition)`                               | Add or override translations for locales  |
| `cesdk.i18n.getTranslations(locales?)`                                 | Retrieve translations for specific locals |
| `cesdk.i18n.translate(key)`                                            | Translate a key to current locale         |

## Next Steps

- [UI Customization](./user-interface/customization.md) — Customize editor components and layout
- [Configuration](./configuration.md) — Explore editor configuration options
- [Actions](./actions.md) — Handle user interactions and events
- [Asset Library Customization](./import-media/asset-panel/customize.md) — Customize asset sources and library



---

## More Resources

- **[Svelte Documentation Index](https://img.ly/svelte.md)** - Browse all Svelte documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./svelte.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
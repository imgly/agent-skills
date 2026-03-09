> This is one page of the CE.SDK Electron documentation. For a complete overview, see the [Electron Documentation Index](https://img.ly/electron.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [User Interface](./user-interface.md) > [Appearance](./user-interface/appearance.md) > [Custom Labels](./user-interface/appearance/custom-labels.md)

---

Customize UI text labels in CE.SDK to match your brand voice and product terminology without changing the entire interface language.

![Custom Labels example showing CE.SDK with customized UI text](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples)
>
> - [Live demo](https://img.ly/examples/guides-user-interface-appearance-custom-labels-browser/)

```typescript file=@cesdk_web_examples/guides-user-interface-appearance-custom-labels-browser/browser.ts reference-only
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

/**
 * CE.SDK Plugin: Custom Labels Guide
 *
 * Demonstrates customizing UI text labels in CE.SDK:
 * - Overriding specific labels while keeping default locale
 * - Customizing action button labels (Export, Save, Delete, etc.)
 * - Changing navigation labels (Back, Close, Done)
 * - Modifying panel and component labels
 * - Runtime label updates
 * - Common customization scenarios for branding
 */
class Example implements EditorPlugin {
  name = packageJson.name;
  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Enable features to demonstrate various UI labels
    cesdk.feature.enable('ly.img.fill');
    cesdk.feature.enable('ly.img.adjustment');
    cesdk.feature.enable('ly.img.layer');
    cesdk.feature.enable('ly.img.settings');
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
    const page = engine.block.findByType('page')[0];
    const pageWidth = engine.block.getWidth(page);
    const pageHeight = engine.block.getHeight(page);

    // ===== Custom Label Translations =====
    // Apply all custom label translations in a single call
    // This demonstrates customizing multiple UI elements at once

    // Example 1: Undo Button Label
    // Visible in the navigation bar
    cesdk.i18n.setTranslations({
      en: {
        'common.undo': 'Revert'
      }
    });

    // Example 2: Elements Dock Button
    // Visible in the dock/library panel
    cesdk.i18n.setTranslations({
      en: {
        'component.library.elements': 'Shapes'
      }
    });

    // Example 3: Image Dock Button
    // Visible in the dock/library panel
    cesdk.i18n.setTranslations({
      en: {
        'libraries.ly.img.image.label': 'Photos'
      }
    });

    // Example 4: Add Page Button
    // Visible in page management controls
    cesdk.i18n.setTranslations({
      en: {
        'action.page.add': 'New Page'
      }
    });

    // Example 5: Preview Button
    // Visible in the navigation bar or view controls
    cesdk.i18n.setTranslations({
      en: {
        'common.mode.preview': 'View Mode'
      }
    });

    // Create a single text block showing all customizations
    const textBlock = engine.block.create('text');
    const labelText = `Custom Labels Applied:

1. "Undo" → "Revert"
2. "Elements" → "Shapes"
3. "Images" → "Photos"
4. "Add Page" → "New Page"
5. "Preview" → "View Mode"

Check the navigation bar, dock, and menus to see these changes!`;

    engine.block.setString(textBlock, 'text/text', labelText);
    engine.block.setWidth(textBlock, pageWidth * 0.8);
    engine.block.setHeight(textBlock, pageHeight * 0.8);
    engine.block.setPositionX(textBlock, pageWidth * 0.1);
    engine.block.setPositionY(textBlock, pageHeight * 0.1);
    engine.block.setFloat(textBlock, 'text/fontSize', 30);
    engine.block.appendChild(page, textBlock);

    // To discover available translation keys:
    // 1. Download en.json from CDN:
    //    https://cdn.img.ly/packages/imgly/cesdk-js/$VERSION$/assets/i18n/en.json
    // 2. Inspect UI with browser DevTools to find key names
    // 3. Check console logs when interacting with UI components

    // Select the text block to show it in the canvas
    engine.block.setSelected(textBlock, true);
  }
}

export default Example;
```

CreativeEditor SDK (CE.SDK) provides extensive customization of UI text through its internationalization system. Custom labels allow you to override specific UI text elements without changing the entire interface language.

While the full localization system manages complete language translations, custom labels focus on individual text elements. You can customize button labels, menu items, tooltips, and other UI text to match your application's terminology and brand voice.

This guide demonstrates how to replace default labels like "Export" with "Download" or "Delete" with "Remove" to align the editor with your users' expectations.

## Understanding Custom Labels

Custom labels let you modify individual UI text strings while keeping the rest of the interface in its default language. You can change "Export" to "Download", "Back" to "Close", or "Delete" to "Remove" - adjusting terminology to match your users' expectations and your product's vocabulary.

The CE.SDK uses a key-value translation system where each UI element has a unique translation key (e.g., `common.export`, `action.block.delete`). By providing custom values for these keys, you override the default text throughout the interface.

## Translation Key Structure

Translation keys in CE.SDK follow a hierarchical naming convention:

```
category.component.property
```

**Common Categories:**

- `action` - Action buttons and menu items (e.g., `action.block.delete`, `action.image.crop`)
- `common` - Frequently used labels across the interface (e.g., `common.save`, `common.export`)
- `panel` - Panel and inspector titles (e.g., `panel.inspector.title`, `panel.assetLibrary.title`)
- `component` - Component-specific labels (e.g., `component.canvas.openLibrary`)
- `input` - Form input labels and placeholders
- `meta` - Special metadata keys (e.g., `meta.currentLanguage`)

## Customizing Undo Button Label

The undo button appears in the top navigation bar and is one of the most commonly used actions. Here we change "Undo" to "Revert" using the `cesdk.i18n.setTranslations()` API:

```typescript highlight-undo-button
// Example 1: Undo Button Label
// Visible in the navigation bar
cesdk.i18n.setTranslations({
  en: {
    'common.undo': 'Revert'
  }
});
```

The API accepts an object where the first key is the locale code (`en` for English), and the value is an object mapping translation keys to custom strings. The system merges your custom labels with the default translations, overriding only the keys you specify.

## Customizing Elements Dock Button

The elements button appears in the dock/library panel and provides access to design elements. Here we change "Elements" to "Shapes":

```typescript highlight-elements-button
// Example 2: Elements Dock Button
// Visible in the dock/library panel
cesdk.i18n.setTranslations({
  en: {
    'component.library.elements': 'Shapes'
  }
});
```

This customization is immediately visible in the dock interface, making it clear that users can access shapes and design elements from this button.

## Customizing Image Dock Button

The image library button appears in the dock/library panel. Here we change "Images" to "Photos":

```typescript highlight-image-button
// Example 3: Image Dock Button
// Visible in the dock/library panel
cesdk.i18n.setTranslations({
  en: {
    'libraries.ly.img.image.label': 'Photos'
  }
});
```

This change uses the library-specific translation key to customize how the image library appears in the dock, aligning with consumer-friendly terminology.

## Customizing Add Page Button

The add page action appears in page management controls. Here we change "Add Page" to "New Page":

```typescript highlight-add-page-button
// Example 4: Add Page Button
// Visible in page management controls
cesdk.i18n.setTranslations({
  en: {
    'action.page.add': 'New Page'
  }
});
```

This customization affects page management buttons and actions, providing clearer terminology for creating new pages in multi-page designs.

## Customizing Preview Button

The preview button appears in the navigation bar or view controls. Here we change "Preview" to "View Mode":

```typescript highlight-preview-button
// Example 5: Preview Button
// Visible in the navigation bar or view controls
cesdk.i18n.setTranslations({
  en: {
    'common.mode.preview': 'View Mode'
  }
});
```

This change affects the preview/view mode button, making it clearer that users are switching to a different viewing mode rather than just previewing their work.

## Discovering Available Labels

To find which labels you can customize, CE.SDK provides several approaches:

**1. Download the English Translation File**

The complete list of translation keys is available in the English translation file hosted on CE.SDK's CDN:

```
https://cdn.img.ly/packages/imgly/cesdk-js/$UBQ_VERSION$/assets/i18n/en.json
```

This JSON file contains all translation keys with their default English values. You can search for specific labels or browse categories to find the keys you need.

**2. Inspect UI with Browser DevTools**

Use browser developer tools to inspect UI elements and identify their translation keys:

```typescript highlight-discover-labels
// To discover available translation keys:
// 1. Download en.json from CDN:
//    https://cdn.img.ly/packages/imgly/cesdk-js/$VERSION$/assets/i18n/en.json
// 2. Inspect UI with browser DevTools to find key names
// 3. Check console logs when interacting with UI components
```

The console logs and network requests often reveal translation key names when you interact with UI components.

**3. Reference the Translation Key Categories**

Common patterns for finding translation keys:

- **Action buttons**: Look for `action.{component}.{operation}` keys
- **Common UI**: Check `common.{label}` keys for frequently used text
- **Panel titles**: Use `panel.{panelName}.title` keys
- **Component labels**: Search for `component.{componentName}.{property}` keys

## Best Practices

**Override Only What You Need**

The translation system merges your custom labels with defaults, so you only need to specify the keys you want to change. Don't copy the entire translation file - provide only the overrides you need:

```typescript
// ✅ Good: Override only specific labels
cesdk.i18n.setTranslations({
  en: {
    'common.undo': 'Revert',
    'component.library.elements': 'Shapes'
  }
});

// ❌ Avoid: Duplicating entire translation file
// This creates maintenance burden and makes updates difficult
```

**Maintain Consistency Across Related Labels**

When customizing labels, consider related operations and ensure consistent terminology:

```typescript
cesdk.i18n.setTranslations({
  en: {
    // Consistent library terminology across all dock buttons
    'component.library.elements': 'Shapes',
    'libraries.ly.img.image.label': 'Photos',
    'libraries.ly.img.text.label': 'Typography',
    'libraries.ly.img.sticker.label': 'Graphics'
  }
});
```

**Test Labels in Context**

UI labels have length constraints based on their location. Test your custom labels in the actual interface to ensure they fit properly:

- **Button labels**: Keep concise (1-2 words)
- **Menu items**: Can be slightly longer (2-4 words)
- **Tooltips**: Can include brief descriptions
- **Panel titles**: Should be clear but compact

**Document Your Custom Label Mappings**

Maintain documentation of your custom label mappings for team reference:

```typescript
/**
 * Custom Labels Configuration
 *
 * Brand-aligned terminology for immediately visible UI elements:
 * - "Undo" → "Revert" (navigation bar - clearer action terminology)
 * - "Elements" → "Shapes" (dock button - more specific)
 * - "Images" → "Photos" (dock button - consumer-friendly)
 * - "Add Page" → "New Page" (page controls - clearer action)
 */
cesdk.i18n.setTranslations({
  en: {
    'common.undo': 'Revert',
    'component.library.elements': 'Shapes',
    'libraries.ly.img.image.label': 'Photos',
    'action.page.add': 'New Page'
  }
});
```

## Custom Labels vs. Full Localization

Custom labels and full localization serve different purposes:

**Custom Labels** (this guide):

- Override specific UI text elements
- Keep the default language (usually English)
- Match your brand terminology
- Refine specific translations
- Use case: Branding, terminology alignment, UX refinement

**Full Localization** ([see Localization guide](./user-interface/localization.md)):

- Switch entire interface to different languages
- Provide complete translation sets
- Support multiple language locales
- Use case: International markets, multilingual users

You can combine both approaches - set a locale for the primary language, then override specific labels for branding:

```typescript
// Set German as the primary locale
cesdk.i18n.setLocale('de');

// Override specific labels even in German
cesdk.i18n.setTranslations({
  de: {
    'common.export': 'Herunterladen' // Custom German label
  }
});
```

## API Reference

| Method | Description |
|--------|-------------|
| `cesdk.i18n.setTranslations(definition)` | Sets or overrides UI text labels for specific locales |
| `cesdk.i18n.getLocale()` | Gets the current interface locale |
| `cesdk.i18n.setLocale(locale)` | Sets the interface language to a different locale |

### cesdk.i18n.setTranslations()

**Signature:**

```typescript
setTranslations(definition: { [locale: string]: object }): void
```

**Parameters:**

- `definition` - Object mapping locale codes (e.g., `en`, `de`) to translation objects. Each translation object maps translation keys to custom strings.

**Behavior:**

- Merges with existing translations, overriding only the keys you specify
- Changes apply immediately throughout the interface
- Persists until changed or cleared
- Does not reset when switching scenes

**Example:**

```typescript
cesdk.i18n.setTranslations({
  en: {
    'common.undo': 'Revert',
    'libraries.ly.img.image.label': 'Photos'
  }
});
```

### Common Translation Keys

| Translation Key | Description |
|-----------------|-------------|
| `common.undo` | Undo button label in navigation bar |
| `common.redo` | Redo button label in navigation bar |
| `common.export` | Export button label in navigation bar |
| `common.mode.preview` | Preview/view mode button label |
| `component.library.elements` | Elements library button in dock |
| `libraries.ly.img.image.label` | Image library button in dock |
| `libraries.ly.img.text.label` | Text library button in dock |
| `libraries.ly.img.sticker.label` | Sticker library button in dock |
| `action.block.duplicate` | Duplicate element action label |
| `action.block.delete` | Delete element action label |
| `action.page.add` | Add page button label |
| `action.page.duplicate` | Duplicate page action label |
| `action.page.delete` | Delete page action label |

### Discovering Translation Keys

**Translation Files:**

- English: `https://cdn.img.ly/packages/imgly/cesdk-js/$UBQ_VERSION$/assets/i18n/en.json`
- German: `https://cdn.img.ly/packages/imgly/cesdk-js/$UBQ_VERSION$/assets/i18n/de.json`

**Special Syntax:**

- `$t(key)` - References another translation key (e.g., `"action.block.delete": "$t(common.delete)"` uses the value of `common.delete`)

## Next Steps

- [Localization](./user-interface/localization.md) - Learn about managing multiple languages in CE.SDK
- [Theming](./user-interface/appearance/theming.md) - Customize the visual appearance of the interface
- [Custom UI Components](./user-interface/ui-extensions.md) - Build custom UI elements for your workflow



---

## More Resources

- **[Electron Documentation Index](https://img.ly/electron.md)** - Browse all Electron documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./electron.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
> This is one page of the CE.SDK Svelte documentation. For a complete overview, see the [Svelte Documentation Index](https://img.ly/svelte.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Configuration](./configuration.md)

---

Set up CE.SDK with license keys, asset base URLs, user IDs, and runtime configuration options to match your application requirements.

![Configuration example showing CE.SDK editor with theme toggle in navigation bar](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/guides-configuration-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/main/guides-configuration-browser)
>
> - [Live demo](https://img.ly/examples/guides-configuration-browser/)

`CreativeEditorSDK.create()` initializes the full CE.SDK editor with UI components. The configuration object controls license validation, asset loading, user tracking, and UI behavior.

```typescript file=@cesdk_web_examples/guides-configuration-browser/index.ts reference-only
import CreativeEditorSDK from '@cesdk/cesdk-js';
import Example from './browser';

const config = {
  // License key removes watermarks from exports
  // Get a free trial at https://img.ly/forms/free-trial
  // license: 'YOUR_CESDK_LICENSE_KEY',

  // User ID for accurate MAU tracking across devices
  userId: 'guides-user',

  // Custom logger for debugging and monitoring
  logger: (message: string, level?: string) => {
    console.log(`[CE.SDK ${level ?? 'Info'}] ${message}`);
  },

  // Enable developer mode for diagnostics
  devMode: false,

  // Accessibility settings
  a11y: {
    headingsHierarchyStart: 1 as const
  },

  // Location of core engine assets (WASM, data files)
  // Default: IMG.LY CDN. For production, host assets yourself.
  // baseURL: 'https://your-cdn.com/cesdk-assets/',

  // Use local assets when developing with local packages
  ...(import.meta.env.CESDK_USE_LOCAL && {
    baseURL: '/assets/'
  })
};

CreativeEditorSDK.create('#cesdk_container', config)
  .then(async (cesdk: CreativeEditorSDK) => {

    // Expose cesdk for debugging and hero screenshot generation
    (window as any).cesdk = cesdk;

    // Load the example plugin
    await cesdk.addPlugin(new Example());
  })
  .catch((error: Error) => {
    // eslint-disable-next-line no-console
    console.error('Failed to initialize CE.SDK:', error);
  });
```

```typescript file=@cesdk_web_examples/guides-configuration-browser/browser.ts reference-only
import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';

class Example implements EditorPlugin {
  name = packageJson.name;
  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Load default asset sources for editing
    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({
      sceneMode: 'Design',
      withUploadAssetSources: true
    });

    const engine = cesdk.engine;

    // Create a Scene
    engine.scene.create('VerticalStack', {
      page: { size: { width: 800, height: 600 } }
    });

    const pages = engine.block.findByType('page');
    const page = pages[0];

    // ========================================
    // Setup: Gradient Background with Title
    // ========================================
    // Create gradient background
    const gradientFill = engine.block.createFill('gradient/linear');
    engine.block.setGradientColorStops(gradientFill, 'fill/gradient/colors', [
      { color: { r: 0.15, g: 0.1, b: 0.35, a: 1.0 }, stop: 0 },
      { color: { r: 0.4, g: 0.2, b: 0.5, a: 1.0 }, stop: 0.5 },
      { color: { r: 0.6, g: 0.3, b: 0.4, a: 1.0 }, stop: 1 }
    ]);
    engine.block.setFill(page, gradientFill);

    // Add centered title text
    const pageWidth = engine.block.getWidth(page);
    const pageHeight = engine.block.getHeight(page);

    const titleText = engine.block.create('text');
    engine.block.replaceText(titleText, 'Configure your Editor');
    engine.block.setFloat(titleText, 'text/fontSize', 12);
    engine.block.setTextColor(titleText, { r: 1.0, g: 1.0, b: 1.0, a: 1.0 });
    engine.block.setWidthMode(titleText, 'Auto');
    engine.block.setHeightMode(titleText, 'Auto');
    engine.block.appendChild(page, titleText);

    // Add IMG.LY subtext
    const subtitleText = engine.block.create('text');
    engine.block.replaceText(subtitleText, 'Powered by IMG.LY');
    engine.block.setFloat(subtitleText, 'text/fontSize', 6);
    engine.block.setTextColor(subtitleText, { r: 0.9, g: 0.9, b: 0.9, a: 0.8 });
    engine.block.setWidthMode(subtitleText, 'Auto');
    engine.block.setHeightMode(subtitleText, 'Auto');
    engine.block.appendChild(page, subtitleText);

    // Center both texts
    const titleWidth = engine.block.getFrameWidth(titleText);
    const titleHeight = engine.block.getFrameHeight(titleText);
    const subtitleWidth = engine.block.getFrameWidth(subtitleText);
    const subtitleHeight = engine.block.getFrameHeight(subtitleText);

    const spacing = 12;
    const totalHeight = titleHeight + spacing + subtitleHeight;
    const startY = (pageHeight - totalHeight) / 2;

    engine.block.setPositionX(titleText, (pageWidth - titleWidth) / 2);
    engine.block.setPositionY(titleText, startY);
    engine.block.setPositionX(subtitleText, (pageWidth - subtitleWidth) / 2);
    engine.block.setPositionY(subtitleText, startY + titleHeight + spacing);

    // ========================================
    // Runtime Configuration: Theme
    // ========================================
    cesdk.ui.setTheme('light');
    const currentTheme = cesdk.ui.getTheme();
    console.log('Current theme:', currentTheme);

    // ========================================
    // Runtime Configuration: Scale
    // ========================================
    cesdk.ui.setScale('modern');
    const currentScale = cesdk.ui.getScale();
    console.log('Current scale:', currentScale);

    // ========================================
    // Runtime Configuration: Actions
    // ========================================
    cesdk.actions.register('customSave', async () => {
      const sceneBlob = await engine.scene.saveToArchive();
      await cesdk.utils.downloadFile(sceneBlob, 'application/zip');
    });

    // ========================================
    // Built-in Actions
    // ========================================
    // Add built-in export and import actions to the navigation bar
    cesdk.ui.insertOrderComponent({ in: 'ly.img.navigation.bar', position: 'end' }, {
      id: 'ly.img.actions.navigationBar',
      children: [
        'ly.img.saveScene.navigationBar',
        'ly.img.exportImage.navigationBar',
        'ly.img.exportPDF.navigationBar',
        'ly.img.exportScene.navigationBar',
        'ly.img.exportArchive.navigationBar',
        'ly.img.importScene.navigationBar',
        'ly.img.importArchive.navigationBar'
      ]
    });

    // ========================================
    // Engine Settings
    // ========================================
    engine.editor.setSetting('doubleClickToCropEnabled', true);
    engine.editor.setSetting('highlightColor', { r: 0, g: 0.5, b: 1, a: 1 });
    const cropEnabled = engine.editor.getSetting('doubleClickToCropEnabled');
    console.log('Double-click crop enabled:', cropEnabled);

    // ========================================
    // Internationalization: Locale
    // ========================================
    cesdk.i18n.setLocale('en');
    const currentLocale = cesdk.i18n.getLocale();
    console.log('Current locale:', currentLocale);

    // ========================================
    // Internationalization: Translations
    // ========================================
    cesdk.i18n.setTranslations({
      en: {
        'common.back': 'Go Back',
        'common.apply': 'Apply Changes'
      }
    });

    // Enable Auto-Fit Zoom
    engine.scene.zoomToBlock(page);
    engine.scene.enableZoomAutoFit(page, 'Horizontal', 40, 40);
  }
}

export default Example;
```

## Required Configuration

The `license` property is the only required configuration. All other properties have sensible defaults.

| Property | Type | Purpose |
|----------|------|---------|
| `license` | `string` | License key to remove export watermarks |

The license key validates your CE.SDK subscription and removes watermarks from exports. Get a free trial license at [https://img.ly/forms/free-trial](https://img.ly/forms/free-trial).

## Optional Configuration

These properties customize engine behavior and are all optional.

### Engine Properties

| Property | Type | Purpose |
|----------|------|---------|
| `baseURL` | `string` | Location of core engine assets (WASM, data files) |
| `userId` | `string` | User identifier for MAU tracking |
| `logger` | `function` | Custom logging function |
| `role` | `'Creator'` | `'Adopter'` | `'Viewer'` | `'Presenter'` | User role for feature access |
| `featureFlags` | `object` | Experimental feature toggles |

### Editor Properties

| Property | Type | Purpose |
|----------|------|---------|
| `devMode` | `boolean` | Enable developer diagnostics |
| `a11y` | `object` | Accessibility settings |
| `ui` | `object` | User interface customization |

## Configuration Properties

### License Key

The license key validates your CE.SDK subscription and removes watermarks from exports. Without a valid license, exports include a watermark.

```typescript highlight=highlight-license
// License key removes watermarks from exports
// Get a free trial at https://img.ly/forms/free-trial
// license: 'YOUR_CESDK_LICENSE_KEY',
```

### User ID

Provide a unique user identifier for accurate Monthly Active User (MAU) tracking. This helps count users correctly when the same person accesses your application from multiple devices.

```typescript highlight=highlight-userId
// User ID for accurate MAU tracking across devices
userId: 'guides-user',
```

### Custom Logger

Replace the default console logging with a custom logger function. The logger receives a message string and an optional log level (`'Info'`, `'Warning'`, or `'Error'`).

```typescript highlight=highlight-logger
// Custom logger for debugging and monitoring
logger: (message: string, level?: string) => {
  console.log(`[CE.SDK ${level ?? 'Info'}] ${message}`);
},
```

### Developer Mode

Enable developer mode to get additional diagnostics and debugging information in the console.

```typescript highlight=highlight-devMode
// Enable developer mode for diagnostics
devMode: false,
```

### Accessibility Settings

Configure accessibility options like heading hierarchy for screen readers. The `headingsHierarchyStart` property sets which heading level (1-6) the editor should start from.

```typescript highlight=highlight-a11y
// Accessibility settings
a11y: {
  headingsHierarchyStart: 1 as const
},
```

### Asset Base URL

The `baseURL` property specifies the location of core engine assets, including WASM files, data files, and JavaScript workers. By default, these load from the IMG.LY CDN. For production deployments, host these assets yourself by copying the `assets` folder from `node_modules/@cesdk/engine/assets` to your server.

Content assets like stickers and filters are loaded separately via `engine.addDefaultAssetSources()`, which has its own `baseURL` parameter defaulting to `https://cdn.img.ly/assets/v4`.

```typescript highlight=highlight-baseURL
// Location of core engine assets (WASM, data files)
// Default: IMG.LY CDN. For production, host assets yourself.
// baseURL: 'https://your-cdn.com/cesdk-assets/',
```

### Initialization

Pass the configuration object to `CreativeEditorSDK.create()` along with a container element selector.

```typescript highlight=highlight-create
CreativeEditorSDK.create('#cesdk_container', config)
  .then(async (cesdk: CreativeEditorSDK) => {
```

## Runtime Configuration

After initialization, use dedicated APIs to modify settings dynamically.

### Internationalization

#### Locale

Change the UI language using `cesdk.i18n.setLocale()`.

```typescript highlight=highlight-locale
cesdk.i18n.setLocale('en');
const currentLocale = cesdk.i18n.getLocale();
console.log('Current locale:', currentLocale);
```

#### Translations

Add or override UI text strings using `cesdk.i18n.setTranslations()`.

```typescript highlight=highlight-translations
cesdk.i18n.setTranslations({
  en: {
    'common.back': 'Go Back',
    'common.apply': 'Apply Changes'
  }
});
```

> **Note:** For complete localization including custom translations and RTL support, see [Localization](./user-interface/localization.md).

### Theme

Set the UI theme using `cesdk.ui.setTheme()`. Options: `'light'`, `'dark'`, or `'system'`.

```typescript highlight=highlight-theme
cesdk.ui.setTheme('light');
const currentTheme = cesdk.ui.getTheme();
console.log('Current theme:', currentTheme);
```

> **Note:** For advanced theming including custom CSS variables and color schemes, see [Theming](./user-interface/appearance/theming.md).

### Actions

Register custom actions for user interactions like save and export.

```typescript highlight=highlight-actions
cesdk.actions.register('customSave', async () => {
  const sceneBlob = await engine.scene.saveToArchive();
  await cesdk.utils.downloadFile(sceneBlob, 'application/zip');
});
```

### Built-in Actions

CE.SDK provides built-in actions for common operations like saving, exporting, and importing. Add them to the navigation bar using `insertOrderComponent()`:

```typescript highlight=highlight-builtin-actions
// Add built-in export and import actions to the navigation bar
cesdk.ui.insertOrderComponent({ in: 'ly.img.navigation.bar', position: 'end' }, {
  id: 'ly.img.actions.navigationBar',
  children: [
    'ly.img.saveScene.navigationBar',
    'ly.img.exportImage.navigationBar',
    'ly.img.exportPDF.navigationBar',
    'ly.img.exportScene.navigationBar',
    'ly.img.exportArchive.navigationBar',
    'ly.img.importScene.navigationBar',
    'ly.img.importArchive.navigationBar'
  ]
});
```

**Available built-in actions:**

| Action ID | Purpose |
|-----------|---------|
| `ly.img.saveScene.navigationBar` | Save scene to cloud |
| `ly.img.exportImage.navigationBar` | Export as image (PNG/JPEG) |
| `ly.img.exportPDF.navigationBar` | Export as PDF |
| `ly.img.exportScene.navigationBar` | Export scene file |
| `ly.img.exportArchive.navigationBar` | Export as archive (ZIP) |
| `ly.img.importScene.navigationBar` | Import scene file |
| `ly.img.importArchive.navigationBar` | Import archive (ZIP) |

> **Note:** For detailed navigation bar customization including adding buttons and rearranging elements, see [Navigation Bar](./user-interface/customization/navigation-bar.md).

> **Note:** For a complete guide on registering and managing actions, see [Actions](./actions.md).

### Scale

Adjust UI scale for different device types. Options: `'normal'`, `'large'`, or `'modern'`.

```typescript highlight=highlight-scale
cesdk.ui.setScale('modern');
const currentScale = cesdk.ui.getScale();
console.log('Current scale:', currentScale);
```

> **Note:** For advanced scale configuration including responsive callbacks, see [Theming](./user-interface/appearance/theming.md).

### Engine Settings

Configure engine behavior using `engine.editor.setSetting()`.

```typescript highlight=highlight-settings
engine.editor.setSetting('doubleClickToCropEnabled', true);
engine.editor.setSetting('highlightColor', { r: 0, g: 0.5, b: 1, a: 1 });
const cropEnabled = engine.editor.getSetting('doubleClickToCropEnabled');
console.log('Double-click crop enabled:', cropEnabled);
```

> **Note:** For a complete reference of available engine settings, see [Engine Interface](./engine-interface.md).

## API Reference

| Method | Purpose |
|--------|---------|
| `CreativeEditorSDK.create()` | Initialize editor |
| `cesdk.ui.setTheme()` | Set UI theme |
| `cesdk.i18n.setLocale()` | Set UI locale |
| `cesdk.i18n.setTranslations()` | Add translations |
| `cesdk.ui.setScale()` | Set UI scale |
| `cesdk.actions.register()` | Register custom actions |
| `cesdk.ui.insertOrderComponent()` | Add built-in actions to navigation bar |
| `cesdk.utils.downloadFile()` | Download blob as file |
| `engine.editor.setSetting()` | Set engine setting |

## Next Steps

- [Headless Mode](./concepts/headless-mode/browser.md) - Use CE.SDK without the UI



---

## More Resources

- **[Svelte Documentation Index](https://img.ly/svelte.md)** - Browse all Svelte documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./svelte.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
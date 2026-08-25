> This is one page of the CE.SDK React documentation. For a complete overview, see the [React Documentation Index](https://img.ly/docs/cesdk/react.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Plugins](./plugins.md) > [Custom Feature Plugin](./plugins/custom-plugin.md)

---

Package repeatable editor behavior in a custom Web plugin that can be applied
to any CE.SDK instance with `cesdk.addPlugin()`.

![Custom feature plugin button in the editor dock](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 7 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/plugins-custom-plugin-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/plugins-custom-plugin-browser)
>
> - [Live demo](https://cdn.img.ly/demo/cesdk-web-examples/v1.81.1-rc.0/examples/plugins-custom-plugin-browser/index.html)

A custom plugin groups callbacks, UI component changes, settings, and options into one unit that travels between projects. On the Web, a plugin implements the `EditorPlugin` interface and receives the CE.SDK instance and engine when it's applied — the same mechanism official `@imgly/plugin-*` packages and the editor configs use.

```typescript file=@cesdk_web_examples/plugins-custom-plugin-browser/browser.ts reference-only
import type {
  EditorPlugin,
  EditorPluginContext,
  EnginePlugin,
  EnginePluginContext
} from '@cesdk/cesdk-js';

import {
  BlurAssetSource,
  ImageColorsAssetSource,
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
import { DesignEditorConfig } from '@cesdk/core-configs-web/design-editor';
import packageJson from './package.json';

/**
 * CE.SDK Plugin: Custom Feature Plugin Guide
 *
 * Demonstrates building two reusable plugins:
 * - An editor plugin (CustomFeaturePlugin) that exposes options through
 *   its constructor, overrides the built-in export action, extends the
 *   dock and replaces the inspector bar
 * - An engine plugin (BrandAssetsPlugin) that extends engine
 *   functionality with a custom asset source and stays headless-safe
 */

interface CustomFeaturePluginOptions {
  /** Image added to the page by the custom dock button. */
  randomImageURL?: string;
  /** Whether the plugin adds its dock button. */
  showDockButton?: boolean;
}

class CustomFeaturePlugin implements EditorPlugin {
  name = 'custom-feature';

  version = '1.0.0';

  private options: Required<CustomFeaturePluginOptions>;

  constructor(options: CustomFeaturePluginOptions = {}) {
    this.options = {
      randomImageURL:
        options.randomImageURL ??
        'https://img.ly/static/ubq_samples/sample_1.jpg',
      showDockButton: options.showDockButton ?? true
    };
  }

  initialize({ cesdk }: EditorPluginContext): void {
    if (!cesdk) {
      throw new Error('CustomFeaturePlugin requires the editor');
    }

    // Replace the built-in export behavior. The plugin now owns the
    // complete export flow triggered by the navigation bar button.
    cesdk.actions.register('exportDesign', async (exportOptions) => {
      const { blobs, options } = await cesdk.utils.export({
        mimeType: 'image/png',
        ...exportOptions
      });
      await cesdk.utils.downloadFile(blobs[0], options.mimeType);
      cesdk.ui.showNotification({
        message: 'Export handled by CustomFeaturePlugin',
        type: 'info'
      });
    });

    // Register the custom dock buttons
    if (this.options.showDockButton) {
      cesdk.ui.registerComponent('customFeature.dock', ({ builder }) => {
        builder.Button('customFeature.dock.image', {
          label: 'Custom Image',
          icon: '@imgly/Image',
          onClick: async () => {
            await cesdk.engine.block.addImage(this.options.randomImageURL, {
              size: { width: 400, height: 300 }
            });
          }
        });
        builder.Button('customFeature.dock.export', {
          label: 'Custom Export',
          icon: '@imgly/Download',
          onClick: () => {
            cesdk.actions.run('exportDesign');
          }
        });
      });

      // Extend the existing dock order instead of replacing it —
      // the plugin's buttons go first, existing entries stay
      const order = cesdk.ui.getComponentOrder({ in: 'ly.img.dock' });
      cesdk.ui.setComponentOrder({ in: 'ly.img.dock' }, [
        'customFeature.dock',
        ...order
      ]);
    }

    // Replace the inspector bar with a focused set of approved controls
    cesdk.ui.setComponentOrder({ in: 'ly.img.inspector.bar' }, [
      'ly.img.spacer',
      'ly.img.fill.inspectorBar',
      'ly.img.separator',
      'ly.img.inspectorToggle.inspectorBar'
    ]);
  }
}

// An engine plugin only receives the engine in its context, so it also
// runs in headless setups. This one extends engine functionality with
// an asset source providing a single sticker asset.
class BrandAssetsPlugin implements EnginePlugin {
  name = 'brand-assets';

  version = '1.0.0';

  initialize({ engine }: EnginePluginContext): void {
    engine.asset.addLocalSource('brand-assets');
    engine.asset.addAssetToSource('brand-assets', {
      id: 'brand-sticker',
      label: { en: 'Brand Sticker' },
      meta: {
        uri: 'https://cdn.img.ly/assets/v3/ly.img.sticker/images/emoticons/imgly_sticker_emoticons_star.svg',
        thumbUri:
          'https://cdn.img.ly/assets/v3/ly.img.sticker/images/emoticons/imgly_sticker_emoticons_star.svg',
        blockType: '//ly.img.ubq/graphic',
        fillType: '//ly.img.ubq/fill/image',
        mimeType: 'image/svg+xml'
      }
    });
  }
}

class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    await cesdk.addPlugin(new DesignEditorConfig());

    // Add asset source plugins
    await cesdk.addPlugin(new BlurAssetSource());
    await cesdk.addPlugin(new ImageColorsAssetSource());
    await cesdk.addPlugin(new ColorPaletteAssetSource());
    await cesdk.addPlugin(new CropPresetsAssetSource());
    await cesdk.addPlugin(
      new UploadAssetSources({ include: ['ly.img.image.upload'] })
    );
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

    // Apply the editor plugin after the base editor setup
    await cesdk.addPlugin(
      new CustomFeaturePlugin({
        randomImageURL: 'https://img.ly/static/ubq_samples/sample_1.jpg'
      })
    );

    // Engine plugins attach to the engine — the same call works in
    // headless setups where no editor exists
    const engine = cesdk.engine;
    await engine.addPlugin(new BrandAssetsPlugin());

    // Add the engine plugin's asset as sample content
    const result = await engine.asset.findAssets('brand-assets', {
      page: 0,
      perPage: 10
    });
    const sticker = await engine.asset.apply('brand-assets', result.assets[0]);
    if (sticker != null) {
      engine.block.setWidth(sticker, 240);
      engine.block.setHeight(sticker, 240);
      engine.block.setPositionX(sticker, 480);
      engine.block.setPositionY(sticker, 240);
      engine.block.select(sticker);
    }

    // Label the custom functionality so it's easy to spot in the demo
    const page = engine.block.findByType('page')[0];
    const note = engine.block.create('text');
    engine.block.replaceText(
      note,
      'CustomFeaturePlugin (EditorPlugin):\n' +
        '← Custom Image & Custom Export dock buttons\n' +
        '↑ reduced inspector bar\n' +
        '\n' +
        'BrandAssetsPlugin (EnginePlugin):\n' +
        '→ sticker from its asset source'
    );
    engine.block.setTextFontSize(note, 24);
    engine.block.setWidth(note, 420);
    engine.block.setHeightMode(note, 'Auto');
    engine.block.setPositionX(note, 40);
    engine.block.setPositionY(note, 200);
    engine.block.appendChild(page, note);

    console.log('Custom feature plugin guide initialized successfully.');
  }
}

export default Example;
```

This guide covers deciding when a plugin is the right abstraction, creating a plugin class with options, applying it after the base editor setup, overriding the export action, extending the dock, replacing the inspector bar, and extending engine functionality with a second, engine-level plugin.

## When to Use Plugins

Start with inline configuration, or adapt a [Starter Kit](./starterkits.md), and create a custom plugin only when the same configuration needs to be reused across multiple editors or products. The [Plugin Architecture](./concepts/plugin-architecture.md) concept page covers this decision model in detail.

## What the Example Does

The example builds two plugins. `CustomFeaturePlugin` is an editor plugin applied on top of the design editor configuration:

- It replaces the built-in export action with its own export flow.
- It adds two custom buttons at the top of the existing dock, one of them triggering the export action.
- It replaces the inspector bar with a focused set of controls.
- It exposes `randomImageURL` and `showDockButton` as plugin options.

`BrandAssetsPlugin` is an engine plugin that extends engine functionality with a custom asset source. Because it only needs the engine, it also runs in headless setups.

## Create the Plugin

On the Web, a custom plugin is a class implementing `EditorPlugin` with a stable `name`, a `version`, and one `initialize` function. Options are passed through the constructor and stored for use during initialization:

```typescript highlight-plugin-class
class CustomFeaturePlugin implements EditorPlugin {
  name = 'custom-feature';

  version = '1.0.0';

  private options: Required<CustomFeaturePluginOptions>;

  constructor(options: CustomFeaturePluginOptions = {}) {
    this.options = {
      randomImageURL:
        options.randomImageURL ??
        'https://img.ly/static/ubq_samples/sample_1.jpg',
      showDockButton: options.showDockButton ?? true
    };
  }
```

CE.SDK calls `initialize` once when the plugin is applied and passes an `EditorPluginContext` containing the `cesdk` instance and the `engine`. Everything the plugin sets up — actions, UI components, settings, asset sources — happens inside this function. `initialize` can be async; `cesdk.addPlugin()` awaits it before resolving.

## Register Configuration Parameters

Options let the same plugin behave differently in different editors. Use a typed options object with defaults instead of hardcoding product-specific values:

```typescript highlight-plugin-options
interface CustomFeaturePluginOptions {
  /** Image added to the page by the custom dock button. */
  randomImageURL?: string;
  /** Whether the plugin adds its dock button. */
  showDockButton?: boolean;
}
```

## Apply the Plugin

Apply the plugin after the base editor configuration. The order matters: base editor setup first, reusable plugin second, app-specific edits last. `initialize` receives `cesdk` and `engine` in its context:

```typescript highlight-apply-plugin
// Apply the editor plugin after the base editor setup
await cesdk.addPlugin(
  new CustomFeaturePlugin({
    randomImageURL: 'https://img.ly/static/ubq_samples/sample_1.jpg'
  })
);
```

## Overriding the Export Action

A plugin can own a workflow completely. Registering `exportDesign` replaces the built-in export behavior, so the navigation bar's export button now runs the plugin's flow. Overriding means the plugin must provide the complete behavior for that action:

```typescript highlight-override-export
// Replace the built-in export behavior. The plugin now owns the
// complete export flow triggered by the navigation bar button.
cesdk.actions.register('exportDesign', async (exportOptions) => {
  const { blobs, options } = await cesdk.utils.export({
    mimeType: 'image/png',
    ...exportOptions
  });
  await cesdk.utils.downloadFile(blobs[0], options.mimeType);
  cesdk.ui.showNotification({
    message: 'Export handled by CustomFeaturePlugin',
    type: 'info'
  });
});
```

## Extending the Dock

Component customization follows the same decision as callbacks: extend when the plugin adds controls, replace when it owns the region. Here the plugin registers a component with two buttons — one adds an image, the other runs the overridden export action — then reads the current dock order with `cesdk.ui.getComponentOrder()` and puts the component first. Existing entries stay untouched:

```typescript highlight-extend-dock
    // Register the custom dock buttons
    if (this.options.showDockButton) {
      cesdk.ui.registerComponent('customFeature.dock', ({ builder }) => {
        builder.Button('customFeature.dock.image', {
          label: 'Custom Image',
          icon: '@imgly/Image',
          onClick: async () => {
            await cesdk.engine.block.addImage(this.options.randomImageURL, {
              size: { width: 400, height: 300 }
            });
          }
        });
        builder.Button('customFeature.dock.export', {
          label: 'Custom Export',
          icon: '@imgly/Download',
          onClick: () => {
            cesdk.actions.run('exportDesign');
          }
        });
      });

      // Extend the existing dock order instead of replacing it —
      // the plugin's buttons go first, existing entries stay
      const order = cesdk.ui.getComponentOrder({ in: 'ly.img.dock' });
      cesdk.ui.setComponentOrder({ in: 'ly.img.dock' }, [
        'customFeature.dock',
        ...order
      ]);
    }
```

## Replacing the Inspector Bar

For the inspector bar, the plugin intentionally sets a complete component order instead of extending the existing one. Replacement is appropriate when the plugin needs a focused editor surface with only approved controls:

```typescript highlight-replace-inspector-bar
// Replace the inspector bar with a focused set of approved controls
cesdk.ui.setComponentOrder({ in: 'ly.img.inspector.bar' }, [
  'ly.img.spacer',
  'ly.img.fill.inspectorBar',
  'ly.img.separator',
  'ly.img.inspectorToggle.inspectorBar'
]);
```

## Extending the Engine with a Plugin

Not every plugin needs the editor. An engine plugin implements `EnginePlugin` — the same contract with `name`, `version` and `initialize`, but its context contains only the `engine`. Use this shape when a plugin extends engine functionality such as asset sources, and it stays usable in headless setups:

```typescript highlight-engine-plugin
// An engine plugin only receives the engine in its context, so it also
// runs in headless setups. This one extends engine functionality with
// an asset source providing a single sticker asset.
class BrandAssetsPlugin implements EnginePlugin {
  name = 'brand-assets';

  version = '1.0.0';

  initialize({ engine }: EnginePluginContext): void {
    engine.asset.addLocalSource('brand-assets');
    engine.asset.addAssetToSource('brand-assets', {
      id: 'brand-sticker',
      label: { en: 'Brand Sticker' },
      meta: {
        uri: 'https://cdn.img.ly/assets/v3/ly.img.sticker/images/emoticons/imgly_sticker_emoticons_star.svg',
        thumbUri:
          'https://cdn.img.ly/assets/v3/ly.img.sticker/images/emoticons/imgly_sticker_emoticons_star.svg',
        blockType: '//ly.img.ubq/graphic',
        fillType: '//ly.img.ubq/fill/image',
        mimeType: 'image/svg+xml'
      }
    });
  }
}
```

Engine plugins are registered on the engine instead of the editor:

```typescript highlight-apply-engine-plugin
// Engine plugins attach to the engine — the same call works in
// headless setups where no editor exists
const engine = cesdk.engine;
await engine.addPlugin(new BrandAssetsPlugin());
```

The [Plugin Architecture](./concepts/plugin-architecture.md) concept page explains when to choose which layer.

## Troubleshooting

- **A dock or inspector item disappears**: The plugin replaced a component order instead of extending it. Use `cesdk.ui.getComponentOrder()` as the source when adding controls.
- **Export behavior runs twice**: The plugin both delegates and performs the full export. Choose extension or replacement per action, then document that choice.
- **Plugin options don't apply**: The option is read before the plugin is constructed with it. Pass options through the constructor and read them inside `initialize`.
- **The custom dock button does nothing**: The component was registered but not placed. Add its ID to the dock order with `cesdk.ui.setComponentOrder()` or `cesdk.ui.insertOrderComponent()`.

## Next Steps

- [Plugin Architecture](./concepts/plugin-architecture.md) - How plugins fit together in CE.SDK
- [Customize the Dock](./user-interface/customization/dock.md) - Dock customization in depth
- [Customize the Inspector Bar](./user-interface/customization/inspector-bar.md) - Inspector bar customization in depth
- [Register a New Component](./user-interface/ui-extensions/register-new-component.md) - Custom UI components



---

## More Resources

- **[React Documentation Index](https://img.ly/docs/cesdk/react.md)** - Browse all React documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./react.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
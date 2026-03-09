> This is one page of the CE.SDK Vue documentation. For a complete overview, see the [Vue Documentation Index](https://img.ly/vue.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [User Interface](./user-interface.md) > [Customization](./user-interface/customization.md) > [Page Format](./user-interface/customization/page-format.md)

---

CE.SDK includes a built-in page format selector in the resize panel that lets users choose from predefined page sizes. You can customize which formats appear by registering custom asset sources. This is useful when offering print-ready formats, specific social media dimensions, or limiting available sizes for brand consistency.

![Page Format example showing custom page format presets in the CE.SDK resize panel](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

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
> - [Live demo](https://img.ly/examples/guides-user-interface-customization-page-format-browser/)

```typescript file=@cesdk_web_examples/guides-user-interface-customization-page-format-browser/browser.ts reference-only
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
 * CE.SDK Plugin: Page Format Customization Guide
 *
 * This example demonstrates:
 * - Creating custom page format presets
 * - Configuring page dimensions with different design units
 * - Registering custom page formats with the UI
 * - Setting a default page format
 * - Controlling orientation behavior
 */
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

    const engine = cesdk.engine;

    // Create a local asset source to hold custom page formats
    engine.asset.addLocalSource('my-custom-formats');

    // Add print formats using millimeter dimensions
    engine.asset.addAssetToSource('my-custom-formats', {
      id: 'a4-portrait',
      label: { en: 'A4 Portrait' },
      payload: {
        transformPreset: {
          type: 'FixedSize',
          width: 210,
          height: 297,
          designUnit: 'Millimeter'
        }
      },
      meta: { default: 'true' }
    });
    engine.asset.addAssetToSource('my-custom-formats', {
      id: 'a5-landscape',
      label: { en: 'A5 Landscape' },
      payload: {
        transformPreset: {
          type: 'FixedSize',
          width: 210,
          height: 148,
          designUnit: 'Millimeter'
        }
      }
    });

    // Add digital format using pixel dimensions
    engine.asset.addAssetToSource('my-custom-formats', {
      id: 'instagram-square',
      label: { en: 'Instagram Square' },
      payload: {
        transformPreset: {
          type: 'FixedSize',
          width: 1080,
          height: 1080,
          designUnit: 'Pixel'
        }
      },
      meta: { fixedOrientation: 'true' }
    });

    // Add format using inch dimensions
    engine.asset.addAssetToSource('my-custom-formats', {
      id: 'letter',
      label: { en: 'US Letter' },
      payload: {
        transformPreset: {
          type: 'FixedSize',
          width: 8.5,
          height: 11,
          designUnit: 'Inch'
        }
      }
    });

    // Register custom formats with the page format selector
    cesdk.ui.updateAssetLibraryEntry('ly.img.pagePresets', {
      sourceIds: ['my-custom-formats']
    });

    // Register middleware to apply formats to existing pages instead of creating new ones
    engine.asset.registerApplyMiddleware(async (sourceId, asset) => {
      if (sourceId === 'my-custom-formats') {
        const pages = engine.block.findByType('page');
        if (pages.length > 0) {
          await engine.asset.applyToBlock(sourceId, asset, pages[0]);
          await engine.scene.zoomToBlock(pages[0]);
        }
        return true;
      }
      return false;
    });

    await cesdk.actions.run('scene.create', {
      page: {
        sourceId: 'ly.img.page.presets',
        assetId: 'ly.img.page.presets.print.iso.a6.landscape'
      }
    });

    // Zoom to fit the page in the viewport
    const pages = engine.block.findByType('page');
    if (pages.length > 0) {
      await engine.scene.zoomToBlock(pages[0], {
        padding: {
          left: 40,
          top: 40,
          right: 40,
          bottom: 40
        }
      });
    }

    // Open the page resize panel on startup
    cesdk.ui.openPanel('//ly.img.panel/inspector/pageResize');
  }
}

export default Example;
```

This guide covers how to create custom page format presets, configure dimensions using different design units, and register formats with the built-in resize panel.

## Using the Built-in Page Format UI

The page format selector is part of the resize panel, which users with the Creator [role](./concepts/editing-workflow.md) can access from the document inspector. When a user selects a format, the page dimensions change accordingly. The orientation toggle allows switching between portrait and landscape unless the format has a fixed orientation.

To display custom formats in this panel, you register them with the `ly.img.pagePresets` asset library entry using `updateAssetLibraryEntry`. Your custom formats then appear alongside or replace the default options.

## Adding Default Asset Sources

Before adding custom formats, we load the default CE.SDK asset sources to ensure the editor has access to standard assets for design mode.

```typescript highlight-add-default-sources
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
```

## Creating a Custom Page Format Source

We create a local asset source to hold our custom page formats. Each format is added as an asset with a `payload.transformPreset` property that defines its dimensions.

```typescript highlight-create-local-source
// Create a local asset source to hold custom page formats
engine.asset.addLocalSource('my-custom-formats');
```

## Adding Page Format Assets

Each page format asset requires a `payload.transformPreset` configuration with the following properties:

- **`type`**: Must be `'FixedSize'` for page format presets
- **`width`**: Page width in the specified design unit
- **`height`**: Page height in the specified design unit
- **`designUnit`**: Unit for dimensions (`'Pixel'`, `'Millimeter'`, or `'Inch'`)

You can also set optional properties in the `meta` object:

- **`default`**: Boolean to mark as the default format applied when creating new scenes
- **`fixedOrientation`**: Boolean to prevent orientation changes in the UI

### Using Millimeter Dimensions

For print formats, we specify dimensions in millimeters. Setting `default: true` on a format makes it the initial page size when creating a new scene.

```typescript highlight-add-page-formats
// Add print formats using millimeter dimensions
engine.asset.addAssetToSource('my-custom-formats', {
  id: 'a4-portrait',
  label: { en: 'A4 Portrait' },
  payload: {
    transformPreset: {
      type: 'FixedSize',
      width: 210,
      height: 297,
      designUnit: 'Millimeter'
    }
  },
  meta: { default: 'true' }
});
engine.asset.addAssetToSource('my-custom-formats', {
  id: 'a5-landscape',
  label: { en: 'A5 Landscape' },
  payload: {
    transformPreset: {
      type: 'FixedSize',
      width: 210,
      height: 148,
      designUnit: 'Millimeter'
    }
  }
});
```

### Using Pixel Dimensions

For digital formats like social media, we use pixel dimensions. Setting `fixedOrientation: true` disables the orientation toggle for formats where aspect ratio should not change.

```typescript highlight-add-pixel-format
// Add digital format using pixel dimensions
engine.asset.addAssetToSource('my-custom-formats', {
  id: 'instagram-square',
  label: { en: 'Instagram Square' },
  payload: {
    transformPreset: {
      type: 'FixedSize',
      width: 1080,
      height: 1080,
      designUnit: 'Pixel'
    }
  },
  meta: { fixedOrientation: 'true' }
});
```

### Using Inch Dimensions

For formats common in regions using imperial measurements, we specify dimensions in inches.

```typescript highlight-add-inch-format
// Add format using inch dimensions
engine.asset.addAssetToSource('my-custom-formats', {
  id: 'letter',
  label: { en: 'US Letter' },
  payload: {
    transformPreset: {
      type: 'FixedSize',
      width: 8.5,
      height: 11,
      designUnit: 'Inch'
    }
  }
});
```

## Registering Custom Sources with the UI

We use `updateAssetLibraryEntry` to configure which sources appear in the page format selector. The `ly.img.pagePresets` entry ID controls the resize panel's page format UI.

```typescript highlight-register-ui
// Register custom formats with the page format selector
cesdk.ui.updateAssetLibraryEntry('ly.img.pagePresets', {
  sourceIds: ['my-custom-formats']
});
```

By specifying only our custom source ID, we replace the default formats entirely. To keep the default formats alongside custom ones, include `'ly.img.page.presets'` in the `sourceIds` array:

```typescript
cesdk.ui.updateAssetLibraryEntry('ly.img.pagePresets', {
  sourceIds: ['ly.img.page.presets', 'my-custom-formats']
});
```

## Applying Formats to Existing Pages

By default, applying a page format from the resize panel creates a new page with that format. To apply formats to an existing page instead, we register an apply middleware that intercepts format application.

```typescript highlight-apply-middleware
// Register middleware to apply formats to existing pages instead of creating new ones
engine.asset.registerApplyMiddleware(async (sourceId, asset) => {
  if (sourceId === 'my-custom-formats') {
    const pages = engine.block.findByType('page');
    if (pages.length > 0) {
      await engine.asset.applyToBlock(sourceId, asset, pages[0]);
      await engine.scene.zoomToBlock(pages[0]);
    }
    return true;
  }
  return false;
});
```

The middleware checks if the applied asset comes from your custom format source. If so, it applies the format to the first page using `applyToBlock` instead of creating a new page. After applying, it zooms to show the updated page dimensions.

## Page Orientation

Orientation is determined by the width and height values in the format definition. When width is greater than height, the format defaults to landscape. When height is greater than width, it defaults to portrait.

Users can toggle orientation in the resize panel unless `fixedOrientation` is set to `true` in the preset. This is useful for formats like Instagram Square where the 1:1 aspect ratio should remain fixed.

## Creating the Scene

After configuring the page formats, we create a design scene. The format marked with `default: true` is automatically applied.

```typescript highlight-create-scene
await cesdk.actions.run('scene.create', {
  page: {
    sourceId: 'ly.img.page.presets',
    assetId: 'ly.img.page.presets.print.iso.a6.landscape'
  }
});
```

## Opening the Resize Panel on Startup

To give users immediate access to page formats when the editor loads, we open the resize panel programmatically after creating the scene.

```typescript highlight-open-resize-panel
// Open the page resize panel on startup
cesdk.ui.openPanel('//ly.img.panel/inspector/pageResize');
```

## Troubleshooting

- **Custom formats not appearing**: Verify the source is registered with `updateAssetLibraryEntry` before creating the scene
- **Default format not applied**: Ensure the asset source with the default format is loaded before scene initialization
- **Orientation toggle disabled**: Check if `fixedOrientation` is set to `true` in the preset

## API Reference

| Method | Category | Description |
|--------|----------|-------------|
| `cesdk.addDefaultAssetSources()` | CESDK | Load default CE.SDK asset sources including page presets |
| `cesdk.engine.asset.addLocalSource(sourceId)` | Asset | Create a new local asset source for page formats |
| `cesdk.engine.asset.addAssetToSource(sourceId, asset)` | Asset | Add a page format asset to a local source |
| `cesdk.engine.asset.registerApplyMiddleware(middleware)` | Asset | Register middleware to intercept asset application |
| `cesdk.engine.asset.applyToBlock(sourceId, asset, block)` | Asset | Apply an asset to a specific block |
| `cesdk.ui.updateAssetLibraryEntry(id, options)` | UI | Configure which sources appear in the page format selector |
| `cesdk.ui.openPanel(panelId)` | UI | Open a panel programmatically |



---

## More Resources

- **[Vue Documentation Index](https://img.ly/vue.md)** - Browse all Vue documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./vue.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
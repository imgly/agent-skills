> This is one page of the CE.SDK Next.js documentation. For a complete overview, see the [Next.js Documentation Index](https://img.ly/nextjs.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Create and Use Templates](./create-templates.md) > [Import Templates](./create-templates/import.md)

---

Load design templates into CE.SDK from archive URLs, scene URLs, and serialized strings.

![Import Templates](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/guides-create-templates-import-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/main/guides-create-templates-import-browser)
>
> - [Live demo](https://img.ly/examples/guides-create-templates-import-browser/)

Templates are pre-designed scenes that provide starting points for user projects. CE.SDK supports loading templates from archive URLs with bundled assets, remote scene URLs, or serialized strings stored in databases.

```typescript file=@cesdk_web_examples/guides-create-templates-import-browser/browser.ts reference-only
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

// Import scene file as string for loadFromString demonstration
import businessCardSceneString from './assets/business-card.scene?raw';

// Template sources
const fashionAdArchiveUrl =
  'https://cdn.img.ly/assets/templates/starterkits/16-9-fashion-ad.zip';

const postcardSceneUrl =
  'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_postcard_1.scene';

/**
 * CE.SDK Plugin: Import Templates
 *
 * Demonstrates loading templates from different sources:
 * - Archive URLs (.zip files with bundled assets)
 * - Scene URLs (.scene files)
 * - Serialized strings (imported scene content)
 */
class Example implements EditorPlugin {
  name = packageJson.name;
  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (cesdk == null) {
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

    // Load template from a scene file URL
    await engine.scene.loadFromURL(postcardSceneUrl);

    // Zoom viewport to fit the loaded scene
    const scene = engine.scene.get();
    if (scene != null) {
      await engine.scene.zoomToBlock(scene, { padding: 40 });
    }

    // Verify the loaded scene
    const loadedScene = engine.scene.get();
    if (loadedScene != null) {
      const pages = engine.scene.getPages();
      // eslint-disable-next-line no-console
      console.log(`Template loaded with ${pages.length} page(s)`);
    }

    // Configure navigation bar with template loading buttons
    cesdk.ui.setComponentOrder({ in: 'ly.img.navigation.bar' }, [
      'ly.img.undoRedo.navigationBar',
      'ly.img.spacer',
      {
        id: 'ly.img.action.navigationBar',
        key: 'load-archive',
        label: 'Import Archive',
        icon: '@imgly/Download',
        variant: 'regular',
        onClick: async () => {
          // Load template from archive URL (bundled assets)
          await engine.scene.loadFromArchiveURL(fashionAdArchiveUrl);
          const s = engine.scene.get();
          if (s != null) {
            await engine.scene.zoomToBlock(s, { padding: 40 });
          }
        }
      },
      {
        id: 'ly.img.action.navigationBar',
        key: 'load-url',
        label: 'Import URL',
        icon: '@imgly/Download',
        variant: 'regular',
        onClick: async () => {
          // Load template from scene URL
          await engine.scene.loadFromURL(postcardSceneUrl);
          const s = engine.scene.get();
          if (s != null) {
            await engine.scene.zoomToBlock(s, { padding: 40 });
          }
        }
      },
      {
        id: 'ly.img.action.navigationBar',
        key: 'load-string',
        label: 'Import String',
        icon: '@imgly/Download',
        variant: 'regular',
        onClick: async () => {
          // Load template from serialized string
          await engine.scene.loadFromString(businessCardSceneString);
          const s = engine.scene.get();
          if (s != null) {
            await engine.scene.zoomToBlock(s, { padding: 40 });
          }
        }
      }
    ]);
  }
}

export default Example;
```

This guide covers how to load templates from archives, URLs, and strings, and work with the loaded content.

## Load from Archive

Load a template from an archive URL using `loadFromArchiveURL()`. Archives are `.zip` files that bundle the scene with all its assets, making them portable and self-contained.

```typescript highlight=highlight-load-from-archive
// Load template from archive URL (bundled assets)
await engine.scene.loadFromArchiveURL(fashionAdArchiveUrl);
```

## Load from URL

Load a template from a remote `.scene` file URL using `loadFromURL()`. The scene file is a JSON-based format that references assets via URLs.

```typescript highlight=highlight-load-from-url
// Load template from a scene file URL
await engine.scene.loadFromURL(postcardSceneUrl);
```

## Load from String

For templates stored in databases or received from APIs, load from a serialized string using `loadFromString()`. This method works with content previously saved using `engine.scene.saveToString()`.

```typescript highlight=highlight-load-from-string
// Load template from serialized string
await engine.scene.loadFromString(businessCardSceneString);
```

## Working with the Loaded Scene

After loading a template, you can verify its contents and adjust the viewport.

### Verify the Scene

Use `engine.scene.get()` to retrieve the scene block and `engine.scene.getPages()` to inspect its pages.

```typescript highlight=highlight-get-scene
// Verify the loaded scene
const loadedScene = engine.scene.get();
if (loadedScene != null) {
  const pages = engine.scene.getPages();
  // eslint-disable-next-line no-console
  console.log(`Template loaded with ${pages.length} page(s)`);
}
```

### Zoom to Content

Fit the loaded template in the viewport using `zoomToBlock()` with optional padding.

```typescript highlight=highlight-zoom-to-scene
// Zoom viewport to fit the loaded scene
const scene = engine.scene.get();
if (scene != null) {
  await engine.scene.zoomToBlock(scene, { padding: 40 });
}
```



---

## Related Pages

- [Import Templates from Scene Files](./create-templates/import/from-scene-file.md) - Load and import templates from scene files in CE.SDK for web applications


---

## More Resources

- **[Next.js Documentation Index](https://img.ly/nextjs.md)** - Browse all Next.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./nextjs.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
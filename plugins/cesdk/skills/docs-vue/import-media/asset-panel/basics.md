> This is one page of the CE.SDK Vue documentation. For a complete overview, see the [Vue Documentation Index](https://img.ly/vue.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Import Media Assets](./import-media.md) > [Asset Library](./import-media/asset-library.md) > [Basics](./import-media/asset-panel/basics.md)

---

CE.SDK treats all insertable content as assets—images, videos, audio, stickers, shapes, templates, and text presets flow through a unified asset system.

![Asset Library Basics example showing the CE.SDK editor with a custom asset library entry in the dock](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/guides-import-media-asset-library-basics-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/main/guides-import-media-asset-library-basics-browser)
>
> - [Live demo](https://img.ly/examples/guides-import-media-asset-library-basics-browser/)

The asset library connects the engine to the user interface through three layers:

```
┌─────────────────────────────────────────────────────────────┐
│  User Interface                                             │
│  ┌─────────────┐    references    ┌──────────────────────┐  │
│  │  Dock Entry │ ───────────────▶ │ Asset Library Entry  │  │
│  │  (Button)   │                  │ (Display Config)     │  │
│  └─────────────┘                  └──────────┬───────────┘  │
│                                              │ queries      │
├──────────────────────────────────────────────│──────────────┤
│  Engine                                      ▼              │
│                                   ┌──────────────────────┐  │
│                                   │    Asset Source      │  │
│                                   │    (Data Provider)   │  │
│                                   └──────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

The following example demonstrates all three layers working together:

```typescript file=@cesdk_web_examples/guides-import-media-asset-library-basics-browser/browser.ts reference-only
import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';

/**
 * CE.SDK Plugin: Asset Library Basics Guide
 *
 * Demonstrates the asset library architecture:
 * - Creating a custom asset source (engine layer)
 * - Creating an asset library entry (UI configuration layer)
 * - Connecting the entry to the dock (UI interaction layer)
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({ sceneMode: 'Design' });
    await cesdk.createDesignScene();

    // Layer 1: Asset Source - provides assets to the UI
    cesdk.engine.asset.addSource({
      id: 'my-custom-images',
      findAssets: async () => ({
        assets: [
          {
            id: 'sample-1',
            meta: {
              uri: 'https://img.ly/static/ubq_samples/sample_1.jpg',
              thumbUri: 'https://img.ly/static/ubq_samples/sample_1.jpg',
              width: 1920,
              height: 1280
            }
          },
          {
            id: 'sample-2',
            meta: {
              uri: 'https://img.ly/static/ubq_samples/sample_2.jpg',
              thumbUri: 'https://img.ly/static/ubq_samples/sample_2.jpg',
              width: 1920,
              height: 1280
            }
          },
          {
            id: 'sample-3',
            meta: {
              uri: 'https://img.ly/static/ubq_samples/sample_3.jpg',
              thumbUri: 'https://img.ly/static/ubq_samples/sample_3.jpg',
              width: 1920,
              height: 1280
            }
          }
        ],
        total: 3,
        currentPage: 1,
        nextPage: undefined
      }),
      applyAsset: async (assetResult) =>
        cesdk.engine.asset.defaultApplyAsset(assetResult)
    });

    // Layer 2: Asset Library Entry - connects sources to display settings
    cesdk.ui.addAssetLibraryEntry({
      id: 'my-images-entry',
      sourceIds: ['my-custom-images'],
      previewLength: 3,
      gridColumns: 3,
      gridItemHeight: 'square'
    });

    // Layer 3: Dock - adds button to access the entry
    cesdk.ui.setComponentOrder({ in: 'ly.img.dock' }, [
      {
        id: 'ly.img.assetLibrary.dock',
        key: 'my-images-entry',
        label: 'libraries.my-images-entry.label',
        entries: ['my-images-entry']
      },
      ...cesdk.ui.getComponentOrder({ in: 'ly.img.dock' })
    ]);
    cesdk.i18n.setTranslations({
      en: { 'libraries.my-images-entry.label': 'My Images' }
    });

    // Query registered entries
    const allEntries = cesdk.ui.findAllAssetLibraryEntries();
    console.log('Registered entries:', allEntries);

    const myEntry = cesdk.ui.getAssetLibraryEntry('my-images-entry');
    console.log('My entry:', myEntry);

    // Open the panel to show the custom assets immediately
    cesdk.ui.openPanel('//ly.img.panel/assetLibrary', {
      payload: { entries: ['my-images-entry'] }
    });
  }
}

export default Example;
```

This guide covers:

- Registering asset sources with the engine
- Creating asset library entries to configure display settings
- Adding entries to the dock for user access

## Layer 1: Asset Source

Asset sources provide data through `findAssets` and handle insertion through `applyAsset`. Register them with `engine.asset.addSource()`.

```typescript highlight=highlight-asset-source
// Layer 1: Asset Source - provides assets to the UI
cesdk.engine.asset.addSource({
  id: 'my-custom-images',
  findAssets: async () => ({
    assets: [
      {
        id: 'sample-1',
        meta: {
          uri: 'https://img.ly/static/ubq_samples/sample_1.jpg',
          thumbUri: 'https://img.ly/static/ubq_samples/sample_1.jpg',
          width: 1920,
          height: 1280
        }
      },
      {
        id: 'sample-2',
        meta: {
          uri: 'https://img.ly/static/ubq_samples/sample_2.jpg',
          thumbUri: 'https://img.ly/static/ubq_samples/sample_2.jpg',
          width: 1920,
          height: 1280
        }
      },
      {
        id: 'sample-3',
        meta: {
          uri: 'https://img.ly/static/ubq_samples/sample_3.jpg',
          thumbUri: 'https://img.ly/static/ubq_samples/sample_3.jpg',
          width: 1920,
          height: 1280
        }
      }
    ],
    total: 3,
    currentPage: 1,
    nextPage: undefined
  }),
  applyAsset: async (assetResult) =>
    cesdk.engine.asset.defaultApplyAsset(assetResult)
});
```

For details on asset source configuration, see the [Asset Sources concept](./import-media/concepts.md).

## Layer 2: Asset Library Entry

Entries connect asset sources to display settings. Create them with `cesdk.ui.addAssetLibraryEntry()`.

```typescript highlight=highlight-asset-entry
// Layer 2: Asset Library Entry - connects sources to display settings
cesdk.ui.addAssetLibraryEntry({
  id: 'my-images-entry',
  sourceIds: ['my-custom-images'],
  previewLength: 3,
  gridColumns: 3,
  gridItemHeight: 'square'
});
```

For display properties like `gridColumns` and `previewLength`, see the [Thumbnails](./import-media/asset-panel/thumbnails.md) guide.

## Layer 3: Dock

Add entries to the dock with `cesdk.ui.setComponentOrder({ in: 'ly.img.dock' }, order)` using the `ly.img.assetLibrary.dock` component type.

```typescript highlight=highlight-dock-entry
// Layer 3: Dock - adds button to access the entry
cesdk.ui.setComponentOrder({ in: 'ly.img.dock' }, [
  {
    id: 'ly.img.assetLibrary.dock',
    key: 'my-images-entry',
    label: 'libraries.my-images-entry.label',
    entries: ['my-images-entry']
  },
  ...cesdk.ui.getComponentOrder({ in: 'ly.img.dock' })
]);
cesdk.i18n.setTranslations({
  en: { 'libraries.my-images-entry.label': 'My Images' }
});
```

## Managing Entries

Query and inspect registered entries:

```typescript highlight=highlight-list-entries
    // Query registered entries
    const allEntries = cesdk.ui.findAllAssetLibraryEntries();
    console.log('Registered entries:', allEntries);

    const myEntry = cesdk.ui.getAssetLibraryEntry('my-images-entry');
    console.log('My entry:', myEntry);
```

## API Reference

| Method | Description |
|--------|-------------|
| `findAllAssetLibraryEntries()` | List all registered entry IDs |
| `getAssetLibraryEntry(id)` | Get entry configuration |
| `addAssetLibraryEntry(entry)` | Register a new entry |
| `removeAssetLibraryEntry(id)` | Remove an entry |

## Next Steps

- [Customize](./import-media/asset-panel/customize.md) — Icons, i18n, replace libraries
- [Thumbnails](./import-media/asset-panel/thumbnails.md) — Thumbnail URIs, display settings
- [Refresh Assets](./import-media/asset-panel/refresh-assets.md) — Trigger asset reloads
- [Asset Sources](./import-media/concepts.md) — Creating asset sources



---

## More Resources

- **[Vue Documentation Index](https://img.ly/vue.md)** - Browse all Vue documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./vue.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
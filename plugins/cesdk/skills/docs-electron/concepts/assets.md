> This is one page of the CE.SDK Electron documentation. For a complete overview, see the [Electron Documentation Index](https://img.ly/docs/cesdk/electron.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Concepts](./concepts.md) > [Assets](./concepts/assets.md)

---

Understand the asset system—how external media and resources like images, stickers, or videos are handled in CE.SDK.

![Assets example showing asset source and applied content](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-concepts-assets-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-concepts-assets-browser)
>
> - [Live demo](https://img.ly/docs/cesdk/examples/guides-concepts-assets-browser/)

Images, videos, audio, fonts, stickers, and templates—every premade resource you can add to a design is what we call an *Asset*. The editor gets access to these Assets through *Asset Sources*. When you apply an Asset, CE.SDK creates or modifies a Block to display that content.

```typescript file=@cesdk_web_examples/guides-concepts-assets-browser/browser.ts reference-only
import type {
  AssetQueryData,
  AssetResult,
  AssetSource,
  AssetsQueryResult,
  EditorPlugin,
  EditorPluginContext
} from '@cesdk/cesdk-js';
import packageJson from './package.json';

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

/**
 * CE.SDK Plugin: Assets Concepts Guide
 *
 * Demonstrates the core concepts of the asset system:
 * - What assets are and how they differ from blocks
 * - Creating and registering asset sources
 * - Querying and applying assets
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
      page: {
        sourceId: 'ly.img.page.presets',
        assetId: 'ly.img.page.presets.print.iso.a6.landscape'
      }
    });
    const engine = cesdk.engine;

    // An asset is a content definition with metadata
    // It describes content that can be added to designs
    const stickerAsset: AssetResult = {
      id: 'sticker-smile',
      label: 'Smile Sticker',
      tags: ['emoji', 'happy'],
      groups: ['stickers'],
      meta: {
        uri: 'https://cdn.img.ly/assets/v3/ly.img.sticker/images/emoticons/imgly_sticker_emoticons_smile.svg',
        thumbUri:
          'https://cdn.img.ly/assets/v3/ly.img.sticker/images/emoticons/imgly_sticker_emoticons_smile.svg',
        blockType: '//ly.img.ubq/graphic',
        fillType: '//ly.img.ubq/fill/image',
        width: 62,
        height: 58,
        mimeType: 'image/svg+xml'
      }
    };

    // Asset sources provide assets to the editor
    // Each source has an id and a findAssets() method
    const customSource: AssetSource = {
      id: 'my-assets',

      async findAssets(query: AssetQueryData): Promise<AssetsQueryResult> {
        // Return paginated results matching the query
        return {
          assets: [stickerAsset],
          total: 1,
          currentPage: query.page,
          nextPage: undefined
        };
      }
    };

    engine.asset.addSource(customSource);

    // Query assets from a source
    const results = await engine.asset.findAssets('my-assets', {
      page: 0,
      perPage: 10
    });
    console.log('Found assets:', results.total);

    // Narrow a query with structured predicates. The top-level array is
    // an implicit AND of its entries.
    const happyStickers = await engine.asset.findAssets('my-assets', {
      page: 0,
      perPage: 10,
      filter: [
        // Either tag matches (combinators nest arbitrarily).
        {
          or: [
            { property: 'tags', equals: 'happy' },
            { property: 'tags', equals: 'celebratory' }
          ]
        },
        // Exclude archived items.
        { not: { property: 'meta.kind', equals: 'archived' } }
      ]
    });
    console.log('Filtered stickers:', happyStickers.total);

    // Apply an asset to create a block in the scene
    if (results.assets.length > 0) {
      const blockId = await engine.asset.apply('my-assets', results.assets[0]);
      console.log('Created block:', blockId);

      // Center the sticker on the page
      const page = engine.scene.getCurrentPage();
      if (page && blockId) {
        const pageWidth = engine.block.getWidth(page);
        const pageHeight = engine.block.getHeight(page);
        // SVG is 62x58, scale to fit nicely
        const stickerWidth = 62;
        const stickerHeight = 58;
        engine.block.setWidth(blockId, stickerWidth);
        engine.block.setHeight(blockId, stickerHeight);
        engine.block.setPositionX(blockId, (pageWidth - stickerWidth) / 2);
        engine.block.setPositionY(blockId, (pageHeight - stickerHeight) / 2);
      }
    }

    // Local sources support dynamic add/remove operations
    engine.asset.addLocalSource('uploads', ['image/svg+xml', 'image/png']);

    engine.asset.addAssetToSource('uploads', {
      id: 'uploaded-1',
      label: { en: 'Heart Sticker' },
      meta: {
        uri: 'https://cdn.img.ly/assets/v3/ly.img.sticker/images/emoticons/imgly_sticker_emoticons_love.svg',
        thumbUri:
          'https://cdn.img.ly/assets/v3/ly.img.sticker/images/emoticons/imgly_sticker_emoticons_love.svg',
        blockType: '//ly.img.ubq/graphic',
        fillType: '//ly.img.ubq/fill/image',
        mimeType: 'image/svg+xml'
      }
    });

    // Subscribe to asset source lifecycle events
    const unsubscribe = engine.asset.onAssetSourceUpdated((sourceId) => {
      console.log('Source updated:', sourceId);
    });

    // Notify that source contents changed
    engine.asset.assetSourceContentsChanged('uploads');

    unsubscribe();
  }
}

export default Example;
```

This guide covers the core concepts of the Asset system. For detailed instructions on inserting specific media types, see the [Images](./insert-media/images.md), [Videos](./insert-media/videos.md), and [Shapes & Stickers](./insert-media/shapes-or-stickers.md) guides.

## Assets vs Blocks

**Assets** are content definitions with metadata (URIs, dimensions, labels) that exist outside the scene. **Blocks** are the visual elements in the scene tree that display content.

When you apply an asset, CE.SDK creates a block configured according to the asset's properties. Multiple blocks can reference the same asset, and assets can exist without being used in any block.

## The Asset Data Model

An asset describes content that can be added to designs. Each asset has an `id` and optional properties:

```typescript highlight-asset-definition
// An asset is a content definition with metadata
// It describes content that can be added to designs
const stickerAsset: AssetResult = {
  id: 'sticker-smile',
  label: 'Smile Sticker',
  tags: ['emoji', 'happy'],
  groups: ['stickers'],
  meta: {
    uri: 'https://cdn.img.ly/assets/v3/ly.img.sticker/images/emoticons/imgly_sticker_emoticons_smile.svg',
    thumbUri:
      'https://cdn.img.ly/assets/v3/ly.img.sticker/images/emoticons/imgly_sticker_emoticons_smile.svg',
    blockType: '//ly.img.ubq/graphic',
    fillType: '//ly.img.ubq/fill/image',
    width: 62,
    height: 58,
    mimeType: 'image/svg+xml'
  }
};
```

Key properties include:

- **`id`** — Unique identifier for the asset
- **`label`** — Display name (can be localized)
- **`tags`** — Searchable keywords
- **`groups`** — Categories for filtering
- **`meta`** — Content-specific data including `uri`, `thumbUri`, `blockType`, `fillType`, `width`, `height`, and `mimeType`

> **Note:** See the [Content JSON Schema](./import-media/content-json-schema.md) guide for the complete property reference.

## Asset Sources

Asset sources provide assets to the editor. Each source has an `id` and implements a `findAssets()` method that returns paginated results.

```typescript highlight-asset-source
    // Asset sources provide assets to the editor
    // Each source has an id and a findAssets() method
    const customSource: AssetSource = {
      id: 'my-assets',

      async findAssets(query: AssetQueryData): Promise<AssetsQueryResult> {
        // Return paginated results matching the query
        return {
          assets: [stickerAsset],
          total: 1,
          currentPage: query.page,
          nextPage: undefined
        };
      }
    };

    engine.asset.addSource(customSource);
```

The `findAssets()` callback receives query parameters (`page`, `perPage`, `query`, `tags`, `groups`) and returns a result object with `assets`, `total`, `currentPage`, and `nextPage`.

Sources can also implement optional methods like `getGroups()`, `getSupportedMimeTypes()`, and `applyAsset()` for custom behavior.

## Querying Assets

Search and filter assets from registered sources using `findAssets()`:

```typescript highlight-query-assets
// Query assets from a source
const results = await engine.asset.findAssets('my-assets', {
  page: 0,
  perPage: 10
});
console.log('Found assets:', results.total);
```

Results include pagination info. Loop through pages until `nextPage` is undefined to retrieve all matching assets.

### Filtering by property

The optional `filter` parameter narrows a query with structured predicates against the resolved asset. All entries in the top-level array must match (implicit AND). Each entry is either a property predicate (`{ property, contains?, equals? }`) or a logical combinator (`{ and: [...] }`, `{ or: [...] }`, `{ not: ... }`). Combinators nest.

```typescript highlight-filter-assets
// Narrow a query with structured predicates. The top-level array is
// an implicit AND of its entries.
const happyStickers = await engine.asset.findAssets('my-assets', {
  page: 0,
  perPage: 10,
  filter: [
    // Either tag matches (combinators nest arbitrarily).
    {
      or: [
        { property: 'tags', equals: 'happy' },
        { property: 'tags', equals: 'celebratory' }
      ]
    },
    // Exclude archived items.
    { not: { property: 'meta.kind', equals: 'archived' } }
  ]
});
console.log('Filtered stickers:', happyStickers.total);
```

The `property` field is a dot-path against the resolved asset: `label`, `tags`, `id`, `groups`, or `meta.<key>`. Use `equals` for categorical or single-value fields and `contains` for free-text or list-encoded values. Both operators are case-insensitive. On a string array (`tags`, `groups`), the predicate matches if any element matches.

> **\`not\` against a missing key:** A predicate evaluates to `false` on an asset that lacks the targeted field, so `not { property: 'meta.legacy', equals: 'true' }` matches every asset where `meta.legacy !== 'true'` **and** every asset that lacks `meta.legacy` entirely. If you need "field is present and not equal to x," combine with a presence check: `and: [{ property: 'meta.legacy', contains: '' }, { not: { ... } }]`.

> **\`meta\` values are flat strings:** The engine stores every `meta.<key>` value as a flat string. `equals: 'true'` matches the literal string `"true"`; if a meta value was originally serialized as a number or boolean, stringify it the same way before comparing. For multi-valued data, prefer separate `tags` / `groups` elements over comma-separated `meta` values so `equals` can be element-exact.

`filter` and the legacy `tags` / `groups` / `excludeGroups` fields can be combined — they are AND-combined before pagination. Prefer `filter` for anything beyond a plain case-sensitive include/exclude list (substring matches, `meta.<key>`, `or` / `not` combinators); reach for the legacy fields only when you want their case-sensitive exact-match semantics.

Malformed filters reject the returned promise with the engine's parse-error message (for example, `"Unknown asset property '…'"` or `"Asset property filter must have exactly one of 'contains' or 'equals'."`).

## Applying Assets

Use `apply()` to create a new block from an asset:

```typescript highlight-apply-asset
    // Apply an asset to create a block in the scene
    if (results.assets.length > 0) {
      const blockId = await engine.asset.apply('my-assets', results.assets[0]);
      console.log('Created block:', blockId);

      // Center the sticker on the page
      const page = engine.scene.getCurrentPage();
      if (page && blockId) {
        const pageWidth = engine.block.getWidth(page);
        const pageHeight = engine.block.getHeight(page);
        // SVG is 62x58, scale to fit nicely
        const stickerWidth = 62;
        const stickerHeight = 58;
        engine.block.setWidth(blockId, stickerWidth);
        engine.block.setHeight(blockId, stickerHeight);
        engine.block.setPositionX(blockId, (pageWidth - stickerWidth) / 2);
        engine.block.setPositionY(blockId, (pageHeight - stickerHeight) / 2);
      }
    }
```

The method returns the new block ID, which you can use to position and configure the block.

## Local Asset Sources

Local sources store assets in memory and support dynamic add/remove operations. Use these for user uploads or runtime-generated content:

```typescript highlight-local-source
    // Local sources support dynamic add/remove operations
    engine.asset.addLocalSource('uploads', ['image/svg+xml', 'image/png']);

    engine.asset.addAssetToSource('uploads', {
      id: 'uploaded-1',
      label: { en: 'Heart Sticker' },
      meta: {
        uri: 'https://cdn.img.ly/assets/v3/ly.img.sticker/images/emoticons/imgly_sticker_emoticons_love.svg',
        thumbUri:
          'https://cdn.img.ly/assets/v3/ly.img.sticker/images/emoticons/imgly_sticker_emoticons_love.svg',
        blockType: '//ly.img.ubq/graphic',
        fillType: '//ly.img.ubq/fill/image',
        mimeType: 'image/svg+xml'
      }
    });
```

## Source Events

Subscribe to asset source lifecycle events for reactive UIs:

```typescript highlight-source-events
    // Subscribe to asset source lifecycle events
    const unsubscribe = engine.asset.onAssetSourceUpdated((sourceId) => {
      console.log('Source updated:', sourceId);
    });

    // Notify that source contents changed
    engine.asset.assetSourceContentsChanged('uploads');

    unsubscribe();
```

Call `assetSourceContentsChanged()` after modifying a source to notify subscribers.



---

## More Resources

- **[Electron Documentation Index](https://img.ly/docs/cesdk/electron.md)** - Browse all Electron documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./electron.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Concepts](./concepts.md) > [Assets](./concepts/assets.md)

---

Understand the asset system—how external media and resources like images, stickers, or videos are handled in CE.SDK.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/guides-concepts-assets-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/main/guides-concepts-assets-server-js)

Images, videos, audio, fonts, stickers, and templates—every premade resource you can add to a design is what we call an *Asset*. The editor gets access to these Assets through *Asset Sources*. When you apply an Asset, CE.SDK creates or modifies a Block to display that content.

```typescript file=@cesdk_web_examples/guides-concepts-assets-server-js/server-js.ts reference-only
import CreativeEngine, {
  AssetSource,
  AssetQueryData,
  AssetsQueryResult,
  AssetResult
} from '@cesdk/node';
import { config } from 'dotenv';

// Load environment variables from .env file
config();

/**
 * CE.SDK Server Example: Assets Concepts Guide
 *
 * Demonstrates the core concepts of the asset system:
 * - What assets are and how they differ from blocks
 * - Creating and registering asset sources
 * - Querying and applying assets
 */
async function main(): Promise<void> {
  // Initialize the headless Creative Engine
  const engine = await CreativeEngine.init({
    // license: process.env.CESDK_LICENSE,
  });

  try {
    // Create a scene with a page
    const scene = engine.scene.create();
    const page = engine.block.create('page');
    engine.block.appendChild(scene, page);
    engine.block.setWidth(page, 800);
    engine.block.setHeight(page, 600);

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

    // Apply an asset to create a block in the scene
    if (results.assets.length > 0) {
      const blockId = await engine.asset.apply('my-assets', results.assets[0]);
      console.log('Created block:', blockId);

      // Center the sticker on the page
      if (blockId) {
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

    console.log('Assets guide completed successfully.');
    console.log('Created custom asset source and applied sticker asset.');
  } finally {
    // Always dispose the engine to free resources
    engine.dispose();
  }
}

main().catch(console.error);
```

This guide covers the core concepts of the Asset system: what assets are, how to create asset sources, and how to query and apply assets programmatically.

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

## Applying Assets

Use `apply()` to create a new block from an asset:

```typescript highlight-apply-asset
    // Apply an asset to create a block in the scene
    if (results.assets.length > 0) {
      const blockId = await engine.asset.apply('my-assets', results.assets[0]);
      console.log('Created block:', blockId);

      // Center the sticker on the page
      if (blockId) {
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

- **[Node.js Documentation Index](https://img.ly/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
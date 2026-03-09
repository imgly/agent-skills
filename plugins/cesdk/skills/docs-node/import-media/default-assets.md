> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Import Media Assets](./import-media.md) > [Using Default Assets](./import-media/default-assets.md)

---

```typescript file=@cesdk_web_examples/guides-import-media-default-assets-server-js/server-js.ts reference-only
import CreativeEngine from '@cesdk/node';
import { writeFile } from 'fs/promises';
import { config } from 'dotenv';

config();

/**
 * CE.SDK Server Guide: Using Default Assets
 *
 * Demonstrates loading all asset sources from IMG.LY's CDN using
 * addLocalAssetSourceFromJSONURI and creating a scene with
 * a star shape, sticker, and image.
 */
async function main(): Promise<void> {
  const engine = await CreativeEngine.init({
    // license: process.env.CESDK_LICENSE
  });

  try {
    // Versioned CDN URLs using the SDK package (recommended)
    // For production, self-host these assets - see the Serve Assets guide
    const PACKAGE_BASE = `https://cdn.img.ly/packages/imgly/cesdk-node/${CreativeEngine.version}/assets`;
    const DEFAULT_ASSETS_URL = `${PACKAGE_BASE}/v4/`;
    const DEMO_ASSETS_URL = `${PACKAGE_BASE}/demo/v3/`;

    // Load default asset sources (core editor components)
    await engine.asset.addLocalAssetSourceFromJSONURI(
      `${DEFAULT_ASSETS_URL}ly.img.sticker/content.json`
    );
    await engine.asset.addLocalAssetSourceFromJSONURI(
      `${DEFAULT_ASSETS_URL}ly.img.vectorpath/content.json`
    );
    await engine.asset.addLocalAssetSourceFromJSONURI(
      `${DEFAULT_ASSETS_URL}ly.img.colors.defaultPalette/content.json`
    );
    await engine.asset.addLocalAssetSourceFromJSONURI(
      `${DEFAULT_ASSETS_URL}ly.img.filter.lut/content.json`
    );
    await engine.asset.addLocalAssetSourceFromJSONURI(
      `${DEFAULT_ASSETS_URL}ly.img.filter.duotone/content.json`
    );
    await engine.asset.addLocalAssetSourceFromJSONURI(
      `${DEFAULT_ASSETS_URL}ly.img.effect/content.json`
    );
    await engine.asset.addLocalAssetSourceFromJSONURI(
      `${DEFAULT_ASSETS_URL}ly.img.blur/content.json`
    );
    await engine.asset.addLocalAssetSourceFromJSONURI(
      `${DEFAULT_ASSETS_URL}ly.img.typeface/content.json`
    );
    await engine.asset.addLocalAssetSourceFromJSONURI(
      `${DEFAULT_ASSETS_URL}ly.img.crop.presets/content.json`
    );
    await engine.asset.addLocalAssetSourceFromJSONURI(
      `${DEFAULT_ASSETS_URL}ly.img.page.presets/content.json`
    );
    await engine.asset.addLocalAssetSourceFromJSONURI(
      `${DEFAULT_ASSETS_URL}ly.img.page.presets.video/content.json`
    );

    // Load demo asset sources (sample content for testing)
    await engine.asset.addLocalAssetSourceFromJSONURI(
      `${DEMO_ASSETS_URL}ly.img.image/content.json`
    );
    await engine.asset.addLocalAssetSourceFromJSONURI(
      `${DEMO_ASSETS_URL}ly.img.video/content.json`
    );
    await engine.asset.addLocalAssetSourceFromJSONURI(
      `${DEMO_ASSETS_URL}ly.img.audio/content.json`
    );
    await engine.asset.addLocalAssetSourceFromJSONURI(
      `${DEMO_ASSETS_URL}ly.img.template/content.json`
    );
    await engine.asset.addLocalAssetSourceFromJSONURI(
      `${DEMO_ASSETS_URL}ly.img.video.template/content.json`
    );
    await engine.asset.addLocalAssetSourceFromJSONURI(
      `${DEMO_ASSETS_URL}ly.img.textComponents/content.json`
    );

    // List registered asset sources
    const sources = engine.asset.findAllSources();
    // eslint-disable-next-line no-console
    console.log('Registered asset sources:', sources);

    // Create a scene with a page
    const PAGE_WIDTH = 800;
    const PAGE_HEIGHT = 600;

    engine.scene.create('VerticalStack', {
      page: { size: { width: PAGE_WIDTH, height: PAGE_HEIGHT } }
    });

    const pages = engine.block.findByType('page');
    const page = pages[0];
    if (page == null) {
      throw new Error('No page found in scene');
    }

    // Define the three assets to add: star shape, sticker, and image
    const assetsToAdd = [
      {
        sourceId: 'ly.img.vectorpath',
        assetId: '//ly.img.ubq/shapes/star/filled'
      },
      {
        sourceId: 'ly.img.sticker',
        assetId: '//ly.img.cesdk.stickers.emoticons/alien'
      },
      {
        sourceId: 'ly.img.image',
        assetId: 'ly.img.cesdk.images.samples/sample.1'
      }
    ];

    // Calculate layout for 3 centered blocks
    const blockSize = Math.min(PAGE_WIDTH, PAGE_HEIGHT) * 0.2;
    const spacing = blockSize * 0.3;
    const totalWidth =
      assetsToAdd.length * blockSize + (assetsToAdd.length - 1) * spacing;
    const startX = (PAGE_WIDTH - totalWidth) / 2;
    const centerY = (PAGE_HEIGHT - blockSize) / 2;

    // Create and position each block
    for (let i = 0; i < assetsToAdd.length; i++) {
      const { sourceId, assetId } = assetsToAdd[i];
      const asset = await engine.asset.fetchAsset(sourceId, assetId);

      if (asset != null) {
        const block = await engine.asset.apply(sourceId, asset);

        if (block != null) {
          engine.block.setWidth(block, blockSize);
          engine.block.setHeight(block, blockSize);
          engine.block.setPositionX(block, startX + i * (blockSize + spacing));
          engine.block.setPositionY(block, centerY);
        }
      }
    }

    // Export the scene as PNG
    const pngBlob = await engine.block.export(page, { mimeType: 'image/png' });
    const pngBuffer = Buffer.from(await pngBlob.arrayBuffer());
    await writeFile('output/scene.png', pngBuffer);

    // eslint-disable-next-line no-console
    console.log('Exported scene to output/scene.png');
  } finally {
    engine.dispose();
  }
}

main().catch(console.error);
```

Load all asset sources from IMG.LY's CDN to populate your CE.SDK engine with shapes, stickers, filters, effects, fonts, images, and other media for server-side rendering.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/guides-import-media-default-assets-server-js)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/main/guides-import-media-default-assets-server-js)

CE.SDK provides built-in asset sources for shapes, stickers, filters, effects, fonts, and sample media. This guide demonstrates loading all available asset sources from IMG.LY's CDN and applying them to create a scene with a star shape, a sticker, and an image, then exporting to PNG.

> **Production Deployment:** The IMG.LY CDN is for development and prototyping only. For production, download and self-host assets from your own server. See the [Serve Assets](./serve-assets.md) guide for instructions.

## What Are Default and Demo Assets?

IMG.LY provides two categories of asset sources hosted on the IMG.LY CDN for development and prototyping:

**Default Assets** are core editor components:

| Source ID | Description |
|-----------|-------------|
| `ly.img.sticker` | Emojis, emoticons, decorations |
| `ly.img.vectorpath` | Shapes: stars, arrows, polygons |
| `ly.img.colors.defaultPalette` | Default color palette |
| `ly.img.filter.lut` | LUT-based color filters |
| `ly.img.filter.duotone` | Duotone color effects |
| `ly.img.effect` | Visual effects |
| `ly.img.blur` | Blur effects |
| `ly.img.typeface` | Font families |
| `ly.img.crop.presets` | Crop presets |
| `ly.img.page.presets` | Page size presets |
| `ly.img.page.presets.video` | Video page presets |

**Demo Assets** are sample content for development:

| Source ID | Description |
|-----------|-------------|
| `ly.img.image` | Sample images |
| `ly.img.video` | Sample videos |
| `ly.img.audio` | Sample audio tracks |
| `ly.img.template` | Design templates |
| `ly.img.video.template` | Video templates |
| `ly.img.textComponents` | Text component presets |

## Loading Assets from URL

Use `addLocalAssetSourceFromJSONURI()` to load an asset source directly from a JSON URL:

```typescript
const baseURL = `https://cdn.img.ly/packages/imgly/cesdk-node/${CreativeEngine.version}/assets/v4/`;
await engine.asset.addLocalAssetSourceFromJSONURI(
  `${baseURL}ly.img.vectorpath/content.json`
);
```

## Initialize the Engine

Create the Creative Engine instance:

```typescript highlight-init
const engine = await CreativeEngine.init({
  // license: process.env.CESDK_LICENSE
});
```

## Versioned CDN URLs

Use the SDK version to construct versioned CDN URLs. This ensures assets are compatible with your SDK version. For production deployments, see the [Serve Assets](./serve-assets.md) guide to self-host assets.

```typescript highlight-cdn-urls
// Versioned CDN URLs using the SDK package (recommended)
// For production, self-host these assets - see the Serve Assets guide
const PACKAGE_BASE = `https://cdn.img.ly/packages/imgly/cesdk-node/${CreativeEngine.version}/assets`;
const DEFAULT_ASSETS_URL = `${PACKAGE_BASE}/v4/`;
const DEMO_ASSETS_URL = `${PACKAGE_BASE}/demo/v3/`;
```

## Loading Default Asset Sources

Load a default asset source from the CDN. Repeat this pattern for each source you need:

```typescript highlight-load-default-assets
// Load default asset sources (core editor components)
await engine.asset.addLocalAssetSourceFromJSONURI(
  `${DEFAULT_ASSETS_URL}ly.img.sticker/content.json`
);
```

## Loading Demo Asset Sources

Load a demo asset source from the CDN. Repeat this pattern for each source you need:

```typescript highlight-load-demo-assets
// Load demo asset sources (sample content for testing)
await engine.asset.addLocalAssetSourceFromJSONURI(
  `${DEMO_ASSETS_URL}ly.img.image/content.json`
);
```

## Exporting the Scene

Export the scene as a PNG file:

```typescript highlight-export
    // Export the scene as PNG
    const pngBlob = await engine.block.export(page, { mimeType: 'image/png' });
    const pngBuffer = Buffer.from(await pngBlob.arrayBuffer());
    await writeFile('output/scene.png', pngBuffer);

    // eslint-disable-next-line no-console
    console.log('Exported scene to output/scene.png');
```

## Cleanup

Always dispose of the engine when finished:

```typescript highlight-cleanup
engine.dispose();
```

## Filtering Assets with Matcher

Use the `matcher` option to load only specific assets from a source:

```typescript
const baseURL = `https://cdn.img.ly/packages/imgly/cesdk-node/${CreativeEngine.version}/assets/v4/`;

// Load only star and arrow shapes
await engine.asset.addLocalAssetSourceFromJSONURI(
  `${baseURL}ly.img.vectorpath/content.json`,
  { matcher: ['*star*', '*arrow*'] }
);

// Load only emoji stickers
await engine.asset.addLocalAssetSourceFromJSONURI(
  `${baseURL}ly.img.sticker/content.json`,
  { matcher: ['*emoji*'] }
);
```

An asset is included if it matches ANY pattern in the array. Patterns support `*` wildcards.

## API Reference

| Method | Description |
|--------|-------------|
| `engine.asset.addLocalAssetSourceFromJSONURI(contentURI, options?)` | Load an asset source from a JSON URL |
| `engine.asset.fetchAsset(sourceId, assetId)` | Fetch a specific asset by ID |
| `engine.asset.apply(sourceId, asset)` | Apply an asset to create a block |

**Parameters for `addLocalAssetSourceFromJSONURI`:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `contentURI` | `string` | Full URL to the content.json file |
| `options.matcher` | `string[]` | Optional wildcard patterns to filter assets |

**Returns:** `Promise<string>` — The asset source ID from the JSON

## Next Steps

- [Serve Assets](./serve-assets.md) — Self-host assets for production deployments
- [Import From Remote Source](./import-media/from-remote-source.md) — Load assets from external URLs



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
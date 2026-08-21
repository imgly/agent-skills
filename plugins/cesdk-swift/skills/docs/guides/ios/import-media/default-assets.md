> This is one page of the CE.SDK iOS documentation. For a complete overview, see the [iOS Documentation Index](https://img.ly/docs/cesdk/ios/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/ios/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Import Media Assets](../import-media.md) > [Using Default Assets](./default-assets.md)

---

```swift file=@cesdk_swift_examples/engine-guides-default-assets/DefaultAssets.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func defaultAssets(engine: Engine) async throws {
  // Demo scaffolding: resolve sample assets against the engine's configured base
  // URL, with a wide page to host the three blocks the hero shows.
  let baseURL = try engine.guidesBaseURL
  let scene = try engine.scene.create()
  let page = try engine.block.create(.page)
  try engine.block.setWidth(page, value: 900)
  try engine.block.setHeight(page, value: 400)
  try engine.block.appendChild(to: scene, child: page)

  // Register a default asset source by loading its `content.json`. The returned
  // ID matches the source's `id` field in the JSON.
  let shapeSourceID = try await engine.asset.addLocalAssetSourceFromJSON(
    baseURL.appendingPathComponent("ly.img.vector.shape/content.json"),
  )
  let stickerSourceID = try await engine.asset.addLocalAssetSourceFromJSON(
    baseURL.appendingPathComponent("ly.img.sticker/content.json"),
  )

  // Demo asset sources — sample images, videos, and audio — load the same way.
  let imageSourceID = try await engine.asset.addLocalAssetSourceFromJSON(
    baseURL.appendingPathComponent("ly.img.image/content.json"),
  )

  // Fetch a specific asset by its ID, then apply it.
  // `apply(sourceID:assetResult:)` creates a block from the asset, attaches it
  // to the current page, and returns the new block's handle.
  guard
    let starAsset = try await engine.asset.fetchAsset(
      sourceID: shapeSourceID,
      assetID: "ly.img.vector.shape.filled.star",
    ),
    let starBlock = try await engine.asset.apply(sourceID: shapeSourceID, assetResult: starAsset),
    let emojiAsset = try await engine.asset.fetchAsset(
      sourceID: stickerSourceID,
      assetID: "ly.img.sticker.emoji.happyface",
    ),
    let emojiBlock = try await engine.asset.apply(sourceID: stickerSourceID, assetResult: emojiAsset),
    let imageAsset = try await engine.asset.fetchAsset(
      sourceID: imageSourceID,
      assetID: "ly.img.image.sample_1",
    ),
    let imageBlock = try await engine.asset.apply(sourceID: imageSourceID, assetResult: imageAsset)
  else { return }

  // Demo scaffolding: give the star a solid fill, keep the emoji uncropped, then
  // size and lay out the three blocks in a centered row for the hero.
  let starFill = try engine.block.createFill(.color)
  try engine.block.setColor(
    starFill,
    property: "fill/color/value",
    color: .rgba(r: 1.0, g: 0.78, b: 0.0, a: 1.0),
  )
  try engine.block.setFill(starBlock, fill: starFill)

  if try engine.block.supportsContentFillMode(emojiBlock) {
    try engine.block.setContentFillMode(emojiBlock, mode: .contain)
  }

  let blockSize: Float = 220
  let spacing: Float = 50
  let blocks = [starBlock, emojiBlock, imageBlock]
  let rowWidth = Float(blocks.count) * blockSize + Float(blocks.count - 1) * spacing
  let startX = (900 - rowWidth) / 2
  for (index, block) in blocks.enumerated() {
    try engine.block.setWidth(block, value: blockSize)
    try engine.block.setHeight(block, value: blockSize)
    try engine.block.setPositionX(block, value: startX + Float(index) * (blockSize + spacing))
    try engine.block.setPositionY(block, value: (400 - blockSize) / 2)
  }

  try await engine.captureGuide(page, label: "hero")
}

// Compile-only demonstration of the `matcher` parameter. The guide test does not
// run this function: re-registering an asset source ID that is already loaded in
// `defaultAssets(engine:)` would fail because source IDs must be unique.
@MainActor
func defaultAssetsWithMatcher(engine: Engine) async throws {
  let baseURL = try engine.guidesBaseURL

  // Load only star and arrow shapes.
  let shapeSourceID = try await engine.asset.addLocalAssetSourceFromJSON(
    baseURL.appendingPathComponent("ly.img.vector.shape/content.json"),
    matcher: ["*star*", "*arrow*"],
  )
  // Load only emoji stickers.
  let stickerSourceID = try await engine.asset.addLocalAssetSourceFromJSON(
    baseURL.appendingPathComponent("ly.img.sticker/content.json"),
    matcher: ["*emoji*"],
  )
  print("Loaded filtered sources: \(shapeSourceID), \(stickerSourceID)")
}
```

Load CE.SDK's built-in asset sources — shapes, stickers, filters, fonts, and sample media — from IMG.LY's CDN, then create blocks from them with the Asset API.

![A gold star shape, a happy-face emoji sticker, and a sample image laid out in a row on the canvas.](https://img.ly/docs/cesdk/ios/import-media/default-assets-d2763d/assets/swift-based.hero.webp)

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.82.0-nightly.20260821/engine-guides-default-assets)

<EngineReferenceNote {...props} />

CE.SDK provides built-in asset sources for shapes, stickers, filters, effects, fonts, and sample media. This guide registers asset sources from IMG.LY's CDN and applies them to create a scene with a star shape, an emoji sticker, and an image.

> **Production Deployment:** The IMG.LY CDN is for development and prototyping only. For production, download and self-host the assets from your own server. See the [Serve Assets](../serve-assets.md) guide for instructions.

## What Are Default and Demo Assets?

IMG.LY hosts two categories of asset sources on its CDN for development and prototyping.

**Default Assets** are core editor components:

| Source ID | Description |
| --- | --- |
| `ly.img.sticker` | Stickers: emojis, emoticons, decorations |
| `ly.img.vector.shape` | Shapes: stars, arrows, polygons |
| `ly.img.filter` | LUT and duotone color filters |
| `ly.img.color.palette` | Default color palette |
| `ly.img.effect` | Visual effects |
| `ly.img.blur` | Blur effects |
| `ly.img.typeface` | Font families |
| `ly.img.crop.presets` | Crop presets |
| `ly.img.page.presets` | Page size presets |
| `ly.img.text`, `ly.img.text.styles`, `ly.img.text.curves` | Text style presets |
| `ly.img.text.components` | Text design component library |

**Demo Assets** are sample content:

| Source ID | Description |
| --- | --- |
| `ly.img.image` | Sample images |
| `ly.img.video` | Sample videos |
| `ly.img.audio` | Sample audio tracks |
| `ly.img.templates` | Design and video templates |
| `ly.img.templates.premium` | Premium design templates |

## Loading Default Asset Sources

Each asset source is described by a `content.json` manifest. Register a source by pointing `addLocalAssetSourceFromJSON(_:matcher:)` at its manifest URL; the engine resolves the asset files relative to that URL and returns the source ID declared in the JSON. Here `baseURL` points at the host serving your assets — the IMG.LY CDN during development.

```swift highlight-defaultAssets-loadDefault
// Register a default asset source by loading its `content.json`. The returned
// ID matches the source's `id` field in the JSON.
let shapeSourceID = try await engine.asset.addLocalAssetSourceFromJSON(
  baseURL.appendingPathComponent("ly.img.vector.shape/content.json"),
)
let stickerSourceID = try await engine.asset.addLocalAssetSourceFromJSON(
  baseURL.appendingPathComponent("ly.img.sticker/content.json"),
)
```

## Loading Demo Asset Sources

Demo asset sources — sample images, videos, and audio — register exactly the same way.

```swift highlight-defaultAssets-loadDemo
// Demo asset sources — sample images, videos, and audio — load the same way.
let imageSourceID = try await engine.asset.addLocalAssetSourceFromJSON(
  baseURL.appendingPathComponent("ly.img.image/content.json"),
)
```

## Creating Blocks from Assets

Once a source is registered, fetch a specific asset with `fetchAsset(sourceID:assetID:)`, then pass the result to `apply(sourceID:assetResult:)`. `apply` creates a block from the asset's metadata, attaches it to the current page, and returns the new block's handle.

```swift highlight-defaultAssets-createBlocks
// Fetch a specific asset by its ID, then apply it.
// `apply(sourceID:assetResult:)` creates a block from the asset, attaches it
// to the current page, and returns the new block's handle.
guard
  let starAsset = try await engine.asset.fetchAsset(
    sourceID: shapeSourceID,
    assetID: "ly.img.vector.shape.filled.star",
  ),
  let starBlock = try await engine.asset.apply(sourceID: shapeSourceID, assetResult: starAsset),
  let emojiAsset = try await engine.asset.fetchAsset(
    sourceID: stickerSourceID,
    assetID: "ly.img.sticker.emoji.happyface",
  ),
  let emojiBlock = try await engine.asset.apply(sourceID: stickerSourceID, assetResult: emojiAsset),
  let imageAsset = try await engine.asset.fetchAsset(
    sourceID: imageSourceID,
    assetID: "ly.img.image.sample_1",
  ),
  let imageBlock = try await engine.asset.apply(sourceID: imageSourceID, assetResult: imageAsset)
else { return }
```

`fetchAsset(sourceID:assetID:)` is the right call when you already know an asset's ID. To search or page through a source instead — for example, to build your own picker — use `findAssets(sourceID:query:)` with an `AssetQueryData` (a search string, group filters, and pagination), which returns an `AssetQueryResult` of matching assets. On iOS, the editor's asset library populates itself with these queries so users can browse and select assets, rather than fetching by explicit ID; see the [Asset Library Basics](./asset-library/basics.md) guide.

## Filtering Assets with Matcher

Pass a `matcher` array to load only the assets whose IDs match. An asset is included if it matches any pattern, and `*` is a wildcard. Because a source ID must be unique, apply the matcher when you first register the source rather than re-registering an already-loaded one.

```swift highlight-defaultAssets-matcher
// Load only star and arrow shapes.
let shapeSourceID = try await engine.asset.addLocalAssetSourceFromJSON(
  baseURL.appendingPathComponent("ly.img.vector.shape/content.json"),
  matcher: ["*star*", "*arrow*"],
)
// Load only emoji stickers.
let stickerSourceID = try await engine.asset.addLocalAssetSourceFromJSON(
  baseURL.appendingPathComponent("ly.img.sticker/content.json"),
  matcher: ["*emoji*"],
)
print("Loaded filtered sources: \(shapeSourceID), \(stickerSourceID)")
```

## API Reference

### Methods

| Method | Description |
| --- | --- |
| `engine.asset.addLocalAssetSourceFromJSON(_:matcher:)` | Register an asset source by loading its `content.json` manifest from a URL. Pass `matcher` ID patterns to filter which assets load. Returns the source ID. |
| `engine.asset.addLocalAssetSourceFromJSON(_:basePath:matcher:)` | Register an asset source from an in-memory JSON string, resolving relative URLs against `basePath`. |
| `engine.asset.fetchAsset(sourceID:assetID:)` | Fetch a single asset from a source by its ID. |
| `engine.asset.apply(sourceID:assetResult:)` | Create a block from an asset and add it to the scene. Returns the new block's handle. |

## Next Steps

- [Serve Assets](../serve-assets.md) — Self-host assets for production deployments.
- [Customize Asset Library](./asset-library/customize.md) — On iOS, configure the asset library UI and entries.
- [Asset Concepts](./concepts.md) — Understand asset sources and how they organize content.
- [Import From Remote Source](./from-remote-source.md) — Connect CE.SDK to external sources like servers or third-party platforms to import assets remotely.



---

## More Resources

- **[iOS Documentation Index](https://img.ly/docs/cesdk/ios/)** - Browse all iOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/ios/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/ios/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
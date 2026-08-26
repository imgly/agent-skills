> This is one page of the CE.SDK Mac Catalyst documentation. For a complete overview, see the [Mac Catalyst Documentation Index](https://img.ly/docs/cesdk/mac-catalyst/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/mac-catalyst/llms-full.txt).

**Navigation:** [Concepts](../concepts.md) > [Assets](./assets.md)

---

Understand the asset system—how external media and resources like images, stickers, or videos are handled in CE.SDK.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.82.0-nightly.20260826/engine-guides-concepts-assets)

Images, videos, audio, fonts, stickers, and templates—every premade resource you can add to a design is what we call an *Asset*. The editor gets access to these Assets through *Asset Sources*. When you apply an Asset, CE.SDK creates or modifies a Block to display that content.

```swift file=@cesdk_swift_examples/engine-guides-concepts-assets/ConceptsAssets.swift reference-only
import Foundation
import IMGLYEngine

// MARK: - Custom Asset Source

class DemoAssetSource: NSObject, AssetSource {
  let id = "my-assets"
  var supportedMIMETypes: [String]? {
    nil
  }

  var credits: AssetCredits? {
    nil
  }

  var license: AssetLicense? {
    nil
  }

  // Base URL the sample sticker is resolved against.
  let baseURL: URL

  init(baseURL: URL) {
    self.baseURL = baseURL
    super.init()
  }

  var stickerAsset: AssetResult {
    let stickerURI = baseURL
      .appendingPathComponent("ly.img.sticker/images/emoticons/imgly_sticker_emoticons_smile.svg")
      .absoluteString
    return AssetResult(
      id: "sticker-smile",
      label: "Smile Sticker",
      tags: ["emoji", "happy"],
      meta: [
        "uri": stickerURI,
        "thumbUri": stickerURI,
        "blockType": "//ly.img.ubq/graphic",
        "fillType": "//ly.img.ubq/fill/image",
        "width": "62",
        "height": "58",
        "mimeType": "image/svg+xml",
      ],
      context: AssetContext(sourceID: "my-assets"),
      groups: ["stickers"],
    )
  }

  func findAssets(queryData: AssetQueryData) async throws -> AssetQueryResult {
    AssetQueryResult(
      assets: [stickerAsset],
      currentPage: queryData.page,
      nextPage: -1,
      total: 1,
    )
  }
}

// MARK: - Guide

@MainActor
func conceptsAssets(engine: Engine) async throws {
  let scene = try engine.scene.create()
  let page = try engine.block.create(.page)
  try engine.block.setWidth(page, value: 800)
  try engine.block.setHeight(page, value: 600)
  try engine.block.appendChild(to: scene, child: page)

  let baseURL = try engine.guidesBaseURL

  // Register a custom asset source
  let source = DemoAssetSource(baseURL: baseURL)
  try engine.asset.addSource(source)

  // Query assets from a registered source
  let results = try await engine.asset.findAssets(
    sourceID: "my-assets",
    query: .init(query: nil, page: 0, perPage: 10),
  )
  print("Found assets:", results.total)

  // Apply an asset to create a block in the scene
  if let asset = results.assets.first {
    let blockID = try await engine.asset.apply(sourceID: "my-assets", assetResult: asset)
    print("Created block:", blockID as Any)
  }

  // Local sources store assets in memory and support dynamic add/remove
  try engine.asset.addLocalSource(sourceID: "uploads", supportedMimeTypes: ["image/svg+xml", "image/png"])

  let uploadedStickerURI = baseURL
    .appendingPathComponent("ly.img.sticker/images/emoticons/imgly_sticker_emoticons_grin.svg")
    .absoluteString
  try engine.asset.addAsset(
    to: "uploads",
    asset: AssetDefinition(
      id: "uploaded-1",
      meta: [
        "uri": uploadedStickerURI,
        "thumbUri": uploadedStickerURI,
        "blockType": "//ly.img.ubq/graphic",
        "fillType": "//ly.img.ubq/fill/image",
        "mimeType": "image/svg+xml",
      ],
      label: ["en": "Grin Sticker"],
    ),
  )

  // Subscribe to asset source lifecycle events
  let task = Task {
    for await sourceID in engine.asset.onAssetSourceUpdated {
      print("Source updated:", sourceID)
      break
    }
  }

  // Notify that source contents changed
  try engine.asset.assetSourceContentsChanged(sourceID: "uploads")

  task.cancel()
}
```

This guide covers the core concepts of the Asset system. For detailed instructions on inserting images, see the [Images](../insert-media/images.md) guide. For related concepts, see [Blocks](./blocks.md) and [Resources](./resources.md).

## Assets vs Blocks

**Assets** are content definitions with metadata (URIs, dimensions, labels) that exist outside the scene. **Blocks** are the visual elements in the scene tree that display content.

When you apply an asset, CE.SDK creates a block configured according to the asset's properties. Multiple blocks can reference the same asset, and assets can exist without being used in any block.

## The Asset Data Model

An asset describes content that can be added to designs. Each asset has an `id` and optional properties:

```swift highlight-conceptsAssets-assetDefinition
  var stickerAsset: AssetResult {
    let stickerURI = baseURL
      .appendingPathComponent("ly.img.sticker/images/emoticons/imgly_sticker_emoticons_smile.svg")
      .absoluteString
    return AssetResult(
      id: "sticker-smile",
      label: "Smile Sticker",
      tags: ["emoji", "happy"],
      meta: [
        "uri": stickerURI,
        "thumbUri": stickerURI,
        "blockType": "//ly.img.ubq/graphic",
        "fillType": "//ly.img.ubq/fill/image",
        "width": "62",
        "height": "58",
        "mimeType": "image/svg+xml",
      ],
      context: AssetContext(sourceID: "my-assets"),
      groups: ["stickers"],
    )
  }
```

Key properties include:

- **`id`** — Unique identifier for the asset
- **`label`** — Display name (can be localized)
- **`tags`** — Searchable keywords
- **`groups`** — Categories for filtering
- **`meta`** — Content-specific data including `uri`, `thumbUri`, `blockType`, `fillType`, `width`, `height`, and `mimeType`
- **`context`** — An `AssetContext` that ties the asset to its source

> **Note:** See the [Content JSON Schema](../import-media/content-json-schema.md) guide for the complete property reference.

## Asset Sources

Asset sources provide assets to the editor. Each source conforms to the `AssetSource` protocol and implements a `findAssets(queryData:)` method that returns paginated results.

```swift highlight-conceptsAssets-assetSource
func findAssets(queryData: AssetQueryData) async throws -> AssetQueryResult {
  AssetQueryResult(
    assets: [stickerAsset],
    currentPage: queryData.page,
    nextPage: -1,
    total: 1,
  )
}
```

The `findAssets(queryData:)` callback receives an `AssetQueryData` with parameters like `page`, `perPage`, `query`, `tags`, `groups`, `filter`, and `facets`, and returns an `AssetQueryResult` with `assets`, `total`, `currentPage`, and `nextPage`, plus a `facets` dictionary when the query requests distributions.

Sources can also implement optional methods like `getGroups()`, `fetchAsset(id:options:)`, and `apply(asset:)` for custom behavior.

## Querying Assets

Search and filter assets from registered sources using `findAssets(sourceID:query:)`:

```swift highlight-conceptsAssets-queryAssets
// Query assets from a registered source
let results = try await engine.asset.findAssets(
  sourceID: "my-assets",
  query: .init(query: nil, page: 0, perPage: 10),
)
print("Found assets:", results.total)
```

Results include pagination info. Loop through pages until `nextPage` is `-1` to retrieve all matching assets.

The optional `filter` parameter narrows a query with structured `AssetFilter` predicates (`equals` and `contains` on a property path, combined with `and`, `or`, and `not`). The optional `facets` parameter requests value distributions for `tags`, `groups`, or `meta.<key>` paths over the matched set—for example to populate a filter dropdown. Each distribution is ordered by count descending and returned in `AssetQueryResult.facets`; combine `facets` with `perPage: 0` to enumerate available values without fetching assets.

## Applying Assets

Use `apply(sourceID:assetResult:)` to create a new block from an asset:

```swift highlight-conceptsAssets-applyAsset
// Apply an asset to create a block in the scene
if let asset = results.assets.first {
  let blockID = try await engine.asset.apply(sourceID: "my-assets", assetResult: asset)
  print("Created block:", blockID as Any)
}
```

The method returns the new block ID, which you can use to position and configure the block.

## Local Asset Sources

Local sources store assets in memory and support dynamic add/remove operations. Use these for user uploads or runtime-generated content:

```swift highlight-conceptsAssets-localSource
  // Local sources store assets in memory and support dynamic add/remove
  try engine.asset.addLocalSource(sourceID: "uploads", supportedMimeTypes: ["image/svg+xml", "image/png"])

  let uploadedStickerURI = baseURL
    .appendingPathComponent("ly.img.sticker/images/emoticons/imgly_sticker_emoticons_grin.svg")
    .absoluteString
  try engine.asset.addAsset(
    to: "uploads",
    asset: AssetDefinition(
      id: "uploaded-1",
      meta: [
        "uri": uploadedStickerURI,
        "thumbUri": uploadedStickerURI,
        "blockType": "//ly.img.ubq/graphic",
        "fillType": "//ly.img.ubq/fill/image",
        "mimeType": "image/svg+xml",
      ],
      label: ["en": "Grin Sticker"],
    ),
  )
```

## Source Events

Subscribe to asset source lifecycle events for reactive UIs:

```swift highlight-conceptsAssets-sourceEvents
  // Subscribe to asset source lifecycle events
  let task = Task {
    for await sourceID in engine.asset.onAssetSourceUpdated {
      print("Source updated:", sourceID)
      break
    }
  }

  // Notify that source contents changed
  try engine.asset.assetSourceContentsChanged(sourceID: "uploads")

  task.cancel()
```

Call `assetSourceContentsChanged(sourceID:)` after modifying a source to notify subscribers.

## Next Steps

- [Blocks](./blocks.md) — Learn how applied assets become blocks in the scene tree.
- [Resources](./resources.md) — Understand how URIs and buffers back asset content.
- [Content JSON Schema](../import-media/content-json-schema.md) — Full reference for the asset property schema.



---

## More Resources

- **[Mac Catalyst Documentation Index](https://img.ly/docs/cesdk/mac-catalyst/)** - Browse all Mac Catalyst documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/mac-catalyst/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/mac-catalyst/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
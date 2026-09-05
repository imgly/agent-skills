> This is one page of the CE.SDK macOS documentation. For a complete overview, see the [macOS Documentation Index](https://img.ly/docs/cesdk/macos/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/macos/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Create and Use Templates](../create-templates.md) > [Template Library](./library.md)

---

```swift file=@cesdk_swift_examples/engine-guides-use-templates-library/TemplateLibrary.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func templateLibrary(engine: Engine) async throws {
  // Create a design scene that templates will be applied to.
  let scene = try engine.scene.create()
  let page = try engine.block.create(.page)
  try engine.block.setWidth(page, value: 800)
  try engine.block.setHeight(page, value: 600)
  try engine.block.appendChild(to: scene, child: page)

  // Base URL the sample templates are resolved against. In your app this is the
  // location where you host your own `.scene` files and thumbnails.
  let baseURL = try engine.guidesBaseURL

  // Register a local template source. The `applyAsset` callback runs when a
  // template is selected: it reads the scene URL from the asset's metadata and
  // applies it to the current scene, keeping the current page dimensions.
  try engine.asset.addLocalSource(sourceID: "my.custom.templates", applyAsset: { [weak engine] asset in
    guard let engine, let uri = asset.meta?["uri"], let sceneURL = URL(string: uri) else {
      return nil
    }
    try await engine.scene.applyTemplate(from: sceneURL)
    return nil
  })

  // Add template assets. Each asset's `meta` carries the `uri` of the `.scene`
  // file to apply and a `thumbUri` for the preview thumbnail.
  try engine.asset.addAsset(
    to: "my.custom.templates",
    asset: AssetDefinition(
      id: "business-card",
      groups: ["business"],
      meta: [
        "uri": baseURL
          .appendingPathComponent("ly.img.templates/templates/cesdk_business_card_1.scene")
          .absoluteString,
        "thumbUri": baseURL
          .appendingPathComponent("ly.img.templates/thumbnails/cesdk_business_card_1.jpg")
          .absoluteString,
      ],
      label: ["en": "Business Card"],
      tags: ["en": ["business", "card"]],
    ),
  )

  try engine.asset.addAsset(
    to: "my.custom.templates",
    asset: AssetDefinition(
      id: "blank-canvas",
      groups: ["basics"],
      meta: [
        "uri": baseURL
          .appendingPathComponent("ly.img.templates/templates/cesdk_blank_1.scene")
          .absoluteString,
        "thumbUri": baseURL
          .appendingPathComponent("ly.img.templates/thumbnails/cesdk_blank_1.png")
          .absoluteString,
      ],
      label: ["en": "Blank Canvas"],
      tags: ["en": ["blank", "empty"]],
    ),
  )

  // Apply a template by running the source's callback, exactly as the editor
  // does when a user taps a template thumbnail.
  if let firstTemplate = try await engine.asset.findAssets(
    sourceID: "my.custom.templates",
    query: .init(query: nil, page: 0, perPage: 1),
  ).assets.first {
    _ = try await engine.asset.apply(sourceID: "my.custom.templates", assetResult: firstTemplate)
  }

  // For production, register a template source from a hosted `content.json`
  // file. The parent directory of the JSON becomes the base path for resolving
  // relative URLs inside it.
  let contentURL = baseURL.appendingPathComponent("ly.img.templates/content.json")
  let hostedSourceID = try await engine.asset.addLocalAssetSourceFromJSON(contentURL)
  print("Registered hosted template source:", hostedSourceID)

  // Query templates with pagination and group filtering.
  let businessTemplates = try await engine.asset.findAssets(
    sourceID: "my.custom.templates",
    query: .init(query: nil, page: 0, groups: ["business"], perPage: 20),
  )
  print("Templates in \"business\" group:", businessTemplates.assets.map(\.id))

  let allTemplates = try await engine.asset.findAssets(
    sourceID: "my.custom.templates",
    query: .init(query: nil, page: 0, perPage: 100),
  )
  print("Total custom templates:", allTemplates.total)

  // List registered sources, read a source's groups, and remove a source.
  let templateSources = engine.asset.findAllSources().filter { $0.contains("template") }
  print("Template sources:", templateSources)

  let groups = try await engine.asset.getGroups(sourceID: "my.custom.templates")
  print("Available groups:", groups)

  try engine.asset.removeSource(sourceID: hostedSourceID)

  // React to sources being added or removed.
  let addedTask = Task {
    for await sourceID in engine.asset.onAssetSourceAdded {
      print("Asset source added:", sourceID)
      break
    }
  }
  try engine.asset.addLocalSource(sourceID: "seasonal.templates")
  addedTask.cancel()

  let removedTask = Task {
    for await sourceID in engine.asset.onAssetSourceRemoved {
      print("Asset source removed:", sourceID)
      break
    }
  }
  try engine.asset.removeSource(sourceID: "seasonal.templates")
  removedTask.cancel()
}
```

Configure and populate a Template Library with the Swift Engine API so your
app can offer predefined design templates that users browse, select, and
apply to the current scene.

> **Reading time:** 6 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.83.0-nightly.20260905/engine-guides-use-templates-library)

<EngineReferenceNote {...props} />

Templates are pre-designed scenes stored as assets within an asset source. Each template asset keeps the URL of its `.scene` file in its metadata, and an apply callback loads that scene into the current design when the template is selected. This makes templates different from image or sticker sources: instead of instantiating a single block, a template applies a complete scene.

This guide covers creating a custom template source, handling template application, registering templates from a hosted JSON file, querying templates, and managing template sources.

## Setup

Create a design scene for templates to be applied to. Applying a template keeps the current scene's design unit and page dimensions, adjusting the template's content to fit.

```swift highlight-templateLibrary-setup
// Create a design scene that templates will be applied to.
let scene = try engine.scene.create()
let page = try engine.block.create(.page)
try engine.block.setWidth(page, value: 800)
try engine.block.setHeight(page, value: 600)
try engine.block.appendChild(to: scene, child: page)
```

## Creating Custom Template Sources

Register a local source with `addLocalSource(sourceID:applyAsset:)`. The `applyAsset` callback runs when a template is selected: it reads the scene URL from the asset's `meta["uri"]` and applies it with `engine.scene.applyTemplate(from:)`. Return `nil` because applying a template mutates the current scene rather than creating a new block. The source retains this callback for its lifetime, so capture `engine` weakly to avoid a retain cycle.

```swift highlight-templateLibrary-customSource
// Register a local template source. The `applyAsset` callback runs when a
// template is selected: it reads the scene URL from the asset's metadata and
// applies it to the current scene, keeping the current page dimensions.
try engine.asset.addLocalSource(sourceID: "my.custom.templates", applyAsset: { [weak engine] asset in
  guard let engine, let uri = asset.meta?["uri"], let sceneURL = URL(string: uri) else {
    return nil
  }
  try await engine.scene.applyTemplate(from: sceneURL)
  return nil
})
```

Add template assets with `addAsset(to:asset:)`. Build each asset's `meta` URLs from the base URL where you host your `.scene` files and thumbnails. Every `AssetDefinition` can include:

- `id` — Unique identifier for the template.
- `label` — Localized display name, for example `["en": "Business Card"]`.
- `tags` — Localized keywords used for free-text search.
- `groups` — Categories used for filtering.
- `meta["uri"]` — URL of the `.scene` file to apply. Required for template application.
- `meta["thumbUri"]` — Thumbnail image URL shown in previews.

```swift highlight-templateLibrary-addAssets
  // Add template assets. Each asset's `meta` carries the `uri` of the `.scene`
  // file to apply and a `thumbUri` for the preview thumbnail.
  try engine.asset.addAsset(
    to: "my.custom.templates",
    asset: AssetDefinition(
      id: "business-card",
      groups: ["business"],
      meta: [
        "uri": baseURL
          .appendingPathComponent("ly.img.templates/templates/cesdk_business_card_1.scene")
          .absoluteString,
        "thumbUri": baseURL
          .appendingPathComponent("ly.img.templates/thumbnails/cesdk_business_card_1.jpg")
          .absoluteString,
      ],
      label: ["en": "Business Card"],
      tags: ["en": ["business", "card"]],
    ),
  )

  try engine.asset.addAsset(
    to: "my.custom.templates",
    asset: AssetDefinition(
      id: "blank-canvas",
      groups: ["basics"],
      meta: [
        "uri": baseURL
          .appendingPathComponent("ly.img.templates/templates/cesdk_blank_1.scene")
          .absoluteString,
        "thumbUri": baseURL
          .appendingPathComponent("ly.img.templates/thumbnails/cesdk_blank_1.png")
          .absoluteString,
      ],
      label: ["en": "Blank Canvas"],
      tags: ["en": ["blank", "empty"]],
    ),
  )
```

### From Remote URI

For production, register a template source from a hosted `content.json` file with `addLocalAssetSourceFromJSON(_:)`. The parent directory of the JSON URL becomes the base path for resolving relative URLs inside it, so you can host templates and thumbnails alongside the JSON.

```swift highlight-templateLibrary-fromJSON
// For production, register a template source from a hosted `content.json`
// file. The parent directory of the JSON becomes the base path for resolving
// relative URLs inside it.
let contentURL = baseURL.appendingPathComponent("ly.img.templates/content.json")
let hostedSourceID = try await engine.asset.addLocalAssetSourceFromJSON(contentURL)
print("Registered hosted template source:", hostedSourceID)
```

## Querying Templates Programmatically

Search a source with `findAssets(sourceID:query:)`. Filter by `groups`, search free text with `query`, and page through results with `page` and `perPage`.

```swift highlight-templateLibrary-query
  // Query templates with pagination and group filtering.
  let businessTemplates = try await engine.asset.findAssets(
    sourceID: "my.custom.templates",
    query: .init(query: nil, page: 0, groups: ["business"], perPage: 20),
  )
  print("Templates in \"business\" group:", businessTemplates.assets.map(\.id))

  let allTemplates = try await engine.asset.findAssets(
    sourceID: "my.custom.templates",
    query: .init(query: nil, page: 0, perPage: 100),
  )
  print("Total custom templates:", allTemplates.total)
```

The returned `AssetQueryResult` exposes the matching `assets`, the `currentPage`, the `nextPage` (`-1` when there is no further page), and the `total` count across all pages.

## Managing Template Sources

List sources with `findAllSources()`, read a source's categories with `getGroups(sourceID:)`, and remove a source with `removeSource(sourceID:)`.

```swift highlight-templateLibrary-manageSources
  // List registered sources, read a source's groups, and remove a source.
  let templateSources = engine.asset.findAllSources().filter { $0.contains("template") }
  print("Template sources:", templateSources)

  let groups = try await engine.asset.getGroups(sourceID: "my.custom.templates")
  print("Available groups:", groups)

  try engine.asset.removeSource(sourceID: hostedSourceID)
```

Subscribe to `onAssetSourceAdded` and `onAssetSourceRemoved` to react when sources change. Both are `AsyncStream<String>` sequences that yield the affected source ID.

```swift highlight-templateLibrary-monitorSources
  // React to sources being added or removed.
  let addedTask = Task {
    for await sourceID in engine.asset.onAssetSourceAdded {
      print("Asset source added:", sourceID)
      break
    }
  }
  try engine.asset.addLocalSource(sourceID: "seasonal.templates")
  addedTask.cancel()

  let removedTask = Task {
    for await sourceID in engine.asset.onAssetSourceRemoved {
      print("Asset source removed:", sourceID)
      break
    }
  }
  try engine.asset.removeSource(sourceID: "seasonal.templates")
  removedTask.cancel()
```

## Troubleshooting

- **Templates not appearing**: Confirm the source is registered by checking that its ID is returned by `findAllSources()`.

- **Templates not applying**: The apply callback returns `nil` when an asset is missing `meta["uri"]`, so a misconfigured template is skipped instead of crashing. Verify each asset's `uri` points to a `.scene` file your app can load.

- **Thumbnails not loading**: Verify each `meta["thumbUri"]` is a reachable URL.

## API Reference

| Method                                              | Category | Purpose                                        |
| --------------------------------------------------- | -------- | ---------------------------------------------- |
| `engine.asset.addLocalSource(sourceID:applyAsset:)` | Asset    | Create a source with a template apply callback |
| `engine.asset.addAsset(to:asset:)`                  | Asset    | Add a template asset to a source               |
| `engine.scene.applyTemplate(from:)`                 | Scene    | Apply a template scene to the current scene    |
| `engine.asset.addLocalAssetSourceFromJSON(_:)`      | Asset    | Register a source from a hosted JSON file       |
| `engine.asset.findAssets(sourceID:query:)`          | Asset    | Query a source with filtering and pagination   |
| `engine.asset.findAllSources()`                     | Asset    | List the IDs of all registered sources         |
| `engine.asset.getGroups(sourceID:)`                 | Asset    | Read the available groups of a source          |
| `engine.asset.removeSource(sourceID:)`              | Asset    | Remove a source                                |
| `engine.asset.onAssetSourceAdded`                   | Asset    | Stream of IDs for sources as they are added    |
| `engine.asset.onAssetSourceRemoved`                 | Asset    | Stream of IDs for sources as they are removed  |

## Next Steps

- [Apply Templates](./apply-template.md) — Apply a template scene to the current design from a string or URL.
- [Asset Sources](../concepts/assets.md) — Understand how asset sources organize and deliver content.
- [Serve Assets](../serve-assets.md) — Host your templates, scenes, and thumbnails for production.



---

## More Resources

- **[macOS Documentation Index](https://img.ly/docs/cesdk/macos/)** - Browse all macOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/macos/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/macos/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
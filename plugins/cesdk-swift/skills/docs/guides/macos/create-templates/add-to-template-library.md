> This is one page of the CE.SDK macOS documentation. For a complete overview, see the [macOS Documentation Index](https://img.ly/docs/cesdk/macos/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/macos/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Create and Use Templates](../create-templates.md) > [Add to Template Library](./add-to-template-library.md)

---

```swift file=@cesdk_swift_examples/engine-guides-create-templates-add-to-template-library/AddToTemplateLibrary.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func addToTemplateLibrary(engine: Engine) async throws {
  let baseURL = try engine.guidesBaseURL

  // Load a design so there is something to save as a template. In your app this
  // is whatever the user is currently editing.
  let starterURL = baseURL.appendingPathComponent("ly.img.templates/templates/cesdk_business_card_1.scene")
  try await engine.scene.load(from: starterURL)

  let templateString = try await engine.scene.saveToString()
  let stringURL = FileManager.default.temporaryDirectory
    .appendingPathComponent("template-\(UUID().uuidString).imgly")
  try templateString.write(to: stringURL, atomically: true, encoding: .utf8)

  let templateArchive = try await engine.scene.saveToArchive()
  let archiveURL = FileManager.default.temporaryDirectory
    .appendingPathComponent("template-\(UUID().uuidString).imgly")
  try templateArchive.write(to: archiveURL)

  try engine.asset.addLocalSource(sourceID: "my-templates", applyAsset: { [weak engine] asset in
    guard let engine, let uri = asset.meta?["uri"], let url = URL(string: uri) else { return nil }
    try await engine.scene.applyTemplate(from: url)
    return nil
  })

  let templates = [
    AssetDefinition(
      id: "template-business-card",
      meta: [
        "uri": baseURL.appendingPathComponent("ly.img.templates/templates/cesdk_business_card_1.scene").absoluteString,
        "thumbUri": baseURL.appendingPathComponent("ly.img.templates/thumbnails/cesdk_business_card_1.jpg")
          .absoluteString,
      ],
      label: ["en": "Business Card"],
    ),
    AssetDefinition(
      id: "template-blank",
      meta: [
        "uri": baseURL.appendingPathComponent("ly.img.templates/templates/cesdk_blank_1.scene").absoluteString,
        "thumbUri": baseURL.appendingPathComponent("ly.img.templates/thumbnails/cesdk_blank_1.png").absoluteString,
      ],
      label: ["en": "Blank"],
    ),
    AssetDefinition(
      id: "template-postcard",
      meta: [
        "uri": baseURL.appendingPathComponent("ly.img.templates/templates/cesdk_postcard_1.scene").absoluteString,
        "thumbUri": baseURL.appendingPathComponent("ly.img.templates/thumbnails/cesdk_postcard_1.jpg").absoluteString,
      ],
      label: ["en": "Postcard"],
    ),
  ]
  for template in templates {
    try engine.asset.addAsset(to: "my-templates", asset: template)
  }

  let sources = engine.asset.findAllSources()
  print("Registered sources:", sources)

  let results = try await engine.asset.findAssets(
    sourceID: "my-templates",
    query: .init(query: nil, page: 0, perPage: 10),
  )
  print("Templates in library:", results.total)

  try engine.asset.removeAsset(from: "my-templates", assetID: "template-postcard")
  try engine.asset.assetSourceContentsChanged(sourceID: "my-templates")
}
```

Create a template library where templates are stored, managed, and applied programmatically through a custom asset source.

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.81.0-nightly.20260811/engine-guides-create-templates-add-to-template-library)

<EngineReferenceNote {...props} />

Templates in CE.SDK are stored and accessed through the asset system. A template library is a local asset source configured to hold and serve template assets, so users can browse thumbnails and apply templates to their designs. This guide covers saving scenes as templates, creating a template asset source, adding templates with metadata, and managing them.

## Saving Templates

With a design open in the engine, export the current scene as a template file. Scenes serialize in two formats.

### String Format

Use `engine.scene.saveToString()` to serialize the scene to a base64 string. This lightweight format references assets by URL, so it is ideal for templates whose assets are hosted on a CDN. Persist the string wherever you store templates — a database, or a `.scene` file as shown here.

```swift highlight-addToTemplateLibrary-saveString
let templateString = try await engine.scene.saveToString()
let stringURL = FileManager.default.temporaryDirectory
  .appendingPathComponent("template-\(UUID().uuidString).imgly")
try templateString.write(to: stringURL, atomically: true, encoding: .utf8)
```

### Archive Format

For self-contained templates that bundle all assets, use `engine.scene.saveToArchive()`. It returns `Data` (the `Blob` typealias) holding a `.zip` archive with every asset embedded, making the template portable without external dependencies.

```swift highlight-addToTemplateLibrary-saveArchive
let templateArchive = try await engine.scene.saveToArchive()
let archiveURL = FileManager.default.temporaryDirectory
  .appendingPathComponent("template-\(UUID().uuidString).imgly")
try templateArchive.write(to: archiveURL)
```

## Creating a Template Asset Source

Register a local asset source with `engine.asset.addLocalSource(sourceID:applyAsset:)`. The `applyAsset` closure runs when a template is selected: it reads the asset's `meta["uri"]` and calls `engine.scene.applyTemplate(from:)`, which keeps the current scene's page dimensions and design unit while resizing the template's content to fit them. Return `nil` because applying a template mutates the current scene rather than creating a new block.

Capture `engine` weakly: the source retains this callback for its lifetime, so a strong capture would risk a retain cycle.

```swift highlight-addToTemplateLibrary-createSource
try engine.asset.addLocalSource(sourceID: "my-templates", applyAsset: { [weak engine] asset in
  guard let engine, let uri = asset.meta?["uri"], let url = URL(string: uri) else { return nil }
  try await engine.scene.applyTemplate(from: url)
  return nil
})
```

`applyTemplate(from:)` accepts a serialized scene string or a URL to a `.scene` file — not a `.zip` archive. To start from an archive, load it with `engine.scene.load(from:)`, which replaces the current scene instead of merging a template into it.

## Adding Templates to the Source

Register templates with `engine.asset.addAsset(to:asset:)`, passing an `AssetDefinition` that carries the display metadata and load URLs. Build each `uri` and `thumbUri` from the base URL where you host your assets.

```swift highlight-addToTemplateLibrary-addTemplates
let templates = [
  AssetDefinition(
    id: "template-business-card",
    meta: [
      "uri": baseURL.appendingPathComponent("ly.img.templates/templates/cesdk_business_card_1.scene").absoluteString,
      "thumbUri": baseURL.appendingPathComponent("ly.img.templates/thumbnails/cesdk_business_card_1.jpg")
        .absoluteString,
    ],
    label: ["en": "Business Card"],
  ),
  AssetDefinition(
    id: "template-blank",
    meta: [
      "uri": baseURL.appendingPathComponent("ly.img.templates/templates/cesdk_blank_1.scene").absoluteString,
      "thumbUri": baseURL.appendingPathComponent("ly.img.templates/thumbnails/cesdk_blank_1.png").absoluteString,
    ],
    label: ["en": "Blank"],
  ),
  AssetDefinition(
    id: "template-postcard",
    meta: [
      "uri": baseURL.appendingPathComponent("ly.img.templates/templates/cesdk_postcard_1.scene").absoluteString,
      "thumbUri": baseURL.appendingPathComponent("ly.img.templates/thumbnails/cesdk_postcard_1.jpg").absoluteString,
    ],
    label: ["en": "Postcard"],
  ),
]
for template in templates {
  try engine.asset.addAsset(to: "my-templates", asset: template)
}
```

Each template asset requires:

- `id` — Unique identifier for the template
- `label` — Localized display name shown in the template library. `IMGLYEngine.Locale` is a `String` typealias, so use plain language keys such as `["en": "Business Card"]`
- `meta["uri"]` — URL to the `.scene` file or archive loaded when the template is applied
- `meta["thumbUri"]` — URL to a preview image displayed in the template library grid

## Managing Templates

After the initial setup, manage templates programmatically.

```swift highlight-addToTemplateLibrary-manage
  let sources = engine.asset.findAllSources()
  print("Registered sources:", sources)

  let results = try await engine.asset.findAssets(
    sourceID: "my-templates",
    query: .init(query: nil, page: 0, perPage: 10),
  )
  print("Templates in library:", results.total)

  try engine.asset.removeAsset(from: "my-templates", assetID: "template-postcard")
  try engine.asset.assetSourceContentsChanged(sourceID: "my-templates")
```

List registered source IDs with `engine.asset.findAllSources()`, and page through a source's templates with `engine.asset.findAssets(sourceID:query:)` — `results.total` reports the count. Remove a template with `engine.asset.removeAsset(from:assetID:)`, then call `engine.asset.assetSourceContentsChanged(sourceID:)` to notify any connected UI that the source changed.

## Troubleshooting

| Issue | Cause | Solution |
| --- | --- | --- |
| Template fails to load | Incorrect URI in the asset's `meta` | Verify `meta["uri"]` points to a valid `.scene` file or archive |
| Apply callback not triggered | `applyAsset` closure not provided to `addLocalSource` | Pass the `applyAsset:` closure when creating the source |
| Empty query results | Templates queried before they were added | Call `addAsset(to:asset:)` before `findAssets(sourceID:query:)` |

## API Reference

| Method | Description |
| --- | --- |
| `engine.asset.addLocalSource(sourceID:applyAsset:)` | Register a local asset source with an apply callback |
| `engine.asset.addAsset(to:asset:)` | Add an asset to a registered source |
| `engine.asset.removeAsset(from:assetID:)` | Remove an asset from a source by ID |
| `engine.asset.findAllSources()` | List registered asset source IDs |
| `engine.asset.findAssets(sourceID:query:)` | Query a source's assets with paging |
| `engine.asset.assetSourceContentsChanged(sourceID:)` | Notify the UI that a source's contents changed |
| `engine.scene.saveToString()` | Serialize the scene to a base64 string |
| `engine.scene.saveToArchive()` | Save the scene as a self-contained archive (`Data`) |
| `engine.scene.applyTemplate(from:)` | Apply a template to the current scene |

## Next Steps

- [Create From Scratch](./from-scratch.md) — Build reusable templates programmatically with the Engine API
- [Text Variables](./add-dynamic-content/text-variables.md) — Add dynamic text content to templates
- [Placeholders](./add-dynamic-content/placeholders.md) — Create editable image and video areas
- Customize Asset Library — Organize and present asset sources in the library



---

## More Resources

- **[macOS Documentation Index](https://img.ly/docs/cesdk/macos/)** - Browse all macOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/macos/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/macos/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
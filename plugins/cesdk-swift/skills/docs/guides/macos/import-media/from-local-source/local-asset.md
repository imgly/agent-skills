> This is one page of the CE.SDK macOS documentation. For a complete overview, see the [macOS Documentation Index](https://img.ly/docs/cesdk/macos/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/macos/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Import Media Assets](../../import-media.md) > [Import From Local Source](../from-local-source.md) > [Import Local Asset](./local-asset.md)

---

```swift file=@cesdk_swift_examples/engine-guides-import-media-local-asset/ImportLocalAsset.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func importLocalAsset(engine: Engine) async throws {
  let baseURL = try engine.guidesBaseURL

  try engine.asset.addLocalSource(sourceID: "my-local-images")

  try engine.asset.addLocalSource(
    sourceID: "my-local-audio",
    supportedMimeTypes: ["audio/mpeg", "audio/mp4"],
  )

  // application bundle
  let bundledImageURLs = Bundle.main.urls(
    forResourcesWithExtension: "jpg",
    subdirectory: "SampleImages",
  ) ?? []

  // Application Support directory
  let supportDirectory = try FileManager.default.url(
    for: .applicationSupportDirectory,
    in: .userDomainMask,
    appropriateFor: nil,
    create: true,
  )
  let managedImageURLs = try FileManager.default.contentsOfDirectory(
    at: supportDirectory,
    includingPropertiesForKeys: nil,
    options: [.skipsHiddenFiles],
  ).filter { ["jpg", "jpeg", "png"].contains($0.pathExtension.lowercased()) }

  print("Located \(bundledImageURLs.count) bundled and \(managedImageURLs.count) managed images")

  let imageURL = baseURL.appendingPathComponent("ly.img.image/images/sample_1.jpg")
  let thumbnailURL = baseURL.appendingPathComponent("ly.img.image/thumbnails/sample_1.jpg")

  let imageAsset = AssetDefinition(
    id: "local-image-1",
    meta: [
      "uri": imageURL.absoluteString,
      "thumbUri": thumbnailURL.absoluteString,
      "fillType": "//ly.img.ubq/fill/image",
    ],
    label: ["en": "Mountain Landscape"],
    tags: ["en": ["local", "nature", "mountain"]],
  )

  try engine.asset.addAsset(to: "my-local-images", asset: imageAsset)

  let result = try await engine.asset.findAssets(
    sourceID: "my-local-images",
    query: .init(query: nil, page: 0, perPage: 10),
  )
  print("The source now holds \(result.total) asset(s)")
}
```

Register a local asset source, describe files that already live on the device as assets, and add them to the source so users can reuse them throughout your app.

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.81.1-rc.0/engine-guides-import-media-local-asset)

<EngineReferenceNote {...props} />

A local asset source is a named repository you register with the engine. It owns a list of assets and, unlike a remote source, resolves every asset from a local file URL — an image bundled with your app, a file your app manages, or a file the user picked from disk. Once a file is registered as an asset, the engine indexes it, makes it searchable, and can insert it into a scene. This guide covers registering a source, turning a file URL into an asset, and adding it. Querying, updating, and removing assets are covered in the [Edit or Remove Assets](../edit-or-remove-assets.md) guide.

## Register a Local Asset Source

Create a source with `addLocalSource(sourceID:)`. The `sourceID` must be unique, and you reuse it for every later operation on the source.

```swift highlight-importLocalAsset-register
try engine.asset.addLocalSource(sourceID: "my-local-images")
```

A single source can hold images, videos, and audio together. To declare which types a source is meant to hold, pass `supportedMimeTypes`. The engine reports this list back through `getSupportedMIMETypes(sourceID:)`, which your own upload UI or validation code can read to decide which files to accept. Omit the parameter to leave the source open to every type.

```swift highlight-importLocalAsset-restrictMimeTypes
try engine.asset.addLocalSource(
  sourceID: "my-local-audio",
  supportedMimeTypes: ["audio/mpeg", "audio/mp4"],
)
```

`addLocalSource` also accepts optional `applyAsset` and `applyAssetToBlock` callbacks that override how the engine inserts this source's assets onto the canvas; omit them, as here, to use the default insertion behavior.

Whether you use one source or several is an organizational choice. A dedicated source per media type keeps unrelated assets apart; a single mixed source is simpler to manage.

## Locate Files on the Device

Every asset needs a URL that points to the actual file. There are three regular places to keep local files, each with different lifetime and access guarantees:

- The **application bundle**, for assets you ship with the app. These are read-only.
- The **Application Support** directory, for files your app creates and manages on the user's behalf. This is the right home for editor-managed media.
- The **Documents** directory, for user-facing files. Both you and the user have full control, so the user can move or delete them.

```swift highlight-importLocalAsset-locateFiles
  // application bundle
  let bundledImageURLs = Bundle.main.urls(
    forResourcesWithExtension: "jpg",
    subdirectory: "SampleImages",
  ) ?? []

  // Application Support directory
  let supportDirectory = try FileManager.default.url(
    for: .applicationSupportDirectory,
    in: .userDomainMask,
    appropriateFor: nil,
    create: true,
  )
  let managedImageURLs = try FileManager.default.contentsOfDirectory(
    at: supportDirectory,
    includingPropertiesForKeys: nil,
    options: [.skipsHiddenFiles],
  ).filter { ["jpg", "jpeg", "png"].contains($0.pathExtension.lowercased()) }

  print("Located \(bundledImageURLs.count) bundled and \(managedImageURLs.count) managed images")
```

> **Note:** The system can clear the temporary and caches directories at any time without asking the user. They are poor homes for source files but excellent for regenerable data such as thumbnails.

A file picker is another common way to obtain a URL — forward the picked URL to the next step. On iOS, the editor's built-in upload and photo-library flows do this for you; see the User Upload and Photo Roll guides.

## Describe an Asset

An asset is a file URL plus metadata, wrapped in an `AssetDefinition`. The minimum is a unique `id` and a `meta` dictionary with a `uri`. For an image, add a `fillType` of `//ly.img.ubq/fill/image` so the engine applies an image fill when the asset is inserted, and a `thumbUri` pointing at a small preview so the asset library loads quickly, separate from the full-resolution `uri`.

The example below uses a bundled sample image in place of one of the URLs you located above — such as `bundledImageURLs.first` — so it runs on its own; wire your own local file URL in exactly the same way.

```swift highlight-importLocalAsset-definition
  let imageURL = baseURL.appendingPathComponent("ly.img.image/images/sample_1.jpg")
  let thumbnailURL = baseURL.appendingPathComponent("ly.img.image/thumbnails/sample_1.jpg")

  let imageAsset = AssetDefinition(
    id: "local-image-1",
    meta: [
      "uri": imageURL.absoluteString,
      "thumbUri": thumbnailURL.absoluteString,
      "fillType": "//ly.img.ubq/fill/image",
    ],
    label: ["en": "Mountain Landscape"],
    tags: ["en": ["local", "nature", "mountain"]],
  )
```

The localized `label` and `tags` make the asset findable through free-text search and describe it for accessibility. You can add more entries to `meta` — `width` and `height` set the asset's aspect ratio on insert, and `mimeType` records its format. A video asset should carry a `thumbUri` still image so it shows a proper preview, and both video and audio assets benefit from a `duration` entry.

> **Caution:** An absolute file URL points into your app's container, whose location changes between installs and differs across devices and machines. A design saved with `saveToString()` keeps those URLs verbatim, so a scene that references locally imported files won't reload elsewhere. To persist such a scene, use `engine.scene.saveToArchive()` — it embeds the referenced files and rewrites their URLs to archive-relative paths. Use `relocateResource(currentURL:relocatedURL:)` to repoint a resource that has moved.

## Add the Asset to the Source

Add the finished definition with `addAsset(to:asset:)`. The engine indexes it immediately, exposes it to search, and emits a source-changed event — so any surface already displaying the source, including the editor UI when present, refreshes on its own. You don't need to notify the engine after adding or removing an asset.

```swift highlight-importLocalAsset-add
try engine.asset.addAsset(to: "my-local-images", asset: imageAsset)
```

Call `assetSourceContentsChanged(sourceID:)` yourself only when a source's contents change through a path the engine can't observe — for example, after you rewrite the backing files on disk or update a custom asset source's store outside `addAsset`/`removeAsset`.

## Verify the Source Contents

Query the source with `findAssets(sourceID:query:)` to confirm the asset landed. `AssetQueryData` takes an optional fuzzy `query` string, plus `page` and `perPage` for pagination; the result reports the `total` count and the matching `assets`.

```swift highlight-importLocalAsset-verify
let result = try await engine.asset.findAssets(
  sourceID: "my-local-images",
  query: .init(query: nil, page: 0, perPage: 10),
)
print("The source now holds \(result.total) asset(s)")
```

## Displaying Assets in the Editor

On iOS, you surface a registered source in the prebuilt editor's Asset Panel by adding it to a tab. A tab renders every asset in its bound source with that tab's item view — the Images tab draws each asset as an image — so it does not filter a mixed source by type. The default library reflects this by backing each tab with a dedicated per-type source (`ly.img.image`, `ly.img.video`, `ly.img.audio`), so keep a source's contents matched to the tab it appears in and split assets across per-type sources when you need more than one type. To place a source in the panel and choose its tab, see the Asset Library Basics and Customize Asset Library guides.

## Best Practices

- **Keep the `sourceID` stable** — Changing it after users have interacted with a source breaks search history and any saved references.
- **Store managed files outside Documents** — Keep editor-managed media in Application Support so the user can't delete it out from under the app.
- **Generate real thumbnails** — Point `thumbUri` at a small preview rather than the full-resolution file so the library stays responsive.
- **Localize `label` and `tags`** — Free-text search matches on both fields, so populate them for every asset you want users to find.
- **Notify only for out-of-band changes** — `addAsset` and `removeAsset` refresh the UI for you; call `assetSourceContentsChanged(sourceID:)` yourself only when a source's contents change outside those calls.

## Troubleshooting

| Issue | Cause | Solution |
| --- | --- | --- |
| Asset shows a gray or error icon | Missing or invalid `uri`, or a missing `thumbUri` for a video asset | Confirm `uri` points at a readable file and set a valid `thumbUri` |
| Assets disappear after relaunch | Files were stored only in Caches or a temporary directory | Copy files into Application Support (or your backend) and re-register them at launch |
| A saved scene can't find its images elsewhere | The scene stored absolute app-container file URLs | Persist with `saveToArchive()`, which embeds the files and rewrites their URLs to relative paths |
| Search doesn't find an asset | Empty `label` and `tags` | Populate localized `label` and `tags` in the `AssetDefinition` |
| Adding an asset throws | An asset with the same `id` already exists in the source | Use a unique `id`, or remove the existing asset before re-adding it |

## API Reference

### Methods

| Method | Description |
| --- | --- |
| `addLocalSource(sourceID:supportedMimeTypes:applyAsset:applyAssetToBlock:)` | Register a local asset source. Every parameter after `sourceID` is optional: `supportedMimeTypes` declares which types the source holds; `applyAsset` / `applyAssetToBlock` override how the engine inserts its assets. |
| `addAsset(to:asset:)` | Add an asset to a local source |
| `getSupportedMIMETypes(sourceID:)` | Read back the MIME types a source declares (empty means all types) |
| `assetSourceContentsChanged(sourceID:)` | Notify subscribers that a source's contents changed |
| `findAssets(sourceID:query:)` | Query a source's assets with filtering and pagination |

### Meta Keys

These are well-known keys the engine reads from the `AssetDefinition.meta` dictionary — not Swift properties on `AssetDefinition` (whose properties are `id`, `groups`, `meta`, `payload`, `label`, and `tags`).

| Key | Type | Description |
| --- | --- | --- |
| `uri` | String | URL of the asset's file |
| `thumbUri` | String | URL of the asset's thumbnail preview |
| `fillType` | String | Fill applied when the asset is inserted (`//ly.img.ubq/fill/image` for images) |

## Next Steps

- [Edit or Remove Assets](../edit-or-remove-assets.md) — Query, update, and remove assets or entire sources.
- User Upload — On iOS, let users add files through the editor's upload button.
- Photo Roll — On iOS, import photos directly from the device's photo library.
- [Import from a Remote Source](../from-remote-source.md) — Connect the editor to a server or third-party service.



---

## More Resources

- **[macOS Documentation Index](https://img.ly/docs/cesdk/macos/)** - Browse all macOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/macos/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/macos/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
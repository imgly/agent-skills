> This is one page of the CE.SDK Mac Catalyst documentation. For a complete overview, see the [Mac Catalyst Documentation Index](https://img.ly/docs/cesdk/mac-catalyst/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/mac-catalyst/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Import Media Assets](../import-media.md) > [Edit or Remove Assets](./edit-or-remove-assets.md)

---

```swift file=@cesdk_swift_examples/engine-guides-edit-or-remove-assets/EditOrRemoveAssets.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func editOrRemoveAssets(engine: Engine) async throws {
  let baseURL = try engine.guidesBaseURL

  try engine.asset.addLocalSource(sourceID: "my-uploads")

  let mountainURI = baseURL.appendingPathComponent("ly.img.image/images/sample_1.jpg").absoluteString
  let mountainThumbURI = baseURL.appendingPathComponent("ly.img.image/thumbnails/sample_1.jpg").absoluteString
  try engine.asset.addAsset(to: "my-uploads", asset: AssetDefinition(
    id: "image-1",
    meta: [
      "uri": mountainURI,
      "thumbUri": mountainThumbURI,
      "fillType": "//ly.img.ubq/fill/image",
    ],
    label: ["en": "Mountain Landscape"],
    tags: ["en": ["nature", "mountain"]],
  ))

  let oceanURI = baseURL.appendingPathComponent("ly.img.image/images/sample_2.jpg").absoluteString
  let oceanThumbURI = baseURL.appendingPathComponent("ly.img.image/thumbnails/sample_2.jpg").absoluteString
  try engine.asset.addAsset(to: "my-uploads", asset: AssetDefinition(
    id: "image-2",
    meta: [
      "uri": oceanURI,
      "thumbUri": oceanThumbURI,
      "fillType": "//ly.img.ubq/fill/image",
    ],
    label: ["en": "Ocean Waves"],
    tags: ["en": ["nature", "water"]],
  ))

  let forestURI = baseURL.appendingPathComponent("ly.img.image/images/sample_3.jpg").absoluteString
  let forestThumbURI = baseURL.appendingPathComponent("ly.img.image/thumbnails/sample_3.jpg").absoluteString
  try engine.asset.addAsset(to: "my-uploads", asset: AssetDefinition(
    id: "image-3",
    meta: [
      "uri": forestURI,
      "thumbUri": forestThumbURI,
      "fillType": "//ly.img.ubq/fill/image",
    ],
    label: ["en": "Forest Path"],
    tags: ["en": ["nature", "forest"]],
  ))

  let result = try await engine.asset.findAssets(
    sourceID: "my-uploads",
    query: .init(query: "nature", page: 0, perPage: 100),
  )
  let assetToModify = result.assets.first { $0.id == "image-1" }
  print("Found \(result.total) assets; editing \(assetToModify?.label ?? "none")")

  try engine.asset.removeAsset(from: "my-uploads", assetID: "image-1")
  try engine.asset.addAsset(to: "my-uploads", asset: AssetDefinition(
    id: "image-1",
    meta: [
      "uri": mountainURI,
      "thumbUri": mountainThumbURI,
      "fillType": "//ly.img.ubq/fill/image",
    ],
    label: ["en": "Updated Mountain Photo"],
    tags: ["en": ["nature", "mountain", "updated"]],
  ))

  try engine.asset.removeAsset(from: "my-uploads", assetID: "image-2")

  try engine.asset.assetSourceContentsChanged(sourceID: "my-uploads")

  let temporaryURI = baseURL.appendingPathComponent("ly.img.image/images/sample_4.jpg").absoluteString
  let temporaryThumbURI = baseURL.appendingPathComponent("ly.img.image/thumbnails/sample_4.jpg").absoluteString
  try engine.asset.addLocalSource(sourceID: "temporary-uploads")
  try engine.asset.addAsset(to: "temporary-uploads", asset: AssetDefinition(
    id: "temp-1",
    meta: [
      "uri": temporaryURI,
      "thumbUri": temporaryThumbURI,
      "fillType": "//ly.img.ubq/fill/image",
    ],
    label: ["en": "Temporary Image"],
  ))

  try engine.asset.removeSource(sourceID: "temporary-uploads")

  let addedListener = Task {
    for await sourceID in engine.asset.onAssetSourceAdded {
      print("Source added: \(sourceID)")
    }
  }
  let removedListener = Task {
    for await sourceID in engine.asset.onAssetSourceRemoved {
      print("Source removed: \(sourceID)")
    }
  }
  let updatedListener = Task {
    for await sourceID in engine.asset.onAssetSourceUpdated {
      print("Source updated: \(sourceID)")
    }
  }

  try engine.asset.addLocalSource(sourceID: "event-demo-source")
  try engine.asset.assetSourceContentsChanged(sourceID: "event-demo-source")
  try engine.asset.removeSource(sourceID: "event-demo-source")

  addedListener.cancel()
  removedListener.cancel()
  updatedListener.cancel()
}
```

Manage assets in local asset sources by updating metadata, removing individual assets, or deleting entire sources.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.81.0-nightly.20260808/engine-guides-edit-or-remove-assets)

<EngineReferenceNote {...props} />

Assets in local sources can be modified or removed after they have been added. CE.SDK provides two levels of removal: individual assets within a source and entire asset sources. This guide covers how to query, update, and remove assets programmatically, and how to notify the engine when a source's contents change. Adding assets to a source is covered in the [Local Asset](./from-local-source/local-asset.md) guide, and on iOS in the User Upload guide.

## Creating a Local Asset Source

To demonstrate editing and removal, first register a local source and populate it. Use `addLocalSource(sourceID:)` to create the source, then `addAsset(to:asset:)` for each asset.

```swift highlight-editOrRemoveAssets-createSource
  try engine.asset.addLocalSource(sourceID: "my-uploads")

  let mountainURI = baseURL.appendingPathComponent("ly.img.image/images/sample_1.jpg").absoluteString
  let mountainThumbURI = baseURL.appendingPathComponent("ly.img.image/thumbnails/sample_1.jpg").absoluteString
  try engine.asset.addAsset(to: "my-uploads", asset: AssetDefinition(
    id: "image-1",
    meta: [
      "uri": mountainURI,
      "thumbUri": mountainThumbURI,
      "fillType": "//ly.img.ubq/fill/image",
    ],
    label: ["en": "Mountain Landscape"],
    tags: ["en": ["nature", "mountain"]],
  ))

  let oceanURI = baseURL.appendingPathComponent("ly.img.image/images/sample_2.jpg").absoluteString
  let oceanThumbURI = baseURL.appendingPathComponent("ly.img.image/thumbnails/sample_2.jpg").absoluteString
  try engine.asset.addAsset(to: "my-uploads", asset: AssetDefinition(
    id: "image-2",
    meta: [
      "uri": oceanURI,
      "thumbUri": oceanThumbURI,
      "fillType": "//ly.img.ubq/fill/image",
    ],
    label: ["en": "Ocean Waves"],
    tags: ["en": ["nature", "water"]],
  ))

  let forestURI = baseURL.appendingPathComponent("ly.img.image/images/sample_3.jpg").absoluteString
  let forestThumbURI = baseURL.appendingPathComponent("ly.img.image/thumbnails/sample_3.jpg").absoluteString
  try engine.asset.addAsset(to: "my-uploads", asset: AssetDefinition(
    id: "image-3",
    meta: [
      "uri": forestURI,
      "thumbUri": forestThumbURI,
      "fillType": "//ly.img.ubq/fill/image",
    ],
    label: ["en": "Forest Path"],
    tags: ["en": ["nature", "forest"]],
  ))
```

Each asset has a unique `id`, a localized `label` and `tags` for searchability, and a `meta` dictionary that holds the asset's `uri`, `thumbUri`, and `fillType`. Point `thumbUri` at a small preview image so the asset library loads quickly, separate from the full-resolution `uri`.

## Finding Assets in a Source

Use `findAssets(sourceID:query:)` to query a source. `AssetQueryData` takes a fuzzy `query` string that matches labels and tags, plus `page` and `perPage` for pagination.

```swift highlight-editOrRemoveAssets-findAssets
let result = try await engine.asset.findAssets(
  sourceID: "my-uploads",
  query: .init(query: "nature", page: 0, perPage: 100),
)
let assetToModify = result.assets.first { $0.id == "image-1" }
print("Found \(result.total) assets; editing \(assetToModify?.label ?? "none")")
```

The call returns an `AssetQueryResult` with the `assets` array, the `total` count, `currentPage`, and `nextPage`. Filter the results by `id` to locate the specific asset you want to edit or remove.

## Updating Asset Metadata

The Asset API has no in-place update. To change an asset's metadata — labels, tags, or `uri` — remove the existing asset and add a new version that keeps the same `id`.

```swift highlight-editOrRemoveAssets-updateMetadata
try engine.asset.removeAsset(from: "my-uploads", assetID: "image-1")
try engine.asset.addAsset(to: "my-uploads", asset: AssetDefinition(
  id: "image-1",
  meta: [
    "uri": mountainURI,
    "thumbUri": mountainThumbURI,
    "fillType": "//ly.img.ubq/fill/image",
  ],
  label: ["en": "Updated Mountain Photo"],
  tags: ["en": ["nature", "mountain", "updated"]],
))
```

Reusing the same `id` keeps references to the asset valid while the label, tags, and other metadata reflect the new values.

## Removing an Asset from a Source

Remove a single asset with `removeAsset(from:assetID:)`. The asset is permanently deleted from the source, but blocks already created from it remain on the canvas — removal only affects the source's contents.

```swift highlight-editOrRemoveAssets-removeAsset
try engine.asset.removeAsset(from: "my-uploads", assetID: "image-2")
```

## Notifying of Changes

After modifying a source, call `assetSourceContentsChanged(sourceID:)`. This emits an update event that subscribers — including the editor UI when present — use to refresh the assets they display.

```swift highlight-editOrRemoveAssets-notifyUI
try engine.asset.assetSourceContentsChanged(sourceID: "my-uploads")
```

## Creating a Temporary Source

Register additional sources for temporary or session-specific assets that you can remove entirely when they are no longer needed.

```swift highlight-editOrRemoveAssets-createTempSource
let temporaryURI = baseURL.appendingPathComponent("ly.img.image/images/sample_4.jpg").absoluteString
let temporaryThumbURI = baseURL.appendingPathComponent("ly.img.image/thumbnails/sample_4.jpg").absoluteString
try engine.asset.addLocalSource(sourceID: "temporary-uploads")
try engine.asset.addAsset(to: "temporary-uploads", asset: AssetDefinition(
  id: "temp-1",
  meta: [
    "uri": temporaryURI,
    "thumbUri": temporaryThumbURI,
    "fillType": "//ly.img.ubq/fill/image",
  ],
  label: ["en": "Temporary Image"],
))
```

## Removing an Entire Asset Source

Remove a complete source and all of its assets with `removeSource(sourceID:)`. Any UI displaying the source stops showing its content.

```swift highlight-editOrRemoveAssets-removeSource
try engine.asset.removeSource(sourceID: "temporary-uploads")
```

Use this when cleaning up temporary sources or when a user deletes an entire category of imported media.

## Listening to Asset Source Events

Subscribe to source lifecycle events to react when sources are added, removed, or have their contents updated — useful for analytics, cleanup, or syncing with external systems. Each event is exposed as an `AsyncStream<String>` of source IDs.

```swift highlight-editOrRemoveAssets-events
  let addedListener = Task {
    for await sourceID in engine.asset.onAssetSourceAdded {
      print("Source added: \(sourceID)")
    }
  }
  let removedListener = Task {
    for await sourceID in engine.asset.onAssetSourceRemoved {
      print("Source removed: \(sourceID)")
    }
  }
  let updatedListener = Task {
    for await sourceID in engine.asset.onAssetSourceUpdated {
      print("Source updated: \(sourceID)")
    }
  }

  try engine.asset.addLocalSource(sourceID: "event-demo-source")
  try engine.asset.assetSourceContentsChanged(sourceID: "event-demo-source")
  try engine.asset.removeSource(sourceID: "event-demo-source")

  addedListener.cancel()
  removedListener.cancel()
  updatedListener.cancel()
```

Iterate each stream inside a `Task`. Cancelling the `Task` unsubscribes, the equivalent of disposing the subscription when you no longer need events.

## Best Practices

- **Query before modifying** — Use `findAssets(sourceID:query:)` to confirm an asset exists before removing it.
- **Notify after changes** — Call `assetSourceContentsChanged(sourceID:)` so the UI reflects edits and removals.
- **Cancel subscriptions** — Store the listening `Task`s and cancel them when you no longer need events to avoid leaks.
- **Reuse IDs to update** — Re-add an asset with the same `id` so existing references keep working after the update.
- **Use descriptive IDs** — Choose unique, meaningful asset IDs for reliable lookups.

## Troubleshooting

| Issue | Cause | Solution |
| --- | --- | --- |
| Asset not found | ID mismatch or already removed | Query the source with `findAssets(sourceID:query:)` to list available assets |
| UI shows stale assets | Missing notification | Call `assetSourceContentsChanged(sourceID:)` after modifying the source |
| Cannot remove asset | Source is not a local source | Only sources created with `addLocalSource(sourceID:)` support asset removal |
| Events never fire | Listener cancelled or started too late | Start the listening `Task` before triggering the operation |

## API Reference

### Methods

| Method | Description |
| --- | --- |
| `addLocalSource(sourceID:)` | Register a local asset source you can add to and remove from |
| `addAsset(to:asset:)` | Add an asset to a local source |
| `findAssets(sourceID:query:)` | Query a source's assets with filtering and pagination |
| `removeAsset(from:assetID:)` | Remove a single asset from a local source |
| `removeSource(sourceID:)` | Remove an entire source and all of its assets |
| `assetSourceContentsChanged(sourceID:)` | Notify subscribers that a source's contents changed |
| `onAssetSourceAdded` | `AsyncStream` of IDs for sources as they are added |
| `onAssetSourceRemoved` | `AsyncStream` of IDs for sources as they are removed |
| `onAssetSourceUpdated` | `AsyncStream` of IDs for sources whose contents changed |

### Properties

| Property | Type | Description |
| --- | --- | --- |
| `uri` | String | URL of the asset's full-resolution file |
| `thumbUri` | String | URL of the asset's thumbnail preview |
| `fillType` | String | Fill applied when the asset is inserted (`//ly.img.ubq/fill/image` for images) |



---

## More Resources

- **[Mac Catalyst Documentation Index](https://img.ly/docs/cesdk/mac-catalyst/)** - Browse all Mac Catalyst documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/mac-catalyst/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/mac-catalyst/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
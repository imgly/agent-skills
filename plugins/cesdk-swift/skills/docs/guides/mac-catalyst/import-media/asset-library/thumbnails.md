> This is one page of the CE.SDK Mac Catalyst documentation. For a complete overview, see the [Mac Catalyst Documentation Index](https://img.ly/docs/cesdk/mac-catalyst/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/mac-catalyst/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Import Media Assets](../../import-media.md) > [Asset Library](../asset-library.md) > [Thumbnails](./thumbnails.md)

---

```swift file=@cesdk_swift_examples/engine-guides-thumbnails/Thumbnails.swift reference-only
import Foundation
import IMGLYEngine

// MARK: - Custom Asset Source

// A custom asset source backed by an external photo service.
private final class StockPhotoSource: NSObject, AssetSource {
  let id = "stock-photos"
  var supportedMIMETypes: [String]? {
    ["image/jpeg"]
  }

  var credits: AssetCredits? {
    nil
  }

  var license: AssetLicense? {
    nil
  }

  private let host = "https://cdn.img.ly/packages/imgly/cesdk-swift/1.81.1/assets"

  func findAssets(queryData: AssetQueryData) async throws -> AssetQueryResult {
    let asset = AssetResult(
      id: "mountain-lake",
      label: "Mountain Lake",
      meta: [
        "uri": "\(host)/ly.img.image/images/sample_1.jpg",
        "thumbUri": "\(host)/ly.img.image/thumbnails/sample_1.jpg",
        "blockType": "//ly.img.ubq/graphic",
        "fillType": "//ly.img.ubq/fill/image",
      ],
      context: AssetContext(sourceID: id),
    )
    return AssetQueryResult(
      assets: [asset],
      currentPage: queryData.page,
      nextPage: -1,
      total: 1,
    )
  }
}

// MARK: - Guide

@MainActor
func thumbnails(engine: Engine) async throws {
  // Base path the example asset URIs are built from. Replace with your own host.
  let baseURL = "https://cdn.img.ly/packages/imgly/cesdk-swift/1.81.1/assets"

  try engine.asset.addLocalSource(sourceID: "my-images")

  let image = AssetDefinition(
    id: "scenic-landscape",
    meta: [
      "uri": "\(baseURL)/ly.img.image/images/sample_1.jpg",
      "thumbUri": "\(baseURL)/ly.img.image/thumbnails/sample_1.jpg",
      "blockType": "//ly.img.ubq/graphic",
      "fillType": "//ly.img.ubq/fill/image",
    ],
    label: ["en": "Scenic Landscape"],
  )
  try engine.asset.addAsset(to: "my-images", asset: image)

  try engine.asset.addLocalSource(sourceID: "my-audio", supportedMimeTypes: ["audio/x-m4a"])

  let audio = AssetDefinition(
    id: "ambient-track",
    meta: [
      "uri": "\(baseURL)/ly.img.audio/audios/dance_harder.m4a",
      "thumbUri": "\(baseURL)/ly.img.audio/thumbnails/dance_harder.jpg",
      "previewUri": "\(baseURL)/ly.img.audio/audios/dance_harder.m4a",
      "mimeType": "audio/x-m4a",
    ],
    label: ["en": "Ambient Track"],
  )
  try engine.asset.addAsset(to: "my-audio", asset: audio)

  let stockSource = StockPhotoSource()
  try engine.asset.addSource(stockSource)

  // Confirm each source returns its assets with the configured metadata.
  for sourceID in ["my-images", "my-audio", "stock-photos"] {
    let results = try await engine.asset.findAssets(
      sourceID: sourceID,
      query: .init(query: nil, page: 0, perPage: 10),
    )
    print("\(sourceID):", results.total, "asset(s)")
  }
}
```

Thumbnails give assets a visual preview in the asset library, helping users
browse images, audio, and other media. This guide configures thumbnail and
preview metadata for local and custom asset sources with the Swift Engine API.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.81.1/engine-guides-thumbnails)

<EngineReferenceNote {...props} />

Thumbnails are configured through an asset's metadata. When you register an asset, you provide a `thumbUri` that the asset library displays as the asset's preview, separate from the full-resolution `uri` used on the canvas. We recommend a **512px width** for `thumbUri` to keep previews crisp without loading the full asset.

The snippets below build their asset URLs from a `baseURL` constant pointing at the CE.SDK asset CDN — replace it with your own asset host.

## Understanding thumbUri vs previewUri

Three URI properties control how an asset is displayed and used:

| Property | Purpose | Used For | Media Type | Set On Block |
|----------|---------|----------|------------|--------------|
| `thumbUri` | Visual thumbnail (UI-only) | Asset library grid display | **Image only** | No |
| `previewUri` | Preview content | Audio playback in the library, and set as a block property on the canvas | **Any media type** | Yes |
| `uri` | Full asset | Final content on the canvas | Any | Yes |

The `thumbUri` is UI-only and must be a raster image. It appears in the asset library but is never set on the block itself.

The `previewUri` is set as a property on the block when the asset is applied to the canvas. It can be any media type and serves both as the library playback preview and as the block's preview content.

For images, only `thumbUri` and `uri` are needed. For audio, all three are useful: `thumbUri` shows a waveform image in the library, `previewUri` provides a short clip for playback, and `uri` loads the full file for export. The `previewUri` is a performance optimization for large audio files — without it the engine loads the full `uri` for preview playback, which is slow for multi-minute tracks.

## Thumbnail Configuration

### Basic Thumbnails

Register a local source with `addLocalSource(sourceID:)`, then add an asset whose metadata includes a `thumbUri` alongside the full-resolution `uri`.

```swift highlight-thumbnails-basic
  try engine.asset.addLocalSource(sourceID: "my-images")

  let image = AssetDefinition(
    id: "scenic-landscape",
    meta: [
      "uri": "\(baseURL)/ly.img.image/images/sample_1.jpg",
      "thumbUri": "\(baseURL)/ly.img.image/thumbnails/sample_1.jpg",
      "blockType": "//ly.img.ubq/graphic",
      "fillType": "//ly.img.ubq/fill/image",
    ],
    label: ["en": "Scenic Landscape"],
  )
  try engine.asset.addAsset(to: "my-images", asset: image)
```

The `thumbUri` points to a 512px-wide image. The asset library renders this thumbnail in its grid while the canvas uses the full-resolution `uri`.

### Preview URIs for Audio

Audio assets add a `previewUri` and a `mimeType`. The `previewUri` serves two purposes: in an audio section of the asset library, the play button streams it (falling back to `uri`) instead of the full file, and when the asset is added to the canvas it is set as a block property for preview playback.

```swift highlight-thumbnails-audioPreview
  try engine.asset.addLocalSource(sourceID: "my-audio", supportedMimeTypes: ["audio/x-m4a"])

  let audio = AssetDefinition(
    id: "ambient-track",
    meta: [
      "uri": "\(baseURL)/ly.img.audio/audios/dance_harder.m4a",
      "thumbUri": "\(baseURL)/ly.img.audio/thumbnails/dance_harder.jpg",
      "previewUri": "\(baseURL)/ly.img.audio/audios/dance_harder.m4a",
      "mimeType": "audio/x-m4a",
    ],
    label: ["en": "Ambient Track"],
  )
  try engine.asset.addAsset(to: "my-audio", asset: audio)
```

The `thumbUri` supplies the waveform image shown beside the track, and the `mimeType` declares the asset's format — pair it with the source's `supportedMimeTypes` to control which audio files the source accepts. In production, point `previewUri` at a shorter clip (around 30 seconds) of the same track; this example reuses the full track URL for brevity.

### Custom Asset Source Thumbnails

A custom source that fetches from an external service maps that service's response onto CE.SDK's metadata inside `findAssets(queryData:)`. Map the high-resolution image to `uri` and the service's small image to `thumbUri`.

```swift highlight-thumbnails-customSource
// A custom asset source backed by an external photo service.
private final class StockPhotoSource: NSObject, AssetSource {
  let id = "stock-photos"
  var supportedMIMETypes: [String]? {
    ["image/jpeg"]
  }

  var credits: AssetCredits? {
    nil
  }

  var license: AssetLicense? {
    nil
  }

  private let host = "https://cdn.img.ly/packages/imgly/cesdk-swift/1.81.1/assets"

  func findAssets(queryData: AssetQueryData) async throws -> AssetQueryResult {
    let asset = AssetResult(
      id: "mountain-lake",
      label: "Mountain Lake",
      meta: [
        "uri": "\(host)/ly.img.image/images/sample_1.jpg",
        "thumbUri": "\(host)/ly.img.image/thumbnails/sample_1.jpg",
        "blockType": "//ly.img.ubq/graphic",
        "fillType": "//ly.img.ubq/fill/image",
      ],
      context: AssetContext(sourceID: id),
    )
    return AssetQueryResult(
      assets: [asset],
      currentPage: queryData.page,
      nextPage: -1,
      total: 1,
    )
  }
}
```

Register the source with `addSource(_:)` so its assets — thumbnails included — appear in the asset library.

```swift highlight-thumbnails-registerCustomSource
let stockSource = StockPhotoSource()
try engine.asset.addSource(stockSource)
```

## Display Customization

On iOS, the editor's asset library shows each asset's `thumbUri` (falling back to `uri`) using a built-in preview that depends on the asset type: images and videos fill a square cell, shapes and stickers fit within one, and audio appears as a list row beside its waveform. This rendering is fixed — it is not driven by asset metadata or exposed as a public setting. What you can customize is the asset library's structure: which sources appear, how they are grouped into sections and tabs, and which built-in section style each uses. See the Customize Asset Library guide.

## Best Practices

- **Size**: Use a 512px width for `thumbUri` to keep previews sharp across devices.
- **Format**: `thumbUri` must be a raster image — use JPEG for photos and PNG for graphics with transparency. SVG thumbnails do not render in the native asset library.
- **When to use previewUri**:
  - Audio: Provide a shorter preview clip (around 30 seconds instead of several minutes).
  - Video: Not supported — use `thumbUri` and `uri` only.
  - Images: Not needed — `thumbUri` is sufficient.
- **Media type constraints**: `thumbUri` must be an image, while `previewUri` can be any media type (currently used for audio).
- **Block property**: Unlike `thumbUri` (UI-only), `previewUri` is set as a property on the block when the asset is applied to the canvas.
- **Performance**: Optimize thumbnail file sizes and serve them from a CDN with cache headers.

## Troubleshooting

**Thumbnails not displaying**:

Verify the `thumbUri` URL resolves and points to a raster image (PNG or JPEG). SVG thumbnails do not render in the native asset library.

**Audio preview not working**:

Confirm `previewUri` (or `uri` as a fallback) points to a valid, reachable audio file — that is what the play button streams. Include a `mimeType` so the source accepts the asset and the engine treats it as audio.

**Slow loading**:

Keep thumbnails small (around 512px wide) and, for audio, point `previewUri` at a short clip rather than the full track.

## API Reference

### Methods

| Method | Description |
| --- | --- |
| `engine.asset.addLocalSource(sourceID:supportedMimeTypes:)` | Register a local source that assets can be added to |
| `engine.asset.addAsset(to:asset:)` | Add an `AssetDefinition` with thumbnail metadata to a source |
| `engine.asset.addSource(_:)` | Register a custom `AssetSource` |
| `engine.asset.findAssets(sourceID:query:)` | Query a source's assets |

### Properties

| Property | Type | Description |
| --- | --- | --- |
| `uri` | String | Full asset used on the canvas |
| `thumbUri` | String | Raster thumbnail shown in the asset library grid (512px recommended) |
| `previewUri` | String | Preview content set on the block; used for audio playback in the library |
| `mimeType` | String | MIME type of the asset; required for audio preview buttons |

## Next Steps

- Customize Asset Library — On iOS, customize the asset library UI
- [Asset Concepts](../concepts.md) — Asset sources and metadata
- [Unsplash Integration](../from-remote-source/unsplash.md) — Thumbnail mapping example
- [Source Sets](../source-sets.md) — Responsive asset rendering (not thumbnails)



---

## More Resources

- **[Mac Catalyst Documentation Index](https://img.ly/docs/cesdk/mac-catalyst/)** - Browse all Mac Catalyst documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/mac-catalyst/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/mac-catalyst/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
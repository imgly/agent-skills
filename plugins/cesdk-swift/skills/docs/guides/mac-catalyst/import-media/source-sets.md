> This is one page of the CE.SDK Mac Catalyst documentation. For a complete overview, see the [Mac Catalyst Documentation Index](https://img.ly/docs/cesdk/mac-catalyst/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/mac-catalyst/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Import Media Assets](../import-media.md) > [Source Sets](./source-sets.md)

---

```swift file=@cesdk_swift_examples/engine-guides-source-sets/SourceSets.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func sourceSets(engine: Engine) async throws {
  let scene = try engine.scene.create()

  let page = try engine.block.create(.page)
  try engine.block.setWidth(page, value: 800)
  try engine.block.setHeight(page, value: 600)
  try engine.block.appendChild(to: scene, child: page)
  try await engine.scene.zoom(to: page, paddingLeft: 50, paddingTop: 50, paddingRight: 50, paddingBottom: 50)

  let baseURL = try engine.guidesBaseURL

  let block = try engine.block.create(.graphic)
  try engine.block.setShape(block, shape: engine.block.createShape(.rect))
  let imageFill = try engine.block.createFill(.image)
  try engine.block.setSourceSet(imageFill, property: "fill/image/sourceSet", sourceSet: [
    .init(uri: baseURL.appendingPathComponent("ly.img.image/images/sample_1-512x341.jpg"), width: 512, height: 341),
    .init(uri: baseURL.appendingPathComponent("ly.img.image/images/sample_1-1249x833.jpg"), width: 1249, height: 833),
    .init(
      uri: baseURL.appendingPathComponent("ly.img.image/images/sample_1-1767x1178.jpg"),
      width: 1767,
      height: 1178,
    ),
  ])
  try engine.block.setFill(block, fill: imageFill)
  try engine.block.appendChild(to: page, child: block)

  let sources = try engine.block.getSourceSet(imageFill, property: "fill/image/sourceSet")
  print("Image source set has \(sources.count) sources")

  try await engine.block.addImageFileURIToSourceSet(
    imageFill,
    property: "fill/image/sourceSet",
    uri: baseURL.appendingPathComponent("ly.img.image/images/sample_1.jpg"),
  )

  let assetWithSourceSet = AssetDefinition(
    id: "my-image",
    meta: [
      "kind": "image",
      "fillType": "//ly.img.ubq/fill/image",
    ],
    payload: .init(sourceSet: [
      .init(
        uri: baseURL.appendingPathComponent("ly.img.image/images/sample_1-512x341.jpg"),
        width: 512,
        height: 341,
      ),
      .init(
        uri: baseURL.appendingPathComponent("ly.img.image/images/sample_1-1249x833.jpg"),
        width: 1249,
        height: 833,
      ),
      .init(
        uri: baseURL.appendingPathComponent("ly.img.image/images/sample_1-1767x1178.jpg"),
        width: 1767,
        height: 1178,
      ),
    ]),
  )

  try engine.asset.addLocalSource(sourceID: "my-dynamic-images")
  try engine.asset.addAsset(to: "my-dynamic-images", asset: assetWithSourceSet)

  // In an app, look the asset up from its source with `findAssets` or `fetchAsset`.
  // Here we build the `AssetResult` directly because we already have the definition.
  let assetResult = AssetResult(
    id: assetWithSourceSet.id,
    meta: assetWithSourceSet.meta,
    context: AssetContext(sourceID: "my-dynamic-images"),
  )
  if let appliedBlock = try await engine.asset.defaultApplyAsset(assetResult: assetResult) {
    let appliedFill = try engine.block.getFill(appliedBlock)
    let appliedSources = try engine.block.getSourceSet(appliedFill, property: "fill/image/sourceSet")
    print("Applied block fill has \(appliedSources.count) sources")
  }

  let videoFill = try engine.block.createFill(.video)
  try engine.block.setSourceSet(videoFill, property: "fill/video/sourceSet", sourceSet: [
    .init(
      uri: baseURL.appendingPathComponent("ly.img.video/videos/pexels-kampus-production-8154913.mp4"),
      width: 720,
      height: 1280,
    ),
  ])

  try await engine.block.addVideoFileURIToSourceSet(
    videoFill,
    property: "fill/video/sourceSet",
    uri: baseURL.appendingPathComponent(
      "ly.img.video/videos/pexels-drone-footage-of-a-surfer-barrelling-a-wave-12715991.mp4",
    ),
  )

  try engine.editor.setSettingBool("features/forceLowQualityVideoPreview", value: true)
}
```

Configure source sets for images and videos so CE.SDK automatically selects the optimal resolution for editing previews and exports.

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.82.0-nightly.20260826/engine-guides-source-sets)

<EngineReferenceNote {...props} />

Source sets let you provide multiple versions of the same asset at different resolutions. CE.SDK automatically selects the most appropriate source based on the current drawing size in screen pixels. This improves performance by loading smaller images for mobile previews while ensuring high-quality assets are used for final exports.

This guide covers how to configure source sets programmatically, define them in asset definitions, and optimize video preview performance.

## How Source Set Selection Works

When rendering content, the engine calculates the current drawing size in pixels. If a source set exists, the engine selects the source with the closest size exceeding the drawing size. If no source set is defined, the full resolution image is downscaled to a maximum 4096px edge length (configurable via the `maxImageSize` setting).

Source sets are also evaluated during export, ensuring the best matching asset is used for the target export resolution. Because every intermediate resolution is one you supply, you stay in control of how content is up- and downsampled.

## Setting a Source Set on an Image Fill

Configure a source set for an image fill with `setSourceSet`. Each source entry requires a `uri`, `width`, and `height`, and the engine uses these dimensions to select the appropriate source while drawing.

> **Caution:** CE.SDK provides two ways to set image content: the `fill/image/imageFileURI` property for a single image, or source sets for multiple resolutions. Use one or the other—setting both on the same fill leads to undefined behavior.

```swift highlight-set-source-set
let block = try engine.block.create(.graphic)
try engine.block.setShape(block, shape: engine.block.createShape(.rect))
let imageFill = try engine.block.createFill(.image)
try engine.block.setSourceSet(imageFill, property: "fill/image/sourceSet", sourceSet: [
  .init(uri: baseURL.appendingPathComponent("ly.img.image/images/sample_1-512x341.jpg"), width: 512, height: 341),
  .init(uri: baseURL.appendingPathComponent("ly.img.image/images/sample_1-1249x833.jpg"), width: 1249, height: 833),
  .init(
    uri: baseURL.appendingPathComponent("ly.img.image/images/sample_1-1767x1178.jpg"),
    width: 1767,
    height: 1178,
  ),
])
try engine.block.setFill(block, fill: imageFill)
try engine.block.appendChild(to: page, child: block)
```

## Querying and Modifying Source Sets

Retrieve an existing source set with `getSourceSet`. To add sources dynamically, use `addImageFileURIToSourceSet`, which loads the image to determine its dimensions automatically. Provide the dimensions up front with `setSourceSet` when they are already known to avoid the extra fetch.

```swift highlight-query-source-set
  let sources = try engine.block.getSourceSet(imageFill, property: "fill/image/sourceSet")
  print("Image source set has \(sources.count) sources")

  try await engine.block.addImageFileURIToSourceSet(
    imageFill,
    property: "fill/image/sourceSet",
    uri: baseURL.appendingPathComponent("ly.img.image/images/sample_1.jpg"),
  )
```

## Using Source Sets in Asset Definitions

When defining assets for the asset library, include a source set in the `payload.sourceSet` field. When the asset is applied with `defaultApplyAsset`, the source set is automatically configured on the resulting block's fill.

The natural way to retrieve a registered asset from its source is `findAssets` or `fetchAsset`. The example builds the `AssetResult` directly because it already has the definition in hand.

```swift highlight-asset-source-set
  let assetWithSourceSet = AssetDefinition(
    id: "my-image",
    meta: [
      "kind": "image",
      "fillType": "//ly.img.ubq/fill/image",
    ],
    payload: .init(sourceSet: [
      .init(
        uri: baseURL.appendingPathComponent("ly.img.image/images/sample_1-512x341.jpg"),
        width: 512,
        height: 341,
      ),
      .init(
        uri: baseURL.appendingPathComponent("ly.img.image/images/sample_1-1249x833.jpg"),
        width: 1249,
        height: 833,
      ),
      .init(
        uri: baseURL.appendingPathComponent("ly.img.image/images/sample_1-1767x1178.jpg"),
        width: 1767,
        height: 1178,
      ),
    ]),
  )

  try engine.asset.addLocalSource(sourceID: "my-dynamic-images")
  try engine.asset.addAsset(to: "my-dynamic-images", asset: assetWithSourceSet)

  // In an app, look the asset up from its source with `findAssets` or `fetchAsset`.
  // Here we build the `AssetResult` directly because we already have the definition.
  let assetResult = AssetResult(
    id: assetWithSourceSet.id,
    meta: assetWithSourceSet.meta,
    context: AssetContext(sourceID: "my-dynamic-images"),
  )
  if let appliedBlock = try await engine.asset.defaultApplyAsset(assetResult: assetResult) {
    let appliedFill = try engine.block.getFill(appliedBlock)
    let appliedSources = try engine.block.getSourceSet(appliedFill, property: "fill/image/sourceSet")
    print("Applied block fill has \(appliedSources.count) sources")
  }
```

## Video Source Sets

Source sets also work with video fills using the `fill/video/sourceSet` property. The engine selects the appropriate video source based on the current drawing size, and `addVideoFileURIToSourceSet` adds video sources dynamically.

```swift highlight-video-source-set
  let videoFill = try engine.block.createFill(.video)
  try engine.block.setSourceSet(videoFill, property: "fill/video/sourceSet", sourceSet: [
    .init(
      uri: baseURL.appendingPathComponent("ly.img.video/videos/pexels-kampus-production-8154913.mp4"),
      width: 720,
      height: 1280,
    ),
  ])

  try await engine.block.addVideoFileURIToSourceSet(
    videoFill,
    property: "fill/video/sourceSet",
    uri: baseURL.appendingPathComponent(
      "ly.img.video/videos/pexels-drone-footage-of-a-surfer-barrelling-a-wave-12715991.mp4",
    ),
  )
```

## Video Preview Quality Settings

For low-end devices or scenes with large videos, force the engine to use the smallest available source for video previews during editing. Export operations always use the highest quality source.

```swift highlight-video-preview-settings
try engine.editor.setSettingBool("features/forceLowQualityVideoPreview", value: true)
```

The `features/forceLowQualityVideoPreview` setting forces previews to use the smallest source while editing. It is disabled by default, so the engine uses the source closest to the current drawing size. Thumbnails use the smallest source unless `features/matchThumbnailSourceToFill` is enabled, which is also disabled by default.

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Wrong resolution selected | Ensure source dimensions accurately reflect actual image/video dimensions |
| Performance issues with large assets | Add smaller resolution sources to your source set for editing preview |
| Export quality issues | Verify that your source set includes a high-resolution source for the target export size |
| Source set not applied from asset | Ensure `payload.sourceSet` is defined with valid `uri`, `width`, and `height` entries |

## API Reference

### Methods

| Method | Description |
|--------|-------------|
| `engine.block.setSourceSet(_:property:sourceSet:)` | Set a source set for a block property |
| `engine.block.getSourceSet(_:property:)` | Get the source set from a block property |
| `engine.block.addImageFileURIToSourceSet(_:property:uri:)` | Add an image to an existing source set (async) |
| `engine.block.addVideoFileURIToSourceSet(_:property:uri:)` | Add a video to an existing source set (async) |
| `engine.block.createFill(_:)` | Create an image or video fill |
| `engine.block.setFill(_:fill:)` | Apply a fill to a block |
| `engine.block.getFill(_:)` | Get the fill from a block |
| `engine.asset.addLocalSource(sourceID:)` | Create a local asset source |
| `engine.asset.addAsset(to:asset:)` | Add an asset with a source set to a source |
| `engine.asset.defaultApplyAsset(assetResult:)` | Apply an asset, configuring its source set |
| `engine.editor.setSettingBool(_:value:)` | Configure editor settings like video preview quality |

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `fill/image/sourceSet` | `[Source]` | Source set for an image fill |
| `fill/video/sourceSet` | `[Source]` | Source set for a video fill |
| `features/forceLowQualityVideoPreview` | Bool | Force the smallest source during video editing previews |
| `features/matchThumbnailSourceToFill` | Bool | Match the thumbnail source to the fill instead of using the smallest |



---

## More Resources

- **[Mac Catalyst Documentation Index](https://img.ly/docs/cesdk/mac-catalyst/)** - Browse all Mac Catalyst documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/mac-catalyst/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/mac-catalyst/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
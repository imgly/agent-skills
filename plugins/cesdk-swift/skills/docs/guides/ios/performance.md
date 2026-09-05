> This is one page of the CE.SDK iOS documentation. For a complete overview, see the [iOS Documentation Index](https://img.ly/docs/cesdk/ios/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/ios/llms-full.txt).

**Navigation:** [Guides](./guides.md) > [Improve Performance](./performance.md)

---

```swift file=@cesdk_swift_examples/engine-guides-performance/Performance.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func performance(engine: Engine) async throws {
  let baseURL = try engine.guidesBaseURL

  try engine.editor.setSettingString(
    "basePath",
    value: baseURL.absoluteString,
  )

  let scene = try engine.scene.create()
  try engine.scene.setDesignUnit(.px)
  let page = try engine.block.create(.page)
  try engine.block.setWidth(page, value: 1920)
  try engine.block.setHeight(page, value: 1080)
  try engine.block.appendChild(to: scene, child: page)

  let block = try engine.block.create(.graphic)
  try engine.block.setShape(block, shape: engine.block.createShape(.rect))
  let imageFill = try engine.block.createFill(.image)
  try engine.block.setSourceSet(imageFill, property: "fill/image/sourceSet", sourceSet: [
    .init(
      uri: baseURL.appendingPathComponent("ly.img.image/images/sample_1-512x341.jpg"),
      width: 512,
      height: 341,
    ),
    .init(
      uri: baseURL.appendingPathComponent("ly.img.image/images/sample_1-883x589.jpg"),
      width: 883,
      height: 589,
    ),
    .init(
      uri: baseURL.appendingPathComponent("ly.img.image/images/sample_1-1767x1178.jpg"),
      width: 1767,
      height: 1178,
    ),
  ])
  try engine.block.setFill(block, fill: imageFill)
  try engine.block.appendChild(to: page, child: block)

  let usedMemory = try engine.editor.getUsedMemory()
  let availableMemory = try? engine.editor.getAvailableMemory()
  if let availableMemory {
    let total = usedMemory + availableMemory
    let usagePercentage = Double(usedMemory) / Double(total) * 100
    print("Memory usage: \(usagePercentage)%")
  }

  let maxExportSize = try engine.editor.getMaxExportSize()

  let designUnit = try engine.scene.getDesignUnit()
  let widthMode = try engine.block.getWidthMode(page)
  let heightMode = try engine.block.getHeightMode(page)
  if designUnit == .px, widthMode == .absolute, heightMode == .absolute {
    let pageWidth = try engine.block.getWidth(page)
    let pageHeight = try engine.block.getHeight(page)
    let withinLimit = Int(pageWidth.rounded(.up)) <= maxExportSize
      && Int(pageHeight.rounded(.up)) <= maxExportSize
    if !withinLimit {
      print("Page dimensions exceed the device export limit")
    }
  }

  let options = ExportOptions(
    jpegQuality: 0.8,
    targetWidth: 1280,
    targetHeight: 720,
  )
  let blob = try await engine.block.export(page, mimeType: .jpeg, options: options)
  _ = blob

  // Stream a multi-page PDF into a file instead of building it in memory. Peak
  // memory then tracks a single page rather than the size of the document.
  guard let scene = try engine.scene.get() else { return }
  try await engine.block.export(
    scene,
    to: FileManager.default.temporaryDirectory.appendingPathComponent("design.pdf"),
    mimeType: .pdf,
  )
}
```

Optimize CE.SDK integration for faster load times, efficient memory usage,
and smooth runtime performance.

CE.SDK ships a fully featured creative engine. Tuning how you load assets, manage memory, and configure exports keeps editing responsive on lower-end devices and keeps exports reliable on the entire fleet.

This guide covers source sets for large assets, memory monitoring with the editor APIs, export size and quality tuning, and the engine initialization pattern.

> **Reading time:** 7 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.83.0-nightly.20260905/engine-guides-performance)

<EngineReferenceNote {...props} />

## Managing Large Assets

High-resolution images and videos consume significant memory. Use source sets to give the engine multiple resolution variants so it can pick the smallest one that still looks good at the current display size.

### Use Source Sets

A source set is a list of `Source` entries with different resolutions for the same image or video. The engine picks the variant whose dimensions best match the current viewport and reaches for the higher-resolution entries only when needed for export.

```swift highlight-performance-sourceSets
let block = try engine.block.create(.graphic)
try engine.block.setShape(block, shape: engine.block.createShape(.rect))
let imageFill = try engine.block.createFill(.image)
try engine.block.setSourceSet(imageFill, property: "fill/image/sourceSet", sourceSet: [
  .init(
    uri: baseURL.appendingPathComponent("ly.img.image/images/sample_1-512x341.jpg"),
    width: 512,
    height: 341,
  ),
  .init(
    uri: baseURL.appendingPathComponent("ly.img.image/images/sample_1-883x589.jpg"),
    width: 883,
    height: 589,
  ),
  .init(
    uri: baseURL.appendingPathComponent("ly.img.image/images/sample_1-1767x1178.jpg"),
    width: 1767,
    height: 1178,
  ),
])
try engine.block.setFill(block, fill: imageFill)
try engine.block.appendChild(to: page, child: block)
```

This reduces memory pressure during editing while preserving export quality. See [Source Sets](./import-media/source-sets.md) for the full API including video source sets and asset-source integration.

### Additional Optimization Tips

- Remove unused blocks from the scene when no longer needed
- Release the `Engine` reference when the editing session ends so ARC can reclaim its resources
- Use efficient image formats (WebP, HEIF, optimized JPEG) for source assets

## Memory Management

Use the editor's memory APIs to observe how much the engine currently holds and how much headroom remains. Track these values across long sessions to detect leaks or decide when to free unused assets.

```swift highlight-performance-memoryMonitoring
let usedMemory = try engine.editor.getUsedMemory()
let availableMemory = try? engine.editor.getAvailableMemory()
if let availableMemory {
  let total = usedMemory + availableMemory
  let usagePercentage = Double(usedMemory) / Double(total) * 100
  print("Memory usage: \(usagePercentage)%")
}
```

Two notes about the Swift APIs:

- `getUsedMemory()` and `getAvailableMemory()` both return byte counts as `Int64`.
- `getAvailableMemory()` is unavailable on the iOS Simulator and throws there. Wrap the call in `try?` so the same code path works in unit tests and on real devices.

## Export Optimization

Tune export resolution and quality to balance fidelity against time and memory. The settings below apply to image exports; video exports take their own dedicated options.

### Optimize Export Settings

`ExportOptions` controls compression and downscaling. Lowering `targetWidth` / `targetHeight` and `jpegQuality` produces smaller files faster, at the cost of fidelity.

```swift highlight-performance-exportSettings
let options = ExportOptions(
  jpegQuality: 0.8,
  targetWidth: 1280,
  targetHeight: 720,
)
let blob = try await engine.block.export(page, mimeType: .jpeg, options: options)
```

| Property | Type | Purpose |
| --- | --- | --- |
| `targetWidth` / `targetHeight` | `Float` | Optional output dimensions in pixels. The block is rendered large enough to fill the target while keeping its aspect ratio. Leave at `0` to use the block's intrinsic size. |
| `jpegQuality` | `Float` | JPEG quality in the range `(0, 1]`. Lower values trade quality for smaller files. Defaults to `0.9`. |
| `pngCompressionLevel` | `Int` | PNG compression `0–9`. Higher values produce smaller files but take longer to encode. Defaults to `5`. |
| `webpQuality` | `Float` | WebP quality in the range `(0, 1]`. Defaults to `1.0`. |

### Stream Large PDF Exports

`engine.block.export(_:mimeType:options:)` builds the entire document in memory and returns it as a `Blob`. For a large multi-page PDF such as a photo book or a magazine, that buffer becomes the peak allocation and is a common source of out-of-memory crashes on mid-range devices. The `engine.block.export(_:to:mimeType:options:onProgress:)` overload writes the bytes into a file as they are encoded, so peak memory tracks the working set of a single page instead of the page count.

```swift highlight-performance-streamedPdf
// Stream a multi-page PDF into a file instead of building it in memory. Peak
// memory then tracks a single page rather than the size of the document.
guard let scene = try engine.scene.get() else { return }
try await engine.block.export(
  scene,
  to: FileManager.default.temporaryDirectory.appendingPathComponent("design.pdf"),
  mimeType: .pdf,
)
```

Streamed export only supports `MIMEType.pdf`. The chunks are handed over synchronously while the encoder runs, so a slow destination throttles the encoder rather than letting chunks accumulate in memory. The bytes go into a staging file and replace the destination only once the document is complete, so a failed or cancelled export leaves a file that is already at that location untouched. See [Export to PDF](./export-save-publish/export/to-pdf.md) for the full API, including the overload that hands the chunks to a closure instead of a file.

### Export Size Limits

Different devices support different maximum export sizes. Call `getMaxExportSize()` to read the device's upper bound in pixels and validate page dimensions before kicking off a large export.

```swift highlight-performance-maxExportSize
  let maxExportSize = try engine.editor.getMaxExportSize()

  let designUnit = try engine.scene.getDesignUnit()
  let widthMode = try engine.block.getWidthMode(page)
  let heightMode = try engine.block.getHeightMode(page)
  if designUnit == .px, widthMode == .absolute, heightMode == .absolute {
    let pageWidth = try engine.block.getWidth(page)
    let pageHeight = try engine.block.getHeight(page)
    let withinLimit = Int(pageWidth.rounded(.up)) <= maxExportSize
      && Int(pageHeight.rounded(.up)) <= maxExportSize
    if !withinLimit {
      print("Page dimensions exceed the device export limit")
    }
  }
```

`getWidth(_:)` and `getHeight(_:)` return values in design units, so the comparison only makes sense when the scene's design unit is `.px` AND the block's width and height modes are `.absolute`. With `.percent` or `.auto` modes, the returned value is relative to the parent or derived from content, not a pixel count.

The returned value is a hard upper bound — exports can still fail for memory or other reasons. When the limit is unknown, the engine returns `Int32.max`. See [Size Limits](./export-save-publish/export/size-limits.md) for the full pattern including `maxImageSize` tuning and recovery on export failure.

## Engine Lifecycle and Asset Loading

Create the `Engine` once per editing session with `try await Engine(license:)` on `@MainActor`, then hold a strong reference for the lifetime of that session. ARC frees the engine's GPU resources, textures, and native buffers when the last reference goes away, so releasing the editor screen is enough to reclaim memory.

Before loading any scene, point the engine at the asset base URL and register the default asset sources:

```swift highlight-performance-initialization
try engine.editor.setSettingString(
  "basePath",
  value: baseURL.absoluteString,
)
```

`setSettingString("basePath", value:)` tells the engine where to fetch default assets, fonts, and shaders. Registering the default asset sources with `engine.asset.addLocalAssetSourceFromJSON(...)` makes the bundled images, audio, video, typefaces, and shapes searchable so the UI and the engine can resolve asset IDs at runtime.

For production deployments, host these assets on your own infrastructure to improve reliability and remove the dependency on an external CDN, then point `basePath` at the asset location you control. See [Serve Assets From Your Server](./serve-assets.md) for the full self-hosting pattern and [Architecture](./concepts/architecture.md) for the high-level component diagram and `basePath` rationale.

## Troubleshooting

### Memory warnings or crashes

Monitor memory with `getUsedMemory()` and `getAvailableMemory()` and react when usage climbs. Common remediations: remove unused blocks, lower the `maxImageSize` setting, or release the `Engine` reference and recreate it for a fresh editing session.

### Export hangs or fails

Validate page dimensions against `getMaxExportSize()` before exporting and lower `targetWidth` / `targetHeight` for large designs. For persistent failures, reduce `maxImageSize` so newly loaded textures stay within memory budgets. When a multi-page PDF export runs out of memory, switch to the `export(_:to:mimeType:options:onProgress:)` overload so the document is written out as it is encoded rather than buffered in full.

### Slow asset loading

Use a CDN-hosted `basePath` or pre-cache asset files alongside your app bundle. Source sets help here too — initial editing loads only the low-resolution entries.

## API Reference

| Method | Description |
| --- | --- |
| `Engine(context:audioContext:license:userID:)` | Initialize a new engine instance |
| `engine.editor.setSettingString("basePath", value:)` | Configure where engine assets are loaded from |
| `engine.editor.getUsedMemory()` | Get current engine memory usage in bytes |
| `engine.editor.getAvailableMemory()` | Get remaining available memory in bytes (throws on iOS Simulator) |
| `engine.editor.getMaxExportSize()` | Get the maximum export edge length in pixels |
| `engine.block.setSourceSet(_:property:sourceSet:)` | Provide multiple resolutions of an image or video |
| `engine.block.export(_:mimeType:options:)` | Export a block with configurable size and quality |
| `engine.block.export(_:to:mimeType:options:onProgress:)` | Export a PDF into a file as it is encoded, bounding peak memory for large multi-page documents |

## Next Steps

- [Architecture](./concepts/architecture.md) — Understand CE.SDK structure and components
- [Export Overview](./export-save-publish/export/overview.md) — Learn about export formats and options
- [Size Limits](./export-save-publish/export/size-limits.md) — Configure limits on exported file dimensions and data size&#x20;



---

## More Resources

- **[iOS Documentation Index](https://img.ly/docs/cesdk/ios/)** - Browse all iOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/ios/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/ios/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
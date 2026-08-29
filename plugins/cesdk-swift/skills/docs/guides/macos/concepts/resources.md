> This is one page of the CE.SDK macOS documentation. For a complete overview, see the [macOS Documentation Index](https://img.ly/docs/cesdk/macos/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/macos/llms-full.txt).

**Navigation:** [Concepts](../concepts.md) > [Resources](./resources.md)

---

```swift file=@cesdk_swift_examples/engine-guides-resources/Resources.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func resources(engine: Engine) async throws {
  let scene = try engine.scene.create()
  let page = try engine.block.create(.page)
  try engine.block.appendChild(to: scene, child: page)

  let baseURL = try engine.guidesBaseURL

  // Create a graphic block with an image fill.
  // The image loads on-demand when the engine renders the block.
  let imageBlock = try engine.block.create(.graphic)
  let rectShape = try engine.block.createShape(.rect)
  try engine.block.setShape(imageBlock, shape: rectShape)

  let imageFill = try engine.block.createFill(.image)
  try engine.block.setURL(
    imageFill,
    property: "fill/image/imageFileURI",
    value: baseURL.appendingPathComponent("ly.img.image/images/sample_4.jpg"),
  )
  try engine.block.setFill(imageBlock, fill: imageFill)
  try engine.block.setEnum(imageBlock, property: "contentFill/mode", value: "Cover")
  try engine.block.appendChild(to: page, child: imageBlock)

  // Preload all resources in the scene before rendering.
  try await engine.block.forceLoadResources([scene])

  // Preload specific blocks only.
  let graphics = try engine.block.find(byType: .graphic)
  try await engine.block.forceLoadResources(graphics)

  // Create a video fill and preload its resource to query properties.
  let videoBlock = try engine.block.create(.graphic)
  let videoShape = try engine.block.createShape(.rect)
  try engine.block.setShape(videoBlock, shape: videoShape)

  let videoFill = try engine.block.createFill(.video)
  try engine.block.setURL(
    videoFill,
    property: "fill/video/fileURI",
    value: baseURL.appendingPathComponent(
      "ly.img.video/videos/pexels-drone-footage-of-a-surfer-barrelling-a-wave-12715991.mp4",
    ),
  )
  try engine.block.setFill(videoBlock, fill: videoFill)
  try engine.block.setEnum(videoBlock, property: "contentFill/mode", value: "Cover")
  try engine.block.appendChild(to: page, child: videoBlock)

  try await engine.block.forceLoadAVResource(videoFill)

  let duration = try engine.block.getAVResourceTotalDuration(videoFill)
  let videoWidth = try engine.block.getVideoWidth(videoFill)
  let videoHeight = try engine.block.getVideoHeight(videoFill)
  print("Video: \(duration)s, \(videoWidth)x\(videoHeight)")

  // Find transient resources that won't survive serialization.
  let transientResources = try engine.editor.findAllTransientResources()
  for resource in transientResources {
    print("Transient: \(resource.url), \(resource.size) bytes")
  }

  // Get all media URIs referenced in the scene.
  let mediaURIs = try engine.editor.findAllMediaURIs()
  for uri in mediaURIs {
    print("Media URI: \(uri)")
  }

  // List blocks that are not attached to any scene and free their memory before saving.
  let unusedBlocks = engine.block.findAllUnused()
  for blockID in unusedBlocks {
    try engine.block.destroy(blockID)
  }
  print("Destroyed \(unusedBlocks.count) unused blocks")

  // Detect the MIME type of a resource.
  let imageURL = baseURL.appendingPathComponent("ly.img.image/images/sample_4.jpg")
  let mimeType = try await engine.editor.getMIMEType(url: imageURL)
  print("MIME type: \(mimeType)")

  // Update a resource's URL mapping after moving it to a new location.
  let currentURL = URL(string: "https://example.com/old-location/image.jpg")!
  let relocatedURL = URL(string: "https://cdn.example.com/new-location/image.jpg")!
  try engine.editor.relocateResource(currentURL: currentURL, relocatedURL: relocatedURL)

  // Save the scene with a persistence callback for transient resources.
  let sceneString = try await engine.scene.saveToString(
    allowedResourceSchemes: ["http", "https"],
    onDisallowedResourceScheme: { url, _ in
      // Upload the resource to permanent storage and return the new URL.
      // let permanentURL = try await uploadToCDN(url)
      // return permanentURL
      url
    },
  )
  print("Saved scene (\(sceneString.count) characters)")
}
```

Manage external media files—images, videos, audio, and fonts—that blocks
reference via URIs in CE.SDK.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.83.0-nightly.20260829/engine-guides-resources)

Resources are external media files that blocks reference through URI properties like `fill/image/imageFileURI` or `fill/video/fileURI`. CE.SDK loads resources automatically when needed, but you can preload them for better performance. When working with temporary data like buffers or blobs, you need to persist them before saving. If resource URLs change (such as during CDN migration), you can update the mappings without modifying scene data.

This guide covers on-demand and preloaded resource loading, identifying and persisting transient resources, relocating resources when URLs change, and discovering all media URIs in a scene.

| Method | Category | Purpose |
| --- | --- | --- |
| `engine.block.forceLoadResources(_:)` | Preloading | Load resources for blocks and their children |
| `engine.block.forceLoadAVResource(_:)` | Preloading | Load audio/video resource for a block |
| `engine.block.getAVResourceTotalDuration(_:)` | Properties | Get total duration of audio/video resource |
| `engine.block.getVideoWidth(_:)` | Properties | Get video resource width in pixels |
| `engine.block.getVideoHeight(_:)` | Properties | Get video resource height in pixels |
| `engine.editor.findAllTransientResources()` | Discovery | Find temporary resources that need persistence |
| `engine.editor.findAllMediaURIs()` | Discovery | Get all media URIs referenced in the scene |
| `engine.block.findAllUnused()` | Discovery | Get all blocks that are not attached to any scene |
| `engine.editor.getMIMEType(url:)` | Discovery | Get the MIME type of a resource |
| `engine.editor.relocateResource(currentURL:relocatedURL:)` | Management | Update URL mapping for a relocated resource |
| `engine.scene.saveToString(allowedResourceSchemes:onDisallowedResourceScheme:)` | Serialization | Save scene with resource scheme handling |

## On-Demand Loading

The engine fetches resources automatically when rendering blocks or preparing exports. This approach requires no extra code but may delay the initial render while resources download.

```swift highlight-resources-onDemandLoading
  // Create a graphic block with an image fill.
  // The image loads on-demand when the engine renders the block.
  let imageBlock = try engine.block.create(.graphic)
  let rectShape = try engine.block.createShape(.rect)
  try engine.block.setShape(imageBlock, shape: rectShape)

  let imageFill = try engine.block.createFill(.image)
  try engine.block.setURL(
    imageFill,
    property: "fill/image/imageFileURI",
    value: baseURL.appendingPathComponent("ly.img.image/images/sample_4.jpg"),
  )
  try engine.block.setFill(imageBlock, fill: imageFill)
  try engine.block.setEnum(imageBlock, property: "contentFill/mode", value: "Cover")
  try engine.block.appendChild(to: page, child: imageBlock)
```

When you create a block with an image fill, the image doesn't load immediately. The engine fetches it when the block first renders on the canvas.

## Preloading Resources

Load resources before they're needed with `forceLoadResources(_:)`. Pass block IDs to load resources for those blocks and their children. Preloading eliminates render delays and is useful when you want the scene fully ready before displaying it.

```swift highlight-resources-preloadResources
  // Preload all resources in the scene before rendering.
  try await engine.block.forceLoadResources([scene])

  // Preload specific blocks only.
  let graphics = try engine.block.find(byType: .graphic)
  try await engine.block.forceLoadResources(graphics)
```

Pass the scene to preload all resources in the entire design, or pass specific blocks to load only what you need. Pass an empty array to load every resource currently known to the engine.

## Preloading Audio and Video

Audio and video resources require `forceLoadAVResource(_:)` for full metadata access. The engine needs to download and parse media files before you can query properties like duration or dimensions.

```swift highlight-resources-preloadAV
  // Create a video fill and preload its resource to query properties.
  let videoBlock = try engine.block.create(.graphic)
  let videoShape = try engine.block.createShape(.rect)
  try engine.block.setShape(videoBlock, shape: videoShape)

  let videoFill = try engine.block.createFill(.video)
  try engine.block.setURL(
    videoFill,
    property: "fill/video/fileURI",
    value: baseURL.appendingPathComponent(
      "ly.img.video/videos/pexels-drone-footage-of-a-surfer-barrelling-a-wave-12715991.mp4",
    ),
  )
  try engine.block.setFill(videoBlock, fill: videoFill)
  try engine.block.setEnum(videoBlock, property: "contentFill/mode", value: "Cover")
  try engine.block.appendChild(to: page, child: videoBlock)

  try await engine.block.forceLoadAVResource(videoFill)

  let duration = try engine.block.getAVResourceTotalDuration(videoFill)
  let videoWidth = try engine.block.getVideoWidth(videoFill)
  let videoHeight = try engine.block.getVideoHeight(videoFill)
  print("Video: \(duration)s, \(videoWidth)x\(videoHeight)")
```

Without preloading, properties like `getAVResourceTotalDuration(_:)` or `getVideoWidth(_:)` may return zero or incomplete values.

## Finding Transient Resources

Transient resources are temporary data stored in buffers or blobs that won't survive scene serialization. Use `findAllTransientResources()` to discover them before saving.

```swift highlight-resources-findTransient
// Find transient resources that won't survive serialization.
let transientResources = try engine.editor.findAllTransientResources()
for resource in transientResources {
  print("Transient: \(resource.url), \(resource.size) bytes")
}
```

Each entry includes the resource URL and its size in bytes. Common transient resources include images from clipboard paste operations, camera captures, or programmatically generated content.

## Finding Media URIs

Get all media file URIs referenced in a scene with `findAllMediaURIs()`. This returns a deduplicated list of URLs from image fills, video fills, audio blocks, and other media sources.

```swift highlight-resources-findMediaURIs
// Get all media URIs referenced in the scene.
let mediaURIs = try engine.editor.findAllMediaURIs()
for uri in mediaURIs {
  print("Media URI: \(uri)")
}
```

Use this for pre-fetching resources, validating availability, or building a manifest of all assets in a design.

## Finding Unused Blocks

List every block that is not attached to any scene with `findAllUnused()`. A block is considered unused when it has no scene reference and no ancestor that belongs to a scene. Render blocks (fills, effects, shapes, blurs) are excluded.

```swift highlight-resources-findUnusedBlocks
// List blocks that are not attached to any scene and free their memory before saving.
let unusedBlocks = engine.block.findAllUnused()
for blockID in unusedBlocks {
  try engine.block.destroy(blockID)
}
print("Destroyed \(unusedBlocks.count) unused blocks")
```

Pair this with `findAllMediaURIs()` to skip relocating resources for blocks that are no longer reachable, or call `engine.block.destroy(_:)` on each id to free memory before saving.

## Detecting MIME Types

Determine a resource's content type with `getMIMEType(url:)`. The engine downloads the resource if it's not already cached.

```swift highlight-resources-detectMIMEType
// Detect the MIME type of a resource.
let imageURL = baseURL.appendingPathComponent("ly.img.image/images/sample_4.jpg")
let mimeType = try await engine.editor.getMIMEType(url: imageURL)
print("MIME type: \(mimeType)")
```

Common return values include `image/jpeg`, `image/png`, `video/mp4`, and `audio/mpeg`. This is useful when you need to verify resource types or make format-dependent decisions.

## Relocating Resources

Update URL mappings when resources move with `relocateResource(currentURL:relocatedURL:)`. This updates all resource references in the scene and clears the internal cache.

```swift highlight-resources-relocate
// Update a resource's URL mapping after moving it to a new location.
let currentURL = URL(string: "https://example.com/old-location/image.jpg")!
let relocatedURL = URL(string: "https://cdn.example.com/new-location/image.jpg")!
try engine.editor.relocateResource(currentURL: currentURL, relocatedURL: relocatedURL)
```

Use relocation after uploading resources to a CDN or when migrating assets between storage locations. The engine updates all references in the scene and clears cached data so that the resource is fetched from the new URL.

## Persisting Transient Resources

Handle transient resources during save with the `onDisallowedResourceScheme` callback in `saveToString`. The callback receives each resource URL with a disallowed scheme (like `buffer:` or `blob:`) and returns the permanent URL after uploading.

```swift highlight-resources-persistTransient
// Save the scene with a persistence callback for transient resources.
let sceneString = try await engine.scene.saveToString(
  allowedResourceSchemes: ["http", "https"],
  onDisallowedResourceScheme: { url, _ in
    // Upload the resource to permanent storage and return the new URL.
    // let permanentURL = try await uploadToCDN(url)
    // return permanentURL
    url
  },
)
print("Saved scene (\(sceneString.count) characters)")
```

This pattern lets you intercept temporary resources, upload them to permanent storage, and save the scene with stable URLs that will work when reloaded.

## Troubleshooting

**Slow initial render**: Preload resources with `forceLoadResources(_:)` before displaying the scene.

**Export fails with missing resources**: Check `findAllTransientResources()` and persist any temporary resources before export.

**Video duration returns 0**: Ensure the video resource is loaded with `forceLoadAVResource(_:)` before querying properties.

**Resources not found after reload**: Transient resources (buffers, blobs) are not serialized—relocate them to persistent URLs before saving.

## Next Steps

- [Buffers](./buffers.md) — Work with in-memory data
- [Scenes](./scenes.md) — Understand scene serialization and persistence
- [Export](../export-save-publish/export.md) — Learn about exporting designs



---

## More Resources

- **[macOS Documentation Index](https://img.ly/docs/cesdk/macos/)** - Browse all macOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/macos/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/macos/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
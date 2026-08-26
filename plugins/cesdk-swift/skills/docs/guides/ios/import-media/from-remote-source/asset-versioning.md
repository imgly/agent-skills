> This is one page of the CE.SDK iOS documentation. For a complete overview, see the [iOS Documentation Index](https://img.ly/docs/cesdk/ios/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/ios/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Import Media Assets](../../import-media.md) > [Import From Remote Source](../from-remote-source.md) > [Versioning of Assets](./asset-versioning.md)

---

```swift file=@cesdk_swift_examples/engine-guides-import-media-from-remote-source-asset-versioning/AssetVersioning.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func assetVersioning(engine: Engine) async throws {
  // Demo scaffolding: build a small scene with a single image block so every
  // snippet below has an asset URL to inspect and update. In your app the scene
  // is already loaded and its blocks already exist.
  let baseURL = try engine.guidesBaseURL
  let scene = try engine.scene.create()
  let page = try engine.block.create(.page)
  try engine.block.appendChild(to: scene, child: page)
  try engine.block.setWidth(page, value: 800)
  try engine.block.setHeight(page, value: 600)
  let imageURL = baseURL.appendingPathComponent("ly.img.image/images/sample_1.jpg")

  // An asset reference lives on a fill block. Create a graphic, give it an image
  // fill, and store the asset URL in the fill's `fill/image/imageFileURI` property.
  let imageBlock = try engine.block.create(.graphic)
  try engine.block.setShape(imageBlock, shape: engine.block.createShape(.rect))

  let imageFill = try engine.block.createFill(.image)
  try engine.block.setURL(imageFill, property: "fill/image/imageFileURI", value: imageURL)
  try engine.block.setFill(imageBlock, fill: imageFill)
  try engine.block.appendChild(to: page, child: imageBlock)

  // Read the URL back — this is exactly the string a saved scene serializes.
  let storedURL = try engine.block.getURL(imageFill, property: "fill/image/imageFileURI")
  print("Stored image URL:", storedURL.absoluteString)

  // Load the image so the archive below can embed its bytes.
  try await engine.block.forceLoadResources([imageBlock])

  // `saveToString` serializes the scene structure and keeps asset references as
  // URLs. The result is small but depends on those URLs staying reachable.
  let sceneString = try await engine.scene.saveToString()
  _ = sceneString

  // `saveToArchive` bundles the scene together with the bytes of every reachable
  // asset into a self-contained archive you can write to disk with `write(to:)`.
  let archiveData = try await engine.scene.saveToArchive()
  _ = archiveData

  // Point a fill at a new asset URL — for example, after moving assets to a new
  // CDN or publishing a new version of an image.
  let migratedURL = URL(string: "https://cdn.example.com/assets/v2/product-photo.jpg")!
  try engine.block.setURL(imageFill, property: "fill/image/imageFileURI", value: migratedURL)

  let updatedURL = try engine.block.getURL(imageFill, property: "fill/image/imageFileURI")
  print("Updated image URL:", updatedURL.absoluteString)

  // To migrate assets in bulk, walk every graphic block and rewrite the fills
  // that carry an image. Filter by fill type, since a graphic block can hold a
  // color, gradient, image, or video fill.
  let graphicBlocks = try engine.block.find(byType: .graphic)
  for block in graphicBlocks {
    let fill = try engine.block.getFill(block)
    guard try engine.block.getType(fill) == FillType.image.rawValue else { continue }

    let currentURL = try engine.block.getURL(fill, property: "fill/image/imageFileURI")

    // Rewrite only the assets hosted on the CDN you are retiring.
    if currentURL.absoluteString.contains("old-cdn.example.com") {
      let rewritten = currentURL.absoluteString.replacingOccurrences(
        of: "old-cdn.example.com",
        with: "new-cdn.example.com",
      )
      if let newURL = URL(string: rewritten) {
        try engine.block.setURL(fill, property: "fill/image/imageFileURI", value: newURL)
      }
    }
  }
}
```

Manage how CE.SDK stores and resolves asset URLs in saved designs, keeping designs functional when assets are updated or moved.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.81.1/engine-guides-import-media-from-remote-source-asset-versioning)

<EngineReferenceNote {...props} />

CE.SDK references assets via URLs rather than embedding files directly into designs. When you save a design with `engine.scene.saveToString()`, asset URLs are stored as strings. On load, CE.SDK fetches assets from those URLs. This keeps saved designs small but means URL changes can break existing designs. This guide explains how CE.SDK stores asset references and strategies for managing asset URLs over time.

This guide covers how to inspect asset URLs stored in designs, the difference between scene serialization and archive export, how to programmatically update asset URLs, and strategies for versioned URL schemes.

## How Asset URLs Are Stored

An asset reference lives on a fill block, not on the graphic block itself. When you add an image to a design, you create an image fill that stores the source URL in its `fill/image/imageFileURI` property. Use `getFill(_:)` to reach the fill and `getURL(_:property:)` to inspect the stored URL. Here `imageURL` is the URL of the image you want to display and `page` is a page in your scene.

```swift highlight-assetVersioning-storeURI
  // An asset reference lives on a fill block. Create a graphic, give it an image
  // fill, and store the asset URL in the fill's `fill/image/imageFileURI` property.
  let imageBlock = try engine.block.create(.graphic)
  try engine.block.setShape(imageBlock, shape: engine.block.createShape(.rect))

  let imageFill = try engine.block.createFill(.image)
  try engine.block.setURL(imageFill, property: "fill/image/imageFileURI", value: imageURL)
  try engine.block.setFill(imageBlock, fill: imageFill)
  try engine.block.appendChild(to: page, child: imageBlock)

  // Read the URL back — this is exactly the string a saved scene serializes.
  let storedURL = try engine.block.getURL(imageFill, property: "fill/image/imageFileURI")
  print("Stored image URL:", storedURL.absoluteString)
```

The `fill/image/imageFileURI` property contains exactly what gets written to the saved scene. CE.SDK doesn't transform or normalize these URLs — they're stored and loaded as-is.

## Scene Serialization vs Archive Export

CE.SDK provides two approaches for saving designs, each with different trade-offs for asset handling.

### Saving as a Scene String

The `saveToString()` method serializes the scene structure while keeping asset references as URLs. This produces a small `String` that loads quickly, but requires the original assets to remain available at their URLs. Persist the returned value wherever you store designs.

```swift highlight-assetVersioning-saveScene
// `saveToString` serializes the scene structure and keeps asset references as
// URLs. The result is small but depends on those URLs staying reachable.
let sceneString = try await engine.scene.saveToString()
```

Use scene strings when:

- Assets are hosted on a stable CDN with reliable URLs
- You want to keep storage costs low
- Designs need to load quickly
- You can guarantee asset availability

### Saving as an Archive

The `saveToArchive()` method bundles the scene together with all referenced assets into a self-contained archive. It returns the archive as `Data`, which you write to disk with `write(to:)`. Archives work without network access because every asset is embedded.

```swift highlight-assetVersioning-saveArchive
// `saveToArchive` bundles the scene together with the bytes of every reachable
// asset into a self-contained archive you can write to disk with `write(to:)`.
let archiveData = try await engine.scene.saveToArchive()
```

Use archives when:

- Designs need to work offline
- You're migrating designs between environments
- You can't guarantee long-term URL availability
- Portability is more important than file size

| Approach | Method | Assets | File Size | Portability |
|----------|--------|--------|-----------|-------------|
| Scene | `saveToString()` | Referenced by URL | Small | Requires URL availability |
| Archive | `saveToArchive()` | Embedded in archive | Larger | Self-contained |

## What Happens When URLs Change

When a design is loaded and an asset URL returns a 404 or is otherwise unavailable, the block appears empty or shows an error state. A previously fetched copy of the asset may still appear until caches expire, which can temporarily mask a broken URL.

CE.SDK doesn't provide automatic fallbacks or retries for failed asset loads. If some assets fail while others succeed, the design loads partially. To prevent broken designs, ensure assets remain available at their original URLs or migrate designs when URLs change.

## Updating Asset URLs Programmatically

When you need to migrate assets to a new location, load the existing scene, update the URLs, and save the modified scene. Use `setURL(_:property:value:)` to point a fill at a new asset.

```swift highlight-assetVersioning-updateURI
  // Point a fill at a new asset URL — for example, after moving assets to a new
  // CDN or publishing a new version of an image.
  let migratedURL = URL(string: "https://cdn.example.com/assets/v2/product-photo.jpg")!
  try engine.block.setURL(imageFill, property: "fill/image/imageFileURI", value: migratedURL)

  let updatedURL = try engine.block.getURL(imageFill, property: "fill/image/imageFileURI")
  print("Updated image URL:", updatedURL.absoluteString)
```

For batch updates, iterate through every graphic block and rewrite the fills that carry an image. A graphic block can hold a color, gradient, image, or video fill, so filter by fill type with `getType(_:)` before touching the URL.

```swift highlight-assetVersioning-findBlocks
  // To migrate assets in bulk, walk every graphic block and rewrite the fills
  // that carry an image. Filter by fill type, since a graphic block can hold a
  // color, gradient, image, or video fill.
  let graphicBlocks = try engine.block.find(byType: .graphic)
  for block in graphicBlocks {
    let fill = try engine.block.getFill(block)
    guard try engine.block.getType(fill) == FillType.image.rawValue else { continue }

    let currentURL = try engine.block.getURL(fill, property: "fill/image/imageFileURI")

    // Rewrite only the assets hosted on the CDN you are retiring.
    if currentURL.absoluteString.contains("old-cdn.example.com") {
      let rewritten = currentURL.absoluteString.replacingOccurrences(
        of: "old-cdn.example.com",
        with: "new-cdn.example.com",
      )
      if let newURL = URL(string: rewritten) {
        try engine.block.setURL(fill, property: "fill/image/imageFileURI", value: newURL)
      }
    }
  }
```

This pattern is useful for CDN migrations or restructuring asset directories.

## Strategies for Versioned Asset URLs

Designing your URL scheme to support versioning prevents accidental overwrites and makes migrations easier. Three approaches work well.

### Path-Based Versioning

Include the version in the URL path: `https://cdn.example.com/assets/v2/logo.png`. When you update assets, increment the version directory. Old designs reference old paths while new designs use new paths, and both versions can coexist on the same CDN.

### Hash-Based Filenames

Use content hashes in filenames: `logo-a1b2c3d4.png`. The URL changes whenever the content changes, ensuring automatic cache invalidation. Build tools generate these automatically. This pattern works well for content-addressable storage.

### Query Parameter Versioning

Append the version as a query parameter: `logo.png?v=2`. The base URL stays the same but the version parameter forces cache invalidation. Note that some CDNs ignore query parameters for caching — verify your CDN configuration before relying on this approach.

## Best Practices

When managing asset URLs in production:

- **Use immutable URLs**: Content-addressed or versioned paths prevent accidental overwrites
- **Keep old assets available**: Don't delete assets that may be referenced by saved designs
- **Use archives for portability**: Export as an archive when designs need to work offline or across environments
- **Plan CDN migrations carefully**: Update saved designs before decommissioning old URLs
- **Set appropriate cache headers**: Balance performance with freshness requirements
- **Document your URL scheme**: Make the versioning strategy clear for your team

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| Asset shows old version | Cached copy of the asset | Use a cache-busting or versioned URL |
| Asset not loading | URL changed or deleted | Verify URL accessibility, update the scene |
| Design partially loads | Some assets unavailable | Check all asset URLs, consider an archive export |
| Archive too large | Many or large embedded assets | Optimize assets before archiving |

## Next Steps

- [Save Designs](../../export-save-publish/save.md) — Save and serialize designs
- [Export Overview](../../export-save-publish/export/overview.md) — Export options including archives



---

## More Resources

- **[iOS Documentation Index](https://img.ly/docs/cesdk/ios/)** - Browse all iOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/ios/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/ios/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
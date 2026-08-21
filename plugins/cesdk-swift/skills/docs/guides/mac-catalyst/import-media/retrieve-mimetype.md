> This is one page of the CE.SDK Mac Catalyst documentation. For a complete overview, see the [Mac Catalyst Documentation Index](https://img.ly/docs/cesdk/mac-catalyst/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/mac-catalyst/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Import Media Assets](../import-media.md) > [Retrieve Mimetype](./retrieve-mimetype.md)

---

```swift file=@cesdk_swift_examples/engine-guides-retrieve-mimetype/RetrieveMimetype.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func retrieveMimetype(engine: Engine) async throws {
  // Demo scaffolding: resolve a sample image URL and load its bytes so the
  // example has something concrete to embed and inspect.
  let baseURL = try engine.guidesBaseURL
  let imageURL = baseURL.appendingPathComponent("ly.img.image/images/sample_1.jpg")
  let imageData = try await URLSession.shared.data(from: imageURL).0

  let scene = try engine.scene.create()
  let page = try engine.block.create(.page)
  try engine.block.appendChild(to: scene, child: page)

  let mimeType = try await engine.editor.getMIMEType(url: imageURL)
  print("Detected MIME type: \(mimeType)")

  let imageBuffer = engine.editor.createBuffer()
  try engine.editor.setBufferData(url: imageBuffer, offset: 0, data: imageData)

  let graphic = try engine.block.create(.graphic)
  try engine.block.setShape(graphic, shape: engine.block.createShape(.rect))
  let imageFill = try engine.block.createFill(.image)
  try engine.block.setURL(imageFill, property: "fill/image/imageFileURI", value: imageBuffer)
  try engine.block.setFill(graphic, fill: imageFill)
  try engine.block.appendChild(to: page, child: graphic)

  let transientResources = try engine.editor.findAllTransientResources()
  print("Found \(transientResources.count) transient resources")

  var resourcesByType: [String: Int] = [:]
  for resource in transientResources {
    let type = try await engine.editor.getMIMEType(url: resource.url)
    resourcesByType[type, default: 0] += 1
  }
  print("Resources by type: \(resourcesByType)")

  var imageResources: [(url: URL, mimeType: String)] = []
  for resource in transientResources {
    let type = try await engine.editor.getMIMEType(url: resource.url)
    if type.hasPrefix("image/") {
      imageResources.append((url: resource.url, mimeType: type))
    }
  }
  print("Found \(imageResources.count) image resources")

  let bufferMimeType = try await engine.editor.getMIMEType(url: imageBuffer)
  let length = try engine.editor.getBufferLength(url: imageBuffer)
  let data = try engine.editor.getBufferData(url: imageBuffer, offset: 0, length: UInt(truncating: length))

  let fileExtension = switch bufferMimeType {
  case "image/png": "png"
  case "image/webp": "webp"
  default: "jpg"
  }

  let fileURL = FileManager.default.temporaryDirectory
    .appendingPathComponent(UUID().uuidString)
    .appendingPathExtension(fileExtension)
  try data.write(to: fileURL, options: .atomic)
  print("Saved \(length) bytes as \(fileURL.lastPathComponent)")

  for resource in transientResources {
    // Demo placeholder — in production, use the URL your storage service returns.
    let hostedURL = URL(string: "https://example.com/assets/\(UUID().uuidString)")!
    try engine.editor.relocateResource(currentURL: resource.url, relocatedURL: hostedURL)
  }

  let remaining = try engine.editor.findAllTransientResources()
  print("Transient resources remaining: \(remaining.count)")
}
```

Detect the MIME type of resources the engine can access and relocate embedded media to external URLs using `engine.editor.getMIMEType(url:)` and `engine.editor.relocateResource(currentURL:relocatedURL:)`.

> **Reading time:** 6 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.81.0-rc.1/engine-guides-retrieve-mimetype)

<EngineReferenceNote {...props} />

When a scene archive bundles its media, the embedded files are held in memory and referenced through internal `buffer://` URIs rather than their original URLs. To process those files correctly — to persist them with the right extension, or to upload them to a CDN and produce a portable scene — you first need to know each resource's format. `getMIMEType(url:)` detects the format of any resource the engine can reach, including buffer URIs, local files, and remote URLs.

This guide covers detecting a resource's MIME type, embedding media as an in-memory buffer, finding transient resources, retrieving and filtering their MIME types, reading their bytes, and relocating them to external URLs.

## Detecting the MIME Type

Pass any URL the engine can access to `getMIMEType(url:)`. It returns the standard MIME type string — `image/jpeg` for a JPEG, `image/png` for a PNG, and so on — downloading the resource first if it isn't already cached.

```swift highlight-retrieveMimetype-detect
let mimeType = try await engine.editor.getMIMEType(url: imageURL)
print("Detected MIME type: \(mimeType)")
```

## Embedding a Resource

To work with embedded media, write the raw bytes into an in-memory buffer with `createBuffer()` and `setBufferData(url:offset:data:)`, then use the buffer as a block's image fill. The engine now references the data through a `buffer://` URI — the same kind of resource produced when a scene archive bundles its assets.

```swift highlight-retrieveMimetype-embed
  let imageBuffer = engine.editor.createBuffer()
  try engine.editor.setBufferData(url: imageBuffer, offset: 0, data: imageData)

  let graphic = try engine.block.create(.graphic)
  try engine.block.setShape(graphic, shape: engine.block.createShape(.rect))
  let imageFill = try engine.block.createFill(.image)
  try engine.block.setURL(imageFill, property: "fill/image/imageFileURI", value: imageBuffer)
  try engine.block.setFill(graphic, fill: imageFill)
  try engine.block.appendChild(to: page, child: graphic)
```

## Finding Transient Resources

Transient resources are embedded files whose data would be lost if the scene were exported on its own. `findAllTransientResources()` returns each resource's `url` and `size` in bytes.

```swift highlight-retrieveMimetype-findTransient
let transientResources = try engine.editor.findAllTransientResources()
print("Found \(transientResources.count) transient resources")
```

## Retrieving MIME Types

Call `getMIMEType(url:)` on each transient resource to categorize what the scene embeds. This is useful for reporting on a scene's contents or deciding how to process each resource.

```swift highlight-retrieveMimetype-getMimetype
var resourcesByType: [String: Int] = [:]
for resource in transientResources {
  let type = try await engine.editor.getMIMEType(url: resource.url)
  resourcesByType[type, default: 0] += 1
}
print("Resources by type: \(resourcesByType)")
```

A scene may embed several formats at once — images alongside fonts and audio. The method returns standard MIME type strings such as `image/jpeg`, `image/png`, `font/ttf`, or `font/woff2`.

## Filtering Resources by Type

To process only one kind of resource, filter by the MIME type prefix. This separates image handling from font or audio handling.

```swift highlight-retrieveMimetype-filterImages
var imageResources: [(url: URL, mimeType: String)] = []
for resource in transientResources {
  let type = try await engine.editor.getMIMEType(url: resource.url)
  if type.hasPrefix("image/") {
    imageResources.append((url: resource.url, mimeType: type))
  }
}
print("Found \(imageResources.count) image resources")
```

## Reading Buffer Data

Once you know a buffer's MIME type, read its bytes with `getBufferLength(url:)` and `getBufferData(url:offset:length:)`. Use the MIME type to choose the correct file extension when persisting the bytes to disk.

```swift highlight-retrieveMimetype-bufferData
  let bufferMimeType = try await engine.editor.getMIMEType(url: imageBuffer)
  let length = try engine.editor.getBufferLength(url: imageBuffer)
  let data = try engine.editor.getBufferData(url: imageBuffer, offset: 0, length: UInt(truncating: length))

  let fileExtension = switch bufferMimeType {
  case "image/png": "png"
  case "image/webp": "webp"
  default: "jpg"
  }

  let fileURL = FileManager.default.temporaryDirectory
    .appendingPathComponent(UUID().uuidString)
    .appendingPathExtension(fileExtension)
  try data.write(to: fileURL, options: .atomic)
  print("Saved \(length) bytes as \(fileURL.lastPathComponent)")
```

## Relocating Resources

`relocateResource(currentURL:relocatedURL:)` updates every reference to a resource's current URL so the scene points at a new URL instead. After uploading the bytes you read to your storage service, relocate each `buffer://` URI to the hosted URL it returns. This produces a scene that references external assets instead of embedding their data.

```swift highlight-retrieveMimetype-relocate
for resource in transientResources {
  // Demo placeholder — in production, use the URL your storage service returns.
  let hostedURL = URL(string: "https://example.com/assets/\(UUID().uuidString)")!
  try engine.editor.relocateResource(currentURL: resource.url, relocatedURL: hostedURL)
}
```

## Verifying Relocation

After relocating every embedded resource to a hosted URL, `findAllTransientResources()` returns an empty array — the scene no longer carries data that would be lost on export.

```swift highlight-retrieveMimetype-verify
let remaining = try engine.editor.findAllTransientResources()
print("Transient resources remaining: \(remaining.count)")
```

## API Reference

| Method | Description |
| --- | --- |
| `engine.editor.getMIMEType(url:)` | Returns the MIME type of the resource at the given URL, downloading it first if it isn't cached. |
| `engine.editor.findAllTransientResources()` | Returns the `url` and byte `size` of every resource whose data would be lost on export, such as embedded buffers. |
| `engine.editor.getBufferLength(url:)` | Returns the byte length of a buffer as an `NSNumber`. |
| `engine.editor.getBufferData(url:offset:length:)` | Returns raw `Data` from a buffer, starting at `offset` for `length` bytes. |
| `engine.editor.relocateResource(currentURL:relocatedURL:)` | Updates every reference to `currentURL` in the scene to use `relocatedURL` instead. |

## Troubleshooting

### MIME Type Cannot Be Determined

`getMIMEType(url:)` throws when the URL can't be parsed or the resource can't be fetched — a missing file or an unreachable URL, for example. For a resource the engine reaches but can't classify, it returns the string `"unknown"`. Wrap the call in `do`/`catch`, and treat a thrown error or an `"unknown"` result as the cue to fall back to a default type.

### No Transient Resources Found

If `findAllTransientResources()` returns an empty array, the scene has no embedded media. Its resources may already reference external URLs, or no buffer-backed fills were added.

### Resources Not Relocated

If transient resources remain after `relocateResource(currentURL:relocatedURL:)`, confirm you pass the exact URL returned by `findAllTransientResources()`. Bundle resources (`bundle://`) are internal and cannot be relocated.

## Next Steps

- [Import Design from Archive](../open-the-editor/import-design/from-archive.md) — Load self-contained archive files that bundle a scene with all of its embedded assets.
- [Export Options](../export-save-publish/export/overview.md) — Export scenes and work with the resulting resource data.



---

## More Resources

- **[Mac Catalyst Documentation Index](https://img.ly/docs/cesdk/mac-catalyst/)** - Browse all Mac Catalyst documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/mac-catalyst/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/mac-catalyst/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
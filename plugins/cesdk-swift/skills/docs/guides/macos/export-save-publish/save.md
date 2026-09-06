> This is one page of the CE.SDK macOS documentation. For a complete overview, see the [macOS Documentation Index](https://img.ly/docs/cesdk/macos/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/macos/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Save](./save.md)

---

Save and serialize designs in CE.SDK for later retrieval, sharing, or storage using string or archive formats.

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.83.0-nightly.20260906/engine-guides-save-designs)

CE.SDK provides two formats for persisting designs. Choose the format based on your storage and portability requirements.

```swift file=@cesdk_swift_examples/engine-guides-save-designs/SaveDesigns.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func saveDesigns(engine: Engine) async throws {
  // Demo scaffolding: load a template so every snippet has a scene to operate on.
  // In your app you would start from a scene already loaded into the editor.
  let baseURL = try engine.guidesBaseURL
  try engine.editor.setSettingString("basePath", value: baseURL.absoluteString)
  let templateURL = baseURL.appendingPathComponent("ly.img.templates/templates/cesdk_business_card_1.scene")
  try await engine.scene.load(from: templateURL)

  let outputDir = FileManager.default.temporaryDirectory

  let sceneString = try await engine.scene.saveToString()

  let archiveBlob = try await engine.scene.saveToArchive()

  let compressed = try await engine.scene.saveToString(
    options: SaveToStringOptions(
      compression: CompressionOptions(format: .zstd, level: .default),
    ),
  )
  _ = compressed

  let compressedArchive = try await engine.scene.saveToArchive(
    options: SaveToArchiveOptions(
      compression: CompressionOptions(format: .zstd, level: .default),
    ),
  )
  _ = compressedArchive

  let sceneURL = outputDir.appendingPathComponent("scene.imgly")
  try sceneString.write(to: sceneURL, atomically: true, encoding: .utf8)

  let archiveURL = outputDir.appendingPathComponent("archive.imgly")
  try archiveBlob.write(to: archiveURL)

  let restoredString = try String(contentsOf: sceneURL, encoding: .utf8)
  try await engine.scene.load(from: restoredString)

  try await engine.scene.load(from: archiveURL)
}
```

## Save Format Comparison

| Format  | Method            | Assets             | Best For                     |
| ------- | ----------------- | ------------------ | ---------------------------- |
| String  | `saveToString()`  | Referenced by URL  | Database storage, cloud sync |
| Archive | `saveToArchive()` | Embedded in ZIP    | Offline use, file sharing    |

**String format** produces a lightweight serialized string where assets remain as URL references. Use this when asset URLs will remain accessible.

**Archive format** creates a self-contained ZIP with all assets embedded. Use this for portable designs that work offline.

Persist saved files of either format with the `.imgly` extension. The `.scene` and `.zip` extensions also load, and the same `engine.scene.load(from:)` call opens either kind.

## Save to String

Serialize the current scene to a string suitable for database storage.

```swift highlight-saveDesigns-saveToString
let sceneString = try await engine.scene.saveToString()
```

The string contains the complete scene structure but references assets by their original URLs.

## Save to Archive

Create a self-contained ZIP with the scene and all embedded assets.

```swift highlight-saveDesigns-saveToArchive
let archiveBlob = try await engine.scene.saveToArchive()
```

`saveToArchive()` returns a `Blob` (a `Data` value) that includes all pages, elements, and asset data in a single portable file.

## Compression Options

Saved scenes are compressed with Zstd by default, which makes them much smaller and
speeds up both saving and loading. Pass a format explicitly to change the level, or to turn
compression off.

```swift highlight-saveDesigns-compression
let compressed = try await engine.scene.saveToString(
  options: SaveToStringOptions(
    compression: CompressionOptions(format: .zstd, level: .default),
  ),
)
```

**Compression Formats:**

- `CompressionFormat.zstd` — Zstd compression (default)
- `CompressionFormat.none` — No compression

**Compression Levels:**

- `CompressionLevel.fastest` — Fastest compression, larger output
- `CompressionLevel.default` — Balanced speed and size (recommended)
- `CompressionLevel.best` — Best compression, slower

An archive can compress its scene the same way. Bundled images, video and fonts are stored as they are, because they already are compressed formats.

```swift highlight-saveDesigns-archiveCompression
let compressedArchive = try await engine.scene.saveToArchive(
  options: SaveToArchiveOptions(
    compression: CompressionOptions(format: .zstd, level: .default),
  ),
)
```

Compression adds minimal overhead while reducing scene size. The default level provides the best balance of speed and compression ratio.

## Write to Disk

Use Foundation's file APIs to persist saved designs to the file system.

Scene strings can be written directly as text:

```swift highlight-saveDesigns-writeScene
let sceneURL = outputDir.appendingPathComponent("scene.imgly")
try sceneString.write(to: sceneURL, atomically: true, encoding: .utf8)
```

Archives are returned as `Data`, which writes to disk in a single call:

```swift highlight-saveDesigns-writeArchive
let archiveURL = outputDir.appendingPathComponent("archive.imgly")
try archiveBlob.write(to: archiveURL)
```

## Load Scene from File

Read a previously saved `.scene` file from disk and restore it to the engine with `engine.scene.load(from:)`.

```swift highlight-saveDesigns-loadScene
let restoredString = try String(contentsOf: sceneURL, encoding: .utf8)
try await engine.scene.load(from: restoredString)
```

Scene files are lightweight but require the original asset URLs to remain accessible.

## Load Archive from File

Use `engine.scene.load(from:)` with a local file URL to restore a self-contained archive that includes all embedded assets — the same call that loads scene files, since the engine detects the file kind automatically.

```swift highlight-saveDesigns-loadArchive
try await engine.scene.load(from: archiveURL)
```

Archives are portable and work offline since all assets are bundled within the file.

## API Reference

| Method                              | Description                                                       |
| ----------------------------------- | ----------------------------------------------------------------- |
| `engine.scene.saveToString()`       | Serialize scene to string with optional compression               |
| `engine.scene.saveToArchive()`      | Save scene with assets as ZIP `Data`                              |
| `engine.scene.load(from:)`          | Load a scene or archive from a string or URL (file kind detected automatically) |
| `engine.scene.loadArchive(from:)`   | Load a scene archive from a URL               |
| `engine.block.saveToString()`       | Serialize specific blocks to a string                             |
| `engine.block.saveToArchive(blocks:)` | Save specific blocks with assets as ZIP `Data`                  |
| `engine.block.load(from:)`          | Load blocks from a serialized string or URL                       |
| `engine.block.loadArchive(from:)`   | Load blocks from a ZIP archive URL                                |

## Next Steps

- [Export Overview](./export/overview.md) — Export designs to image, PDF, and video formats
- [Load Scene](../open-the-editor/load-scene.md) — Load scenes from remote URLs and archives
- [Store Custom Metadata](./store-custom-metadata.md) — Attach metadata like tags or version info to designs
- [Partial Export](./export/partial-export.md) — Export individual blocks or selections



---

## More Resources

- **[macOS Documentation Index](https://img.ly/docs/cesdk/macos/)** - Browse all macOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/macos/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/macos/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
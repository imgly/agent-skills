> This is one page of the CE.SDK Mac Catalyst documentation. For a complete overview, see the [Mac Catalyst Documentation Index](https://img.ly/docs/cesdk/mac-catalyst/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/mac-catalyst/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Open the Editor](../../open-the-editor.md) > [Import a Design](../import-design.md) > [From Archive](./from-archive.md)

---

```swift file=@cesdk_swift_examples/engine-guides-import-design-from-archive/ImportDesignFromArchive.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func importDesignFromArchive(engine: Engine) async throws {
  // Demo scaffolding: load a template so there is a design to archive and import.
  // In your app you would start from a scene already open in the editor.
  let baseURL = try engine.guidesBaseURL
  try engine.editor.setSettingString("basePath", value: baseURL.absoluteString)
  let templateURL = baseURL.appendingPathComponent("ly.img.templates/templates/cesdk_business_card_1.scene")
  try await engine.scene.load(from: templateURL)

  let archiveBlob = try await engine.scene.saveToArchive()
  let archiveURL = FileManager.default.temporaryDirectory.appendingPathComponent("design.imgly")
  try archiveBlob.write(to: archiveURL)

  try await engine.scene.load(from: archiveURL)

  let dataURL = FileManager.default.temporaryDirectory.appendingPathComponent("design-from-data.imgly")
  try archiveBlob.write(to: dataURL)
  try await engine.scene.load(from: dataURL)

  let textBlocks = try engine.block.find(byType: .text)
  if let firstTextBlock = textBlocks.first {
    try engine.block.replaceText(firstTextBlock, text: "Loaded from Archive")
  }
}
```

Import archived CE.SDK scenes that bundle the design structure together with all fonts, images, and assets in a single portable file.

> **Reading time:** 6 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.83.0-nightly.20260831/engine-guides-import-design-from-archive)

<EngineReferenceNote {...props} />

Scene files reference assets by URL, so they break when those URLs become unavailable. Archives solve this by packaging the scene together with every font, image, and video into a single file — saved with the `.imgly` extension (the `.zip` extension also works). This makes a design self-contained and reliable to move between environments, share with others, or store long term.

## Understanding CE.SDK Archives

A CE.SDK archive is a ZIP container created with `engine.scene.saveToArchive()` — save it with the `.imgly` extension — that holds both the scene structure and all referenced assets. The scene points at those assets with relative paths, so the archive carries no external URL dependencies and loads identically wherever it is hosted.

An archive uses a predictable directory layout:

- `scene.scene` — the scene structure, layout, and element properties
- `images/` — image assets used in the scene
- `fonts/` — font files used by text blocks
- `videos/` — video content referenced in the scene
- `audios/` — audio tracks and sound effects

## Create an Archive

Produce an archive with `engine.scene.saveToArchive()`. It returns the current design and all its assets as a `Blob` (a typealias for `Data`), which you can write to disk to load back later.

```swift highlight-importDesignFromArchive-createArchive
let archiveBlob = try await engine.scene.saveToArchive()
let archiveURL = FileManager.default.temporaryDirectory.appendingPathComponent("design.imgly")
try archiveBlob.write(to: archiveURL)
```

See the [Save a Scene](../../export-save-publish/save.md) guide for the full save story, including scene files and compression options.

## Load an Archive

Use `engine.scene.load(from:)` to import an archive — the same call that loads scene files, since the engine detects the file kind automatically. The engine fetches the archive, extracts its contents, and loads the scene with all bundled assets as the active scene.

```swift highlight-importDesignFromArchive-loadFromURL
try await engine.scene.load(from: archiveURL)
```

The URL can point to a file on disk — a bundled file, or one the user selected — or to a remote `https://` location, which the engine downloads before loading. Loading is asynchronous and replaces the current scene. Wrap the call in a `do`/`catch` to handle a failed load, such as a corrupt archive or an unreachable URL.

## Load an Archive from In-Memory Data

When you hold the archive as in-memory `Data` rather than a URL — bytes downloaded from your API or read from a database — write it to a temporary file and load that file.

```swift highlight-importDesignFromArchive-loadFromData
let dataURL = FileManager.default.temporaryDirectory.appendingPathComponent("design-from-data.imgly")
try archiveBlob.write(to: dataURL)
try await engine.scene.load(from: dataURL)
```

## Modify the Loaded Scene

Once an archive loads, the scene is immediately editable. Locate elements with the block API and update them like any other scene.

```swift highlight-importDesignFromArchive-modify
let textBlocks = try engine.block.find(byType: .text)
if let firstTextBlock = textBlocks.first {
  try engine.block.replaceText(firstTextBlock, text: "Loaded from Archive")
}
```

Image fills reference the bundled assets through relative URIs, so they remain available wherever the archive is stored.

## Archive Contents and Structure

Archives use standard ZIP compression with a fixed internal layout. The scene file references assets by relative path instead of absolute URL:

```text
archive.zip
├── scene.scene
├── images/
│   ├── image-abc123.jpg
│   └── image-def456.png
├── fonts/
│   └── CustomFont-Regular.ttf
├── videos/
│   └── video-ghi789.mp4
└── audios/
    └── audio-jkl012.mp3
```

A relative URI such as `./images/image-abc123.jpg` resolves from within the archive, so bundled assets are always accessible no matter where the archive lives.

## Archives vs Scene Files

CE.SDK offers two save formats that handle assets differently:

- **Scene files** are lightweight JSON that store the design structure and reference assets by their original URLs. Use them when those URLs stay reachable and you want the smallest possible file.
- **Archives** bundle the scene with all referenced assets using relative paths. Use them when you need a self-contained, portable package.

Both kinds are saved with the `.imgly` extension; `.scene` and `.zip` files also load. Load either with the same `engine.scene.load(from:)` call — the engine detects the file kind automatically. See [Load a Scene](../load-scene.md) for the scene-file path.

## Asset Availability and Portability

A scene file only loads correctly while every referenced asset stays at its original URL. Moving assets, expiring authentication, or losing network access all break it. Archives remove that dependency by bundling the assets inside the archive file, which makes a design environment-independent, offline-capable, and safe to share without coordinating asset access.

## Troubleshooting

**The archive fails to load** — confirm it was created with `engine.scene.saveToArchive()`, since CE.SDK archives use a specific internal structure that an arbitrary `.zip` does not have. Check that the file is a valid, uncorrupted archive, and that a remote URL is reachable.

**Assets are missing after loading** — verify the archive was not edited by hand, which breaks the relative references, and that the asset formats and codecs are supported.

**Large archives take time** — loading is asynchronous because the engine downloads and extracts the archive. Show a progress indicator in your UI while the load completes.

## API Reference

### Methods

| Method | Description |
| --- | --- |
| `engine.scene.load(from:)` | Load a scene file or archive from a URL (file kind detected automatically) |
| `engine.scene.saveToArchive()` | Create an archive as `Data` (the `Blob` typealias) bundling the scene with its assets |
| `engine.scene.loadArchive(from:)` | Load a scene archive from a URL |
| `engine.block.find(byType:)` | Find blocks by type in the loaded scene |

## Next Steps

- [Save a Scene](../../export-save-publish/save.md) — Create archives and scene files from the current design.
- [Load a Scene](../load-scene.md) — Load a scene file when assets are referenced by URL.



---

## More Resources

- **[Mac Catalyst Documentation Index](https://img.ly/docs/cesdk/mac-catalyst/)** - Browse all Mac Catalyst documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/mac-catalyst/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/mac-catalyst/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
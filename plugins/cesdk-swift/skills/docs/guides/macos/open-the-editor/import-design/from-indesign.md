> This is one page of the CE.SDK macOS documentation. For a complete overview, see the [macOS Documentation Index](https://img.ly/docs/cesdk/macos/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/macos/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Open the Editor](../../open-the-editor.md) > [Import a Design](../import-design.md) > [From InDesign](./from-indesign.md)

---

```swift file=@cesdk_swift_examples/engine-guides-import-from-indesign/ImportFromInDesign.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func importFromInDesign(engine: Engine) async throws {
  // Stand in for the .imgly archive your server produces from an IDML file with
  // the @imgly/idml-importer package. In production, archiveURL points to that
  // archive — a remote URL on your CDN or a local file URL — and
  // load(from:) accepts either.
  let baseURL = try engine.guidesBaseURL
  let sceneURL = baseURL.appendingPathComponent("ly.img.templates/templates/cesdk_business_card_1.scene")
  try await engine.scene.load(from: sceneURL)
  let archiveData = try await engine.scene.saveToArchive()
  let archiveURL = FileManager.default.temporaryDirectory
    .appendingPathComponent("converted-indesign-\(UUID().uuidString).imgly")
  try archiveData.write(to: archiveURL)

  try await engine.scene.load(from: archiveURL)

  let pages = try engine.scene.getPages()
  print("Imported design has \(pages.count) page(s)")

  guard let scene = try engine.scene.get() else { return }
  try await engine.scene.zoom(
    to: scene,
    paddingLeft: 40,
    paddingTop: 40,
    paddingRight: 40,
    paddingBottom: 40,
  )
}
```

Bring Adobe InDesign designs into CE.SDK by converting IDML files to a scene
archive on a server, then loading that archive into the engine.

> **Reading time:** 4 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.82.0-nightly.20260826/engine-guides-import-from-indesign)

<EngineReferenceNote {...props} />

InDesign import is handled by the `@imgly/idml-importer` package, which parses IDML files and converts them into CE.SDK scenes. That package runs in Node.js and the browser — there is no on-device IDML parser. The recommended workflow is to convert IDML files to a portable `.imgly` archive once with the [Node.js importer](./from-indesign.md), then ship or download that archive and load it with `engine.scene.load(from:)`.

## Load the Converted Archive

Load the `.imgly` archive produced by the conversion step with `load(from:)`. Archives are ZIP files that bundle the scene together with its embedded assets, so the import is self-contained — the URL can point to a local file or a remote download.

```swift highlight-importFromInDesign-loadArchive
try await engine.scene.load(from: archiveURL)
```

## Verify the Import

After loading, confirm the scene contains pages before presenting it. `engine.scene.getPages()` returns the imported pages; an empty result means the archive held no usable content.

```swift highlight-importFromInDesign-verifyImport
let pages = try engine.scene.getPages()
print("Imported design has \(pages.count) page(s)")
```

## Fit the Scene to the Viewport

Retrieve the current scene with `engine.scene.get()` and frame it with `engine.scene.zoom(to:)`. The four padding parameters add space in points around the focused block.

```swift highlight-importFromInDesign-fitViewport
guard let scene = try engine.scene.get() else { return }
try await engine.scene.zoom(
  to: scene,
  paddingLeft: 40,
  paddingTop: 40,
  paddingRight: 40,
  paddingBottom: 40,
)
```

## What Gets Imported

The conversion preserves element grouping, positioning, rotation, and transparency, along with text (bold and italic styles), shapes (rectangles, ovals, polygons, lines), solid and gradient fills, strokes, and embedded images. These are baked into the archive during conversion, so the imported scene is fully editable once loaded.

## Limitations

The same conversion limitations apply wherever you load the result:

- **Linked images** become placeholders. Embed all images in InDesign before exporting to IDML.
- **Text flow** between multiple frames is not supported and may appear duplicated.
- **Unavailable fonts** are substituted with fallbacks. Configure font matching during conversion for the best results.
- **Complex text formatting** beyond bold and italic may not be preserved.

These are the highlights only—the [`@imgly/idml-importer`](https://www.npmjs.com/package/@imgly/idml-importer) page on npm maintains the complete, up-to-date list of supported features and limitations.

## API Reference

### Methods

| Method | Description |
| --- | --- |
| `engine.scene.load(from:)` | Load a scene and its bundled assets from an `.imgly` archive URL |
| `engine.scene.get()` | Return the current scene block, or `nil` if none is loaded |
| `engine.scene.getPages()` | Return the pages of the current scene |
| `engine.scene.zoom(to:paddingLeft:paddingTop:paddingRight:paddingBottom:)` | Fit a block in the viewport with padding in points |

## Next Steps

- [Import Design from Archive](./from-archive.md) — Learn the full `.imgly` archive workflow used by this guide.
- [Import Templates](../../create-templates/import.md) — Load and import design templates into CE.SDK from URLs, archives, and serialized strings.
- [Export Overview](../../export-save-publish/export/overview.md) — Export your imported design to PNG, PDF, and other formats.



---

## More Resources

- **[macOS Documentation Index](https://img.ly/docs/cesdk/macos/)** - Browse all macOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/macos/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/macos/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
> This is one page of the CE.SDK macOS documentation. For a complete overview, see the [macOS Documentation Index](https://img.ly/docs/cesdk/macos/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/macos/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Create and Use Templates](../create-templates.md) > [Import Templates](./import.md)

---

Load design templates into CE.SDK from archive URLs, scene URLs, and serialized strings.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.81.1/engine-guides-import-templates)

Templates are pre-designed scenes that provide starting points for user projects. CE.SDK supports loading templates from archive URLs with bundled assets, remote scene URLs, or serialized strings stored in databases.

```swift file=@cesdk_swift_examples/engine-guides-import-templates/ImportTemplates.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func importTemplates(engine: Engine) async throws {
  let baseURL = try engine.guidesBaseURL

  let sceneURL = baseURL.appendingPathComponent("ly.img.templates/templates/cesdk_business_card_1.scene")
  try await engine.scene.load(from: sceneURL)

  guard let scene = try engine.scene.get() else { return }
  let pages = try engine.scene.getPages()
  print("Template has \(pages.count) page(s)")

  try await engine.scene.zoom(
    to: scene,
    paddingLeft: 40,
    paddingTop: 40,
    paddingRight: 40,
    paddingBottom: 40,
  )

  // Prepare a serialized scene string for the next section.
  // In production, sceneString comes from your database or a fetched .scene file.
  let sceneString = try await engine.scene.saveToString()

  try await engine.scene.load(from: sceneString)

  // Prepare a local archive for the next section by saving the current scene.
  // In production, archiveURL points to your own archive — a remote URL on your
  // CDN or a local file URL — and load(from:) accepts either. Archives use the
  // .imgly extension now (.zip remains loadable).
  let archiveData = try await engine.scene.saveToArchive()
  let archiveURL = FileManager.default.temporaryDirectory
    .appendingPathComponent("imported-template-\(UUID().uuidString).imgly")
  try archiveData.write(to: archiveURL)

  try await engine.scene.load(from: archiveURL)
}
```

This guide covers how to load templates from archives, URLs, and strings, and work with the loaded content.

## Load from Archive

Load a template from an archive URL using `load(from:)` — the same call that loads scene files, since the engine detects the file kind automatically. Archives bundle the scene with all its assets, making them portable and self-contained; they use the `.imgly` extension (the `.zip` extension also works). The URL can point to a local file or a remote download — `load(from:)` accepts either.

```swift highlight-importTemplates-loadFromArchive
try await engine.scene.load(from: archiveURL)
```

## Load from URL

Load a template from a remote `.scene` file URL using `load(from:)`. The scene file is a JSON-based format that references assets via URLs, so those assets must remain reachable at their original URLs.

```swift highlight-importTemplates-loadFromURL
let sceneURL = baseURL.appendingPathComponent("ly.img.templates/templates/cesdk_business_card_1.scene")
try await engine.scene.load(from: sceneURL)
```

## Load from String

For templates stored in databases or received from APIs, call `load(from:)` with the serialized scene string. This works with content previously produced by `engine.scene.saveToString()`.

```swift highlight-importTemplates-loadFromString
try await engine.scene.load(from: sceneString)
```

## Working with the Loaded Scene

After loading a template, retrieve the active scene and inspect or adjust the viewport.

### Verify the Scene

Use `engine.scene.get()` to retrieve the current scene block — it returns an optional and is `nil` until a scene has been loaded. Pair it with `engine.scene.getPages()` to list the template's pages; `pages.count` tells you how many it contains.

```swift highlight-importTemplates-getScene
guard let scene = try engine.scene.get() else { return }
let pages = try engine.scene.getPages()
print("Template has \(pages.count) page(s)")
```

### Zoom to Content

Fit the loaded template in the viewport using `engine.scene.zoom(to:)`. The four padding parameters add space in points around the focused block.

```swift highlight-importTemplates-zoomToScene
try await engine.scene.zoom(
  to: scene,
  paddingLeft: 40,
  paddingTop: 40,
  paddingRight: 40,
  paddingBottom: 40,
)
```

## Next Steps

- [From Scene File](./import/from-scene-file.md) — Load and import design templates from scene files in CE.SDK
- [Apply Templates](../use-templates/apply-template.md) — Apply templates to existing scenes while preserving page dimensions



---

## Related Pages

- [Import Templates from Scene Files](./import/from-scene-file.md) - Load and import design templates from scene files in CE.SDK


---

## More Resources

- **[macOS Documentation Index](https://img.ly/docs/cesdk/macos/)** - Browse all macOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/macos/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/macos/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
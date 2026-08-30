> This is one page of the CE.SDK iOS documentation. For a complete overview, see the [iOS Documentation Index](https://img.ly/docs/cesdk/ios/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/ios/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Create and Use Templates](../../create-templates.md) > [Import Templates](../import.md) > [From Scene File](./from-scene-file.md)

---

```swift file=@cesdk_swift_examples/engine-guides-import-from-scene-file/ImportFromSceneFile.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func importFromSceneFile(engine: Engine) async throws {
  // Base URL the sample templates are resolved against. In your app this is the
  // location where you host your own `.scene` files.
  let baseURL = try engine.guidesBaseURL

  // Prepare a local archive for the next section: load a sample template and
  // save it as an archive. In production, archiveURL points to your own
  // archive — a remote URL on your CDN or a local file URL — and load(from:)
  // accepts either. Archives use the .imgly extension now (.zip remains
  // loadable).
  let setupSceneURL = baseURL
    .appendingPathComponent("ly.img.templates/templates/cesdk_business_card_1.scene")
  try await engine.scene.load(from: setupSceneURL)
  let archiveData = try await engine.scene.saveToArchive()
  let archiveURL = FileManager.default.temporaryDirectory
    .appendingPathComponent("imported-template-\(UUID().uuidString).imgly")
  try archiveData.write(to: archiveURL)

  try await engine.scene.load(from: archiveURL)

  let sceneURL = baseURL
    .appendingPathComponent("ly.img.templates/templates/cesdk_business_card_1.scene")
  try await engine.scene.load(from: sceneURL)

  if let loadedPage = try engine.scene.getPages().first {
    try await engine.captureGuide(loadedPage, label: "after-load-url")
  }

  // Create a scene whose page dimensions the template content must adapt to.
  let designScene = try engine.scene.create()
  try engine.block.setFloat(designScene, property: "scene/pageDimensions/width", value: 1920)
  try engine.block.setFloat(designScene, property: "scene/pageDimensions/height", value: 1080)
  let page = try engine.block.create(.page)
  try engine.block.appendChild(to: designScene, child: page)

  let templateURL = baseURL
    .appendingPathComponent("ly.img.templates/templates/cesdk_business_card_1.scene")
  try await engine.scene.applyTemplate(from: templateURL)

  if let appliedPage = try engine.scene.getPages().first {
    try await engine.captureGuide(appliedPage, label: "hero")
  }

  guard let scene = try engine.scene.get() else { return }
  let pages = try engine.scene.getPages()
  print("Scene \(scene) contains \(pages.count) page(s)")

  // Demo: this URL has no scene file behind it.
  let missingTemplateURL = FileManager.default.temporaryDirectory
    .appendingPathComponent("missing-template.scene")
  do {
    try await engine.scene.load(from: missingTemplateURL)
  } catch {
    print("Failed to load template:", error.localizedDescription)
  }
}
```

CE.SDK lets you load complete design templates from scene files to start projects from pre-designed templates, implement template galleries, and build template management systems.

![A business card template applied to a 1920×1080 page, with the template content adjusted to fit the page dimensions.](https://img.ly/docs/cesdk/ios/create-templates/import/from-scene-file-52a01e/assets/swift-based.hero.webp)

> **Reading time:** 6 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.83.0-nightly.20260830/engine-guides-import-from-scene-file)

<EngineReferenceNote {...props} />

Scene files are portable design templates that preserve the entire design structure including blocks, assets, styles, and layout. This guide covers loading scenes from archives, loading from URLs, applying templates while preserving dimensions, and understanding scene file formats.

## Scene File Formats

CE.SDK supports two scene file formats for importing templates. Both are saved with the `.imgly` extension — `.scene` and `.zip` files also load — and the same `load(from:)` call opens either kind:

### Scene Format

Scene files are JSON-based representations of design structures. They reference external assets via URLs, making them lightweight and suitable for database storage. However, the referenced assets must remain accessible at their URLs.

**When to use:**

- Templates stored in databases
- Templates with hosted assets
- Lightweight transmission

### Archive Format

Archive files are self-contained packages that bundle the scene structure with all referenced assets in a ZIP container. This makes them portable and suitable for offline use.

**When to use:**

- Template distribution
- Offline-capable templates
- Complete portability
- **Recommended for most use cases**

## Load Scene from Archive

The most common way to load templates is from archives. `load(from:)` loads both the scene structure and all embedded assets — the engine detects that the file is an archive automatically — and accepts a local file URL or a remote URL:

```swift highlight-importFromSceneFile-loadFromArchive
try await engine.scene.load(from: archiveURL)
```

Here, `archiveURL` is a local file URL the example produces by saving the current scene with `engine.scene.saveToArchive()`. In your app it points to your own archive — a file you bundle or a download from your server.

When you load from an archive:

- The ZIP file is fetched and extracted
- All assets are registered with CE.SDK
- The scene structure is loaded
- Asset paths are automatically resolved

## Load Scene from URL

You can also load scenes directly from `.scene` file URLs using `load(from:)`. This approach requires that all referenced assets remain accessible at their original URLs. In the example, `baseURL` points to the location hosting the sample templates — substitute the URL where you host your own `.scene` files:

```swift highlight-importFromSceneFile-loadFromURL
let sceneURL = baseURL
  .appendingPathComponent("ly.img.templates/templates/cesdk_business_card_1.scene")
try await engine.scene.load(from: sceneURL)
```

**Important:** With this method, if asset URLs become unavailable, those assets won't load and your template may appear incomplete.

## Apply Template vs Load Scene

CE.SDK provides two approaches for working with templates, each serving different purposes:

### Load Scene

When you use `load(from:)` with a scene file or an archive, CE.SDK:

- Replaces the entire current scene
- Adopts the template's page dimensions
- Loads all content as-is

This is appropriate when starting a new project from a template.

### Apply Template

When you use `applyTemplate(from:)`, CE.SDK:

- Keeps the design unit and page dimensions of the current scene
- Automatically adjusts the template content to fit the new dimensions

This is useful when you want to load template content into an existing scene with specific dimensions:

```swift highlight-importFromSceneFile-applyTemplate
  // Create a scene whose page dimensions the template content must adapt to.
  let designScene = try engine.scene.create()
  try engine.block.setFloat(designScene, property: "scene/pageDimensions/width", value: 1920)
  try engine.block.setFloat(designScene, property: "scene/pageDimensions/height", value: 1080)
  let page = try engine.block.create(.page)
  try engine.block.appendChild(to: designScene, child: page)

  let templateURL = baseURL
    .appendingPathComponent("ly.img.templates/templates/cesdk_business_card_1.scene")
  try await engine.scene.applyTemplate(from: templateURL)
```

`applyTemplate(from:)` reads the target dimensions from the scene's `scene/pageDimensions/width` and `scene/pageDimensions/height` properties and resizes the template's pages to match.

## Get Scene Information

After loading a template, retrieve the current scene with `engine.scene.get()` — it returns an optional that is `nil` until a scene has been loaded — and list the template's pages with `engine.scene.getPages()`:

```swift highlight-importFromSceneFile-getScene
guard let scene = try engine.scene.get() else { return }
let pages = try engine.scene.getPages()
print("Scene \(scene) contains \(pages.count) page(s)")
```

## Error Handling

`load(from:)` and `applyTemplate(from:)` both throw on failure, so wrap them in `do`/`catch`:

```swift highlight-importFromSceneFile-errorHandling
// Demo: this URL has no scene file behind it.
let missingTemplateURL = FileManager.default.temporaryDirectory
  .appendingPathComponent("missing-template.scene")
do {
  try await engine.scene.load(from: missingTemplateURL)
} catch {
  print("Failed to load template:", error.localizedDescription)
}
```

### Network Errors

Template URLs might be unreachable. The thrown error describes the failure — show a message to the user and fall back to a default template or an empty scene.

### Invalid Scene Format

If the file behind the URL is not a valid scene, the load throws. Validate that uploaded or user-provided files are scene files produced by CE.SDK before offering them as templates.

### Missing Assets

For `.scene` files, referenced assets might be unavailable. The scene itself loads, but the affected assets appear missing. Consider using archives to avoid this issue.

## Performance Considerations

### Loading Time

Loading time scales with archive size and the number of embedded assets — a small archive loads almost immediately, while a large archive with many bundled assets takes noticeably longer. Actual times depend on the device, storage speed, and whether the assets are already cached, so show a loading indicator for larger templates.

## API Reference

| Method                              | Description                                                                  |
| ----------------------------------- | ---------------------------------------------------------------------------- |
| `engine.scene.load(from:)`          | Loads a scene or archive from a URL (file kind detected automatically)       |
| `engine.scene.loadArchive(from:)`   | Loads a scene archive from a URL                                             |
| `engine.scene.applyTemplate(from:)` | Applies a template while keeping the current design unit and page dimensions |
| `engine.scene.saveToArchive()`      | Saves the current scene as a self-contained archive                          |
| `engine.scene.get()`                | Returns the current scene block, or `nil` if none is loaded                  |
| `engine.scene.getPages()`           | Returns all page IDs in the scene                                            |

## Next Steps

- [Create From Scratch](../from-scratch.md) — Build reusable design templates programmatically using CE.SDK's APIs
- [Apply a Template](../../use-templates/apply-template.md) — Apply template scenes via API while preserving page dimensions
- [Save](../../export-save-publish/save.md) — Save design progress locally or to a backend service for later editing or publishing



---

## More Resources

- **[iOS Documentation Index](https://img.ly/docs/cesdk/ios/)** - Browse all iOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/ios/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/ios/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
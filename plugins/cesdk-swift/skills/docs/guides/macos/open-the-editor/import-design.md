> This is one page of the CE.SDK macOS documentation. For a complete overview, see the [macOS Documentation Index](https://img.ly/docs/cesdk/macos/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/macos/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Open the Editor](../open-the-editor.md) > [Import a Design](./import-design.md)

---

```swift file=@cesdk_swift_examples/engine-guides-import-design/ImportDesign.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func importDesign(engine: Engine) async throws {
  let baseURL = try engine.guidesBaseURL

  let sceneURL = baseURL.appendingPathComponent("ly.img.templates/templates/cesdk_business_card_1.scene")
  try await engine.scene.load(from: sceneURL)

  // Produce a serialized scene string for the next section. In production it
  // comes from your own storage — a database row, a file on disk, or the result
  // of a previous saveToString() call.
  let sceneString = try await engine.scene.saveToString()

  try await engine.scene.load(from: sceneString)

  // Produce a self-contained archive for the next section by saving the current
  // scene. In production archiveURL points to your own archive — a remote URL on
  // your CDN or a local file URL — created earlier with saveToArchive(). Archives
  // use the .imgly extension now (.zip remains loadable).
  let archiveData = try await engine.scene.saveToArchive()
  let archiveURL = FileManager.default.temporaryDirectory
    .appendingPathComponent("imported-design-\(UUID().uuidString).imgly")
  try archiveData.write(to: archiveURL)

  try await engine.scene.load(from: archiveURL)

  let imageURL = baseURL.appendingPathComponent("ly.img.image/images/sample_4.jpg")
  try await engine.scene.create(fromImage: imageURL)

  let videoURL = baseURL.appendingPathComponent(
    "ly.img.video/videos/pexels-drone-footage-of-a-surfer-barrelling-a-wave-12715991.mp4",
  )
  try await engine.scene.create(fromVideo: videoURL)

  if let text = try engine.block.find(byType: .text).first {
    try engine.block.replaceText(text, text: "Updated heading")
  }
}
```

Open existing designs in CE.SDK: load previously saved scenes from a URL or
string, load self-contained archives that bundle their own assets, and create
editable scenes directly from images and videos.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.81.0-rc.1/engine-guides-import-design)

<EngineReferenceNote {...props} />

CE.SDK supports several ways to open a design beyond starting from a blank canvas. Each `load` or `create` call replaces the active scene, so the imported design becomes the one your app edits and exports.

## Understanding Import Methods

CE.SDK provides three approaches for importing a design, each suited to a different source:

- **Scene files** store the design structure, layout, and properties, referencing assets such as images and fonts by their URLs. They are lightweight but depend on those asset URLs staying reachable.
- **Archives** bundle the scene file together with accessible referenced assets and use relative references. They are larger but self-contained and portable across environments — see the dedicated [Import Design from Archive](./import-design/from-archive.md) guide for the full workflow.
- **Media-based scenes** build an editable design directly from a source image or video.

Scene files and archives both use the `.imgly` extension — `.scene` and `.zip` files also load — and the same `load(from:)` call opens either kind.

## Load Saved CE.SDK Scenes

Load a previously saved scene to resume editing. CE.SDK offers three entry points depending on where the saved scene lives.

### From a URL

Use `load(from:)` with a `URL` to load a scene stored on a server or in cloud storage. This fits cloud-based editing where users open designs from any device.

```swift highlight-importDesign-loadFromURL
let sceneURL = baseURL.appendingPathComponent("ly.img.templates/templates/cesdk_business_card_1.scene")
try await engine.scene.load(from: sceneURL)
```

The engine fetches the scene file asynchronously and replaces the current scene. All asset URLs referenced inside the scene must stay reachable for it to render correctly.

### From a String

Use `load(from:)` with a `String` when you already hold the scene content in memory — for example a value read from a database or a file on disk, or the result of a previous `saveToString()` call. Pass that serialized string to `load(from:)`:

```swift highlight-importDesign-loadFromString
try await engine.scene.load(from: sceneString)
```

### From an Archive

An archive bundles the scene with all of its assets, so it loads even when the original asset URLs are no longer reachable. Pass the archive's location — a remote archive on your CDN or a local file URL, created earlier with `saveToArchive()` — to the same `load(from:)` call; the engine detects the file kind automatically:

```swift highlight-importDesign-loadFromArchive
try await engine.scene.load(from: archiveURL)
```

## Create Scenes from Media

Build an editable scene directly from a source image or video instead of loading a saved design.

### From an Image

Use `create(fromImage:)` to build a single-page design scene around an image. Pass `dpi:` (default `300`) to control how the image's pixels map to the scene's design units.

```swift highlight-importDesign-createFromImage
let imageURL = baseURL.appendingPathComponent("ly.img.image/images/sample_4.jpg")
try await engine.scene.create(fromImage: imageURL)
```

The scene is ready for editing — add text, shapes, and effects on top of the image.

### From a Video

Use `create(fromVideo:)` to build a video scene with the video as the page content, set up for timeline-based editing.

```swift highlight-importDesign-createFromVideo
let videoURL = baseURL.appendingPathComponent(
  "ly.img.video/videos/pexels-drone-footage-of-a-surfer-barrelling-a-wave-12715991.mp4",
)
try await engine.scene.create(fromVideo: videoURL)
```

## Choosing the Right Import Method

Pick the method that matches your source and constraints:

- **Resuming saved work?** Use `load(from:)` with the URL or string of a scene you previously saved.
- **Assets might be unavailable?** Use `load(from:)` with an archive for a self-contained scene with bundled assets.
- **Starting from media?** Use `create(fromImage:)` or `create(fromVideo:)` to build an editable scene from a source file.
- **Need portability?** Save and load archives that bundle everything together.
- **Want lightweight saves?** Use scene files when assets stay reachable at their URLs.

## Asset Availability Considerations

When you load a scene file rather than an archive, the referenced assets must stay reachable at their original URLs. Scene files store those references as URLs, so an image saved at `https://example.com/image.jpg` must still be served there when the scene loads.

Archives avoid this by bundling assets inside the archive file and using relative references, which makes them portable across environments. See [Import Design from Archive](./import-design/from-archive.md) for the full archive workflow.

## Working with Loaded Scenes

After importing, the design becomes the active scene. Query and modify it immediately with the block APIs — for example, if it contains a text block, replace that block's content:

```swift highlight-importDesign-modifyScene
if let text = try engine.block.find(byType: .text).first {
  try engine.block.replaceText(text, text: "Updated heading")
}
```

## Troubleshooting

**Scene loads with missing images or fonts**

- Confirm every asset URL referenced in the scene is still reachable.
- Use an archive instead of a scene file when assets might move or become unavailable.

**Archive fails to load**

- Ensure the archive was created with `saveToArchive()` and the file isn't corrupted.
- Confirm the archive URL is reachable and the file isn't truncated.

**Image or video fails to load**

- Confirm the media URL is reachable and returns the file.
- Confirm the media is in a supported image or video format.

## API Reference

| Method | Description |
| --- | --- |
| `engine.scene.load(from url: URL)` | Load a scene or archive from a remote or local URL (file kind detected automatically) |
| `engine.scene.load(from string: String)` | Load a scene from serialized scene content |
| `engine.scene.loadArchive(from url: URL)` | Load a scene archive from a URL |
| `engine.scene.saveToString()` | Serialize the active scene to a string for later loading |
| `engine.scene.saveToArchive()` | Save the active scene and its assets as an archive (persist it with the `.imgly` extension) |
| `engine.scene.create(fromImage url: URL, dpi:)` | Create an editable design scene from an image |
| `engine.scene.create(fromVideo url: URL)` | Create a video scene from a video |
| `engine.block.find(byType:)` | Find all blocks of a `DesignBlockType` in the active scene |
| `engine.block.replaceText(_:text:)` | Replace the text content of a text block |

## Next Steps

- [Import Design from Archive](./import-design/from-archive.md) — Work with self-contained `.imgly` archives that bundle every referenced asset.
- [Save Scenes](../export-save-publish/save.md) — Persist your edited design as a scene file or an archive.
- [Export Overview](../export-save-publish/export/overview.md) — Export the imported design to PNG, PDF, and other formats.



---

## Related Pages

- [From InDesign](./import-design/from-indesign.md) - Load Adobe InDesign (IDML) designs into CE.SDK by converting them to a scene archive on a server and importing the archive with the engine.
- [From Photoshop](./import-design/from-photoshop.md) - Load Adobe Photoshop (PSD) designs into CE.SDK by converting them to a scene archive on a server and importing the archive with the engine.
- [Import Design from Archive](./import-design/from-archive.md) - Load self-contained CE.SDK archive files that bundle scene structure with all referenced assets for portable, reliable design imports.


---

## More Resources

- **[macOS Documentation Index](https://img.ly/docs/cesdk/macos/)** - Browse all macOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/macos/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/macos/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
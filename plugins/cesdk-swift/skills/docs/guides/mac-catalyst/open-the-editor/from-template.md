> This is one page of the CE.SDK Mac Catalyst documentation. For a complete overview, see the [Mac Catalyst Documentation Index](https://img.ly/docs/cesdk/mac-catalyst/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/mac-catalyst/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Open the Editor](../open-the-editor.md) > [Create From Template](./from-template.md)

---

```swift file=@cesdk_swift_examples/engine-guides-from-template/FromTemplate.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func fromTemplate(engine: Engine) async throws {
  let baseURL = try engine.guidesBaseURL
  let templateURL = baseURL.appendingPathComponent("ly.img.templates/templates/cesdk_business_card_1.scene")

  try await engine.scene.load(from: templateURL)

  let templateString = try await engine.scene.saveToString()
  try await engine.scene.load(from: templateString)

  try await engine.scene.applyTemplate(from: templateURL)

  if let firstTextBlock = try engine.block.find(byType: .text).first {
    try engine.block.replaceText(firstTextBlock, text: "Your Company")
  }
}
```

Load pre-designed templates to give users a professional starting point instead of a blank canvas.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.82.0-nightly.20260821/engine-guides-from-template)

<EngineReferenceNote {...props} />

Templates provide consistent layouts and styling that users can customize for their own needs. CE.SDK loads templates from remote or local scene URLs, from serialized strings, and applies template content to an existing scene while preserving its page dimensions.

## Load a Template from URL

The most common approach is loading a template from a `.scene` file URL. Point `load(from:)` at the URL of your template, and the engine replaces the current scene with the loaded template.

```swift highlight-fromTemplate-loadFromURL
try await engine.scene.load(from: templateURL)
```

The scene file references its assets by URL, so those assets must stay reachable at their original locations. For a fully self-contained template, use an archive instead — see [Load a Scene](./load-scene.md).

## Load a Template from String

When a template is stored as a serialized string — in a database or local storage — load it with the same `load(from:)` method. The string is the scene content produced by `engine.scene.saveToString()`.

```swift highlight-fromTemplate-loadFromString
let templateString = try await engine.scene.saveToString()
try await engine.scene.load(from: templateString)
```

This is useful for restoring saved user designs or serving templates from your backend.

## Apply a Template to an Existing Scene

To populate an existing scene with template content while keeping its current page dimensions, use `applyTemplate(from:)`. The template's content is automatically adjusted to fit the existing page size and design unit.

```swift highlight-fromTemplate-applyTemplate
try await engine.scene.applyTemplate(from: templateURL)
```

Use this when the canvas size is already set — for a fixed output format, for example — and you want to drop in template content without changing those dimensions.

## Modify Template Content

After loading a template, customize its content with the block APIs. Find the elements you want to change and update them.

```swift highlight-fromTemplate-modifyContent
if let firstTextBlock = try engine.block.find(byType: .text).first {
  try engine.block.replaceText(firstTextBlock, text: "Your Company")
}
```

Common modifications include:

- **Replacing text**: `engine.block.replaceText(_:text:)` swaps the content of a text block.
- **Swapping images**: set `fill/image/imageFileURI` on a graphic block's image fill — see [Image Fills](../fills/image.md).
- **Adjusting colors**: set `fill/color/value` on a block's fill — see [Color Fills](../fills/color.md).

## Troubleshooting

**Template fails to load**

- Verify the URL is reachable and returns a valid `.scene` file.
- Ensure the template format is compatible with your CE.SDK version.

**Assets not displaying after load**

- Scene files store asset references as URLs; ensure those URLs remain reachable.
- Use an archive (`.zip`) for a self-contained template with bundled assets.
- Configure a [URI resolver](./uri-resolver.md) if assets are hosted on a different server.

## API Reference

### Methods

| Method | Description |
| --- | --- |
| `engine.scene.load(from: URL)` | Load a scene from a remote or local URL |
| `engine.scene.load(from: String)` | Load a scene from a serialized string |
| `engine.scene.applyTemplate(from: URL)` | Apply a template to the current scene from a URL |
| `engine.scene.applyTemplate(from: String)` | Apply a template to the current scene from a string |
| `engine.scene.saveToString()` | Serialize the current scene to a string |
| `engine.block.find(byType:)` | Find all blocks of a given type |
| `engine.block.replaceText(_:text:)` | Replace the text content of a text block |

## Next Steps

- [Load a Scene](./load-scene.md) — Load saved scenes from various sources
- [Save a Design](../export-save-publish/save.md) — Save your customized template
- [Import a Design](./import-design.md) — Load previously saved scenes, self-contained archives, or create editable scenes from images and videos.



---

## More Resources

- **[Mac Catalyst Documentation Index](https://img.ly/docs/cesdk/mac-catalyst/)** - Browse all Mac Catalyst documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/mac-catalyst/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/mac-catalyst/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
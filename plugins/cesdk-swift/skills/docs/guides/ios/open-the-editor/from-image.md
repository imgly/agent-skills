> This is one page of the CE.SDK iOS documentation. For a complete overview, see the [iOS Documentation Index](https://img.ly/docs/cesdk/ios/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/ios/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Open the Editor](../open-the-editor.md) > [Create From Image](./from-image.md)

---

```swift file=@cesdk_swift_examples/engine-guides-create-scene-from-image-url/CreateSceneFromImageURL.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func createSceneFromImageURL(engine: Engine) async throws {
  let baseURL = try engine.guidesBaseURL
  let imageURL = baseURL.appendingPathComponent("ly.img.image/images/sample_4.jpg")

  try await engine.scene.create(fromImage: imageURL)

  guard let page = try engine.block.find(byType: .page).first else { return }

  let pageFill = try engine.block.getFill(page)
  let isImageFill = try engine.block.getType(pageFill) == FillType.image.rawValue
  print("Page is filled with an image: \(isImageFill)")

  // The image loaded as the page's content — captured as the guide's hero.
  try await engine.captureGuide(page, label: "hero")
}
```

```swift file=@cesdk_swift_examples/engine-guides-create-scene-from-image-blob/CreateSceneFromImageBlob.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func createSceneFromImageBlob(engine: Engine) async throws {
  let baseURL = try engine.guidesBaseURL

  let imageURL = baseURL.appendingPathComponent("ly.img.image/images/sample_4.jpg")
  let blob = try await URLSession.shared.data(from: imageURL).0

  let url = FileManager.default.temporaryDirectory
    .appendingPathComponent(UUID().uuidString)
    .appendingPathExtension("jpg")
  try blob.write(to: url, options: .atomic)

  try await engine.scene.create(fromImage: url)
}
```

Create an editable scene from an image with the Swift Engine API. The engine
builds a single-page scene sized to the image and configured in pixel design
units, ready for immediate editing.

![A photograph loaded as an editable scene, its page sized to and filled by the source image.](https://img.ly/docs/cesdk/ios/open-the-editor/from-image-ad9b5e/assets/swift-based.hero.webp)

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.83.0-nightly.20260901/engine-guides-create-scene-from-image-url)

<EngineReferenceNote {...props} />

`engine.scene.create(fromImage:)` fetches the image, creates a scene whose page matches the image's dimensions, and adds the image directly as the page's fill. This is the starting point for image-editing workflows where users enhance, annotate, or transform an existing image.

## Create a Scene from an Image URL

Pass the image source to `create(fromImage:)`. The source is a `URL` — either a local file or a remote address.

```swift highlight-createFromImage-url
try await engine.scene.create(fromImage: imageURL)
```

The scene's page dimensions match the image, and the scene is configured in pixel design units.

### Inspect the Page Fill

The image becomes the page's fill rather than a separate image block. Locate the page with `find(byType:)` to reach that fill:

```swift highlight-findByType-url
guard let page = try engine.block.find(byType: .page).first else { return }
```

Read the page's fill and confirm it is an image fill by comparing its type against `FillType.image`:

```swift highlight-check-fill-url
let pageFill = try engine.block.getFill(page)
let isImageFill = try engine.block.getType(pageFill) == FillType.image.rawValue
print("Page is filled with an image: \(isImageFill)")
```

## Create a Scene from a Blob

When the image arrives as raw `Data` — from a file picker, a network response, or any other source — write it to a temporary file and create the scene from that file's URL.

First, get the image data. This example fetches it to stand in for data your app already holds.

```swift highlight-blob-swift
let imageURL = baseURL.appendingPathComponent("ly.img.image/images/sample_4.jpg")
let blob = try await URLSession.shared.data(from: imageURL).0
```

Write the data to a temporary file and keep its URL.

```swift highlight-objectURL-swift
let url = FileManager.default.temporaryDirectory
  .appendingPathComponent(UUID().uuidString)
  .appendingPathExtension("jpg")
try blob.write(to: url, options: .atomic)
```

Use that URL as the source for the scene.

```swift highlight-initialImageURL-swift
try await engine.scene.create(fromImage: url)
```

As with a remote URL, the page dimensions match the image and the scene uses pixel design units.

## Configure Scene Parameters

`create(fromImage:dpi:pixelScaleFactor:sceneLayout:)` accepts optional parameters that control how the image maps to scene dimensions and how pages are arranged.

| Parameter | Default | Description |
| --- | --- | --- |
| `dpi` | `300` | Dots per inch of the scene, which sets the relationship between pixel and physical dimensions. |
| `pixelScaleFactor` | `1` | The display's pixel scale factor, used to account for high-resolution screens. |
| `sceneLayout` | `.free` | Page arrangement: `.free`, `.horizontalStack`, `.verticalStack`, or `.depthStack`. |

To later save your scene, see [Saving Scenes](../export-save-publish/save.md).

## API Reference

### Methods

| Method | Description |
| --- | --- |
| `engine.scene.create(fromImage:dpi:pixelScaleFactor:sceneLayout:)` | Create a scene whose single page is sized to the image and filled with it |
| `engine.block.find(byType:)` | Find all blocks of a `DesignBlockType`, such as the page |
| `engine.block.getFill(_:)` | Get the fill block attached to a block |
| `engine.block.getType(_:)` | Read a block's type string, including the fill type |

## Next Steps

- [Saving Scenes](../export-save-publish/save.md) — Persist the edited scene to a string or an archive.
- [Load Scene](./load-scene.md) — Open the editor from a previously saved scene file.
- [Create From Video](./from-video.md) — Start the editor from a video instead of an image.
- [Blank Canvas](./blank-canvas.md) — Launch the editor with an empty canvas.



---

## More Resources

- **[iOS Documentation Index](https://img.ly/docs/cesdk/ios/)** - Browse all iOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/ios/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/ios/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
> This is one page of the CE.SDK Mac Catalyst documentation. For a complete overview, see the [Mac Catalyst Documentation Index](https://img.ly/docs/cesdk/mac-catalyst/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/mac-catalyst/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Open the Editor](../open-the-editor.md) > [Create From Video](./from-video.md)

---

```swift file=@cesdk_swift_examples/engine-guides-create-scene-from-video-url/CreateSceneFromVideoURL.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func createSceneFromVideoURL(engine: Engine) async throws {
  let baseURL = try engine.guidesBaseURL
  let videoURL = baseURL.appendingPathComponent(
    "ly.img.video/videos/pexels-drone-footage-of-a-surfer-barrelling-a-wave-12715991.mp4",
  )

  try await engine.scene.create(fromVideo: videoURL)

  guard let block = try engine.block.find(byType: .graphic).first else { return }
  try engine.block.setOpacity(block, value: 0.5)
}
```

Open CE.SDK with a video as the starting point for editing. The scene's page
dimensions match the video resolution and the scene is set up for time-based
content.

> **Reading time:** 3 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.82.0-nightly.20260823/engine-guides-create-scene-from-video-url)

<EngineReferenceNote {...props} />

Starting from an existing video lets you build editors for customizing video content — trimmers, overlay editors, or upload-and-edit flows. Create a scene from a single video with `engine.scene.create(fromVideo:)`.

This guide covers creating a scene from a video and reaching the video block to adjust its properties.

## Create a Scene From a Video URL

Pass a video URL to `engine.scene.create(fromVideo:)`. The URL can point to a local file or a remote resource. The call loads the video and returns a handle to the new scene.

```swift highlight-createSceneFromVideoURL-createFromVideo
try await engine.scene.create(fromVideo: videoURL)
```

When you start from a video, the scene's page dimensions match the resource, the scene uses pixel design units, and it is set up for time-based editing.

## Work With the Video Block

CE.SDK places the video inside a graphic block that carries a video fill. Retrieve it with `engine.block.find(byType:)`, which returns every block of a given `DesignBlockType`. A scene created from a video contains a single graphic block, so the first result is the video block. From there, modify the block like any other element — for example, change its opacity with `engine.block.setOpacity(_:value:)`.

```swift highlight-createSceneFromVideoURL-workWithBlock
guard let block = try engine.block.find(byType: .graphic).first else { return }
try engine.block.setOpacity(block, value: 0.5)
```

See [Blocks](../concepts/blocks.md) for the full Block API.

## API Reference

### Methods

| Method | Description |
| --- | --- |
| `engine.scene.create(fromVideo:)` | Create a scene from a video URL, matching the scene dimensions to the video |
| `engine.block.find(byType:)` | Find all blocks of a `DesignBlockType` |
| `engine.block.setOpacity(_:value:)` | Set a block's opacity |

## Next Steps

- [Blocks](../concepts/blocks.md) — Edit blocks, layout, and properties in the scene
- [Saving Scenes](../export-save-publish/save.md) — Persist your scene and reload it later
- [Insert Videos](../insert-media/videos.md) — Add and configure additional video blocks programmatically
- [Control Audio and Video](../create-video/control.md) — Trim, seek, and control video and audio playback



---

## More Resources

- **[Mac Catalyst Documentation Index](https://img.ly/docs/cesdk/mac-catalyst/)** - Browse all Mac Catalyst documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/mac-catalyst/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/mac-catalyst/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
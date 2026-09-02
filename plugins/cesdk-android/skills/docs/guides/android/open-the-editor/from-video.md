> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Open the Editor](../open-the-editor.md) > [Create From Video](./from-video.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-create-scene-from-video-url/CreateSceneFromVideoURL.kt reference-only
import android.net.Uri
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import ly.img.engine.DesignBlock
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine

private const val SAMPLE_VIDEO_URI = "https://img.ly/static/ubq_video_samples/bbb.mp4"

suspend fun createSceneFromVideoURL(engine: Engine): DesignBlock = withContext(Dispatchers.Main) {
    val videoRemoteUri = Uri.parse(SAMPLE_VIDEO_URI)
    val scene = engine.scene.createFromVideo(videoUri = videoRemoteUri)

    // Find the automatically added graphic block in the scene that contains the video fill.
    val block = engine.block.findByType(type = DesignBlockType.Graphic).first()
    engine.block.setOpacity(block = block, value = 0.5F)

    val page = engine.scene.getPages().first()

    val duration = engine.block.getDuration(block = page)

    if (engine.block.supportsPlaybackTime(block = page) && duration >= 1.0) {
        engine.block.setPlaybackTime(block = page, time = 1.0)
        engine.block.setPlaying(block = page, enabled = true)
        engine.block.setPlaying(block = page, enabled = false)
    }

    scene
}
```

Open CE.SDK with a video as the starting point for editing. The scene's page
dimensions match the video resolution and the scene is set up for time-based
content.

> **Reading time:** 3 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.83.0-nightly.20260902/engine-guides-create-scene-from-video-url)

<EngineReferenceNote {...props} />

Starting from an existing video lets you build editors for customizing video
content — trimmers, overlay editors, or upload-and-edit flows. Create a scene
from a single video with `engine.scene.createFromVideo()`.

This guide covers creating a scene from a video and reaching the video block to
adjust its properties.

## Create a Scene From a Video URL

Pass a video `Uri` to `engine.scene.createFromVideo()`. The URI can point to a
local file, a content URI, or a remote resource that your Android app can
access. The call loads the video and returns a handle to the new scene.

```kotlin highlight-android-create-from-video
val videoRemoteUri = Uri.parse(SAMPLE_VIDEO_URI)
val scene = engine.scene.createFromVideo(videoUri = videoRemoteUri)
```

When you start from a video, the scene's page dimensions match the resource,
the scene uses pixel design units, and it is set up for time-based editing.

## Work With the Video Block

CE.SDK places the video inside a graphic block that carries a video fill.
Retrieve it with `engine.block.findByType(DesignBlockType.Graphic)`, which
returns every graphic block in the scene. A scene created from a single video
contains one graphic block, so the first result is the video block. From there,
modify the block like any other element — for example, change its opacity with
`engine.block.setOpacity()`.

```kotlin highlight-android-work-with-video-block
// Find the automatically added graphic block in the scene that contains the video fill.
val block = engine.block.findByType(type = DesignBlockType.Graphic).first()
engine.block.setOpacity(block = block, value = 0.5F)
```

See [Blocks](../concepts/blocks.md) for the full Block API. The page also
exposes playback state, so editor UIs can connect the same scene to trimming,
seeking, and playback controls in the dedicated video guides.

## API Reference

### Methods

| Method | Description |
| --- | --- |
| `engine.scene.createFromVideo(videoUri=_)` | Create a scene from a video URI, matching the scene dimensions to the video |
| `engine.block.findByType(type=_)` | Find all blocks of a `DesignBlockType` |
| `engine.block.setOpacity(block=_, value=_)` | Set a block's opacity |

## Next Steps

- [Blocks](../concepts/blocks.md) — Edit blocks, layout, and properties in the scene
- [Saving Scenes](../export-save-publish/save.md) — Persist your scene and reload it later
- [Insert Videos](../insert-media/videos.md) — Add and configure additional video blocks programmatically
- [Control Audio and Video](../create-video/control.md) — Trim, seek, and control video and audio playback



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
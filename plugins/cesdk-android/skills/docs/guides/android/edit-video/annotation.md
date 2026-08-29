> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Create and Edit Videos](../create-video.md) > [Annotation](./annotation.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-annotation/Annotation.kt reference-only
import android.net.Uri
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.isActive
import kotlinx.coroutines.launch
import ly.img.engine.Color
import ly.img.engine.DesignBlock
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.FillType
import ly.img.engine.ShapeType
import ly.img.engine.SizeMode

fun annotation(engine: Engine) {
    val page = createAnnotationScene(engine)
    val text = addTextAnnotation(engine = engine, page = page)
    val highlight = addShapeAnnotation(engine = engine, page = page)
    val annotations = listOf(text, highlight)

    val sync = TimelineSync(engine = engine, page = page)
    sync.refresh(annotations)
    seekToAnnotation(engine = engine, page = page, annotation = highlight)

    setAnnotationPlayback(engine = engine, page = page, playing = true, looping = true)
    updateAnnotationText(engine = engine, annotation = text, text = "Replay this part")
    moveAnnotation(engine = engine, annotation = highlight, x = 780F, y = 260F)
    updateAnnotationTiming(engine = engine, annotation = highlight, start = 13.0, duration = 3.0)
    removeAnnotation(engine = engine, annotation = text)
}

fun createAnnotationScene(engine: Engine): DesignBlock {
    val scene = engine.scene.createForVideo()
    val page = engine.block.create(DesignBlockType.Page)
    engine.block.appendChild(parent = scene, child = page)
    engine.block.setWidth(page, value = 1280F)
    engine.block.setHeight(page, value = 720F)
    engine.block.setDuration(page, duration = 20.0)

    val video = engine.block.create(DesignBlockType.Graphic)
    engine.block.setShape(video, shape = engine.block.createShape(ShapeType.Rect))
    val videoFill = engine.block.createFill(FillType.Video)
    val videoUri = Uri.parse(
        "https://cdn.img.ly/assets/demo/v1/ly.img.video/videos/pexels-drone-footage-of-a-surfer-barrelling-a-wave-12715991.mp4",
    )
    // Video fills expose a URI-valued file property; set it with the typed URI API.
    engine.block.setUri(
        block = videoFill,
        property = "fill/video/fileURI",
        value = videoUri,
    )
    engine.block.setFill(video, fill = videoFill)

    val videoTrack = engine.block.create(DesignBlockType.Track)
    engine.block.appendChild(parent = page, child = videoTrack)
    engine.block.appendChild(parent = videoTrack, child = video)
    engine.block.fillParent(videoTrack)

    return page
}

fun addTextAnnotation(
    engine: Engine,
    page: DesignBlock,
): DesignBlock {
    val text = engine.block.create(DesignBlockType.Text)
    engine.block.replaceText(text, text = "Watch this part!")
    engine.block.setTextFontSize(text, fontSize = 32F)
    engine.block.setWidthMode(text, mode = SizeMode.AUTO)
    engine.block.setHeightMode(text, mode = SizeMode.AUTO)
    engine.block.setPositionX(text, value = 160F)
    engine.block.setPositionY(text, value = 560F)
    engine.block.setTimeOffset(text, offset = 5.0)
    engine.block.setDuration(text, duration = 5.0)

    engine.block.appendChild(parent = page, child = text)
    return text
}

fun addShapeAnnotation(
    engine: Engine,
    page: DesignBlock,
): DesignBlock {
    val highlight = engine.block.create(DesignBlockType.Graphic)
    engine.block.setShape(highlight, shape = engine.block.createShape(ShapeType.Star))
    engine.block.setWidth(highlight, value = 140F)
    engine.block.setHeight(highlight, value = 140F)
    engine.block.setPositionX(highlight, value = 700F)
    engine.block.setPositionY(highlight, value = 240F)

    val fill = engine.block.createFill(FillType.Color)
    engine.block.setFill(highlight, fill = fill)
    engine.block.setFillSolidColor(
        block = highlight,
        color = Color.fromRGBA(r = 1F, g = 0F, b = 0F, a = 1F),
    )
    engine.block.setTimeOffset(highlight, offset = 12.0)
    engine.block.setDuration(highlight, duration = 4.0)

    engine.block.appendChild(parent = page, child = highlight)
    return highlight
}

data class AnnotationTimelineState(
    val currentTime: Double,
    val activeAnnotation: DesignBlock?,
)

class TimelineSync(
    private val engine: Engine,
    private val page: DesignBlock,
) {
    private val mutableState = MutableStateFlow(
        AnnotationTimelineState(
            currentTime = 0.0,
            activeAnnotation = null,
        ),
    )
    val state: StateFlow<AnnotationTimelineState> = mutableState.asStateFlow()
    private var pollingJob: Job? = null

    // Call this from UI code that owns a lifecycle scope.
    fun start(
        annotations: List<DesignBlock>,
        scope: CoroutineScope,
    ) {
        pollingJob?.cancel()
        pollingJob = scope.launch(Dispatchers.Main.immediate) {
            while (isActive) {
                refresh(annotations)
                delay(200)
            }
        }
    }

    fun refresh(annotations: List<DesignBlock>) {
        val currentTime = engine.block.getPlaybackTime(page)
        val active = annotations.firstOrNull { annotation ->
            engine.block.isValid(annotation) &&
                engine.block.isVisibleAtCurrentPlaybackTime(annotation)
        }
        mutableState.value = AnnotationTimelineState(
            currentTime = currentTime,
            activeAnnotation = active,
        )
    }

    fun stop() {
        pollingJob?.cancel()
        pollingJob = null
    }
}

fun seekToAnnotation(
    engine: Engine,
    page: DesignBlock,
    annotation: DesignBlock,
) {
    if (!engine.block.supportsPlaybackTime(page)) return

    val start = engine.block.getTimeOffset(annotation)
    engine.block.setPlaybackTime(block = page, time = start)
}

fun updateAnnotationText(
    engine: Engine,
    annotation: DesignBlock,
    text: String,
) {
    engine.block.replaceText(annotation, text = text)
}

fun moveAnnotation(
    engine: Engine,
    annotation: DesignBlock,
    x: Float,
    y: Float,
) {
    engine.block.setPositionX(annotation, value = x)
    engine.block.setPositionY(annotation, value = y)
}

fun updateAnnotationTiming(
    engine: Engine,
    annotation: DesignBlock,
    start: Double,
    duration: Double,
) {
    engine.block.setTimeOffset(annotation, offset = start)
    engine.block.setDuration(annotation, duration = duration)
}

fun removeAnnotation(
    engine: Engine,
    annotation: DesignBlock,
) {
    engine.block.destroy(annotation)
}

fun setAnnotationPlayback(
    engine: Engine,
    page: DesignBlock,
    playing: Boolean,
    looping: Boolean,
): Pair<Boolean, Boolean> {
    engine.block.setPlaying(block = page, enabled = playing)
    val isPlaying = engine.block.isPlaying(page)

    engine.block.setLooping(block = page, looping = looping)
    val isLooping = engine.block.isLooping(page)

    return isPlaying to isLooping
}
```

Annotations are timed visual overlays such as text labels, shapes, highlights, stickers, or images. On Android, they are ordinary blocks placed above video content and made visible for a specific timeline range.

> **Reading time:** 6 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.83.0-nightly.20260829/engine-guides-annotation)

<EngineReferenceNote {...props} />

## When to Use Annotations

Use annotations for tutorials, sports analysis, education, product demos, and other video workflows where viewers should notice a specific moment. Use captions instead when the content is synchronized spoken text.

Annotations use the same Block API as other visual content. Timing is controlled in seconds with `setTimeOffset` and `setDuration`, and playback sync reads the page's current playback time.

## Annotation Blocks and Timeline Placement

For a standalone video scene, create a video page with explicit dimensions and duration, add the media to a track, and append annotation blocks to the page after the media. Page children added later render above earlier content.

```kotlin highlight-android-timeline-placement
fun createAnnotationScene(engine: Engine): DesignBlock {
    val scene = engine.scene.createForVideo()
    val page = engine.block.create(DesignBlockType.Page)
    engine.block.appendChild(parent = scene, child = page)
    engine.block.setWidth(page, value = 1280F)
    engine.block.setHeight(page, value = 720F)
    engine.block.setDuration(page, duration = 20.0)

    val video = engine.block.create(DesignBlockType.Graphic)
    engine.block.setShape(video, shape = engine.block.createShape(ShapeType.Rect))
    val videoFill = engine.block.createFill(FillType.Video)
    val videoUri = Uri.parse(
        "https://cdn.img.ly/assets/demo/v1/ly.img.video/videos/pexels-drone-footage-of-a-surfer-barrelling-a-wave-12715991.mp4",
    )
    // Video fills expose a URI-valued file property; set it with the typed URI API.
    engine.block.setUri(
        block = videoFill,
        property = "fill/video/fileURI",
        value = videoUri,
    )
    engine.block.setFill(video, fill = videoFill)

    val videoTrack = engine.block.create(DesignBlockType.Track)
    engine.block.appendChild(parent = page, child = videoTrack)
    engine.block.appendChild(parent = videoTrack, child = video)
    engine.block.fillParent(videoTrack)

    return page
}
```

## Add a Text Annotation

A text annotation is a `DesignBlockType.Text` block. Position it like any other text block, then set the timeline range before appending it to the page.

```kotlin highlight-android-text-annotation
fun addTextAnnotation(
    engine: Engine,
    page: DesignBlock,
): DesignBlock {
    val text = engine.block.create(DesignBlockType.Text)
    engine.block.replaceText(text, text = "Watch this part!")
    engine.block.setTextFontSize(text, fontSize = 32F)
    engine.block.setWidthMode(text, mode = SizeMode.AUTO)
    engine.block.setHeightMode(text, mode = SizeMode.AUTO)
    engine.block.setPositionX(text, value = 160F)
    engine.block.setPositionY(text, value = 560F)
    engine.block.setTimeOffset(text, offset = 5.0)
    engine.block.setDuration(text, duration = 5.0)

    engine.block.appendChild(parent = page, child = text)
    return text
}
```

The example starts at `5.0` seconds and lasts `5.0` seconds, so it is visible from 5s to 10s on the page timeline.

## Add a Shape Annotation

A shape annotation uses a graphic block with a vector shape and fill. This example creates a red star that appears after the text annotation.

```kotlin highlight-android-shape-annotation
fun addShapeAnnotation(
    engine: Engine,
    page: DesignBlock,
): DesignBlock {
    val highlight = engine.block.create(DesignBlockType.Graphic)
    engine.block.setShape(highlight, shape = engine.block.createShape(ShapeType.Star))
    engine.block.setWidth(highlight, value = 140F)
    engine.block.setHeight(highlight, value = 140F)
    engine.block.setPositionX(highlight, value = 700F)
    engine.block.setPositionY(highlight, value = 240F)

    val fill = engine.block.createFill(FillType.Color)
    engine.block.setFill(highlight, fill = fill)
    engine.block.setFillSolidColor(
        block = highlight,
        color = Color.fromRGBA(r = 1F, g = 0F, b = 0F, a = 1F),
    )
    engine.block.setTimeOffset(highlight, offset = 12.0)
    engine.block.setDuration(highlight, duration = 4.0)

    engine.block.appendChild(parent = page, child = highlight)
    return highlight
}
```

Any visual block can serve as an annotation. Use text for labels, graphics for highlights, and image or sticker blocks for branded markers.

## Synchronize Annotation UI with Playback

Custom UI can poll the page playback time and mark whichever annotation is visible at that moment. Keep the polling interval modest, for example 100-200 ms, so the UI stays responsive.

```kotlin highlight-android-playback-sync
data class AnnotationTimelineState(
    val currentTime: Double,
    val activeAnnotation: DesignBlock?,
)

class TimelineSync(
    private val engine: Engine,
    private val page: DesignBlock,
) {
    private val mutableState = MutableStateFlow(
        AnnotationTimelineState(
            currentTime = 0.0,
            activeAnnotation = null,
        ),
    )
    val state: StateFlow<AnnotationTimelineState> = mutableState.asStateFlow()
    private var pollingJob: Job? = null

    // Call this from UI code that owns a lifecycle scope.
    fun start(
        annotations: List<DesignBlock>,
        scope: CoroutineScope,
    ) {
        pollingJob?.cancel()
        pollingJob = scope.launch(Dispatchers.Main.immediate) {
            while (isActive) {
                refresh(annotations)
                delay(200)
            }
        }
    }

    fun refresh(annotations: List<DesignBlock>) {
        val currentTime = engine.block.getPlaybackTime(page)
        val active = annotations.firstOrNull { annotation ->
            engine.block.isValid(annotation) &&
                engine.block.isVisibleAtCurrentPlaybackTime(annotation)
        }
        mutableState.value = AnnotationTimelineState(
            currentTime = currentTime,
            activeAnnotation = active,
        )
    }

    fun stop() {
        pollingJob?.cancel()
        pollingJob = null
    }
}
```

> **Note:** * Engine calls must stay on the main thread.
> * Store the active annotation ID in UI state and render your own list, marker, or toolbar state from that value.

## Seek to an Annotation

Seek on the page, not on the annotation block itself. Read the annotation start with `getTimeOffset`, then set the page playback time.

```kotlin highlight-android-seek-to-annotation
fun seekToAnnotation(
    engine: Engine,
    page: DesignBlock,
    annotation: DesignBlock,
) {
    if (!engine.block.supportsPlaybackTime(page)) return

    val start = engine.block.getTimeOffset(annotation)
    engine.block.setPlaybackTime(block = page, time = start)
}
```

## Controlling Playback (Play/Pause, Loop)

Use page playback controls as supporting APIs for preview UI. For broader audio and video playback controls, see [Control Audio and Video](../create-video/control.md).

```kotlin highlight-android-playback-controls
fun setAnnotationPlayback(
    engine: Engine,
    page: DesignBlock,
    playing: Boolean,
    looping: Boolean,
): Pair<Boolean, Boolean> {
    engine.block.setPlaying(block = page, enabled = playing)
    val isPlaying = engine.block.isPlaying(page)

    engine.block.setLooping(block = page, looping = looping)
    val isLooping = engine.block.isLooping(page)

    return isPlaying to isLooping
}
```

## Edit & Remove Annotations

Text, position, timing, and deletion use the same block APIs after an annotation exists. Keep these operations focused so your UI can call them from list actions or inspector controls.

```kotlin highlight-android-edit-annotation
fun updateAnnotationText(
    engine: Engine,
    annotation: DesignBlock,
    text: String,
) {
    engine.block.replaceText(annotation, text = text)
}
```

```kotlin highlight-android-move-annotation
fun moveAnnotation(
    engine: Engine,
    annotation: DesignBlock,
    x: Float,
    y: Float,
) {
    engine.block.setPositionX(annotation, value = x)
    engine.block.setPositionY(annotation, value = y)
}
```

```kotlin highlight-android-retime-annotation
fun updateAnnotationTiming(
    engine: Engine,
    annotation: DesignBlock,
    start: Double,
    duration: Double,
) {
    engine.block.setTimeOffset(annotation, offset = start)
    engine.block.setDuration(annotation, duration = duration)
}
```

```kotlin highlight-android-remove-annotation
fun removeAnnotation(
    engine: Engine,
    annotation: DesignBlock,
) {
    engine.block.destroy(annotation)
}
```

## API Reference

| API | Purpose |
| --- | --- |
| `engine.scene.createForVideo()` | Create a video scene that supports timeline playback. |
| `engine.block.create(blockType=_)` | Create text, graphic, page, and track blocks. |
| `engine.block.setWidth(block=_, value=_)` / `engine.block.setHeight(block=_, value=_)` | Size pages and visual annotation blocks. |
| `engine.block.setWidthMode(block=_, mode=_)` / `engine.block.setHeightMode(block=_, mode=_)` | Auto-size text annotations to their content. |
| `engine.block.replaceText(block=_, text=_)` | Set or update text annotation content. |
| `engine.block.setTextFontSize(block=_, fontSize=_)` | Set text annotation size. |
| `engine.block.createShape(type=_)` / `engine.block.setShape(block=_, shape=_)` | Create a shape annotation. |
| `engine.block.createFill(fillType=_)` / `engine.block.setFill(block=_, fill=_)` / `engine.block.setFillSolidColor(block=_, color=_)` | Style graphic annotations. |
| `engine.block.setUri(block=_, property="fill/video/fileURI", value=_)` | Attach video media to a video fill. |
| `engine.block.setPositionX(block=_, value=_)` / `engine.block.setPositionY(block=_, value=_)` | Place annotations on the page. |
| `engine.block.setTimeOffset(block=_, offset=_)` / `engine.block.getTimeOffset(block=_)` | Set or read the annotation start time in seconds. |
| `engine.block.setDuration(block=_, duration=_)` / `engine.block.getDuration(block=_)` | Set or read the annotation duration in seconds. |
| `engine.block.appendChild(parent=_, child=_)` | Add annotations to the page hierarchy. |
| `engine.block.fillParent(block=_)` | Make a track fill its parent page. |
| `engine.block.isValid(block=_)` | Ignore annotations that were removed before a UI refresh. |
| `engine.block.supportsPlaybackTime(block=_)` | Check whether a page can be seeked. |
| `engine.block.setPlaybackTime(block=_, time=_)` / `engine.block.getPlaybackTime(block=_)` | Seek or read timeline playback time. |
| `engine.block.isVisibleAtCurrentPlaybackTime(block=_)` | Determine whether an annotation is active at the current page time. |
| `engine.block.setPlaying(block=_, enabled=_)` / `engine.block.isPlaying(block=_)` | Start or query playback. |
| `engine.block.setLooping(block=_, looping=_)` / `engine.block.isLooping(block=_)` | Control loop behavior. |
| `engine.block.destroy(block=_)` | Remove an annotation. |

## Troubleshooting

- **Annotation does not show up:** append it to the page after the media track, and keep its `timeOffset` plus `duration` inside the page duration.
- **Seek jumps do nothing:** call `setPlaybackTime` on the page block, not on the annotation block.
- **UI feels sluggish:** poll at 5-10 Hz and keep engine calls on the main thread.
- **Export differs from preview:** verify the video scene duration and test very small text or heavy effects in exported MP4 output.

## Next Steps

- [Add Captions](./add-captions.md) - Use caption blocks and tracks for synchronized spoken text.
- [Text Variables](../create-templates/add-dynamic-content/text-variables.md) - Populate labels from dynamic values such as usernames or scores.
- [Control Audio and Video](../create-video/control.md) - Control timeline playback, trim ranges, looping, and resources.
- [Timeline Editor](../create-video/timeline-editor.md) - Build timeline interfaces for arranging clips and overlays.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
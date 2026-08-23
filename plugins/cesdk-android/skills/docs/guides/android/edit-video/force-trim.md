> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Create and Edit Videos](../create-video.md) > [Force Trim](./force-trim.md)

---

```kotlin file=@cesdk_android_examples/editor-guides-video-force-trim/ForceTrimVideoSolution.kt reference-only
import androidx.compose.runtime.Composable
import ly.img.editor.Editor
import ly.img.editor.configuration.video.VideoConfigurationBuilder
import ly.img.editor.configuration.video.callback.onLoaded
import ly.img.editor.core.configuration.EditorConfiguration
import ly.img.editor.core.configuration.remember
import ly.img.editor.core.event.EditorEvent
import kotlin.time.Duration.Companion.seconds

// Add this composable to your NavHost
@Composable
fun ForceTrimVideoSolution(
    license: String,
    onClose: (Throwable?) -> Unit,
) {
    Editor(
        license = license, // pass null or empty for evaluation mode with watermark
        configuration = {
            EditorConfiguration.remember(::VideoConfigurationBuilder) {
                onLoaded = {
                    val event = EditorEvent.ApplyVideoDurationConstraints(
                        minDuration = 1.seconds,
                        maxDuration = 5.seconds,
                    )
                    editorContext.eventHandler.send(event)
                    onLoaded()
                }
            }
        },
        onClose = onClose,
    )
}
```

Force trim lets you enforce minimum and maximum video durations in the timeline UI. The editor clamps export to the maximum duration and shows labels to communicate the limits.

> **Reading time:** 2 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.82.0-nightly.20260823/editor-guides-video-force-trim)

## Configure duration constraints

We apply constraints in `EngineConfiguration.onLoaded` after the scene has loaded. Keep `minimumVideoDuration` and `maximumVideoDuration` in seconds and ensure the max is not smaller than the min.

```kotlin highlight-android-constraints
val event = EditorEvent.ApplyVideoDurationConstraints(
    minDuration = 1.seconds,
    maxDuration = 5.seconds,
)
editorContext.eventHandler.send(event)
```

## Launch the video editor

Use the default video scene and the standard video UI. You can call the setter again later to switch presets at runtime.

```kotlin highlight-android-editor
Editor(
    license = license, // pass null or empty for evaluation mode with watermark
    configuration = {
        EditorConfiguration.remember(::VideoConfigurationBuilder) {
            onLoaded = {
                val event = EditorEvent.ApplyVideoDurationConstraints(
                    minDuration = 1.seconds,
                    maxDuration = 5.seconds,
                )
                editorContext.eventHandler.send(event)
                onLoaded()
            }
        }
    },
    onClose = onClose,
)
```

![Force Trim constraints in the timeline](https://img.ly/docs/cesdk/android/edit-video/force-trim-3c1e8a/assets/force-trim-android.png)

## Timeline and export behavior

When the scene duration is below the minimum, the min label stays visible and the editor blocks export with a dialog. When the duration exceeds the maximum, the playhead sticks to the max position and export is clamped to that duration.

## Full Code

This full sample uses `VideoConfigurationBuilder` from the [Video Editor starter kit](../starterkits/video-editor.md), applies duration constraints by dispatching `EditorEvent.ApplyVideoDurationConstraints` from `onLoaded`, and then calls `onLoaded()` from the video preset callback to keep the default video setup behavior.

```kotlin file=@cesdk_android_examples/editor-guides-video-force-trim/ForceTrimVideoSolution.kt
import androidx.compose.runtime.Composable
import ly.img.editor.Editor
import ly.img.editor.configuration.video.VideoConfigurationBuilder
import ly.img.editor.configuration.video.callback.onLoaded
import ly.img.editor.core.configuration.EditorConfiguration
import ly.img.editor.core.configuration.remember
import ly.img.editor.core.event.EditorEvent
import kotlin.time.Duration.Companion.seconds

// Add this composable to your NavHost
@Composable
fun ForceTrimVideoSolution(
    license: String,
    onClose: (Throwable?) -> Unit,
) {
    Editor(
        license = license, // pass null or empty for evaluation mode with watermark
        configuration = {
            EditorConfiguration.remember(::VideoConfigurationBuilder) {
                onLoaded = {
                    val event = EditorEvent.ApplyVideoDurationConstraints(
                        minDuration = 1.seconds,
                        maxDuration = 5.seconds,
                    )
                    editorContext.eventHandler.send(event)
                    onLoaded()
                }
            }
        },
        onClose = onClose,
    )
}
```



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
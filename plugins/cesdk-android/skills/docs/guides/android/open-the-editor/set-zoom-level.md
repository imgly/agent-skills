> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Open the Editor](../open-the-editor.md) > [Set Zoom Level](./set-zoom-level.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-set-zoom-level/SetZoomLevel.kt reference-only
import kotlinx.coroutines.CompletableDeferred
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Job
import kotlinx.coroutines.coroutineScope
import kotlinx.coroutines.flow.launchIn
import kotlinx.coroutines.flow.onEach
import kotlinx.coroutines.isActive
import kotlinx.coroutines.withTimeout
import kotlinx.coroutines.yield
import ly.img.engine.DesignBlock
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.UnstableEngineApi
import ly.img.engine.ZoomAutoFitAxis

data class SetZoomLevelSummary(
    val zoom100: Float,
    val zoom50: Float,
    val autoFitEnabled: Boolean,
    val autoFitDisabled: Boolean,
    val zoomClampingEnabled: Boolean,
    val positionClampingEnabled: Boolean,
    val finalZoom: Float,
)

@OptIn(UnstableEngineApi::class)
suspend fun setZoomLevel(engine: Engine): SetZoomLevelSummary = coroutineScope {
    val scene = engine.scene.create()

    val page = engine.block.create(DesignBlockType.Page)
    engine.block.setWidth(page, value = 800F)
    engine.block.setHeight(page, value = 600F)
    engine.block.appendChild(parent = scene, child = page)

    engine.scene.setZoomLevel(level = 1F)
    val zoom100 = engine.scene.getZoomLevel()

    engine.scene.setZoomLevel(level = zoom100 * 0.5F)
    val zoom50 = engine.scene.getZoomLevel()

    engine.scene.zoomToBlock(
        block = page,
        paddingLeft = 20F,
        paddingTop = 20F,
        paddingRight = 20F,
        paddingBottom = 20F,
    )

    engine.scene.immediateZoomToBlock(
        block = page,
        paddingLeft = 20F,
        paddingTop = 20F,
        paddingRight = 20F,
        paddingBottom = 20F,
        forceUpdate = true,
    )

    engine.scene.enableZoomAutoFit(
        block = page,
        axis = ZoomAutoFitAxis.BOTH,
        paddingLeft = 20F,
        paddingTop = 20F,
        paddingRight = 20F,
        paddingBottom = 20F,
    )
    val autoFitEnabled = engine.scene.isZoomAutoFitEnabled(page)

    engine.scene.disableZoomAutoFit(page)
    val autoFitDisabled = engine.scene.isZoomAutoFitEnabled(page).not()

    val zoomClampingEnabled = configureZoomClamping(engine = engine, page = page)
    val positionClampingEnabled = configurePositionClamping(engine = engine, scene = scene)

    engine.scene.setZoomLevel(level = 2F)
    val finalZoom = engine.scene.getZoomLevel()

    val summary = SetZoomLevelSummary(
        zoom100 = zoom100,
        zoom50 = zoom50,
        autoFitEnabled = autoFitEnabled,
        autoFitDisabled = autoFitDisabled,
        zoomClampingEnabled = zoomClampingEnabled,
        positionClampingEnabled = positionClampingEnabled,
        finalZoom = finalZoom,
    )

    engine.scene.disableCameraZoomClamping()
    engine.scene.disableCameraPositionClamping()

    summary
}

@OptIn(UnstableEngineApi::class)
fun configureZoomClamping(
    engine: Engine,
    page: DesignBlock,
): Boolean {
    engine.scene.enableCameraZoomClamping(
        blocks = listOf(page),
        minZoomLimit = 0.125F,
        maxZoomLimit = 8F,
    )
    val zoomClampingEnabled = engine.scene.isCameraZoomClampingEnabled(page)
    return zoomClampingEnabled
}

fun observeZoomLevel(
    engine: Engine,
    zoomControlScope: CoroutineScope,
    onZoomChanged: (Float) -> Unit,
): Job = engine.scene.onZoomLevelChanged()
    .onEach {
        onZoomChanged(engine.scene.getZoomLevel())
    }
    .launchIn(zoomControlScope)

suspend fun verifyZoomChangeSubscription(
    engine: Engine,
    zoomControlScope: CoroutineScope,
    pumpEngine: () -> Unit,
): Float {
    val observedEventCount = CompletableDeferred<Int>()
    val observedZoomLevels = mutableListOf<Float>()
    val zoomEvents = observeZoomLevel(
        engine = engine,
        zoomControlScope = zoomControlScope,
    ) { zoomLevel ->
        observedZoomLevels += zoomLevel
        if (observedZoomLevels.size == 3) {
            observedEventCount.complete(observedZoomLevels.size)
        }
    }

    // The offscreen smoke test has no render loop, so yield until the Flow is
    // subscribed and manually pump the engine after each zoom change.
    yield()
    pumpEngine()
    listOf(1F, 2F, 3F).forEach { zoomLevel ->
        engine.scene.setZoomLevel(level = zoomLevel)
        pumpEngine()
        yield()
    }
    withTimeout(5_000) {
        while (isActive && observedEventCount.isCompleted.not()) {
            pumpEngine()
            yield()
        }
        observedEventCount.await()
    }
    zoomEvents.cancel()
    return observedZoomLevels.last()
}

@OptIn(UnstableEngineApi::class)
fun configurePositionClamping(
    engine: Engine,
    scene: DesignBlock,
): Boolean {
    engine.scene.enableCameraPositionClamping(
        blocks = listOf(scene),
        paddingLeft = 10F,
        paddingTop = 10F,
        paddingRight = 10F,
        paddingBottom = 10F,
        scaledPaddingLeft = 0F,
        scaledPaddingTop = 0F,
        scaledPaddingRight = 0F,
        scaledPaddingBottom = 0F,
    )
    val positionClampingEnabled = engine.scene.isCameraPositionClampingEnabled(scene)
    return positionClampingEnabled
}
```

Control how much of a design is visible by driving the camera zoom from code.
Set an exact zoom level, frame a block, follow content as it resizes, constrain
the camera, and react to zoom changes through the Engine `scene` API.

> **Reading time:** 6 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.83.0-nightly.20260829/engine-guides-set-zoom-level)

<EngineReferenceNote {...props} />

The zoom level is a ratio between design dots and screen pixels. A zoom level of `1F` shows one design dot as one screen pixel; `2F` shows it as two. The snippets below operate on the active scene and a valid `page` block in that scene.

## Get and Set the Zoom Level

Set an absolute zoom level with `engine.scene.setZoomLevel()` and read the current value with `engine.scene.getZoomLevel()`. Reading first lets you apply a relative change, such as halving the current zoom.

```kotlin highlight-android-get-set-zoom-level
    engine.scene.setZoomLevel(level = 1F)
    val zoom100 = engine.scene.getZoomLevel()

    engine.scene.setZoomLevel(level = zoom100 * 0.5F)
    val zoom50 = engine.scene.getZoomLevel()
```

## Zoom to a Block

Frame a specific block - the scene, a page, or any element - with `engine.scene.zoomToBlock()`. Padding is measured in screen pixels and leaves space around the block. Use `engine.scene.immediateZoomToBlock()` when the layout is already up to date and you need the camera to move synchronously.

```kotlin highlight-android-zoom-to-block
    engine.scene.zoomToBlock(
        block = page,
        paddingLeft = 20F,
        paddingTop = 20F,
        paddingRight = 20F,
        paddingBottom = 20F,
    )

    engine.scene.immediateZoomToBlock(
        block = page,
        paddingLeft = 20F,
        paddingTop = 20F,
        paddingRight = 20F,
        paddingBottom = 20F,
        forceUpdate = true,
    )
```

## Auto-Fit Zoom

Auto-fit continuously refits a block as its bounding box changes. Choose the axis with `ZoomAutoFitAxis.BOTH`, `ZoomAutoFitAxis.HORIZONTAL`, or `ZoomAutoFitAxis.VERTICAL`. Auto-fit only has a visible effect while the zoom is not controlled by an editor UI layer, and calling `setZoomLevel()` or `zoomToBlock()` disables it.

```kotlin highlight-android-auto-fit-zoom
engine.scene.enableZoomAutoFit(
    block = page,
    axis = ZoomAutoFitAxis.BOTH,
    paddingLeft = 20F,
    paddingTop = 20F,
    paddingRight = 20F,
    paddingBottom = 20F,
)
val autoFitEnabled = engine.scene.isZoomAutoFitEnabled(page)
```

## Disable Auto-Fit

Stop following a block with `engine.scene.disableZoomAutoFit()`, and check whether auto-fit is still active with `engine.scene.isZoomAutoFitEnabled()`.

```kotlin highlight-android-disable-auto-fit
engine.scene.disableZoomAutoFit(page)
val autoFitDisabled = engine.scene.isZoomAutoFitEnabled(page).not()
```

## Limit the Zoom Range

Use `engine.scene.enableCameraZoomClamping()` to keep the camera zoom within a range relative to one or more blocks. Negative limits mean unbounded. The camera-clamping APIs are annotated with `@UnstableEngineApi`, so opt in at the calling scope.

```kotlin highlight-android-zoom-clamping
@OptIn(UnstableEngineApi::class)
fun configureZoomClamping(
    engine: Engine,
    page: DesignBlock,
): Boolean {
    engine.scene.enableCameraZoomClamping(
        blocks = listOf(page),
        minZoomLimit = 0.125F,
        maxZoomLimit = 8F,
    )
    val zoomClampingEnabled = engine.scene.isCameraZoomClampingEnabled(page)
    return zoomClampingEnabled
}
```

## Constrain the Camera Position

Use `engine.scene.enableCameraPositionClamping()` to keep panning within the bounds of the supplied blocks. Padding defines how far the camera can move past those bounds; scaled padding grows with the zoom level until it reaches five times the initial value.

```kotlin highlight-android-position-clamping
@OptIn(UnstableEngineApi::class)
fun configurePositionClamping(
    engine: Engine,
    scene: DesignBlock,
): Boolean {
    engine.scene.enableCameraPositionClamping(
        blocks = listOf(scene),
        paddingLeft = 10F,
        paddingTop = 10F,
        paddingRight = 10F,
        paddingBottom = 10F,
        scaledPaddingLeft = 0F,
        scaledPaddingTop = 0F,
        scaledPaddingRight = 0F,
        scaledPaddingBottom = 0F,
    )
    val positionClampingEnabled = engine.scene.isCameraPositionClampingEnabled(scene)
    return positionClampingEnabled
}
```

## Subscribe to Zoom Changes

`engine.scene.onZoomLevelChanged()` returns a `Flow<Unit>` that emits whenever the zoom changes. Collect it from your UI scope to keep custom controls in sync, and cancel the returned job when the control leaves the screen.

```kotlin highlight-android-subscribe-zoom-changes
fun observeZoomLevel(
    engine: Engine,
    zoomControlScope: CoroutineScope,
    onZoomChanged: (Float) -> Unit,
): Job = engine.scene.onZoomLevelChanged()
    .onEach {
        onZoomChanged(engine.scene.getZoomLevel())
    }
    .launchIn(zoomControlScope)
```

## API Reference

| Method | Description |
| --- | --- |
| `engine.scene.setZoomLevel(level=_)` | Set the active scene's zoom level. |
| `engine.scene.getZoomLevel()` | Read the active scene's current zoom level. |
| `engine.scene.zoomToBlock(block=_, paddingLeft=_, paddingTop=_, paddingRight=_, paddingBottom=_)` | Asynchronously frame a block after its dimensions are known, with optional per-side padding. |
| `engine.scene.immediateZoomToBlock(block=_, paddingLeft=_, paddingTop=_, paddingRight=_, paddingBottom=_, forceUpdate=_)` | Frame a block synchronously; pass `forceUpdate=true` to run a layout pass first. |
| `engine.scene.enableZoomAutoFit(block=_, axis=_, paddingLeft=_, paddingTop=_, paddingRight=_, paddingBottom=_)` | Continuously refit a block on the selected `ZoomAutoFitAxis`. |
| `engine.scene.disableZoomAutoFit(block=_)` | Stop a previously enabled auto-fit. |
| `engine.scene.isZoomAutoFitEnabled(block=_)` | Query whether auto-fit is enabled for a block or scene. |
| `engine.scene.enableCameraZoomClamping(blocks=_, minZoomLimit=_, maxZoomLimit=_, paddingLeft=_, paddingTop=_, paddingRight=_, paddingBottom=_)` | Constrain the zoom range relative to the supplied blocks. Experimental. |
| `engine.scene.disableCameraZoomClamping()` | Remove zoom clamping. Experimental. |
| `engine.scene.isCameraZoomClampingEnabled(blockOrScene=_)` | Query whether zoom clamping is enabled. Experimental. |
| `engine.scene.enableCameraPositionClamping(blocks=_, paddingLeft=_, paddingTop=_, paddingRight=_, paddingBottom=_, scaledPaddingLeft=_, scaledPaddingTop=_, scaledPaddingRight=_, scaledPaddingBottom=_)` | Keep the camera position inside the supplied block bounds. Experimental. |
| `engine.scene.disableCameraPositionClamping()` | Remove position clamping. Experimental. |
| `engine.scene.isCameraPositionClampingEnabled(blockOrScene=_)` | Query whether position clamping is enabled. Experimental. |
| `engine.scene.onZoomLevelChanged()` | Subscribe to zoom-level change events as a Kotlin `Flow`. |

## Troubleshooting

| Problem | Resolution |
| --- | --- |
| Zoom level does not change | Confirm a scene exists before calling zoom methods, and that no editor UI layer is overriding the zoom. |
| Auto-fit has no effect | Only one block per scene can drive auto-fit, and `setZoomLevel()` or `zoomToBlock()` disables it. Pass a valid block that belongs to the active scene. |
| Zoom feels capped | An active zoom clamp limits the range. Check with `isCameraZoomClampingEnabled()` and adjust or remove it. |

## Next Steps

- [Start With Blank Canvas](./blank-canvas.md) - Start the editor with an empty scene to zoom into.
- [Load a Scene](./load-scene.md) - Open an existing design before adjusting the camera.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
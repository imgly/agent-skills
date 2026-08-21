> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Create and Edit Videos](../create-video.md) > [Transform](./transform.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-video-transform/VideoTransform.kt reference-only
import android.net.Uri
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.launch
import ly.img.engine.AnimationType
import ly.img.engine.ContentFillMode
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.FillType
import ly.img.engine.GlobalScope
import ly.img.engine.PositionMode
import ly.img.engine.ShapeType
import kotlin.math.PI
import kotlin.math.abs

fun transformVideo(
    license: String?,
    userId: String,
): Job = CoroutineScope(Dispatchers.Main).launch {
    val engine = Engine.getInstance(id = "ly.img.engine.example.video-transform")
    engine.start(license = license, userId = userId)
    engine.bindOffscreen(width = 1280, height = 720)

    try {
        val sampleVideoUri = Uri.parse("https://img.ly/static/ubq_video_samples/bbb.mp4")

        val scene = engine.scene.createForVideo()
        val page = engine.block.create(DesignBlockType.Page)
        engine.block.appendChild(parent = scene, child = page)
        engine.block.setWidth(page, value = 1280F)
        engine.block.setHeight(page, value = 720F)
        engine.block.setDuration(page, duration = 8.0)

        val positionedVideo = engine.block.create(DesignBlockType.Graphic)
        val positionedVideoFill = engine.block.createFill(FillType.Video)

        engine.block.setName(positionedVideo, "Positioned video")
        engine.block.setShape(positionedVideo, shape = engine.block.createShape(ShapeType.Rect))
        engine.block.setPositionX(positionedVideo, value = 80F)
        engine.block.setPositionY(positionedVideo, value = 80F)
        engine.block.setWidth(positionedVideo, value = 300F)
        engine.block.setHeight(positionedVideo, value = 170F)
        // Android does not expose a typed setter for the video fill URI property.
        engine.block.setUri(block = positionedVideoFill, property = "fill/video/fileURI", value = sampleVideoUri)
        engine.block.setFill(block = positionedVideo, fill = positionedVideoFill)
        engine.block.setContentFillMode(block = positionedVideo, mode = ContentFillMode.COVER)
        engine.block.setDuration(block = positionedVideo, duration = 8.0)
        engine.block.appendChild(parent = page, child = positionedVideo)

        val rotatedVideo = engine.block.create(DesignBlockType.Graphic)
        val rotatedVideoFill = engine.block.createFill(FillType.Video)
        engine.block.setName(rotatedVideo, "Rotated video")
        engine.block.setShape(rotatedVideo, shape = engine.block.createShape(ShapeType.Rect))
        engine.block.setPositionX(rotatedVideo, value = 460F)
        engine.block.setPositionY(rotatedVideo, value = 80F)
        engine.block.setWidth(rotatedVideo, value = 300F)
        engine.block.setHeight(rotatedVideo, value = 170F)
        // Android does not expose a typed setter for the video fill URI property.
        engine.block.setUri(block = rotatedVideoFill, property = "fill/video/fileURI", value = sampleVideoUri)
        engine.block.setFill(block = rotatedVideo, fill = rotatedVideoFill)
        engine.block.setContentFillMode(block = rotatedVideo, mode = ContentFillMode.COVER)
        engine.block.setDuration(block = rotatedVideo, duration = 8.0)
        engine.block.appendChild(parent = page, child = rotatedVideo)

        val croppedVideo = engine.block.create(DesignBlockType.Graphic)
        val croppedVideoFill = engine.block.createFill(FillType.Video)
        engine.block.setName(croppedVideo, "Cropped video")
        engine.block.setShape(croppedVideo, shape = engine.block.createShape(ShapeType.Rect))
        engine.block.setPositionX(croppedVideo, value = 80F)
        engine.block.setPositionY(croppedVideo, value = 360F)
        engine.block.setWidth(croppedVideo, value = 300F)
        engine.block.setHeight(croppedVideo, value = 170F)
        // Android does not expose a typed setter for the video fill URI property.
        engine.block.setUri(block = croppedVideoFill, property = "fill/video/fileURI", value = sampleVideoUri)
        engine.block.setFill(block = croppedVideo, fill = croppedVideoFill)
        engine.block.setContentFillMode(block = croppedVideo, mode = ContentFillMode.COVER)
        engine.block.setDuration(block = croppedVideo, duration = 8.0)
        engine.block.appendChild(parent = page, child = croppedVideo)

        val lockedVideo = engine.block.create(DesignBlockType.Graphic)
        val lockedVideoFill = engine.block.createFill(FillType.Video)
        engine.block.setName(lockedVideo, "Locked video")
        engine.block.setShape(lockedVideo, shape = engine.block.createShape(ShapeType.Rect))
        engine.block.setPositionX(lockedVideo, value = 460F)
        engine.block.setPositionY(lockedVideo, value = 360F)
        engine.block.setWidth(lockedVideo, value = 300F)
        engine.block.setHeight(lockedVideo, value = 170F)
        // Android does not expose a typed setter for the video fill URI property.
        engine.block.setUri(block = lockedVideoFill, property = "fill/video/fileURI", value = sampleVideoUri)
        engine.block.setFill(block = lockedVideo, fill = lockedVideoFill)
        engine.block.setContentFillMode(block = lockedVideo, mode = ContentFillMode.COVER)
        engine.block.setDuration(block = lockedVideo, duration = 8.0)
        engine.block.appendChild(parent = page, child = lockedVideo)

        engine.block.setPositionXMode(positionedVideo, mode = PositionMode.ABSOLUTE)
        engine.block.setPositionYMode(positionedVideo, mode = PositionMode.ABSOLUTE)
        engine.block.setPositionX(positionedVideo, value = 120F)
        engine.block.setPositionY(positionedVideo, value = 104F)

        engine.block.setFlipHorizontal(rotatedVideo, flip = true)
        engine.block.scale(rotatedVideo, scale = 1.15F, anchorX = 0.5F, anchorY = 0.5F)
        engine.block.setRotation(rotatedVideo, radians = (PI / 8.0).toFloat())

        engine.block.setWidth(lockedVideo, value = 280F, maintainCrop = true)
        engine.block.setHeight(lockedVideo, value = 158F, maintainCrop = true)

        if (engine.block.supportsCrop(croppedVideo)) {
            engine.block.setContentFillMode(croppedVideo, mode = ContentFillMode.CROP)
            engine.block.setCropScaleRatio(croppedVideo, scaleRatio = 1.35F)
            // Crop translations are relative to the block frame dimensions.
            engine.block.setCropTranslationX(croppedVideo, translationX = -0.12F)
            engine.block.setCropTranslationY(croppedVideo, translationY = 0.08F)
            engine.block.setCropRotation(croppedVideo, rotation = (PI / 18.0).toFloat())
            engine.block.adjustCropToFillFrame(croppedVideo, minScaleRatio = 1.0F)
        }

        engine.editor.setSettingBoolean("controlGizmo/showMoveHandles", true)
        engine.editor.setSettingBoolean("controlGizmo/showResizeHandles", true)
        engine.editor.setSettingBoolean("controlGizmo/showScaleHandles", true)
        engine.editor.setSettingBoolean("controlGizmo/showRotateHandles", true)
        engine.editor.setSettingBoolean("controlGizmo/showCropHandles", true)
        engine.editor.setSettingFloat("controlGizmo/blockScaleDownLimit", 12F)
        engine.editor.setSettingEnum("touch/rotateAction", "Rotate")
        engine.editor.setSettingEnum("touch/pinchAction", "Scale")

        if (engine.block.isGroupable(listOf(positionedVideo, croppedVideo))) {
            val group = engine.block.group(listOf(positionedVideo, croppedVideo))
            engine.block.setPositionX(group, value = 180F)
            engine.block.setRotation(group, radians = (PI / 16.0).toFloat())
        }

        if (engine.block.supportsAnimation(rotatedVideo)) {
            val loopAnimation = engine.block.createAnimation(AnimationType.SpinLoop)
            engine.block.setLoopAnimation(rotatedVideo, loopAnimation)
            engine.block.setDuration(loopAnimation, duration = 2.0)
            engine.block.setTimeOffset(rotatedVideo, offset = 1.0)
        }

        val blockFrameScopes = listOf("layer/move", "layer/rotate", "layer/resize", "layer/flip")
        (blockFrameScopes + "layer/crop").forEach { scope ->
            engine.editor.setGlobalScope(key = scope, globalScope = GlobalScope.DEFER)
        }

        blockFrameScopes.forEach { scope ->
            engine.block.setScopeEnabled(lockedVideo, key = scope, enabled = false)
        }
        engine.block.setScopeEnabled(lockedVideo, key = "layer/crop", enabled = false)
        engine.block.setTransformLocked(lockedVideo, locked = true)

        val transformsLocked = engine.block.isTransformLocked(lockedVideo)
        val moveScopeEnabled = engine.block.isScopeEnabled(lockedVideo, key = "layer/move")
        val moveAllowed = engine.block.isAllowedByScope(lockedVideo, key = "layer/move")
        val cropScopeEnabled = engine.block.isScopeEnabled(lockedVideo, key = "layer/crop")
        val cropAllowed = engine.block.isAllowedByScope(lockedVideo, key = "layer/crop")

        check(abs(engine.block.getRotation(rotatedVideo) - (PI / 8.0).toFloat()) < 0.001F)
        check(engine.block.isFlipHorizontal(rotatedVideo))
        check(transformsLocked)
        check(!moveScopeEnabled)
        check(!moveAllowed)
        check(!cropScopeEnabled)
        check(!cropAllowed)
        check(engine.editor.getSettingBoolean("controlGizmo/showRotateHandles"))
        check(abs(engine.editor.getSettingFloat("controlGizmo/blockScaleDownLimit") - 12F) < 0.001F)
        check(engine.editor.getSettingEnum("touch/pinchAction") == "Scale")
    } finally {
        engine.stop()
    }
}
```

Transform video blocks by moving, rotating, scaling, cropping, grouping, and
locking them in CE.SDK for Android.

> **Reading time:** 6 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.81.0-rc.1/engine-guides-video-transform)

<EngineReferenceNote {...props} />

Video transformations affect either the block frame or the media inside that frame. Block-level transforms change the graphic block's position, rotation, flip state, size, and group placement. Content-level crop transforms reframe the video fill without moving the block itself.

| Transform layer | Use it for | Main APIs |
| --- | --- | --- |
| Block | Move, rotate, flip, scale, and resize the video block in the scene. | `setPositionX()`, `setRotation()`, `setFlipHorizontal()`, `scale()`, `setWidth()` |
| Content | Pan, zoom, or rotate the video inside the block frame. | `setCropScaleRatio()`, `setCropTranslationX()`, `setCropRotation()`, `adjustCropToFillFrame()` |
| Permissions | Restrict end-user edits, crop reframing, or block-frame geometry changes. | `setScopeEnabled()`, `setTransformLocked()` |

The Kotlin snippets below assume the engine is running on the main thread and that each named variable refers to a video graphic block in the current scene.

## Apply Block Transforms

Block transforms affect the whole graphic block. Use absolute or percentage position modes for placement, radians for rotation, booleans for flip states, and an anchor point when scaling.

```kotlin highlight-android-block-transforms
        engine.block.setPositionXMode(positionedVideo, mode = PositionMode.ABSOLUTE)
        engine.block.setPositionYMode(positionedVideo, mode = PositionMode.ABSOLUTE)
        engine.block.setPositionX(positionedVideo, value = 120F)
        engine.block.setPositionY(positionedVideo, value = 104F)

        engine.block.setFlipHorizontal(rotatedVideo, flip = true)
        engine.block.scale(rotatedVideo, scale = 1.15F, anchorX = 0.5F, anchorY = 0.5F)
        engine.block.setRotation(rotatedVideo, radians = (PI / 8.0).toFloat())

        engine.block.setWidth(lockedVideo, value = 280F, maintainCrop = true)
        engine.block.setHeight(lockedVideo, value = 158F, maintainCrop = true)
```

Use `maintainCrop = true` when resizing a video block and you want CE.SDK to adjust crop values so the visible content remains framed.

## Adjust the Video Inside the Frame

Crop transforms change how the video fill appears inside the block frame. They do not change the block's own position or dimensions.

```kotlin highlight-android-content-transforms
if (engine.block.supportsCrop(croppedVideo)) {
    engine.block.setContentFillMode(croppedVideo, mode = ContentFillMode.CROP)
    engine.block.setCropScaleRatio(croppedVideo, scaleRatio = 1.35F)
    // Crop translations are relative to the block frame dimensions.
    engine.block.setCropTranslationX(croppedVideo, translationX = -0.12F)
    engine.block.setCropTranslationY(croppedVideo, translationY = 0.08F)
    engine.block.setCropRotation(croppedVideo, rotation = (PI / 18.0).toFloat())
    engine.block.adjustCropToFillFrame(croppedVideo, minScaleRatio = 1.0F)
}
```

Crop translations are scaled offsets relative to the block frame, not pixel or design-unit positions. A `translationX` value of `-0.12` shifts the video content left by 12% of the frame width, while a `translationY` value of `0.08` shifts it down by 8% of the frame height. Positive X moves content right, and positive Y moves content down.

Check `supportsCrop()` before applying crop transforms if your code handles mixed block types. `adjustCropToFillFrame()` prevents empty frame areas after crop scale, translation, or rotation changes.

## Configure Transform Controls

The built-in editor UI reads transform settings from the engine. Configure visible handles and touch behavior when your app needs to expose or hide direct manipulation.

```kotlin highlight-android-transform-controls
engine.editor.setSettingBoolean("controlGizmo/showMoveHandles", true)
engine.editor.setSettingBoolean("controlGizmo/showResizeHandles", true)
engine.editor.setSettingBoolean("controlGizmo/showScaleHandles", true)
engine.editor.setSettingBoolean("controlGizmo/showRotateHandles", true)
engine.editor.setSettingBoolean("controlGizmo/showCropHandles", true)
engine.editor.setSettingFloat("controlGizmo/blockScaleDownLimit", 12F)
engine.editor.setSettingEnum("touch/rotateAction", "Rotate")
engine.editor.setSettingEnum("touch/pinchAction", "Scale")
```

These settings affect the built-in editor interaction layer. `controlGizmo/blockScaleDownLimit` uses screen pixels; the value above keeps scaled blocks at least 12 screen pixels wide and high. Programmatic transform calls use the block APIs. Scope checks for those APIs are disabled by default unless `debug/enforceScopesInAPIs` is enabled, while block-frame transform locks are enforced separately by block-frame transform APIs.

## Transform Groups

Group multiple blocks when they should move or rotate together while preserving their relative placement.

```kotlin highlight-android-group-transforms
if (engine.block.isGroupable(listOf(positionedVideo, croppedVideo))) {
    val group = engine.block.group(listOf(positionedVideo, croppedVideo))
    engine.block.setPositionX(group, value = 180F)
    engine.block.setRotation(group, radians = (PI / 16.0).toFloat())
}
```

Call `isGroupable()` before grouping arbitrary selections. A group receives its own block ID, so you can transform the group with the same block APIs used for single blocks.

## Animate and Time Transforms

Video scenes can combine static transforms with block animations and timeline placement. Attach animation blocks to the transformed video block and set the block's time offset when it should appear later in the page timeline.

```kotlin highlight-android-animated-transforms
if (engine.block.supportsAnimation(rotatedVideo)) {
    val loopAnimation = engine.block.createAnimation(AnimationType.SpinLoop)
    engine.block.setLoopAnimation(rotatedVideo, loopAnimation)
    engine.block.setDuration(loopAnimation, duration = 2.0)
    engine.block.setTimeOffset(rotatedVideo, offset = 1.0)
}
```

Use the dedicated animation guides when you need keyframe-style motion, easing, or detailed animation property configuration.

## Restrict Transform Changes

For templates, disable individual transform scopes and use the transform lock for block-frame geometry. Block-level scope flags affect editor interactions when the matching global scope is set to `GlobalScope.DEFER`; use `isAllowedByScope()` to validate the effective editor permission.

```kotlin highlight-android-lock-transforms
        val blockFrameScopes = listOf("layer/move", "layer/rotate", "layer/resize", "layer/flip")
        (blockFrameScopes + "layer/crop").forEach { scope ->
            engine.editor.setGlobalScope(key = scope, globalScope = GlobalScope.DEFER)
        }

        blockFrameScopes.forEach { scope ->
            engine.block.setScopeEnabled(lockedVideo, key = scope, enabled = false)
        }
        engine.block.setScopeEnabled(lockedVideo, key = "layer/crop", enabled = false)
        engine.block.setTransformLocked(lockedVideo, locked = true)

        val transformsLocked = engine.block.isTransformLocked(lockedVideo)
        val moveScopeEnabled = engine.block.isScopeEnabled(lockedVideo, key = "layer/move")
        val moveAllowed = engine.block.isAllowedByScope(lockedVideo, key = "layer/move")
        val cropScopeEnabled = engine.block.isScopeEnabled(lockedVideo, key = "layer/crop")
        val cropAllowed = engine.block.isAllowedByScope(lockedVideo, key = "layer/crop")
```

Use individual scopes when one operation should remain available, such as allowing crop but preventing movement. Disable `layer/crop` when crop or content reframing must stay fixed. `setTransformLocked()` protects block-frame geometry such as moving, rotating, flipping, scaling, and resizing; crop setters use the `layer/crop` permission path instead. `isScopeEnabled()` reads only the block-level flag, while `isAllowedByScope()` combines the global and block-level scope state. Android API calls enforce scope checks only when `debug/enforceScopesInAPIs` is enabled.

## Troubleshooting

| Issue | Check |
| --- | --- |
| A block does not move or rotate | For editor interactions, confirm the block is valid and `isAllowedByScope()` returns true for the needed scope. For Block API calls, also check whether `debug/enforceScopesInAPIs` is enabled and `isTransformLocked()` is false. |
| Position values look wrong | Verify whether the block uses `PositionMode.ABSOLUTE` or `PositionMode.PERCENT`. |
| Rotation uses the wrong angle | Pass radians, not degrees. |
| Crop leaves empty frame areas | Call `adjustCropToFillFrame()` after changing crop scale, translation, or rotation. |
| UI handles are missing | Check `controlGizmo/*` settings and ensure the selected block supports the requested operation. |

## API Reference

| API | Purpose |
| --- | --- |
| `engine.block.setPositionX(block=_,value=_)` | Set the block's x position relative to its parent. |
| `engine.block.setPositionY(block=_,value=_)` | Set the block's y position relative to its parent. |
| `engine.block.setPositionXMode(block=_,mode=_)` | Choose absolute or percentage x positioning. |
| `engine.block.setPositionYMode(block=_,mode=_)` | Choose absolute or percentage y positioning. |
| `engine.block.setRotation(block=_,radians=_)` | Rotate the block around its center. |
| `engine.block.setFlipHorizontal(block=_,flip=_)` | Mirror the block horizontally. |
| `engine.block.setFlipVertical(block=_,flip=_)` | Mirror the block vertically. |
| `engine.block.scale(block=_,scale=_,anchorX=_,anchorY=_)` | Scale the block around a normalized anchor point. |
| `engine.block.setWidth(block=_,value=_,maintainCrop=_)` | Resize the block width and optionally preserve crop framing. |
| `engine.block.setHeight(block=_,value=_,maintainCrop=_)` | Resize the block height and optionally preserve crop framing. |
| `engine.block.setDuration(block=_,duration=_)` | Set how long a page, video block, or animation block participates in the video timeline. |
| `engine.block.setContentFillMode(block=_,mode=_)` | Choose `ContentFillMode.CROP`, `ContentFillMode.COVER`, or `ContentFillMode.CONTAIN` for the block's content. |
| `engine.block.getContentFillMode(block=_)` | Read the block's current content fill mode. |
| `engine.block.supportsCrop(block=_)` | Check whether the block supports crop transforms before applying crop values. |
| `engine.block.setCropScaleX(block=_,scaleX=_)` | Scale the video content horizontally inside the frame. |
| `engine.block.setCropScaleY(block=_,scaleY=_)` | Scale the video content vertically inside the frame. |
| `engine.block.setCropScaleRatio(block=_,scaleRatio=_)` | Uniformly scale the video content inside the frame. |
| `engine.block.setCropTranslationX(block=_,translationX=_)` | Set the relative horizontal crop offset; `1.0` equals one frame width, positive values move content right. |
| `engine.block.setCropTranslationY(block=_,translationY=_)` | Set the relative vertical crop offset; `1.0` equals one frame height, positive values move content down. |
| `engine.block.setCropRotation(block=_,rotation=_)` | Rotate the video content inside the block frame. |
| `engine.block.adjustCropToFillFrame(block=_,minScaleRatio=_)` | Adjust crop values so the content fills the block frame. |
| `engine.block.flipCropHorizontal(block=_)` | Flip the cropped content along its horizontal axis. |
| `engine.block.flipCropVertical(block=_)` | Flip the cropped content along its vertical axis. |
| `engine.block.setCropAspectRatioLocked(block=_,locked=_)` | Keep crop handles constrained to the current aspect ratio. |
| `engine.block.resetCrop(block=_)` | Reset manual crop values and return the content fill mode to cover. |
| `engine.block.isGroupable(blocks=_)` | Check whether selected blocks can be grouped. |
| `engine.block.group(blocks=_)` | Create a group that can be transformed as one block. |
| `engine.block.supportsAnimation(block=_)` | Check whether a block can receive animations. |
| `engine.block.createAnimation(type=_)` | Create an animation block such as `AnimationType.SpinLoop`. |
| `engine.block.setInAnimation(block=_,animation=_)` | Attach an entry animation to a block. |
| `engine.block.setLoopAnimation(block=_,animation=_)` | Attach a looping animation to a block. |
| `engine.block.setOutAnimation(block=_,animation=_)` | Attach an exit animation to a block. |
| `engine.block.setTimeOffset(block=_,offset=_)` | Place the block later in its parent timeline, in seconds. |
| `engine.editor.setGlobalScope(key=_,globalScope=_)` | Set a global scope to `GlobalScope.ALLOW`, `GlobalScope.DENY`, or `GlobalScope.DEFER`. |
| `engine.block.setScopeEnabled(block=_,key=_,enabled=_)` | Enable or disable block-level transform scopes such as `"layer/move"`, `"layer/rotate"`, `"layer/flip"`, `"layer/resize"`, and `"layer/crop"`. |
| `engine.block.isScopeEnabled(block=_,key=_)` | Check only the block-level scope flag. |
| `engine.block.isAllowedByScope(block=_,key=_)` | Check the effective permission after global scope and block-level scope state are combined. |
| `engine.editor.setSettingBoolean(keypath="debug/enforceScopesInAPIs",value=_)` | Enable or disable scope checks inside editing APIs; disabled by default. |
| `engine.block.setTransformLocked(block=_,locked=_)` | Lock or unlock block-frame geometry transforms such as movement, rotation, flip, scale, and resize. |
| `engine.block.isTransformLocked(block=_)` | Check whether block-frame geometry transforms are locked for a block. |
| `engine.block.getPositionXMode(block=_)` | Read whether x positioning uses absolute or percentage values. |
| `engine.block.getPositionYMode(block=_)` | Read whether y positioning uses absolute or percentage values. |
| `engine.block.getRotation(block=_)` | Read the block's rotation in radians. |
| `engine.block.isFlipHorizontal(block=_)` | Check whether the block is mirrored horizontally. |
| `engine.block.isFlipVertical(block=_)` | Check whether the block is mirrored vertically. |
| `engine.block.getCropScaleRatio(block=_)` | Read the uniform crop scale ratio. |
| `engine.block.getCropTranslationX(block=_)` | Read the relative horizontal crop offset. |
| `engine.block.getCropTranslationY(block=_)` | Read the relative vertical crop offset. |
| `engine.block.getCropRotation(block=_)` | Read the crop rotation in radians. |
| `engine.editor.setSettingBoolean(keypath="controlGizmo/showMoveHandles",value=_)` | Show or hide the move handles in the editor UI. |
| `engine.editor.setSettingBoolean(keypath="controlGizmo/showResizeHandles",value=_)` | Show or hide the edge resize handles in the editor UI. |
| `engine.editor.setSettingBoolean(keypath="controlGizmo/showScaleHandles",value=_)` | Show or hide the corner scale handles in the editor UI. |
| `engine.editor.setSettingBoolean(keypath="controlGizmo/showRotateHandles",value=_)` | Show or hide the rotation handles in the editor UI. |
| `engine.editor.setSettingBoolean(keypath="controlGizmo/showCropHandles",value=_)` | Show or hide the crop handles in the editor UI. |
| `engine.editor.setSettingFloat(keypath="controlGizmo/blockScaleDownLimit",value=_)` | Set the minimum on-screen block size while users scale blocks in the editor UI. |
| `engine.editor.setSettingEnum(keypath="touch/rotateAction",value=_)` | Choose how rotation touch gestures map to transform behavior. |
| `engine.editor.setSettingEnum(keypath="touch/pinchAction",value=_)` | Choose how a touch gesture maps to transform behavior. |

## Next Steps

- [Move](./transform/move.md) - Position video blocks with absolute or percentage coordinates.
- [Rotate](./transform/rotate.md) - Rotate video blocks with radians.
- [Flip](./transform/flip.md) - Mirror video blocks horizontally or vertically.
- [Scale](./transform/scale.md) - Scale video blocks around an anchor point.
- [Crop](./transform/crop.md) - Reframe video content inside a block.
- [Resize](./transform/resize.md) - Change video block dimensions while managing crop behavior.



---

## Related Pages

- [Move](./transform/move.md) - Position a video relative to its parent using either percentage or units
- [Crop Video in Android](./transform/crop.md) - Cut out specific areas of a video to focus on key content or change aspect ratio
- [Rotate](./transform/rotate.md) - Documentation for Rotate
- [Resize](./transform/resize.md) - Change the size of individual elements or groups.
- [Scale](./transform/scale.md) - Scale videos uniformly in your Android app.
- [Flip Videos](./transform/flip.md) - Flip videos horizontally or vertically.


---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
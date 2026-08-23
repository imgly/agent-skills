> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Create and Edit Videos](../create-video.md) > [Lock Design](./lock-design.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-lock-video-design/LockVideoDesign.kt reference-only
import android.net.Uri
import kotlinx.coroutines.withContext
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.FillType
import ly.img.engine.GlobalScope
import ly.img.engine.ShapeType
import ly.img.engine.SizeMode

suspend fun lockVideoDesign(
    engine: Engine,
    restoreGlobalScopes: Boolean = false,
) = withContext(engine.dispatcher) {
    val previousGlobalScopes = if (restoreGlobalScopes) {
        engine.editor.findAllScopes().associateWith { scope ->
            engine.editor.getGlobalScope(key = scope)
        }
    } else {
        emptyMap()
    }

    try {
        val scene = engine.scene.createForVideo()
        val page = engine.block.create(DesignBlockType.Page)
        engine.block.appendChild(parent = scene, child = page)
        engine.block.setWidth(page, value = 1280F)
        engine.block.setHeight(page, value = 720F)
        engine.block.setDuration(page, duration = 12.0)

        val track = engine.block.create(DesignBlockType.Track)
        engine.block.appendChild(parent = page, child = track)

        val videoClip = engine.block.create(DesignBlockType.Graphic)
        engine.block.setShape(videoClip, shape = engine.block.createShape(ShapeType.Rect))
        engine.block.setDuration(videoClip, duration = 12.0)
        val videoFill = engine.block.createFill(FillType.Video)
        // Video source URIs are currently set through the fill property key.
        engine.block.setUri(
            block = videoFill,
            property = "fill/video/fileURI",
            value = Uri.parse(
                "https://cdn.img.ly/assets/demo/v3/ly.img.video/videos/pexels-kampus-production-8154913.mp4",
            ),
        )
        engine.block.setFill(videoClip, fill = videoFill)
        engine.block.appendChild(parent = track, child = videoClip)
        engine.block.fillParent(track)

        val titleOverlay = engine.block.create(DesignBlockType.Text)
        engine.block.appendChild(parent = page, child = titleOverlay)
        engine.block.setWidthMode(titleOverlay, mode = SizeMode.AUTO)
        engine.block.setHeightMode(titleOverlay, mode = SizeMode.AUTO)
        engine.block.setPositionX(titleOverlay, value = 80F)
        engine.block.setPositionY(titleOverlay, value = 80F)
        engine.block.setDuration(titleOverlay, duration = 12.0)
        engine.block.replaceText(titleOverlay, text = "Editable title")

        val watermarkOverlay = engine.block.create(DesignBlockType.Text)
        engine.block.appendChild(parent = page, child = watermarkOverlay)
        engine.block.setWidthMode(watermarkOverlay, mode = SizeMode.AUTO)
        engine.block.setHeightMode(watermarkOverlay, mode = SizeMode.AUTO)
        engine.block.setPositionX(watermarkOverlay, value = 980F)
        engine.block.setPositionY(watermarkOverlay, value = 640F)
        engine.block.setDuration(watermarkOverlay, duration = 12.0)
        engine.block.replaceText(watermarkOverlay, text = "LOCKED")

        val scopes = engine.editor.findAllScopes()
        scopes.forEach { scope ->
            engine.editor.setGlobalScope(key = scope, globalScope = GlobalScope.DENY)
        }

        engine.editor.setGlobalScope(key = "editor/select", globalScope = GlobalScope.DEFER)
        engine.block.setScopeEnabled(videoClip, key = "editor/select", enabled = true)
        engine.block.setScopeEnabled(titleOverlay, key = "editor/select", enabled = true)
        engine.block.setScopeEnabled(watermarkOverlay, key = "editor/select", enabled = false)

        engine.editor.setGlobalScope(key = "text/edit", globalScope = GlobalScope.DEFER)
        engine.editor.setGlobalScope(key = "text/character", globalScope = GlobalScope.DEFER)
        engine.block.setScopeEnabled(titleOverlay, key = "text/edit", enabled = true)
        engine.block.setScopeEnabled(titleOverlay, key = "text/character", enabled = true)

        engine.editor.setGlobalScope(key = "fill/change", globalScope = GlobalScope.DEFER)
        engine.block.setScopeEnabled(videoClip, key = "fill/change", enabled = true)

        engine.editor.setGlobalScope(key = "layer/move", globalScope = GlobalScope.DEFER)
        engine.editor.setGlobalScope(key = "layer/resize", globalScope = GlobalScope.DEFER)
        engine.editor.setGlobalScope(key = "layer/rotate", globalScope = GlobalScope.DEFER)
        engine.block.setScopeEnabled(titleOverlay, key = "layer/move", enabled = true)
        engine.block.setScopeEnabled(titleOverlay, key = "layer/resize", enabled = true)
        engine.block.setScopeEnabled(titleOverlay, key = "layer/rotate", enabled = true)

        val lockedOverlayScopes = listOf(
            "editor/select",
            "text/edit",
            "text/character",
            "fill/change",
            "layer/move",
            "layer/resize",
            "layer/rotate",
            "lifecycle/destroy",
        )
        lockedOverlayScopes.forEach { scope ->
            engine.block.setScopeEnabled(watermarkOverlay, key = scope, enabled = false)
        }

        val canSelectVideoClip = engine.block.isAllowedByScope(videoClip, key = "editor/select")
        val canReplaceVideoClip = engine.block.isAllowedByScope(videoClip, key = "fill/change")
        val canMoveVideoClip = engine.block.isAllowedByScope(videoClip, key = "layer/move")
        val canEditTitle = engine.block.isAllowedByScope(titleOverlay, key = "text/edit")
        val canMoveTitle = engine.block.isAllowedByScope(titleOverlay, key = "layer/move")
        val canSelectWatermark = engine.block.isAllowedByScope(watermarkOverlay, key = "editor/select")
        val titleTextScopeEnabled = engine.block.isScopeEnabled(titleOverlay, key = "text/edit")
        val textEditGlobalScope = engine.editor.getGlobalScope(key = "text/edit")

        require(canSelectVideoClip)
        require(canReplaceVideoClip)
        require(!canMoveVideoClip)
        require(canEditTitle)
        require(canMoveTitle)
        require(!canSelectWatermark)
        require(titleTextScopeEnabled)
        require(textEditGlobalScope == GlobalScope.DEFER)

        val availableScopes = engine.editor.findAllScopes()
        val currentScopeSettings = availableScopes.associateWith { scope ->
            engine.editor.getGlobalScope(key = scope)
        }
        require("editor/select" in availableScopes)
        require("fill/change" in availableScopes)
        require(currentScopeSettings["editor/select"] == GlobalScope.DEFER)
    } finally {
        previousGlobalScopes.forEach { (scope, globalScope) ->
            engine.editor.setGlobalScope(key = scope, globalScope = globalScope)
        }
    }
}
```

Protect video clips, overlays, and placeholders from unwanted edits using CE.SDK's scope-based permission system.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.82.0-nightly.20260823/engine-guides-lock-video-design)

<EngineReferenceNote {...props} />

CE.SDK uses global scopes and block-level scopes to decide which editing operations are allowed. For video designs, the same model can lock the whole scene, keep watermarks protected, and make only selected clips or overlays editable.

The backing sample creates a small headless video scene with one clip, one editable title overlay, and one locked watermark. Those blocks provide context for the scope calls below.

## Understanding Scope Permissions

Scopes control what operations users can perform on video clips, text overlays, watermarks, and other design blocks. CE.SDK combines global scope settings with block-level settings to determine the effective permission.

| Global Scope        | Block Scope | Result    |
| ------------------- | ----------- | --------- |
| `GlobalScope.ALLOW` | any         | Permitted |
| `GlobalScope.DENY`  | any         | Blocked   |
| `GlobalScope.DEFER` | enabled     | Permitted |
| `GlobalScope.DEFER` | disabled    | Blocked   |

Global scopes have three possible values:

- **`GlobalScope.ALLOW`**: The operation is always permitted, regardless of block-level settings
- **`GlobalScope.DENY`**: The operation is always blocked, regardless of block-level settings
- **`GlobalScope.DEFER`**: The permission depends on the block-level scope setting

Block-level scopes are binary. They only take effect when the matching global scope is set to `GlobalScope.DEFER`.

## Lock the Entire Video Design

To lock all editing operations, discover the current scope keys with `engine.editor.findAllScopes()` and set each global scope to `GlobalScope.DENY`.

```kotlin highlight-android-lock-video-design
val scopes = engine.editor.findAllScopes()
scopes.forEach { scope ->
    engine.editor.setGlobalScope(key = scope, globalScope = GlobalScope.DENY)
}
```

When all scopes are denied, users cannot select, move, edit text, replace fills, or delete blocks. This also prevents changes to video clips and overlays until you explicitly defer a scope.

## Enable Selection for Editable Video Blocks

Before users can interact with any block, enable `editor/select`. Setting the global scope to `GlobalScope.DEFER` delegates the decision to each block, so only selected clips or overlays become interactive.

```kotlin highlight-android-enable-selection
engine.editor.setGlobalScope(key = "editor/select", globalScope = GlobalScope.DEFER)
engine.block.setScopeEnabled(videoClip, key = "editor/select", enabled = true)
engine.block.setScopeEnabled(titleOverlay, key = "editor/select", enabled = true)
engine.block.setScopeEnabled(watermarkOverlay, key = "editor/select", enabled = false)
```

## Selective Video Locking Patterns

Lock everything first, then selectively enable the capabilities that each video block needs. This keeps the default state restrictive while allowing controlled editing.

### Text Overlay Editing

Enable `text/edit` for text changes and `text/character` when users should also adjust text styling. The sample applies both scopes only to the title overlay.

```kotlin highlight-android-text-overlay-editing
engine.editor.setGlobalScope(key = "text/edit", globalScope = GlobalScope.DEFER)
engine.editor.setGlobalScope(key = "text/character", globalScope = GlobalScope.DEFER)
engine.block.setScopeEnabled(titleOverlay, key = "text/edit", enabled = true)
engine.block.setScopeEnabled(titleOverlay, key = "text/character", enabled = true)
```

The title text can now be edited while unrelated layout, fill, and lifecycle operations stay locked unless another section enables them.

### Video Clip Replacement

Enable `fill/change` on a video placeholder when users may replace the media source but should not change layout. The sample keeps movement, resize, and rotation denied on the video clip.

```kotlin highlight-android-video-replacement
engine.editor.setGlobalScope(key = "fill/change", globalScope = GlobalScope.DEFER)
engine.block.setScopeEnabled(videoClip, key = "fill/change", enabled = true)
```

### Overlay Layout Adjustments

Enable layout scopes only for blocks that users may reposition. The sample allows moving, resizing, and rotating the title overlay while keeping the video clip layout fixed.

```kotlin highlight-android-layout-adjustments
engine.editor.setGlobalScope(key = "layer/move", globalScope = GlobalScope.DEFER)
engine.editor.setGlobalScope(key = "layer/resize", globalScope = GlobalScope.DEFER)
engine.editor.setGlobalScope(key = "layer/rotate", globalScope = GlobalScope.DEFER)
engine.block.setScopeEnabled(titleOverlay, key = "layer/move", enabled = true)
engine.block.setScopeEnabled(titleOverlay, key = "layer/resize", enabled = true)
engine.block.setScopeEnabled(titleOverlay, key = "layer/rotate", enabled = true)
```

### Protected Overlays

Keep scopes disabled for watermarks, legal text, brand marks, or other protected overlays. Explicitly disabling the relevant block-level scopes makes the intent clear when the matching global scopes are deferred elsewhere.

```kotlin highlight-android-protect-overlay
val lockedOverlayScopes = listOf(
    "editor/select",
    "text/edit",
    "text/character",
    "fill/change",
    "layer/move",
    "layer/resize",
    "layer/rotate",
    "lifecycle/destroy",
)
lockedOverlayScopes.forEach { scope ->
    engine.block.setScopeEnabled(watermarkOverlay, key = scope, enabled = false)
}
```

## Check Effective Permissions

Use `engine.block.isAllowedByScope()` to verify what the current scope configuration actually permits. This method evaluates both global and block-level settings.

```kotlin highlight-android-check-permissions
        val canSelectVideoClip = engine.block.isAllowedByScope(videoClip, key = "editor/select")
        val canReplaceVideoClip = engine.block.isAllowedByScope(videoClip, key = "fill/change")
        val canMoveVideoClip = engine.block.isAllowedByScope(videoClip, key = "layer/move")
        val canEditTitle = engine.block.isAllowedByScope(titleOverlay, key = "text/edit")
        val canMoveTitle = engine.block.isAllowedByScope(titleOverlay, key = "layer/move")
        val canSelectWatermark = engine.block.isAllowedByScope(watermarkOverlay, key = "editor/select")
        val titleTextScopeEnabled = engine.block.isScopeEnabled(titleOverlay, key = "text/edit")
        val textEditGlobalScope = engine.editor.getGlobalScope(key = "text/edit")

        require(canSelectVideoClip)
        require(canReplaceVideoClip)
        require(!canMoveVideoClip)
        require(canEditTitle)
        require(canMoveTitle)
        require(!canSelectWatermark)
        require(titleTextScopeEnabled)
        require(textEditGlobalScope == GlobalScope.DEFER)
```

The distinction between checking methods is:

- `isAllowedByScope()` returns the **effective permission** after evaluating both levels
- `isScopeEnabled()` returns only the **block-level setting**
- `getGlobalScope()` returns only the **global setting**

## Discover Available Scopes

Use `engine.editor.findAllScopes()` instead of hardcoding a complete scope list. This keeps locking code aligned with the scopes available in the current engine.

```kotlin highlight-android-discover-scopes
val availableScopes = engine.editor.findAllScopes()
val currentScopeSettings = availableScopes.associateWith { scope ->
    engine.editor.getGlobalScope(key = scope)
}
require("editor/select" in availableScopes)
require("fill/change" in availableScopes)
require(currentScopeSettings["editor/select"] == GlobalScope.DEFER)
```

## Available Scopes Reference

| Scope                    | Description                              |
| ------------------------ | ---------------------------------------- |
| `layer/move`             | Move block position                      |
| `layer/resize`           | Resize block dimensions                  |
| `layer/rotate`           | Rotate block                             |
| `layer/flip`             | Flip block horizontally or vertically    |
| `layer/crop`             | Crop block content                       |
| `layer/opacity`          | Change block opacity                     |
| `layer/blendMode`        | Change blend mode                        |
| `layer/visibility`       | Toggle block visibility                  |
| `layer/clipping`         | Change clipping behavior                 |
| `fill/change`            | Change fill content or text color        |
| `fill/changeType`        | Change fill type                         |
| `stroke/change`          | Change stroke properties                 |
| `shape/change`           | Change shape type                        |
| `text/edit`              | Edit text content                        |
| `text/character`         | Change text styling such as font or size |
| `appearance/adjustments` | Change color adjustments                 |
| `appearance/filter`      | Apply or change filters                  |
| `appearance/effect`      | Apply or change effects                  |
| `appearance/blur`        | Apply or change blur                     |
| `appearance/shadow`      | Apply or change shadows                  |
| `appearance/animation`   | Apply or change animations               |
| `lifecycle/destroy`      | Delete the block                         |
| `lifecycle/duplicate`    | Duplicate the block                      |
| `editor/add`             | Add new blocks                           |
| `editor/select`          | Select blocks                            |

## Troubleshooting

| Issue                              | Cause                                   | Solution                                                    |
| ---------------------------------- | --------------------------------------- | ----------------------------------------------------------- |
| Block is still editable            | The global scope is `GlobalScope.ALLOW` | Set the global scope to `GlobalScope.DENY` or `GlobalScope.DEFER` |
| Block is unexpectedly locked       | The global scope is `GlobalScope.DENY`  | Set the global scope to `GlobalScope.DEFER` and enable the block-level scope |
| Users cannot select a block        | `editor/select` is still locked         | Enable `editor/select` for blocks users should select       |
| Permission check returns `false`   | The code checks the wrong scope level   | Use `isAllowedByScope()` for the effective permission       |
| New scopes are not locked          | The code uses a hardcoded scope list    | Use `findAllScopes()` to discover scopes dynamically        |

## API Reference

| Method | Purpose |
| ------ | ------- |
| `engine.editor.findAllScopes()` | Get all available scope names |
| `engine.editor.setGlobalScope(key=_, globalScope=_)` | Set a global scope to `GlobalScope.ALLOW`, `GlobalScope.DENY`, or `GlobalScope.DEFER` |
| `engine.editor.getGlobalScope(key=_)` | Get the current global setting for one scope |
| `engine.block.setScopeEnabled(block=_, key=_, enabled=_)` | Enable or disable a scope on one block |
| `engine.block.isScopeEnabled(block=_, key=_)` | Check only the block-level scope setting |
| `engine.block.isAllowedByScope(block=_, key=_)` | Check the effective permission after global and block-level scopes are evaluated |

## Next Steps

- [Lock Content](../rules/lock-content.md) - Lock design elements to prevent unwanted modifications using CE.SDK's scope-based permission system
- [Lock Templates](../create-templates/lock.md) - Lock templates for consistent reuse
- [Rules Overview](../rules/overview.md) - Understand the broader rules system



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
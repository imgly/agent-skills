> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Automate Workflows](../automation.md) > [Auto-Resize](./auto-resize.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-auto-resize/AutoResize.kt reference-only
@file:Suppress("ktlint:standard:filename")

import kotlinx.coroutines.withContext
import kotlinx.coroutines.yield
import ly.img.engine.Color
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.FillType
import ly.img.engine.ShapeType
import ly.img.engine.SizeMode

data class AutoResizeMetrics(
    val titleWidth: Float,
    val titleHeight: Float,
    val subtitleWidth: Float,
    val titleWidthMode: SizeMode,
    val titleHeightMode: SizeMode,
    val backgroundWidthMode: SizeMode,
    val backgroundHeightMode: SizeMode,
)

suspend fun autoResize(engine: Engine): AutoResizeMetrics = withContext(engine.dispatcher) {
    runAutoResizeGuide(engine)
}

private suspend fun runAutoResizeGuide(engine: Engine): AutoResizeMetrics {
    val scene = engine.scene.create()
    val page = engine.block.create(DesignBlockType.Page)
    engine.block.setWidth(page, value = 800F)
    engine.block.setHeight(page, value = 600F)
    engine.block.appendChild(parent = scene, child = page)

    val titleBlock = engine.block.create(DesignBlockType.Text)
    engine.block.replaceText(titleBlock, text = "Auto-Resize Demo")
    engine.block.setFloat(titleBlock, property = "text/fontSize", value = 64F)
    engine.block.setWidthMode(titleBlock, mode = SizeMode.AUTO)
    engine.block.setHeightMode(titleBlock, mode = SizeMode.AUTO)
    engine.block.appendChild(parent = page, child = titleBlock)

    val coverBlock = engine.block.create(DesignBlockType.Graphic)
    engine.block.setShape(coverBlock, shape = engine.block.createShape(ShapeType.Rect))
    val coverFill = engine.block.createFill(FillType.Color)
    engine.block.setColor(
        coverFill,
        property = "fill/color/value",
        value = Color.fromRGBA(r = 1F, g = 1F, b = 1F, a = 0.08F),
    )
    engine.block.setFill(coverBlock, fill = coverFill)
    engine.block.appendChild(parent = page, child = coverBlock)
    engine.block.fillParent(coverBlock)
    engine.block.destroy(coverBlock)

    yield()

    val titleWidth = engine.block.getFrameWidth(titleBlock)
    val titleHeight = engine.block.getFrameHeight(titleBlock)
    println("Title dimensions: ${titleWidth.toInt()}x${titleHeight.toInt()} pixels")

    val pageWidth = engine.block.getWidth(page)
    val pageHeight = engine.block.getHeight(page)
    val centerX = (pageWidth - titleWidth) / 2F
    val centerY = (pageHeight - titleHeight) / 2F - 100F
    engine.block.setPositionX(titleBlock, value = centerX)
    engine.block.setPositionY(titleBlock, value = centerY)

    val backgroundBlock = engine.block.create(DesignBlockType.Graphic)
    engine.block.setShape(backgroundBlock, shape = engine.block.createShape(ShapeType.Rect))
    val backgroundFill = engine.block.createFill(FillType.Color)
    engine.block.setColor(
        backgroundFill,
        property = "fill/color/value",
        value = Color.fromRGBA(r = 0.2F, g = 0.4F, b = 0.8F, a = 0.3F),
    )
    engine.block.setFill(backgroundBlock, fill = backgroundFill)
    engine.block.setWidthMode(backgroundBlock, mode = SizeMode.PERCENT)
    engine.block.setHeightMode(backgroundBlock, mode = SizeMode.PERCENT)
    engine.block.setWidth(backgroundBlock, value = 0.8F)
    engine.block.setHeight(backgroundBlock, value = 0.3F)
    engine.block.setPositionX(backgroundBlock, value = pageWidth * 0.1F)
    engine.block.setPositionY(backgroundBlock, value = pageHeight * 0.6F)
    engine.block.appendChild(parent = page, child = backgroundBlock)
    engine.block.sendToBack(backgroundBlock)

    val subtitleBlock = engine.block.create(DesignBlockType.Text)
    engine.block.replaceText(subtitleBlock, text = "Text automatically sizes to fit content")
    engine.block.setFloat(subtitleBlock, property = "text/fontSize", value = 32F)
    engine.block.setWidthMode(subtitleBlock, mode = SizeMode.AUTO)
    engine.block.setHeightMode(subtitleBlock, mode = SizeMode.AUTO)
    engine.block.appendChild(parent = page, child = subtitleBlock)

    yield()

    val subtitleWidth = engine.block.getFrameWidth(subtitleBlock)
    val subtitleCenterX = (pageWidth - subtitleWidth) / 2F
    engine.block.setPositionX(subtitleBlock, value = subtitleCenterX)
    engine.block.setPositionY(subtitleBlock, value = pageHeight * 0.7F)

    val titleWidthMode = engine.block.getWidthMode(titleBlock)
    val titleHeightMode = engine.block.getHeightMode(titleBlock)
    val backgroundWidthMode = engine.block.getWidthMode(backgroundBlock)
    val backgroundHeightMode = engine.block.getHeightMode(backgroundBlock)
    println("Title modes: width=$titleWidthMode, height=$titleHeightMode")
    println("Background modes: width=$backgroundWidthMode, height=$backgroundHeightMode")

    engine.block.forceLoadResources(listOf(titleBlock, subtitleBlock))

    return AutoResizeMetrics(
        titleWidth = titleWidth,
        titleHeight = titleHeight,
        subtitleWidth = subtitleWidth,
        titleWidthMode = titleWidthMode,
        titleHeightMode = titleHeightMode,
        backgroundWidthMode = backgroundWidthMode,
        backgroundHeightMode = backgroundHeightMode,
    )
}
```

Configure blocks to size themselves from fixed values, their parent, or their content. On Android, use `SizeMode.ABSOLUTE`, `SizeMode.PERCENT`, and `SizeMode.AUTO` on each axis, then read `getFrameWidth()` and `getFrameHeight()` after layout when you need the computed result.

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.81.0-nightly.20260809/engine-guides-auto-resize)

<EngineReferenceNote {...props} />

This example uses a title with Auto mode, a background panel with Percent mode, and computed frame sizes to center text. Android also exposes `fillParent()` as a shortcut when an attached block should cover its parent in one call.

## Create a Reference Page

Create a design scene with an 800 by 600 page so the percent-mode values have a predictable parent size.

```kotlin highlight-android-setup
val scene = engine.scene.create()
val page = engine.block.create(DesignBlockType.Page)
engine.block.setWidth(page, value = 800F)
engine.block.setHeight(page, value = 600F)
engine.block.appendChild(parent = scene, child = page)
```

## Size modes

- `SizeMode.ABSOLUTE` is the default. Width and height are design units that you control directly with `setWidth()` and `setHeight()`.
- `SizeMode.PERCENT` interprets width and height as normalized parent-relative values. `1.0F` means 100 percent of the parent on that axis.
- `SizeMode.AUTO` lets the engine compute the block size from its content. This is most useful for text and other intrinsic-content blocks.

## Auto mode for text

Use Auto mode when content should decide the final frame. Here the title expands to fit its text instead of using a hard-coded width.

```kotlin highlight-android-auto-mode
val titleBlock = engine.block.create(DesignBlockType.Text)
engine.block.replaceText(titleBlock, text = "Auto-Resize Demo")
engine.block.setFloat(titleBlock, property = "text/fontSize", value = 64F)
engine.block.setWidthMode(titleBlock, mode = SizeMode.AUTO)
engine.block.setHeightMode(titleBlock, mode = SizeMode.AUTO)
engine.block.appendChild(parent = page, child = titleBlock)
```

## Fill the parent in one call

When a block is already attached to a parent and should cover it completely, Android offers a convenience API:

```kotlin highlight-android-fill-parent
engine.block.fillParent(coverBlock)
```

`fillParent()` also resets crop values when needed and can switch a crop-based fill to cover so the block stays in a valid state.

## Read computed frame dimensions

Layout values are not the same as the raw width and height properties in Auto mode. Read frame dimensions after the engine has performed a layout update.

```kotlin highlight-android-read-frame-dimensions
val titleWidth = engine.block.getFrameWidth(titleBlock)
val titleHeight = engine.block.getFrameHeight(titleBlock)
println("Title dimensions: ${titleWidth.toInt()}x${titleHeight.toInt()} pixels")
```

If you query frame size immediately after changing content, yield to the next coroutine turn or another engine update before reading.

## Center the block with frame dimensions

Once you have the computed title size, use the page dimensions to place it precisely.

```kotlin highlight-android-center-block
val pageWidth = engine.block.getWidth(page)
val pageHeight = engine.block.getHeight(page)
val centerX = (pageWidth - titleWidth) / 2F
val centerY = (pageHeight - titleHeight) / 2F - 100F
engine.block.setPositionX(titleBlock, value = centerX)
engine.block.setPositionY(titleBlock, value = centerY)
```

This pattern is useful whenever content length changes between generated outputs.

## Percent mode for responsive layouts

Percent mode makes a block track its parent. The example uses 80 percent width, 30 percent height, with a 10 percent left margin and a 60 percent top offset.

```kotlin highlight-android-percent-mode
val backgroundBlock = engine.block.create(DesignBlockType.Graphic)
engine.block.setShape(backgroundBlock, shape = engine.block.createShape(ShapeType.Rect))
val backgroundFill = engine.block.createFill(FillType.Color)
engine.block.setColor(
    backgroundFill,
    property = "fill/color/value",
    value = Color.fromRGBA(r = 0.2F, g = 0.4F, b = 0.8F, a = 0.3F),
)
engine.block.setFill(backgroundBlock, fill = backgroundFill)
engine.block.setWidthMode(backgroundBlock, mode = SizeMode.PERCENT)
engine.block.setHeightMode(backgroundBlock, mode = SizeMode.PERCENT)
engine.block.setWidth(backgroundBlock, value = 0.8F)
engine.block.setHeight(backgroundBlock, value = 0.3F)
engine.block.setPositionX(backgroundBlock, value = pageWidth * 0.1F)
engine.block.setPositionY(backgroundBlock, value = pageHeight * 0.6F)
engine.block.appendChild(parent = page, child = backgroundBlock)
engine.block.sendToBack(backgroundBlock)
```

Because values are normalized, the same layout logic adapts to different page sizes without recalculating pixel dimensions.

## Additional auto-sized content

You can repeat the same pattern for other text blocks. This subtitle uses Auto mode and recenters itself from its computed width.

```kotlin highlight-android-subtitle-auto
    val subtitleBlock = engine.block.create(DesignBlockType.Text)
    engine.block.replaceText(subtitleBlock, text = "Text automatically sizes to fit content")
    engine.block.setFloat(subtitleBlock, property = "text/fontSize", value = 32F)
    engine.block.setWidthMode(subtitleBlock, mode = SizeMode.AUTO)
    engine.block.setHeightMode(subtitleBlock, mode = SizeMode.AUTO)
    engine.block.appendChild(parent = page, child = subtitleBlock)

    yield()

    val subtitleWidth = engine.block.getFrameWidth(subtitleBlock)
    val subtitleCenterX = (pageWidth - subtitleWidth) / 2F
    engine.block.setPositionX(subtitleBlock, value = subtitleCenterX)
    engine.block.setPositionY(subtitleBlock, value = pageHeight * 0.7F)
```

## Verify the active modes

Query the current modes when you need to branch behavior or assert that template setup is correct.

```kotlin highlight-android-check-modes
val titleWidthMode = engine.block.getWidthMode(titleBlock)
val titleHeightMode = engine.block.getHeightMode(titleBlock)
val backgroundWidthMode = engine.block.getWidthMode(backgroundBlock)
val backgroundHeightMode = engine.block.getHeightMode(backgroundBlock)
println("Title modes: width=$titleWidthMode, height=$titleHeightMode")
println("Background modes: width=$backgroundWidthMode, height=$backgroundHeightMode")
```

## Troubleshooting

**Frame dimensions are `0` or stale**: wait for a layout pass before calling `getFrameWidth()` or `getFrameHeight()`.

**Percent sizing has no effect**: the block must be attached to a parent, and the parent needs a resolved size.

**Auto sizing does not change the block**: Auto mode is primarily useful for blocks with intrinsic content, such as text.

**A fill looks different after `fillParent()`**: the helper may reset crop values or force cover mode to keep the block valid.

## API reference

| Method                                    | Purpose                                              |
| ----------------------------------------- | ---------------------------------------------------- |
| `engine.block.getWidth(block)`            | Read the configured width value in the current mode  |
| `engine.block.setWidth(block, value)`     | Set width in the current mode                        |
| `engine.block.getWidthMode(block)`        | Read the width sizing mode                           |
| `engine.block.setWidthMode(block, mode)`  | Set the width sizing mode                            |
| `engine.block.getHeight(block)`           | Read the configured height value in the current mode |
| `engine.block.setHeight(block, value)`    | Set height in the current mode                       |
| `engine.block.getHeightMode(block)`       | Read the height sizing mode                          |
| `engine.block.setHeightMode(block, mode)` | Set the height sizing mode                           |
| `engine.block.getFrameWidth(block)`       | Read the computed width after layout                 |
| `engine.block.getFrameHeight(block)`      | Read the computed height after layout                |
| `engine.block.fillParent(block)`          | Resize and reposition a block to cover its parent    |

## Next Steps

- [Resize blocks (manual)](../edit-image/transform/resize.md) — change a block frame explicitly
  with width and height values.
- [Batch Processing](./batch-processing.md) — apply the same sizing logic across
  many records.
- [Multiple Image Generation](./multi-image-generation.md) — combine template data replacement
  with responsive layout rules.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
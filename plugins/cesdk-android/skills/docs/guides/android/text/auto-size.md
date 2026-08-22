> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Create and Edit Text](../text.md) > [Auto-Size](./auto-size.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-text-auto-size/TextAutoSize.kt reference-only
import kotlinx.coroutines.delay
import kotlinx.coroutines.yield
import ly.img.engine.Color
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.FillType
import ly.img.engine.ShapeType
import ly.img.engine.SizeMode

data class TextAutoSize(
    val autoWidthMode: SizeMode,
    val autoHeightMode: SizeMode,
    val automaticFontSizeEnabled: Boolean,
    val minAutomaticFontSize: Float,
    val maxAutomaticFontSize: Float,
    val hasClippedLines: Boolean,
)

suspend fun textAutoSize(engine: Engine): TextAutoSize {
    val scene = engine.scene.create()
    val page = engine.block.create(DesignBlockType.Page)
    engine.block.setWidth(page, value = 800F)
    engine.block.setHeight(page, value = 600F)
    engine.block.appendChild(parent = scene, child = page)

    val background = engine.block.create(DesignBlockType.Graphic)
    engine.block.setShape(background, shape = engine.block.createShape(ShapeType.Rect))
    engine.block.setWidth(background, value = 800F)
    engine.block.setHeight(background, value = 600F)
    engine.block.setFill(background, fill = engine.block.createFill(FillType.Color))
    engine.block.setFillSolidColor(background, color = Color.fromHex("#FFF7F5EF"))
    engine.block.appendChild(parent = page, child = background)

    val autoText = engine.block.create(DesignBlockType.Text)
    engine.block.appendChild(parent = page, child = autoText)
    engine.block.setWidthMode(autoText, mode = SizeMode.AUTO)
    engine.block.setHeightMode(autoText, mode = SizeMode.AUTO)
    engine.block.replaceText(autoText, text = "Auto-sized text")
    engine.block.setTextFontSize(autoText, fontSize = 48F)
    engine.block.setTextColor(autoText, color = Color.fromHex("#FF1F2937"))
    engine.block.setPositionX(autoText, value = 50F)
    engine.block.setPositionY(autoText, value = 50F)

    val wrappedText = engine.block.create(DesignBlockType.Text)
    engine.block.appendChild(parent = page, child = wrappedText)
    engine.block.setWidthMode(wrappedText, mode = SizeMode.ABSOLUTE)
    engine.block.setWidth(wrappedText, value = 250F)
    engine.block.setHeightMode(wrappedText, mode = SizeMode.AUTO)
    engine.block.replaceText(
        wrappedText,
        text = "This text has a fixed width but auto height, so it wraps to multiple lines",
    )
    engine.block.setTextFontSize(wrappedText, fontSize = 48F)
    engine.block.setTextColor(wrappedText, color = Color.fromHex("#FF334155"))
    engine.block.setPositionX(wrappedText, value = 50F)
    engine.block.setPositionY(wrappedText, value = 150F)

    val scaledText = engine.block.create(DesignBlockType.Text)
    engine.block.appendChild(parent = page, child = scaledText)
    engine.block.setWidthMode(scaledText, mode = SizeMode.ABSOLUTE)
    engine.block.setHeightMode(scaledText, mode = SizeMode.ABSOLUTE)
    engine.block.setWidth(scaledText, value = 300F)
    engine.block.setHeight(scaledText, value = 80F)
    engine.block.setBoolean(scaledText, property = "text/automaticFontSizeEnabled", value = true)
    engine.block.replaceText(scaledText, text = "Auto-scaled font")
    engine.block.setTextColor(scaledText, color = Color.fromHex("#FF1D4ED8"))
    engine.block.setPositionX(scaledText, value = 50F)
    engine.block.setPositionY(scaledText, value = 350F)

    val constrainedText = engine.block.create(DesignBlockType.Text)
    engine.block.appendChild(parent = page, child = constrainedText)
    engine.block.setWidthMode(constrainedText, mode = SizeMode.ABSOLUTE)
    engine.block.setHeightMode(constrainedText, mode = SizeMode.ABSOLUTE)
    engine.block.setWidth(constrainedText, value = 300F)
    engine.block.setHeight(constrainedText, value = 80F)
    engine.block.setBoolean(constrainedText, property = "text/automaticFontSizeEnabled", value = true)
    engine.block.setFloat(constrainedText, property = "text/minAutomaticFontSize", value = 12F)
    engine.block.setFloat(constrainedText, property = "text/maxAutomaticFontSize", value = 48F)
    engine.block.replaceText(
        constrainedText,
        text = "Edit this text to see automatic font scaling in a 12-48 pt range",
    )
    engine.block.setTextColor(constrainedText, color = Color.fromHex("#FF7C2D12"))
    engine.block.setPositionX(constrainedText, value = 50F)
    engine.block.setPositionY(constrainedText, value = 460F)

    val widthMode = engine.block.getWidthMode(autoText)
    val heightMode = engine.block.getHeightMode(autoText)

    val isAutomaticFontSizeEnabled = engine.block.getBoolean(
        scaledText,
        property = "text/automaticFontSizeEnabled",
    )
    val minAutomaticFontSize = engine.block.getFloat(
        constrainedText,
        property = "text/minAutomaticFontSize",
    )
    val maxAutomaticFontSize = engine.block.getFloat(
        constrainedText,
        property = "text/maxAutomaticFontSize",
    )

    val clippedText = engine.block.create(DesignBlockType.Text)
    engine.block.appendChild(parent = page, child = clippedText)
    engine.block.setWidthMode(clippedText, mode = SizeMode.ABSOLUTE)
    engine.block.setHeightMode(clippedText, mode = SizeMode.ABSOLUTE)
    engine.block.setWidth(clippedText, value = 300F)
    engine.block.setHeight(clippedText, value = 60F)
    engine.block.replaceText(
        clippedText,
        text = "This line fits.\nThis line overflows.\nThis line is clipped.",
    )
    engine.block.setTextFontSize(clippedText, fontSize = 48F)
    engine.block.setBoolean(clippedText, property = "text/clipLinesOutsideOfFrame", value = true)
    var hasClippedLines = false
    var layoutPasses = 0
    while (!hasClippedLines && layoutPasses < 10) {
        yield()
        delay(16) // Let the bound engine process a frame before reading layout-backed state.
        hasClippedLines = engine.block.getBoolean(
            clippedText,
            property = "text/hasClippedLines",
        )
        layoutPasses += 1
    }

    engine.block.setTextColor(clippedText, color = Color.fromHex("#FF991B1B"))
    engine.block.setPositionX(clippedText, value = 430F)
    engine.block.setPositionY(clippedText, value = 350F)

    return TextAutoSize(
        autoWidthMode = widthMode,
        autoHeightMode = heightMode,
        automaticFontSizeEnabled = isAutomaticFontSizeEnabled,
        minAutomaticFontSize = minAutomaticFontSize,
        maxAutomaticFontSize = maxAutomaticFontSize,
        hasClippedLines = hasClippedLines,
    )
}
```

Configure text blocks to automatically adapt their dimensions or font size for dynamic content.

![Android text auto-size example showing text blocks with auto dimensions, automatic font sizing, and clipped overflow](https://img.ly/docs/cesdk/android/text/auto-size-5331b3/assets/android.hero.webp)

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.82.0-nightly.20260822/engine-guides-text-auto-size)

<EngineReferenceNote {...props} />

CE.SDK provides two approaches for handling dynamic text content. Auto size modes let text blocks resize to fit their content, while automatic font sizing scales the font to fit within fixed boundaries.

This guide covers configuring size modes, enabling automatic font sizing, setting font size constraints, and detecting clipped text with the Android Engine APIs.

## Text Size Modes

Text blocks support `SizeMode.ABSOLUTE`, `SizeMode.PERCENT`, and `SizeMode.AUTO` for each dimension. Use `engine.block.setWidthMode()` and `engine.block.setHeightMode()` to decide whether the block keeps an explicit size, follows its parent, or grows from its content.

### Auto Width and Height

When both dimensions use `SizeMode.AUTO`, the text block expands freely to fit its content. This works well for single-line labels that grow horizontally.

```kotlin highlight-android-auto-width-height
val autoText = engine.block.create(DesignBlockType.Text)
engine.block.appendChild(parent = page, child = autoText)
engine.block.setWidthMode(autoText, mode = SizeMode.AUTO)
engine.block.setHeightMode(autoText, mode = SizeMode.AUTO)
engine.block.replaceText(autoText, text = "Auto-sized text")
engine.block.setTextFontSize(autoText, fontSize = 48F)
engine.block.setTextColor(autoText, color = Color.fromHex("#FF1F2937"))
engine.block.setPositionX(autoText, value = 50F)
engine.block.setPositionY(autoText, value = 50F)
```

We set both width and height modes to `SizeMode.AUTO`, then write the text and choose a font size. CE.SDK calculates the block dimensions from the rendered text.

### Fixed Width with Auto Height

For wrapped multi-line text, keep the width fixed and let the height adjust. The text wraps within the defined width and the block grows vertically as needed.

```kotlin highlight-android-fixed-width-auto-height
val wrappedText = engine.block.create(DesignBlockType.Text)
engine.block.appendChild(parent = page, child = wrappedText)
engine.block.setWidthMode(wrappedText, mode = SizeMode.ABSOLUTE)
engine.block.setWidth(wrappedText, value = 250F)
engine.block.setHeightMode(wrappedText, mode = SizeMode.AUTO)
engine.block.replaceText(
    wrappedText,
    text = "This text has a fixed width but auto height, so it wraps to multiple lines",
)
engine.block.setTextFontSize(wrappedText, fontSize = 48F)
engine.block.setTextColor(wrappedText, color = Color.fromHex("#FF334155"))
engine.block.setPositionX(wrappedText, value = 50F)
engine.block.setPositionY(wrappedText, value = 150F)
```

This pattern is useful for template placeholders where the width should stay aligned with the design but content length varies.

### Querying Size Modes

Read current modes with `engine.block.getWidthMode()` and `engine.block.getHeightMode()`.

```kotlin highlight-android-query-size-modes
val widthMode = engine.block.getWidthMode(autoText)
val heightMode = engine.block.getHeightMode(autoText)
```

## Automatic Font Sizing

For text blocks with bounded dimensions, enable automatic font sizing to scale the font within the frame. The engine calculates the largest font size that fits the content.

```kotlin highlight-android-automatic-font-sizing
val scaledText = engine.block.create(DesignBlockType.Text)
engine.block.appendChild(parent = page, child = scaledText)
engine.block.setWidthMode(scaledText, mode = SizeMode.ABSOLUTE)
engine.block.setHeightMode(scaledText, mode = SizeMode.ABSOLUTE)
engine.block.setWidth(scaledText, value = 300F)
engine.block.setHeight(scaledText, value = 80F)
engine.block.setBoolean(scaledText, property = "text/automaticFontSizeEnabled", value = true)
engine.block.replaceText(scaledText, text = "Auto-scaled font")
engine.block.setTextColor(scaledText, color = Color.fromHex("#FF1D4ED8"))
engine.block.setPositionX(scaledText, value = 50F)
engine.block.setPositionY(scaledText, value = 350F)
```

The example uses `SizeMode.ABSOLUTE` for both dimensions before enabling `text/automaticFontSizeEnabled`. `SizeMode.PERCENT` can also work when the parent provides concrete dimensions; automatic font sizing only has a bounded frame to solve against when neither dimension is `SizeMode.AUTO`.

### Setting Font Size Constraints

Constrain the automatic scaling range with `text/minAutomaticFontSize` and `text/maxAutomaticFontSize`. These constraints apply to the automatic sizing algorithm, not to manual font size edits made elsewhere in your app.

```kotlin highlight-android-font-size-constraints
val constrainedText = engine.block.create(DesignBlockType.Text)
engine.block.appendChild(parent = page, child = constrainedText)
engine.block.setWidthMode(constrainedText, mode = SizeMode.ABSOLUTE)
engine.block.setHeightMode(constrainedText, mode = SizeMode.ABSOLUTE)
engine.block.setWidth(constrainedText, value = 300F)
engine.block.setHeight(constrainedText, value = 80F)
engine.block.setBoolean(constrainedText, property = "text/automaticFontSizeEnabled", value = true)
engine.block.setFloat(constrainedText, property = "text/minAutomaticFontSize", value = 12F)
engine.block.setFloat(constrainedText, property = "text/maxAutomaticFontSize", value = 48F)
engine.block.replaceText(
    constrainedText,
    text = "Edit this text to see automatic font scaling in a 12-48 pt range",
)
engine.block.setTextColor(constrainedText, color = Color.fromHex("#FF7C2D12"))
engine.block.setPositionX(constrainedText, value = 50F)
engine.block.setPositionY(constrainedText, value = 460F)
```

With constraints set, the font size scales within the 12-48 pt range as content length changes. Use minimum values to keep dynamic text readable and maximum values to preserve the design hierarchy.

## Text Clipping

New text blocks clip overflowing lines by default. Use a bounded frame when text must stay inside a fixed area, keep or set `text/clipLinesOutsideOfFrame` to `true`, then read `text/hasClippedLines` after the engine has updated text layout. The property is layout-backed, so the sample waits for the bound engine update loop to advance layout before reading the value.

```kotlin highlight-android-text-clipping
val clippedText = engine.block.create(DesignBlockType.Text)
engine.block.appendChild(parent = page, child = clippedText)
engine.block.setWidthMode(clippedText, mode = SizeMode.ABSOLUTE)
engine.block.setHeightMode(clippedText, mode = SizeMode.ABSOLUTE)
engine.block.setWidth(clippedText, value = 300F)
engine.block.setHeight(clippedText, value = 60F)
engine.block.replaceText(
    clippedText,
    text = "This line fits.\nThis line overflows.\nThis line is clipped.",
)
engine.block.setTextFontSize(clippedText, fontSize = 48F)
engine.block.setBoolean(clippedText, property = "text/clipLinesOutsideOfFrame", value = true)
var hasClippedLines = false
var layoutPasses = 0
while (!hasClippedLines && layoutPasses < 10) {
    yield()
    delay(16) // Let the bound engine process a frame before reading layout-backed state.
    hasClippedLines = engine.block.getBoolean(
        clippedText,
        property = "text/hasClippedLines",
    )
    layoutPasses += 1
}
```

The clipping readback helps you decide whether to enable automatic font sizing, switch the height mode to `SizeMode.AUTO`, or adjust the frame dimensions.

## API Reference

| Method | Purpose |
| --- | --- |
| `engine.block.create(blockType=DesignBlockType.Text)` | Create a text block. |
| `engine.block.appendChild(parent=_, child=_)` | Add the text block to the scene hierarchy. |
| `engine.block.replaceText(block=_, text=_)` | Set the full text content. |
| `engine.block.setWidthMode(block=_, mode=_)` | Set the text block's width mode. |
| `engine.block.getWidthMode(block=_)` | Read the current width mode. |
| `engine.block.setHeightMode(block=_, mode=_)` | Set the text block's height mode. |
| `engine.block.getHeightMode(block=_)` | Read the current height mode. |
| `engine.block.setWidth(block=_, value=_, maintainCrop=false)` | Set an explicit text block width. |
| `engine.block.setHeight(block=_, value=_, maintainCrop=false)` | Set an explicit text block height. |
| `engine.block.setPositionX(block=_, value=_)` | Position the text block on the x-axis. |
| `engine.block.setPositionY(block=_, value=_)` | Position the text block on the y-axis. |
| `engine.block.setTextFontSize(block=_, fontSize=_)` | Set the base text font size. |
| `engine.block.setTextColor(block=_, color=_)` | Set the text color. |
| `engine.block.setBoolean(block=_, property="text/automaticFontSizeEnabled", value=_)` | Enable or disable automatic font sizing. |
| `engine.block.getBoolean(block=_, property="text/automaticFontSizeEnabled")` | Read whether automatic font sizing is enabled. |
| `engine.block.setFloat(block=_, property="text/minAutomaticFontSize", value=_)` | Set the minimum automatic font size. |
| `engine.block.getFloat(block=_, property="text/minAutomaticFontSize")` | Read the minimum automatic font size. |
| `engine.block.setFloat(block=_, property="text/maxAutomaticFontSize", value=_)` | Set the maximum automatic font size. |
| `engine.block.getFloat(block=_, property="text/maxAutomaticFontSize")` | Read the maximum automatic font size. |
| `engine.block.setBoolean(block=_, property="text/clipLinesOutsideOfFrame", value=_)` | Hide or show text lines outside the frame. |
| `engine.block.getBoolean(block=_, property="text/hasClippedLines")` | Detect whether hidden text lines overflow the frame. |

## Troubleshooting

| Issue | Cause | Solution |
| --- | --- | --- |
| Text does not resize | One dimension still uses `SizeMode.ABSOLUTE` | Set both dimensions to `SizeMode.AUTO` for free-growing text, or combine fixed width with `SizeMode.AUTO` height for wrapped text |
| Font size does not scale | The text block does not have bounded width and height, or `text/automaticFontSizeEnabled` is disabled | Use non-auto width and height modes such as `SizeMode.ABSOLUTE`, or `SizeMode.PERCENT` with a concrete parent size, then enable automatic font sizing |
| Text becomes too small | The automatic font size range has no readable lower bound | Set `text/minAutomaticFontSize` to the smallest acceptable size for the design |
| Text is clipped unexpectedly | A fixed frame is hiding overflow without automatic font sizing | Check `text/hasClippedLines`, enable automatic font sizing, or switch the height mode to `SizeMode.AUTO` |

## Next Steps

- [Text Styling](./styling.md) - Apply fonts, colors, alignment, and other styling options to customize text appearance.
- [Adjust Text Spacing](./adjust-spacing.md) - Control letter spacing, line height, and paragraph spacing in text blocks.
- [Customize Fonts](./custom-fonts.md) - Load and manage custom fonts to match brand guidelines or user preferences.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Outlines](../outlines.md) > [Using Strokes](./strokes.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-outlines-stroke/UsingStrokes.kt reference-only
import ly.img.engine.Color
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.FillType
import ly.img.engine.RGBAColor
import ly.img.engine.ShapeType
import ly.img.engine.StrokeCornerGeometry
import ly.img.engine.StrokePosition
import ly.img.engine.StrokeStyle

fun usingStrokes(engine: Engine): UsingStrokesResult? {
    val scene = engine.scene.create()

    val page = engine.block.create(DesignBlockType.Page)
    engine.block.setWidth(page, value = 800F)
    engine.block.setHeight(page, value = 600F)
    engine.block.appendChild(parent = scene, child = page)

    val block = engine.block.create(DesignBlockType.Graphic)
    engine.block.setShape(block, shape = engine.block.createShape(ShapeType.Rect))
    engine.block.setWidth(block, value = 400F)
    engine.block.setHeight(block, value = 300F)
    engine.block.setPositionX(block, value = 200F)
    engine.block.setPositionY(block, value = 150F)
    engine.block.setFill(block, fill = engine.block.createFill(FillType.Color))
    engine.block.setFillSolidColor(
        block = block,
        color = Color.fromRGBA(r = 0.95F, g = 0.95F, b = 0.95F, a = 1F),
    )
    engine.block.appendChild(parent = page, child = block)

    val canHaveStroke = engine.block.supportsStroke(block = block)
    if (!canHaveStroke) {
        return null
    }

    engine.block.setStrokeEnabled(block = block, enabled = true)
    val strokeIsEnabled = engine.block.isStrokeEnabled(block = block)

    engine.block.setStrokeColor(
        block = block,
        color = Color.fromRGBA(r = 0F, g = 0.4F, b = 0.9F, a = 1F),
    )
    val strokeColor = engine.block.getStrokeColor(block = block)

    engine.block.setStrokeWidth(block = block, width = 8F)
    val strokeWidth = engine.block.getStrokeWidth(block = block)

    engine.block.setStrokeStyle(block = block, style = StrokeStyle.DASHED)
    val strokeStyle = engine.block.getStrokeStyle(block = block)

    engine.block.setStrokePosition(block = block, position = StrokePosition.OUTER)
    val strokePosition = engine.block.getStrokePosition(block = block)

    engine.block.setStrokeCornerGeometry(block = block, geometry = StrokeCornerGeometry.ROUND)
    val strokeCornerGeometry = engine.block.getStrokeCornerGeometry(block = block)

    check(strokeIsEnabled)
    check(strokeColor is RGBAColor)
    check(strokeWidth > 0F)
    check(strokeStyle == StrokeStyle.DASHED)
    check(strokePosition == StrokePosition.OUTER)
    check(strokeCornerGeometry == StrokeCornerGeometry.ROUND)

    return UsingStrokesResult(
        canHaveStroke = canHaveStroke,
        strokeIsEnabled = engine.block.isStrokeEnabled(block = block),
        strokeColor = engine.block.getStrokeColor(block = block),
        strokeWidth = engine.block.getStrokeWidth(block = block),
        strokeStyle = engine.block.getStrokeStyle(block = block),
        strokePosition = engine.block.getStrokePosition(block = block),
        strokeCornerGeometry = engine.block.getStrokeCornerGeometry(block = block),
    )
}
```

```kotlin file=@cesdk_android_examples/engine-guides-outlines-stroke/UsingStrokesResult.kt reference-only
import ly.img.engine.Color
import ly.img.engine.StrokeCornerGeometry
import ly.img.engine.StrokePosition
import ly.img.engine.StrokeStyle

data class UsingStrokesResult(
    val canHaveStroke: Boolean,
    val strokeIsEnabled: Boolean = false,
    val strokeColor: Color = Color.fromRGBA(r = 0F, g = 0F, b = 0F, a = 0F),
    val strokeWidth: Float = 0F,
    val strokeStyle: StrokeStyle = StrokeStyle.SOLID,
    val strokePosition: StrokePosition = StrokePosition.CENTER,
    val strokeCornerGeometry: StrokeCornerGeometry = StrokeCornerGeometry.MITER,
)
```

Add outlines around shapes, text, and graphics to create emphasis, separation,
or decorative effects.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.81.0/engine-guides-outlines-stroke)

<EngineReferenceNote {...props} />

Strokes are visual outlines on design blocks. This guide focuses on controlling stroke color, width, line pattern, position relative to the block edge, and corner geometry through the block API. Mutating stroke properties requires the `stroke/change` scope. Additional cap, custom dash, and PDF overprint APIs are listed in the API Reference.

This guide covers the built-in Android editor controls for strokes and the programmatic APIs for applying the same settings. The code snippets use a rectangle graphic block named `block`, but the same API calls apply to any block after `supportsStroke()` returns `true`.

## Using the Built-in Stroke UI

The Android editor shows stroke controls in the Fill & Stroke sheet, represented by `SheetType.FillStroke`, for selected blocks that support strokes and allow the `stroke/change` scope. That sheet can render fill controls, stroke controls, or both depending on the selected block. The color row controls stroke on/off: choosing no color disables the stroke, while choosing a swatch or custom color enables and colors it.

- **No-color and color swatches** - Disable the stroke or apply a preset RGBA stroke color
- **Color picker** - Choose a custom stroke color
- **Width slider** - Adjust stroke thickness in design units
- **Style property picker** - Select solid, dashed, rounded-dashed, dotted, long-dashed, or long round-ended dashed patterns
- **Position and join property pickers** - Adjust stroke placement and corner joins when available for the selected block

## Checking Stroke Support

Before applying stroke settings, check whether the block supports strokes. Return before the mutation calls when `supportsStroke()` is `false`.

```kotlin highlight-android-check-support
val canHaveStroke = engine.block.supportsStroke(block = block)
if (!canHaveStroke) {
    return null
}
```

## Enabling Strokes

Enable strokes with `setStrokeEnabled()`, then read the state back with `isStrokeEnabled()` when your app needs to update UI or validate the change.

```kotlin highlight-android-enable-stroke
engine.block.setStrokeEnabled(block = block, enabled = true)
val strokeIsEnabled = engine.block.isStrokeEnabled(block = block)
```

## Setting Stroke Color

Use `setStrokeColor()` with normalized RGBA components from `0F` to `1F`. The sample sets a blue stroke color and reads it back with `getStrokeColor()`.

```kotlin highlight-android-stroke-color
engine.block.setStrokeColor(
    block = block,
    color = Color.fromRGBA(r = 0F, g = 0.4F, b = 0.9F, a = 1F),
)
val strokeColor = engine.block.getStrokeColor(block = block)
```

## Setting Stroke Width

Set the thickness in design units with `setStrokeWidth()`. Larger values create more prominent outlines, and `getStrokeWidth()` returns the current value.

```kotlin highlight-android-stroke-width
engine.block.setStrokeWidth(block = block, width = 8F)
val strokeWidth = engine.block.getStrokeWidth(block = block)
```

## Stroke Styles

Use `setStrokeStyle()` to control the line pattern. Android exposes the available styles as `StrokeStyle` enum values:

- **`StrokeStyle.SOLID`** - Continuous line
- **`StrokeStyle.DASHED`** - Square-ended dashes with gaps
- **`StrokeStyle.DASHED_ROUND`** - Round-ended dashes with gaps
- **`StrokeStyle.DOTTED`** - Circular dots
- **`StrokeStyle.LONG_DASHED`** - Longer square-ended dashes
- **`StrokeStyle.LONG_DASHED_ROUND`** - Longer round-ended dashes

```kotlin highlight-android-stroke-style
engine.block.setStrokeStyle(block = block, style = StrokeStyle.DASHED)
val strokeStyle = engine.block.getStrokeStyle(block = block)
```

## Stroke Position

Use `setStrokePosition()` to control where the stroke renders relative to the block edge:

- **`StrokePosition.CENTER`** - Centered on the edge
- **`StrokePosition.INNER`** - Rendered inside the block boundary
- **`StrokePosition.OUTER`** - Rendered outside the block boundary

Inner strokes stay within the block bounds, while outer strokes extend beyond them.

```kotlin highlight-android-stroke-position
engine.block.setStrokePosition(block = block, position = StrokePosition.OUTER)
val strokePosition = engine.block.getStrokePosition(block = block)
```

## Stroke Corner Geometry

Use `setStrokeCornerGeometry()` to control how stroke corners are joined. The effect is easiest to see on rectangular shapes.

- **`StrokeCornerGeometry.MITER`** - Sharp pointed corners
- **`StrokeCornerGeometry.ROUND`** - Smoothly curved corners
- **`StrokeCornerGeometry.BEVEL`** - Flat cut corners

```kotlin highlight-android-stroke-corner
engine.block.setStrokeCornerGeometry(block = block, geometry = StrokeCornerGeometry.ROUND)
val strokeCornerGeometry = engine.block.getStrokeCornerGeometry(block = block)
```

## Troubleshooting

If strokes do not appear as expected, check these common issues:

- **Stroke not visible** - Verify `isStrokeEnabled()` returns `true` and the width is greater than `0F`.
- **Stroke color appears wrong** - Use normalized color components from `0F` to `1F`, not `0` to `255`.
- **Stroke affects the visual bounds** - Use `StrokePosition.INNER` to keep the stroke inside the block boundary, or `StrokePosition.OUTER` when the outline should extend beyond it.
- **Block does not support strokes** - Guard mutations with `supportsStroke()` before applying stroke properties.

## API Reference

| Method | Description |
|--------|-------------|
| `engine.block.supportsStroke(block=_)` | Check whether a block supports strokes |
| `engine.block.setStrokeEnabled(block=_, enabled=_)` | Enable or disable the stroke |
| `engine.block.isStrokeEnabled(block=_)` | Check whether the stroke is enabled |
| `engine.block.setStrokeOverprint(block=_, overprint=_)` | Mark eligible spot-color strokes for PDF overprint output |
| `engine.block.getStrokeOverprint(block=_)` | Check whether stroke overprint is enabled |
| `engine.block.setStrokeColor(block=_, color=_)` | Set the stroke color |
| `engine.block.getStrokeColor(block=_)` | Get the current stroke color |
| `engine.block.setStrokeWidth(block=_, width=_)` | Set the stroke thickness in design units |
| `engine.block.getStrokeWidth(block=_)` | Get the current stroke width |
| `engine.block.setStrokeStyle(block=_, style=_)` | Set the stroke line pattern |
| `engine.block.getStrokeStyle(block=_)` | Get the current stroke style |
| `engine.block.setStrokeStartCap(block=_, cap=_)` | Set the cap at the start of an open stroked path |
| `engine.block.getStrokeStartCap(block=_)` | Get the start cap for an open stroked path |
| `engine.block.setStrokeEndCap(block=_, cap=_)` | Set the cap at the end of an open stroked path |
| `engine.block.getStrokeEndCap(block=_)` | Get the end cap for an open stroked path |
| `engine.block.setStrokeDashStartCap(block=_, cap=_)` | Set the leading cap for each dash segment |
| `engine.block.getStrokeDashStartCap(block=_)` | Get the leading cap for each dash segment |
| `engine.block.setStrokeDashEndCap(block=_, cap=_)` | Set the trailing cap for each dash segment |
| `engine.block.getStrokeDashEndCap(block=_)` | Get the trailing cap for each dash segment |
| `engine.block.setStrokeDashArray(block=_, dashArray=_)` | Set a custom dash pattern in design units |
| `engine.block.getStrokeDashArray(block=_)` | Get the custom dash pattern |
| `engine.block.setStrokeDashOffset(block=_, dashOffset=_)` | Shift the custom dash pattern along the stroke |
| `engine.block.getStrokeDashOffset(block=_)` | Get the dash pattern offset |
| `engine.block.setStrokePosition(block=_, position=_)` | Set the stroke position relative to the edge |
| `engine.block.getStrokePosition(block=_)` | Get the current stroke position |
| `engine.block.setStrokeCornerGeometry(block=_, geometry=_)` | Set the stroke corner join geometry |
| `engine.block.getStrokeCornerGeometry(block=_)` | Get the current stroke corner geometry |

### Related Types

| Type | Values | Description |
|------|--------|-------------|
| `StrokeStyle` | `SOLID`, `DASHED`, `DASHED_ROUND`, `DOTTED`, `LONG_DASHED`, `LONG_DASHED_ROUND` | Selects the preset line pattern |
| `StrokePosition` | `CENTER`, `INNER`, `OUTER` | Controls where the stroke is drawn relative to the block edge |
| `StrokeCornerGeometry` | `MITER`, `ROUND`, `BEVEL` | Controls how stroke corners join |
| `StrokeCap` | `BUTT`, `ROUND`, `SQUARE` | Controls open-path and dash-segment end caps |

## Next Steps

- [Apply Colors](../colors/apply.md) - Apply colors to design elements programmatically
- [Fills](../fills.md) - Add solid colors, gradients, images, or videos inside blocks
- [Shadows and Glows](./shadows-and-glows.md) - Add depth with shadow and glow effects
- [Create and Edit Shapes](../shapes.md) - Create shape blocks you can style with strokes



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
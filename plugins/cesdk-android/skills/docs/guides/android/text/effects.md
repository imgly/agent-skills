> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Create and Edit Text](../text.md) > [Text Effects](./effects.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-text-effects/TextEffects.kt reference-only
import ly.img.engine.Color
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.FillType
import ly.img.engine.MimeType
import ly.img.engine.ShapeType
import ly.img.engine.SizeMode
import ly.img.engine.StrokePosition
import ly.img.engine.StrokeStyle
import java.nio.ByteBuffer

suspend fun textEffects(engine: Engine): TextEffectsResult {
    val scene = engine.scene.create()

    val page = engine.block.create(DesignBlockType.Page)
    engine.block.setWidth(page, value = 800F)
    engine.block.setHeight(page, value = 500F)
    engine.block.appendChild(parent = scene, child = page)

    val background = engine.block.create(DesignBlockType.Graphic)
    engine.block.setShape(background, shape = engine.block.createShape(ShapeType.Rect))
    engine.block.setWidth(background, value = 800F)
    engine.block.setHeight(background, value = 500F)
    engine.block.setFill(background, fill = engine.block.createFill(FillType.Color))
    engine.block.setFillSolidColor(
        block = background,
        color = Color.fromHex("#FFF8FAFC"),
    )
    engine.block.appendChild(parent = page, child = background)

    val shadowText = engine.block.create(DesignBlockType.Text)
    engine.block.replaceText(shadowText, text = "Drop Shadow")
    engine.block.setTextFontSize(shadowText, fontSize = 90F)
    engine.block.setWidthMode(shadowText, mode = SizeMode.AUTO)
    engine.block.setHeightMode(shadowText, mode = SizeMode.AUTO)
    engine.block.setPositionX(shadowText, value = 50F)
    engine.block.setPositionY(shadowText, value = 50F)
    engine.block.appendChild(parent = page, child = shadowText)

    check(engine.block.supportsDropShadow(block = shadowText))
    engine.block.setDropShadowEnabled(block = shadowText, enabled = true)
    engine.block.setDropShadowColor(
        block = shadowText,
        color = Color.fromRGBA(r = 0F, g = 0F, b = 0F, a = 0.6F),
    )
    engine.block.setDropShadowOffsetX(block = shadowText, offsetX = 5F)
    engine.block.setDropShadowOffsetY(block = shadowText, offsetY = 5F)
    engine.block.setDropShadowBlurRadiusX(block = shadowText, blurRadiusX = 10F)
    engine.block.setDropShadowBlurRadiusY(block = shadowText, blurRadiusY = 10F)

    val outlineText = engine.block.create(DesignBlockType.Text)
    engine.block.replaceText(outlineText, text = "Outline")
    engine.block.setTextFontSize(outlineText, fontSize = 90F)
    engine.block.setWidthMode(outlineText, mode = SizeMode.AUTO)
    engine.block.setHeightMode(outlineText, mode = SizeMode.AUTO)
    engine.block.setPositionX(outlineText, value = 50F)
    engine.block.setPositionY(outlineText, value = 180F)
    engine.block.appendChild(parent = page, child = outlineText)

    check(engine.block.supportsStroke(block = outlineText))
    engine.block.setStrokeEnabled(block = outlineText, enabled = true)
    engine.block.setStrokeWidth(block = outlineText, width = 2F)
    engine.block.setStrokeColor(
        block = outlineText,
        color = Color.fromRGBA(r = 0.2F, g = 0.4F, b = 0.9F, a = 1F),
    )
    engine.block.setStrokeStyle(block = outlineText, style = StrokeStyle.SOLID)
    engine.block.setStrokePosition(block = outlineText, position = StrokePosition.CENTER)

    val pngData = engine.block.export(block = page, mimeType = MimeType.PNG)
    check(pngData.hasRemaining()) { "Text effects PNG export is empty" }
    val pngBytes = ByteArray(pngData.remaining())
    pngData.asReadOnlyBuffer().get(pngBytes)

    return TextEffectsResult(
        dropShadowEnabled = engine.block.isDropShadowEnabled(block = shadowText),
        dropShadowColor = engine.block.getDropShadowColor(block = shadowText),
        dropShadowOffsetX = engine.block.getDropShadowOffsetX(block = shadowText),
        dropShadowOffsetY = engine.block.getDropShadowOffsetY(block = shadowText),
        dropShadowBlurRadiusX = engine.block.getDropShadowBlurRadiusX(block = shadowText),
        dropShadowBlurRadiusY = engine.block.getDropShadowBlurRadiusY(block = shadowText),
        strokeEnabled = engine.block.isStrokeEnabled(block = outlineText),
        strokeWidth = engine.block.getStrokeWidth(block = outlineText),
        strokeColor = engine.block.getStrokeColor(block = outlineText),
        strokeStyle = engine.block.getStrokeStyle(block = outlineText),
        strokePosition = engine.block.getStrokePosition(block = outlineText),
        pngData = ByteBuffer.wrap(pngBytes).asReadOnlyBuffer(),
    )
}
```

```kotlin file=@cesdk_android_examples/engine-guides-text-effects/TextEffectsResult.kt reference-only
import ly.img.engine.Color
import ly.img.engine.StrokePosition
import ly.img.engine.StrokeStyle
import java.nio.ByteBuffer

data class TextEffectsResult(
    val dropShadowEnabled: Boolean,
    val dropShadowColor: Color,
    val dropShadowOffsetX: Float,
    val dropShadowOffsetY: Float,
    val dropShadowBlurRadiusX: Float,
    val dropShadowBlurRadiusY: Float,
    val strokeEnabled: Boolean,
    val strokeWidth: Float,
    val strokeColor: Color,
    val strokeStyle: StrokeStyle,
    val strokePosition: StrokePosition,
    val pngData: ByteBuffer,
)
```

Add visual depth and interest to text blocks using drop shadows and stroke outlines.

![Android text blocks with drop shadow and stroke outline](https://img.ly/docs/cesdk/android/text/effects-2dc9fc/assets/android.hero.webp)

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.81.1/engine-guides-text-effects)

<EngineReferenceNote {...props} />

Text effects that are directly supported on text blocks include drop shadows for depth and stroke outlines for text borders. These visual effects are distinct from text styling properties like colors, fonts, and backgrounds.

This guide covers how to apply text effects programmatically using the Block API.

## Using the Built-in Effects UI

The CE.SDK editor UI exposes stroke controls for selected text blocks through the Fill & Stroke sheet when `supportsStroke()` is `true` and the `stroke/change` scope is allowed for the block. Drop shadows are not exposed through the current Android editor UI; configure text shadows programmatically with the Block API as shown below.

For complete editor UI setup, start with the [Design Editor Starter Kit](../starterkits/design-editor.md). Generic blur, filter, and effect-stack controls belong to Filters & Effects and apply only to visual blocks that report support.

## Drop Shadows

Drop shadows add depth and emphasis to text. In Android integrations, configure text shadow properties programmatically with dedicated Block API methods.

```kotlin highlight-android-drop-shadow
check(engine.block.supportsDropShadow(block = shadowText))
engine.block.setDropShadowEnabled(block = shadowText, enabled = true)
engine.block.setDropShadowColor(
    block = shadowText,
    color = Color.fromRGBA(r = 0F, g = 0F, b = 0F, a = 0.6F),
)
engine.block.setDropShadowOffsetX(block = shadowText, offsetX = 5F)
engine.block.setDropShadowOffsetY(block = shadowText, offsetY = 5F)
engine.block.setDropShadowBlurRadiusX(block = shadowText, blurRadiusX = 10F)
engine.block.setDropShadowBlurRadiusY(block = shadowText, blurRadiusY = 10F)
```

The drop shadow API provides control over color, position, and blur. The offset values position the shadow relative to the text, while the blur radius controls shadow softness. Horizontal and vertical blur can be configured independently for asymmetric effects.

## Stroke Outlines

Stroke outlines add a colored border around text. Enable stroke with `setStrokeEnabled()`, then configure width, color, style, and position.

```kotlin highlight-android-stroke
check(engine.block.supportsStroke(block = outlineText))
engine.block.setStrokeEnabled(block = outlineText, enabled = true)
engine.block.setStrokeWidth(block = outlineText, width = 2F)
engine.block.setStrokeColor(
    block = outlineText,
    color = Color.fromRGBA(r = 0.2F, g = 0.4F, b = 0.9F, a = 1F),
)
engine.block.setStrokeStyle(block = outlineText, style = StrokeStyle.SOLID)
engine.block.setStrokePosition(block = outlineText, position = StrokePosition.CENTER)
```

The stroke width is specified in design units. Text blocks support `StrokePosition.CENTER`, `StrokePosition.INNER`, and `StrokePosition.OUTER` via `setStrokePosition()`. Stroke styles include `StrokeStyle.SOLID`, `StrokeStyle.DASHED`, `StrokeStyle.DOTTED`, and other line patterns.

## Other Effects

Text blocks do not support the blur or effect-stack APIs. Use `supportsBlur()` and `supportsEffects()` before applying those APIs to other block types, and see [Filters & Effects Overview](../filters-and-effects/overview.md) for generic block effects.

## API Reference

| Method | Purpose |
|--------|---------|
| `engine.block.supportsDropShadow(block=_)` | Check whether a block supports drop shadows |
| `engine.block.setDropShadowEnabled(block=_, enabled=_)` | Enable or disable the drop shadow |
| `engine.block.isDropShadowEnabled(block=_)` | Check whether the drop shadow is enabled |
| `engine.block.setDropShadowColor(block=_, color=_)` | Set the shadow color |
| `engine.block.getDropShadowColor(block=_)` | Get the current shadow color |
| `engine.block.setDropShadowOffsetX(block=_, offsetX=_)` | Set the horizontal shadow offset |
| `engine.block.getDropShadowOffsetX(block=_)` | Get the current horizontal shadow offset |
| `engine.block.setDropShadowOffsetY(block=_, offsetY=_)` | Set the vertical shadow offset |
| `engine.block.getDropShadowOffsetY(block=_)` | Get the current vertical shadow offset |
| `engine.block.setDropShadowBlurRadiusX(block=_, blurRadiusX=_)` | Set the horizontal blur radius |
| `engine.block.getDropShadowBlurRadiusX(block=_)` | Get the current horizontal blur radius |
| `engine.block.setDropShadowBlurRadiusY(block=_, blurRadiusY=_)` | Set the vertical blur radius |
| `engine.block.getDropShadowBlurRadiusY(block=_)` | Get the current vertical blur radius |
| `engine.block.supportsStroke(block=_)` | Check whether a block supports strokes |
| `engine.block.setStrokeEnabled(block=_, enabled=_)` | Enable or disable the stroke |
| `engine.block.isStrokeEnabled(block=_)` | Check whether the stroke is enabled |
| `engine.block.setStrokeWidth(block=_, width=_)` | Set the stroke width |
| `engine.block.getStrokeWidth(block=_)` | Get the current stroke width |
| `engine.block.setStrokeColor(block=_, color=_)` | Set the stroke color |
| `engine.block.getStrokeColor(block=_)` | Get the current stroke color |
| `engine.block.setStrokeStyle(block=_, style=_)` | Set the stroke line pattern |
| `engine.block.getStrokeStyle(block=_)` | Get the current stroke line pattern |
| `engine.block.setStrokePosition(block=_, position=_)` | Set the stroke position relative to the text edge |
| `engine.block.getStrokePosition(block=_)` | Get the current stroke position |

## Troubleshooting

**Drop shadow not visible**: Ensure `setDropShadowEnabled()` is called with `true`. Verify `supportsDropShadow()` returns `true` for the text block, then adjust the shadow color, offset, and blur so the shadow is visible against the background.

**Stroke not visible**: Ensure `setStrokeEnabled()` is called with `true` and stroke width is greater than `0F`.

**Stroke too thick or thin**: Adjust the value passed to `setStrokeWidth()` to control outline thickness.

## Next Steps

- [Text Styling](./styling.md) - Configure fonts, colors, alignment, and other styling options.
- [Using Strokes](../outlines/strokes.md) - Work with stroke controls beyond text outlines.
- [Filters & Effects Overview](../filters-and-effects/overview.md) - Explore visual effects such as blur, duotone, LUTs, and chroma keying.
- [Apply a Filter or Effect](../filters-and-effects/apply.md) - Apply, configure, stack, and manage filters and effects.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
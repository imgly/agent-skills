> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Create and Edit Text](../text.md) > [Adjust Spacing](./adjust-spacing.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-text-adjust-spacing/TextAdjustSpacing.kt reference-only
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.SizeMode

data class TextAdjustSpacing(
    val letterSpacing: Float,
    val lineHeight: Float,
    val paragraph0LineHeight: Float,
    val paragraph1LineHeight: Float,
    val resetParagraph0LineHeight: Float,
    val resetBlockLineHeight: Float,
    val paragraphSpacing: Float,
)

fun textAdjustSpacing(engine: Engine): TextAdjustSpacing {
    val scene = engine.scene.create()
    val text = engine.block.create(DesignBlockType.Text)
    engine.block.appendChild(parent = scene, child = text)
    engine.block.setWidthMode(text, mode = SizeMode.AUTO)
    engine.block.setHeightMode(text, mode = SizeMode.AUTO)
    engine.block.replaceText(text, text = "Hello\nWorld\nCE.SDK")

    engine.block.setFloat(text, property = "text/letterSpacing", value = 0.1F)
    val letterSpacing = engine.block.getFloat(text, property = "text/letterSpacing")

    engine.block.setFloat(text, property = "text/lineHeight", value = 1.5F)
    val lineHeight = engine.block.getFloat(text, property = "text/lineHeight")

    engine.block.setTextLineHeight(text, lineHeight = 2.0F, paragraphIndex = 0)
    val paragraph0LineHeight = engine.block.getTextLineHeight(text, paragraphIndex = 0)
    val paragraph1LineHeight = engine.block.getTextLineHeight(text, paragraphIndex = 1)

    engine.block.setTextLineHeight(text, lineHeight = null, paragraphIndex = 0)
    val resetParagraph0LineHeight = engine.block.getTextLineHeight(text, paragraphIndex = 0)

    engine.block.setTextLineHeight(text, lineHeight = 1.8F)
    val resetBlockLineHeight = engine.block.getTextLineHeight(text, paragraphIndex = 1)

    engine.block.setFloat(text, property = "text/paragraphSpacing", value = 1.2F)
    val paragraphSpacing = engine.block.getFloat(text, property = "text/paragraphSpacing")

    check(letterSpacing == 0.1F)
    check(lineHeight == 1.5F)
    check(paragraph0LineHeight == 2.0F)
    check(paragraph1LineHeight == 1.5F)
    check(resetParagraph0LineHeight == 1.5F)
    check(resetBlockLineHeight == 1.8F)
    check(paragraphSpacing == 1.2F)

    return TextAdjustSpacing(
        letterSpacing = letterSpacing,
        lineHeight = lineHeight,
        paragraph0LineHeight = paragraph0LineHeight,
        paragraph1LineHeight = paragraph1LineHeight,
        resetParagraph0LineHeight = resetParagraph0LineHeight,
        resetBlockLineHeight = resetBlockLineHeight,
        paragraphSpacing = paragraphSpacing,
    )
}
```

Control letter spacing, line height, and paragraph spacing in text blocks using the Block API.

![Android text spacing preview showing adjusted letter spacing, line height, and paragraph spacing](https://img.ly/docs/cesdk/android/text/adjust-spacing-c1a3b6/assets/android.hero.webp)

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.83.0-nightly.20260830/engine-guides-text-adjust-spacing)

<EngineReferenceNote {...props} />

CE.SDK stores text spacing on text blocks. Use `engine.block.setFloat()` and `engine.block.getFloat()` for block-level letter spacing, line height, and paragraph spacing. Use `engine.block.setTextLineHeight()` and `engine.block.getTextLineHeight()` when individual paragraphs need their own line-height values.

This guide focuses on the programmatic Block API. The sample operates on an existing text block with enough characters, lines, and paragraph breaks to make each spacing change observable.

## Letter Spacing

Control the horizontal space between characters with the `text/letterSpacing` property. Positive values spread characters apart, while negative values tighten them.

```kotlin highlight-android-letter-spacing
engine.block.setFloat(text, property = "text/letterSpacing", value = 0.1F)
val letterSpacing = engine.block.getFloat(text, property = "text/letterSpacing")
```

Letter spacing, also called tracking, adjusts the density of a text block without changing the text content.

## Line Height

Control the vertical distance between lines with the `text/lineHeight` property. The value is a multiplier of the font size, so `1.5F` renders lines at 150% of the font size.

```kotlin highlight-android-line-height
engine.block.setFloat(text, property = "text/lineHeight", value = 1.5F)
val lineHeight = engine.block.getFloat(text, property = "text/lineHeight")
```

This block-level value applies to every paragraph unless a paragraph has its own override.

## Per-Paragraph Line Height

Override individual paragraphs with `engine.block.setTextLineHeight()` and a zero-based `paragraphIndex`. Passing `null` clears the paragraph override, and calling `setTextLineHeight()` without a paragraph index updates the block-level value while clearing all paragraph overrides.

```kotlin highlight-android-paragraph-line-height
    engine.block.setTextLineHeight(text, lineHeight = 2.0F, paragraphIndex = 0)
    val paragraph0LineHeight = engine.block.getTextLineHeight(text, paragraphIndex = 0)
    val paragraph1LineHeight = engine.block.getTextLineHeight(text, paragraphIndex = 1)

    engine.block.setTextLineHeight(text, lineHeight = null, paragraphIndex = 0)
    val resetParagraph0LineHeight = engine.block.getTextLineHeight(text, paragraphIndex = 0)

    engine.block.setTextLineHeight(text, lineHeight = 1.8F)
    val resetBlockLineHeight = engine.block.getTextLineHeight(text, paragraphIndex = 1)
```

- `paragraph0LineHeight` returns the paragraph-specific override.
- `paragraph1LineHeight` falls back to the block-level value.
- `resetParagraph0LineHeight` returns the block-level value after the override is cleared.
- `resetBlockLineHeight` returns `1.8F` after `setTextLineHeight(text, lineHeight = 1.8F)` updates the block-level value and clears paragraph overrides.

## Paragraph Spacing

Add vertical space after paragraph breaks with the `text/paragraphSpacing` property. The value is an EM-based paragraph gap relative to the text's font size, not an absolute pixel distance, and it only affects text that contains newline characters. Values typically range from `0.0F` to `2.5F`; larger values are accepted but produce very large gaps.

```kotlin highlight-android-paragraph-spacing
engine.block.setFloat(text, property = "text/paragraphSpacing", value = 1.2F)
val paragraphSpacing = engine.block.getFloat(text, property = "text/paragraphSpacing")
```

Single-paragraph text does not show a visible paragraph-spacing change because there is no paragraph break to separate.

## API Reference

| Method | Purpose |
| --- | --- |
| `engine.block.setFloat(block=_, property="text/letterSpacing", value=_)` | Set block-level letter spacing. |
| `engine.block.getFloat(block=_, property="text/letterSpacing")` | Read the current block-level letter spacing. |
| `engine.block.setFloat(block=_, property="text/lineHeight", value=_)` | Set the block-level line-height multiplier. |
| `engine.block.getFloat(block=_, property="text/lineHeight")` | Read the current block-level line-height multiplier. |
| `engine.block.setTextLineHeight(block=_, lineHeight=_, paragraphIndex=_)` | Set or clear a paragraph-specific line-height override. |
| `engine.block.setTextLineHeight(block=_, lineHeight=_)` | Set the block-level line-height multiplier and clear paragraph overrides. |
| `engine.block.getTextLineHeight(block=_, paragraphIndex=_)` | Read the effective line height for a paragraph. |
| `engine.block.setFloat(block=_, property="text/paragraphSpacing", value=_)` | Set the paragraph gap relative to font size. |
| `engine.block.getFloat(block=_, property="text/paragraphSpacing")` | Read the current paragraph-gap value. |

### Properties Reference

| Property | Type | Purpose |
| --- | --- | --- |
| `text/letterSpacing` | Float | Space between characters. |
| `text/lineHeight` | Float | Block-level multiplier for vertical line distance. |
| `text/paragraphSpacing` | Float | EM-based gap added after paragraph breaks. |

## Troubleshooting

**Spacing changes are not visible**: Check that the text block contains the right kind of content: multiple characters for letter spacing, multiple lines for line height, and paragraph breaks for paragraph spacing.

**Line height looks larger than expected**: Line height is a multiplier, not an absolute pixel value. A value of `1.5F` means 150% of the current font size.

**Paragraph spacing has no effect**: Verify that the text contains newline characters. Paragraph spacing is only visible between paragraphs. The value is relative to the text's font size (typically `0.0F` to `2.5F`), not the `text/lineHeight` multiplier or a pixel distance.

## Next Steps

- [Text Styling](./styling.md) - Apply fonts, colors, alignment, and other styling options to customize text appearance.
- [Add Text](./add.md) - Insert text blocks into your CE.SDK scene.
- [Auto-Size](./auto-size.md) - Configure text blocks to automatically adapt their dimensions or font size for dynamic content.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
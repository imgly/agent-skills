> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Create and Edit Text](../text.md) > [Text Enumerations](./enumerations.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-text-enumerations/TextEnumerations.kt reference-only
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.ListStyle
import ly.img.engine.SizeMode

fun textEnumerations(
    license: String?, // pass null or empty for evaluation mode with watermark
    userId: String,
) = CoroutineScope(Dispatchers.Main).launch {
    val engine = Engine.getInstance(id = "ly.img.engine.example")
    engine.start(license = license, userId = userId)
    engine.bindOffscreen(width = 1080, height = 1920)

    val scene = engine.scene.create()
    val text = engine.block.create(DesignBlockType.Text)
    engine.block.appendChild(parent = scene, child = text)
    engine.block.setWidthMode(text, mode = SizeMode.AUTO)
    engine.block.setHeightMode(text, mode = SizeMode.AUTO)
    engine.block.replaceText(text, text = "First item\nSecond item\nThird item")

    // Apply ordered list style to all paragraphs (paragraphIndex defaults to -1 = all)
    engine.block.setTextListStyle(text, listStyle = ListStyle.ORDERED)

    // Override the third paragraph (index 2) to unordered
    engine.block.setTextListStyle(text, listStyle = ListStyle.UNORDERED, paragraphIndex = 2)

    // Set the second paragraph (index 1) to nesting level 1 (one indent deep)
    engine.block.setTextListLevel(text, listLevel = 1, paragraphIndex = 1)

    // Read back the nesting level to confirm
    val level = engine.block.getTextListLevel(text, paragraphIndex = 1)
    println("Second paragraph nesting level: $level")

    // Atomically set both list style and nesting level in one call
    // Sets paragraph 0 to ordered style at nesting level 0 (outermost)
    engine.block.setTextListStyle(
        text,
        listStyle = ListStyle.ORDERED,
        paragraphIndex = 0,
        listLevel = 0,
    )

    // Get all paragraph indices in the text block
    val allIndices = engine.block.getTextParagraphIndices(text)
    println("All paragraph indices: $allIndices")

    // Get indices overlapping a specific grapheme range
    val rangeIndices = engine.block.getTextParagraphIndices(text, from = 0, to = 10)
    println("Indices for range [0, 10): $rangeIndices")

    // Read back the list style and nesting level for each paragraph
    val styles = allIndices.map { index -> engine.block.getTextListStyle(text, paragraphIndex = index) }
    val levels = allIndices.map { index -> engine.block.getTextListLevel(text, paragraphIndex = index) }
    println("Paragraph styles: $styles")
    println("Paragraph levels: $levels")

    engine.stop()
}

```

Apply bullet and numbered list styles to text blocks, control nesting levels, and query the list configuration of any paragraph.

CE.SDK formats lists per paragraph. Each paragraph in a text block has an independent `ListStyle` (`NONE`, `UNORDERED`, or `ORDERED`) and a zero-based nesting level.

This example runs in the offscreen engine. For evaluation mode, pass `license = null`; for production, pass your CE.SDK license string.

## Setup

Create a text block with three paragraphs separated by newline characters.

```kotlin highlight-textEnumerations-setup
val scene = engine.scene.create()
val text = engine.block.create(DesignBlockType.Text)
engine.block.appendChild(parent = scene, child = text)
engine.block.setWidthMode(text, mode = SizeMode.AUTO)
engine.block.setHeightMode(text, mode = SizeMode.AUTO)
engine.block.replaceText(text, text = "First item\nSecond item\nThird item")
```

## Apply List Styles

Use `engine.block.setTextListStyle()` to apply a list style to one or all paragraphs. Passing no `paragraphIndex` (default `-1`) applies the style to every paragraph.

| Value | Renders as |
|-------|-----------|
| `ListStyle.UNORDERED` | Bullet marker (•) |
| `ListStyle.ORDERED` | Auto-incrementing number (1., 2., …) |
| `ListStyle.NONE` | Plain text (removes list formatting) |

```kotlin highlight-textEnumerations-applyListStyles
    // Apply ordered list style to all paragraphs (paragraphIndex defaults to -1 = all)
    engine.block.setTextListStyle(text, listStyle = ListStyle.ORDERED)

    // Override the third paragraph (index 2) to unordered
    engine.block.setTextListStyle(text, listStyle = ListStyle.UNORDERED, paragraphIndex = 2)
```

> **Note:** Write operations require the `"text/character"` scope on the text block.

## Manage Nesting Levels

Control the visual depth of list items with `engine.block.setTextListLevel()`. The level is zero-based (`0` is outermost). Use `engine.block.getTextListLevel()` to read the current depth.

```kotlin highlight-textEnumerations-manageNesting
    // Set the second paragraph (index 1) to nesting level 1 (one indent deep)
    engine.block.setTextListLevel(text, listLevel = 1, paragraphIndex = 1)

    // Read back the nesting level to confirm
    val level = engine.block.getTextListLevel(text, paragraphIndex = 1)
    println("Second paragraph nesting level: $level")
```

Nesting has no visible effect when the list style is `ListStyle.NONE`.

## Atomic Style and Level Assignment

Pass the optional `listLevel` parameter to `setTextListStyle()` to set style and nesting in one call.

```kotlin highlight-textEnumerations-atomic
// Atomically set both list style and nesting level in one call
// Sets paragraph 0 to ordered style at nesting level 0 (outermost)
engine.block.setTextListStyle(
    text,
    listStyle = ListStyle.ORDERED,
    paragraphIndex = 0,
    listLevel = 0,
)
```

## Resolve Paragraph Indices

Use `engine.block.getTextParagraphIndices()` to find which 0-based paragraphs overlap a grapheme range. Passing no range returns all paragraph indices.
For selection-driven flows, first call `engine.block.getTextCursorRange()` and pass its start/end indices into `getTextParagraphIndices()`.

```kotlin highlight-textEnumerations-paragraphIndices
    // Get all paragraph indices in the text block
    val allIndices = engine.block.getTextParagraphIndices(text)
    println("All paragraph indices: $allIndices")

    // Get indices overlapping a specific grapheme range
    val rangeIndices = engine.block.getTextParagraphIndices(text, from = 0, to = 10)
    println("Indices for range [0, 10): $rangeIndices")
```

## Query List Styles

Read back styles and levels with `engine.block.getTextListStyle()` and `engine.block.getTextListLevel()`. Both getters require a non-negative `paragraphIndex`.

```kotlin highlight-textEnumerations-queryListStyles
// Read back the list style and nesting level for each paragraph
val styles = allIndices.map { index -> engine.block.getTextListStyle(text, paragraphIndex = index) }
val levels = allIndices.map { index -> engine.block.getTextListLevel(text, paragraphIndex = index) }
println("Paragraph styles: $styles")
println("Paragraph levels: $levels")
```

The output confirms styles `[ORDERED, ORDERED, UNORDERED]` and levels `[0, 1, 0]`.

## Full Code

```kotlin highlight-textEnumerations
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.ListStyle
import ly.img.engine.SizeMode

fun textEnumerations(
    license: String?, // pass null or empty for evaluation mode with watermark
    userId: String,
) = CoroutineScope(Dispatchers.Main).launch {
    val engine = Engine.getInstance(id = "ly.img.engine.example")
    engine.start(license = license, userId = userId)
    engine.bindOffscreen(width = 1080, height = 1920)

    val scene = engine.scene.create()
    val text = engine.block.create(DesignBlockType.Text)
    engine.block.appendChild(parent = scene, child = text)
    engine.block.setWidthMode(text, mode = SizeMode.AUTO)
    engine.block.setHeightMode(text, mode = SizeMode.AUTO)
    engine.block.replaceText(text, text = "First item\nSecond item\nThird item")

    // Apply ordered list style to all paragraphs (paragraphIndex defaults to -1 = all)
    engine.block.setTextListStyle(text, listStyle = ListStyle.ORDERED)

    // Override the third paragraph (index 2) to unordered
    engine.block.setTextListStyle(text, listStyle = ListStyle.UNORDERED, paragraphIndex = 2)

    // Set the second paragraph (index 1) to nesting level 1 (one indent deep)
    engine.block.setTextListLevel(text, listLevel = 1, paragraphIndex = 1)

    // Read back the nesting level to confirm
    val level = engine.block.getTextListLevel(text, paragraphIndex = 1)
    println("Second paragraph nesting level: $level")

    // Atomically set both list style and nesting level in one call
    // Sets paragraph 0 to ordered style at nesting level 0 (outermost)
    engine.block.setTextListStyle(
        text,
        listStyle = ListStyle.ORDERED,
        paragraphIndex = 0,
        listLevel = 0,
    )

    // Get all paragraph indices in the text block
    val allIndices = engine.block.getTextParagraphIndices(text)
    println("All paragraph indices: $allIndices")

    // Get indices overlapping a specific grapheme range
    val rangeIndices = engine.block.getTextParagraphIndices(text, from = 0, to = 10)
    println("Indices for range [0, 10): $rangeIndices")

    // Read back the list style and nesting level for each paragraph
    val styles = allIndices.map { index -> engine.block.getTextListStyle(text, paragraphIndex = index) }
    val levels = allIndices.map { index -> engine.block.getTextListLevel(text, paragraphIndex = index) }
    println("Paragraph styles: $styles")
    println("Paragraph levels: $levels")

    engine.stop()
}
```

## Troubleshooting

- List markers are not visible: confirm you enabled the `"text/character"` scope before calling setters.
- `getTextListStyle()` or `getTextListLevel()` fails: pass a non-negative paragraph index from `getTextParagraphIndices()`.
- Nesting level appears unchanged: verify the paragraph style is not `ListStyle.NONE`.
- Ordered numbers restart unexpectedly: inserting `ListStyle.NONE` paragraphs can split numbering runs.

## API Reference

| Method | Purpose |
|--------|---------|
| <code>engine.block.<wbr />setTextListStyle()</code> | Apply list style to one or all paragraphs, optionally setting nesting level atomically |
| <code>engine.block.<wbr />getTextListStyle()</code> | Get the list style of a specific paragraph |
| <code>engine.block.<wbr />setTextListLevel()</code> | Set the nesting level of one or all paragraphs |
| <code>engine.block.<wbr />getTextListLevel()</code> | Get the nesting level of a specific paragraph |
| <code>engine.block.<wbr />getTextParagraphIndices()</code> | Get paragraph indices overlapping a grapheme range |

## Next Steps

[Text Decorations](./decorations.md)
[Text Styling](./styling.md)
[Edit Text](./edit.md)



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Create and Edit Text](../text.md) > [Subscript and Superscript](./subscript-superscript.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-text-subscript-superscript/ScriptStyle.kt reference-only
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.ScriptStyle
import ly.img.engine.SizeMode

fun scriptStyle(
    license: String,
    userId: String,
) = CoroutineScope(Dispatchers.Main).launch {
    val engine = Engine.getInstance(id = "ly.img.engine.example")
    engine.start(license = license, userId = userId)
    engine.bindOffscreen(width = 100, height = 100)

    val scene = engine.scene.create()
    val text = engine.block.create(DesignBlockType.Text)
    engine.block.appendChild(parent = scene, child = text)
    engine.block.setWidthMode(text, mode = SizeMode.AUTO)
    engine.block.setHeightMode(text, mode = SizeMode.AUTO)
    engine.block.replaceText(text, text = "\$1999 H2O E=mc2")

    // Raise the cents of the price above the rest of the line.
    // Superscript text is scaled down and raised automatically.
    engine.block.setTextScriptStyle(text, scriptStyle = ScriptStyle.SUPERSCRIPT, from = 3, to = 5)

    // Raise the exponent of the formula
    engine.block.setTextScriptStyle(text, scriptStyle = ScriptStyle.SUPERSCRIPT, from = 14, to = 15)

    // Lower the "2" of the water formula below the rest of the line
    engine.block.setTextScriptStyle(text, scriptStyle = ScriptStyle.SUBSCRIPT, from = 7, to = 8)

    // Query the unique script styles in a range, in document order
    val scriptStyles = engine.block.getTextScriptStyles(text)
    // e.g. [NORMAL, SUPERSCRIPT, SUBSCRIPT]

    // Query a specific range
    val centsScriptStyle = engine.block.getTextScriptStyles(text, from = 3, to = 5)
    // [SUPERSCRIPT]

    // Each text run reports its script style
    val runs = engine.block.getTextRuns(text)
    // e.g. runs[1].scriptStyle == ScriptStyle.SUPERSCRIPT

    // Adjust the size and position of shifted text for the whole block.
    // The scale is a factor of the font size. The shift is a fraction of
    // the unscaled font size.
    engine.block.setFloat(text, property = "text/superscriptFontScale", value = 0.65F)
    engine.block.setFloat(text, property = "text/superscriptVerticalShift", value = 0.4F)
    engine.block.setFloat(text, property = "text/subscriptFontScale", value = 0.65F)
    engine.block.setFloat(text, property = "text/subscriptVerticalShift", value = 0.25F)

    // Reset a range back to regular text
    engine.block.setTextScriptStyle(text, scriptStyle = ScriptStyle.NORMAL, from = 14, to = 15)

    engine.stop()
}

```

Format ranges of text as subscript or superscript for prices, formulas, footnotes, and technical notation.

CE.SDK formats superscript and subscript synthetically: the affected range is scaled down to 58.3% of its font size and shifted up or down by 33.3% of the unscaled font size. These defaults match common design applications, so the feature works with every font, and block properties let you adjust the scale and shift. Lines grow automatically when a shifted range needs more room, and exports include the shifted glyphs. Superscript and subscript combine with text decorations, text on a path, and text animations.

## Apply Superscript

Raise a range above the rest of the line using `engine.block.setTextScriptStyle()` with `ScriptStyle.SUPERSCRIPT` and UTF-16 indices `[from, to)`. Without a range, the whole text or the current selection is changed.

```kotlin highlight-superscript
    // Raise the cents of the price above the rest of the line.
    // Superscript text is scaled down and raised automatically.
    engine.block.setTextScriptStyle(text, scriptStyle = ScriptStyle.SUPERSCRIPT, from = 3, to = 5)

    // Raise the exponent of the formula
    engine.block.setTextScriptStyle(text, scriptStyle = ScriptStyle.SUPERSCRIPT, from = 14, to = 15)
```

## Apply Subscript

Lower a range below the rest of the line with `ScriptStyle.SUBSCRIPT`.

```kotlin highlight-subscript
// Lower the "2" of the water formula below the rest of the line
engine.block.setTextScriptStyle(text, scriptStyle = ScriptStyle.SUBSCRIPT, from = 7, to = 8)
```

## Query Script Styles

Query the script styles using `engine.block.getTextScriptStyles()`. It returns the ordered list of unique values in the range: `NORMAL`, `SUPERSCRIPT`, or `SUBSCRIPT`.

```kotlin highlight-query-scriptStyles
    // Query the unique script styles in a range, in document order
    val scriptStyles = engine.block.getTextScriptStyles(text)
    // e.g. [NORMAL, SUPERSCRIPT, SUBSCRIPT]

    // Query a specific range
    val centsScriptStyle = engine.block.getTextScriptStyles(text, from = 3, to = 5)
    // [SUPERSCRIPT]
```

## Text Runs

Each entry returned by `engine.block.getTextRuns()` reports the `scriptStyle` of that run alongside its other formatting properties.

```kotlin highlight-text-runs
// Each text run reports its script style
val runs = engine.block.getTextRuns(text)
// e.g. runs[1].scriptStyle == ScriptStyle.SUPERSCRIPT
```

## Adjust Size and Position

Four block properties control how superscript and subscript are rendered. The font scale is a factor of the font size, the vertical shift is a fraction of the unscaled font size. The properties apply to all shifted ranges in the block.

```kotlin highlight-adjust
// Adjust the size and position of shifted text for the whole block.
// The scale is a factor of the font size. The shift is a fraction of
// the unscaled font size.
engine.block.setFloat(text, property = "text/superscriptFontScale", value = 0.65F)
engine.block.setFloat(text, property = "text/superscriptVerticalShift", value = 0.4F)
engine.block.setFloat(text, property = "text/subscriptFontScale", value = 0.65F)
engine.block.setFloat(text, property = "text/subscriptVerticalShift", value = 0.25F)
```

## Reset to Normal

Reset a range back to regular text with `ScriptStyle.NORMAL`.

```kotlin highlight-reset
// Reset a range back to regular text
engine.block.setTextScriptStyle(text, scriptStyle = ScriptStyle.NORMAL, from = 14, to = 15)
```

## API Reference

| Method | Purpose |
|--------|---------|
| `engine.block.setTextScriptStyle()` | Set the script style for entire text or range |
| `engine.block.getTextScriptStyles()` | Get ordered list of unique script styles in range |
| `engine.block.getTextRuns()` | Read the `scriptStyle` of each text run |
| `text/superscriptFontScale` | Font scale of superscript text, default `0.583` |
| `text/superscriptVerticalShift` | Upward shift of superscript text, default `0.333` |
| `text/subscriptFontScale` | Font scale of subscript text, default `0.583` |
| `text/subscriptVerticalShift` | Downward shift of subscript text, default `0.333` |



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
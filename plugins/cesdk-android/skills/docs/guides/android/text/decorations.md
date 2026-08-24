> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Create and Edit Text](../text.md) > [Text Decorations](./decorations.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-text-decorations/TextDecorations.kt reference-only
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import ly.img.engine.Color
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.SizeMode
import ly.img.engine.TextDecorationConfig
import ly.img.engine.TextDecorationLine
import ly.img.engine.TextDecorationStyle

fun textDecorations(
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
    engine.block.replaceText(text, text = "Hello CE.SDK")

    // Toggle underline on the entire text
    engine.block.toggleTextDecorationUnderline(text)

    // Toggle strikethrough on the entire text
    engine.block.toggleTextDecorationStrikethrough(text)

    // Toggle overline on the entire text
    engine.block.toggleTextDecorationOverline(text)

    // Calling toggle again removes the decoration
    engine.block.toggleTextDecorationOverline(text)

    // Query the current decoration configurations
    // Returns a list of unique TextDecorationConfig values in the range
    val decorations = engine.block.getTextDecorations(text)
    // Each config contains: lines, style, underlineColor, underlineThickness, underlineOffset, skipInk

    // Set a specific decoration style
    // Available styles: SOLID, DOUBLE, DOTTED, DASHED, WAVY
    engine.block.setTextDecoration(
        text,
        TextDecorationConfig(
            lines = setOf(TextDecorationLine.UNDERLINE),
            style = TextDecorationStyle.DASHED,
        ),
    )

    // Set a custom underline color (only applies to underlines)
    // Strikethrough and overline always use the text color
    engine.block.setTextDecoration(
        text,
        TextDecorationConfig(
            lines = setOf(TextDecorationLine.UNDERLINE),
            underlineColor = Color.fromRGBA(r = 1F, g = 0F, b = 0F, a = 1F),
        ),
    )

    // Adjust the underline thickness
    // Default is 1.0, values above 1.0 make the line thicker
    engine.block.setTextDecoration(
        text,
        TextDecorationConfig(
            lines = setOf(TextDecorationLine.UNDERLINE),
            underlineThickness = 2.0f,
        ),
    )

    // Adjust the underline position relative to the font default
    // 0 = font default, positive values move further from baseline, negative values move closer
    engine.block.setTextDecoration(
        text,
        TextDecorationConfig(
            lines = setOf(TextDecorationLine.UNDERLINE),
            underlineOffset = 0.1f,
        ),
    )

    // Apply decorations to a specific character range using UTF-16 indices
    // Toggle underline on characters 0-5 ("Hello")
    engine.block.toggleTextDecorationUnderline(text, from = 0, to = 5)

    // Set strikethrough on characters 6-12 ("CE.SDK")
    engine.block.setTextDecoration(
        text,
        TextDecorationConfig(lines = setOf(TextDecorationLine.STRIKETHROUGH)),
        from = 6,
        to = 12,
    )

    // Query decorations in a specific range
    val subrangeDecorations = engine.block.getTextDecorations(text, from = 0, to = 5)

    // Combine multiple decoration lines on the same text
    // All active lines share the same style and thickness
    engine.block.setTextDecoration(
        text,
        TextDecorationConfig(
            lines = setOf(TextDecorationLine.UNDERLINE, TextDecorationLine.STRIKETHROUGH),
        ),
    )

    // Remove all decorations
    engine.block.setTextDecoration(
        text,
        TextDecorationConfig(lines = setOf(TextDecorationLine.NONE)),
    )

    engine.stop()
}

```

Add underline, strikethrough, and overline decorations to text blocks with configurable styles, colors, and thickness.

CE.SDK supports three types of text decorations: underline, strikethrough, and overline. Decorations can be toggled on and off, customized with different line styles, and applied to specific character ranges. The `TextDecorationConfig` data class holds all configuration for a decoration.

## Toggle Decorations

Toggle decorations using `engine.block.toggleTextDecorationUnderline()`, `engine.block.toggleTextDecorationStrikethrough()`, and `engine.block.toggleTextDecorationOverline()`. If all characters in the range already have the decoration, it is removed; otherwise, it is added to all.

```kotlin highlight-toggle-decorations
    // Toggle underline on the entire text
    engine.block.toggleTextDecorationUnderline(text)

    // Toggle strikethrough on the entire text
    engine.block.toggleTextDecorationStrikethrough(text)

    // Toggle overline on the entire text
    engine.block.toggleTextDecorationOverline(text)

    // Calling toggle again removes the decoration
    engine.block.toggleTextDecorationOverline(text)
```

## Query Decorations

Query the current decorations using `engine.block.getTextDecorations()`. It returns an ordered list of unique `TextDecorationConfig` values. Each config includes the active `lines` set, `style`, optional `underlineColor`, `underlineThickness`, `underlineOffset`, and `skipInk`.

```kotlin highlight-query-decorations
// Query the current decoration configurations
// Returns a list of unique TextDecorationConfig values in the range
val decorations = engine.block.getTextDecorations(text)
// Each config contains: lines, style, underlineColor, underlineThickness, underlineOffset, skipInk
```

## Custom Decoration Styles

Set a specific decoration style using `engine.block.setTextDecoration()` with a `TextDecorationConfig`. Available styles are `SOLID` (default), `DOUBLE`, `DOTTED`, `DASHED`, and `WAVY`.

```kotlin highlight-custom-style
// Set a specific decoration style
// Available styles: SOLID, DOUBLE, DOTTED, DASHED, WAVY
engine.block.setTextDecoration(
    text,
    TextDecorationConfig(
        lines = setOf(TextDecorationLine.UNDERLINE),
        style = TextDecorationStyle.DASHED,
    ),
)
```

## Underline Color

Set a custom underline color that differs from the text color. The `underlineColor` property only applies to underlines; strikethrough and overline always use the text color.

```kotlin highlight-underline-color
// Set a custom underline color (only applies to underlines)
// Strikethrough and overline always use the text color
engine.block.setTextDecoration(
    text,
    TextDecorationConfig(
        lines = setOf(TextDecorationLine.UNDERLINE),
        underlineColor = Color.fromRGBA(r = 1F, g = 0F, b = 0F, a = 1F),
    ),
)
```

## Decoration Thickness

Adjust the underline thickness using the `underlineThickness` property. The default is `1.0f`. Values above `1.0f` make the underline thicker.

```kotlin highlight-thickness
// Adjust the underline thickness
// Default is 1.0, values above 1.0 make the line thicker
engine.block.setTextDecoration(
    text,
    TextDecorationConfig(
        lines = setOf(TextDecorationLine.UNDERLINE),
        underlineThickness = 2.0f,
    ),
)
```

## Underline Offset

Adjust the underline position using the `underlineOffset` property, which acts as a relative multiplier on the font-default distance. The actual position is computed as `fontDefault * (1 + underlineOffset)`. The default is `0f`, which uses the font's default underline position. Positive values move the underline proportionally further from the baseline, negative values move it proportionally closer.

```kotlin highlight-offset
// Adjust the underline position relative to the font default
// 0 = font default, positive values move further from baseline, negative values move closer
engine.block.setTextDecoration(
    text,
    TextDecorationConfig(
        lines = setOf(TextDecorationLine.UNDERLINE),
        underlineOffset = 0.1f,
    ),
)
```

## Subrange Decorations

Apply decorations to a specific character range using UTF-16 indices `[from, to)`. Both toggle and set operations accept `from` and `to` parameters for subrange targeting.

```kotlin highlight-subrange
    // Apply decorations to a specific character range using UTF-16 indices
    // Toggle underline on characters 0-5 ("Hello")
    engine.block.toggleTextDecorationUnderline(text, from = 0, to = 5)

    // Set strikethrough on characters 6-12 ("CE.SDK")
    engine.block.setTextDecoration(
        text,
        TextDecorationConfig(lines = setOf(TextDecorationLine.STRIKETHROUGH)),
        from = 6,
        to = 12,
    )

    // Query decorations in a specific range
    val subrangeDecorations = engine.block.getTextDecorations(text, from = 0, to = 5)
```

## Combine Decorations

Combine multiple decoration types by passing a set of `TextDecorationLine` values. All active lines share the same style and thickness.

```kotlin highlight-combine
// Combine multiple decoration lines on the same text
// All active lines share the same style and thickness
engine.block.setTextDecoration(
    text,
    TextDecorationConfig(
        lines = setOf(TextDecorationLine.UNDERLINE, TextDecorationLine.STRIKETHROUGH),
    ),
)
```

## Remove Decorations

Remove all decorations by setting the lines to `setOf(TextDecorationLine.NONE)`.

```kotlin highlight-remove
// Remove all decorations
engine.block.setTextDecoration(
    text,
    TextDecorationConfig(lines = setOf(TextDecorationLine.NONE)),
)
```

## Full Code

Here's the full code:

```kotlin highlight-text-decorations
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import ly.img.engine.Color
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.SizeMode
import ly.img.engine.TextDecorationConfig
import ly.img.engine.TextDecorationLine
import ly.img.engine.TextDecorationStyle

fun textDecorations(
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
    engine.block.replaceText(text, text = "Hello CE.SDK")

    // Toggle underline on the entire text
    engine.block.toggleTextDecorationUnderline(text)

    // Toggle strikethrough on the entire text
    engine.block.toggleTextDecorationStrikethrough(text)

    // Toggle overline on the entire text
    engine.block.toggleTextDecorationOverline(text)

    // Calling toggle again removes the decoration
    engine.block.toggleTextDecorationOverline(text)

    // Query the current decoration configurations
    // Returns a list of unique TextDecorationConfig values in the range
    val decorations = engine.block.getTextDecorations(text)
    // Each config contains: lines, style, underlineColor, underlineThickness, underlineOffset, skipInk

    // Set a specific decoration style
    // Available styles: SOLID, DOUBLE, DOTTED, DASHED, WAVY
    engine.block.setTextDecoration(
        text,
        TextDecorationConfig(
            lines = setOf(TextDecorationLine.UNDERLINE),
            style = TextDecorationStyle.DASHED,
        ),
    )

    // Set a custom underline color (only applies to underlines)
    // Strikethrough and overline always use the text color
    engine.block.setTextDecoration(
        text,
        TextDecorationConfig(
            lines = setOf(TextDecorationLine.UNDERLINE),
            underlineColor = Color.fromRGBA(r = 1F, g = 0F, b = 0F, a = 1F),
        ),
    )

    // Adjust the underline thickness
    // Default is 1.0, values above 1.0 make the line thicker
    engine.block.setTextDecoration(
        text,
        TextDecorationConfig(
            lines = setOf(TextDecorationLine.UNDERLINE),
            underlineThickness = 2.0f,
        ),
    )

    // Adjust the underline position relative to the font default
    // 0 = font default, positive values move further from baseline, negative values move closer
    engine.block.setTextDecoration(
        text,
        TextDecorationConfig(
            lines = setOf(TextDecorationLine.UNDERLINE),
            underlineOffset = 0.1f,
        ),
    )

    // Apply decorations to a specific character range using UTF-16 indices
    // Toggle underline on characters 0-5 ("Hello")
    engine.block.toggleTextDecorationUnderline(text, from = 0, to = 5)

    // Set strikethrough on characters 6-12 ("CE.SDK")
    engine.block.setTextDecoration(
        text,
        TextDecorationConfig(lines = setOf(TextDecorationLine.STRIKETHROUGH)),
        from = 6,
        to = 12,
    )

    // Query decorations in a specific range
    val subrangeDecorations = engine.block.getTextDecorations(text, from = 0, to = 5)

    // Combine multiple decoration lines on the same text
    // All active lines share the same style and thickness
    engine.block.setTextDecoration(
        text,
        TextDecorationConfig(
            lines = setOf(TextDecorationLine.UNDERLINE, TextDecorationLine.STRIKETHROUGH),
        ),
    )

    // Remove all decorations
    engine.block.setTextDecoration(
        text,
        TextDecorationConfig(lines = setOf(TextDecorationLine.NONE)),
    )

    engine.stop()
}
```



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
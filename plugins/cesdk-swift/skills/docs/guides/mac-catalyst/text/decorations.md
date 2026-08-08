> This is one page of the CE.SDK Mac Catalyst documentation. For a complete overview, see the [Mac Catalyst Documentation Index](https://img.ly/docs/cesdk/mac-catalyst/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/mac-catalyst/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Create and Edit Text](../text.md) > [Text Decorations](./decorations.md)

---

```swift file=@cesdk_swift_examples/engine-guides-text-decorations/TextDecorations.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func textDecorations(engine: Engine) async throws {
  let scene = try engine.scene.create()
  let text = try engine.block.create(.text)
  try engine.block.appendChild(to: scene, child: text)
  try engine.block.setWidthMode(text, mode: .auto)
  try engine.block.setHeightMode(text, mode: .auto)
  try engine.block.replaceText(text, text: "Hello CE.SDK")

  // Toggle underline on the entire text
  try engine.block.toggleTextDecorationUnderline(text)

  // Toggle strikethrough on the entire text
  try engine.block.toggleTextDecorationStrikethrough(text)

  // Toggle overline on the entire text
  try engine.block.toggleTextDecorationOverline(text)

  // Calling toggle again removes the decoration
  try engine.block.toggleTextDecorationOverline(text)

  // Query the current decoration configurations
  // Returns a list of unique TextDecorationConfig values in the range
  let decorations = try engine.block.getTextDecorations(text)
  // Each config contains: line, style, underlineColor, underlineThickness, underlineOffset, skipInk

  // Set a specific decoration style
  // Available styles: .solid, .double, .dotted, .dashed, .wavy
  try engine.block.setTextDecoration(text, config: TextDecorationConfig(
    line: .underline,
    style: .dashed,
  ))

  // Set a custom underline color (only applies to underlines)
  // Strikethrough and overline always use the text color
  try engine.block.setTextDecoration(text, config: TextDecorationConfig(
    line: .underline,
    underlineColor: .rgba(r: 1, g: 0, b: 0, a: 1),
  ))

  // Adjust the underline thickness
  // Default is 1.0, values above 1.0 make the line thicker
  try engine.block.setTextDecoration(text, config: TextDecorationConfig(
    line: .underline,
    underlineThickness: 2.0,
  ))

  // Adjust the underline position relative to the font default
  // 0 = font default, positive values move further from baseline, negative values move closer
  try engine.block.setTextDecoration(text, config: TextDecorationConfig(
    line: .underline,
    underlineOffset: 0.1,
  ))

  // Apply decorations to a specific character range using Range<String.Index>
  let currentText = try engine.block.getString(text, property: "text/text")
  let helloRange = currentText.startIndex ..< currentText.index(currentText.startIndex, offsetBy: 5)

  // Toggle underline on "Hello"
  try engine.block.toggleTextDecorationUnderline(text, in: helloRange)

  // Query decorations in a specific range
  let subrangeDecorations = try engine.block.getTextDecorations(text, in: helloRange)

  // Combine multiple decoration lines on the same text
  // All active lines share the same style and thickness
  try engine.block.setTextDecoration(text, config: TextDecorationConfig(
    line: [.underline, .strikethrough],
  ))

  // Remove all decorations
  try engine.block.setTextDecoration(text, config: TextDecorationConfig())

  _ = decorations
  _ = subrangeDecorations
}

```

Add underline, strikethrough, and overline decorations to text blocks with configurable styles, colors, and thickness.

CE.SDK supports three types of text decorations: underline, strikethrough, and overline. Decorations can be toggled on and off, customized with different line styles, and applied to specific character ranges. `TextDecorationLine` is an `OptionSet`, so multiple lines can be combined using set operations.

## Toggle Decorations

Toggle decorations using `engine.block.toggleTextDecorationUnderline()`, `engine.block.toggleTextDecorationStrikethrough()`, and `engine.block.toggleTextDecorationOverline()`. If all characters in the range already have the decoration, it is removed; otherwise, it is added to all.

```swift highlight-toggle-decorations
  // Toggle underline on the entire text
  try engine.block.toggleTextDecorationUnderline(text)

  // Toggle strikethrough on the entire text
  try engine.block.toggleTextDecorationStrikethrough(text)

  // Toggle overline on the entire text
  try engine.block.toggleTextDecorationOverline(text)

  // Calling toggle again removes the decoration
  try engine.block.toggleTextDecorationOverline(text)
```

## Query Decorations

Query the current decorations using `engine.block.getTextDecorations()`. It returns an array of unique `TextDecorationConfig` values. Each config includes the active `line` (an `OptionSet`), `style`, optional `underlineColor`, `underlineThickness`, `underlineOffset`, and `skipInk`.

```swift highlight-query-decorations
// Query the current decoration configurations
// Returns a list of unique TextDecorationConfig values in the range
let decorations = try engine.block.getTextDecorations(text)
// Each config contains: line, style, underlineColor, underlineThickness, underlineOffset, skipInk
```

## Custom Decoration Styles

Set a specific decoration style using `engine.block.setTextDecoration()` with a `TextDecorationConfig`. Available styles are `.solid` (default), `.double`, `.dotted`, `.dashed`, and `.wavy`.

```swift highlight-custom-style
// Set a specific decoration style
// Available styles: .solid, .double, .dotted, .dashed, .wavy
try engine.block.setTextDecoration(text, config: TextDecorationConfig(
  line: .underline,
  style: .dashed,
))
```

## Underline Color

Set a custom underline color that differs from the text color. The `underlineColor` property only applies to underlines; strikethrough and overline always use the text color.

```swift highlight-underline-color
// Set a custom underline color (only applies to underlines)
// Strikethrough and overline always use the text color
try engine.block.setTextDecoration(text, config: TextDecorationConfig(
  line: .underline,
  underlineColor: .rgba(r: 1, g: 0, b: 0, a: 1),
))
```

## Decoration Thickness

Adjust the underline thickness using the `underlineThickness` property. The default is `1.0`. Values above `1.0` make the underline thicker.

```swift highlight-thickness
// Adjust the underline thickness
// Default is 1.0, values above 1.0 make the line thicker
try engine.block.setTextDecoration(text, config: TextDecorationConfig(
  line: .underline,
  underlineThickness: 2.0,
))
```

## Underline Offset

Adjust the underline position using the `underlineOffset` property, which acts as a relative multiplier on the font-default distance. The actual position is computed as `fontDefault * (1 + underlineOffset)`. The default is `0`, which uses the font's default underline position. Positive values move the underline proportionally further from the baseline, negative values move it proportionally closer.

```swift highlight-offset
// Adjust the underline position relative to the font default
// 0 = font default, positive values move further from baseline, negative values move closer
try engine.block.setTextDecoration(text, config: TextDecorationConfig(
  line: .underline,
  underlineOffset: 0.1,
))
```

## Subrange Decorations

Apply decorations to a specific character range using `Range<String.Index>`. Both toggle and set operations accept an optional `in` parameter for subrange targeting.

```swift highlight-subrange
  // Apply decorations to a specific character range using Range<String.Index>
  let currentText = try engine.block.getString(text, property: "text/text")
  let helloRange = currentText.startIndex ..< currentText.index(currentText.startIndex, offsetBy: 5)

  // Toggle underline on "Hello"
  try engine.block.toggleTextDecorationUnderline(text, in: helloRange)

  // Query decorations in a specific range
  let subrangeDecorations = try engine.block.getTextDecorations(text, in: helloRange)
```

## Combine Decorations

Combine multiple decoration types using the `TextDecorationLine` `OptionSet`. Pass a set like `[.underline, .strikethrough]` to apply both simultaneously. All active lines share the same style and thickness.

```swift highlight-combine
// Combine multiple decoration lines on the same text
// All active lines share the same style and thickness
try engine.block.setTextDecoration(text, config: TextDecorationConfig(
  line: [.underline, .strikethrough],
))
```

## Remove Decorations

Remove all decorations by creating a default `TextDecorationConfig()`, which sets the line to `.none`.

```swift highlight-remove
// Remove all decorations
try engine.block.setTextDecoration(text, config: TextDecorationConfig())
```

## Full Code

Here's the full code:

```swift highlight-text-decorations
import Foundation
import IMGLYEngine

@MainActor
func textDecorations(engine: Engine) async throws {
  let scene = try engine.scene.create()
  let text = try engine.block.create(.text)
  try engine.block.appendChild(to: scene, child: text)
  try engine.block.setWidthMode(text, mode: .auto)
  try engine.block.setHeightMode(text, mode: .auto)
  try engine.block.replaceText(text, text: "Hello CE.SDK")

  // Toggle underline on the entire text
  try engine.block.toggleTextDecorationUnderline(text)

  // Toggle strikethrough on the entire text
  try engine.block.toggleTextDecorationStrikethrough(text)

  // Toggle overline on the entire text
  try engine.block.toggleTextDecorationOverline(text)

  // Calling toggle again removes the decoration
  try engine.block.toggleTextDecorationOverline(text)

  // Query the current decoration configurations
  // Returns a list of unique TextDecorationConfig values in the range
  let decorations = try engine.block.getTextDecorations(text)
  // Each config contains: line, style, underlineColor, underlineThickness, underlineOffset, skipInk

  // Set a specific decoration style
  // Available styles: .solid, .double, .dotted, .dashed, .wavy
  try engine.block.setTextDecoration(text, config: TextDecorationConfig(
    line: .underline,
    style: .dashed,
  ))

  // Set a custom underline color (only applies to underlines)
  // Strikethrough and overline always use the text color
  try engine.block.setTextDecoration(text, config: TextDecorationConfig(
    line: .underline,
    underlineColor: .rgba(r: 1, g: 0, b: 0, a: 1),
  ))

  // Adjust the underline thickness
  // Default is 1.0, values above 1.0 make the line thicker
  try engine.block.setTextDecoration(text, config: TextDecorationConfig(
    line: .underline,
    underlineThickness: 2.0,
  ))

  // Adjust the underline position relative to the font default
  // 0 = font default, positive values move further from baseline, negative values move closer
  try engine.block.setTextDecoration(text, config: TextDecorationConfig(
    line: .underline,
    underlineOffset: 0.1,
  ))

  // Apply decorations to a specific character range using Range<String.Index>
  let currentText = try engine.block.getString(text, property: "text/text")
  let helloRange = currentText.startIndex ..< currentText.index(currentText.startIndex, offsetBy: 5)

  // Toggle underline on "Hello"
  try engine.block.toggleTextDecorationUnderline(text, in: helloRange)

  // Query decorations in a specific range
  let subrangeDecorations = try engine.block.getTextDecorations(text, in: helloRange)

  // Combine multiple decoration lines on the same text
  // All active lines share the same style and thickness
  try engine.block.setTextDecoration(text, config: TextDecorationConfig(
    line: [.underline, .strikethrough],
  ))

  // Remove all decorations
  try engine.block.setTextDecoration(text, config: TextDecorationConfig())

  _ = decorations
  _ = subrangeDecorations
}
```



---

## More Resources

- **[Mac Catalyst Documentation Index](https://img.ly/docs/cesdk/mac-catalyst/)** - Browse all Mac Catalyst documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/mac-catalyst/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/mac-catalyst/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
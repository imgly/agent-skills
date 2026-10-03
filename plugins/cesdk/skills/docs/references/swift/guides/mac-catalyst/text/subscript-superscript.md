> This is one page of the CE.SDK Mac Catalyst documentation. For a complete overview, see the [Mac Catalyst Documentation Index](https://img.ly/docs/cesdk/mac-catalyst/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/mac-catalyst/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Create and Edit Text](../text.md) > [Subscript and Superscript](./subscript-superscript.md)

---

```swift file=@cesdk_swift_examples/engine-guides-text-subscript-superscript/ScriptStyle.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func scriptStyle(engine: Engine) async throws {
  let scene = try engine.scene.create()
  let text = try engine.block.create(.text)
  try engine.block.appendChild(to: scene, child: text)
  try engine.block.setWidthMode(text, mode: .auto)
  try engine.block.setHeightMode(text, mode: .auto)
  let content = "$1999 H2O E=mc2"
  try engine.block.replaceText(text, text: content)

  // Raise the cents of the price above the rest of the line.
  // Superscript text is scaled down and raised automatically.
  let cents = content.index(content.startIndex, offsetBy: 3) ..< content.index(content.startIndex, offsetBy: 5)
  try engine.block.setTextScriptStyle(text, scriptStyle: .superscript, in: cents)

  // Raise the exponent of the formula
  let exponent = content.index(content.startIndex, offsetBy: 14) ..< content.endIndex
  try engine.block.setTextScriptStyle(text, scriptStyle: .superscript, in: exponent)

  // Lower the "2" of the water formula below the rest of the line
  let waterDigit = content.index(content.startIndex, offsetBy: 7) ..< content.index(content.startIndex, offsetBy: 8)
  try engine.block.setTextScriptStyle(text, scriptStyle: .subscript, in: waterDigit)

  // Query the unique script styles in a range, in document order
  let scriptStyles = try engine.block.getTextScriptStyles(text)
  // e.g. [.normal, .superscript, .subscript]

  // Query a specific range
  let centsScriptStyle = try engine.block.getTextScriptStyles(text, in: cents)
  // [.superscript]

  // Each text run reports its script style
  let runs = try engine.block.getTextRuns(text)
  // e.g. runs[1].scriptStyle == .superscript

  // Adjust the size and position of shifted text for the whole block.
  // The scale is a factor of the font size. The shift is a fraction of
  // the unscaled font size.
  try engine.block.setFloat(text, property: "text/superscriptFontScale", value: 0.65)
  try engine.block.setFloat(text, property: "text/superscriptVerticalShift", value: 0.4)
  try engine.block.setFloat(text, property: "text/subscriptFontScale", value: 0.65)
  try engine.block.setFloat(text, property: "text/subscriptVerticalShift", value: 0.25)

  // Reset a range back to regular text
  try engine.block.setTextScriptStyle(text, scriptStyle: .normal, in: exponent)

  _ = scriptStyles
  _ = centsScriptStyle
  _ = runs
}

```

Format ranges of text as subscript or superscript for prices, formulas, footnotes, and technical notation.

CE.SDK formats superscript and subscript synthetically: the affected range is scaled down to 58.3% of its font size and shifted up or down by 33.3% of the unscaled font size. These defaults match common design applications, so the feature works with every font, and block properties let you adjust the scale and shift. Lines grow automatically when a shifted range needs more room, and exports include the shifted glyphs. Superscript and subscript combine with text decorations, text on a path, and text animations.

## Apply Superscript

Raise a range above the rest of the line using `engine.block.setTextScriptStyle()` with `.superscript` and a `Range<String.Index>`. Passing `nil` for the subrange changes the whole text or the current selection.

```swift highlight-superscript
  // Raise the cents of the price above the rest of the line.
  // Superscript text is scaled down and raised automatically.
  let cents = content.index(content.startIndex, offsetBy: 3) ..< content.index(content.startIndex, offsetBy: 5)
  try engine.block.setTextScriptStyle(text, scriptStyle: .superscript, in: cents)

  // Raise the exponent of the formula
  let exponent = content.index(content.startIndex, offsetBy: 14) ..< content.endIndex
  try engine.block.setTextScriptStyle(text, scriptStyle: .superscript, in: exponent)
```

## Apply Subscript

Lower a range below the rest of the line with `.subscript`.

```swift highlight-subscript
// Lower the "2" of the water formula below the rest of the line
let waterDigit = content.index(content.startIndex, offsetBy: 7) ..< content.index(content.startIndex, offsetBy: 8)
try engine.block.setTextScriptStyle(text, scriptStyle: .subscript, in: waterDigit)
```

## Query Script Styles

Query the script styles using `engine.block.getTextScriptStyles()`. It returns the ordered list of unique values in the range: `.normal`, `.superscript`, or `.subscript`.

```swift highlight-query-scriptStyles
  // Query the unique script styles in a range, in document order
  let scriptStyles = try engine.block.getTextScriptStyles(text)
  // e.g. [.normal, .superscript, .subscript]

  // Query a specific range
  let centsScriptStyle = try engine.block.getTextScriptStyles(text, in: cents)
  // [.superscript]
```

## Text Runs

Each entry returned by `engine.block.getTextRuns()` reports the `scriptStyle` of that run alongside its other formatting properties.

```swift highlight-text-runs
// Each text run reports its script style
let runs = try engine.block.getTextRuns(text)
// e.g. runs[1].scriptStyle == .superscript
```

## Adjust Size and Position

Four block properties control how superscript and subscript are rendered. The font scale is a factor of the font size, the vertical shift is a fraction of the unscaled font size. The properties apply to all shifted ranges in the block.

```swift highlight-adjust
// Adjust the size and position of shifted text for the whole block.
// The scale is a factor of the font size. The shift is a fraction of
// the unscaled font size.
try engine.block.setFloat(text, property: "text/superscriptFontScale", value: 0.65)
try engine.block.setFloat(text, property: "text/superscriptVerticalShift", value: 0.4)
try engine.block.setFloat(text, property: "text/subscriptFontScale", value: 0.65)
try engine.block.setFloat(text, property: "text/subscriptVerticalShift", value: 0.25)
```

## Reset to Normal

Reset a range back to regular text with `.normal`.

```swift highlight-reset
// Reset a range back to regular text
try engine.block.setTextScriptStyle(text, scriptStyle: .normal, in: exponent)
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

- **[Mac Catalyst Documentation Index](https://img.ly/docs/cesdk/mac-catalyst/)** - Browse all Mac Catalyst documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/mac-catalyst/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/mac-catalyst/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
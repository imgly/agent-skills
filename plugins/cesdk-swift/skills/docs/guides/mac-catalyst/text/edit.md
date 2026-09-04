> This is one page of the CE.SDK Mac Catalyst documentation. For a complete overview, see the [Mac Catalyst Documentation Index](https://img.ly/docs/cesdk/mac-catalyst/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/mac-catalyst/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Create and Edit Text](../text.md) > [Edit Text](./edit.md)

---

```swift file=@cesdk_swift_examples/engine-guides-text-edit/TextEdit.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func textEdit(engine: Engine) async throws {
  let baseURL = try engine.guidesBaseURL

  // Demo scaffolding: a Pixel-unit page sized for a single styled headline so
  // the formatting changes are visible in the captured hero export.
  let scene = try engine.scene.create(designUnit: .px)
  let page = try engine.block.create(.page)
  try engine.block.appendChild(to: scene, child: page)
  try engine.block.setWidth(page, value: 800)
  try engine.block.setHeight(page, value: 400)

  // Create a text block and position it on the page.
  let text = try engine.block.create(.text)
  try engine.block.appendChild(to: page, child: text)
  try engine.block.setPositionX(text, value: 100)
  try engine.block.setPositionY(text, value: 150)
  try engine.block.setWidthMode(text, mode: .auto)
  try engine.block.setHeightMode(text, mode: .auto)

  // Define a Roboto typeface with regular, bold, italic, and bold-italic variants.
  // Each variant the example formats with later (bold / italic / etc.) needs a matching font in the typeface.
  let robotoBase = baseURL.appendingPathComponent("ly.img.typeface/fonts/Roboto")
  let typeface = Typeface(
    name: "Roboto",
    fonts: [
      Font(
        uri: robotoBase.appendingPathComponent("Roboto-Regular.ttf"),
        subFamily: "Regular",
        weight: .normal,
        style: .normal,
      ),
      Font(
        uri: robotoBase.appendingPathComponent("Roboto-Bold.ttf"),
        subFamily: "Bold",
        weight: .bold,
        style: .normal,
      ),
      Font(
        uri: robotoBase.appendingPathComponent("Roboto-Italic.ttf"),
        subFamily: "Italic",
        weight: .normal,
        style: .italic,
      ),
      Font(
        uri: robotoBase.appendingPathComponent("Roboto-BoldItalic.ttf"),
        subFamily: "Bold Italic",
        weight: .bold,
        style: .italic,
      ),
    ],
  )
  try engine.block.setFont(text, fontFileURL: typeface.fonts[0].uri, typeface: typeface)
  try engine.block.setTextFontSize(text, fontSize: 80)

  // Replace the entire text content.
  try engine.block.replaceText(text, text: "Hello World!")
  // Replace "World" with "CE.SDK".
  try engine.block.replaceText(text, text: "CE.SDK", in: "Hello World!".range(of: "World")!)
  // Insert " Guide" before the exclamation mark.
  let insertion = "Hello CE.SDK!".range(of: "!")!.lowerBound
  try engine.block.replaceText(text, text: " Guide", in: insertion ..< insertion)

  // Remove "Hello " to leave "CE.SDK Guide!".
  try engine.block.removeText(text, from: "Hello CE.SDK Guide!".range(of: "Hello ")!)

  // Apply bold weight to "CE.SDK".
  try engine.block.setTextFontWeight(
    text,
    fontWeight: .bold,
    in: "CE.SDK Guide!".range(of: "CE.SDK")!,
  )
  // Apply a blue color to "Guide".
  try engine.block.setTextColor(
    text,
    color: .rgba(r: 0.2, g: 0.6, b: 1.0, a: 1.0),
    in: "CE.SDK Guide!".range(of: "Guide")!,
  )
  // Apply italic style to "Guide".
  try engine.block.setTextFontStyle(
    text,
    fontStyle: .italic,
    in: "CE.SDK Guide!".range(of: "Guide")!,
  )
  // Uppercase the "Guide" range.
  try engine.block.setTextCase(
    text,
    textCase: .uppercase,
    in: "CE.SDK Guide!".range(of: "Guide")!,
  )

  try await engine.captureGuide(page, label: "hero")

  if try engine.block.canToggleBoldFont(text, in: "CE.SDK Guide!".range(of: "Guide")!) {
    try engine.block.toggleBoldFont(text, in: "CE.SDK Guide!".range(of: "Guide")!)
  }
  if try engine.block.canToggleItalicFont(text, in: "CE.SDK Guide!".range(of: "CE.SDK")!) {
    try engine.block.toggleItalicFont(text, in: "CE.SDK Guide!".range(of: "CE.SDK")!)
  }

  let colors = try engine.block.getTextColors(text)
  let weights = try engine.block.getTextFontWeights(text)
  let styles = try engine.block.getTextFontStyles(text)
  let sizes = try engine.block.getTextFontSizes(text)
  let cases = try engine.block.getTextCases(text)
  print("Colors: \(colors)")
  print("Weights: \(weights), styles: \(styles)")
  print("Sizes: \(sizes), cases: \(cases)")

  // Apply a different typeface to a range, preserving formatting where possible.
  try engine.block.setTypeface(text, typeface: typeface, in: "CE.SDK Guide!".range(of: "Guide")!)
  // Read back the block's base typeface and the unique typefaces in the block.
  let baseTypeface = try engine.block.getTypeface(text)
  let typefacesInBlock = try engine.block.getTypefaces(text)
  print("Base typeface: \(baseTypeface.name), unique typefaces in block: \(typefacesInBlock.count)")

  let lineCount = try engine.block.getTextVisibleLineCount(text)
  for index in 0 ..< lineCount {
    let content = try engine.block.getTextVisibleLineContent(text, lineIndex: index)
    let bounds = try engine.block.getTextLineBoundingBoxRect(text, index: index)
    print("Line \(index): \"\(content)\" at \(bounds)")
  }

  let metrics = try await engine.editor.getFontMetrics(fontFileURI: typeface.fonts[0].uri.absoluteString)
  print(
    "Ascender: \(metrics.ascender), descender: \(metrics.descender), unitsPerEm: \(metrics.unitsPerEm)",
  )
  print(
    "Cap height: \(metrics.capHeight), x-height: \(metrics.xHeight), line gap: \(metrics.lineGap)",
  )
}
```

Edit text content programmatically with range-based APIs for replacing,
formatting, and querying text.

![A text block rendered with mixed formatting: "CE.SDK" in bold and "GUIDE" in blue italic uppercase.](https://img.ly/docs/cesdk/mac-catalyst/text/edit-c5106b/assets/swift-based.hero.webp)

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.83.0-nightly.20260904/engine-guides-text-edit)

<EngineReferenceNote {...props} />

CE.SDK provides text editing through range-based APIs that operate on Swift `Range<String.Index>` values. This guide covers replacing and removing text content, applying formatting to character ranges, querying text properties, and retrieving line and font information.

## Creating a Text Block

Create a text block and add it to the page. Set both width and height modes to `.auto` so the block resizes around its content.

```swift highlight-textEdit-createText
// Create a text block and position it on the page.
let text = try engine.block.create(.text)
try engine.block.appendChild(to: page, child: text)
try engine.block.setPositionX(text, value: 100)
try engine.block.setPositionY(text, value: 150)
try engine.block.setWidthMode(text, mode: .auto)
try engine.block.setHeightMode(text, mode: .auto)
```

## Setting a Typeface

Define a typeface with the font variants the example needs and apply it with `setFont(_:fontFileURL:typeface:)`. Including a bold variant in the typeface is what later lets `setTextFontWeight(_:fontWeight:in:)` and `toggleBoldFont(_:in:)` switch a range to bold.

```swift highlight-textEdit-setTypeface
// Define a Roboto typeface with regular, bold, italic, and bold-italic variants.
// Each variant the example formats with later (bold / italic / etc.) needs a matching font in the typeface.
let robotoBase = baseURL.appendingPathComponent("ly.img.typeface/fonts/Roboto")
let typeface = Typeface(
  name: "Roboto",
  fonts: [
    Font(
      uri: robotoBase.appendingPathComponent("Roboto-Regular.ttf"),
      subFamily: "Regular",
      weight: .normal,
      style: .normal,
    ),
    Font(
      uri: robotoBase.appendingPathComponent("Roboto-Bold.ttf"),
      subFamily: "Bold",
      weight: .bold,
      style: .normal,
    ),
    Font(
      uri: robotoBase.appendingPathComponent("Roboto-Italic.ttf"),
      subFamily: "Italic",
      weight: .normal,
      style: .italic,
    ),
    Font(
      uri: robotoBase.appendingPathComponent("Roboto-BoldItalic.ttf"),
      subFamily: "Bold Italic",
      weight: .bold,
      style: .italic,
    ),
  ],
)
try engine.block.setFont(text, fontFileURL: typeface.fonts[0].uri, typeface: typeface)
try engine.block.setTextFontSize(text, fontSize: 80)
```

## Replacing and Removing Text

Use `replaceText(_:text:in:)` to swap or insert text. Passing a zero-length subrange inserts at that position; passing a non-zero range replaces it. Omitting the subrange replaces the entire content.

```swift highlight-textEdit-replaceText
// Replace the entire text content.
try engine.block.replaceText(text, text: "Hello World!")
// Replace "World" with "CE.SDK".
try engine.block.replaceText(text, text: "CE.SDK", in: "Hello World!".range(of: "World")!)
// Insert " Guide" before the exclamation mark.
let insertion = "Hello CE.SDK!".range(of: "!")!.lowerBound
try engine.block.replaceText(text, text: " Guide", in: insertion ..< insertion)
```

Use `removeText(_:from:)` to delete a character range. Omitting the subrange clears the block.

```swift highlight-textEdit-removeText
// Remove "Hello " to leave "CE.SDK Guide!".
try engine.block.removeText(text, from: "Hello CE.SDK Guide!".range(of: "Hello ")!)
```

The example builds the `Range<String.Index>` arguments from the expected text content (`"Hello World!"` → `"Hello CE.SDK!"` → `"Hello CE.SDK Guide!"`). In an interactive editor, pass the user's current selection instead.

## Applying Text Formatting

Apply formatting to specific character ranges with the `setText*` setters. Each accepts an optional `in:` subrange — omit it to format the entire block.

```swift highlight-textEdit-setFormatting
// Apply bold weight to "CE.SDK".
try engine.block.setTextFontWeight(
  text,
  fontWeight: .bold,
  in: "CE.SDK Guide!".range(of: "CE.SDK")!,
)
// Apply a blue color to "Guide".
try engine.block.setTextColor(
  text,
  color: .rgba(r: 0.2, g: 0.6, b: 1.0, a: 1.0),
  in: "CE.SDK Guide!".range(of: "Guide")!,
)
// Apply italic style to "Guide".
try engine.block.setTextFontStyle(
  text,
  fontStyle: .italic,
  in: "CE.SDK Guide!".range(of: "Guide")!,
)
// Uppercase the "Guide" range.
try engine.block.setTextCase(
  text,
  textCase: .uppercase,
  in: "CE.SDK Guide!".range(of: "Guide")!,
)
```

- `setTextFontWeight(_:fontWeight:in:)` applies a `FontWeight` such as `.bold` or `.normal`.
- `setTextColor(_:color:in:)` takes a `Color`; `.rgba(r:g:b:a:)` constructs an sRGB value.
- `setTextFontStyle(_:fontStyle:in:)` switches between `.normal` and `.italic`.
- `setTextFontSize(_:fontSize:in:)` updates the font size in the scene's font-size unit; when applied to the whole block, the block's font size is updated.
- `setTextCase(_:textCase:in:)` applies `.titlecase`, `.uppercase`, `.lowercase`, or `.normal`.

`toggleBoldFont(_:in:)` and `toggleItalicFont(_:in:)` flip the weight or style of a range. Gate each call on the matching `canToggle*Font(_:in:)` check, which returns `false` when the active typeface lacks a corresponding variant.

```swift highlight-textEdit-toggleFormatting
if try engine.block.canToggleBoldFont(text, in: "CE.SDK Guide!".range(of: "Guide")!) {
  try engine.block.toggleBoldFont(text, in: "CE.SDK Guide!".range(of: "Guide")!)
}
if try engine.block.canToggleItalicFont(text, in: "CE.SDK Guide!".range(of: "CE.SDK")!) {
  try engine.block.toggleItalicFont(text, in: "CE.SDK Guide!".range(of: "CE.SDK")!)
}
```

Use `setTypeface(_:typeface:in:)` to apply a typeface to the block or to a specific range. When the new typeface differs from the current one, existing weights and styles are preserved where possible, falling back to the closest available variant. `setFont(_:fontFileURL:typeface:)`, in contrast, resets the block's formatting.

```swift highlight-textEdit-typefaceManagement
// Apply a different typeface to a range, preserving formatting where possible.
try engine.block.setTypeface(text, typeface: typeface, in: "CE.SDK Guide!".range(of: "Guide")!)
// Read back the block's base typeface and the unique typefaces in the block.
let baseTypeface = try engine.block.getTypeface(text)
let typefacesInBlock = try engine.block.getTypefaces(text)
print("Base typeface: \(baseTypeface.name), unique typefaces in block: \(typefacesInBlock.count)")
```

## Querying Text Properties

Each `getText*` getter returns an array of the unique values found in the queried range — text blocks can contain mixed formatting, so the array length tells you whether the range is uniform.

```swift highlight-textEdit-queryFormatting
let colors = try engine.block.getTextColors(text)
let weights = try engine.block.getTextFontWeights(text)
let styles = try engine.block.getTextFontStyles(text)
let sizes = try engine.block.getTextFontSizes(text)
let cases = try engine.block.getTextCases(text)
print("Colors: \(colors)")
print("Weights: \(weights), styles: \(styles)")
print("Sizes: \(sizes), cases: \(cases)")
```

`getTypeface(_:)` returns the block's base typeface, and `getTypefaces(_:in:)` returns the unique typefaces used by the runs in a range. Omit the subrange on any getter to query the entire block.

## Line Information

After the block has rendered, query its visible lines. `getTextVisibleLineCount(_:)` returns the number of rendered lines, `getTextVisibleLineContent(_:lineIndex:)` returns the line's text, and `getTextLineBoundingBoxRect(_:index:)` returns the line's bounding box in the scene's global coordinate space.

```swift highlight-textEdit-lineInfo
let lineCount = try engine.block.getTextVisibleLineCount(text)
for index in 0 ..< lineCount {
  let content = try engine.block.getTextVisibleLineContent(text, lineIndex: index)
  let bounds = try engine.block.getTextLineBoundingBoxRect(text, index: index)
  print("Line \(index): \"\(content)\" at \(bounds)")
}
```

## Font Metrics

`engine.editor.getFontMetrics(fontFileURI:)` returns the font's raw design-unit metrics. The font is fetched asynchronously if it has not been loaded yet.

```swift highlight-textEdit-fontMetrics
let metrics = try await engine.editor.getFontMetrics(fontFileURI: typeface.fonts[0].uri.absoluteString)
print(
  "Ascender: \(metrics.ascender), descender: \(metrics.descender), unitsPerEm: \(metrics.unitsPerEm)",
)
print(
  "Cap height: \(metrics.capHeight), x-height: \(metrics.xHeight), line gap: \(metrics.lineGap)",
)
```

The returned `FontMetrics` value exposes `ascender`, `descender`, `unitsPerEm`, `lineGap`, `capHeight`, `xHeight`, `underlineOffset`, `underlineSize`, `strikeoutOffset`, and `strikeoutSize`. Use these to compute line heights, align mixed-typeface runs, or position decorations.

## Troubleshooting

**Range indices unexpected**: Build ranges from the current text content. After a `replaceText` or `removeText` call, the indices into the old string are no longer valid.

**Formatting not applied**: Confirm the active typeface ships a variant for the requested weight or style. `canToggleBoldFont(_:in:)` and `canToggleItalicFont(_:in:)` return `false` when no matching variant is available.

**Typeface change loses formatting**: `setFont(_:fontFileURL:typeface:)` resets the block's formatting. Use `setTypeface(_:typeface:in:)` to preserve weights and styles where possible.

**Line count is zero**: The block has to render before line information is available. Empty text blocks report zero lines.

## API Reference

### Methods

| Method | Description |
| --- | --- |
| `engine.block.setFont(_:fontFileURL:typeface:)` | Set font and typeface, resetting formatting |
| `engine.block.setTypeface(_:typeface:in:)` | Change typeface, preserving formatting where possible |
| `engine.block.getTypeface(_:)` | Get the block's base typeface |
| `engine.block.getTypefaces(_:in:)` | Get unique typefaces in a range |
| `engine.block.replaceText(_:text:in:)` | Replace or insert text at a range |
| `engine.block.removeText(_:from:)` | Remove text in a range |
| `engine.block.setTextColor(_:color:in:)` | Set color for a range |
| `engine.block.getTextColors(_:in:)` | Get unique colors in a range |
| `engine.block.setTextFontWeight(_:fontWeight:in:)` | Set font weight for a range |
| `engine.block.getTextFontWeights(_:in:)` | Get unique font weights in a range |
| `engine.block.setTextFontStyle(_:fontStyle:in:)` | Set font style for a range |
| `engine.block.getTextFontStyles(_:in:)` | Get unique font styles in a range |
| `engine.block.setTextFontSize(_:fontSize:in:)` | Set font size for a range |
| `engine.block.getTextFontSizes(_:in:)` | Get unique font sizes in a range |
| `engine.block.setTextCase(_:textCase:in:)` | Set text case for a range |
| `engine.block.getTextCases(_:in:)` | Get unique text cases in a range |
| `engine.block.canToggleBoldFont(_:in:)` | Whether bold can be toggled for a range |
| `engine.block.canToggleItalicFont(_:in:)` | Whether italic can be toggled for a range |
| `engine.block.toggleBoldFont(_:in:)` | Toggle bold for a range |
| `engine.block.toggleItalicFont(_:in:)` | Toggle italic for a range |
| `engine.block.getTextCursorRange()` | Get the user's grapheme selection range; returns `nil` when no text block is being edited |
| `engine.block.setTextCursorRange(_:)` | Set the cursor or selection; throws when no text block is being edited |
| `engine.block.getTextVisibleLineCount(_:)` | Number of rendered lines |
| `engine.block.getTextVisibleLineContent(_:lineIndex:)` | Text content of a rendered line |
| `engine.block.getTextLineBoundingBoxRect(_:index:)` | Bounding box of a rendered line |
| `engine.editor.getFontMetrics(fontFileURI:)` | Raw font metrics for a font file URI |

## Next Steps

- [Add Text](./add.md) — Create and configure text blocks
- [Text Styling](./styling.md) — Apply fonts, colors, and formatting
- [Text Designs](./text-designs.md) — Create and customize text component libraries using predefined text designs that appear in your asset library
- [Auto-Size](./auto-size.md) — Configure automatic text sizing



---

## More Resources

- **[Mac Catalyst Documentation Index](https://img.ly/docs/cesdk/mac-catalyst/)** - Browse all Mac Catalyst documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/mac-catalyst/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/mac-catalyst/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
> This is one page of the CE.SDK Mac Catalyst documentation. For a complete overview, see the [Mac Catalyst Documentation Index](https://img.ly/docs/cesdk/mac-catalyst/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/mac-catalyst/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Create and Edit Text](../text.md) > [Text Styling](./styling.md)

---

```swift file=@cesdk_swift_examples/engine-guides-text-properties/TextProperties.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func textProperties(engine: Engine) async throws {
  // Demo scaffolding: a Pixel-unit page so `text/fontSize` literals interpret
  // as pixels and the captured exports show the rendered output at its
  // intended scale.
  let scene = try engine.scene.create(designUnit: .px)
  let page = try engine.block.create(.page)
  try engine.block.setWidth(page, value: 800)
  try engine.block.setHeight(page, value: 300)
  try engine.block.appendChild(to: scene, child: page)

  let text = try engine.block.create(.text)
  try engine.block.appendChild(to: page, child: text)
  try engine.block.setWidthMode(text, mode: .auto)
  try engine.block.setHeightMode(text, mode: .auto)

  try engine.block.replaceText(text, text: "Hello World")
  // Add a "!" at the end of the text
  try engine.block.replaceText(text, text: "!", in: "Hello World".endIndex ..< "Hello World".endIndex)
  // Replace "World" with "CE.SDK"
  try engine.block.replaceText(text, text: "CE.SDK", in: "Hello World".range(of: "World")!)

  try engine.block.setTextFontSize(text, fontSize: 80)
  try engine.block.setPositionX(text, value: 230)
  try engine.block.setPositionY(text, value: 100)

  try await engine.scene.zoom(to: text, paddingLeft: 100, paddingTop: 100, paddingRight: 100, paddingBottom: 100)

  // Remove the "Hello "
  try engine.block.removeText(text, from: "Hello CE.SDK".range(of: "Hello ")!)

  try engine.block.setTextColor(text, color: .rgba(r: 1, g: 1, b: 0))
  try engine.block.setTextColor(text, color: .rgba(r: 0, g: 0, b: 0), in: "CE.SDK".range(of: "E.SDK")!)
  let allColors = try engine.block.getTextColors(text)
  print("All unique colors: \(allColors)")
  let colorsInRange = try engine.block.getTextColors(text, in: "CE.SDK!".range(of: "E.SDK!")!)
  print("Colors in \"E.SDK!\": \(colorsInRange)")

  try engine.block.setBackgroundColorEnabled(text, enabled: true)

  let currentBackgroundColor = try engine.block.getBackgroundColor(text)
  print("Current background color: \(currentBackgroundColor)")
  try engine.block.setBackgroundColor(text, r: 0.0, g: 0.0, b: 1.0, a: 1.0)

  try engine.block.setFloat(text, property: "backgroundColor/paddingLeft", value: 8)
  try engine.block.setFloat(text, property: "backgroundColor/paddingTop", value: 8)
  try engine.block.setFloat(text, property: "backgroundColor/paddingRight", value: 8)
  try engine.block.setFloat(text, property: "backgroundColor/paddingBottom", value: 8)

  try engine.block.setFloat(text, property: "backgroundColor/cornerRadius", value: 12)

  // Most-evolved positive visual state — captured before setInAnimation makes
  // the text invisible at t=0 and before setFont resets the per-range colors.
  try await engine.captureGuide(page, label: "hero")

  let animation = try engine.block.createAnimation(AnimationType.slide)
  try engine.block.setEnum(animation, property: "textAnimationWritingStyle", value: "Block")

  try engine.block.setInAnimation(text, animation: animation)
  try engine.block.setOutAnimation(text, animation: animation)

  try engine.block.setTextCase(text, textCase: .titlecase)

  let textCases = try engine.block.getTextCases(text)
  print("Text cases: \(textCases)")

  let baseURL = try engine.guidesBaseURL

  let typeface = Typeface(
    name: "Roboto",
    fonts: [
      Font(
        uri: baseURL.appendingPathComponent("ly.img.typeface/fonts/Roboto/Roboto-Bold.ttf"),
        subFamily: "Bold",
        weight: .bold,
        style: .normal,
      ),
      Font(
        uri: baseURL.appendingPathComponent("ly.img.typeface/fonts/Roboto/Roboto-BoldItalic.ttf"),
        subFamily: "Bold Italic",
        weight: .bold,
        style: .italic,
      ),
      Font(
        uri: baseURL.appendingPathComponent("ly.img.typeface/fonts/Roboto/Roboto-Italic.ttf"),
        subFamily: "Italic",
        weight: .normal,
        style: .italic,
      ),
      Font(
        uri: baseURL.appendingPathComponent("ly.img.typeface/fonts/Roboto/Roboto-Regular.ttf"),
        subFamily: "Regular",
        weight: .normal,
        style: .normal,
      ),
    ],
  )
  try engine.block.setFont(text, fontFileURL: typeface.fonts[3].uri, typeface: typeface)

  try engine.block.setTypeface(text, typeface: typeface, in: "CE.SDK".range(of: "E.SDK")!)
  try engine.block.setTypeface(text, typeface: typeface)

  let currentDefaultTypeface = try engine.block.getTypeface(text)
  print("Default typeface: \(currentDefaultTypeface.name)")

  let currentTypefaces = try engine.block.getTypefaces(text)
  let currentTypefacesOfRange = try engine.block.getTypefaces(text, in: "CE.SDK".range(of: "E.SDK")!)
  print("Typefaces across the block: \(currentTypefaces.map(\.name))")
  print("Typefaces in \"E.SDK\": \(currentTypefacesOfRange.map(\.name))")

  if try engine.block.canToggleBoldFont(text) {
    try engine.block.toggleBoldFont(text)
  }
  if try engine.block.canToggleBoldFont(text, in: "CE.SDK".range(of: "E.SDK")!) {
    try engine.block.toggleBoldFont(text, in: "CE.SDK".range(of: "E.SDK")!)
  }

  if try engine.block.canToggleItalicFont(text) {
    try engine.block.toggleItalicFont(text)
  }
  if try engine.block.canToggleItalicFont(text, in: "CE.SDK".range(of: "E.SDK")!) {
    try engine.block.toggleItalicFont(text, in: "CE.SDK".range(of: "E.SDK")!)
  }

  try engine.block.setTextFontWeight(text, fontWeight: .bold)

  let fontWeights = try engine.block.getTextFontWeights(text)
  print("Font weights: \(fontWeights)")

  try engine.block.setTextFontStyle(text, fontStyle: .italic)

  let fontStyles = try engine.block.getTextFontStyles(text)
  print("Font styles: \(fontStyles)")
}
```

Style text blocks programmatically with colors, backgrounds, typefaces, and formatting.

![Two-color text on a rounded blue background demonstrating per-range colors, padding, and corner radius.](https://img.ly/docs/cesdk/mac-catalyst/text/styling-269c48/assets/swift-based.hero.webp)

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.82.0-nightly.20260825/engine-guides-text-properties)

<EngineReferenceNote {...props} />

CE.SDK exposes text styling through the Block API. Edit text content, apply colors and backgrounds, manage typefaces, and control case, weight, and style for an entire text block or for individual character ranges. Ranges are described with native Swift `Range<String.Index>` values.

## Editing Text Content

Use `engine.block.replaceText(_:text:in:)` and `engine.block.removeText(_:from:)` to replace, insert, or remove text. The `in` and `from` arguments are optional Swift string ranges — passing `nil` applies the operation to the entire string.

The snippets below compute ranges with `String.range(of:)` against a literal that matches the block's current text — `"Hello World".range(of: "World")` works only because the block currently holds `"Hello World"`. When you tweak the example, update each literal to match the live text before computing the range.

Replacing the whole string is the common case:

```swift highlight-replaceText
try engine.block.replaceText(text, text: "Hello World")
```

Pass an empty range to insert at its lower bound. The example appends a `"!"` after the existing text:

```swift highlight-replaceText-single-index
// Add a "!" at the end of the text
try engine.block.replaceText(text, text: "!", in: "Hello World".endIndex ..< "Hello World".endIndex)
```

Use `String.range(of:)` to locate a substring and replace only that range. Here `"World"` becomes `"CE.SDK"`:

```swift highlight-replaceText-range
// Replace "World" with "CE.SDK"
try engine.block.replaceText(text, text: "CE.SDK", in: "Hello World".range(of: "World")!)
```

`removeText(_:from:)` mirrors the same shape. Pass an explicit range to remove a substring, or pass `nil` to clear the whole text:

```swift highlight-removeText
// Remove the "Hello "
try engine.block.removeText(text, from: "Hello CE.SDK".range(of: "Hello ")!)
```

## Text Colors

Apply colors to the entire text block or to a specific range with `engine.block.setTextColor(_:color:in:)`. Use `Color.rgba(r:g:b:a:)` for RGBA colors or `Color.spot(name:tint:)` for spot colors.

Color the whole string first:

```swift highlight-setTextColor
try engine.block.setTextColor(text, color: .rgba(r: 1, g: 1, b: 0))
```

Then override the color on a specific range. The example below leaves the leading `"C"` and the trailing `"!"` yellow, but renders the middle `"E.SDK"` in black:

```swift highlight-setTextColor-range
try engine.block.setTextColor(text, color: .rgba(r: 0, g: 0, b: 0), in: "CE.SDK".range(of: "E.SDK")!)
```

`engine.block.getTextColors(_:in:)` returns the ordered list of unique colors in the requested range. For the full text the result is `[yellow, black]`, since yellow appears first:

```swift highlight-getTextColors
let allColors = try engine.block.getTextColors(text)
print("All unique colors: \(allColors)")
```

Querying the `"E.SDK!"` range returns `[black, yellow]` — the range starts in the black middle and ends on the yellow `!`, so black appears first:

```swift highlight-getTextColors-range
let colorsInRange = try engine.block.getTextColors(text, in: "CE.SDK!".range(of: "E.SDK!")!)
print("Colors in \"E.SDK!\": \(colorsInRange)")
```

## Text Backgrounds

Enable the background, then customize the color, padding, and corner radius.

Enable the background with `engine.block.setBackgroundColorEnabled(_:enabled:)`:

```swift highlight-backgroundColor-enabled
try engine.block.setBackgroundColorEnabled(text, enabled: true)
```

Read the current background color with `engine.block.getBackgroundColor(_:)` and change it with `engine.block.setBackgroundColor(_:r:g:b:a:)`:

```swift highlight-backgroundColor-get-set
let currentBackgroundColor = try engine.block.getBackgroundColor(text)
print("Current background color: \(currentBackgroundColor)")
try engine.block.setBackgroundColor(text, r: 0.0, g: 0.0, b: 1.0, a: 1.0)
```

Padding and corner radius are exposed as `backgroundColor/*` block properties. Adjust each padding side independently using `engine.block.setFloat(_:property:value:)` and the `backgroundColor/paddingLeft`, `backgroundColor/paddingRight`, `backgroundColor/paddingTop`, and `backgroundColor/paddingBottom` properties:

```swift highlight-backgroundColor-padding
try engine.block.setFloat(text, property: "backgroundColor/paddingLeft", value: 8)
try engine.block.setFloat(text, property: "backgroundColor/paddingTop", value: 8)
try engine.block.setFloat(text, property: "backgroundColor/paddingRight", value: 8)
try engine.block.setFloat(text, property: "backgroundColor/paddingBottom", value: 8)
```

Round the corners by setting `backgroundColor/cornerRadius`:

```swift highlight-backgroundColor-cornerRadius
try engine.block.setFloat(text, property: "backgroundColor/cornerRadius", value: 12)
```

Text backgrounds inherit the animations assigned to their text block when `textAnimationWritingStyle` is set to `"Block"`:

```swift highlight-backgroundColor-animation
  let animation = try engine.block.createAnimation(AnimationType.slide)
  try engine.block.setEnum(animation, property: "textAnimationWritingStyle", value: "Block")

  try engine.block.setInAnimation(text, animation: animation)
  try engine.block.setOutAnimation(text, animation: animation)
```

## Text Case Transformations

Render text in a different case without modifying the underlying string. The case is a render-time modifier — `engine.block.replaceText(_:text:)` still returns the original characters.

`engine.block.setTextCase(_:textCase:in:)` takes a `TextCase` value:

- `.normal` — render the string as stored.
- `.uppercase` — render every character in upper case.
- `.lowercase` — render every character in lower case.
- `.titlecase` — render the first character of each word in upper case.

```swift highlight-setTextCase
try engine.block.setTextCase(text, textCase: .titlecase)
```

`engine.block.getTextCases(_:in:)` returns the ordered list of text cases in the requested range:

```swift highlight-getTextCases
let textCases = try engine.block.getTextCases(text)
print("Text cases: \(textCases)")
```

## Typefaces and Fonts

Use `engine.block.setFont(_:fontFileURL:typeface:)` when you want to change the font and reset existing formatting. Use `engine.block.setTypeface(_:typeface:in:)` when you want to change the typeface while preserving existing formatting.

A `Typeface` carries the typeface name and a list of `Font` definitions. Each `Font` needs a `uri` pointing at the font file and a `subFamily` string matching the font's effective name within the typeface. The `weight` and `style` fields let the engine select the right variant when toggling bold or italic.

```swift highlight-setFont
let typeface = Typeface(
  name: "Roboto",
  fonts: [
    Font(
      uri: baseURL.appendingPathComponent("ly.img.typeface/fonts/Roboto/Roboto-Bold.ttf"),
      subFamily: "Bold",
      weight: .bold,
      style: .normal,
    ),
    Font(
      uri: baseURL.appendingPathComponent("ly.img.typeface/fonts/Roboto/Roboto-BoldItalic.ttf"),
      subFamily: "Bold Italic",
      weight: .bold,
      style: .italic,
    ),
    Font(
      uri: baseURL.appendingPathComponent("ly.img.typeface/fonts/Roboto/Roboto-Italic.ttf"),
      subFamily: "Italic",
      weight: .normal,
      style: .italic,
    ),
    Font(
      uri: baseURL.appendingPathComponent("ly.img.typeface/fonts/Roboto/Roboto-Regular.ttf"),
      subFamily: "Regular",
      weight: .normal,
      style: .normal,
    ),
  ],
)
try engine.block.setFont(text, fontFileURL: typeface.fonts[3].uri, typeface: typeface)
```

`setTypeface(_:typeface:in:)` keeps the current weight and style as much as the new typeface allows. If the new typeface does not support the current combination, the engine falls back to the closest available variant or to the typeface's fallback font:

```swift highlight-setTypeface
try engine.block.setTypeface(text, typeface: typeface, in: "CE.SDK".range(of: "E.SDK")!)
try engine.block.setTypeface(text, typeface: typeface)
```

Query the current typeface with `engine.block.getTypeface(_:)`. A newly created text block has no explicit typeface set, so this call throws until `setFont(_:fontFileURL:typeface:)` is called for the first time:

```swift highlight-getTypeface
let currentDefaultTypeface = try engine.block.getTypeface(text)
print("Default typeface: \(currentDefaultTypeface.name)")
```

`engine.block.getTypefaces(_:in:)` returns the ordered list of unique typefaces used across the requested range:

```swift highlight-getTypefaces
let currentTypefaces = try engine.block.getTypefaces(text)
let currentTypefacesOfRange = try engine.block.getTypefaces(text, in: "CE.SDK".range(of: "E.SDK")!)
print("Typefaces across the block: \(currentTypefaces.map(\.name))")
print("Typefaces in \"E.SDK\": \(currentTypefacesOfRange.map(\.name))")
```

## Font Weights and Styles

A text block can mix weights and styles across ranges. Toggle between normal and bold, or between normal and italic, using the typed toggle APIs. The active typeface must include a font variant matching the requested combination — otherwise the toggle returns `false` and the call to apply it throws.

`engine.block.canToggleBoldFont(_:in:)` reports whether bold can be toggled; `engine.block.toggleBoldFont(_:in:)` applies the toggle:

```swift highlight-toggleBold
if try engine.block.canToggleBoldFont(text) {
  try engine.block.toggleBoldFont(text)
}
if try engine.block.canToggleBoldFont(text, in: "CE.SDK".range(of: "E.SDK")!) {
  try engine.block.toggleBoldFont(text, in: "CE.SDK".range(of: "E.SDK")!)
}
```

`engine.block.canToggleItalicFont(_:in:)` and `engine.block.toggleItalicFont(_:in:)` work the same way for italic:

```swift highlight-toggleItalic
if try engine.block.canToggleItalicFont(text) {
  try engine.block.toggleItalicFont(text)
}
if try engine.block.canToggleItalicFont(text, in: "CE.SDK".range(of: "E.SDK")!) {
  try engine.block.toggleItalicFont(text, in: "CE.SDK".range(of: "E.SDK")!)
}
```

To set a font weight directly without toggling, use `engine.block.setTextFontWeight(_:fontWeight:in:)`:

```swift highlight-setTextFontWeight
try engine.block.setTextFontWeight(text, fontWeight: .bold)
```

`engine.block.getTextFontWeights(_:in:)` returns the ordered list of unique font weights in the requested range:

```swift highlight-getTextFontWeights
let fontWeights = try engine.block.getTextFontWeights(text)
print("Font weights: \(fontWeights)")
```

`engine.block.setTextFontStyle(_:fontStyle:in:)` and `engine.block.getTextFontStyles(_:in:)` are the equivalent setter and getter for font styles:

```swift highlight-setTextFontStyle
try engine.block.setTextFontStyle(text, fontStyle: .italic)
```

```swift highlight-getTextFontStyles
let fontStyles = try engine.block.getTextFontStyles(text)
print("Font styles: \(fontStyles)")
```

## API Reference

### Methods

| Method | Purpose |
| --- | --- |
| `engine.block.replaceText(_:text:in:)` | Replace or insert text at a Swift string range |
| `engine.block.removeText(_:from:)` | Remove text at a Swift string range |
| `engine.block.setTextColor(_:color:in:)` | Set the text color for the whole block or a range |
| `engine.block.getTextColors(_:in:)` | Get the ordered unique text colors for a range |
| `engine.block.setBackgroundColorEnabled(_:enabled:)` | Enable or disable the text background |
| `engine.block.setBackgroundColor(_:r:g:b:a:)` | Set the text background color |
| `engine.block.getBackgroundColor(_:)` | Read the text background color |
| `engine.block.setFloat(_:property:value:)` | Set a numeric block property such as `backgroundColor/paddingLeft` or `backgroundColor/cornerRadius` |
| `engine.block.createAnimation(_:)` | Create an animation block |
| `engine.block.setEnum(_:property:value:)` | Set an enum-valued property such as `textAnimationWritingStyle` |
| `engine.block.setInAnimation(_:animation:)` | Assign an in-animation to the text block |
| `engine.block.setOutAnimation(_:animation:)` | Assign an out-animation to the text block |
| `engine.block.setTextCase(_:textCase:in:)` | Apply a text case transformation |
| `engine.block.getTextCases(_:in:)` | Get the ordered text cases for a range |
| `engine.block.setFont(_:fontFileURL:typeface:)` | Change the font and reset existing formatting |
| `engine.block.setTypeface(_:typeface:in:)` | Change the typeface while preserving formatting |
| `engine.block.getTypeface(_:)` | Get the text block's default typeface |
| `engine.block.getTypefaces(_:in:)` | Get the ordered unique typefaces for a range |
| `engine.block.canToggleBoldFont(_:in:)` | Check whether bold can be toggled |
| `engine.block.toggleBoldFont(_:in:)` | Toggle between normal and bold weight |
| `engine.block.canToggleItalicFont(_:in:)` | Check whether italic can be toggled |
| `engine.block.toggleItalicFont(_:in:)` | Toggle between normal and italic style |
| `engine.block.setTextFontWeight(_:fontWeight:in:)` | Set the font weight for the whole block or a range |
| `engine.block.getTextFontWeights(_:in:)` | Get the ordered unique font weights for a range |
| `engine.block.setTextFontStyle(_:fontStyle:in:)` | Set the font style for the whole block or a range |
| `engine.block.getTextFontStyles(_:in:)` | Get the ordered unique font styles for a range |

### Properties

| Property | Type | Description |
| --- | --- | --- |
| `backgroundColor/paddingLeft` | Float | Padding to the left of the text |
| `backgroundColor/paddingRight` | Float | Padding to the right of the text |
| `backgroundColor/paddingTop` | Float | Padding above the text |
| `backgroundColor/paddingBottom` | Float | Padding below the text |
| `backgroundColor/cornerRadius` | Float | Corner radius of the background rectangle |
| `textAnimationWritingStyle` | Enum | Set to `"Block"` so the background follows the text block's animations |

## Troubleshooting

**`getTypeface(_:)` throws an error** — A new text block has no explicit typeface until `setFont(_:fontFileURL:typeface:)` is called for the first time.

**Bold or italic toggle does nothing** — Confirm the active `Typeface` includes a `Font` definition matching the requested `weight` and `style` combination.

**Text background is not visible** — Call `setBackgroundColorEnabled(_:enabled:)` with `enabled: true` before changing colors, padding, or corner radius.

**Text case looks different from the string value** — Text case transformations affect rendering only. The stored string value is unchanged; reading it back with the engine still returns the original characters.

**Formatting resets after changing fonts** — Use `setTypeface(_:typeface:in:)` instead of `setFont(_:fontFileURL:typeface:)` to keep weights, styles, and per-range overrides.



---

## More Resources

- **[Mac Catalyst Documentation Index](https://img.ly/docs/cesdk/mac-catalyst/)** - Browse all Mac Catalyst documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/mac-catalyst/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/mac-catalyst/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
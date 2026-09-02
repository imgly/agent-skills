> This is one page of the CE.SDK iOS documentation. For a complete overview, see the [iOS Documentation Index](https://img.ly/docs/cesdk/ios/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/ios/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Create and Edit Text](../text.md) > [Add Text](./add.md)

---

```swift file=@cesdk_swift_examples/engine-guides-text-add/AddText.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func addText(engine: Engine) async throws {
  // Demo scaffolding: a Pixel-unit page so `text/fontSize` literals interpret
  // as pixels and the captured exports show the rendered output at its
  // intended scale.
  let scene = try engine.scene.create(designUnit: .px)
  let page = try engine.block.create(.page)
  try engine.block.setWidth(page, value: 800)
  try engine.block.setHeight(page, value: 960)
  try engine.block.appendChild(to: scene, child: page)

  let titleBlock = try engine.block.create(.text)
  try engine.block.appendChild(to: page, child: titleBlock)
  try engine.block.replaceText(titleBlock, text: "Welcome to CE.SDK")

  try engine.block.setWidthMode(titleBlock, mode: .auto)
  try engine.block.setHeightMode(titleBlock, mode: .auto)
  try engine.block.setPositionX(titleBlock, value: 40)
  try engine.block.setPositionY(titleBlock, value: 40)

  // The example builds font file URLs from a base URL that points at the
  // CE.SDK asset location. Replace it with wherever your app bundles or hosts
  // the CE.SDK font assets.
  let baseURL = try engine.guidesBaseURL

  let caveatRegular = Font(
    uri: baseURL.appendingPathComponent("ly.img.typeface/fonts/Caveat/Caveat-Regular.ttf"),
    subFamily: "Regular",
    weight: .normal,
    style: .normal,
  )
  let caveatBold = Font(
    uri: baseURL.appendingPathComponent("ly.img.typeface/fonts/Caveat/Caveat-Bold.ttf"),
    subFamily: "Bold",
    weight: .bold,
    style: .normal,
  )
  let caveatTypeface = Typeface(name: "Caveat", fonts: [caveatRegular, caveatBold])

  try engine.block.setFont(titleBlock, fontFileURL: caveatBold.uri, typeface: caveatTypeface)
  try engine.block.setTextFontSize(titleBlock, fontSize: 48)

  let robotoRegular = Font(
    uri: baseURL.appendingPathComponent("ly.img.typeface/fonts/Roboto/Roboto-Regular.ttf"),
    subFamily: "Regular",
    weight: .normal,
    style: .normal,
  )
  let robotoTypeface = Typeface(
    name: "Roboto",
    fonts: [
      robotoRegular,
      Font(
        uri: baseURL.appendingPathComponent("ly.img.typeface/fonts/Roboto/Roboto-Bold.ttf"),
        subFamily: "Bold",
        weight: .bold,
        style: .normal,
      ),
      Font(
        uri: baseURL.appendingPathComponent("ly.img.typeface/fonts/Roboto/Roboto-Italic.ttf"),
        subFamily: "Italic",
        weight: .normal,
        style: .italic,
      ),
      Font(
        uri: baseURL.appendingPathComponent("ly.img.typeface/fonts/Roboto/Roboto-BoldItalic.ttf"),
        subFamily: "Bold Italic",
        weight: .bold,
        style: .italic,
      ),
    ],
  )

  // Scaffolding: a second text block, fixed to the page width so the range
  // styling below wraps within the page. The styling snippet operates on it.
  let richText = "Rich text with colors and styles"
  let richTextBlock = try engine.block.create(.text)
  try engine.block.appendChild(to: page, child: richTextBlock)
  try engine.block.replaceText(richTextBlock, text: richText)
  try engine.block.setPositionX(richTextBlock, value: 40)
  try engine.block.setPositionY(richTextBlock, value: 140)
  try engine.block.setWidth(richTextBlock, value: 720)
  try engine.block.setWidthMode(richTextBlock, mode: .absolute)
  try engine.block.setHeightMode(richTextBlock, mode: .auto)
  try engine.block.setTextFontSize(richTextBlock, fontSize: 48)
  try engine.block.setFont(richTextBlock, fontFileURL: robotoRegular.uri, typeface: robotoTypeface)

  // "Rich" in blue.
  try engine.block.setTextColor(richTextBlock, color: .rgba(r: 0.2, g: 0.4, b: 0.8), in: richText.range(of: "Rich")!)
  // "text" in bold.
  try engine.block.setTextFontWeight(richTextBlock, fontWeight: .bold, in: richText.range(of: "text")!)
  // "with" in italic.
  try engine.block.setTextFontStyle(richTextBlock, fontStyle: .italic, in: richText.range(of: "with")!)
  // "colors" in orange and larger type.
  try engine.block.setTextColor(richTextBlock, color: .rgba(r: 0.9, g: 0.5, b: 0.1), in: richText.range(of: "colors")!)
  try engine.block.setTextFontSize(richTextBlock, fontSize: 56, in: richText.range(of: "colors")!)
  // "and" uses a different typeface.
  try engine.block.setTypeface(richTextBlock, typeface: caveatTypeface, in: richText.range(of: "and")!)
  // "styles" in green uppercase.
  try engine.block.setTextColor(richTextBlock, color: .rgba(r: 0.2, g: 0.7, b: 0.3), in: richText.range(of: "styles")!)
  try engine.block.setTextCase(richTextBlock, textCase: .uppercase, in: richText.range(of: "styles")!)

  try await engine.captureGuide(page, label: "after-rich-text")

  let autoSizeBlock = try engine.block.create(.text)
  try engine.block.appendChild(to: page, child: autoSizeBlock)
  try engine.block.replaceText(autoSizeBlock, text: "Auto-sizing text block")
  try engine.block.setPositionX(autoSizeBlock, value: 40)
  try engine.block.setPositionY(autoSizeBlock, value: 300)

  try engine.block.setWidth(autoSizeBlock, value: 720)
  try engine.block.setWidthMode(autoSizeBlock, mode: .absolute)
  try engine.block.setHeightMode(autoSizeBlock, mode: .auto)
  try engine.block.setTextFontSize(autoSizeBlock, fontSize: 48)

  let caseBlock = try engine.block.create(.text)
  try engine.block.appendChild(to: page, child: caseBlock)
  try engine.block.replaceText(caseBlock, text: "uppercase text")
  try engine.block.setPositionX(caseBlock, value: 40)
  try engine.block.setPositionY(caseBlock, value: 420)
  try engine.block.setWidthMode(caseBlock, mode: .auto)
  try engine.block.setHeightMode(caseBlock, mode: .auto)
  try engine.block.setTextFontSize(caseBlock, fontSize: 48)

  try engine.block.setTextCase(caseBlock, textCase: .uppercase)

  let alignedBlock = try engine.block.create(.text)
  try engine.block.appendChild(to: page, child: alignedBlock)
  try engine.block.replaceText(alignedBlock, text: "Centered Text\nWith Line Spacing")
  try engine.block.setPositionX(alignedBlock, value: 40)
  try engine.block.setPositionY(alignedBlock, value: 540)
  try engine.block.setWidth(alignedBlock, value: 720)
  try engine.block.setWidthMode(alignedBlock, mode: .absolute)
  try engine.block.setHeightMode(alignedBlock, mode: .auto)
  try engine.block.setTextFontSize(alignedBlock, fontSize: 48)

  try engine.block.setTextHorizontalAlignment(alignedBlock, alignment: .center)
  try engine.block.setTextLineHeight(alignedBlock, lineHeight: 1.5)
  try engine.block.setFloat(alignedBlock, property: "text/letterSpacing", value: 0.05)

  // Scaffolding: a block styled with all four Roboto variants so both toggles
  // have a matching counterpart variant to switch to.
  let toggleText = "Toggle Bold and Italic"
  let toggleBlock = try engine.block.create(.text)
  try engine.block.appendChild(to: page, child: toggleBlock)
  try engine.block.replaceText(toggleBlock, text: toggleText)
  try engine.block.setPositionX(toggleBlock, value: 40)
  try engine.block.setPositionY(toggleBlock, value: 740)
  try engine.block.setWidthMode(toggleBlock, mode: .auto)
  try engine.block.setHeightMode(toggleBlock, mode: .auto)
  try engine.block.setTextFontSize(toggleBlock, fontSize: 48)
  try engine.block.setFont(toggleBlock, fontFileURL: robotoRegular.uri, typeface: robotoTypeface)

  let boldRange = toggleText.range(of: "Bold")!
  if try engine.block.canToggleBoldFont(toggleBlock, in: boldRange) {
    try engine.block.toggleBoldFont(toggleBlock, in: boldRange)
  }

  let italicRange = toggleText.range(of: "Italic")!
  if try engine.block.canToggleItalicFont(toggleBlock, in: italicRange) {
    try engine.block.toggleItalicFont(toggleBlock, in: italicRange)
  }

  let helloWorld = "Hello World"
  let modifyBlock = try engine.block.create(.text)
  try engine.block.appendChild(to: page, child: modifyBlock)
  try engine.block.replaceText(modifyBlock, text: helloWorld)
  try engine.block.setPositionX(modifyBlock, value: 40)
  try engine.block.setPositionY(modifyBlock, value: 840)
  try engine.block.setWidthMode(modifyBlock, mode: .auto)
  try engine.block.setHeightMode(modifyBlock, mode: .auto)
  try engine.block.setTextFontSize(modifyBlock, fontSize: 48)

  // Replace "World" while keeping the surrounding text.
  try engine.block.replaceText(modifyBlock, text: "CE.SDK", in: helloWorld.range(of: "World")!)
  // Remove the leading "Hello " to leave just "CE.SDK".
  try engine.block.removeText(modifyBlock, from: "Hello CE.SDK".range(of: "Hello ")!)

  try await engine.captureGuide(page, label: "hero")
}
```

Create and configure text blocks in CE.SDK with custom fonts, rich text styling, and dynamic sizing options.

![Rendered text scene with styled text blocks](https://img.ly/docs/cesdk/ios/text/add-4f5011/assets/swift-based.hero.webp)

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.83.0-nightly.20260902/engine-guides-text-add)

<EngineReferenceNote {...props} />

Text blocks are fundamental design elements for displaying titles, captions, labels, and body text. CE.SDK provides range-based styling APIs so a single text block can contain multiple colors, font weights, font styles, and text cases.

The snippets below assume you already have an `Engine` instance and the target page block you want to add text to.

## Create Text Blocks

Create a text block with `engine.block.create(.text)` and attach it to a page with `appendChild(to:child:)`. Use `replaceText(_:text:)` for both the initial text and later text replacements.

```swift highlight-addText-create
  let titleBlock = try engine.block.create(.text)
  try engine.block.appendChild(to: page, child: titleBlock)
  try engine.block.replaceText(titleBlock, text: "Welcome to CE.SDK")

  try engine.block.setWidthMode(titleBlock, mode: .auto)
  try engine.block.setHeightMode(titleBlock, mode: .auto)
  try engine.block.setPositionX(titleBlock, value: 40)
  try engine.block.setPositionY(titleBlock, value: 40)
```

Text blocks can size themselves to their content. Set the width and height modes to `.auto` when the block should fit its text.

## Apply Fonts and Typefaces

Apply a font with `setFont(_:fontFileURL:typeface:)`. Provide both the concrete font file URL and a `Typeface` that describes the font family and its available variants.

```swift highlight-addText-set-font
  let caveatRegular = Font(
    uri: baseURL.appendingPathComponent("ly.img.typeface/fonts/Caveat/Caveat-Regular.ttf"),
    subFamily: "Regular",
    weight: .normal,
    style: .normal,
  )
  let caveatBold = Font(
    uri: baseURL.appendingPathComponent("ly.img.typeface/fonts/Caveat/Caveat-Bold.ttf"),
    subFamily: "Bold",
    weight: .bold,
    style: .normal,
  )
  let caveatTypeface = Typeface(name: "Caveat", fonts: [caveatRegular, caveatBold])

  try engine.block.setFont(titleBlock, fontFileURL: caveatBold.uri, typeface: caveatTypeface)
  try engine.block.setTextFontSize(titleBlock, fontSize: 48)
```

Use `setFont` to replace the block's active font file. Use `setTypeface(_:typeface:in:)` when you want CE.SDK to keep the current formatting — such as bold or italic — as far as the new typeface supports it.

The example builds font file URLs from a base URL that points at the CE.SDK asset location. Replace it with wherever your app bundles or hosts the CE.SDK font assets.

When later snippets apply weight, style, or toggle formatting, use a typeface that includes the variants those operations need.

```swift highlight-addText-font-variants
let robotoRegular = Font(
  uri: baseURL.appendingPathComponent("ly.img.typeface/fonts/Roboto/Roboto-Regular.ttf"),
  subFamily: "Regular",
  weight: .normal,
  style: .normal,
)
let robotoTypeface = Typeface(
  name: "Roboto",
  fonts: [
    robotoRegular,
    Font(
      uri: baseURL.appendingPathComponent("ly.img.typeface/fonts/Roboto/Roboto-Bold.ttf"),
      subFamily: "Bold",
      weight: .bold,
      style: .normal,
    ),
    Font(
      uri: baseURL.appendingPathComponent("ly.img.typeface/fonts/Roboto/Roboto-Italic.ttf"),
      subFamily: "Italic",
      weight: .normal,
      style: .italic,
    ),
    Font(
      uri: baseURL.appendingPathComponent("ly.img.typeface/fonts/Roboto/Roboto-BoldItalic.ttf"),
      subFamily: "Bold Italic",
      weight: .bold,
      style: .italic,
    ),
  ],
)
```

## Style Text Ranges

Style part of a text block by passing a range to the range-based text APIs. Swift ranges are `Range<String.Index>` values built from the text string with `range(of:)`; omitting the range targets the whole block.

```swift highlight-addText-rich-text-styling
// "Rich" in blue.
try engine.block.setTextColor(richTextBlock, color: .rgba(r: 0.2, g: 0.4, b: 0.8), in: richText.range(of: "Rich")!)
// "text" in bold.
try engine.block.setTextFontWeight(richTextBlock, fontWeight: .bold, in: richText.range(of: "text")!)
// "with" in italic.
try engine.block.setTextFontStyle(richTextBlock, fontStyle: .italic, in: richText.range(of: "with")!)
// "colors" in orange and larger type.
try engine.block.setTextColor(richTextBlock, color: .rgba(r: 0.9, g: 0.5, b: 0.1), in: richText.range(of: "colors")!)
try engine.block.setTextFontSize(richTextBlock, fontSize: 56, in: richText.range(of: "colors")!)
// "and" uses a different typeface.
try engine.block.setTypeface(richTextBlock, typeface: caveatTypeface, in: richText.range(of: "and")!)
// "styles" in green uppercase.
try engine.block.setTextColor(richTextBlock, color: .rgba(r: 0.2, g: 0.7, b: 0.3), in: richText.range(of: "styles")!)
try engine.block.setTextCase(richTextBlock, textCase: .uppercase, in: richText.range(of: "styles")!)
```

The same range pattern applies to text colors, font weights, font styles, font sizes, typefaces, and text cases.

## Configure Auto-Sizing

Combine a fixed width with an automatic height when text should wrap and grow vertically with its content.

```swift highlight-addText-auto-sizing
  let autoSizeBlock = try engine.block.create(.text)
  try engine.block.appendChild(to: page, child: autoSizeBlock)
  try engine.block.replaceText(autoSizeBlock, text: "Auto-sizing text block")
  try engine.block.setPositionX(autoSizeBlock, value: 40)
  try engine.block.setPositionY(autoSizeBlock, value: 300)

  try engine.block.setWidth(autoSizeBlock, value: 720)
  try engine.block.setWidthMode(autoSizeBlock, mode: .absolute)
  try engine.block.setHeightMode(autoSizeBlock, mode: .auto)
  try engine.block.setTextFontSize(autoSizeBlock, fontSize: 48)
```

Use `.absolute` when a dimension should use an explicit design-unit value, `.percent` when it should follow the parent size, and `.auto` when CE.SDK should derive it from the content.

## Apply Text Case Transformations

Use `setTextCase(_:textCase:)` to change the rendered casing without changing the underlying text string.

```swift highlight-addText-text-case
  let caseBlock = try engine.block.create(.text)
  try engine.block.appendChild(to: page, child: caseBlock)
  try engine.block.replaceText(caseBlock, text: "uppercase text")
  try engine.block.setPositionX(caseBlock, value: 40)
  try engine.block.setPositionY(caseBlock, value: 420)
  try engine.block.setWidthMode(caseBlock, mode: .auto)
  try engine.block.setHeightMode(caseBlock, mode: .auto)
  try engine.block.setTextFontSize(caseBlock, fontSize: 48)

  try engine.block.setTextCase(caseBlock, textCase: .uppercase)
```

Available text cases are `.normal`, `.uppercase`, `.lowercase`, and `.titlecase`.

## Set Text Alignment and Spacing

Set paragraph alignment with `setTextHorizontalAlignment(_:alignment:)`, line height with `setTextLineHeight(_:lineHeight:)`, and letter spacing with the `text/letterSpacing` float property.

```swift highlight-addText-text-alignment
  let alignedBlock = try engine.block.create(.text)
  try engine.block.appendChild(to: page, child: alignedBlock)
  try engine.block.replaceText(alignedBlock, text: "Centered Text\nWith Line Spacing")
  try engine.block.setPositionX(alignedBlock, value: 40)
  try engine.block.setPositionY(alignedBlock, value: 540)
  try engine.block.setWidth(alignedBlock, value: 720)
  try engine.block.setWidthMode(alignedBlock, mode: .absolute)
  try engine.block.setHeightMode(alignedBlock, mode: .auto)
  try engine.block.setTextFontSize(alignedBlock, fontSize: 48)

  try engine.block.setTextHorizontalAlignment(alignedBlock, alignment: .center)
  try engine.block.setTextLineHeight(alignedBlock, lineHeight: 1.5)
  try engine.block.setFloat(alignedBlock, property: "text/letterSpacing", value: 0.05)
```

Line height is a multiplier of the font size, so `1.5` means 150%. Letter spacing is a proportion of the font size.

## Toggle Bold and Italic

Use the toggle helpers when you want CE.SDK to switch between the normal and formatted variants. Check support first, because each toggle needs a matching counterpart variant for the current range and style. Include normal, bold, italic, and bold italic variants when both toggles should work across all four states.

```swift highlight-addText-toggle-bold-italic
  let boldRange = toggleText.range(of: "Bold")!
  if try engine.block.canToggleBoldFont(toggleBlock, in: boldRange) {
    try engine.block.toggleBoldFont(toggleBlock, in: boldRange)
  }

  let italicRange = toggleText.range(of: "Italic")!
  if try engine.block.canToggleItalicFont(toggleBlock, in: italicRange) {
    try engine.block.toggleItalicFont(toggleBlock, in: italicRange)
  }
```

The range argument targets the same text ranges used by the styling APIs.

## Modify Text Content

Use `replaceText(_:text:in:)` with a range to replace part of the text while keeping the surrounding content. Omitting the range replaces the full text string.

```swift highlight-addText-modify-text
  let helloWorld = "Hello World"
  let modifyBlock = try engine.block.create(.text)
  try engine.block.appendChild(to: page, child: modifyBlock)
  try engine.block.replaceText(modifyBlock, text: helloWorld)
  try engine.block.setPositionX(modifyBlock, value: 40)
  try engine.block.setPositionY(modifyBlock, value: 840)
  try engine.block.setWidthMode(modifyBlock, mode: .auto)
  try engine.block.setHeightMode(modifyBlock, mode: .auto)
  try engine.block.setTextFontSize(modifyBlock, fontSize: 48)

  // Replace "World" while keeping the surrounding text.
  try engine.block.replaceText(modifyBlock, text: "CE.SDK", in: helloWorld.range(of: "World")!)
  // Remove the leading "Hello " to leave just "CE.SDK".
  try engine.block.removeText(modifyBlock, from: "Hello CE.SDK".range(of: "Hello ")!)
```

Use `removeText(_:from:)` with the same range convention when you need to delete text from a block.

## Troubleshooting

### Text Not Displaying

- Verify that `replaceText` set the text content.
- Check that `appendChild(to:child:)` attaches the text block to a page.
- Ensure the text block has a width or uses automatic sizing.

### Font Not Loading

- Verify the font URL is reachable from the device.
- Check that the `Typeface` metadata matches the font files.
- Include every font variant needed by the bold and italic toggles.

### Range Styling Not Applying

- Verify that the range is valid and non-empty for the current text.
- Check that the active typeface supports the requested font weight or style.

## API Reference

### Methods

| Method | Description |
| --- | --- |
| `engine.block.create(.text)` | Create a new text block. |
| `engine.block.appendChild(to:child:)` | Attach the text block to a page or scene hierarchy. |
| `engine.block.replaceText(_:text:)` | Set or replace the full text content. |
| `engine.block.replaceText(_:text:in:)` | Replace the text within a range. |
| `engine.block.removeText(_:from:)` | Remove the text within a range. |
| `engine.block.setFont(_:fontFileURL:typeface:)` | Bind a concrete font file and typeface to a text block. |
| `engine.block.setTypeface(_:typeface:in:)` | Apply a typeface while preserving compatible formatting. |
| `engine.block.setTextColor(_:color:in:)` | Apply text color to a range. |
| `engine.block.setTextFontWeight(_:fontWeight:in:)` | Apply font weight to a range. |
| `engine.block.setTextFontStyle(_:fontStyle:in:)` | Apply font style to a range. |
| `engine.block.setTextFontSize(_:fontSize:in:)` | Apply font size to the block or a range. |
| `engine.block.setTextCase(_:textCase:in:)` | Apply a visual text case transformation to the block or a range. |
| `engine.block.canToggleBoldFont(_:in:)` | Check whether a range can switch to or from bold. |
| `engine.block.toggleBoldFont(_:in:)` | Toggle bold styling for a range. |
| `engine.block.canToggleItalicFont(_:in:)` | Check whether a range can switch to or from italic. |
| `engine.block.toggleItalicFont(_:in:)` | Toggle italic styling for a range. |
| `engine.block.setWidthMode(_:mode:)` | Set how CE.SDK resolves a block width. |
| `engine.block.setHeightMode(_:mode:)` | Set how CE.SDK resolves a block height. |
| `engine.block.setWidth(_:value:)` | Set an explicit block width. |
| `engine.block.setPositionX(_:value:)` | Set a block's horizontal position. |
| `engine.block.setPositionY(_:value:)` | Set a block's vertical position. |
| `engine.block.setTextHorizontalAlignment(_:alignment:)` | Set horizontal alignment for the block. |
| `engine.block.setTextLineHeight(_:lineHeight:)` | Set line height for all paragraphs. |
| `engine.block.setFloat(_:property:value:)` | Set a float property, such as letter spacing. |

### Properties

| Property | Type | Description |
| --- | --- | --- |
| `text/letterSpacing` | Float | Letter spacing as a proportion of the font size. |

## Next Steps

- [Style Text](./styling.md) - Apply fills, strokes, and backgrounds to text.
- [Auto-Size Text](./auto-size.md) - Configure text blocks to resize dynamically.
- [Adjust Text Spacing](./adjust-spacing.md) - Fine-tune letter and line spacing.
- [Add Emojis](./emojis.md) - Display emoji characters with custom fonts.
- [Add Text Effects](./effects.md) - Apply visual effects to text blocks.



---

## More Resources

- **[iOS Documentation Index](https://img.ly/docs/cesdk/ios/)** - Browse all iOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/ios/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/ios/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
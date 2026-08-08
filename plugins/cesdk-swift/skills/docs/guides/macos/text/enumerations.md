> This is one page of the CE.SDK macOS documentation. For a complete overview, see the [macOS Documentation Index](https://img.ly/docs/cesdk/macos/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/macos/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Create and Edit Text](../text.md) > [Text Enumerations](./enumerations.md)

---

```swift file=@cesdk_swift_examples/engine-guides-text-enumerations/TextEnumerations.swift reference-only
import IMGLYEngine

@MainActor
func textEnumerations(engine: Engine) async throws {
  let scene = try engine.scene.create()
  let text = try engine.block.create(.text)
  try engine.block.appendChild(to: scene, child: text)
  try engine.block.setWidthMode(text, mode: .auto)
  try engine.block.setHeightMode(text, mode: .auto)
  try engine.block.replaceText(text, text: "First item\nSecond item\nThird item")

  // Apply ordered list style to all paragraphs (paragraphIndex defaults to -1 = all)
  try engine.block.setTextListStyle(text, listStyle: .ordered)

  // Override the third paragraph (index 2) to unordered
  try engine.block.setTextListStyle(text, listStyle: .unordered, paragraphIndex: 2)

  // Set the second paragraph (index 1) to nesting level 1 (one indent deep)
  try engine.block.setTextListLevel(text, listLevel: 1, paragraphIndex: 1)

  // Read back the nesting level to confirm
  let level = try engine.block.getTextListLevel(text, paragraphIndex: 1)
  // level == 1

  // Atomically set both list style and nesting level in one call
  // Sets paragraph 0 to ordered style at nesting level 0 (outermost)
  try engine.block.setTextListStyle(text, listStyle: .ordered, paragraphIndex: 0, listLevel: 0)

  // Get all paragraph indices in the text block
  let allIndices = try engine.block.getTextParagraphIndices(text)
  // allIndices == [0, 1, 2]

  // Get indices overlapping a specific character subrange
  let content = try engine.block.getString(text, property: "text/text")
  let subrange = content.startIndex ..< content.index(content.startIndex, offsetBy: 10)
  let rangeIndices = try engine.block.getTextParagraphIndices(text, in: subrange)
  // rangeIndices == [0]

  // Read back the list style and nesting level for each paragraph
  let styles = try allIndices.map { try engine.block.getTextListStyle(text, paragraphIndex: $0) }
  let levels = try allIndices.map { try engine.block.getTextListLevel(text, paragraphIndex: $0) }
  // styles == [.ordered, .ordered, .unordered]
  // levels == [0, 1, 0]

  _ = level
  _ = rangeIndices
  _ = styles
  _ = levels
}

```

Apply bullet and numbered list styles to text blocks, control nesting levels, and query the list configuration of any paragraph.

CE.SDK formats lists at the paragraph level. Each paragraph in a text block has an independent `ListStyle` (`.none`, `.unordered`, or `.ordered`) and a zero-based `listLevel` for visual nesting depth. A single API call can target one paragraph by index or all paragraphs at once using the default index of `-1`.

## Setup

Create a text block with three paragraphs separated by newline characters.

```swift highlight-textEnumerations-setup
let scene = try engine.scene.create()
let text = try engine.block.create(.text)
try engine.block.appendChild(to: scene, child: text)
try engine.block.setWidthMode(text, mode: .auto)
try engine.block.setHeightMode(text, mode: .auto)
try engine.block.replaceText(text, text: "First item\nSecond item\nThird item")
```

## Apply List Styles

Use `engine.block.setTextListStyle(_:listStyle:paragraphIndex:)` to apply a `ListStyle` to one or all paragraphs. Passing no `paragraphIndex` (default `-1`) applies the style to every paragraph simultaneously.

| Value | Renders as |
|-------|-----------|
| `.unordered` | Bullet marker (•) |
| `.ordered` | Auto-incrementing number (1., 2., …) |
| `.none` | Plain text — removes list formatting |

```swift highlight-textEnumerations-applyListStyles
  // Apply ordered list style to all paragraphs (paragraphIndex defaults to -1 = all)
  try engine.block.setTextListStyle(text, listStyle: .ordered)

  // Override the third paragraph (index 2) to unordered
  try engine.block.setTextListStyle(text, listStyle: .unordered, paragraphIndex: 2)
```

> **Note:** Write operations require the `"text/character"` scope to be enabled on the text block.

## Manage Nesting Levels

Control the visual depth of list items using `engine.block.setTextListLevel(_:listLevel:paragraphIndex:)`. The level is zero-based: `0` is the outermost indent. Use `engine.block.getTextListLevel(_:paragraphIndex:)` to read the current depth. Nesting has no visual effect when the list style is `.none`.

```swift highlight-textEnumerations-manageNesting
  // Set the second paragraph (index 1) to nesting level 1 (one indent deep)
  try engine.block.setTextListLevel(text, listLevel: 1, paragraphIndex: 1)

  // Read back the nesting level to confirm
  let level = try engine.block.getTextListLevel(text, paragraphIndex: 1)
  // level == 1
```

## Atomic Style and Level Assignment

Pass the optional `listLevel` parameter to `setTextListStyle` to set both the style and nesting level in a single call.

```swift highlight-textEnumerations-atomic
// Atomically set both list style and nesting level in one call
// Sets paragraph 0 to ordered style at nesting level 0 (outermost)
try engine.block.setTextListStyle(text, listStyle: .ordered, paragraphIndex: 0, listLevel: 0)
```

## Resolve Paragraph Indices

Use `engine.block.getTextParagraphIndices(_:in:)` to find which paragraph indices overlap a text range. Pass `nil` (the default) to retrieve all indices. This is the right tool before targeted per-paragraph operations when you only know a character position—for example, after calling `engine.block.getTextCursorRange()` to get the current selection.

```swift highlight-textEnumerations-paragraphIndices
  // Get all paragraph indices in the text block
  let allIndices = try engine.block.getTextParagraphIndices(text)
  // allIndices == [0, 1, 2]

  // Get indices overlapping a specific character subrange
  let content = try engine.block.getString(text, property: "text/text")
  let subrange = content.startIndex ..< content.index(content.startIndex, offsetBy: 10)
  let rangeIndices = try engine.block.getTextParagraphIndices(text, in: subrange)
  // rangeIndices == [0]
```

## Query List Styles

Read the list style and nesting level of each paragraph using `getTextListStyle` and `getTextListLevel`. Both getters require a non-negative `paragraphIndex`.

```swift highlight-textEnumerations-queryListStyles
// Read back the list style and nesting level for each paragraph
let styles = try allIndices.map { try engine.block.getTextListStyle(text, paragraphIndex: $0) }
let levels = try allIndices.map { try engine.block.getTextListLevel(text, paragraphIndex: $0) }
// styles == [.ordered, .ordered, .unordered]
// levels == [0, 1, 0]
```

## Full Code

```swift highlight-textEnumerations
import IMGLYEngine

@MainActor
func textEnumerations(engine: Engine) async throws {
  let scene = try engine.scene.create()
  let text = try engine.block.create(.text)
  try engine.block.appendChild(to: scene, child: text)
  try engine.block.setWidthMode(text, mode: .auto)
  try engine.block.setHeightMode(text, mode: .auto)
  try engine.block.replaceText(text, text: "First item\nSecond item\nThird item")

  // Apply ordered list style to all paragraphs (paragraphIndex defaults to -1 = all)
  try engine.block.setTextListStyle(text, listStyle: .ordered)

  // Override the third paragraph (index 2) to unordered
  try engine.block.setTextListStyle(text, listStyle: .unordered, paragraphIndex: 2)

  // Set the second paragraph (index 1) to nesting level 1 (one indent deep)
  try engine.block.setTextListLevel(text, listLevel: 1, paragraphIndex: 1)

  // Read back the nesting level to confirm
  let level = try engine.block.getTextListLevel(text, paragraphIndex: 1)
  // level == 1

  // Atomically set both list style and nesting level in one call
  // Sets paragraph 0 to ordered style at nesting level 0 (outermost)
  try engine.block.setTextListStyle(text, listStyle: .ordered, paragraphIndex: 0, listLevel: 0)

  // Get all paragraph indices in the text block
  let allIndices = try engine.block.getTextParagraphIndices(text)
  // allIndices == [0, 1, 2]

  // Get indices overlapping a specific character subrange
  let content = try engine.block.getString(text, property: "text/text")
  let subrange = content.startIndex ..< content.index(content.startIndex, offsetBy: 10)
  let rangeIndices = try engine.block.getTextParagraphIndices(text, in: subrange)
  // rangeIndices == [0]

  // Read back the list style and nesting level for each paragraph
  let styles = try allIndices.map { try engine.block.getTextListStyle(text, paragraphIndex: $0) }
  let levels = try allIndices.map { try engine.block.getTextListLevel(text, paragraphIndex: $0) }
  // styles == [.ordered, .ordered, .unordered]
  // levels == [0, 1, 0]

  _ = level
  _ = rangeIndices
  _ = styles
  _ = levels
}
```

## Next Steps

[Text Decorations](./decorations.md)
[Text Styling](./styling.md)
[Edit Text](./edit.md)



---

## More Resources

- **[macOS Documentation Index](https://img.ly/docs/cesdk/macos/)** - Browse all macOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/macos/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/macos/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
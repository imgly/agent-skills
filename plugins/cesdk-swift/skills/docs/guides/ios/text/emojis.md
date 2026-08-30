> This is one page of the CE.SDK iOS documentation. For a complete overview, see the [iOS Documentation Index](https://img.ly/docs/cesdk/ios/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/ios/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Create and Edit Text](../text.md) > [Emojis](./emojis.md)

---

```swift file=@cesdk_swift_examples/engine-guides-text-with-emojis/TextWithEmojis.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func textWithEmojis(engine: Engine) async throws {
  let baseURL = try engine.guidesBaseURL

  let currentURI = try engine.editor.getSettingString("defaultEmojiFontFileUri")
  print("Current emoji font URI: \(currentURI)")

  try engine.editor.setSettingString(
    "defaultEmojiFontFileUri",
    value: baseURL.appendingPathComponent("emoji/NotoColorEmoji.ttf").absoluteString,
  )

  // Pixel design units pair the font-size unit to pixels, so the `text/fontSize`
  // value below is interpreted as pixels — the default font-size unit is
  // points, which the scene's DPI would otherwise scale up.
  let scene = try engine.scene.create(designUnit: .px)

  let page = try engine.block.create(.page)
  try engine.block.setWidth(page, value: 1080)
  try engine.block.setHeight(page, value: 1080)
  try engine.block.appendChild(to: scene, child: page)

  try await engine.scene.zoom(to: page, paddingLeft: 40, paddingTop: 40, paddingRight: 40, paddingBottom: 40)

  let text = try engine.block.create(.text)
  try engine.block.replaceText(text, text: "Hello World! 🎉 🇩🇪 👨‍👩‍👧 👋🏽")
  try engine.block.setWidth(text, value: 900)
  try engine.block.setHeight(text, value: 200)
  try engine.block.appendChild(to: page, child: text)

  // Hero scaffolding: size the text and center it so emojis are legible at
  // thumbnail. The lesson itself does not require these calls, so they live
  // outside the highlight markers.
  try engine.block.setFloat(text, property: "text/fontSize", value: 64)
  try engine.block.setPositionX(text, value: 80)
  try engine.block.setPositionY(text, value: 480)

  // Snapshot the final scene as the guide's hero image. The label `"hero"` is
  // reserved and tells the promote script which baseline to convert to WebP.
  try await engine.captureGuide(page, label: "hero")
}
```

Configure the emoji font that CE.SDK uses when rendering text blocks and add
text content that includes emojis with the Swift Engine API.

![A text block rendering "Hello World!" alongside party popper, flag, family, and waving-hand emojis using the configured Noto Color Emoji font.](https://img.ly/docs/cesdk/ios/text/emojis-510651/assets/swift-based.hero.webp)

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.83.0-nightly.20260830/engine-guides-text-with-emojis)

<EngineReferenceNote {...props} />

Emojis are Unicode characters representing pictographic symbols. They can be single code points (😀), multi-character sequences (flags like 🇩🇪), Zero-Width-Joiner combinations (👨‍👩‍👧), or skin-tone variants (👋🏽). Regular text fonts do not contain glyphs for these characters, so CE.SDK renders them with a separate emoji font that you configure through the engine's settings.

## Default Emoji Font

CE.SDK ships with [Noto Color Emoji](https://github.com/googlefonts/noto-emoji) (~9.9 MB, PNG-based) loaded from `https://cdn.img.ly/assets/v4/emoji/NotoColorEmoji.ttf` by default. Because CE.SDK draws emojis from a dedicated font file rather than a system font, the same scene renders the same emoji glyphs on iPhone, iPad, and Mac. No configuration is needed for emoji rendering to work.

Read the configured emoji-font override with `getSettingString(_:)`. It returns an empty string while CE.SDK is using its built-in default:

```swift highlight-textWithEmojis-getFont
let currentURI = try engine.editor.getSettingString("defaultEmojiFontFileUri")
print("Current emoji font URI: \(currentURI)")
```

## Configuring the Emoji Font

Point `defaultEmojiFontFileUri` at any accessible URL, CDN path, or bundle file with `setSettingString(_:value:)`. See the [Settings](../settings.md) guide for the full settings API.

```swift highlight-textWithEmojis-setCustomFont
try engine.editor.setSettingString(
  "defaultEmojiFontFileUri",
  value: baseURL.appendingPathComponent("emoji/NotoColorEmoji.ttf").absoluteString,
)
```

## Adding Emojis to Text Blocks

Create a `.text` block and pass emoji characters directly to `replaceText(_:text:)` as part of any UTF-8 string. CE.SDK detects emoji code points and renders them with the configured emoji font; everything else uses the block's regular font.

```swift highlight-textWithEmojis-addText
let text = try engine.block.create(.text)
try engine.block.replaceText(text, text: "Hello World! 🎉 🇩🇪 👨‍👩‍👧 👋🏽")
try engine.block.setWidth(text, value: 900)
try engine.block.setHeight(text, value: 200)
try engine.block.appendChild(to: page, child: text)
```

## The `forceSystemEmojis` Setting

CE.SDK exposes a `forceSystemEmojis` boolean setting that defaults to `true`. When it is `true`, the engine treats every Unicode emoji code point as an emoji and renders it with `defaultEmojiFontFileUri`. When it is `false`, the engine first checks whether the text block's font contains a glyph for that code point and only falls back to the emoji font when it does not.

In practice this rarely changes the rendered output, because most text fonts (Roboto, Open Sans, Inter, system fonts, etc.) do not ship emoji glyphs — so the fallback path lands on the emoji font either way. The setting is most useful when you load a custom font that does include its own emoji glyphs and you want those glyphs to render instead of Noto Color Emoji.

## Troubleshooting

**Emojis look different than expected.** CE.SDK uses Noto Color Emoji by default. To switch to a different emoji style, point `defaultEmojiFontFileUri` at another emoji font.

**Missing emojis.** Custom emoji fonts may not cover the full Unicode emoji range. Verify your font supports the code points you need before swapping the default.

**Large initial download.** The default Noto Color Emoji font is roughly 9.9 MB. If you load it from a remote URL, consider bundling it with your app or prefetching it before the editor needs to render text.

**Want system emojis instead.** CE.SDK always renders text through its own type setter for consistent layout across platforms, so it cannot reach into Apple's system emoji font (Apple Color Emoji) to draw glyphs. To get Apple's look you need to host an emoji font you have a license to use and point `defaultEmojiFontFileUri` at it.

## API Reference

### Methods

| Method | Description |
| --- | --- |
| `engine.editor.getSettingString("defaultEmojiFontFileUri")` | Get the current emoji font URI |
| `engine.editor.setSettingString("defaultEmojiFontFileUri", value:)` | Set a custom emoji font URI |
| `engine.block.create(.text)` | Create a text block |
| `engine.block.replaceText(_:text:)` | Set the text content of a text block, including emoji characters |

### Properties

| Property | Type | Description |
| --- | --- | --- |
| `defaultEmojiFontFileUri` | String | URI of the font file CE.SDK uses to render emoji characters |
| `forceSystemEmojis` | Bool | When `true`, every Unicode emoji renders with `defaultEmojiFontFileUri`. When `false`, the engine first checks the text font for a matching glyph. Defaults to `true`. |

## Next Steps

- [Text Overview](./overview.md) — Learn about text editing capabilities in CE.SDK
- [Add Text](./add.md) — Create and add text blocks programmatically
- [Text Styling](./styling.md) — Apply fonts, colors, alignment, and other styling options



---

## More Resources

- **[iOS Documentation Index](https://img.ly/docs/cesdk/ios/)** - Browse all iOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/ios/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/ios/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
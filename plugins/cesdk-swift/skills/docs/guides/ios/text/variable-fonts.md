> This is one page of the CE.SDK iOS documentation. For a complete overview, see the [iOS Documentation Index](https://img.ly/docs/cesdk/ios/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/ios/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Create and Edit Text](../text.md) > [Variable Fonts](./variable-fonts.md)

---

```swift file=@cesdk_swift_examples/editor-guides-variable-fonts/VariableFontsSolution.swift reference-only
import IMGLYEditor
import IMGLYEngine
import SwiftUI

/// Editor demonstrating how to use a variable font in CE.SDK.
///
/// A variable font packs several weights into one file. CE.SDK recognizes a
/// typeface as variable when multiple `Font` entries share the same `uri`, and
/// renders each variant by applying `wght`/`ital` axis values to that one file.
struct VariableFontsSolution: View {
  let settings = EngineSettings(
    license: secrets.licenseKey,
    userID: "<your unique user id>",
  )

  // Jost is a variable font: one file covers all weights from 100 to 900.
  static let jostVariableFontURL = URL(
    string: "https://cdn.jsdelivr.net/fontsource/fonts/jost:vf@5/latin-wght-normal.woff2",
  )!

  /// The sub-family name CE.SDK shows for each of the nine standard weights.
  static let weightSubFamilies: [(weight: FontWeight, label: String)] = [
    (.thin, "Thin"),
    (.extraLight, "Extra Light"),
    (.light, "Light"),
    (.normal, "Regular"),
    (.medium, "Medium"),
    (.semiBold, "Semi Bold"),
    (.bold, "Bold"),
    (.extraBold, "Extra Bold"),
    (.heavy, "Heavy"),
  ]

  /// Builds one `Font` entry per weight and style combination. Every entry points
  /// at the same file, which is what marks the typeface as a variable font.
  ///
  /// `Font` is qualified with its module because SwiftUI declares a type of the
  /// same name.
  static func variableFontCombinations(
    uri: URL,
    variantWeight: Bool,
    variantItalic: Bool,
  ) -> [IMGLYEngine.Font] {
    let weights = variantWeight ? weightSubFamilies : [(weight: FontWeight.normal, label: "Regular")]
    let styles: [FontStyle] = variantItalic ? [.normal, .italic] : [.normal]

    return styles.flatMap { style in
      weights.map { weight, label in
        IMGLYEngine.Font(
          uri: uri,
          subFamily: style == .italic ? "\(label) Italic" : label,
          weight: weight,
          style: style,
        )
      }
    }
  }

  static let jost = Typeface(
    name: "Jost",
    fonts: variableFontCombinations(
      uri: jostVariableFontURL,
      variantWeight: true,
      // This file has no `ital` axis, so italic entries would render upright.
      variantItalic: false,
    ),
  )

  static let weightSamples: [(weight: FontWeight, label: String)] = [
    (.thin, "Thin 100"),
    (.normal, "Regular 400"),
    (.bold, "Bold 700"),
    (.heavy, "Heavy 900"),
  ]

  /// Creates one text block per sample weight. Every block renders from the same
  /// font file, because the typeface resolves the weight to an axis value instead
  /// of another file.
  @discardableResult
  static func createWeightSamples(engine: Engine, page: DesignBlockID) throws -> [DesignBlockID] {
    try weightSamples.enumerated().map { index, sample in
      let text = try engine.block.create(.text)
      try engine.block.appendChild(to: page, child: text)
      try engine.block.replaceText(text, text: sample.label)
      try engine.block.setTextFontSize(text, fontSize: 56)
      try engine.block.setTextHorizontalAlignment(text, alignment: .center)
      try engine.block.setWidthMode(text, mode: .absolute)
      try engine.block.setWidth(text, value: 700)
      try engine.block.setHeightMode(text, mode: .auto)
      try engine.block.setPositionX(text, value: 50)
      try engine.block.setPositionY(text, value: 200 + Float(index) * 105)

      try engine.block.setTypeface(text, typeface: jost)
      try engine.block.setTextFontWeight(text, fontWeight: sample.weight)
      return text
    }
  }

  /// Switches an existing text block to another weight. The engine resolves the
  /// matching variant from the typeface and renders it from the already loaded
  /// font file.
  @discardableResult
  static func switchHeadlineWeight(engine: Engine, headline: DesignBlockID) throws -> [FontWeight] {
    try engine.block.setTextFontWeight(headline, fontWeight: .extraBold)

    // If the font file also provides an `ital` axis, styles switch the same way:
    // try engine.block.setTextFontStyle(headline, fontStyle: .italic)

    return try engine.block.getTextFontWeights(headline)
  }

  /// Demo scaffolding: builds the sample page and the headline the
  /// weight-switching snippet operates on. Replace this with your own scene setup.
  private static func createSampleScene(engine: Engine) throws -> (page: DesignBlockID, headline: DesignBlockID) {
    // A Pixel design unit also makes font sizes pixel-based, so the page size and
    // the font sizes below share one unit.
    let scene = try engine.scene.create(designUnit: .px)
    let page = try engine.block.create(.page)
    try engine.block.appendChild(to: scene, child: page)
    try engine.block.setWidth(page, value: 800)
    try engine.block.setHeight(page, value: 600)

    let headline = try engine.block.create(.text)
    try engine.block.appendChild(to: page, child: headline)
    try engine.block.replaceText(headline, text: "Variable Fonts")
    try engine.block.setTextFontSize(headline, fontSize: 64)
    try engine.block.setTextHorizontalAlignment(headline, alignment: .center)
    try engine.block.setWidthMode(headline, mode: .absolute)
    try engine.block.setWidth(headline, value: 700)
    try engine.block.setHeightMode(headline, mode: .auto)
    try engine.block.setPositionX(headline, value: 50)
    try engine.block.setPositionY(headline, value: 48)
    try engine.block.setTypeface(headline, typeface: jost)

    return (page, headline)
  }

  var editor: some View {
    Editor(settings)
      .imgly.configuration {
        GuideEditorConfiguration { builder in
          builder.onCreate { engine, _ in
            let (page, headline) = try Self.createSampleScene(engine: engine)

            // Load the bundled typeface content so the built-in typefaces stay in
            // the font library, then add the variable font to the same source.
            let basePath = try engine.editor.getSettingString("basePath")
            guard let baseURL = URL(string: basePath) else { return }
            let typefaceSourceID = try await engine.asset.addLocalAssetSourceFromJSON(
              baseURL
                .appendingPathComponent("ly.img.typeface")
                .appendingPathComponent("content.json"),
            )

            try engine.asset.addAsset(
              to: typefaceSourceID,
              asset: AssetDefinition(
                id: "jost",
                groups: ["latin"],
                payload: AssetPayload(typeface: Self.jost),
                label: ["en": "Jost"],
              ),
            )

            try Self.createWeightSamples(engine: engine, page: page)
            try Self.switchHeadlineWeight(engine: engine, headline: headline)
          }

          // Select the headline after loading so the inspector bar surfaces and the
          // captured hero can open the font sheet.
          builder.onLoaded { context, _ in
            if let headline = try context.engine.block.find(byType: .text).first {
              try context.engine.block.setSelected(headline, selected: true)
            }
          }

          builder.inspectorBar { inspector in
            inspector.items { _ in
              InspectorBar.Buttons.formatText()
            }
          }
        }
      }
  }

  @State private var isPresented = false

  var body: some View {
    Button("Use the Editor") {
      isPresented = true
    }
    .fullScreenCover(isPresented: $isPresented) {
      ModalEditor { editor }
    }
  }
}

#Preview {
  VariableFontsSolution()
}
```

Use variable fonts to offer a full range of font weights and styles from a single font file.

![Text blocks at four different weights rendered from one variable font file, with Jost listed in the editor's font picker](https://img.ly/docs/cesdk/ios/text/variable-fonts-32e788/assets/ios.hero.webp)

> **Reading time:** 7 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.83.0-nightly.20260904/editor-guides-variable-fonts)

Variable fonts are OpenType fonts that pack multiple variations of a font family into a single file. Instead of loading one file per weight, you register a single file and CE.SDK renders each variant by applying variation axis values. This reduces network requests and simplifies font management, especially for typefaces with many weights.

This guide builds on `GuideEditorConfiguration`, a small helper class the [iOS guides repository](https://github.com/imgly/cesdk-swift-examples/blob/v1.83.0-nightly.20260904/editor-guides-quickstart/GuideEditorConfiguration.swift) ships as a minimal baseline; substitute your own editor configuration class — the `onCreate` hook used here is available on every configuration. The [Configuration](../configuration.md) guide covers how `EditorConfiguration` and `EngineSettings` set up the editor as a whole.

## How CE.SDK Handles Variable Fonts

A `Typeface` is a font family with a `fonts` array, where each `Font` declares a `uri`, `subFamily`, `weight` and `style`. CE.SDK treats a typeface as a variable font when multiple fonts in the array share the same file URI. Internally, the engine encodes the selected weight and style as axis values on the font's URI (for example `font.woff2#wght=700&ital=1`), so each variant has a unique identity while sharing one underlying font resource.

CE.SDK supports two variation axes:

- `wght` — the font weight, mapped from the nine `FontWeight` cases `.thin` (100) through `.heavy` (900)
- `ital` — the italic style, mapped from `.normal` (0) and `.italic` (1)

Axis values outside the range the font file supports are clamped to the nearest supported value. Aside from how the `fonts` array is built, variable fonts need no special handling: the same typeface and font APIs work for static and variable fonts, and exports render the selected variant.

## Generate Font Variants

A variable font typeface needs one `Font` entry per weight and style combination, all pointing at the same file. The helper below generates them from the `FontWeight` and `FontStyle` cases, so adding a weight to the sample means adding one entry rather than another font file.

The `variantWeight` flag controls weight variants: when `true`, the helper generates entries for all nine standard weights. The `variantItalic` flag controls italic variants: only pass `true` when the font file actually provides an `ital` axis, otherwise the italic entries would render upright. Jost, the font we use here, has a weight axis but no italic axis:

```swift highlight-variableFonts-generateVariants
  // Jost is a variable font: one file covers all weights from 100 to 900.
  static let jostVariableFontURL = URL(
    string: "https://cdn.jsdelivr.net/fontsource/fonts/jost:vf@5/latin-wght-normal.woff2",
  )!

  /// The sub-family name CE.SDK shows for each of the nine standard weights.
  static let weightSubFamilies: [(weight: FontWeight, label: String)] = [
    (.thin, "Thin"),
    (.extraLight, "Extra Light"),
    (.light, "Light"),
    (.normal, "Regular"),
    (.medium, "Medium"),
    (.semiBold, "Semi Bold"),
    (.bold, "Bold"),
    (.extraBold, "Extra Bold"),
    (.heavy, "Heavy"),
  ]

  /// Builds one `Font` entry per weight and style combination. Every entry points
  /// at the same file, which is what marks the typeface as a variable font.
  ///
  /// `Font` is qualified with its module because SwiftUI declares a type of the
  /// same name.
  static func variableFontCombinations(
    uri: URL,
    variantWeight: Bool,
    variantItalic: Bool,
  ) -> [IMGLYEngine.Font] {
    let weights = variantWeight ? weightSubFamilies : [(weight: FontWeight.normal, label: "Regular")]
    let styles: [FontStyle] = variantItalic ? [.normal, .italic] : [.normal]

    return styles.flatMap { style in
      weights.map { weight, label in
        IMGLYEngine.Font(
          uri: uri,
          subFamily: style == .italic ? "\(label) Italic" : label,
          weight: weight,
          style: style,
        )
      }
    }
  }

  static let jost = Typeface(
    name: "Jost",
    fonts: variableFontCombinations(
      uri: jostVariableFontURL,
      variantWeight: true,
      // This file has no `ital` axis, so italic entries would render upright.
      variantItalic: false,
    ),
  )
```

With both flags set to `true`, the helper returns 18 entries (nine weights, each in normal and italic).

## Register the Variable Font Typeface

We register the variable font like any custom font: load the bundled typeface content into the `"ly.img.typeface"` source with `engine.asset.addLocalAssetSourceFromJSON(_:)`, then add an asset whose `AssetPayload(typeface:)` holds the generated fonts. See [Customize Fonts](./custom-fonts.md) for the full asset source workflow:

```swift highlight-variableFonts-registerTypeface
            // Load the bundled typeface content so the built-in typefaces stay in
            // the font library, then add the variable font to the same source.
            let basePath = try engine.editor.getSettingString("basePath")
            guard let baseURL = URL(string: basePath) else { return }
            let typefaceSourceID = try await engine.asset.addLocalAssetSourceFromJSON(
              baseURL
                .appendingPathComponent("ly.img.typeface")
                .appendingPathComponent("content.json"),
            )

            try engine.asset.addAsset(
              to: typefaceSourceID,
              asset: AssetDefinition(
                id: "jost",
                groups: ["latin"],
                payload: AssetPayload(typeface: Self.jost),
                label: ["en": "Jost"],
              ),
            )
```

## Show the Font in the Typeface Library

The editor's font picker reads from a single asset source whose ID is `"ly.img.typeface"`, so the registration above is what makes the variable font selectable — no separate library configuration step. Loading the bundled content first keeps the built-in typefaces listed alongside it; to ship a custom-fonts-only library, create an empty source with `engine.asset.addLocalSource(sourceID: "ly.img.typeface")` instead.

Once registered, selecting a text block and opening the font picker lists every generated variant in the font style row. Switching between them updates the rendering without loading another file.

## Apply Weights to Text Blocks

Programmatically, we apply the variable font with `engine.block.setTypeface(_:typeface:in:)` and pick a variant with `engine.block.setTextFontWeight(_:fontWeight:in:)`. Here we create four text blocks at different weights, all rendered from the same file:

```swift highlight-variableFonts-applyWeights
  static let weightSamples: [(weight: FontWeight, label: String)] = [
    (.thin, "Thin 100"),
    (.normal, "Regular 400"),
    (.bold, "Bold 700"),
    (.heavy, "Heavy 900"),
  ]

  /// Creates one text block per sample weight. Every block renders from the same
  /// font file, because the typeface resolves the weight to an axis value instead
  /// of another file.
  @discardableResult
  static func createWeightSamples(engine: Engine, page: DesignBlockID) throws -> [DesignBlockID] {
    try weightSamples.enumerated().map { index, sample in
      let text = try engine.block.create(.text)
      try engine.block.appendChild(to: page, child: text)
      try engine.block.replaceText(text, text: sample.label)
      try engine.block.setTextFontSize(text, fontSize: 56)
      try engine.block.setTextHorizontalAlignment(text, alignment: .center)
      try engine.block.setWidthMode(text, mode: .absolute)
      try engine.block.setWidth(text, value: 700)
      try engine.block.setHeightMode(text, mode: .auto)
      try engine.block.setPositionX(text, value: 50)
      try engine.block.setPositionY(text, value: 200 + Float(index) * 105)

      try engine.block.setTypeface(text, typeface: jost)
      try engine.block.setTextFontWeight(text, fontWeight: sample.weight)
      return text
    }
  }
```

## Switch Weights and Styles

Weight and style can change at any time, on whole blocks or on selected text ranges. The engine resolves the matching variant from the typeface, applies the axis values and renders it from the already loaded font file:

```swift highlight-variableFonts-switchWeight
  /// Switches an existing text block to another weight. The engine resolves the
  /// matching variant from the typeface and renders it from the already loaded
  /// font file.
  @discardableResult
  static func switchHeadlineWeight(engine: Engine, headline: DesignBlockID) throws -> [FontWeight] {
    try engine.block.setTextFontWeight(headline, fontWeight: .extraBold)

    // If the font file also provides an `ital` axis, styles switch the same way:
    // try engine.block.setTextFontStyle(headline, fontStyle: .italic)

    return try engine.block.getTextFontWeights(headline)
  }
```

Pass a `Range<String.Index>` to the `in:` parameter to restrict either call to part of the text. The same variants drive the editor UI: users switch between them in the font picker, and bold or italic toggles resolve against the generated font entries.

## Troubleshooting

**All weights render the same**: The font file is not a variable font or lacks a `wght` axis. Verify the file contains the axes you need, for example with a font inspection tool.

**Italic variants render upright**: The font file has no `ital` axis. Only pass `true` for italic variants when the file provides one; italic-only families often ship as a separate file.

**A weight looks different than expected**: Axis values outside the font's supported range are clamped. For example, requesting `.thin` (100) from a font whose weight axis starts at 300 renders at 300.

**Font not appearing in the picker**: Confirm the source is registered under the ID `"ly.img.typeface"` and that the asset's payload is built with `AssetPayload(typeface:)`. See [Customize Fonts](./custom-fonts.md) for details.

**The font file does not load**: Confirm the `Font.uri` is reachable from the device and points to a valid TTF, OTF, WOFF, or WOFF2 file. For HTTPS URLs, confirm the host is not blocked by the app's App Transport Security configuration.

## API Reference

### Methods

| Method | Description |
| --- | --- |
| `engine.asset.addLocalAssetSourceFromJSON(_:)` | Load asset content from a JSON URL into the source declared by the JSON. Use the bundled `ly.img.typeface/content.json` to register the default typefaces. |
| `engine.asset.addLocalSource(sourceID:)` | Register an empty local asset source. Use ID `"ly.img.typeface"` to replace the defaults. |
| `engine.asset.addAsset(to:asset:)` | Add an `AssetDefinition` to a registered source. |
| `engine.block.setTypeface(_:typeface:in:)` | Apply the variable font typeface to a text block or range. |
| `engine.block.setTextFontWeight(_:fontWeight:in:)` | Switch the rendered weight of the variable font. |
| `engine.block.setTextFontStyle(_:fontStyle:in:)` | Switch between normal and italic rendering. |
| `engine.block.getTextFontWeights(_:in:)` | Return the font weights used in a text range. |
| `engine.block.setTextFontSize(_:fontSize:in:)` | Set the size of the sample text. |
| `engine.block.setTextHorizontalAlignment(_:alignment:paragraphIndex:)` | Center the sample text blocks. |
| `engine.block.setWidthMode(_:mode:)` | Give the text block a fixed width instead of auto-sizing. |
| `engine.block.setWidth(_:value:)` | Set the sample text block width. |
| `engine.block.setHeightMode(_:mode:)` | Let the text block fit its content height. |
| `engine.block.setPositionX(_:value:)` | Position the text block on the x-axis. |
| `engine.block.setPositionY(_:value:)` | Position the text block on the y-axis. |
| `engine.block.create(_:)` | Create the text blocks used by the weight samples. |
| `engine.block.appendChild(to:child:)` | Add each text block to the page. |
| `engine.block.replaceText(_:text:)` | Set the text block contents. |

### Types

| Type | Description |
| --- | --- |
| `Typeface` | A font family: `name` plus an array of `Font` variants. |
| `Font` | A single font variant: `uri`, `subFamily`, `weight`, and `style`. |
| `FontWeight` | The nine standard weights, `.thin` through `.heavy`. |
| `FontStyle` | `.normal` or `.italic`. |
| `AssetPayload` | Container for structured asset data; pass a `Typeface` via `payload.typeface`. |

## Next Steps

- [Customize Fonts](./custom-fonts.md) — the full custom typeface workflow, including static multi-file fonts
- [Text Styling](./styling.md) — fills, sizing, color, and alignment for text blocks



---

## More Resources

- **[iOS Documentation Index](https://img.ly/docs/cesdk/ios/)** - Browse all iOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/ios/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/ios/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
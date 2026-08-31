> This is one page of the CE.SDK iOS documentation. For a complete overview, see the [iOS Documentation Index](https://img.ly/docs/cesdk/ios/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/ios/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [User Interface](../../user-interface.md) > [Customization](../customization.md) > [Color Palette](./color-palette.md)

---

```swift file=@cesdk_swift_examples/editor-guides-configuration-color-palette/ColorPaletteEditorSolution.swift reference-only
import IMGLYEditor
import IMGLYEngine
import SwiftUI

/// Editor demonstrating how to customize the color palette.
///
/// The `editor` view shows the lesson — what the documentation renders.
/// The `body` uses `demoEditor`, which extends the same `GuideEditorConfiguration`
/// with an inspector bar and a pre-selected graphic block so the showcase can
/// navigate to a color picker that surfaces the custom palette.
struct ColorPaletteEditorSolution: View {
  let settings = EngineSettings(
    license: secrets.licenseKey,
    userID: "<your unique user id>",
  )

  static let palette: [NamedColor] = [
    .init("Blue", .imgly.blue),
    .init("Green", .imgly.green),
    .init("Yellow", .imgly.yellow),
    .init("Red", .imgly.red),
    .init("Black", .imgly.black),
    .init("White", .imgly.white),
    .init("Gray", .imgly.gray),
  ]

  var editor: some View {
    Editor(settings)
      .imgly.configuration {
        GuideEditorConfiguration { builder in
          builder.colorPalette(Self.palette)
        }
      }
  }

  // Demo scaffolding (not part of the lesson). Builds on `GuideEditorConfiguration`
  // and adds the minimum needed to reach a color picker that surfaces the palette:
  // an inspector bar item and a pre-selected graphic block. The default `onCreate`
  // builds the scene, and the default Creator role keeps all engine scopes allowed.
  private var demoEditor: some View {
    Editor(settings)
      .imgly.configuration {
        GuideEditorConfiguration { builder in
          builder.colorPalette(Self.palette)
          builder.inspectorBar { ib in
            ib.items { _ in
              InspectorBar.Buttons.fillStroke()
              InspectorBar.Buttons.delete()
            }
          }
          builder.onLoaded { context, _ in
            let engine = context.engine
            guard let page = try engine.scene.getCurrentPage() else { return }
            let block = try engine.block.create(.graphic)
            try engine.block.setShape(block, shape: engine.block.createShape(.rect))
            try engine.block.setFill(block, fill: engine.block.createFill(.color))
            try engine.block.setWidth(block, value: 600)
            try engine.block.setHeight(block, value: 400)
            try engine.block.setPositionX(block, value: 240)
            try engine.block.setPositionY(block, value: 340)
            try engine.block.appendChild(to: page, child: block)
            try engine.block.setSelected(block, selected: true)
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
      ModalEditor {
        demoEditor
      }
    }
  }
}

#Preview {
  ColorPaletteEditorSolution()
}
```

Pin every CE.SDK color picker to a set of brand-approved swatches so fills, strokes, and text color all draw from the same palette your team controls.

![Editor showing the custom color palette in the fill picker](https://img.ly/docs/cesdk/ios/user-interface/customization/color-palette-429fd9/assets/ios.hero.webp)

> **Reading time:** 4 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.82.0-rc.0/editor-guides-configuration-color-palette)

The editor's color palette is one of several knobs you can configure on `EditorConfiguration.Builder` — alongside the dock, inspector bar, navigation bar, and theme. Setting a custom palette gives users a curated list of brand colors everywhere CE.SDK surfaces a color picker, instead of the generic seven defaults.

The example wraps the editor in `GuideEditorConfiguration`, a small helper class the [iOS guides repository](https://github.com/imgly/cesdk-swift-examples/blob/v1.82.0-rc.0/editor-guides-quickstart/GuideEditorConfiguration.swift) ships as a minimal baseline. Substitute your own editor configuration class — the `colorPalette(_:)` builder method is exposed on every configuration, so the rest of the call stays the same.

## Defining the Brand Palette

The palette is an array of `NamedColor` values. Each entry pairs an accessibility name — used as the VoiceOver label for the swatch — with the `CGColor` displayed in the picker. Define the array somewhere your editor configuration can reach it; the example uses a `static let` on the SwiftUI view.

```swift highlight-palette
static let palette: [NamedColor] = [
  .init("Blue", .imgly.blue),
  .init("Green", .imgly.green),
  .init("Yellow", .imgly.yellow),
  .init("Red", .imgly.red),
  .init("Black", .imgly.black),
  .init("White", .imgly.white),
  .init("Gray", .imgly.gray),
]
```

Provide exactly seven entries. How many swatches actually render depends on the picker:

- **Six swatches** appear in pickers that support a "no color" state (Fill, Stroke, and similar controls that can be disabled). The seventh slot is taken by a `No Color` button, so only the first six entries from your palette are drawn — the hero above shows this layout.
- **Seven swatches** appear in pickers that always require a color (for example, Text Color), where no `No Color` button is shown.

Order the array so the most important brand colors come first. Entries past the sixth position only surface in pickers that always require a color.

The example uses the IMG.LY system colors (`.imgly.blue`, `.imgly.green`, `.imgly.yellow`, `.imgly.red`, `.imgly.black`, `.imgly.white`, `.imgly.gray`). Any `CGColor` works — substitute your brand colors directly, build them with `CGColor.imgly.hex(_:)`, or convert from a `UIColor` via `cgColor`.

## Applying the Palette via the Editor Configuration

Pass the array to `builder.colorPalette(_:)` inside the editor configuration closure. The new colors take effect in every CE.SDK color-aware control — Fill, Stroke, Text Color, and similar pickers — the moment the editor mounts.

```swift highlight-editor
Editor(settings)
  .imgly.configuration {
    GuideEditorConfiguration { builder in
      builder.colorPalette(Self.palette)
    }
  }
```

The palette is not exposed back to app code, so custom UI you build alongside the editor should reference your own `NamedColor` array directly instead of trying to read the configured palette from the SDK.

If you'd rather keep the default IMG.LY colors visible, omit the `colorPalette(_:)` call — CE.SDK falls back to its built-in palette when none is configured.

## API Reference

| Symbol | Description |
|--------|-------------|
| `EditorConfiguration.Builder.colorPalette(_:)` | Sets the palette of `NamedColor` values used by CE.SDK's built-in color pickers. |
| `NamedColor(_:_:)` | Pairs a VoiceOver accessibility name (`LocalizedStringResource`) with a `CGColor`. |
| `CGColor.imgly.*` | IMG.LY-defined system colors (`blue`, `green`, `yellow`, `red`, `black`, `white`, `gray`). |
| `CGColor.imgly.hex(_:)` | Builds a `CGColor` from a hexadecimal string (e.g. `"#1A73E8"`). |

## Next Steps

- [Color Basics](../../colors/basics.md) — Review CE.SDK's color spaces and where they apply
- [Apply Colors](../../colors/apply.md) — Set fills, strokes, and text color programmatically
- [Theming](../appearance/theming.md) — Customize the editor's appearance and color tokens
- [Dock](./dock.md) — Configure the editor's primary navigation
- [Inspector Bar](./inspector-bar.md) — Tailor which controls appear when a block is selected



---

## More Resources

- **[iOS Documentation Index](https://img.ly/docs/cesdk/ios/)** - Browse all iOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/ios/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/ios/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
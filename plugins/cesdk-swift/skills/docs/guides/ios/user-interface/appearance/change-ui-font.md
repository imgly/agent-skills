> This is one page of the CE.SDK iOS documentation. For a complete overview, see the [iOS Documentation Index](https://img.ly/docs/cesdk/ios/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/ios/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [User Interface](../../user-interface.md) > [Appearance](../appearance.md) > [Change UI Font](./change-ui-font.md)

---

```swift file=@cesdk_swift_examples/editor-guides-change-ui-font/ChangeUIFontSolution.swift reference-only
import IMGLYEditor
import SwiftUI

/// Editor demonstrating how to change the UI font design.
///
/// The `editor` view shows the lesson — what the documentation renders.
/// The `body` uses `demoEditor`, which extends the same `GuideEditorConfiguration`
/// with a dock containing default library buttons so the screenshot surfaces
/// the customized font on visible UI labels.
///
/// `.fontDesign(_:)` requires iOS 16.1, so the struct is marked accordingly.
@available(iOS 16.1, *)
struct ChangeUIFontSolution: View {
  let settings = EngineSettings(
    license: secrets.licenseKey,
    userID: "<your unique user id>",
  )

  var editor: some View {
    Editor(settings)
      .imgly.configuration { GuideEditorConfiguration() }
      .fontDesign(.serif)
  }

  // Targeted alternative: apply a registered custom font to a single button's
  // label without changing its wording. Rebuild the button's default localized
  // title and restyle it. "BrandFont" is a placeholder for the PostScript name
  // of a font your app has registered.
  var customLabelEditor: some View {
    Editor(settings)
      .imgly.configuration {
        GuideEditorConfiguration { builder in
          builder.dock { dock in
            dock.items { _ in
              Dock.Buttons.elementsLibrary(title: { _ in
                Text(.imgly.localized("ly_img_editor_dock_button_elements"))
                  .font(.custom("BrandFont", size: 12))
              })
            }
          }
        }
      }
  }

  // Demo scaffolding (not part of the lesson). Adds dock buttons so the
  // screenshot shows the customized UI font on visible labels.
  private var demoEditor: some View {
    Editor(settings)
      .imgly.configuration {
        GuideEditorConfiguration { builder in
          builder.dock { dock in
            dock.items { _ in
              Dock.Buttons.elementsLibrary()
              Dock.Buttons.imagesLibrary()
              Dock.Buttons.textLibrary()
              Dock.Buttons.shapesLibrary()
              Dock.Buttons.stickersLibrary()
            }
          }
        }
      }
      .fontDesign(.serif)
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

@available(iOS 16.1, *)
#Preview {
  ChangeUIFontSolution()
}
```

Switch the editor's UI font design to match your application's visual style.

![Editor with the serif font design applied to dock labels and navigation bar](https://img.ly/docs/cesdk/ios/user-interface/appearance/change-ui-font-49b6fc/assets/ios.hero.webp)

> **Reading time:** 3 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.81.0-nightly.20260810/editor-guides-change-ui-font)

## Overview

The `Editor` view is a SwiftUI view, so it inherits the standard SwiftUI font modifiers from its parent hierarchy. Apply `.fontDesign(_:)` to the `Editor` to switch the font design used by every UI element — dock labels, button captions, sheet titles, and inspector text.

| API | Purpose |
|-----|---------|
| `.fontDesign(_:)` | SwiftUI view modifier that sets the font design for all descendant text |
| `Font.Design.default` | The default system font |
| `Font.Design.serif` | A serif system font |
| `Font.Design.monospaced` | A monospaced system font |
| `Font.Design.rounded` | A rounded system font |

`.fontDesign(_:)` is available on iOS 16.1 and later. If your deployment target is iOS 16.0, mark the call site with `@available(iOS 16.1, *)` or gate it behind `if #available(iOS 16.1, *)`.

## Apply the Font Design

Place `.fontDesign(_:)` directly on the `Editor` view, after the configuration modifier. The chosen design propagates through SwiftUI's environment to every UI label rendered with a system font.

```swift highlight-changeUIFont-fontDesign
Editor(settings)
  .imgly.configuration { GuideEditorConfiguration() }
  .fontDesign(.serif)
```

Pass any value from the table above, or `nil` to remove a font design override applied higher in the view tree.

## Custom Fonts

A font design selects between the four system typefaces — it does not load an arbitrary font family. The editor's UI text is drawn with the system font, and no environment value swaps the whole interface to a registered custom font. `.fontDesign(_:)` is the only setting that restyles every label at once.

To bring in a custom font, restyle individual button labels instead. Pass a `title:` (or `label:`) closure to a button factory, rebuild the button's default label, and apply `.font(.custom(_:size:))` to it — where the string is the PostScript name of a font your app has registered:

```swift highlight-changeUIFont-buttonLabelFont
builder.dock { dock in
  dock.items { _ in
    Dock.Buttons.elementsLibrary(title: { _ in
      Text(.imgly.localized("ly_img_editor_dock_button_elements"))
        .font(.custom("BrandFont", size: 12))
    })
  }
}
```

Rebuild the label from the button's existing localization key with `.imgly.localized(_:)` so the wording and any translations stay intact and only the font changes. Returning a plain `Text("Elements")` would replace the label text as well. The closure's `.font(.custom(...))` takes precedence over the design the component would otherwise apply. This works per button — there is no single call that reaches every label — so you repeat it for each button you want to restyle. Button factories exist for the dock, navigation bar, inspector bar, and canvas menu; buttons rendered inside sheets are not exposed, so the approach reaches the top-level surfaces and stops there.

## Troubleshooting

### Font Design Not Applied

- Verify the deployment target is iOS 16.1 or later. The `.fontDesign(_:)` modifier is unavailable on iOS 16.0.
- Confirm the modifier sits on the `Editor` view itself, not on an ancestor that the editor doesn't observe. SwiftUI environment values cascade down the view tree, so placing the modifier on the `Editor` (or any parent) propagates the design.
- Check for a competing `.fontDesign(_:)` higher up that explicitly sets `.default`. The closest modifier in the hierarchy wins.

### Some Text Does Not Change

A small number of UI elements pin a font design explicitly. Those elements continue to use their own design regardless of the value supplied here.

## API Reference

| API | Purpose |
|-----|---------|
| [`View.fontDesign(_:)`](https://developer.apple.com/documentation/swiftui/view/fontdesign/(_:/)) | Set the font design for all descendant text rendered with a system font |
| [`Font.Design`](https://developer.apple.com/documentation/swiftui/font/design) | The available system font designs: `.default`, `.serif`, `.monospaced`, `.rounded` |
| [`Font.custom(_:size:)`](https://developer.apple.com/documentation/swiftui/font/custom/(_:size:/)) | Reference a registered custom font by its PostScript name in a label closure |
| `title:` / `label:` closures | Per-button view builders on the dock, navigation bar, inspector bar, and canvas menu factories |
| `.imgly.localized(_:)` | Resolve a button's default localized title from its key, to preserve wording while restyling |

## Next Steps

- [Theming](./theming.md) — Override the color scheme and adopt the system theme
- [Custom Labels](./custom-labels.md) — Override individual button and label text with custom title closures



---

## More Resources

- **[iOS Documentation Index](https://img.ly/docs/cesdk/ios/)** - Browse all iOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/ios/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/ios/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
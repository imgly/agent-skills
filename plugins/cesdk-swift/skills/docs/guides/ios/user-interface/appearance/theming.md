> This is one page of the CE.SDK iOS documentation. For a complete overview, see the [iOS Documentation Index](https://img.ly/docs/cesdk/ios/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/ios/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [User Interface](../../user-interface.md) > [Appearance](../appearance.md) > [Theming](./theming.md)

---

```swift file=@cesdk_swift_examples/editor-guides-configuration-theming/ThemingEditorSolution.swift reference-only
import IMGLYEditor
import SwiftUI

/// Editor demonstrating how to theme the editor's appearance.
///
/// This example shows how to:
/// - Let the editor follow the system color scheme (default)
/// - Force the editor into light or dark mode
/// - Switch the color scheme at runtime through a Picker
struct ThemingEditorSolution: View {
  let settings = EngineSettings(
    license: secrets.licenseKey,
    userID: "<your unique user id>",
  )

  enum Demo: String, CaseIterable, Identifiable {
    case followSystem = "Follow System"
    case forceDark = "Force Dark"
    case runtimeToggle = "Runtime Toggle"
    var id: Self {
      self
    }
  }

  enum ThemeOption: String, CaseIterable, Identifiable {
    case system = "System"
    case light = "Light"
    case dark = "Dark"
    var id: Self {
      self
    }

    var colorScheme: ColorScheme? {
      switch self {
      case .system: nil
      case .light: .light
      case .dark: .dark
      }
    }
  }

  @State private var selectedDemo: Demo = .followSystem
  @State private var selectedTheme: ThemeOption = .system
  @State private var isPresented = false

  var editorFollowingSystem: some View {
    Editor(settings)
      .imgly.configuration { GuideEditorConfiguration() }
  }

  var editorForcedDark: some View {
    Editor(settings)
      .imgly.configuration { GuideEditorConfiguration() }
      .preferredColorScheme(.dark)
  }

  var editorWithRuntimeToggle: some View {
    Editor(settings)
      .imgly.configuration { GuideEditorConfiguration() }
      .preferredColorScheme(selectedTheme.colorScheme)
  }

  @ViewBuilder
  var editor: some View {
    switch selectedDemo {
    case .followSystem:
      editorFollowingSystem
    case .forceDark:
      editorForcedDark
    case .runtimeToggle:
      editorWithRuntimeToggle
    }
  }

  var body: some View {
    VStack(spacing: 16) {
      Picker("Demo", selection: $selectedDemo) {
        ForEach(Demo.allCases) { demo in
          Text(demo.rawValue).tag(demo)
        }
      }
      .pickerStyle(.segmented)
      .padding(.horizontal)

      if selectedDemo == .runtimeToggle {
        Picker("Theme", selection: $selectedTheme) {
          ForEach(ThemeOption.allCases) { option in
            Text(option.rawValue).tag(option)
          }
        }
        .pickerStyle(.segmented)
        .padding(.horizontal)
      }

      Button("Use the Editor") {
        isPresented = true
      }
      .padding()
    }
    .fullScreenCover(isPresented: $isPresented) {
      ModalEditor {
        editor
      }
    }
  }
}

#Preview {
  ThemingEditorSolution()
}
```

Match the editor's color scheme to your app's design by following the system
appearance, forcing a specific scheme, or letting users switch at runtime.

![CE.SDK editor displayed in dark mode after adopting the system color scheme](https://img.ly/docs/cesdk/ios/user-interface/appearance/theming-4b0938/assets/ios.hero.webp)

> **Reading time:** 3 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.81.0-nightly.20260811/editor-guides-configuration-theming)

CE.SDK's editor is a SwiftUI view, so theming uses the standard SwiftUI [`colorScheme`](https://developer.apple.com/documentation/swiftui/colorscheme) environment. By default the editor inherits its color scheme from the surrounding view hierarchy, which itself defaults to the user's system appearance. You override the scheme with SwiftUI's [`preferredColorScheme(_:)`](https://developer.apple.com/documentation/swiftui/view/preferredcolorscheme/(_:/)) modifier — there is no separate theming API on the editor itself.

## Follow the System Appearance

The default behavior: apply no `preferredColorScheme` and the editor adopts whichever color scheme is in effect for its parent view. On most apps that means iOS's light or dark setting.

```swift highlight-theming-system
  var editorFollowingSystem: some View {
    Editor(settings)
      .imgly.configuration { GuideEditorConfiguration() }
  }
```

## Force a Specific Color Scheme

Pin the editor to a particular scheme by attaching `.preferredColorScheme(.light)` or `.preferredColorScheme(.dark)` to the `Editor` view. This is the right choice when your app's UI is committed to a single appearance.

```swift highlight-theming-override
  var editorForcedDark: some View {
    Editor(settings)
      .imgly.configuration { GuideEditorConfiguration() }
      .preferredColorScheme(.dark)
  }
```

## Switch Themes at Runtime

Drive the scheme from `@State` to let users choose between system, light, and dark while the editor is presented. Passing `nil` to `preferredColorScheme` restores inheritance from the parent view — the same behavior as omitting the modifier — so you can offer a "System" option without removing and re-adding the editor.

```swift highlight-theming-toggle
  var editorWithRuntimeToggle: some View {
    Editor(settings)
      .imgly.configuration { GuideEditorConfiguration() }
      .preferredColorScheme(selectedTheme.colorScheme)
  }
```

The `ThemeOption` enum in the sample maps each user-facing choice to an optional `ColorScheme`: `.system` resolves to `nil`, `.light` to `.light`, and `.dark` to `.dark`.

## API Reference

| API | Purpose |
|-----|---------|
| `@Environment(\.colorScheme)` | Reads the resolved color scheme inside any SwiftUI view. Useful when a sheet or custom component needs to react to the active scheme. |
| `.preferredColorScheme(_:)` | Overrides the color scheme for the modified view and its descendants. Pass `.light`, `.dark`, or `nil` to inherit from the parent view. |

## Next Steps

- [Solutions](../../prebuilt-solutions.md) — Browse the prebuilt editor configurations that ship with the SDK.



---

## More Resources

- **[iOS Documentation Index](https://img.ly/docs/cesdk/ios/)** - Browse all iOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/ios/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/ios/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
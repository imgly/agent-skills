> This is one page of the CE.SDK iOS documentation. For a complete overview, see the [iOS Documentation Index](https://img.ly/docs/cesdk/ios/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/ios/llms-full.txt).

**Navigation:** [Guides](./guides.md) > [Configuration](./configuration.md)

---

```swift file=@cesdk_swift_examples/editor-guides-configuration-basics/BasicEditorSolution.swift reference-only
import IMGLYEditor
import SwiftUI

struct BasicEditorSolution: View {
  let settings = EngineSettings(
    license: secrets.licenseKey,
    userID: "<your unique user id>",
    baseURL: URL(string: "https://cdn.img.ly/packages/imgly/cesdk-swift/1.82.0/assets")!,
  )

  var editor: some View {
    Editor(settings)
      .imgly.configuration { GuideEditorConfiguration() }
  }

  @State private var isPresented = false

  var body: some View {
    Button("Use the Editor") {
      isPresented = true
    }
    .fullScreenCover(isPresented: $isPresented) {
      ModalEditor {
        editor
      }
    }
  }
}

#Preview {
  BasicEditorSolution()
}
```

Configure CE.SDK during initialization with a license key, an asset base URL, and a user ID.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.83.0-nightly.20260906/editor-guides-configuration-basics)

## EngineSettings

`EngineSettings` carries the values CE.SDK needs before the engine boots — the license that removes export watermarks, an optional user ID for accurate MAU tracking, and the base URL the engine resolves asset paths against. All three parameters are optional.

### License Key

Pass your trial or production license here so exports are produced without a watermark. Passing `nil` keeps the editor in evaluation mode (watermarked exports).

```swift highlight-configurationBasics-license
license: secrets.licenseKey,
```

### User ID

Provide a unique identifier tied to the signed-in user so monthly active users are counted accurately when one person uses the editor on multiple devices. Defaults to `nil`.

```swift highlight-configurationBasics-userID
userID: "<your unique user id>",
```

### Base URL

The engine resolves relative asset paths (typefaces, stickers, video templates, etc.) against `baseURL`. The default points at the versioned IMG.LY CDN — fine for evaluation, but for production, self-host the `assets` directory and point `baseURL` at your own location.

```swift highlight-configurationBasics-baseURL
baseURL: URL(string: "https://cdn.img.ly/packages/imgly/cesdk-swift/1.82.0/assets")!,
```

## Apply the Configuration

Pass `EngineSettings` into `Editor(_:)`, then customize the surface with `.imgly.configuration(_:)`. The configuration argument controls everything above the engine: the dock, navigation bar, inspector bar, canvas menu, asset library, color palette, and callbacks.

```swift highlight-configurationBasics-editor
Editor(settings)
  .imgly.configuration { GuideEditorConfiguration() }
```

The example wraps the editor in `GuideEditorConfiguration`, a small helper class the [iOS guides repository](https://github.com/imgly/cesdk-swift-examples/blob/v1.83.0-nightly.20260906/editor-guides-quickstart/GuideEditorConfiguration.swift) ships as a minimal baseline. Substitute your own editor configuration class — the `.imgly.configuration(_:)` modifier accepts any `EditorConfiguration` subclass, so the rest of the call stays the same.

## API Reference

| Symbol | Description |
|--------|-------------|
| `EngineSettings(license:userID:baseURL:)` | The init-time configuration struct. |
| `Editor(_:)` | SwiftUI view that mounts the editor with the given `EngineSettings`. |
| `.imgly.configuration(_:)` | Applies an `EditorConfiguration` to the editor. |

## Next Steps

- [Theming](./user-interface/appearance/theming.md) — Customize the editor's visual appearance and color scheme
- [Localization](./user-interface/localization.md) — Translate the UI and add custom strings
- [Asset Library](./import-media/asset-library.md) — Configure where stickers, templates, and media come from
- [Editing Workflow](./concepts/editing-workflow.md) — Control editing access with Creator and Adopter roles
- [Engine Interface](./engine-interface.md) — Drive the engine directly without the editor UI&#x20;



---

## More Resources

- **[iOS Documentation Index](https://img.ly/docs/cesdk/ios/)** - Browse all iOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/ios/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/ios/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
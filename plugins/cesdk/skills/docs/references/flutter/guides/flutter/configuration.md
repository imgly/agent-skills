> This is one page of the CE.SDK Flutter documentation. For a complete overview, see the [Flutter Documentation Index](https://img.ly/docs/cesdk/flutter/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/flutter/llms-full.txt).

**Navigation:** [Guides](https://img.ly/docs/cesdk/flutter/guides-8d8b00/) > [Configuration](./configuration.md)

---

```dart file=@cesdk_flutter_examples/editor-guides-configuration-basics/editor_configuration_basics_solution.dart reference-only
import "package:imgly_editor/imgly_editor.dart";

class EditorConfigurationBasicsSolution {
  /// Opens the editor.
  void openEditor() async {
    final settings = EditorSettings(
        license:
            "YOUR_LICENSE", // Get your license from https://img.ly/forms/free-trial, pass null for evaluation mode with watermark
        baseUri: "YOUR_BASE_URI",
        userId: "YOUR_USER_ID" // A unique string to identify your user/session
        );

    final _ = await IMGLYEditor.openEditor(
        preset: EditorPreset.design,
        settings: settings,
        metadata: {"MY_KEY": "MY_VALUE"}
        );
  }
}
```

In this example, we will show you how to make basic configurations for the mobile editor. The example is based on the [`Design Editor`](https://img.ly/showcases/cesdk/default-ui/ios), however, it is exactly the same for all the other [solutions](./prebuilt-solutions.md).

## Configuration

The `openEditor` function allows for some further basic configuration of the editor.

### EditorConfiguration

All the basic configuration settings are part of the `EditorConfiguration` which is required to initialize the editor.

```javascript highlight-configuration
final settings = EditorSettings(
    license:
        "YOUR_LICENSE", // Get your license from https://img.ly/forms/free-trial, pass null for evaluation mode with watermark
    baseUri: "YOUR_BASE_URI",
    userId: "YOUR_USER_ID" // A unique string to identify your user/session
    );
```

- `license` - the license to activate the [Engine](./get-started/overview.md) with.

```javascript highlight-license
license:
    "YOUR_LICENSE", // Get your license from https://img.ly/forms/free-trial, pass null for evaluation mode with watermark
```

- `baseUri` - the base URI used by the engine for built-in assets like emoji and fallback fonts, and by the editor for its default and demo asset sources (stickers, filters, and more). The default value points at the versioned IMG.LY CDN `https://cdn.img.ly/packages/imgly/cesdk-flutter/<version>/assets`. For production use, we recommend [downloading the assets](https://cdn.img.ly/packages/imgly/cesdk-flutter/1.84.0-rc.1/imgly-assets.zip), hosting them on your own server, and setting `baseUri` to your hosted location.

```javascript highlight-baseUri
baseUri: "YOUR_BASE_URI",
```

- `userID` - an optional unique ID tied to your application's user. This helps us accurately calculate monthly active users (MAU). Especially useful when one person uses the app on multiple devices with a sign-in feature, ensuring they're counted once. Providing this aids in better data accuracy. The default value is `nil`.

```javascript highlight-userId
userId: "YOUR_USER_ID" // A unique string to identify your user/session
```

### EditorPreset

- `preset` - is used to determine which predefined editor variant you want to use - if any.

```javascript highlight-preset
preset: EditorPreset.design,
```

### Metadata

- `metadata` - can be used to provide any custom `Map<String, dynamic>` to the underlying native plugin which you can use for further custom handling.

```javascript highlight-metadata
metadata: {"MY_KEY": "MY_VALUE"}
```

## Full Code

Here's the full code:

```dart
import "package:imgly_editor/imgly_editor.dart";

class BasicEditorSolution {
  /// Opens the editor.
  void openEditor() async {
    final settings = EditorSettings(
        license: "YOUR_LICENSE",
        baseUri: "YOUR_BASE_URI",
        userId: "YOUR_USER_ID"
        );

    final _ = await IMGLYEditor.openEditor(
        preset: EditorPreset.design,
        settings: settings,
        metadata: {"MY_KEY": "MY_VALUE"}
        );
  }
}
```



---

## More Resources

- **[Flutter Documentation Index](https://img.ly/docs/cesdk/flutter/)** - Browse all Flutter documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/flutter/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/flutter/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
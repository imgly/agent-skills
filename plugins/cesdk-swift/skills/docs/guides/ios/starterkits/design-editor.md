> This is one page of the CE.SDK iOS documentation. For a complete overview, see the [iOS Documentation Index](https://img.ly/docs/cesdk/ios/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/ios/llms-full.txt).

**Navigation:** [Starter Kits](../starterkits.md) > [Design Editor](./design-editor.md)

---

```swift file=@cesdk_swift_examples/starter-kits/starter-kit-design/StarterKit/DesignEditorStarterKit.swift reference-only
import IMGLYEditor
import IMGLYEngine
import SwiftUI

// MARK: - Starter Kit View

struct DesignEditorStarterKit: View {
  // Provide `EngineSettings` with your license and an optional userId.
  let settings = EngineSettings(
    license: secrets.licenseKey, // Use nil for evaluation mode with watermark
    userID: "<your unique user id>",
  )

  var body: some View {
    Editor(settings)
      .imgly.configuration {
        DesignEditorConfiguration()
      }
  }
}

// MARK: - Preview

#Preview {
  DesignEditorStarterKit()
}
```

```swift file=@cesdk_swift_examples/starter-kits/starter-kit-design/StarterKit/callbacks/OnCreate+Design.swift reference-only
import Foundation
import IMGLYEditor
import IMGLYEngine

// MARK: - Default OnCreate

public extension DesignEditorConfiguration {
  /// The default `onCreate` handler.
  internal static var defaultOnCreateHandler: OnCreate.Handler {
    { engine, _ in
      try await defaultOnCreate()(engine)
    }
  }

  /// Default design editor specific `OnCreate.Callback` implementation with solution specific settings, scene
  /// and editor creation setup.
  /// - Parameters:
  ///   - preCreateScene: Callback to do any pre scene loading tasks such as applying settings.
  ///   Defaults to `DesignEditorConfiguration.defaultPreCreateScene`.
  ///   - createScene: Callback to load/create the scene and load asset sources. Defaults to
  /// `DesignEditorConfiguration.defaultCreateScene`.
  ///   - loadAssetSources: Callback to load any asset sources. Defaults to
  /// `DesignEditorConfiguration.defaultLoadAssetSources`.
  ///   - postCreateScene: Callback to do any post scene loading tasks. Defaults to
  ///   `DesignEditorConfiguration.defaultPostCreateScene`.
  /// - Returns: A composed `OnCreate.Callback`that sequentially executes all three initialization phases.
  static func defaultOnCreate(
    preCreateScene: @escaping OnCreate.Callback = defaultPreCreateScene,
    createScene: @escaping OnCreate.Callback = defaultCreateScene,
    loadAssetSources: @escaping OnCreate.Callback = defaultLoadAssetSources,
    postCreateScene: @escaping OnCreate.Callback = defaultPostCreateScene,
  ) -> OnCreate.Callback {
    { engine in
      try await preCreateScene(engine)
      try await createScene(engine)
      try await loadAssetSources(engine)
      try await postCreateScene(engine)
    }
  }

  /// Configures engine settings before scene loading.
  ///
  /// Sets editor role, touch gestures, camera clamping, and global scopes.
  static let defaultPreCreateScene: OnCreate.Callback = { engine in
    try engine.editor.setRole("Adopter")
    try engine.editor.setSettingEnum("camera/clamping/overshootMode", value: "Center")

    let highlightColor: IMGLYEngine.Color = try engine.editor.getSettingColor("highlightColor")
    try engine.editor.setSettingColor("placeholderHighlightColor", color: highlightColor)

    try engine.editor.setSettingBool("touch/dragStartCanSelect", value: false)
    try engine.editor.setSettingEnum("touch/pinchAction", value: "Zoom")
    try engine.editor.setSettingEnum("touch/rotateAction", value: "None")

    try ([
      "appearance/adjustments", "appearance/filter", "appearance/effect",
      "appearance/blur", "appearance/shadow",
      "editor/select",
      "fill/change", "fill/changeType",
      "layer/crop", "layer/move", "layer/resize", "layer/rotate", "layer/flip",
      "layer/opacity", "layer/blendMode", "layer/visibility", "layer/clipping",
      "lifecycle/destroy", "lifecycle/duplicate",
      "stroke/change", "shape/change",
      "text/edit", "text/character",
    ]).forEach { scope in
      try engine.editor.setGlobalScope(key: scope, value: .defer)
    }
  }

  /// Loads the built-in empty design scene.
  static let defaultCreateScene: OnCreate.Callback = { engine in
    #if SWIFT_PACKAGE
      let bundle = Bundle.module
    #else
      let bundle = Bundle(for: DesignEditorConfiguration.self)
    #endif
    let sceneURL = bundle.url(forResource: "design-ui-empty", withExtension: "scene")!
    try await engine.scene.load(from: sceneURL)
  }

  /// Registers all default and demo asset sources, plus text and photo roll sources.
  static let defaultLoadAssetSources: OnCreate.Callback = { engine in
    let basePath = try engine.editor.getSettingString("basePath")
    guard let baseURL = URL(string: basePath) else { return }
    let sourceIDs = [
      "ly.img.sticker", "ly.img.vector.shape", "ly.img.filter", "ly.img.color.palette",
      "ly.img.effect", "ly.img.blur", "ly.img.typeface", "ly.img.crop.presets",
      "ly.img.page.presets", "ly.img.text", "ly.img.text.styles", "ly.img.text.curves", "ly.img.text.components",
      "ly.img.image",
    ]
    try await withThrowingTaskGroup(of: String.self) { group in
      for id in sourceIDs {
        group.addTask {
          try await engine.asset.addLocalAssetSourceFromJSON(
            baseURL.appendingPathComponent(id).appendingPathComponent("content.json"),
          )
        }
      }
      for try await _ in group {}
    }

    try engine.asset.addLocalSource(
      sourceID: "ly.img.image.upload",
      supportedMimeTypes: ["image/jpeg", "image/png", "image/svg+xml", "image/gif", "image/apng", "image/bmp"],
    )

    try engine.asset.addSource(PhotoRollAssetSource(engine: engine))
  }

  /// Configures stack layout, clears selection, and enables page carousel.
  static let defaultPostCreateScene: OnCreate.Callback = { engine in
    if let stack = try engine.block.find(byType: .stack).first {
      try engine.block.setEnum(stack, property: "stack/axis", value: "Horizontal")
    }

    try engine.block.findAllSelected().forEach {
      try engine.block.setSelected($0, selected: false)
    }

    try engine.editor.setSettingBool("features/pageCarouselEnabled", value: true)
  }
}
```

```swift file=@cesdk_swift_examples/starter-kits/starter-kit-design/StarterKit/callbacks/OnExport+Design.swift reference-only
import IMGLYEditor
import IMGLYEngine
import UniformTypeIdentifiers

// MARK: - Default OnExport

extension DesignEditorConfiguration {
  /// The default export handler.
  ///
  /// Exports the scene as PDF and opens the system share sheet.
  static var defaultOnExportHandler: OnExport.Handler {
    { engine, eventHandler, existing in
      try await existing()
      guard let scene = try engine.scene.get() else {
        throw EditorError("No scene was found.")
      }
      let data = try await engine.block.export(scene, mimeType: .pdf) { engine in
        try engine.scene.getPages().forEach {
          try engine.block.setScopeEnabled($0, key: "layer/visibility", enabled: true)
          try engine.block.setVisible($0, visible: true)
        }
      }
      let url = FileManager.default.temporaryDirectory.appendingPathComponent("Export", conformingTo: .pdf)
      try data.write(to: url, options: [.atomic])
      eventHandler.send(.shareFile(url))
    }
  }
}
```

Embed a ready-to-use design editor that lets users personalize templates while respecting layout constraints. Runs entirely on the mobile device with no server dependencies.

![Design Editor starter kit screenshot](https://img.ly/docs/cesdk/ios/starterkits/design-editor-8unj9u/assets/ios.hero.webp)

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/starterkit-design-editor-ios/archive/refs/heads/v1.83.0-nightly.20260829.zip)
>
> - [View source on GitHub](https://github.com/imgly/starterkit-design-editor-ios/tree/v1.83.0-nightly.20260829)

***

## Pre-Requisites

This guide assumes basic familiarity with iOS and Swift. You will need:

- Xcode $XCODE\_VERSION$ or later
- Swift $SWIFT\_VERSION$ or later
- iOS 16.0+

<Tabs syncKey="project-type">
  <TabItem label="New Project">
    ## Get Started

    Start with a complete, runnable iOS starter kit project.

    ### Step 1: Clone the Repository

    ```bash
    git clone -b v1.83.0-nightly.20260829 https://github.com/imgly/starterkit-design-editor-ios.git
    cd starterkit-design-editor-ios
    ```

    ### Step 2: Open and Run

    Open the project in Xcode and run on a simulator or connected device:

    1. Open `starterkit-design-editor-ios.xcodeproj` in Xcode
    2. Select your target device or simulator
    3. Press **⌘R** to build and run

    The sample app shows a "Launch Editor" button. Tapping it presents the design editor:

    ```swift highlight-starter-kit-view
    var body: some View {
      Editor(settings)
        .imgly.configuration {
          DesignEditorConfiguration()
        }
    }
    ```
  </TabItem>

  <TabItem label="Existing Project">
    ## Get Started

    Integrate the starter kit files into your existing iOS app.

    ### Step 1: Add the IMG.LY Swift Package

    Add the CE.SDK dependency via Swift Package Manager:

    1. In Xcode, go to **File → Add Package Dependencies...**
    2. Enter the repository URL:
       ```
       https://github.com/imgly/IMGLYUI-swift
       ```
    3. Select version `1.83.0-nightly.20260829` and add the `IMGLYEditor` product to your target

    ### Step 2: Copy the Starter Kit Files

    Download and extract the starter kit files into your project:

    ```bash
    repo="starterkit-design-editor-ios"
    version="1.83.0-nightly.20260829"
    curl -L "https://codeload.github.com/imgly/${repo}/tar.gz/refs/heads/v${version}" | tar -xz --strip-components=1 "${repo}-v${version}/starter-kit"
    ```

    ### Step 3: Add Files to Your Xcode Project

    Drag the `starter-kit/` folder into your Xcode project. Make sure "Copy items if needed" is checked and the files are added to your app target.

    ### Step 4: Launch the Editor From Your UI

    Present the editor from any SwiftUI view:

    ```swift highlight-starter-kit-composable
    Editor(settings)
      .imgly.configuration {
        DesignEditorConfiguration()
      }
    ```
  </TabItem>
</Tabs>

The full implementation of the starter kit lives in the `starter-kit/` folder:

```text
starter-kit/
├── DesignEditorStarterKit.swift        # SwiftUI view that launches the editor
├── DesignEditorConfiguration.swift     # Editor configuration (callbacks + UI components)
├── callbacks/
│   ├── OnCreate+Design.swift            # Editor initialization logic
│   └── OnExport+Design.swift            # Export flow and handling (PDF)
└── components/
    ├── CanvasMenu+Design.swift          # Canvas menu configuration
    ├── Dock+Design.swift                # Dock configuration
    ├── InspectorBar+Design.swift        # Inspector bar configuration
    └── NavigationBar+Design.swift       # Navigation bar configuration
```

## Configuring the Starter Kit

The starter kit provides a generic structure and behavior that you can customize to match your needs. Since the implementation is part of your codebase, you can add, remove, or modify functionality as you wish.

The entry point is `DesignEditorStarterKit.swift`, which creates the `Editor` view and applies the configuration:

```swift highlight-starter-kit-composable
Editor(settings)
  .imgly.configuration {
    DesignEditorConfiguration()
  }
```

You can configure the editor based on your business logic — for example, loading a scene from a previous editing session or displaying different UI for different users. Add properties to `DesignEditorStarterKit` and use them in the `EditorConfiguration.onCreate` callback to customize scene loading or other behavior.

## Set Up a Scene

The scene setup logic is located in `OnCreate+Design.swift` as part of the `defaultCreateScene` callback:

```swift highlight-starter-kit-on-create-scene
#if SWIFT_PACKAGE
  let bundle = Bundle.module
#else
  let bundle = Bundle(for: DesignEditorConfiguration.self)
#endif
let sceneURL = bundle.url(forResource: "design-ui-empty", withExtension: "scene")!
try await engine.scene.load(from: sceneURL)
```

The `#if SWIFT_PACKAGE` conditional picks the bundle that contains the starter kit's resources: the `Bundle(for:)` branch applies when you add the starter kit to an app target as described in this guide, while `Bundle.module` applies when the kit compiles inside a Swift package.

CE.SDK offers multiple ways to load a scene into the editor — from a template archive, a blank canvas, or a `.scene` file.

> **More Loading Options:** See [Open the Editor](../open-the-editor.md) for all available loading methods.

## Customize Assets

The asset source setup is located in `OnCreate+Design.swift` as part of the `defaultLoadAssetSources` callback. Enable or disable individual sources:

```swift highlight-starter-kit-on-load-asset-sources
    let basePath = try engine.editor.getSettingString("basePath")
    guard let baseURL = URL(string: basePath) else { return }
    let sourceIDs = [
      "ly.img.sticker", "ly.img.vector.shape", "ly.img.filter", "ly.img.color.palette",
      "ly.img.effect", "ly.img.blur", "ly.img.typeface", "ly.img.crop.presets",
      "ly.img.page.presets", "ly.img.text", "ly.img.text.styles", "ly.img.text.curves", "ly.img.text.components",
      "ly.img.image",
    ]
    try await withThrowingTaskGroup(of: String.self) { group in
      for id in sourceIDs {
        group.addTask {
          try await engine.asset.addLocalAssetSourceFromJSON(
            baseURL.appendingPathComponent(id).appendingPathComponent("content.json"),
          )
        }
      }
      for try await _ in group {}
    }

    try engine.asset.addLocalSource(
      sourceID: "ly.img.image.upload",
      supportedMimeTypes: ["image/jpeg", "image/png", "image/svg+xml", "image/gif", "image/apng", "image/bmp"],
    )

    try engine.asset.addSource(PhotoRollAssetSource(engine: engine))
```

> **More Asset Sources:** See [Import Media](../import-media.md) for all available assets and loading mechanisms.

For production deployments, self-hosting assets is required—the IMG.LY CDN is intended for development only. See [Serve Assets](../serve-assets.md) for downloading assets, configuring `baseURL` and excluding unused sources to optimize load times.

## Self-Host Assets for Production

The starter kit loads assets from the `baseURL` you set on `EngineSettings`, which defaults to the IMG.LY CDN (`https://cdn.img.ly/packages/imgly/cesdk-swift/1.83.0-nightly.20260829/assets`). To self-host assets, download the [asset zip file](https://cdn.img.ly/packages/imgly/cesdk-swift/1.83.0-nightly.20260829/imgly-assets.zip) and pass a custom `baseURL` to your `EngineSettings`.

## Customize Export Functionality

Export handling logic is located in `OnExport+Design.swift` as part of the `onExport` callback.

The default implementation exports the scene as PDF and opens the system share sheet:

```swift highlight-starter-kit-on-export
try await existing()
guard let scene = try engine.scene.get() else {
  throw EditorError("No scene was found.")
}
let data = try await engine.block.export(scene, mimeType: .pdf) { engine in
  try engine.scene.getPages().forEach {
    try engine.block.setScopeEnabled($0, key: "layer/visibility", enabled: true)
    try engine.block.setVisible($0, visible: true)
  }
}
let url = FileManager.default.temporaryDirectory.appendingPathComponent("Export", conformingTo: .pdf)
try data.write(to: url, options: [.atomic])
eventHandler.send(.shareFile(url))
```

> **More Export Options:** See [Export](../export-save-publish/export.md) and [Save](../export-save-publish/save.md) guides for all available export and scene calls.

***

## Customize (Optional)

### Color Scheme

CE.SDK supports light and dark modes out of the box, plus automatic system preference detection. Apply SwiftUI's `.preferredColorScheme` modifier to the `Editor` view to switch themes.

See [Theming](../user-interface/appearance/theming.md) for more details.

### Localization

See [Localization](../user-interface/localization.md) for supported languages, adding support for new languages, and replacing existing keys.

### UI Layout

All configurable components are located in the `components/` folder:

- `CanvasMenu+Design.swift` — see [Canvas Menu](../user-interface/customization/canvas-menu.md) for full configuration options
- `Dock+Design.swift` — see [Dock](../user-interface/customization/dock.md) for full configuration options
- `InspectorBar+Design.swift` — see [Inspector Bar](../user-interface/customization/inspector-bar.md) for full configuration options
- `NavigationBar+Design.swift` — see [Navigation Bar](../user-interface/customization/navigation-bar.md) for full configuration options

***

## Troubleshooting

> **Free Trial:** [Sign up for a free trial](https://img.ly/forms/free-trial) to get a license key and remove the watermark.

### Editor doesn't load

- **Check onCreate**: Ensure the `onCreate` callback loads a scene successfully
- **Verify the baseURL**: Assets must be accessible from the CDN or your self-hosted location
- **Check Xcode console**: Look for errors in the Xcode debug console

### Assets don't appear

- **Check network requests**: Make sure the device or simulator is connected to the internet
- **Self-host assets for production**: See [Serve Assets](../serve-assets.md) to host assets on your infrastructure
- **Check Xcode console**: Look for errors in the Xcode debug console

### Export fails or produces blank documents

- **Wait for content to load**: Ensure all elements are fully loaded before exporting
- **Check Xcode console**: Look for errors in the Xcode debug console

### Watermark appears in production

- **Add your license key**: Set the `license` property in your `EngineSettings`
- **Sign up for a trial**: Get a free trial license at [img.ly/forms/free-trial](https://img.ly/forms/free-trial)

***

## Next Steps

- [Configuration](../configuration.md) – Complete list of initialization options
- [Serve Assets](../serve-assets.md) – Self-host engine assets for production
- [Theming](../user-interface/appearance/theming.md) – Customize colors and appearance
- [Localization](../user-interface/localization.md) – Add translations and language support



---

## More Resources

- **[iOS Documentation Index](https://img.ly/docs/cesdk/ios/)** - Browse all iOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/ios/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/ios/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
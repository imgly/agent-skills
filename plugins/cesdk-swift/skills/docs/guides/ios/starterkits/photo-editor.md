> This is one page of the CE.SDK iOS documentation. For a complete overview, see the [iOS Documentation Index](https://img.ly/docs/cesdk/ios/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/ios/llms-full.txt).

**Navigation:** [Starter Kits](../starterkits.md) > [Photo Editor](./photo-editor.md)

---

```swift file=@cesdk_swift_examples/starter-kits/starter-kit-photo/StarterKit/PhotoEditorStarterKit.swift reference-only
import IMGLYEditor
import IMGLYEngine
import SwiftUI

// MARK: - Starter Kit View

struct PhotoEditorStarterKit: View {
  // Provide `EngineSettings` with your license and an optional userId.
  let settings = EngineSettings(
    license: secrets.licenseKey, // Use nil for evaluation mode with watermark
    userID: "<your unique user id>",
  )

  var body: some View {
    Editor(settings)
      .imgly.configuration {
        PhotoEditorConfiguration()
      }
  }
}

// MARK: - Preview

#Preview {
  PhotoEditorStarterKit()
}
```

```swift file=@cesdk_swift_examples/starter-kits/starter-kit-photo/StarterKit/callbacks/OnCreate+Photo.swift reference-only
import Foundation
import IMGLYEditor
import IMGLYEngine

// MARK: - Default OnCreate

public extension PhotoEditorConfiguration {
  /// The default `onCreate` handler.
  internal static var defaultOnCreateHandler: OnCreate.Handler {
    { engine, _ in
      try await defaultOnCreate()(engine)
    }
  }

  /// Default photo editor specific `OnCreate.Callback` implementation with solution specific settings, scene
  /// and editor creation setup.
  /// - Parameters:
  ///   - preCreateScene: Callback to do any pre scene loading tasks such as applying settings.
  ///   Defaults to `PhotoEditorConfiguration.defaultPreCreateScene`.
  ///   - createScene: Callback to load/create the scene and load asset sources. Defaults to
  /// `PhotoEditorConfiguration.defaultCreateScene`.
  ///   - loadAssetSources: Callback to load any asset sources. Defaults to
  /// `PhotoEditorConfiguration.defaultLoadAssetSources`.
  ///   - postCreateScene: Callback to do any post scene loading tasks. Defaults to
  ///   `PhotoEditorConfiguration.defaultPostCreateScene`.
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

  /// Creates a scene from the default photo image.
  static let defaultCreateScene: OnCreate.Callback = { engine in
    #if SWIFT_PACKAGE
      let bundle = Bundle.module
    #else
      let bundle = Bundle(for: PhotoEditorConfiguration.self)
    #endif
    let imageURL = bundle.url(forResource: "photo-ui-empty", withExtension: "png")!
    try await engine.scene.create(fromImage: imageURL)
  }

  /// Registers all default and demo asset sources, plus text and photo roll sources.
  static let defaultLoadAssetSources: OnCreate.Callback = { engine in
    let basePath = try engine.editor.getSettingString("basePath")
    guard let baseURL = URL(string: basePath) else { return }
    let defaultSourceIDs = [
      "ly.img.sticker", "ly.img.vector.shape", "ly.img.filter", "ly.img.color.palette",
      "ly.img.effect", "ly.img.blur", "ly.img.typeface", "ly.img.crop.presets",
      "ly.img.page.presets", "ly.img.text", "ly.img.text.styles", "ly.img.text.curves", "ly.img.text.components",
      "ly.img.image",
    ]
    try await withThrowingTaskGroup(of: String.self) { group in
      for id in defaultSourceIDs {
        group.addTask {
          try await engine.asset.addLocalAssetSourceFromJSON(
            baseURL.appendingPathComponent(id).appendingPathComponent("content.json"),
          )
        }
      }
      for try await _ in group {}
    }

    try engine.asset.addSource(PhotoRollAssetSource(engine: engine))
  }

  /// Configures photo-specific page and crop behavior.
  static let defaultPostCreateScene: OnCreate.Callback = { engine in
    let page = try getSinglePage(engine)

    try engine.editor.setHighlightingEnabled(page, enabled: false)
    try engine.block.setScopeEnabled(page, key: "layer/move", enabled: false)

    try engine.editor.setSettingBool("page/highlightWhenCropping", value: true)
    try engine.editor.setSettingBool("page/allowMoveInteraction", value: true)
    try engine.editor.setSettingBool("page/selectWhenNoBlocksSelected", value: true)
    try engine.editor.setSettingBool("doubleClickToCropEnabled", value: false)
  }

  // MARK: - Helpers

  /// Gets the single page with an image fill from the scene.
  internal static func getSinglePage(_ engine: Engine, withImageFill: Bool = true) throws -> DesignBlockID {
    let pages = try engine.scene.getPages()
    guard let page = pages.first, pages.count == 1 else {
      throw EditorError("A single page is required for this operation.")
    }
    if withImageFill {
      guard try engine.block.getType(engine.block.getFill(page)) == FillType.image.rawValue else {
        throw EditorError("A single page with an image fill is required for this operation.")
      }
    }
    return page
  }
}
```

```swift file=@cesdk_swift_examples/starter-kits/starter-kit-photo/StarterKit/callbacks/OnExport+Photo.swift reference-only
import IMGLYEditor
import IMGLYEngine
import UniformTypeIdentifiers

// MARK: - Default OnExport

extension PhotoEditorConfiguration {
  /// The default export handler.
  ///
  /// Exports the scene as PNG and opens the system share sheet.
  static var defaultOnExportHandler: OnExport.Handler {
    { engine, eventHandler, _ in
      guard let scene = try engine.scene.get() else {
        throw EditorError("No scene was found.")
      }
      let data = try await engine.block.export(scene, mimeType: .png) { engine in
        try engine.scene.getPages().forEach {
          try engine.block.setScopeEnabled($0, key: "layer/visibility", enabled: true)
          try engine.block.setVisible($0, visible: true)
        }
      }
      let url = FileManager.default.temporaryDirectory.appendingPathComponent("Export", conformingTo: .png)
      try data.write(to: url, options: [.atomic])
      eventHandler.send(.shareFile(url))
    }
  }
}
```

```swift file=@cesdk_swift_examples/starter-kits/starter-kit-photo/StarterKit/examples/ExampleForceCrop.swift reference-only
@_spi(Internal) import IMGLYEditor
import IMGLYEngine

/// Example: Apply force crop in the `onLoaded` callback.
/// Add this logic before or after the existing `onLoaded` handler in `PhotoEditorConfiguration`.
extension PhotoEditorConfiguration {
  static var forceCropOnLoadedHandler: OnLoaded.Handler {
    { context, existing in
      // Apply force crop: allow 1:1, 16:9, or 9:16
      if let page = try context.engine.scene.getPages().first {
        context.eventHandler.send(
          .applyForceCrop(
            to: page,
            with: [
              ForceCropPreset(sourceID: "ly.img.crop.presets", presetID: "aspect-ratio-1-1"),
              ForceCropPreset(sourceID: "ly.img.crop.presets", presetID: "aspect-ratio-16-9"),
              ForceCropPreset(sourceID: "ly.img.crop.presets", presetID: "aspect-ratio-9-16"),
            ],
            mode: .ifNeeded,
          ),
        )
      }
      // Continue with the existing onLoaded logic
      try await existing()
    }
  }
}

```

Professional photo editing for your iOS app—crop, filter, adjust, and remove backgrounds. Runs entirely on the mobile device with no server dependencies.

![Photo Editor starter kit screenshot](https://img.ly/docs/cesdk/ios/starterkits/photo-editor-r6kq0u/assets/ios.hero.webp)

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/starterkit-photo-editor-ios/archive/refs/heads/v1.83.0-nightly.20260903.zip)
>
> - [View source on GitHub](https://github.com/imgly/starterkit-photo-editor-ios/tree/v1.83.0-nightly.20260903)

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
    git clone -b v1.83.0-nightly.20260903 https://github.com/imgly/starterkit-photo-editor-ios.git
    cd starterkit-photo-editor-ios
    ```

    ### Step 2: Open and Run

    Open the project in Xcode and run on a simulator or connected device:

    1. Open `starterkit-photo-editor-ios.xcodeproj` in Xcode
    2. Select your target device or simulator
    3. Press **⌘R** to build and run

    The sample app shows a "Launch Editor" button. Tapping it presents the photo editor:

    ```swift highlight-starter-kit-view
    var body: some View {
      Editor(settings)
        .imgly.configuration {
          PhotoEditorConfiguration()
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
    3. Select version `1.83.0-nightly.20260903` and add the `IMGLYEditor` product to your target

    ### Step 2: Copy the Starter Kit Files

    Download and extract the starter kit files into your project:

    ```bash
    repo="starterkit-photo-editor-ios"
    version="1.83.0-nightly.20260903"
    curl -L "https://codeload.github.com/imgly/${repo}/tar.gz/refs/heads/v${version}" | tar -xz --strip-components=1 "${repo}-v${version}/starter-kit"
    ```

    ### Step 3: Add Files to Your Xcode Project

    Drag the `starter-kit/` folder into your Xcode project. Make sure "Copy items if needed" is checked and the files are added to your app target.

    ### Step 4: Launch the Editor From Your UI

    Present the editor from any SwiftUI view:

    ```swift highlight-starter-kit-composable
    Editor(settings)
      .imgly.configuration {
        PhotoEditorConfiguration()
      }
    ```
  </TabItem>
</Tabs>

The full implementation of the starter kit lives in the `starter-kit/` folder:

```text
starter-kit/
├── PhotoEditorStarterKit.swift         # SwiftUI view that launches the editor
├── PhotoEditorConfiguration.swift      # Editor configuration (callbacks + UI components)
├── callbacks/
│   ├── OnCreate+Photo.swift            # Editor initialization logic
│   ├── OnExport+Photo.swift            # Export flow and handling
│   ├── OnLoaded+Photo.swift            # Post-load setup (crop behavior)
│   └── OnChanged+Photo.swift           # Edit mode change handling
└── components/
    ├── CanvasMenu+Photo.swift           # Canvas menu configuration
    ├── Dock+Photo.swift                 # Dock configuration
    ├── InspectorBar+Photo.swift         # Inspector bar configuration
    └── NavigationBar+Photo.swift        # Navigation bar configuration
```

## Configuring the Starter Kit

The starter kit provides a generic structure and behavior that you can customize to match your needs. Since the implementation is part of your codebase, you can add, remove, or modify functionality as you wish.

The entry point is `PhotoEditorStarterKit.swift`, which creates the `Editor` view and applies the configuration:

```swift highlight-starter-kit-composable
Editor(settings)
  .imgly.configuration {
    PhotoEditorConfiguration()
  }
```

You can configure the editor based on your business logic — for example, loading a scene from a previous editing session or displaying different UI for different users. Add properties to `PhotoEditorStarterKit` and use them in the `EditorConfiguration.onCreate` callback to customize scene loading or other behavior.

## Set Up a Scene

The scene setup logic is located in `OnCreate+Photo.swift` as part of the `defaultCreateScene` callback:

```swift highlight-starter-kit-on-create-scene
#if SWIFT_PACKAGE
  let bundle = Bundle.module
#else
  let bundle = Bundle(for: PhotoEditorConfiguration.self)
#endif
let imageURL = bundle.url(forResource: "photo-ui-empty", withExtension: "png")!
try await engine.scene.create(fromImage: imageURL)
```

The `#if SWIFT_PACKAGE` conditional picks the bundle that contains the starter kit's resources: the `Bundle(for:)` branch applies when you add the starter kit to an app target as described in this guide, while `Bundle.module` applies when the kit compiles inside a Swift package.

CE.SDK offers multiple ways to load a scene into the editor — from an image URL, a template archive, a blank canvas, or a `.scene` file.

> **More Loading Options:** See [Open the Editor](../open-the-editor.md) for all available loading methods.

## Force Crop

Require users to crop images to specific dimensions before saving. This is useful for profile pictures, social media posts, or any workflow requiring consistent image sizes. Send the `applyForceCrop` event in an `onLoaded` callback:

```swift highlight-starter-kit-force-crop
/// Example: Apply force crop in the `onLoaded` callback.
/// Add this logic before or after the existing `onLoaded` handler in `PhotoEditorConfiguration`.
extension PhotoEditorConfiguration {
  static var forceCropOnLoadedHandler: OnLoaded.Handler {
    { context, existing in
      // Apply force crop: allow 1:1, 16:9, or 9:16
      if let page = try context.engine.scene.getPages().first {
        context.eventHandler.send(
          .applyForceCrop(
            to: page,
            with: [
              ForceCropPreset(sourceID: "ly.img.crop.presets", presetID: "aspect-ratio-1-1"),
              ForceCropPreset(sourceID: "ly.img.crop.presets", presetID: "aspect-ratio-16-9"),
              ForceCropPreset(sourceID: "ly.img.crop.presets", presetID: "aspect-ratio-9-16"),
            ],
            mode: .ifNeeded,
          ),
        )
      }
      // Continue with the existing onLoaded logic
      try await existing()
    }
  }
}
```

See [Force Crop](../user-interface/customization/force-crop.md) for more details.

## Customize Assets

The asset source setup is located in `OnCreate+Photo.swift` as part of the `defaultLoadAssetSources` callback. Enable or disable individual sources:

```swift highlight-starter-kit-on-load-asset-sources
    let basePath = try engine.editor.getSettingString("basePath")
    guard let baseURL = URL(string: basePath) else { return }
    let defaultSourceIDs = [
      "ly.img.sticker", "ly.img.vector.shape", "ly.img.filter", "ly.img.color.palette",
      "ly.img.effect", "ly.img.blur", "ly.img.typeface", "ly.img.crop.presets",
      "ly.img.page.presets", "ly.img.text", "ly.img.text.styles", "ly.img.text.curves", "ly.img.text.components",
      "ly.img.image",
    ]
    try await withThrowingTaskGroup(of: String.self) { group in
      for id in defaultSourceIDs {
        group.addTask {
          try await engine.asset.addLocalAssetSourceFromJSON(
            baseURL.appendingPathComponent(id).appendingPathComponent("content.json"),
          )
        }
      }
      for try await _ in group {}
    }

    try engine.asset.addSource(PhotoRollAssetSource(engine: engine))
```

> **More Asset Sources:** See [Import Media](../import-media.md) for all available assets and loading mechanisms.

For production deployments, self-hosting assets is required—the IMG.LY CDN is intended for development only. See [Serve Assets](../serve-assets.md) for downloading assets, configuring `baseURL` and excluding unused sources to optimize load times.

## Self-Host Assets for Production

The starter kit loads assets from the `baseURL` you set on `EngineSettings`, which defaults to the IMG.LY CDN (`https://cdn.img.ly/packages/imgly/cesdk-swift/1.83.0-nightly.20260903/assets`). To self-host assets, download the [asset zip file](https://cdn.img.ly/packages/imgly/cesdk-swift/1.83.0-nightly.20260903/imgly-assets.zip) and pass a custom `baseURL` to your `EngineSettings`.

## Customize Export Functionality

Export handling logic is located in `OnExport+Photo.swift` as part of the `onExport` callback.

The default implementation exports the scene as PNG and opens the system share sheet:

```swift highlight-starter-kit-on-export
guard let scene = try engine.scene.get() else {
  throw EditorError("No scene was found.")
}
let data = try await engine.block.export(scene, mimeType: .png) { engine in
  try engine.scene.getPages().forEach {
    try engine.block.setScopeEnabled($0, key: "layer/visibility", enabled: true)
    try engine.block.setVisible($0, visible: true)
  }
}
let url = FileManager.default.temporaryDirectory.appendingPathComponent("Export", conformingTo: .png)
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

- `CanvasMenu+Photo.swift` — see [Canvas Menu](../user-interface/customization/canvas-menu.md) for full configuration options
- `Dock+Photo.swift` — see [Dock](../user-interface/customization/dock.md) for full configuration options
- `InspectorBar+Photo.swift` — see [Inspector Bar](../user-interface/customization/inspector-bar.md) for full configuration options
- `NavigationBar+Photo.swift` — see [Navigation Bar](../user-interface/customization/navigation-bar.md) for full configuration options

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

### Export fails or produces blank images

- **Wait for content to load**: Ensure images are fully loaded before exporting
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
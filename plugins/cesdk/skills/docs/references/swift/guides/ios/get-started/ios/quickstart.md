> This is one page of the CE.SDK iOS documentation. For a complete overview, see the [iOS Documentation Index](https://img.ly/docs/cesdk/ios/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/ios/llms-full.txt).

**Navigation:** [Get Started](../overview.md) > [Quickstart iOS](./quickstart.md)

---

Get started with CE.SDK. Choose a starter kit below to see it in action, then
follow the integration guide.

## Starter Kits

Get started with the one that fits your use case.

<SolutionGrid>
  <SolutionCard title="Photo Editor" description="Professional photo editing for your iOS app—crop, filter, adjust, and remove backgrounds. Runs entirely on the mobile device with no server dependencies." contentId="r6kq0u" heroImage={photoHero} />

  <SolutionCard title="Design Editor" description="Embed a ready-to-use design editor that lets users personalize templates while respecting layout constraints. Runs entirely on the mobile device with no server dependencies." contentId="8unj9u" heroImage={designHero} />

  <SolutionCard title="Video Editor" description="Professional video editing for your iOS app—edit clips, add effects, trim footage, and export to MP4. Runs entirely on the mobile device with no server dependencies." contentId="e1nlor" heroImage={videoHero} />

  <SolutionCard title="T-Shirt Designer" description="Build print-ready t-shirt designs for your iOS app with a focused mobile UI. Runs entirely on the mobile device with no server dependencies." contentId="jwinqr" heroImage={apparelHero} />

  <SolutionCard title="Postcard Editor" description="Let users personalize postcards with templates, style presets, and print-ready exports. Runs entirely on the mobile device with no server dependencies." contentId="03mijr" heroImage={postcardHero} />
</SolutionGrid>

## Troubleshooting

These are the issues you are most likely to hit while wiring CE.SDK into an Xcode project. For anything else, [visit our support page](https://img.ly/company/contact-us).

```swift file=@cesdk_swift_examples/editor-guides-quickstart/EditorNavigationContainer.swift reference-only
import IMGLYEditor
import SwiftUI
import UIKit

struct EditorNavigationContainerSwiftUI: View {
  let engineSettings = EngineSettings(
    license: secrets.licenseKey, // pass nil for evaluation mode with watermark
    userID: "<your unique user id>",
  )

  var body: some View {
    NavigationStack {
      Editor(engineSettings)
        .imgly.configuration { DesignEditorConfiguration() }
    }
  }
}

class EditorNavigationContainerUIKit: UIViewController {
  let engineSettings = EngineSettings(
    license: secrets.licenseKey, // pass nil for evaluation mode with watermark
    userID: "<your unique user id>",
  )

  func presentEditor() {
    let editor = NavigationStack {
      Editor(engineSettings)
        .imgly.configuration { DesignEditorConfiguration() }
    }
    let editorVC = UIHostingController(rootView: editor)
    editorVC.modalPresentationStyle = .fullScreen
    present(editorVC, animated: true)
  }
}
```

### Xcode does not recognize `EngineSettings` or `Editor`

![Xcode errors for EngineSettings and Editor without the import](https://img.ly/docs/cesdk/ios/get-started/ios/quickstart-ios0qs/assets/import-error.png)

Every Swift file that touches the editor needs its own `import IMGLYEditor`.

### Build errors about missing modules

![Examples of build errors](https://img.ly/docs/cesdk/ios/get-started/ios/quickstart-ios0qs/assets/missing-package.png)

You picked the wrong target when you added the package. Open the target's **General** tab and check that `IMGLYEditor` is in the frameworks and libraries list.

![Target settings with IMGLYEditor in the frameworks list](https://img.ly/docs/cesdk/ios/get-started/ios/quickstart-ios0qs/assets/check-import.png)

If it is missing, add it with the `+` button at the bottom of that list.

### License key error at runtime

![Error alert for an invalid license key](https://img.ly/docs/cesdk/ios/get-started/ios/quickstart-ios0qs/assets/license-error.png)

An invalid license key shows this alert. Check that `EngineSettings` carries the exact key, including capitalization. To run in evaluation mode with a watermark, pass `nil` instead of a key. [Contact sales](https://img.ly/forms/contact-sales/) if you do not have a key yet.

### Blank top bar or missing controls

![Simulator screen with no top controls](https://img.ly/docs/cesdk/ios/get-started/ios/quickstart-ios0qs/assets/missing-controls.png)

The `Editor` shows its toolbars only inside a navigation container. Wrap it in a `NavigationStack`, as the starter kits do. Pass the configuration class of your starter kit, for example `DesignEditorConfiguration` from the Design Editor kit:

```swift highlight-navigation-swiftui
struct EditorNavigationContainerSwiftUI: View {
  let engineSettings = EngineSettings(
    license: secrets.licenseKey, // pass nil for evaluation mode with watermark
    userID: "<your unique user id>",
  )

  var body: some View {
    NavigationStack {
      Editor(engineSettings)
        .imgly.configuration { DesignEditorConfiguration() }
    }
  }
}
```

If the editor already sits inside a `NavigationStack` higher up in your view hierarchy, you do not need a second one. A `VStack`, `ZStack` or `ScrollView` as the direct parent is not a navigation container, so the toolbars stay hidden.

In UIKit, wrap the editor before you hand it to a `UIHostingController`, then present it full screen:

```swift highlight-navigation-uikit
func presentEditor() {
  let editor = NavigationStack {
    Editor(engineSettings)
      .imgly.configuration { DesignEditorConfiguration() }
  }
  let editorVC = UIHostingController(rootView: editor)
  editorVC.modalPresentationStyle = .fullScreen
  present(editorVC, animated: true)
}
```



---

## More Resources

- **[iOS Documentation Index](https://img.ly/docs/cesdk/ios/)** - Browse all iOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/ios/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/ios/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
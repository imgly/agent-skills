> This is one page of the CE.SDK Mac Catalyst documentation. For a complete overview, see the [Mac Catalyst Documentation Index](https://img.ly/docs/cesdk/mac-catalyst/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/mac-catalyst/llms-full.txt).

**Navigation:** [Get Started](../overview.md) > [Quickstart Mac Catalyst](./quickstart.md)

---

```swift file=@cesdk_swift_examples/engine-guides-integrate-with-swiftui/IntegrateWithSwiftUI.swift reference-only
import IMGLYEngine
import SwiftUI

struct IntegrateWithSwiftUI: View {
  @State private var engine: Engine?

  var body: some View {
    Group {
      if let engine {
        Canvas(engine: engine)
      } else {
        ProgressView("Starting the engine…")
      }
    }
    .onAppear {
      guard engine == nil else { return }
      Task {
        do {
          let engine = try await Engine(
            license: secrets.licenseKey, // pass nil for evaluation mode with watermark
            userID: "<your unique user id>",
          )
          let scene = try engine.scene.create()
          let page = try engine.block.create(.page)
          try engine.block.setWidth(page, value: 800)
          try engine.block.setHeight(page, value: 600)
          try engine.block.appendChild(to: scene, child: page)

          let text = try engine.block.create(.text)
          try engine.block.setString(text, property: "text/text", value: "Hello, CE.SDK!")
          try engine.block.setPositionX(text, value: 80)
          try engine.block.setPositionY(text, value: 260)
          try engine.block.setWidth(text, value: 640)
          try engine.block.appendChild(to: page, child: text)

          try await engine.scene.zoom(to: page, paddingLeft: 40, paddingTop: 40, paddingRight: 40, paddingBottom: 40)
          self.engine = engine
        } catch {
          print("Engine setup failed: \(error)")
        }
      }
    }
  }
}

#if DEBUG
  // Live preview that boots a real engine so the file can be exercised inside
  // Xcode without launching a host app. Requires Xcode 15+.
  @available(iOS 17, macOS 14, *)
  #Preview {
    IntegrateWithSwiftUI()
  }
#endif
```

```swift file=@cesdk_swift_examples/engine-guides-integrate-with-uikit/IntegrateWithUIKit.swift reference-only
#if os(iOS)
  import IMGLYEngine
  import MetalKit
  import UIKit

  final class IntegrateWithUIKit: UIViewController {
    private var engine: Engine?
    private lazy var canvas = MTKView(frame: .zero, device: MTLCreateSystemDefaultDevice())
    private lazy var spinner: UIActivityIndicatorView = {
      let indicator = UIActivityIndicatorView(style: .large)
      indicator.translatesAutoresizingMaskIntoConstraints = false
      indicator.hidesWhenStopped = true
      return indicator
    }()

    override func viewDidLoad() {
      super.viewDidLoad()
      view.addSubview(canvas)
      canvas.translatesAutoresizingMaskIntoConstraints = false
      NSLayoutConstraint.activate([
        canvas.leftAnchor.constraint(equalTo: view.leftAnchor),
        canvas.rightAnchor.constraint(equalTo: view.rightAnchor),
        canvas.topAnchor.constraint(equalTo: view.topAnchor),
        canvas.bottomAnchor.constraint(equalTo: view.bottomAnchor),
      ])

      view.addSubview(spinner)
      NSLayoutConstraint.activate([
        spinner.centerXAnchor.constraint(equalTo: view.centerXAnchor),
        spinner.centerYAnchor.constraint(equalTo: view.centerYAnchor),
      ])
      spinner.startAnimating()
    }

    override func viewDidAppear(_ animated: Bool) {
      super.viewDidAppear(animated)
      guard engine == nil else { return }
      Task {
        do {
          let engine = try await Engine(
            context: .metalView(view: canvas),
            license: secrets.licenseKey, // pass nil for evaluation mode with watermark
            userID: "<your unique user id>",
          )
          engine.onAppear()

          let scene = try engine.scene.create()
          let page = try engine.block.create(.page)
          try engine.block.setWidth(page, value: 800)
          try engine.block.setHeight(page, value: 600)
          try engine.block.appendChild(to: scene, child: page)

          let text = try engine.block.create(.text)
          try engine.block.setString(text, property: "text/text", value: "Hello, CE.SDK!")
          try engine.block.setPositionX(text, value: 80)
          try engine.block.setPositionY(text, value: 260)
          try engine.block.setWidth(text, value: 640)
          try engine.block.appendChild(to: page, child: text)

          try await engine.scene.zoom(to: page, paddingLeft: 40, paddingTop: 40, paddingRight: 40, paddingBottom: 40)
          self.engine = engine
          spinner.stopAnimating()
        } catch {
          print("Engine setup failed: \(error)")
        }
      }
    }

    override func viewWillDisappear(_ animated: Bool) {
      super.viewWillDisappear(animated)
      engine?.onDisappear()
    }
  }

#endif
```

This guide walks you through integrating the CE.SDK Engine into a brand-new Mac Catalyst app. Mac Catalyst runs your UIKit-based iOS app on the Mac, so you host the engine's canvas inside your own SwiftUI or UIKit view and drive it with the engine APIs — there is no prebuilt editor UI to drop in.

> **Note:** The prebuilt editor and camera (`IMGLYEditor`, `IMGLYCamera`) build on iOS only — CE.SDK does not currently ship a packaged UI like the iOS `IMGLYUI` package for macOS or Mac Catalyst. On Mac Catalyst, `IMGLYEngine` is the module you integrate: initialize the engine, host its canvas, and build your own controls on top. See the [Engine Interface](../../engine-interface.md) guide for the engine's capabilities and [Build Your Own UI](../../user-interface/build-your-own-ui.md) for a complete custom-editor walkthrough. If you need a packaged UI on these platforms rather than building your own, [get in touch with us](https://img.ly/forms/contact-sales).

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.83.0-nightly.20260903)

## Requirements

To work with the SDK, you'll need:

- A Mac running a recent version of [Xcode](https://developer.apple.com/xcode/)
- A deployment target of macOS 11 or later (Mac Catalyst)
- A valid **CE.SDK license key** ([Get a free trial](https://img.ly/forms/free-trial))

## Creating a new Xcode Project

**1.** Launch Xcode and use the `File` menu to select `New` -> `Project...`.

**2.** Select the `iOS` tab, highlight the `App` template, and click `Next`. Mac Catalyst builds from an iOS app target, so you start from the iOS `App` template.

**3.** Enter a product name and an organization identifier, and set the language to `Swift`. For the interface, choose `SwiftUI` or, for a UIKit app, `Storyboard` — which scaffolds a `UIViewController` (`ViewController.swift`) to build on. Match the hosting path you'll follow in the Host the Canvas section below, then click `Next`.

**4.** Choose a location to save the project and click `Create`.

## Enable the Mac Catalyst Destination

**1.** Select your project in the navigator, then select the app target.

**2.** On the `General` tab, find **Supported Destinations** and click the `+` button.

**3.** Choose **Mac (Mac Catalyst)** from the list. Xcode adds Mac Catalyst as a run destination alongside the iOS simulators.

## Add the CE.SDK Swift package

**1.** With your Xcode project open, use the `File` menu to select `Add Package Dependencies...`

**2.** Copy the following package URL and paste it into the search field at the top right of the dialog:

https://github.com/imgly/IMGLYEngine-swift

**3.** Once the package resolves, click `Add Package`.

**4.** When Xcode presents the list of libraries, add the `IMGLYEngine` library to your app target, then click `Add Package`.

> **Warning:** On Mac Catalyst, add the `IMGLYEngine-swift` package — not `IMGLYUI-swift`. The `IMGLYUI` package that powers the prebuilt editor and camera builds on iOS only, so it cannot be linked into a Mac Catalyst target. `IMGLYEngine` ships on iOS, macOS, and Mac Catalyst.

## Host the Canvas

The engine renders into a Metal view. Initialize the engine with `try await Engine(...)`, then place its canvas in your view hierarchy. Pick the framework your app uses:

<Tabs>
  <TabItem label="SwiftUI">
    Import the SDK:

    ```swift highlight-integrateSwiftUI-import
    import IMGLYEngine
    import SwiftUI
    ```

    `Canvas(engine:)` adopts the engine's Metal view into your SwiftUI hierarchy. The `.metal` render context is the default, so `Engine(license:userID:)` creates its own view. Start the engine in `onAppear`, hold it in `@State`, and seed a scene so the canvas shows content on launch:

    ```swift highlight-integrateSwiftUI-canvas
    struct IntegrateWithSwiftUI: View {
      @State private var engine: Engine?

      var body: some View {
        Group {
          if let engine {
            Canvas(engine: engine)
          } else {
            ProgressView("Starting the engine…")
          }
        }
        .onAppear {
          guard engine == nil else { return }
          Task {
            do {
              let engine = try await Engine(
                license: secrets.licenseKey, // pass nil for evaluation mode with watermark
                userID: "<your unique user id>",
              )
              let scene = try engine.scene.create()
              let page = try engine.block.create(.page)
              try engine.block.setWidth(page, value: 800)
              try engine.block.setHeight(page, value: 600)
              try engine.block.appendChild(to: scene, child: page)

              let text = try engine.block.create(.text)
              try engine.block.setString(text, property: "text/text", value: "Hello, CE.SDK!")
              try engine.block.setPositionX(text, value: 80)
              try engine.block.setPositionY(text, value: 260)
              try engine.block.setWidth(text, value: 640)
              try engine.block.appendChild(to: page, child: text)

              try await engine.scene.zoom(to: page, paddingLeft: 40, paddingTop: 40, paddingRight: 40, paddingBottom: 40)
              self.engine = engine
            } catch {
              print("Engine setup failed: \(error)")
            }
          }
        }
      }
    }
    ```

    Present `IntegrateWithSwiftUI` as your app's root view: in the `App` file Xcode generated, replace `ContentView()` inside the `WindowGroup` with `IntegrateWithSwiftUI()`.
  </TabItem>

  <TabItem label="UIKit">
    Import the SDK:

    ```swift highlight-integrateUIKit-import
      import IMGLYEngine
      import MetalKit
      import UIKit
    ```

    For a UIKit app, own an `MTKView` and hand it to the engine with the `.metalView(view:)` context. Forward `viewDidAppear` / `viewWillDisappear` to `engine.onAppear()` / `engine.onDisappear()` — forward-compatible lifecycle hooks that are no-ops in the engine today but part of the public API:

    ```swift highlight-integrateUIKit-canvas
      final class IntegrateWithUIKit: UIViewController {
        private var engine: Engine?
        private lazy var canvas = MTKView(frame: .zero, device: MTLCreateSystemDefaultDevice())
        private lazy var spinner: UIActivityIndicatorView = {
          let indicator = UIActivityIndicatorView(style: .large)
          indicator.translatesAutoresizingMaskIntoConstraints = false
          indicator.hidesWhenStopped = true
          return indicator
        }()

        override func viewDidLoad() {
          super.viewDidLoad()
          view.addSubview(canvas)
          canvas.translatesAutoresizingMaskIntoConstraints = false
          NSLayoutConstraint.activate([
            canvas.leftAnchor.constraint(equalTo: view.leftAnchor),
            canvas.rightAnchor.constraint(equalTo: view.rightAnchor),
            canvas.topAnchor.constraint(equalTo: view.topAnchor),
            canvas.bottomAnchor.constraint(equalTo: view.bottomAnchor),
          ])

          view.addSubview(spinner)
          NSLayoutConstraint.activate([
            spinner.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            spinner.centerYAnchor.constraint(equalTo: view.centerYAnchor),
          ])
          spinner.startAnimating()
        }

        override func viewDidAppear(_ animated: Bool) {
          super.viewDidAppear(animated)
          guard engine == nil else { return }
          Task {
            do {
              let engine = try await Engine(
                context: .metalView(view: canvas),
                license: secrets.licenseKey, // pass nil for evaluation mode with watermark
                userID: "<your unique user id>",
              )
              engine.onAppear()

              let scene = try engine.scene.create()
              let page = try engine.block.create(.page)
              try engine.block.setWidth(page, value: 800)
              try engine.block.setHeight(page, value: 600)
              try engine.block.appendChild(to: scene, child: page)

              let text = try engine.block.create(.text)
              try engine.block.setString(text, property: "text/text", value: "Hello, CE.SDK!")
              try engine.block.setPositionX(text, value: 80)
              try engine.block.setPositionY(text, value: 260)
              try engine.block.setWidth(text, value: 640)
              try engine.block.appendChild(to: page, child: text)

              try await engine.scene.zoom(to: page, paddingLeft: 40, paddingTop: 40, paddingRight: 40, paddingBottom: 40)
              self.engine = engine
              spinner.stopAnimating()
            } catch {
              print("Engine setup failed: \(error)")
            }
          }
        }

        override func viewWillDisappear(_ animated: Bool) {
          super.viewWillDisappear(animated)
          engine?.onDisappear()
        }
      }
    ```

    Make `IntegrateWithUIKit` your initial view controller: open `Main.storyboard`, select the View Controller, and set its Custom Class to `IntegrateWithUIKit` in the Identity inspector. Alternatively, move the code above into the generated `ViewController` class.
  </TabItem>
</Tabs>

The example reads the license from a small `secrets` helper the guides repository ships ([source](https://github.com/imgly/cesdk-swift-examples/blob/v1.83.0-nightly.20260903/secrets/Secrets.swift)); replace `secrets.licenseKey` with your own CE.SDK license key string, or pass `nil` for evaluation mode with a watermark. Because `Engine` is `@MainActor`-isolated, the compiler enforces that every engine call runs on the main thread.

Select the **My Mac (Mac Catalyst)** run destination, then Build and Run. The engine renders your page with the "Hello, CE.SDK!" text on the canvas.

## Using Your App

The canvas displays the scene, but Mac Catalyst has no built-in toolbar or panels — that part is yours to build. Pair the canvas with your own controls, add and configure blocks through the same `engine.block` and `engine.scene` APIs, and export the result with `engine.block.export(_:mimeType:)`. The [Build Your Own UI](../../user-interface/build-your-own-ui.md) guide walks through wiring a toolbar, a property inspector, and export into a complete custom editor.

## Troubleshooting

If you run into issues, here are some common problems and solutions. For additional help, [visit our support page](https://img.ly/company/contact-us).

#### Package Won't Add to Your Mac Catalyst Target

Make sure you added the `IMGLYEngine-swift` package. The `IMGLYUI-swift` package (the prebuilt editor and camera) builds on iOS only and cannot link against a Mac Catalyst target.

#### Import Errors: 'Engine' or 'Canvas' Not Found

Every Swift file that uses the engine needs `import IMGLYEngine` before the first line of code. Confirm the `IMGLYEngine` library is listed under `Frameworks, Libraries, and Embedded Content` on your target's `General` tab.

#### License Key Error at Runtime

Double-check that the license value passed to `Engine(license:userID:)` is the exact key with proper capitalization. If you don't have a license, [register for a free trial](https://img.ly/forms/free-trial) to get a demonstration license. Pass `nil` to run in evaluation mode with a watermark.

#### Canvas Is Blank

`Canvas(engine:)` and the `.metalView(view:)` context both require an engine created with a Metal context. Confirm `engine.scene.create()` ran and that you appended a page to the scene — an empty scene has nothing to render.

## Next Steps

- [Build Your Own UI](../../user-interface/build-your-own-ui.md) — Wire the engine to your own SwiftUI or UIKit controls to build a complete custom editor.
- [Engine Interface](../../engine-interface.md) — Explore the engine's six API namespaces for scenes, blocks, assets, and more.
- [What is CE.SDK?](../../what-is-cesdk.md) — Understand the SDK's architecture and where the engine fits.



---

## More Resources

- **[Mac Catalyst Documentation Index](https://img.ly/docs/cesdk/mac-catalyst/)** - Browse all Mac Catalyst documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/mac-catalyst/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/mac-catalyst/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
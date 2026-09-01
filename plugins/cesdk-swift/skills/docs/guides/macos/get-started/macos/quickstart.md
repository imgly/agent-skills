> This is one page of the CE.SDK macOS documentation. For a complete overview, see the [macOS Documentation Index](https://img.ly/docs/cesdk/macos/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/macos/llms-full.txt).

**Navigation:** [Get Started](../overview.md) > [Quickstart macOS](./quickstart.md)

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

```swift file=@cesdk_swift_examples/engine-guides-integrate-with-appkit/IntegrateWithAppKit.swift reference-only
#if os(macOS)
  import AppKit
  import IMGLYEngine
  import MetalKit

  final class IntegrateWithAppKit: NSViewController {
    private var engine: Engine?
    private lazy var canvas = MTKView(frame: .zero, device: MTLCreateSystemDefaultDevice())
    private lazy var spinner: NSProgressIndicator = {
      let indicator = NSProgressIndicator()
      indicator.style = .spinning
      indicator.translatesAutoresizingMaskIntoConstraints = false
      return indicator
    }()

    override func loadView() {
      view = NSView(frame: .init(x: 0, y: 0, width: 1000, height: 1000))
    }

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
      spinner.startAnimation(nil)
    }

    override func viewDidAppear() {
      super.viewDidAppear()
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
          spinner.stopAnimation(nil)
          spinner.isHidden = true
        } catch {
          print("Engine setup failed: \(error)")
        }
      }
    }

    override func viewWillDisappear() {
      super.viewWillDisappear()
      engine?.onDisappear()
    }
  }

#endif
```

This guide walks you through integrating the CE.SDK Engine into a brand-new macOS app. On macOS you host the engine's canvas inside your own SwiftUI or AppKit view and drive it with the engine APIs — there is no prebuilt editor UI to drop in.

> **Note:** The prebuilt editor and camera (`IMGLYEditor`, `IMGLYCamera`) build on iOS only — CE.SDK does not currently ship a packaged UI like the iOS `IMGLYUI` package for macOS or Mac Catalyst. On macOS, `IMGLYEngine` is the module you integrate: initialize the engine, host its canvas, and build your own controls on top. See the [Engine Interface](../../engine-interface.md) guide for the engine's capabilities and [Build Your Own UI](../../user-interface/build-your-own-ui.md) for a complete custom-editor walkthrough. If you need a packaged UI on these platforms rather than building your own, [get in touch with us](https://img.ly/forms/contact-sales).

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.83.0-nightly.20260901)

## Requirements

To work with the SDK, you'll need:

- A Mac running a recent version of [Xcode](https://developer.apple.com/xcode/)
- A deployment target of macOS 12 or later
- A valid **CE.SDK license key** ([Get a free trial](https://img.ly/forms/free-trial))

## Creating a new Xcode Project

**1.** Launch Xcode and use the `File` menu to select `New` -> `Project...`.

**2.** Select the `macOS` tab, highlight the `App` template, and click `Next`.

**3.** Enter a product name and an organization identifier, and set the language to `Swift`. For the interface, choose `SwiftUI` or, for an AppKit app, `Storyboard` — which scaffolds an `NSViewController` (`ViewController.swift`) to build on. Match the hosting path you'll follow in the Host the Canvas section below, then click `Next`.

**4.** Choose a location to save the project and click `Create`.

## Add the CE.SDK Swift package

**1.** With your Xcode project open, use the `File` menu to select `Add Package Dependencies...`

**2.** Copy the following package URL and paste it into the search field at the top right of the dialog:

https://github.com/imgly/IMGLYEngine-swift

**3.** Once the package resolves, click `Add Package`.

**4.** When Xcode presents the list of libraries, add the `IMGLYEngine` library to your app target, then click `Add Package`.

> **Warning:** On macOS, add the `IMGLYEngine-swift` package — not `IMGLYUI-swift`. The `IMGLYUI` package that powers the prebuilt editor and camera builds on iOS only, so it cannot be added to a macOS target. `IMGLYEngine` ships on both iOS and macOS.

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

  <TabItem label="AppKit">
    Import the SDK:

    ```swift highlight-integrateAppKit-import
      import AppKit
      import IMGLYEngine
      import MetalKit
    ```

    For an AppKit app, own an `MTKView` and hand it to the engine with the `.metalView(view:)` context. Forward `viewDidAppear` / `viewWillDisappear` to `engine.onAppear()` / `engine.onDisappear()` — forward-compatible lifecycle hooks that are no-ops in the engine today but part of the public API:

    ```swift highlight-integrateAppKit-canvas
      final class IntegrateWithAppKit: NSViewController {
        private var engine: Engine?
        private lazy var canvas = MTKView(frame: .zero, device: MTLCreateSystemDefaultDevice())
        private lazy var spinner: NSProgressIndicator = {
          let indicator = NSProgressIndicator()
          indicator.style = .spinning
          indicator.translatesAutoresizingMaskIntoConstraints = false
          return indicator
        }()

        override func loadView() {
          view = NSView(frame: .init(x: 0, y: 0, width: 1000, height: 1000))
        }

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
          spinner.startAnimation(nil)
        }

        override func viewDidAppear() {
          super.viewDidAppear()
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
              spinner.stopAnimation(nil)
              spinner.isHidden = true
            } catch {
              print("Engine setup failed: \(error)")
            }
          }
        }

        override func viewWillDisappear() {
          super.viewWillDisappear()
          engine?.onDisappear()
        }
      }
    ```

    Make `IntegrateWithAppKit` the window's content view controller: open `Main.storyboard`, select the View Controller, and set its Custom Class to `IntegrateWithAppKit` in the Identity inspector. Alternatively, move the code above into the generated `ViewController` class.
  </TabItem>
</Tabs>

The example reads the license from a small `secrets` helper the guides repository ships ([source](https://github.com/imgly/cesdk-swift-examples/blob/v1.83.0-nightly.20260901/secrets/Secrets.swift)); replace `secrets.licenseKey` with your own CE.SDK license key string, or pass `nil` for evaluation mode with a watermark. Because `Engine` is `@MainActor`-isolated, the compiler enforces that every engine call runs on the main thread.

Now Build and Run. The engine renders your page with the "Hello, CE.SDK!" text on the canvas.

## Using Your App

The canvas displays the scene, but macOS has no built-in toolbar or panels — that part is yours to build. Pair the canvas with your own controls, add and configure blocks through the same `engine.block` and `engine.scene` APIs, and export the result with `engine.block.export(_:mimeType:)`. The [Build Your Own UI](../../user-interface/build-your-own-ui.md) guide walks through wiring a toolbar, a property inspector, and export into a complete custom editor.

## Troubleshooting

If you run into issues, here are some common problems and solutions. For additional help, [visit our support page](https://img.ly/company/contact-us).

#### Package Won't Add to Your macOS Target

Make sure you added the `IMGLYEngine-swift` package. The `IMGLYUI-swift` package (the prebuilt editor and camera) builds on iOS only and cannot link against a macOS target.

#### Import Errors: 'Engine' or 'Canvas' Not Found

Every Swift file that uses the engine needs `import IMGLYEngine` before the first line of code. Confirm the `IMGLYEngine` library is listed under `Frameworks, Libraries, and Embedded Content` on your target's `General` tab.

#### License Key Error at Runtime

Double-check that the license value passed to `Engine(license:userID:)` is the exact key with proper capitalization. If you don't have a license, [register for a free trial](https://img.ly/forms/free-trial) to get a demonstration license. Pass `nil` to run in evaluation mode with a watermark.

#### Canvas Is Blank

`Canvas(engine:)` and the `.metalView(view:)` context both require an engine created with a Metal context. Confirm `engine.scene.create()` ran and that you appended a page to the scene — an empty scene has nothing to render.

## Next Steps

- [Build Your Own UI](../../user-interface/build-your-own-ui.md) — Wire the engine to your own SwiftUI or AppKit controls to build a complete custom editor.
- [Engine Interface](../../engine-interface.md) — Explore the engine's six API namespaces for scenes, blocks, assets, and more.
- [What is CE.SDK?](../../what-is-cesdk.md) — Understand the SDK's architecture and where the engine fits.



---

## More Resources

- **[macOS Documentation Index](https://img.ly/docs/cesdk/macos/)** - Browse all macOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/macos/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/macos/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
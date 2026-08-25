> This is one page of the CE.SDK macOS documentation. For a complete overview, see the [macOS Documentation Index](https://img.ly/docs/cesdk/macos/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/macos/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [User Interface](../user-interface.md) > [Build Your Own UI](./build-your-own-ui.md)

---

Build completely custom UIs by driving CE.SDK's Swift engine directly from SwiftUI, UIKit, or AppKit — host the canvas, own the controls, and stay on the engine APIs end to end.

> **Reading time:** 12 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.82.0-nightly.20260825/engine-guides-user-interface-build-your-own-ui)

When you need complete control over the editing experience, the headless engine lets you build entirely custom interfaces. You initialize the engine directly and pair it with your own controls, panels, and workflows that match your application's design system.

```swift file=@cesdk_swift_examples/engine-guides-user-interface-build-your-own-ui/BuildYourOwnUI.swift reference-only
import Foundation
import IMGLYEngine
import SwiftUI

// MARK: - View-model — drives the demo UI and every highlight block

@MainActor
final class BuildYourOwnUIViewModel: ObservableObject {
  @Published private(set) var selectedBlockID: DesignBlockID?
  @Published private(set) var selectedType: String?
  @Published var positionX: Float = 0
  @Published var positionY: Float = 0
  @Published var width: Float = 0
  @Published var height: Float = 0
  @Published var rotationDegrees: Float = 0

  let engine: Engine
  private var pageID: DesignBlockID?
  private var eventTask: Task<Void, Never>?

  init(engine: Engine) {
    self.engine = engine
  }

  deinit { eventTask?.cancel() }

  func setupScene() async {
    do {
      let scene = try engine.scene.create()
      let page = try engine.block.create(.page)
      try engine.block.setWidth(page, value: 800)
      try engine.block.setHeight(page, value: 600)
      try engine.block.appendChild(to: scene, child: page)
      pageID = page

      try createInitialContent(on: page)
      try await engine.scene.zoom(
        to: page,
        paddingLeft: 40,
        paddingTop: 40,
        paddingRight: 40,
        paddingBottom: 40,
      )
      startEventLoop()
    } catch {
      print("Scene setup failed: \(error)")
    }
  }

  private func createInitialContent(on page: DesignBlockID) throws {
    let textBlock = try engine.block.create(.text)
    try engine.block.setString(textBlock, property: "text/text", value: "Click to Edit")
    try engine.block.setPositionX(textBlock, value: 80)
    try engine.block.setPositionY(textBlock, value: 80)
    try engine.block.setWidth(textBlock, value: 300)
    try engine.block.setHeight(textBlock, value: 80)
    try engine.block.appendChild(to: page, child: textBlock)

    let shapeBlock = try engine.block.create(.graphic)
    try engine.block.setShape(shapeBlock, shape: engine.block.createShape(.rect))
    let fill = try engine.block.createFill(.color)
    try engine.block.setColor(fill, property: "fill/color/value", color: .rgba(r: 0.2, g: 0.6, b: 0.9, a: 1))
    try engine.block.setFill(shapeBlock, fill: fill)
    try engine.block.setPositionX(shapeBlock, value: 450)
    try engine.block.setPositionY(shapeBlock, value: 200)
    try engine.block.setWidth(shapeBlock, value: 150)
    try engine.block.setHeight(shapeBlock, value: 150)
    try engine.block.appendChild(to: page, child: shapeBlock)

    try engine.block.select(textBlock)
  }

  private func startEventLoop() {
    // Capture `engine` and reference `self` weakly: a strong `self` held across
    // the `for await` suspension would retain the view-model and its engine for
    // the lifetime of the subscription.
    eventTask = Task { [weak self, engine] in
      for await events in engine.event.subscribe(to: []) {
        self?.refreshSelection(from: events)
      }
    }
  }

  private func refreshSelection(from _: [BlockEvent]) {
    let selected = engine.block.findAllSelected().first
    selectedBlockID = selected
    guard let selected, engine.block.isValid(selected) else {
      selectedType = nil
      return
    }
    do {
      selectedType = try engine.block.getType(selected)
      positionX = try engine.block.getPositionX(selected)
      positionY = try engine.block.getPositionY(selected)
      width = try engine.block.getWidth(selected)
      height = try engine.block.getHeight(selected)
      rotationDegrees = try engine.block.getRotation(selected) * 180 / .pi
    } catch {
      selectedType = nil
    }
  }

  func addText() {
    guard let pageID else { return }
    do {
      let textBlock = try engine.block.create(.text)
      try engine.block.setString(textBlock, property: "text/text", value: "Lorem ipsum dolor sit amet")
      try engine.block.setPositionX(textBlock, value: 80)
      try engine.block.setPositionY(textBlock, value: 80)
      try engine.block.setWidth(textBlock, value: 300)
      try engine.block.setHeight(textBlock, value: 100)
      try engine.block.appendChild(to: pageID, child: textBlock)
      try engine.block.select(textBlock)
    } catch {
      print("Add text failed: \(error)")
    }
  }

  func addShape() {
    guard let pageID else { return }
    do {
      let shapeBlock = try engine.block.create(.graphic)
      try engine.block.setShape(shapeBlock, shape: engine.block.createShape(.rect))
      let fill = try engine.block.createFill(.color)
      try engine.block.setColor(fill, property: "fill/color/value", color: .rgba(r: 0.2, g: 0.6, b: 0.9, a: 1))
      try engine.block.setFill(shapeBlock, fill: fill)
      try engine.block.setPositionX(shapeBlock, value: 80)
      try engine.block.setPositionY(shapeBlock, value: 80)
      try engine.block.setWidth(shapeBlock, value: 150)
      try engine.block.setHeight(shapeBlock, value: 150)
      try engine.block.appendChild(to: pageID, child: shapeBlock)
      try engine.block.select(shapeBlock)
    } catch {
      print("Add shape failed: \(error)")
    }
  }

  func setPositionX(_ value: Float) {
    guard let id = selectedBlockID else { return }
    try? engine.block.setPositionX(id, value: value)
  }

  func setPositionY(_ value: Float) {
    guard let id = selectedBlockID else { return }
    try? engine.block.setPositionY(id, value: value)
  }

  func setWidth(_ value: Float) {
    guard let id = selectedBlockID else { return }
    try? engine.block.setWidth(id, value: value)
  }

  func setHeight(_ value: Float) {
    guard let id = selectedBlockID else { return }
    try? engine.block.setHeight(id, value: value)
  }

  func setRotationDegrees(_ value: Float) {
    guard let id = selectedBlockID else { return }
    try? engine.block.setRotation(id, radians: value * .pi / 180)
  }

  func export() async -> Data? {
    guard let pageID else { return nil }
    return try? await engine.block.export(pageID, mimeType: .png)
  }
}

// MARK: - The view — Canvas on top, controls below

struct BuildYourOwnUIView: View {
  @StateObject private var viewModel: BuildYourOwnUIViewModel

  init(engine: Engine) {
    _viewModel = StateObject(wrappedValue: BuildYourOwnUIViewModel(engine: engine))
  }

  var body: some View {
    VStack(spacing: 0) {
      Canvas(engine: viewModel.engine)
        .frame(maxWidth: .infinity, maxHeight: .infinity)
      Divider()
      controls
        .padding()
        .background(Color(white: 0.95))
    }
    .onAppear {
      Task { await viewModel.setupScene() }
    }
  }

  private var controls: some View {
    VStack(alignment: .leading, spacing: 12) {
      HStack {
        Button("Add Text") { viewModel.addText() }
        Button("Add Shape") { viewModel.addShape() }
        Spacer()
        Button("Export PNG") {
          Task { _ = await viewModel.export() }
        }
      }

      if viewModel.selectedBlockID != nil {
        Text("Selected: \(viewModel.selectedType ?? "—")")
          .font(.caption)
          .foregroundColor(.secondary)

        propertyRow("X", value: $viewModel.positionX, in: 0 ... 800, onChange: viewModel.setPositionX)
        propertyRow("Y", value: $viewModel.positionY, in: 0 ... 600, onChange: viewModel.setPositionY)
        propertyRow("W", value: $viewModel.width, in: 1 ... 800, onChange: viewModel.setWidth)
        propertyRow("H", value: $viewModel.height, in: 1 ... 600, onChange: viewModel.setHeight)
        propertyRow(
          "Rot°",
          value: $viewModel.rotationDegrees,
          in: -180 ... 180,
          onChange: viewModel.setRotationDegrees,
        )
      } else {
        Text("Tap a block on the canvas to edit its properties.")
          .font(.caption)
          .foregroundColor(.secondary)
      }
    }
  }

  private func propertyRow(
    _ label: String,
    value: Binding<Float>,
    in range: ClosedRange<Float>,
    onChange: @escaping (Float) -> Void,
  ) -> some View {
    HStack {
      Text(label).font(.caption).frame(width: 36, alignment: .leading)
      Slider(value: value, in: range) { editing in
        if !editing {
          onChange(value.wrappedValue)
        }
      }
      Text("\(Int(value.wrappedValue))")
        .font(.caption.monospacedDigit())
        .frame(width: 44, alignment: .trailing)
    }
  }
}

// MARK: - Minimal Canvas host used in "Initialize Engine and Setup Canvas"

struct MinimalCanvasView: View {
  @State private var engine: Engine?

  var body: some View {
    Group {
      if let engine {
        Canvas(engine: engine)
      } else {
        ProgressView("Initializing engine…")
      }
    }
    .onAppear {
      Task {
        engine = try? await Engine(
          license: secrets.licenseKey, // pass nil for evaluation mode with watermark
          userID: "<your unique user id>",
        )
      }
    }
  }
}

// MARK: - UIKit and AppKit hosts — for apps that own their own MTKView

#if canImport(UIKit) && !os(watchOS)
  import MetalKit
  import UIKit

  final class BuildYourOwnUIController: UIViewController {
    private var engine: Engine?
    private lazy var canvas = MTKView(frame: .zero, device: MTLCreateSystemDefaultDevice())

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
    }

    override func viewDidAppear(_ animated: Bool) {
      super.viewDidAppear(animated)
      Task {
        engine = try await Engine(
          context: .metalView(view: canvas),
          license: secrets.licenseKey, // pass nil for evaluation mode with watermark
          userID: "<your unique user id>",
        )
        engine?.onAppear()
      }
    }

    override func viewWillDisappear(_ animated: Bool) {
      super.viewWillDisappear(animated)
      engine?.onDisappear()
    }
  }
#endif

#if canImport(AppKit) && !targetEnvironment(macCatalyst)
  import AppKit
  import MetalKit

  final class BuildYourOwnUIControllerMac: NSViewController {
    private var engine: Engine?
    private lazy var canvas = MTKView(frame: .zero, device: MTLCreateSystemDefaultDevice())

    override func loadView() {
      view = NSView(frame: .init(x: 0, y: 0, width: 1000, height: 700))
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
    }

    override func viewDidAppear() {
      super.viewDidAppear()
      Task {
        engine = try await Engine(
          context: .metalView(view: canvas),
          license: secrets.licenseKey, // pass nil for evaluation mode with watermark
          userID: "<your unique user id>",
        )
        engine?.onAppear()
      }
    }

    override func viewWillDisappear() {
      super.viewWillDisappear()
      engine?.onDisappear()
    }
  }
#endif

// MARK: - #Preview — boot a real engine in evaluation mode

#if DEBUG
  /// Live preview that boots a real engine in evaluation mode so the file
  /// can be exercised inside Xcode without launching a host app.
  /// Requires Xcode 15+ for the `#Preview` macro.
  @available(iOS 17, macOS 14, *)
  #Preview {
    BuildYourOwnUIPreview()
  }

  /// `#Preview` bodies cannot host async initialization directly on the
  /// iOS 14 / macOS 11 deployment targets the package supports, so the
  /// preview body uses `.onAppear` instead of `.task`.
  private struct BuildYourOwnUIPreview: View {
    @State private var engine: Engine?

    var body: some View {
      Group {
        if let engine {
          BuildYourOwnUIView(engine: engine)
        } else {
          ProgressView("Booting engine…")
        }
      }
      .onAppear {
        Task {
          engine = try? await Engine(
            license: nil, // evaluation mode with watermark — fine for previews
            userID: "<your unique user id>",
          )
        }
      }
    }
  }
#endif

// MARK: - Test-runnable entry point

/// Drives every code path that `BuildYourOwnUIView` exercises against a
/// shared offscreen test engine — `setupScene`, the event loop, intent
/// methods on the view-model, and the export call. Verifies that the
/// rendered guide's highlights stay runtime-correct without spinning up
/// a SwiftUI view.
@MainActor
func buildYourOwnUI(engine: Engine) async throws {
  let viewModel = BuildYourOwnUIViewModel(engine: engine)
  await viewModel.setupScene()

  viewModel.addText()
  viewModel.addShape()

  viewModel.setPositionX(120)
  viewModel.setPositionY(140)
  viewModel.setRotationDegrees(15)

  let png = await viewModel.export()
  print("Exported \(png?.count ?? 0) bytes")
}
```

This guide covers initializing the engine, hosting its canvas in SwiftUI, subscribing to events, building interactive controls, and exporting designs — all while keeping the user experience yours.

## Architecture Overview

The headless engine separates rendering from UI. Your code calls methods like `engine.block.create(.text)` and `engine.block.setPositionX(_:value:)` to manipulate the design; the engine notifies you of changes through `engine.event.subscribe(to:)`. The view-model in the bundled example demonstrates this shape — it owns the engine, subscribes to events, and republishes block state as `@Published` properties for SwiftUI to observe.

```swift highlight-buildYourOwnUI-viewModel
@MainActor
final class BuildYourOwnUIViewModel: ObservableObject {
  @Published private(set) var selectedBlockID: DesignBlockID?
  @Published private(set) var selectedType: String?
  @Published var positionX: Float = 0
  @Published var positionY: Float = 0
  @Published var width: Float = 0
  @Published var height: Float = 0
  @Published var rotationDegrees: Float = 0

  let engine: Engine
  private var pageID: DesignBlockID?
  private var eventTask: Task<Void, Never>?

  init(engine: Engine) {
    self.engine = engine
  }

  deinit { eventTask?.cancel() }
```

`Engine` is `@MainActor`-isolated, so the compiler enforces that all engine calls run on the main thread.

## Initialize Engine and Setup Canvas

`Engine(context:audioContext:license:userID:)` constructs an engine. Pick the context that matches how you want to render:

| Context | When to use |
| --- | --- |
| `.metal` | Default for SwiftUI. The engine creates its own Metal view; `IMGLYEngine.Canvas` hosts it inside your view hierarchy. |
| `.metalView(view:)` | Bind the engine to an `MTKView` your view controller already owns. Covered under [Framework Integration Patterns](./build-your-own-ui.md#framework-integration-patterns). |
| `.offscreen(size:)` | Headless rendering for export-only workflows with no visible canvas. |

For a custom SwiftUI editor, `.metal` plus `IMGLYEngine.Canvas(engine:)` is the canonical shape — and since `.metal` is the default for `context:`, the parameter can be omitted entirely. `Canvas` adopts the engine's Metal view into your hierarchy and forwards `onAppear` / `onDisappear` to the engine. The hooks are no-ops today but are part of the public engine API; calling them keeps your integration future-proof if the engine starts using them.

```swift highlight-buildYourOwnUI-canvasView
struct MinimalCanvasView: View {
  @State private var engine: Engine?

  var body: some View {
    Group {
      if let engine {
        Canvas(engine: engine)
      } else {
        ProgressView("Initializing engine…")
      }
    }
    .onAppear {
      Task {
        engine = try? await Engine(
          license: secrets.licenseKey, // pass nil for evaluation mode with watermark
          userID: "<your unique user id>",
        )
      }
    }
  }
}
```

The minimal host above is the smallest viable shape. Wrap or compose `MinimalCanvasView` with your own toolbars, inspectors, and sidebars to build the surrounding UI. The remainder of this guide walks through that pairing.

## Create Initial Content

Seed the scene with a page that defines the workspace dimensions, then add a text block and a shape so the user has something to interact with on launch. The same APIs (`engine.scene.create`, `engine.block.create`, the setters that follow) are used for both initial content and content the user adds later.

```swift highlight-buildYourOwnUI-setup
  func setupScene() async {
    do {
      let scene = try engine.scene.create()
      let page = try engine.block.create(.page)
      try engine.block.setWidth(page, value: 800)
      try engine.block.setHeight(page, value: 600)
      try engine.block.appendChild(to: scene, child: page)
      pageID = page

      try createInitialContent(on: page)
      try await engine.scene.zoom(
        to: page,
        paddingLeft: 40,
        paddingTop: 40,
        paddingRight: 40,
        paddingBottom: 40,
      )
      startEventLoop()
    } catch {
      print("Scene setup failed: \(error)")
    }
  }
```

```swift highlight-buildYourOwnUI-createInitialContent
  private func createInitialContent(on page: DesignBlockID) throws {
    let textBlock = try engine.block.create(.text)
    try engine.block.setString(textBlock, property: "text/text", value: "Click to Edit")
    try engine.block.setPositionX(textBlock, value: 80)
    try engine.block.setPositionY(textBlock, value: 80)
    try engine.block.setWidth(textBlock, value: 300)
    try engine.block.setHeight(textBlock, value: 80)
    try engine.block.appendChild(to: page, child: textBlock)

    let shapeBlock = try engine.block.create(.graphic)
    try engine.block.setShape(shapeBlock, shape: engine.block.createShape(.rect))
    let fill = try engine.block.createFill(.color)
    try engine.block.setColor(fill, property: "fill/color/value", color: .rgba(r: 0.2, g: 0.6, b: 0.9, a: 1))
    try engine.block.setFill(shapeBlock, fill: fill)
    try engine.block.setPositionX(shapeBlock, value: 450)
    try engine.block.setPositionY(shapeBlock, value: 200)
    try engine.block.setWidth(shapeBlock, value: 150)
    try engine.block.setHeight(shapeBlock, value: 150)
    try engine.block.appendChild(to: page, child: shapeBlock)

    try engine.block.select(textBlock)
  }
```

Graphic blocks need both a shape (`createShape(.rect)`) and a fill (`createFill(.color)`) before they render. Text blocks render their default string immediately and are styled later via property setters.

## Handle Engine Events

Subscribe to block lifecycle events to keep your UI synchronized with the engine. The event API delivers `Created`, `Updated`, and `Destroyed` notifications, batched at the end of each engine update cycle. Pass `[]` to receive every event or an array of `DesignBlockID`s to scope the subscription.

```swift highlight-buildYourOwnUI-handleEvents
  private func startEventLoop() {
    // Capture `engine` and reference `self` weakly: a strong `self` held across
    // the `for await` suspension would retain the view-model and its engine for
    // the lifetime of the subscription.
    eventTask = Task { [weak self, engine] in
      for await events in engine.event.subscribe(to: []) {
        self?.refreshSelection(from: events)
      }
    }
  }

  private func refreshSelection(from _: [BlockEvent]) {
    let selected = engine.block.findAllSelected().first
    selectedBlockID = selected
    guard let selected, engine.block.isValid(selected) else {
      selectedType = nil
      return
    }
    do {
      selectedType = try engine.block.getType(selected)
      positionX = try engine.block.getPositionX(selected)
      positionY = try engine.block.getPositionY(selected)
      width = try engine.block.getWidth(selected)
      height = try engine.block.getHeight(selected)
      rotationDegrees = try engine.block.getRotation(selected) * 180 / .pi
    } catch {
      selectedType = nil
    }
  }
```

By republishing the selected block's properties through `@Published`, the view-model lets SwiftUI re-render the property panel on every selection change and every external mutation — the binding is bidirectional and event-driven.

## Build Custom UI Controls

The view holds the view-model in `@StateObject`, hands it an engine on init, and lays the canvas above the controls in a vertical stack. `setupScene()` runs once on appear to build the scene and start the event loop — the same lifecycle pattern `MinimalCanvasView` used, scaled up with a real sidebar.

```swift highlight-buildYourOwnUI-view
struct BuildYourOwnUIView: View {
  @StateObject private var viewModel: BuildYourOwnUIViewModel

  init(engine: Engine) {
    _viewModel = StateObject(wrappedValue: BuildYourOwnUIViewModel(engine: engine))
  }

  var body: some View {
    VStack(spacing: 0) {
      Canvas(engine: viewModel.engine)
        .frame(maxWidth: .infinity, maxHeight: .infinity)
      Divider()
      controls
        .padding()
        .background(Color(white: 0.95))
    }
    .onAppear {
      Task { await viewModel.setupScene() }
    }
  }
```

The sidebar itself is the toolbar and property inspector. Each control calls back into the view-model's intent methods; the view-model rewrites the engine, the engine fires an event, the event loop refreshes the published state, and the controls pick up the new values. The whole flow is one closed loop and works the same way for a `Button`, a `Slider`, or any other SwiftUI input.

```swift highlight-buildYourOwnUI-uiControls
  private var controls: some View {
    VStack(alignment: .leading, spacing: 12) {
      HStack {
        Button("Add Text") { viewModel.addText() }
        Button("Add Shape") { viewModel.addShape() }
        Spacer()
        Button("Export PNG") {
          Task { _ = await viewModel.export() }
        }
      }

      if viewModel.selectedBlockID != nil {
        Text("Selected: \(viewModel.selectedType ?? "—")")
          .font(.caption)
          .foregroundColor(.secondary)

        propertyRow("X", value: $viewModel.positionX, in: 0 ... 800, onChange: viewModel.setPositionX)
        propertyRow("Y", value: $viewModel.positionY, in: 0 ... 600, onChange: viewModel.setPositionY)
        propertyRow("W", value: $viewModel.width, in: 1 ... 800, onChange: viewModel.setWidth)
        propertyRow("H", value: $viewModel.height, in: 1 ... 600, onChange: viewModel.setHeight)
        propertyRow(
          "Rot°",
          value: $viewModel.rotationDegrees,
          in: -180 ... 180,
          onChange: viewModel.setRotationDegrees,
        )
      } else {
        Text("Tap a block on the canvas to edit its properties.")
          .font(.caption)
          .foregroundColor(.secondary)
      }
    }
  }

  private func propertyRow(
    _ label: String,
    value: Binding<Float>,
    in range: ClosedRange<Float>,
    onChange: @escaping (Float) -> Void,
  ) -> some View {
    HStack {
      Text(label).font(.caption).frame(width: 36, alignment: .leading)
      Slider(value: value, in: range) { editing in
        if !editing {
          onChange(value.wrappedValue)
        }
      }
      Text("\(Int(value.wrappedValue))")
        .font(.caption.monospacedDigit())
        .frame(width: 44, alignment: .trailing)
    }
  }
```

The toolbar lives below the canvas in this example so portrait iPhones still get a usably-sized canvas. On macOS and Mac Catalyst the same vertical layout reads naturally; you can also adapt the layout per size class with `HStack` on regular widths.

## Add Blocks Programmatically

Add new content by calling `engine.block.create(_:)` with the block type you want, configuring its properties, and appending it to the page hierarchy. The example demonstrates text and graphic blocks; other block types (`.audio`, `.video`) follow the same create-configure-append shape but require additional setup such as URL loading and AV resource preparation.

```swift highlight-buildYourOwnUI-addBlocks
  func addText() {
    guard let pageID else { return }
    do {
      let textBlock = try engine.block.create(.text)
      try engine.block.setString(textBlock, property: "text/text", value: "Lorem ipsum dolor sit amet")
      try engine.block.setPositionX(textBlock, value: 80)
      try engine.block.setPositionY(textBlock, value: 80)
      try engine.block.setWidth(textBlock, value: 300)
      try engine.block.setHeight(textBlock, value: 100)
      try engine.block.appendChild(to: pageID, child: textBlock)
      try engine.block.select(textBlock)
    } catch {
      print("Add text failed: \(error)")
    }
  }

  func addShape() {
    guard let pageID else { return }
    do {
      let shapeBlock = try engine.block.create(.graphic)
      try engine.block.setShape(shapeBlock, shape: engine.block.createShape(.rect))
      let fill = try engine.block.createFill(.color)
      try engine.block.setColor(fill, property: "fill/color/value", color: .rgba(r: 0.2, g: 0.6, b: 0.9, a: 1))
      try engine.block.setFill(shapeBlock, fill: fill)
      try engine.block.setPositionX(shapeBlock, value: 80)
      try engine.block.setPositionY(shapeBlock, value: 80)
      try engine.block.setWidth(shapeBlock, value: 150)
      try engine.block.setHeight(shapeBlock, value: 150)
      try engine.block.appendChild(to: pageID, child: shapeBlock)
      try engine.block.select(shapeBlock)
    } catch {
      print("Add shape failed: \(error)")
    }
  }
```

Each intent method demonstrates the recipe: create the block, configure its properties, append it to the page, and select it for immediate editing. The toolbar's "Add Text" and "Add Shape" buttons hand the user direct access to these flows.

## Create Property Panels

The property panel binds the selected block's position, size, and rotation to real `Slider` controls. The view-model's `@Published` properties hold the current values; the `Slider`'s `onEditingChanged` callback writes them back to the engine.

```swift highlight-buildYourOwnUI-propertyPanel
  func setPositionX(_ value: Float) {
    guard let id = selectedBlockID else { return }
    try? engine.block.setPositionX(id, value: value)
  }

  func setPositionY(_ value: Float) {
    guard let id = selectedBlockID else { return }
    try? engine.block.setPositionY(id, value: value)
  }

  func setWidth(_ value: Float) {
    guard let id = selectedBlockID else { return }
    try? engine.block.setWidth(id, value: value)
  }

  func setHeight(_ value: Float) {
    guard let id = selectedBlockID else { return }
    try? engine.block.setHeight(id, value: value)
  }

  func setRotationDegrees(_ value: Float) {
    guard let id = selectedBlockID else { return }
    try? engine.block.setRotation(id, radians: value * .pi / 180)
  }
```

`setRotation(_:radians:)` takes radians; the view-model converts the slider's `Float` degrees to radians before calling into the engine. The view-model's `refreshSelection` does the reverse conversion when the engine reports a new rotation, so the slider always shows degrees.

## Export Designs

Export a block (or the entire scene) with `engine.block.export(_:mimeType:)`. The call is async and returns raw `Data` you can write to disk, hand to a share sheet, or upload to your backend.

```swift highlight-buildYourOwnUI-export
func export() async -> Data? {
  guard let pageID else { return nil }
  return try? await engine.block.export(pageID, mimeType: .png)
}
```

The example exports the page as PNG. Pass a different `MIMEType` (`.jpeg`, `.webp`, `.pdf`) to export the same block in another format — the rest of the call stays the same.

## Framework Integration Patterns

`IMGLYEngine.Canvas` is the default SwiftUI integration: it owns the underlying Metal view and forwards `onAppear` / `onDisappear` to the engine for you. For apps that already own their own `MTKView` — typically UIKit and AppKit hosts — initialize the engine with `Engine.Context.metalView(view:)` and the engine binds to your existing view instead of creating its own.

```swift highlight-buildYourOwnUI-uikitHost
  final class BuildYourOwnUIController: UIViewController {
    private var engine: Engine?
    private lazy var canvas = MTKView(frame: .zero, device: MTLCreateSystemDefaultDevice())

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
    }

    override func viewDidAppear(_ animated: Bool) {
      super.viewDidAppear(animated)
      Task {
        engine = try await Engine(
          context: .metalView(view: canvas),
          license: secrets.licenseKey, // pass nil for evaluation mode with watermark
          userID: "<your unique user id>",
        )
        engine?.onAppear()
      }
    }

    override func viewWillDisappear(_ animated: Bool) {
      super.viewWillDisappear(animated)
      engine?.onDisappear()
    }
  }
```

```swift highlight-buildYourOwnUI-appkitHost
  final class BuildYourOwnUIControllerMac: NSViewController {
    private var engine: Engine?
    private lazy var canvas = MTKView(frame: .zero, device: MTLCreateSystemDefaultDevice())

    override func loadView() {
      view = NSView(frame: .init(x: 0, y: 0, width: 1000, height: 700))
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
    }

    override func viewDidAppear() {
      super.viewDidAppear()
      Task {
        engine = try await Engine(
          context: .metalView(view: canvas),
          license: secrets.licenseKey, // pass nil for evaluation mode with watermark
          userID: "<your unique user id>",
        )
        engine?.onAppear()
      }
    }

    override func viewWillDisappear() {
      super.viewWillDisappear()
      engine?.onDisappear()
    }
  }
```

The UIKit and AppKit patterns are mirror images of each other — own an `MTKView`, hand it to the engine, call `engine.onAppear()` / `engine.onDisappear()` from `viewDidAppear` / `viewWillDisappear` to keep your integration future-proof. The hooks are no-ops in the engine today but are part of the public API and may track lifecycle events in a future release; `IMGLYEngine.Canvas` already calls them for you in SwiftUI. The engine, the event loop, and the intent methods (`addText`, `setPositionX`, `export`, …) are framework-agnostic and carry over to a `UIViewController` or `NSViewController`. `BuildYourOwnUIViewModel` exposes its reactive state through Combine — `ObservableObject` and `@Published` are Combine types that SwiftUI consumes natively via `@StateObject` — so a UIKit or AppKit host can subscribe to the same publishers via Combine's `.sink { ... }` to update `UISlider` / `NSSlider`, and call the intent methods from `valueChanged` selectors instead of SwiftUI's `onEditingChanged` closures.

## Troubleshooting

### Canvas Not Rendering

**Problem:** The Metal view appears but shows no content.

**Solution:** Confirm the engine was initialized with `.metal` (or `.metalView(view:)`) and that `engine.scene.create()` ran. `IMGLYEngine.Canvas` requires one of those two contexts — `.offscreen(size:)` has no view to render.

### Events Not Firing

**Problem:** The property panel doesn't update when blocks change.

**Solution:** Ensure the `for await events in engine.event.subscribe(to: [])` loop is running inside a long-lived `Task`. The view-model owns the task in `eventTask` and cancels it on `deinit`; if you re-create the view-model on every render the subscription gets torn down before any event fires.

### Performance Issues

**Problem:** Slider drags feel sluggish.

**Solution:** Write back to the engine on `onEditingChanged` (when the drag ends) instead of on every interim value, as the example does. Continuous updates fire one engine event per pixel and can saturate the main actor.

### Blocks Not Responding

**Problem:** Newly created blocks don't appear.

**Solution:** Confirm the block was appended to the scene hierarchy with `engine.block.appendChild(to:child:)`. Blocks created with `engine.block.create(_:)` are detached until appended.

### Selection State Out of Sync

**Problem:** The property panel shows stale values.

**Solution:** Use `engine.block.select(_:)` (single-select) or `engine.block.setSelected(_:selected:)` (toggle). The view-model reads selection via `engine.block.findAllSelected()` whenever an event arrives, so explicit selection changes flow through the same path as user taps on the canvas.

## API Reference

| Method | Category | Purpose |
| --- | --- | --- |
| `Engine(context:audioContext:license:userID:)` | Engine | Initialize the engine on the main actor. |
| `Engine.Context.metal` | Engine | Let the engine create its own Metal view (use with `IMGLYEngine.Canvas`). |
| `Engine.Context.metalView(view:)` | Engine | Bind the engine to an `MTKView` your view controller already owns. |
| `Engine.Context.offscreen(size:)` | Engine | Headless rendering for export-only workflows. |
| `engine.onAppear()` / `engine.onDisappear()` | Engine | Forward-compatibility lifecycle hooks for UIKit / AppKit hosts. No-op in the engine today; `IMGLYEngine.Canvas` calls them automatically in SwiftUI. |
| `IMGLYEngine.Canvas(engine:isPaused:)` | SwiftUI | A `View` that hosts the engine's Metal canvas. |
| `engine.scene.create()` | Scene | Create a new blank scene. |
| `engine.scene.zoom(to:paddingLeft:paddingTop:paddingRight:paddingBottom:)` | Scene | Zoom the viewport to a block. |
| `engine.block.create(_:)` | Block | Create a new block of the given `DesignBlockType`. |
| `engine.block.appendChild(to:child:)` | Block | Add a block to the scene hierarchy. |
| `engine.block.select(_:)` / `setSelected(_:selected:)` | Block | Select a block (single / toggle). |
| `engine.block.findAllSelected()` | Block | List currently selected blocks. |
| `engine.block.setPositionX/Y(_:value:)` | Block | Set the block's x or y position. |
| `engine.block.setWidth/Height(_:value:)` | Block | Set the block's width or height. |
| `engine.block.setRotation(_:radians:)` | Block | Set the block's rotation in radians. |
| `engine.block.getType(_:)` | Block | Read the block's type as a string. |
| `engine.block.setString(_:property:value:)` | Block | Write a string property (e.g. `text/text`). |
| `engine.block.setColor(_:property:color:)` | Block | Write a color property (e.g. `fill/color/value`). |
| `engine.block.createShape(_:)` / `setShape(_:shape:)` | Block | Create and attach a shape to a graphic block. |
| `engine.block.createFill(_:)` / `setFill(_:fill:)` | Block | Create and attach a fill to a graphic block. |
| `engine.block.export(_:mimeType:)` | Block | Export a block (or scene) to `Data`. |
| `engine.event.subscribe(to:)` | Event | `AsyncStream` of block lifecycle events. |

## Next Steps

- [Engine Interface](../engine-interface.md) — Deep dive into headless engine concepts&#x20;
- [Blocks](../concepts/blocks.md) — Understanding block types and hierarchy
- [Export Designs](../export-save-publish/export.md) — Export options and formats



---

## More Resources

- **[macOS Documentation Index](https://img.ly/docs/cesdk/macos/)** - Browse all macOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/macos/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/macos/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
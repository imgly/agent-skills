> This is one page of the CE.SDK iOS documentation. For a complete overview, see the [iOS Documentation Index](https://img.ly/docs/cesdk/ios/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/ios/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [User Interface](../../user-interface.md) > [UI Extensions](../ui-extensions.md) > [Create Custom Panel](./create-custom-panel.md)

---

```swift file=@cesdk_swift_examples/editor-guides-ui-extensions-create-custom-panel/CreateCustomPanelSolution.swift reference-only
import IMGLYEditor
import IMGLYEngine
import SwiftUI

/// Demonstrates how to build a functional custom panel — a property editor that opens
/// from an inspector bar button, edits the selected block, and writes changes back to the scene.
///
/// The `body` uses `demoEditor`, which extends the same `GuideEditorConfiguration` as the
/// highlighted `editor` lesson and adds the minimum the showcase needs: a pre-selected
/// graphic block so the inspector bar and panel have content to edit.
struct CreateCustomPanelSolution: View {
  let settings = EngineSettings(license: secrets.licenseKey, // pass nil for evaluation mode with watermark
                                userID: "<your unique user id>")

  var editor: some View {
    Editor(settings)
      .imgly.configuration {
        GuideEditorConfiguration { builder in
          builder.inspectorBar { inspectorBar in
            inspectorBar.items { _ in
              InspectorBar.Button(id: "open_property_panel") { context in
                let block = context.selection.block
                context.eventHandler.send(.openSheet(style: .default(), content: {
                  PropertyPanel(
                    engine: context.engine,
                    block: block,
                    eventHandler: context.eventHandler,
                  )
                }))
              } label: { _ in
                Label("Properties", systemImage: "slider.horizontal.3")
              }
            }
          }
        }
      }
  }

  // Extends the lesson with a pre-selected block so the showcase opens with the inspector
  // bar visible. The default `onCreate` builds the 1080×1080 scene; the block is created and
  // selected in `onLoaded` because a selection set in `onCreate` is cleared by the load flow.
  private var demoEditor: some View {
    Editor(settings)
      .imgly.configuration {
        GuideEditorConfiguration { builder in
          builder.inspectorBar { inspectorBar in
            inspectorBar.items { _ in
              InspectorBar.Button(id: "open_property_panel") { context in
                let block = context.selection.block
                context.eventHandler.send(.openSheet(style: .default(), content: {
                  PropertyPanel(
                    engine: context.engine,
                    block: block,
                    eventHandler: context.eventHandler,
                  )
                }))
              } label: { _ in
                Label("Properties", systemImage: "slider.horizontal.3")
              }
            }
          }
          builder.onLoaded { context, _ in
            let engine = context.engine
            guard let page = try engine.scene.getCurrentPage() else { return }
            let banner = try engine.block.create(.graphic)
            try engine.block.setShape(banner, shape: engine.block.createShape(.rect))
            let fill = try engine.block.createFill(.color)
            try engine.block.setColor(fill, property: "fill/color/value", color: .rgba(r: 0.23, g: 0.51, b: 0.96, a: 1))
            try engine.block.setFill(banner, fill: fill)
            try engine.block.setName(banner, name: "Banner")
            try engine.block.setWidth(banner, value: 720)
            try engine.block.setHeight(banner, value: 480)
            try engine.block.setPositionX(banner, value: 180)
            try engine.block.setPositionY(banner, value: 300)
            try engine.block.appendChild(to: page, child: banner)
            try engine.block.setSelected(banner, selected: true)
          }
        }
      }
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

struct PropertyPanel: View {
  let engine: Engine
  let block: DesignBlockID
  let eventHandler: EditorEventHandler

  @State private var name: String
  @State private var opacity: Float

  init(engine: Engine, block: DesignBlockID, eventHandler: EditorEventHandler) {
    self.engine = engine
    self.block = block
    self.eventHandler = eventHandler
    _name = State(initialValue: (try? engine.block.getName(block)) ?? "")
    _opacity = State(initialValue: (try? engine.block.getOpacity(block)) ?? 1)
  }

  var body: some View {
    NavigationStack {
      Form {
        HStack {
          Text("Name")
          Spacer()
          TextField("Block name", text: $name)
            .multilineTextAlignment(.trailing)
        }
        VStack(alignment: .leading, spacing: 8) {
          HStack {
            Text("Opacity")
            Spacer()
            Text("\(Int(opacity * 100))%")
              .foregroundStyle(.secondary)
          }
          Slider(value: $opacity, in: 0 ... 1)
        }
      }
      .navigationTitle("Properties")
      .navigationBarTitleDisplayMode(.inline)
      .toolbar {
        ToolbarItem(placement: .confirmationAction) {
          Button("Done") {
            try? engine.block.setName(block, name: name)
            try? engine.block.setOpacity(block, value: opacity)
            eventHandler.send(.closeSheet)
          }
        }
      }
    }
  }
}

#Preview {
  CreateCustomPanelSolution()
}
```

Build a functional custom panel — a property editor that opens from an inspector bar button, edits the selected block, and writes changes back to the scene.

![iOS editor with a custom property panel](https://img.ly/docs/cesdk/ios/user-interface/ui-extensions/create-custom-panel-d87b83/assets/ios.hero.webp)

> **Reading time:** 6 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.83.0-nightly.20260901/editor-guides-ui-extensions-create-custom-panel)

## Overview

Custom panels on iOS are editor sheets whose content you build with native SwiftUI. You present your own view and wire it to the engine directly — there is no panel registration step and no component catalog. This guide builds a property editor: a button in the inspector bar opens a sheet that edits the selected block's name and opacity.

The example builds on `GuideEditorConfiguration`, a small helper the [iOS examples repository](https://github.com/imgly/cesdk-swift-examples/blob/v1.83.0-nightly.20260901/editor-guides-quickstart/GuideEditorConfiguration.swift) ships as a minimal editor baseline (close, undo, and redo). Substitute your own editor configuration — the `inspectorBar` builder is exposed on every configuration. The [Configuration](../../configuration.md) guide covers how `EditorConfiguration` and `EngineSettings` set up the editor as a whole, and the [Panel](../customization/panel.md) guide covers the sheet mechanism — sheet types, presentation styles, and the built-in sheets — that this guide builds on.

## Opening the Panel from the Inspector Bar

The inspector bar is the surface the editor shows for the current selection, which makes it the natural home for a panel that edits the selected block. Add an inspector bar button whose action opens the sheet. The action receives an `InspectorBar.Context`, which exposes the `engine`, the `eventHandler`, and the current `selection`. Read the selected block from `context.selection.block`, then present your content with `openSheet(style:content:)`. The `content` closure returns any SwiftUI view — here a `PropertyPanel` (defined below).

```swift highlight-createCustomPanel-inspectorButton
builder.inspectorBar { inspectorBar in
  inspectorBar.items { _ in
    InspectorBar.Button(id: "open_property_panel") { context in
      let block = context.selection.block
      context.eventHandler.send(.openSheet(style: .default(), content: {
        PropertyPanel(
          engine: context.engine,
          block: block,
          eventHandler: context.eventHandler,
        )
      }))
    } label: { _ in
      Label("Properties", systemImage: "slider.horizontal.3")
    }
  }
}
```

- `inspectorBar.items` **replaces** the inspector bar's contents. `GuideEditorConfiguration` starts with an empty inspector bar, so this sets the single button; include any other items your app needs in the same closure.
- A panel that isn't tied to a selection — like the built-in sheets — fits a `Dock.Button` instead. See [Add a New Button](./add-new-button.md) for both surfaces.
- `.default()` presents a standard resizable sheet. The [Panel](../customization/panel.md) guide documents the other `SheetStyle` options.

## Building the Panel Content

Panel content is a regular SwiftUI view. Because the `openSheet` `content:` parameter is a `@ViewBuilder`, panel-local `@State` lives in a dedicated `View` — here `PropertyPanel`. Its initializer seeds the state from the selected block with `getName` and `getOpacity`, so the controls open showing the block's current values. A `Form` supplies native controls — a `TextField` for the name and a `Slider` for the opacity — and `navigationTitle` gives the sheet its heading.

```swift highlight-createCustomPanel-panelContent
struct PropertyPanel: View {
  let engine: Engine
  let block: DesignBlockID
  let eventHandler: EditorEventHandler

  @State private var name: String
  @State private var opacity: Float

  init(engine: Engine, block: DesignBlockID, eventHandler: EditorEventHandler) {
    self.engine = engine
    self.block = block
    self.eventHandler = eventHandler
    _name = State(initialValue: (try? engine.block.getName(block)) ?? "")
    _opacity = State(initialValue: (try? engine.block.getOpacity(block)) ?? 1)
  }

  var body: some View {
    NavigationStack {
      Form {
        HStack {
          Text("Name")
          Spacer()
          TextField("Block name", text: $name)
            .multilineTextAlignment(.trailing)
        }
        VStack(alignment: .leading, spacing: 8) {
          HStack {
            Text("Opacity")
            Spacer()
            Text("\(Int(opacity * 100))%")
              .foregroundStyle(.secondary)
          }
          Slider(value: $opacity, in: 0 ... 1)
        }
      }
      .navigationTitle("Properties")
      .navigationBarTitleDisplayMode(.inline)
      .toolbar {
        ToolbarItem(placement: .confirmationAction) {
          Button("Done") {
            try? engine.block.setName(block, name: name)
            try? engine.block.setOpacity(block, value: opacity)
            eventHandler.send(.closeSheet)
          }
        }
      }
    }
  }
}
```

A non-floating sheet needs `List`- or `NavigationStack`-based content, which the `Form` inside a `NavigationStack` provides.

## Applying Changes and Closing the Panel

The Done button writes the edited values back to the scene with `setName` and `setOpacity`, then dismisses the sheet by sending the `closeSheet` event. The user can also swipe the sheet down to dismiss it.

```swift highlight-createCustomPanel-apply
Button("Done") {
  try? engine.block.setName(block, name: name)
  try? engine.block.setOpacity(block, value: opacity)
  eventHandler.send(.closeSheet)
}
```

## API Reference

| Method | Description |
| --- | --- |
| `builder.inspectorBar { inspectorBar in inspectorBar.items { … } }` | Declare the inspector bar's items in the editor configuration |
| `InspectorBar.Button(id:action:label:)` | An inspector bar button whose `action` and `label` closures receive an `InspectorBar.Context` |
| `InspectorBar.Context.selection.block` | The selected block inside the button's action |
| `InspectorBar.Context.engine` | Engine access inside the button's action |
| `context.eventHandler.send(.openSheet(style:content:))` | Present custom SwiftUI content as a sheet |
| `context.eventHandler.send(.closeSheet)` | Dismiss the current sheet |
| `engine.block.getName(_:)` / `setName(_:name:)` | Read and write a block's name |
| `engine.block.getOpacity(_:)` / `setOpacity(_:value:)` | Read and write a block's opacity |

## Next Steps

- [Panel](../customization/panel.md) — sheet types, presentation styles, and the built-in sheets this guide builds on.
- [Add a New Button](./add-new-button.md) — full options for dock, canvas menu, inspector bar, and navigation bar buttons.
- [Dock](../customization/dock.md) — configure the dock area and item order.
- [Inspector Bar](../customization/inspector-bar.md) — the built-in surface for editing properties of the selected block.



---

## More Resources

- **[iOS Documentation Index](https://img.ly/docs/cesdk/ios/)** - Browse all iOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/ios/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/ios/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
> This is one page of the CE.SDK iOS documentation. For a complete overview, see the [iOS Documentation Index](https://img.ly/docs/cesdk/ios/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/ios/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [User Interface](../../user-interface.md) > [UI Extensions](../ui-extensions.md) > [Register a New Component](./register-new-component.md)

---

```swift file=@cesdk_swift_examples/editor-guides-ui-extensions-register-new-component/RegisterNewComponentSolution.swift reference-only
// swiftformat:disable unusedArguments
import IMGLYEditor
import IMGLYEngine
import SwiftUI

struct RegisterNewComponentSolution: View {
  let settings = EngineSettings(license: secrets.licenseKey, // pass nil for evaluation mode with watermark
                                userID: "<your unique user id>")

  var editor: some View {
    Editor(settings)
      .imgly.configuration {
        GuideEditorConfiguration { builder in
          builder.dock { dock in
            dock.items { _ in
              Dock.Buttons.elementsLibrary()

              Dock.Buttons.imagesLibrary(
                action: { context in
                  context.eventHandler.send(.openSheet(type: .libraryAdd { context.assetLibrary.imagesTab }))
                },
                title: { _ in Text("Image") },
                icon: { _ in Image.imgly.addImage },
              )

              Dock.Button(
                id: "my.package.dock.button.export",
                action: { _ in print("Export tapped") },
                label: { _ in Label("Export", systemImage: "square.and.arrow.up") },
              )

              StatusBadgeItem()

              Dock.Button(
                id: "my.package.dock.button.brandKit",
                action: { _ in print("Brand Kit tapped") },
                label: { _ in BrandKitLabel() },
              )
            }
          }
          builder.canvasMenu { canvasMenu in
            canvasMenu.items { _ in
              CanvasMenu.Button(
                id: "my.package.canvasMenu.button.brandKit",
                action: { _ in print("Brand Kit tapped") },
                label: { _ in BrandKitLabel() },
              )

              CanvasMenu.Button(
                id: "my.package.canvasMenu.button.editCopy",
                action: { _ in print("Edit Copy tapped") },
                label: { _ in Label("Edit Copy", systemImage: "text.cursor") },
                isVisible: { context in context.selection.type == .text },
              )
            }
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
        editor
      }
    }
  }
}

private struct BrandKitLabel: View {
  var body: some View {
    Label("Brand Kit", systemImage: "paintpalette")
  }
}

private struct StatusBadgeItem: Dock.Item {
  var id: EditorComponentID {
    "my.package.dock.statusBadge"
  }

  func body(_ context: Dock.Context) throws -> some View {
    Text("Beta")
      .font(.caption.weight(.semibold))
      .foregroundStyle(.white)
      .padding(.horizontal, 8)
      .padding(.vertical, 4)
      .background(.tint, in: Capsule())
      .onTapGesture { print("Beta badge tapped") }
  }
}

#Preview {
  RegisterNewComponentSolution()
}
```

Build a custom UI component once and add it to the editor's dock, inspector bar, navigation bar, and canvas menu through the editor configuration.

![The editor with custom components in the dock](https://img.ly/docs/cesdk/ios/user-interface/ui-extensions/register-new-component-b04a04/assets/ios.hero.webp)

> **Reading time:** 6 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.81.0-nightly.20260810/editor-guides-ui-extensions-register-new-component)

Custom components are typed values you add to the editor's UI areas on the `EditorConfiguration` builder. You instantiate a component (a predefined button, a customized button, a new `Dock.Button`, or a fully custom item) inside the area's builder closure. This guide teaches the component model and how to reuse one component across more than one area. For the full item lists and built-in buttons of each area, see the [Dock](../customization/dock.md), [Inspector Bar](../customization/inspector-bar.md), [Navigation Bar](../customization/navigation-bar.md), and [Canvas Menu](../customization/canvas-menu.md) guides.

The example wraps the editor in `GuideEditorConfiguration`, a small helper class the [iOS guides repository](https://github.com/imgly/cesdk-swift-examples/blob/v1.81.0-nightly.20260810/editor-guides-quickstart/GuideEditorConfiguration.swift) ships as a minimal baseline. Substitute your own editor configuration class — the area builders are available on every configuration. The [Configuration](../../configuration.md) guide covers how `EditorConfiguration` and `EngineSettings` set up the editor as a whole.

## The Component Model

Every UI component conforms to `EditorComponent`. The protocol has three parts:

- **`id: EditorComponentID`** — A unique identifier, required for SwiftUI's `ForEach`.
- **`isVisible(_:)`** — A predicate deciding whether the component shows. Defaults to `true`.
- **`body(_:)`** — The SwiftUI view, built from the area's context.

Each area refines the protocol with its own context type: `Dock.Item`, `InspectorBar.Item`, `NavigationBar.Item`, and `CanvasMenu.Item` all set `Context` to that area's context (`Dock.Context`, `CanvasMenu.Context`, and so on). The context exposes the `engine`, the `eventHandler`, and the configured asset library; the inspector bar and canvas menu add a cached `selection`. The same model powers all four areas — only the context differs.

The built-in `Dock.Button` and the fully custom `Dock.Item` you write both conform to `Dock.Item`, so they sit side by side in the same item list.

## Configuration

Configure each area on the editor configuration builder. Enter the dock with `builder.dock { dock in … }` and declare its contents with `dock.items { context in … }`. The same shape applies to `inspectorBar`, `navigationBar`, and `canvasMenu`.

`dock.items` is a setter — it replaces the entire list. `GuideEditorConfiguration` ships an empty dock, so the call below declares the full list. Include every component you want to appear.

## Building a Component

There are four ways to add a component to an area, in increasing order of control. Each goes inside the `dock.items { _ in … }` closure; the snippets isolate one at a time.

### Use a Predefined Button

The simplest option is a button from the `Dock.Buttons` namespace.

```swift highlight-registerNewComponent-predefinedButton
Dock.Buttons.elementsLibrary()
```

### Customize a Predefined Button

Every parameter of a predefined button has a default, so you override only what you need — here the action, label, and icon.

```swift highlight-registerNewComponent-customizeButton
Dock.Buttons.imagesLibrary(
  action: { context in
    context.eventHandler.send(.openSheet(type: .libraryAdd { context.assetLibrary.imagesTab }))
  },
  title: { _ in Text("Image") },
  icon: { _ in Image.imgly.addImage },
)
```

### Create a New Button

When no predefined button fits, build your own with `Dock.Button`. It takes a unique `id`, an `action`, and a `label` view, plus optional `isEnabled` and `isVisible` predicates.

```swift highlight-registerNewComponent-newButton
Dock.Button(
  id: "my.package.dock.button.export",
  action: { _ in print("Export tapped") },
  label: { _ in Label("Export", systemImage: "square.and.arrow.up") },
)
```

### Create a Custom Item

For full control over rendering, conform a type to `Dock.Item` and provide your own `body`.

```swift highlight-registerNewComponent-customItem-conformance
private struct StatusBadgeItem: Dock.Item {
  var id: EditorComponentID {
    "my.package.dock.statusBadge"
  }

  func body(_ context: Dock.Context) throws -> some View {
    Text("Beta")
      .font(.caption.weight(.semibold))
      .foregroundStyle(.white)
      .padding(.horizontal, 8)
      .padding(.vertical, 4)
      .background(.tint, in: Capsule())
      .onTapGesture { print("Beta badge tapped") }
  }
}
```

Then add it to the dock like any other item:

```swift highlight-registerNewComponent-customItem
StatusBadgeItem()
```

## Reusing One Component Across Areas

The value of the component model is that you author a component's view once and place it wherever you need it. Define the view as a plain SwiftUI `View`:

```swift highlight-registerNewComponent-reusableView
private struct BrandKitLabel: View {
  var body: some View {
    Label("Brand Kit", systemImage: "paintpalette")
  }
}
```

Use it as the label of a `Dock.Button`:

```swift highlight-registerNewComponent-reusableDock
Dock.Button(
  id: "my.package.dock.button.brandKit",
  action: { _ in print("Brand Kit tapped") },
  label: { _ in BrandKitLabel() },
)
```

`Dock.Button` and `CanvasMenu.Button` are both the same generic `EditorComponents.Button`, specialized for their area's context. So the same `BrandKitLabel` view backs a canvas menu button without changes:

```swift highlight-registerNewComponent-reusableCanvasMenu
CanvasMenu.Button(
  id: "my.package.canvasMenu.button.brandKit",
  action: { _ in print("Brand Kit tapped") },
  label: { _ in BrandKitLabel() },
)
```

The component's view is reused; only the area builder you add it to changes. Read `selection` only where the area provides it — the dock and navigation bar have no selection, while the inspector bar and canvas menu do.

## Controlling Visibility

Gate a component with its `isVisible` predicate, reading the engine or the area context. This canvas menu button appears only when the selected block is text:

```swift highlight-registerNewComponent-visibility
CanvasMenu.Button(
  id: "my.package.canvasMenu.button.editCopy",
  action: { _ in print("Edit Copy tapped") },
  label: { _ in Label("Edit Copy", systemImage: "text.cursor") },
  isVisible: { context in context.selection.type == .text },
)
```

Prefer the predicate over hiding a component by returning an empty view. To hide an entire area, supply an empty item list.

## Troubleshooting

- **Component not appearing** — Its `id` must be unique; a duplicate id drops it. Confirm it is added to the correct area's `items`.
- **Component visible in the wrong context** — Gate it with `isVisible`. The dock and navigation bar have no `selection` to read.
- **Reused component looks different** — `EditorComponents.Button` is generic over the area context. A view that reads `selection` compiles only for the inspector bar and canvas menu; keep shared views context-independent or branch per area.

## API Reference

| Method | Purpose |
| --- | --- |
| `builder.dock { dock in … }` | Enter dock configuration (same shape for `inspectorBar`, `navigationBar`, `canvasMenu`). |
| `dock.items { context in … }` | Set the complete item list for an area (replaces existing items). |
| `Dock.Buttons.elementsLibrary()` (and siblings) | Predefined, customizable buttons. |
| `Dock.Button(id:action:label:isEnabled:isVisible:)` | A custom button with an action and a label view. |
| `CanvasMenu.Button(id:action:label:isVisible:)` | The same `EditorComponents.Button`, specialized for the canvas menu. |
| `Dock.Item` / `InspectorBar.Item` / `NavigationBar.Item` / `CanvasMenu.Item` | Per-area item protocols refining `EditorComponent`. |
| `EditorComponent` | The shared protocol every component conforms to (`id`, `isVisible`, `body`). |
| `EditorComponentID` | A unique component identifier. |

## Next Steps

- [Dock](../customization/dock.md) — The bottom toolbar: full item list, modify operations, and built-in buttons.
- [Inspector Bar](../customization/inspector-bar.md) — Context-sensitive controls for the current selection.
- [Navigation Bar](../customization/navigation-bar.md) — The editor's top bar and item placements.
- [Canvas Menu](../customization/canvas-menu.md) — The floating toolbar for the current selection.



---

## More Resources

- **[iOS Documentation Index](https://img.ly/docs/cesdk/ios/)** - Browse all iOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/ios/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/ios/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
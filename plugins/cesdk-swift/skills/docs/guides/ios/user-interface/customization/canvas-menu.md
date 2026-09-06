> This is one page of the CE.SDK iOS documentation. For a complete overview, see the [iOS Documentation Index](https://img.ly/docs/cesdk/ios/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/ios/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [User Interface](../../user-interface.md) > [Customization](../customization.md) > [Canvas Menu](./canvas-menu.md)

---

```swift file=@cesdk_swift_examples/editor-guides-configuration-canvas-menu/CanvasMenuEditorSolution.swift reference-only
// swiftformat:disable unusedArguments
import IMGLYEditor
import IMGLYEngine
import SwiftUI

/// Editor demonstrating how to declare and modify the canvas menu item list.
///
/// The highlighted regions are the lesson — what the documentation renders. The
/// `onLoaded` block below them is demo scaffolding (not part of the lesson): it
/// creates two graphic blocks and selects one so the canvas menu is visible the
/// moment the showcase opens. The default `onCreate` builds the 1080×1080 scene,
/// and the default Creator role keeps every engine scope allowed.
struct CanvasMenuEditorSolution: View {
  let settings = EngineSettings(license: secrets.licenseKey, // pass nil for evaluation mode with watermark
                                userID: "<your unique user id>")

  var editor: some View {
    Editor(settings)
      .imgly.configuration {
        GuideEditorConfiguration { builder in
          builder.canvasMenu { canvasMenu in
            canvasMenu.items { _ in
              CanvasMenu.Buttons.selectGroup()
              CanvasMenu.Divider()
              CanvasMenu.Buttons.bringForward()
              CanvasMenu.Buttons.sendBackward()
              CanvasMenu.Divider()
              CanvasMenu.Buttons.duplicate()
              CanvasMenu.Buttons.delete()
            }
            canvasMenu.modify { _, items in
              items.addFirst {
                CanvasMenu.Button(id: "my.package.canvasMenu.button.first") { _ in
                  print("First Button action")
                } label: { _ in
                  Label("First Button", systemImage: "arrow.backward.circle")
                }
              }
              items.addLast {
                CanvasMenu.Button(id: "my.package.canvasMenu.button.last") { _ in
                  print("Last Button action")
                } label: { _ in
                  Label("Last Button", systemImage: "arrow.forward.circle")
                }
              }
              items.addAfter(id: CanvasMenu.Buttons.ID.bringForward) {
                CanvasMenu.Button(id: "my.package.canvasMenu.button.afterBringForward") { _ in
                  print("After Bring Forward action")
                } label: { _ in
                  Label("After Bring Forward", systemImage: "arrow.forward.square")
                }
              }
              items.addBefore(id: CanvasMenu.Buttons.ID.sendBackward) {
                CanvasMenu.Button(id: "my.package.canvasMenu.button.beforeSendBackward") { _ in
                  print("Before Send Backward action")
                } label: { _ in
                  Label("Before Send Backward", systemImage: "arrow.backward.square")
                }
              }
              items.replace(id: CanvasMenu.Buttons.ID.duplicate) {
                CanvasMenu.Button(id: "my.package.canvasMenu.button.replacedDuplicate") { _ in
                  print("Replaced Duplicate action")
                } label: { _ in
                  Label("Replaced Duplicate", systemImage: "arrow.uturn.down.square")
                }
              }
              items.remove(id: CanvasMenu.Buttons.ID.delete)
            }
          }
          // Demo scaffolding (not part of the lesson): create two graphic blocks
          // and select one so the canvas menu appears as soon as the editor loads.
          builder.onLoaded { context, _ in
            let engine = context.engine
            guard let page = try engine.scene.getCurrentPage() else { return }

            let back = try engine.block.create(.graphic)
            try engine.block.setShape(back, shape: engine.block.createShape(.rect))
            let backFill = try engine.block.createFill(.color)
            try engine.block.setColor(
              backFill,
              property: "fill/color/value",
              color: .rgba(r: 0.18, g: 0.4, b: 0.92, a: 1),
            )
            try engine.block.setFill(back, fill: backFill)
            try engine.block.setWidth(back, value: 480)
            try engine.block.setHeight(back, value: 480)
            try engine.block.setPositionX(back, value: 180)
            try engine.block.setPositionY(back, value: 200)
            try engine.block.appendChild(to: page, child: back)

            let front = try engine.block.create(.graphic)
            try engine.block.setShape(front, shape: engine.block.createShape(.rect))
            let frontFill = try engine.block.createFill(.color)
            try engine.block.setColor(
              frontFill,
              property: "fill/color/value",
              color: .rgba(r: 0.96, g: 0.6, b: 0.12, a: 1),
            )
            try engine.block.setFill(front, fill: frontFill)
            try engine.block.setWidth(front, value: 420)
            try engine.block.setHeight(front, value: 420)
            try engine.block.setPositionX(front, value: 420)
            try engine.block.setPositionY(front, value: 420)
            try engine.block.appendChild(to: page, child: front)

            try engine.block.setSelected(front, selected: true)
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

#Preview {
  CanvasMenuEditorSolution()
}
```

```swift file=@cesdk_swift_examples/editor-guides-configuration-canvas-menu/CanvasMenuItemEditorSolution.swift reference-only
// swiftformat:disable unusedArguments
import IMGLYEditor
import IMGLYEngine
import SwiftUI

/// Editor demonstrating the range of canvas menu items: predefined buttons,
/// customized predefined buttons, new buttons, and fully custom items.
///
/// The highlighted regions are the lesson. The `onLoaded` block is demo
/// scaffolding (not part of the lesson): it creates a graphic block and selects
/// it so the canvas menu is visible the moment the showcase opens.
struct CanvasMenuItemEditorSolution: View {
  let settings = EngineSettings(license: secrets.licenseKey, // pass nil for evaluation mode with watermark
                                userID: "<your unique user id>")

  var editor: some View {
    Editor(settings)
      .imgly.configuration {
        GuideEditorConfiguration { builder in
          builder.canvasMenu { canvasMenu in
            canvasMenu.items { _ in
              CanvasMenu.Buttons.duplicate()

              CanvasMenu.Buttons.delete(
                action: { context in
                  context.eventHandler.send(.deleteSelection)
                },
                label: { _ in
                  Label {
                    Text(.imgly.localized("ly_img_editor_canvas_menu_button_delete"))
                  } icon: {
                    Image.imgly.delete
                  }
                },
                isEnabled: { _ in true },
                isVisible: { context in
                  try context.engine.block.isAllowedByScope(context.selection.block, key: "lifecycle/destroy")
                },
              )

              CanvasMenu.Button(
                id: "my.package.canvasMenu.button.newButton",
              ) { _ in
                print("New Button action")
              } label: { _ in
                Label("New Button", systemImage: "star.circle")
              } isEnabled: { _ in
                true
              } isVisible: { _ in
                true
              }

              CustomCanvasMenuItem()
            }
          }
          // Demo scaffolding (not part of the lesson): create a graphic block and
          // select it so the canvas menu appears as soon as the editor loads.
          builder.onLoaded { context, _ in
            let engine = context.engine
            guard let page = try engine.scene.getCurrentPage() else { return }
            let block = try engine.block.create(.graphic)
            try engine.block.setShape(block, shape: engine.block.createShape(.rect))
            let fill = try engine.block.createFill(.color)
            try engine.block.setColor(fill, property: "fill/color/value", color: .rgba(r: 0.96, g: 0.6, b: 0.12, a: 1))
            try engine.block.setFill(block, fill: fill)
            try engine.block.setWidth(block, value: 540)
            try engine.block.setHeight(block, value: 540)
            try engine.block.setPositionX(block, value: 270)
            try engine.block.setPositionY(block, value: 270)
            try engine.block.appendChild(to: page, child: block)
            try engine.block.setSelected(block, selected: true)
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

private struct CustomCanvasMenuItem: CanvasMenu.Item {
  var id: EditorComponentID {
    "my.package.canvasMenu.newCustomItem"
  }

  func body(_ context: CanvasMenu.Context) throws -> some View {
    ZStack {
      RoundedRectangle(cornerRadius: 10)
        .fill(.conicGradient(colors: [.red, .yellow, .green, .cyan, .blue, .purple, .red], center: .center))
      Text("New Custom Item")
        .padding(4)
    }
    .onTapGesture {
      print("New Custom Item action")
    }
  }

  func isVisible(_ context: CanvasMenu.Context) throws -> Bool {
    true
  }
}

#Preview {
  CanvasMenuItemEditorSolution()
}
```

The canvas menu is the floating toolbar that appears next to a selected design block. Declare its items from scratch for exact control, or adjust a list you already declared.

![A selected block with a customized canvas menu floating beside it](https://img.ly/docs/cesdk/ios/user-interface/customization/canvas-menu-0d2b5b/assets/ios.hero.webp)

> **Reading time:** 6 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.83.0-nightly.20260906/editor-guides-configuration-canvas-menu)

## Canvas Menu Architecture

The canvas menu is a floating toolbar that the editor positions next to the currently selected design block, surfacing quick actions like duplicate, delete, and layer reordering without leaving the canvas.

You assemble it from a small set of types:

- **`CanvasMenu.Item`** — the protocol every menu entry conforms to. Buttons, dividers, and your own custom views are all items.
- **`CanvasMenu.Button`** — a button entry. Use the predefined factories (`CanvasMenu.Buttons.duplicate()`, …) or construct one with a custom action and label.
- **`CanvasMenu.Divider`** — a visual separator. Adjacent dividers collapse into one, and a leading or trailing divider is dropped automatically.
- **`CanvasMenu.Context`** — passed to every closure. Its cached `selection` exposes the selected `block`, its `type`, `fillType`, and `kind`. Prefer reading from `selection` over querying the engine directly, since it stays stable for the menu's presentation lifecycle, including its appear and disappear animations.

## Configuration

The canvas menu is part of the editor configuration. Enter it through `builder.canvasMenu { canvasMenu in … }` and choose one of two approaches:

| Approach | Modifier | Best for |
|----------|----------|----------|
| **Replacement** | `canvasMenu.items` | Declaring the exact set of items and their order — version-safe |
| **Modification** | `canvasMenu.modify` | Adding to, replacing, or removing entries from a list you already declared |

The example builds on `GuideEditorConfiguration`, a small helper class the [iOS guides repository](https://github.com/imgly/cesdk-swift-examples/blob/v1.83.0-nightly.20260906/editor-guides-quickstart/GuideEditorConfiguration.swift) ships as a minimal baseline. Substitute your own editor configuration — the `canvasMenu` builder is exposed on every configuration, so the rest of the call stays the same. Because this baseline starts with an empty canvas menu, `canvasMenu.items` is the primary path; `canvasMenu.modify` then adjusts the list that `items` established.

The [Configuration](../../configuration.md) guide covers how `EditorConfiguration` and `EngineSettings` set up the editor as a whole; this guide focuses on the canvas menu surface within it.

## Declaring the Item List

Use `canvasMenu.items` to declare the full list from scratch. The closure returns the items in display order, and the list you return is the complete menu — include every entry you want, since this call replaces the canvas menu's contents rather than adding to them.

```swift highlight-canvasMenu-canvasMenuItems
canvasMenu.items { _ in
  CanvasMenu.Buttons.selectGroup()
  CanvasMenu.Divider()
  CanvasMenu.Buttons.bringForward()
  CanvasMenu.Buttons.sendBackward()
  CanvasMenu.Divider()
  CanvasMenu.Buttons.duplicate()
  CanvasMenu.Buttons.delete()
}
```

- The closure receives a `CanvasMenu.Context` carrying the current `selection`.
- `CanvasMenu.Divider()` groups related actions; adjacent and dangling dividers are removed automatically.
- Because you spell out the entire list, item order is guaranteed across editor versions.

## Modify Canvas Menu Items

Use `canvasMenu.modify` to adjust the list you declared with `canvasMenu.items` without redefining it. The modifier exposes six positional operations:

```swift highlight-canvasMenu-modifyCanvasMenuItemsSignature
canvasMenu.modify { _, items in
```

| Operation | Purpose |
|-----------|---------|
| `items.addFirst(_:)` | Prepend at the beginning |
| `items.addLast(_:)` | Append at the end |
| `items.addBefore(id:_:)` | Insert before a specific item |
| `items.addAfter(id:_:)` | Insert after a specific item |
| `items.replace(id:_:)` | Replace an existing item |
| `items.remove(id:)` | Remove an item by ID |

Add items at the start or end:

```swift highlight-canvasMenu-addFirst
items.addFirst {
  CanvasMenu.Button(id: "my.package.canvasMenu.button.first") { _ in
    print("First Button action")
  } label: { _ in
    Label("First Button", systemImage: "arrow.backward.circle")
  }
}
```

```swift highlight-canvasMenu-addLast
items.addLast {
  CanvasMenu.Button(id: "my.package.canvasMenu.button.last") { _ in
    print("Last Button action")
  } label: { _ in
    Label("Last Button", systemImage: "arrow.forward.circle")
  }
}
```

Position items relative to existing ones using their ID constants:

```swift highlight-canvasMenu-addAfter
items.addAfter(id: CanvasMenu.Buttons.ID.bringForward) {
  CanvasMenu.Button(id: "my.package.canvasMenu.button.afterBringForward") { _ in
    print("After Bring Forward action")
  } label: { _ in
    Label("After Bring Forward", systemImage: "arrow.forward.square")
  }
}
```

```swift highlight-canvasMenu-addBefore
items.addBefore(id: CanvasMenu.Buttons.ID.sendBackward) {
  CanvasMenu.Button(id: "my.package.canvasMenu.button.beforeSendBackward") { _ in
    print("Before Send Backward action")
  } label: { _ in
    Label("Before Send Backward", systemImage: "arrow.backward.square")
  }
}
```

Replace or remove items:

```swift highlight-canvasMenu-replace
items.replace(id: CanvasMenu.Buttons.ID.duplicate) {
  CanvasMenu.Button(id: "my.package.canvasMenu.button.replacedDuplicate") { _ in
    print("Replaced Duplicate action")
  } label: { _ in
    Label("Replaced Duplicate", systemImage: "arrow.uturn.down.square")
  }
}
```

```swift highlight-canvasMenu-remove
items.remove(id: CanvasMenu.Buttons.ID.delete)
```

> **Warning:** Operations that target a specific ID (`addAfter`, `addBefore`, `replace`, `remove`) throw if the ID isn't in the list. Reference entries by their predefined constants, such as `CanvasMenu.Buttons.ID.duplicate`.

> **Note:** When you modify a list whose contents you didn't fully declare — for example, items a configuration ships on your behalf — that list's order can shift between editor versions, which moves your positional edits with it. Declare the whole list with `canvasMenu.items` when you need strict ordering guarantees.

## CanvasMenu.Item Configuration

Items range from predefined buttons to fully custom views.

### Predefined Buttons

CE.SDK ships factory functions for the common canvas actions. Each returns a `CanvasMenu.Item` with sensible defaults:

```swift highlight-canvasMenu-predefinedButton
CanvasMenu.Buttons.duplicate()
```

| Button | ID constant |
|--------|-------------|
| `CanvasMenu.Buttons.bringForward()` | `CanvasMenu.Buttons.ID.bringForward` |
| `CanvasMenu.Buttons.sendBackward()` | `CanvasMenu.Buttons.ID.sendBackward` |
| `CanvasMenu.Buttons.duplicate()` | `CanvasMenu.Buttons.ID.duplicate` |
| `CanvasMenu.Buttons.delete()` | `CanvasMenu.Buttons.ID.delete` |
| `CanvasMenu.Buttons.selectGroup()` | `CanvasMenu.Buttons.ID.selectGroup` |

### Customize Predefined Buttons

Each factory accepts optional `action`, `label`, `isEnabled`, and `isVisible` closures. Supplying any one of them **replaces** the factory default, so reproduce the behavior you want to keep. The example overrides all four on the delete button while preserving its defaults: it rebuilds the localized title with `Text(.imgly.localized("ly_img_editor_canvas_menu_button_delete"))`, keeps the `Image.imgly.delete` icon, and reproduces the default `lifecycle/destroy` scope check in `isVisible` so the button still hides when deletion isn't permitted.

```swift highlight-canvasMenu-customizePredefinedButton
CanvasMenu.Buttons.delete(
  action: { context in
    context.eventHandler.send(.deleteSelection)
  },
  label: { _ in
    Label {
      Text(.imgly.localized("ly_img_editor_canvas_menu_button_delete"))
    } icon: {
      Image.imgly.delete
    }
  },
  isEnabled: { _ in true },
  isVisible: { context in
    try context.engine.block.isAllowedByScope(context.selection.block, key: "lifecycle/destroy")
  },
)
```

### Create New Buttons

When the predefined buttons don't cover your action, construct a `CanvasMenu.Button` with a unique ID in reverse-domain notation, an action, and a label. `isEnabled` and `isVisible` are optional and default to always-true:

```swift highlight-canvasMenu-newButton
CanvasMenu.Button(
  id: "my.package.canvasMenu.button.newButton",
) { _ in
  print("New Button action")
} label: { _ in
  Label("New Button", systemImage: "star.circle")
} isEnabled: { _ in
  true
} isVisible: { _ in
  true
}
```

### Dividers

Insert `CanvasMenu.Divider()` between groups of related actions. Adjacent dividers collapse into a single line, and a divider left dangling at the start or end of the list (because the items around it are hidden) is removed. See the [Declaring the Item List](./canvas-menu.md#declaring-the-item-list) example for placement.

### Create Custom Items

For full control over rendering, conform a type to `CanvasMenu.Item`. Provide a unique `id`, a `body` that returns your view, and an `isVisible` predicate:

```swift highlight-canvasMenu-newCustomItemConformance
private struct CustomCanvasMenuItem: CanvasMenu.Item {
  var id: EditorComponentID {
    "my.package.canvasMenu.newCustomItem"
  }

  func body(_ context: CanvasMenu.Context) throws -> some View {
    ZStack {
      RoundedRectangle(cornerRadius: 10)
        .fill(.conicGradient(colors: [.red, .yellow, .green, .cyan, .blue, .purple, .red], center: .center))
      Text("New Custom Item")
        .padding(4)
    }
    .onTapGesture {
      print("New Custom Item action")
    }
  }

  func isVisible(_ context: CanvasMenu.Context) throws -> Bool {
    true
  }
}
```

Then place the custom item in the list like any other entry:

```swift highlight-canvasMenu-newCustomItem
CustomCanvasMenuItem()
```

## List of Available Canvas Menu Buttons

The predefined buttons live in the `CanvasMenu.Buttons` namespace. Each returns a button whose default `isVisible` already gates it to the situations where the action makes sense.

| Button | ID constant | Default visibility |
|--------|-------------|--------------------|
| `CanvasMenu.Buttons.bringForward()` | `.bringForward` | When the selected block can be reordered. Audio and captions have no z-order, so they never show it |
| `CanvasMenu.Buttons.sendBackward()` | `.sendBackward` | When the selected block can be reordered. Audio and captions have no z-order, so they never show it |
| `CanvasMenu.Buttons.duplicate()` | `.duplicate` | When the block's `lifecycle/duplicate` scope is allowed, except for captions |
| `CanvasMenu.Buttons.delete()` | `.delete` | When the block's `lifecycle/destroy` scope is allowed |
| `CanvasMenu.Buttons.selectGroup()` | `.selectGroup` | When the block belongs to a group |

## API Reference

| Symbol | Category | Purpose |
|--------|----------|---------|
| `builder.canvasMenu { canvasMenu in … }` | Config | Enter canvas menu configuration |
| `canvasMenu.items { context in … }` | Config | Declare the full item list (replaces the contents) |
| `canvasMenu.modify { context, items in … }` | Config | Adjust an existing item list in place |
| `CanvasMenu.Buttons.duplicate()` (and siblings) | Item | Predefined buttons |
| `CanvasMenu.Button(id:action:label:)` | Item | Custom button |
| `CanvasMenu.Divider()` | Layout | Separator (collapses when adjacent or dangling) |
| `CanvasMenu.Buttons.ID.duplicate` (and siblings) | Item | ID constant used to target modify operations |
| `CanvasMenu.Context.selection` | Context | Cached selection (`block`, `type`, `fillType`, `kind`) |
| `CanvasMenu.Item` | Item | Protocol for fully custom items (`id`, `body`, `isVisible`) |

## Next Steps

- [Dock](./dock.md) — The bottom toolbar that opens asset libraries and sheets.
- [Inspector Bar](./inspector-bar.md) — Context-sensitive controls for the selected block.
- [Navigation Bar](./navigation-bar.md) — The top bar with close, undo, and redo.
- [Asset Library](../../import-media/asset-library/customize.md) — The sources shared across editor components.



---

## More Resources

- **[iOS Documentation Index](https://img.ly/docs/cesdk/ios/)** - Browse all iOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/ios/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/ios/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
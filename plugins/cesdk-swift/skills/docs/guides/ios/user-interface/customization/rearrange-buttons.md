> This is one page of the CE.SDK iOS documentation. For a complete overview, see the [iOS Documentation Index](https://img.ly/docs/cesdk/ios/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/ios/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [User Interface](../../user-interface.md) > [Customization](../customization.md) > [Rearrange Buttons](./rearrange-buttons.md)

---

```swift file=@cesdk_swift_examples/editor-guides-customization-rearrange-buttons/RearrangeButtonsEditorSolution.swift reference-only
// swiftformat:disable unusedArguments
import IMGLYEditor
import SwiftUI

struct RearrangeButtonsEditorSolution: View {
  let settings = EngineSettings(license: secrets.licenseKey,
                                userID: "<your unique user id>")

  var editor: some View {
    Editor(settings)
      .imgly.configuration {
        DesignEditorConfiguration { builder in
          builder.navigationBar { navigationBar in
            navigationBar.modify { _, items in
              // Move undo/redo to the leading position
              items.remove(id: NavigationBar.Buttons.ID.undo)
              items.remove(id: NavigationBar.Buttons.ID.redo)
              items.addFirst(placement: .topBarLeading) {
                NavigationBar.Buttons.undo()
                NavigationBar.Buttons.redo()
              }
            }
          }
          builder.canvasMenu { canvasMenu in
            canvasMenu.modify { _, items in
              // Keep only duplicate and delete, removing layer ordering options
              items.remove(id: CanvasMenu.Buttons.ID.bringForward)
              items.remove(id: CanvasMenu.Buttons.ID.sendBackward)
              items.remove(id: CanvasMenu.Buttons.ID.selectGroup)
            }
          }
          builder.dock { dock in
            dock.modify { _, items in
              // Move text library to the beginning for text-focused workflows
              items.remove(id: Dock.Buttons.ID.textLibrary)
              items.addFirst {
                Dock.Buttons.textLibrary()
              }
            }
          }
          builder.inspectorBar { inspectorBar in
            inspectorBar.modify { _, items in
              // Move duplicate button to appear before layer options
              items.remove(id: InspectorBar.Buttons.ID.duplicate)
              items.addBefore(id: InspectorBar.Buttons.ID.layer) {
                InspectorBar.Buttons.duplicate()
              }
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

#Preview {
  RearrangeButtonsEditorSolution()
}
```

Reorder buttons across the navigation bar, canvas menu, dock, and inspector bar to prioritize actions for your workflows.

![Editor with rearranged navigation bar and dock buttons](https://img.ly/docs/cesdk/ios/user-interface/customization/rearrange-buttons-97022a/assets/ios.hero.webp)

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.82.0-rc.0/editor-guides-customization-rearrange-buttons)

## Overview

CE.SDK provides `builder.[component]` with `[component].modify` on the editor configuration for each of the four editor components. The modify closures expose an `ArrayModifier` that lets you remove buttons from their current position and re-add them elsewhere. The general pattern for rearranging is: remove, then re-add at the desired position.

| Operation | Purpose |
|-----------|---------|
| `items.remove(id:)` | Remove a button from its current position |
| `items.addFirst(_:)` | Prepend at the beginning |
| `items.addLast(_:)` | Append at the end |
| `items.addBefore(id:_:)` | Insert before a specific button |
| `items.addAfter(id:_:)` | Insert after a specific button |
| `items.replace(id:_:)` | Replace a button entirely |

We reference buttons using component-specific ID enums — for example, `NavigationBar.Buttons.ID.undo` or `Dock.Buttons.ID.textLibrary`.

> **Note:** The order of default items may change between editor versions. If you need strict ordering guarantees, consider using the items replacement closures (`navigationBar.items`, `dock.items`, etc.) instead.

## Rearranging the Navigation Bar

Unlike the other components, the navigation bar organizes its items into placement groups. When we re-add a button, we specify which group it belongs to. Here we move the undo and redo buttons from the trailing side to the leading side of the bar.

```swift highlight-rearrangeButtons-navbar
builder.navigationBar { navigationBar in
  navigationBar.modify { _, items in
    // Move undo/redo to the leading position
    items.remove(id: NavigationBar.Buttons.ID.undo)
    items.remove(id: NavigationBar.Buttons.ID.redo)
    items.addFirst(placement: .topBarLeading) {
      NavigationBar.Buttons.undo()
      NavigationBar.Buttons.redo()
    }
  }
}
```

The three available placements are:

| Placement | Position |
|-----------|----------|
| `.topBarLeading` | Leading side |
| `.topBarTrailing` | Trailing side |
| `.principal` | Center |

## Rearranging the Canvas Menu

The canvas menu appears as a floating toolbar when the user selects a block on the canvas. We strip away the layer ordering actions to keep the menu focused on duplicate and delete.

```swift highlight-rearrangeButtons-canvasMenu
builder.canvasMenu { canvasMenu in
  canvasMenu.modify { _, items in
    // Keep only duplicate and delete, removing layer ordering options
    items.remove(id: CanvasMenu.Buttons.ID.bringForward)
    items.remove(id: CanvasMenu.Buttons.ID.sendBackward)
    items.remove(id: CanvasMenu.Buttons.ID.selectGroup)
  }
}
```

## Rearranging the Dock

The dock sits at the bottom of the editor and provides access to asset libraries and tools. We move the text library to the first position so it takes priority in a text-heavy workflow.

```swift highlight-rearrangeButtons-dock
builder.dock { dock in
  dock.modify { _, items in
    // Move text library to the beginning for text-focused workflows
    items.remove(id: Dock.Buttons.ID.textLibrary)
    items.addFirst {
      Dock.Buttons.textLibrary()
    }
  }
}
```

## Rearranging the Inspector Bar

The inspector bar shows contextual actions for the currently selected block. We reposition the duplicate button directly before the layer action using `addBefore(id:_:)`.

```swift highlight-rearrangeButtons-inspectorBar
builder.inspectorBar { inspectorBar in
  inspectorBar.modify { _, items in
    // Move duplicate button to appear before layer options
    items.remove(id: InspectorBar.Buttons.ID.duplicate)
    items.addBefore(id: InspectorBar.Buttons.ID.layer) {
      InspectorBar.Buttons.duplicate()
    }
  }
}
```

## Next Steps

- [Hide Elements](./hide-elements.md) — Remove UI elements entirely
- [Add a New Button](../ui-extensions/add-new-button.md) — Add custom buttons to editor components
- [Canvas Menu](./canvas-menu.md) — Full canvas menu customization
- [Dock](./dock.md) — Full dock customization



---

## More Resources

- **[iOS Documentation Index](https://img.ly/docs/cesdk/ios/)** - Browse all iOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/ios/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/ios/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
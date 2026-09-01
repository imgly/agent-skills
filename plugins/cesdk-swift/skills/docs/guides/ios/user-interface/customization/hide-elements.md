> This is one page of the CE.SDK iOS documentation. For a complete overview, see the [iOS Documentation Index](https://img.ly/docs/cesdk/ios/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/ios/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [User Interface](../../user-interface.md) > [Customization](../customization.md) > [Hide Elements](./hide-elements.md)

---

```swift file=@cesdk_swift_examples/editor-guides-customization-hide-elements/HideElementsEditorSolution.swift reference-only
import IMGLYEditor
import SwiftUI

/// Editor demonstrating how to hide UI elements.
///
/// This example shows how to:
/// - Hide the dock completely
/// - Remove specific items from each UI component
/// - Combine approaches to create a minimal UI
struct HideElementsEditorSolution: View {
  let settings = EngineSettings(
    license: secrets.licenseKey,
    userID: "<your unique user id>",
  )

  enum Demo: String, CaseIterable, Identifiable {
    case hideDock = "Hide Dock"
    case removeItems = "Remove Items"
    case minimalUI = "Minimal UI"
    var id: Self {
      self
    }
  }

  @State private var selectedDemo: Demo = .hideDock
  @State private var isPresented = false

  var editorWithHiddenDock: some View {
    Editor(settings)
      .imgly.configuration {
        GuideEditorConfiguration { builder in
          builder.dock { dock in
            dock.items { _ in
              // Empty — hides the dock completely
            }
          }
        }
      }
  }

  var editorWithItemsRemoved: some View {
    Editor(settings)
      .imgly.configuration {
        GuideEditorConfiguration { builder in
          builder.dock { dock in
            dock.items { _ in
              Dock.Button(id: "my.app.dock.elements") { _ in } label: { _ in
                Label("Elements", systemImage: "square.on.circle")
              }
              Dock.Button(id: "my.app.dock.images") { _ in } label: { _ in
                Label("Images", systemImage: "photo")
              }
              Dock.Button(id: "my.app.dock.text") { _ in } label: { _ in
                Label("Text", systemImage: "textformat")
              }
              Dock.Button(id: "my.app.dock.shapes") { _ in } label: { _ in
                Label("Shapes", systemImage: "square.on.circle.dashed")
              }
            }
            dock.modify { _, items in
              items.remove(id: "my.app.dock.elements")
              items.remove(id: "my.app.dock.shapes")
            }
          }
          builder.navigationBar { navigationBar in
            navigationBar.modify { _, items in
              items.remove(id: NavigationBar.Buttons.ID.undo)
              items.remove(id: NavigationBar.Buttons.ID.redo)
            }
          }
          builder.canvasMenu { canvasMenu in
            canvasMenu.items { _ in
              CanvasMenu.Buttons.bringForward()
              CanvasMenu.Buttons.sendBackward()
              CanvasMenu.Buttons.delete()
            }
            canvasMenu.modify { _, items in
              items.remove(id: CanvasMenu.Buttons.ID.bringForward)
            }
          }
          builder.inspectorBar { inspectorBar in
            inspectorBar.items { _ in
              InspectorBar.Buttons.crop()
              InspectorBar.Buttons.adjustments()
              InspectorBar.Buttons.filter()
            }
            inspectorBar.modify { _, items in
              items.remove(id: InspectorBar.Buttons.ID.crop)
            }
          }
        }
      }
  }

  var editorWithMinimalUI: some View {
    Editor(settings)
      .imgly.configuration {
        GuideEditorConfiguration { builder in
          builder.dock { dock in
            dock.items { _ in }
          }
          builder.navigationBar { navigationBar in
            navigationBar.items { _ in
              NavigationBar.ItemGroup(placement: .topBarLeading) {
                NavigationBar.Buttons.closeEditor()
              }
            }
          }
        }
      }
  }

  var body: some View {
    VStack(spacing: 16) {
      Picker("Demo", selection: $selectedDemo) {
        ForEach(Demo.allCases) { demo in
          Text(demo.rawValue).tag(demo)
        }
      }
      .pickerStyle(.segmented)
      .padding(.horizontal)

      Button("Use the Editor") {
        isPresented = true
      }
    }
    .fullScreenCover(isPresented: $isPresented) {
      ModalEditor {
        switch selectedDemo {
        case .hideDock:
          editorWithHiddenDock
        case .removeItems:
          editorWithItemsRemoved
        case .minimalUI:
          editorWithMinimalUI
        }
      }
    }
  }
}

#Preview {
  HideElementsEditorSolution()
}
```

Hide or remove UI elements to create focused editing experiences tailored to your application.

![Editor with hidden dock](https://img.ly/docs/cesdk/ios/user-interface/customization/hide-elements-fe945c/assets/ios.hero.webp)

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.83.0-nightly.20260901/editor-guides-customization-hide-elements)

## Overview

CE.SDK provides two approaches for controlling UI element visibility:

| Approach | Method | Result |
|----------|--------|--------|
| **Hide component** | `[component].items { _ in }` | Entire component hidden |
| **Remove items** | `[component].modify { _, items in items.remove(id:) }` | Specific items removed, container stays visible |

> **Note:** The Dock, Canvas Menu, and Navigation Bar (with Liquid Glass style) automatically hide when all their items are removed. You can also set individual items to not visible via `isVisible` to achieve the same effect.

## Hiding the Dock

Provide an empty `dock.items` closure to hide the dock completely:

```swift highlight-hideElements-hideDock
  var editorWithHiddenDock: some View {
    Editor(settings)
      .imgly.configuration {
        GuideEditorConfiguration { builder in
          builder.dock { dock in
            dock.items { _ in
              // Empty — hides the dock completely
            }
          }
        }
      }
  }
```

## Removing Items from the Dock

Use `dock.modify` with `items.remove(id:)` to remove specific buttons while keeping the dock visible:

```swift highlight-hideElements-removeDock
builder.dock { dock in
  dock.items { _ in
    Dock.Button(id: "my.app.dock.elements") { _ in } label: { _ in
      Label("Elements", systemImage: "square.on.circle")
    }
    Dock.Button(id: "my.app.dock.images") { _ in } label: { _ in
      Label("Images", systemImage: "photo")
    }
    Dock.Button(id: "my.app.dock.text") { _ in } label: { _ in
      Label("Text", systemImage: "textformat")
    }
    Dock.Button(id: "my.app.dock.shapes") { _ in } label: { _ in
      Label("Shapes", systemImage: "square.on.circle.dashed")
    }
  }
  dock.modify { _, items in
    items.remove(id: "my.app.dock.elements")
    items.remove(id: "my.app.dock.shapes")
  }
}
```

## Removing Items from the Navigation Bar

Use `navigationBar.modify` to remove navigation buttons:

```swift highlight-hideElements-removeNavbar
builder.navigationBar { navigationBar in
  navigationBar.modify { _, items in
    items.remove(id: NavigationBar.Buttons.ID.undo)
    items.remove(id: NavigationBar.Buttons.ID.redo)
  }
}
```

## Removing Items from the Canvas Menu

Use `canvasMenu.modify` to remove contextual menu actions:

```swift highlight-hideElements-removeCanvasMenu
builder.canvasMenu { canvasMenu in
  canvasMenu.items { _ in
    CanvasMenu.Buttons.bringForward()
    CanvasMenu.Buttons.sendBackward()
    CanvasMenu.Buttons.delete()
  }
  canvasMenu.modify { _, items in
    items.remove(id: CanvasMenu.Buttons.ID.bringForward)
  }
}
```

## Removing Items from the Inspector Bar

Use `inspectorBar.modify` to remove inspector actions:

```swift highlight-hideElements-removeInspectorBar
builder.inspectorBar { inspectorBar in
  inspectorBar.items { _ in
    InspectorBar.Buttons.crop()
    InspectorBar.Buttons.adjustments()
    InspectorBar.Buttons.filter()
  }
  inspectorBar.modify { _, items in
    items.remove(id: InspectorBar.Buttons.ID.crop)
  }
}
```

Each component exposes its button IDs through a dedicated enum:

| Component | ID Enum |
|-----------|---------|
| Dock | `Dock.Buttons.ID.*` |
| Navigation Bar | `NavigationBar.Buttons.ID.*` |
| Canvas Menu | `CanvasMenu.Buttons.ID.*` |
| Inspector Bar | `InspectorBar.Buttons.ID.*` |

## Creating a Minimal UI

Combine hiding and defining to create a canvas-focused interface. Hide the dock and use `navigationBar.items` to define only the buttons you need:

```swift highlight-hideElements-minimalUI
  var editorWithMinimalUI: some View {
    Editor(settings)
      .imgly.configuration {
        GuideEditorConfiguration { builder in
          builder.dock { dock in
            dock.items { _ in }
          }
          builder.navigationBar { navigationBar in
            navigationBar.items { _ in
              NavigationBar.ItemGroup(placement: .topBarLeading) {
                NavigationBar.Buttons.closeEditor()
              }
            }
          }
        }
      }
  }
```

> **Tip:** Use `navigationBar.items` to define items from scratch when you want full control. Use `navigationBar.modify` when you only need to add or remove a few items from the defaults.

## Next Steps

- [Customize Dock](./dock.md) - Full dock customization patterns
- [Customize Navigation Bar](./navigation-bar.md) - Navigation bar configuration
- [Rearrange Buttons](./rearrange-buttons.md) - Button positioning across components
- [Add a New Button](../ui-extensions/add-new-button.md) - Add custom buttons to components



---

## More Resources

- **[iOS Documentation Index](https://img.ly/docs/cesdk/ios/)** - Browse all iOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/ios/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/ios/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
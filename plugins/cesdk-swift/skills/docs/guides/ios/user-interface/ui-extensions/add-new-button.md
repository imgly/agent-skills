> This is one page of the CE.SDK iOS documentation. For a complete overview, see the [iOS Documentation Index](https://img.ly/docs/cesdk/ios/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/ios/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [User Interface](../../user-interface.md) > [UI Extensions](../ui-extensions.md) > [Add New Button](./add-new-button.md)

---

```swift file=@cesdk_swift_examples/editor-guides-ui-extensions-add-button/AddButtonEditorSolution.swift reference-only
// swiftformat:disable unusedArguments
import IMGLYEditor
import SwiftUI

/// Design Editor demonstrating how to add custom buttons to different UI locations.
///
/// This example shows how to:
/// - Add a custom button to the Dock
/// - Add a custom button to the Canvas Menu
/// - Add a custom button to the Inspector Bar
/// - Add a custom button to the Navigation Bar
/// - Use conditional visibility and enabled states
/// - Apply proper ID naming conventions
struct AddButtonEditorSolution: View {
  let settings = EngineSettings(license: secrets.licenseKey,
                                userID: "<your unique user id>")

  var editor: some View {
    Editor(settings)
      .imgly.configuration {
        DesignEditorConfiguration { builder in
          builder.navigationBar { navigationBar in
            navigationBar.items { _ in
              NavigationBar.ItemGroup(placement: .topBarLeading) {
                NavigationBar.Buttons.closeEditor()
              }
            }
            navigationBar.modify { _, items in
              // Add to trailing side
              items.addFirst(placement: .topBarTrailing) {
                NavigationBar.Button(
                  id: "my.app.navbar.button.help",
                ) { _ in
                  print("Help button tapped")
                } label: { _ in
                  Label("Help", systemImage: "questionmark.circle")
                }
              }

              // Add to leading side
              items.addLast(placement: .topBarLeading) {
                NavigationBar.Button(
                  id: "my.app.navbar.button.settings",
                ) { _ in
                  print("Settings button tapped")
                } label: { _ in
                  Label("Settings", systemImage: "gearshape")
                }
              }
            }
          }
          builder.dock { dock in
            dock.modify { _, items in
              items.addFirst {
                Dock.Button(
                  id: "my.app.dock.button.export",
                  action: { _ in
                    print("Custom export button tapped")
                  },
                  label: { _ in
                    Label("Export", systemImage: "square.and.arrow.up")
                  },
                )
              }
            }
          }
          builder.canvasMenu { canvasMenu in
            canvasMenu.modify { _, items in
              items.addFirst {
                CanvasMenu.Button(
                  id: "my.app.canvasMenu.button.favorite",
                  action: { _ in
                    print("Favorite button tapped")
                  },
                  label: { _ in
                    Label("Favorite", systemImage: "star.fill")
                  },
                  // Disable for stickers (shows grayed out)
                  isEnabled: { context in
                    context.selection.kind != "sticker"
                  },
                  // Only show for graphic blocks (hidden otherwise)
                  isVisible: { context in
                    context.selection.type == .graphic
                  },
                )
              }
            }
          }
          builder.inspectorBar { inspectorBar in
            inspectorBar.modify { _, items in
              items.addFirst {
                InspectorBar.Button(
                  id: "my.app.inspectorBar.button.process",
                  action: { _ in
                    print("Process button tapped")
                  },
                  label: { _ in
                    Label("Process", systemImage: "gearshape")
                  },
                  // Disable for text blocks (shows grayed out)
                  isEnabled: { context in
                    context.selection.type != .text
                  },
                  // Only show for blocks with fill (hidden otherwise)
                  isVisible: { context in
                    context.selection.fillType != nil
                  },
                )
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
  AddButtonEditorSolution()
}
```

Add custom buttons to extend editor functionality with app-specific actions across four UI components.

![iOS editor with custom buttons](https://img.ly/docs/cesdk/ios/user-interface/ui-extensions/add-new-button-74884d/assets/ios.hero.webp)

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.81.1-rc.0/editor-guides-ui-extensions-add-button)

## Overview

Add buttons using `builder.[component]` with `[component].modify` on the editor configuration. Each component provides context for conditional logic.

| Component | Selection Context | Best For |
|-----------|-------------------|----------|
| Dock | - | Global actions |
| CanvasMenu | `context.selection` | Selection-specific actions |
| InspectorBar | `context.selection` | Property-related actions |
| NavigationBar | - | App-level navigation |

## Adding to Dock

Add global action buttons using `builder.dock` with `dock.modify`. Use reverse domain notation for IDs to avoid conflicts.

```swift highlight-addNewButton-dock
builder.dock { dock in
  dock.modify { _, items in
    items.addFirst {
      Dock.Button(
        id: "my.app.dock.button.export",
        action: { _ in
          print("Custom export button tapped")
        },
        label: { _ in
          Label("Export", systemImage: "square.and.arrow.up")
        },
      )
    }
  }
}
```

- `id` - Unique identifier (e.g., `"my.app.dock.button.export"`)
- `action` - Closure executed on tap
- `label` - SwiftUI `Label` for button appearance

## Adding to Canvas Menu

Add selection-specific buttons using `builder.canvasMenu` with `canvasMenu.modify`. Use `context.selection` to control button state based on the selected element:

```swift highlight-addNewButton-canvasMenu
builder.canvasMenu { canvasMenu in
  canvasMenu.modify { _, items in
    items.addFirst {
      CanvasMenu.Button(
        id: "my.app.canvasMenu.button.favorite",
        action: { _ in
          print("Favorite button tapped")
        },
        label: { _ in
          Label("Favorite", systemImage: "star.fill")
        },
        // Disable for stickers (shows grayed out)
        isEnabled: { context in
          context.selection.kind != "sticker"
        },
        // Only show for graphic blocks (hidden otherwise)
        isVisible: { context in
          context.selection.type == .graphic
        },
      )
    }
  }
}
```

Use `isEnabled` and `isVisible` closures to control button state based on selection properties:

```swift highlight-addNewButton-conditional
// Disable for stickers (shows grayed out)
isEnabled: { context in
  context.selection.kind != "sticker"
},
// Only show for graphic blocks (hidden otherwise)
isVisible: { context in
  context.selection.type == .graphic
},
```

## Adding to Inspector Bar

Add property-related buttons using `builder.inspectorBar` with `inspectorBar.modify`. Use `isEnabled` and `isVisible` to control button state based on selection:

- `isEnabled` - When `false`, the button appears grayed out but remains visible
- `isVisible` - When `false`, the button is completely hidden

```swift highlight-addNewButton-inspectorBar
builder.inspectorBar { inspectorBar in
  inspectorBar.modify { _, items in
    items.addFirst {
      InspectorBar.Button(
        id: "my.app.inspectorBar.button.process",
        action: { _ in
          print("Process button tapped")
        },
        label: { _ in
          Label("Process", systemImage: "gearshape")
        },
        // Disable for text blocks (shows grayed out)
        isEnabled: { context in
          context.selection.type != .text
        },
        // Only show for blocks with fill (hidden otherwise)
        isVisible: { context in
          context.selection.fillType != nil
        },
      )
    }
  }
}
```

## Adding to Navigation Bar

Add app-level buttons using `builder.navigationBar` with `navigationBar.modify`. Specify placement for each button.

```swift highlight-addNewButton-navbar
            navigationBar.modify { _, items in
              // Add to trailing side
              items.addFirst(placement: .topBarTrailing) {
                NavigationBar.Button(
                  id: "my.app.navbar.button.help",
                ) { _ in
                  print("Help button tapped")
                } label: { _ in
                  Label("Help", systemImage: "questionmark.circle")
                }
              }

              // Add to leading side
              items.addLast(placement: .topBarLeading) {
                NavigationBar.Button(
                  id: "my.app.navbar.button.settings",
                ) { _ in
                  print("Settings button tapped")
                } label: { _ in
                  Label("Settings", systemImage: "gearshape")
                }
              }
            }
```

| Placement | Position |
|-----------|----------|
| `.topBarLeading` | Leading side |
| `.topBarTrailing` | Trailing side |
| `.principal` | Center |

## Button Parameters

All button types accept these parameters:

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `id` | `String` | Yes | - | Unique identifier |
| `action` | `(Context) -> Void` | Yes | - | Closure executed on tap |
| `label` | `(Context) -> Label` | Yes | - | Button appearance |
| `isEnabled` | `(Context) -> Bool` | No | `true` | When `false`, button is grayed out |
| `isVisible` | `(Context) -> Bool` | No | `true` | When `false`, button is hidden |

## API Reference

| API | Description |
|-----|-------------|
| `Dock.Button()` | Create a custom dock button |
| `CanvasMenu.Button()` | Create a canvas menu button |
| `InspectorBar.Button()` | Create an inspector bar button |
| `NavigationBar.Button()` | Create a navigation bar button |
| `builder.dock { dock in dock.modify { ... } }` | Insert buttons into the dock |
| `builder.canvasMenu { canvasMenu in canvasMenu.modify { ... } }` | Insert buttons into the canvas menu |
| `builder.inspectorBar { inspectorBar in inspectorBar.modify { ... } }` | Insert buttons into the inspector bar |
| `builder.navigationBar { navigationBar in navigationBar.modify { ... } }` | Insert buttons into the navigation bar |

## Next Steps

- [Rearrange Buttons](../customization/rearrange-buttons.md) - Customize button order in UI components
- [Customize Dock](../customization/dock.md) - Full dock customization patterns
- [Customize Navigation Bar](../customization/navigation-bar.md) - Navigation bar configuration
- [Canvas Menu](../customization/canvas-menu.md) - Contextual menu customization



---

## More Resources

- **[iOS Documentation Index](https://img.ly/docs/cesdk/ios/)** - Browse all iOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/ios/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/ios/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
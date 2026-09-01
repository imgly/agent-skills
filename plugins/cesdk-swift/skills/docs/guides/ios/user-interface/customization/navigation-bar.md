> This is one page of the CE.SDK iOS documentation. For a complete overview, see the [iOS Documentation Index](https://img.ly/docs/cesdk/ios/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/ios/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [User Interface](../../user-interface.md) > [Customization](../customization.md) > [Navigation Bar](./navigation-bar.md)

---

```swift file=@cesdk_swift_examples/editor-guides-configuration-navigation-bar/NavigationBarEditorSolution.swift reference-only
// swiftformat:disable unusedArguments
import IMGLYEditor
import SwiftUI

/// Editor demonstrating how to declare and modify navigation bar items.
///
/// The `editor` view shows the lesson — what the documentation renders. It
/// replaces the `GuideEditorConfiguration` baseline with `navigationBar.items`
/// and then exercises every `navigationBar.modify` operation on the result.
/// The `body` presents `demoEditor`, which keeps only the clean replacement so
/// the guide hero shows a tidy customized navigation bar.
struct NavigationBarEditorSolution: View {
  let settings = EngineSettings(license: secrets.licenseKey, // pass nil for evaluation mode with watermark
                                userID: "<your unique user id>")

  var editor: some View {
    Editor(settings)
      .imgly.configuration {
        GuideEditorConfiguration { builder in
          builder.navigationBar { navigationBar in
            navigationBar.items { _ in
              NavigationBar.ItemGroup(placement: .topBarLeading) {
                NavigationBar.Buttons.closeEditor()
              }
              NavigationBar.ItemGroup(placement: .topBarTrailing) {
                NavigationBar.Buttons.undo()
                NavigationBar.Buttons.redo()
                NavigationBar.Buttons.togglePagesMode()
                NavigationBar.Buttons.export()
              }
            }
            navigationBar.modify { _, items in
              items.addFirst(placement: .topBarTrailing) {
                NavigationBar.Button(id: "my.package.navigationBar.button.first") { _ in
                  print("First Button action")
                } label: { _ in
                  Label("First Button", systemImage: "arrow.backward.circle")
                }
              }
              items.addLast(placement: .topBarLeading) {
                NavigationBar.Button(id: "my.package.navigationBar.button.last") { _ in
                  print("Last Button action")
                } label: { _ in
                  Label("Last Button", systemImage: "arrow.forward.circle")
                }
              }
              items.addAfter(id: NavigationBar.Buttons.ID.undo) {
                NavigationBar.Button(id: "my.package.navigationBar.button.afterUndo") { _ in
                  print("After Undo action")
                } label: { _ in
                  Label("After Undo", systemImage: "arrow.forward.square")
                }
              }
              items.addBefore(id: NavigationBar.Buttons.ID.redo) {
                NavigationBar.Button(id: "my.package.navigationBar.button.beforeRedo") { _ in
                  print("Before Redo action")
                } label: { _ in
                  Label("Before Redo", systemImage: "arrow.backward.square")
                }
              }
              items.replace(id: NavigationBar.Buttons.ID.closeEditor) {
                NavigationBar.Buttons.closeEditor(
                  label: { _ in Label("Cancel", systemImage: "xmark") },
                )
              }
              items.replace(id: NavigationBar.Buttons.ID.export) {
                NavigationBar.Buttons.export(
                  label: { _ in Label("Done", systemImage: "checkmark") },
                )
              }
              items.remove(id: NavigationBar.Buttons.ID.togglePagesMode)
            }
          }
        }
      }
  }

  // Demo scaffolding (not part of the lesson). Presents only the
  // `navigationBar.items` replacement so the guide hero shows a clean
  // customized navigation bar without the modify operations layered on top.
  // The default `onCreate` builds the scene; the navigation bar is always
  // visible, so no canvas content or selection is needed for the hero.
  private var demoEditor: some View {
    Editor(settings)
      .imgly.configuration {
        GuideEditorConfiguration { builder in
          builder.navigationBar { navigationBar in
            navigationBar.items { _ in
              NavigationBar.ItemGroup(placement: .topBarLeading) {
                NavigationBar.Buttons.closeEditor()
              }
              NavigationBar.ItemGroup(placement: .topBarTrailing) {
                NavigationBar.Buttons.undo()
                NavigationBar.Buttons.redo()
                NavigationBar.Buttons.export()
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
        demoEditor
      }
    }
  }
}

#Preview {
  NavigationBarEditorSolution()
}
```

```swift file=@cesdk_swift_examples/editor-guides-configuration-navigation-bar/NavigationBarItemEditorSolution.swift reference-only
// swiftformat:disable unusedArguments
import IMGLYEditor
import SwiftUI

struct NavigationBarItemEditorSolution: View {
  let settings = EngineSettings(license: secrets.licenseKey, // pass nil for evaluation mode with watermark
                                userID: "<your unique user id>")

  var editor: some View {
    Editor(settings)
      .imgly.configuration {
        GuideEditorConfiguration { builder in
          builder.navigationBar { navigationBar in
            navigationBar.items { _ in
              NavigationBar.ItemGroup(placement: .topBarLeading) {
                NavigationBar.Buttons.closeEditor()
              }

              NavigationBar.ItemGroup(placement: .principal) {
                NavigationBar.Buttons.undo(
                  action: { context in
                    try context.engine?.editor.undo()
                  },
                  label: { context in
                    Label {
                      Text(.imgly.localized("ly_img_editor_navigation_bar_button_undo"))
                    } icon: {
                      Image.imgly.undo
                    }
                    .opacity(context.state.viewMode == .preview ? 0 : 1)
                    .labelStyle(.imgly.adaptiveIconOnly)
                  },
                  isEnabled: { context in
                    try !context.state.isCreating &&
                      context.state.viewMode != .preview &&
                      context.engine?.editor.canUndo() == true
                  },
                  isVisible: { _ in true },
                )

                NavigationBar.Button(
                  id: "my.package.navigationBar.button.newButton",
                ) { _ in
                  print("New Button action")
                } label: { _ in
                  Label("New Button", systemImage: "star.circle")
                } isEnabled: { _ in
                  true
                } isVisible: { _ in
                  true
                }
              }

              NavigationBar.ItemGroup(placement: .topBarTrailing) {
                CustomNavigationBarItem()
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

private struct CustomNavigationBarItem: NavigationBar.Item {
  var id: EditorComponentID {
    "my.package.navigationBar.newCustomItem"
  }

  func body(_ context: NavigationBar.Context) throws -> some View {
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

  func isVisible(_ context: NavigationBar.Context) throws -> Bool {
    true
  }
}

#Preview {
  NavigationBarItemEditorSolution()
}
```

Customize the editor's top navigation bar by replacing its items for strict control or modifying the baseline to extend it.

![Navigation Bar](https://img.ly/docs/cesdk/ios/user-interface/customization/navigation-bar-4e5d39/assets/ios.hero.webp)

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.83.0-nightly.20260901/editor-guides-configuration-navigation-bar)

## Navigation Bar Architecture

The navigation bar is the toolbar at the top of the editor. It houses session controls (close), editing operations (undo and redo), mode switching, and export, organized into three placement areas: leading, center, and trailing.

**Key types:**

- **`NavigationBar.Item`** — the protocol every navigation bar item conforms to.
- **`NavigationBar.Button`** — a prebuilt item with an action and a label.
- **`NavigationBar.ItemGroup`** — groups items under a placement (`.topBarLeading`, `.principal`, or `.topBarTrailing`).
- **`NavigationBar.Context`** — provides the engine, editor state, and event handler for customization logic.

## Configuration

Configure the navigation bar inside the editor's `EditorConfiguration` builder. Call `builder.navigationBar { navigationBar in … }` and pick one of two approaches:

| Approach | Method | Best for |
|----------|--------|----------|
| **Replacement** | `navigationBar.items` | Exact control over items and order, version-safe |
| **Modification** | `navigationBar.modify` | Extending or adjusting the existing items |

These examples build on `GuideEditorConfiguration`, a small helper class the iOS guides repository [ships as a minimal baseline](https://github.com/imgly/cesdk-swift-examples/blob/v1.83.0-nightly.20260901/editor-guides-quickstart/GuideEditorConfiguration.swift) — it sets a navigation bar with a close, undo, and redo button and nothing else. Substitute your own `EditorConfiguration`; the `navigationBar(_:)` builder is available on every configuration.

The [Configuration](../../configuration.md) guide covers how `EditorConfiguration` and `EngineSettings` set up the editor as a whole.

## Declaring the Item List

Use `navigationBar.items` to define the full item list from scratch, grouping items under a placement with `NavigationBar.ItemGroup`. This replaces the baseline entirely, so item order is guaranteed across editor versions.

```swift highlight-navigationBar-navigationBarItems
navigationBar.items { _ in
  NavigationBar.ItemGroup(placement: .topBarLeading) {
    NavigationBar.Buttons.closeEditor()
  }
  NavigationBar.ItemGroup(placement: .topBarTrailing) {
    NavigationBar.Buttons.undo()
    NavigationBar.Buttons.redo()
    NavigationBar.Buttons.togglePagesMode()
    NavigationBar.Buttons.export()
  }
}
```

- Each `NavigationBar.ItemGroup` places its items on the leading, center (`.principal`), or trailing side.
- Only the items you list appear — the baseline close, undo, and redo buttons are replaced.

## Modify Navigation Bar Items

Use `navigationBar.modify` to adjust the existing item list without rebuilding it. The closure receives the editor context and a mutable list of items grouped by placement.

```swift highlight-navigationBar-modifyNavigationBarItemsSignature
navigationBar.modify { _, items in
```

The list supports six operations:

| Operation | Purpose |
|-----------|---------|
| `addFirst(placement:_:)` | Prepend items to a placement group |
| `addLast(placement:_:)` | Append items to a placement group |
| `addBefore(id:_:)` | Insert before a specific item |
| `addAfter(id:_:)` | Insert after a specific item |
| `replace(id:_:)` | Replace an existing item |
| `remove(id:)` | Remove an item by its ID |

Prepend or append within a placement group:

```swift highlight-navigationBar-addFirst
items.addFirst(placement: .topBarTrailing) {
  NavigationBar.Button(id: "my.package.navigationBar.button.first") { _ in
    print("First Button action")
  } label: { _ in
    Label("First Button", systemImage: "arrow.backward.circle")
  }
}
```

```swift highlight-navigationBar-addLast
items.addLast(placement: .topBarLeading) {
  NavigationBar.Button(id: "my.package.navigationBar.button.last") { _ in
    print("Last Button action")
  } label: { _ in
    Label("Last Button", systemImage: "arrow.forward.circle")
  }
}
```

Position relative to an existing item:

```swift highlight-navigationBar-addAfter
items.addAfter(id: NavigationBar.Buttons.ID.undo) {
  NavigationBar.Button(id: "my.package.navigationBar.button.afterUndo") { _ in
    print("After Undo action")
  } label: { _ in
    Label("After Undo", systemImage: "arrow.forward.square")
  }
}
```

```swift highlight-navigationBar-addBefore
items.addBefore(id: NavigationBar.Buttons.ID.redo) {
  NavigationBar.Button(id: "my.package.navigationBar.button.beforeRedo") { _ in
    print("Before Redo action")
  } label: { _ in
    Label("Before Redo", systemImage: "arrow.backward.square")
  }
}
```

Replace or remove items by their ID:

```swift highlight-navigationBar-replace
items.replace(id: NavigationBar.Buttons.ID.closeEditor) {
  NavigationBar.Buttons.closeEditor(
    label: { _ in Label("Cancel", systemImage: "xmark") },
  )
}
items.replace(id: NavigationBar.Buttons.ID.export) {
  NavigationBar.Buttons.export(
    label: { _ in Label("Done", systemImage: "checkmark") },
  )
}
```

```swift highlight-navigationBar-remove
items.remove(id: NavigationBar.Buttons.ID.togglePagesMode)
```

> **Warning:** Operations that target a specific ID throw an error if the ID isn't in the list. Use the predefined ID constants such as `NavigationBar.Buttons.ID.undo`.

> **Note:** The order of items may change between editor versions, so use `navigationBar.modify` with care. Prefer full replacement with `navigationBar.items` when you need strict ordering across versions.

## NavigationBar.Item Configuration

Populate the navigation bar with predefined buttons, customized predefined buttons, new buttons, or fully custom items. Each item needs a unique `id` and lives inside a `NavigationBar.ItemGroup`.

### Use Predefined Buttons

Start with predefined buttons from the `NavigationBar.Buttons` namespace. The full set is listed in [List of Available Navigation Bar Buttons](./navigation-bar.md#list-of-available-navigation-bar-buttons).

```swift highlight-navigationBar-predefinedButton
NavigationBar.Buttons.closeEditor()
```

### Customize Predefined Buttons

Override a predefined button's `action`, `label`, `isEnabled`, or `isVisible` parameters to adjust its behavior. This example reproduces the default undo title and icon while dimming the label in preview mode and gating availability on whether an undo step exists.

```swift highlight-navigationBar-customizePredefinedButton
NavigationBar.Buttons.undo(
  action: { context in
    try context.engine?.editor.undo()
  },
  label: { context in
    Label {
      Text(.imgly.localized("ly_img_editor_navigation_bar_button_undo"))
    } icon: {
      Image.imgly.undo
    }
    .opacity(context.state.viewMode == .preview ? 0 : 1)
    .labelStyle(.imgly.adaptiveIconOnly)
  },
  isEnabled: { context in
    try !context.state.isCreating &&
      context.state.viewMode != .preview &&
      context.engine?.editor.canUndo() == true
  },
  isVisible: { _ in true },
)
```

- `action` — the work performed when the button is triggered.
- `label` — the view describing the button. Reproduce the default localized title so translations are preserved.
- `isEnabled` — whether the button responds to taps.
- `isVisible` — whether the button is shown.

### Create New Buttons

Create a button with `NavigationBar.Button(id:action:label:)` when the predefined options don't fit. Use reverse-domain notation for the `id`.

```swift highlight-navigationBar-newButton
NavigationBar.Button(
  id: "my.package.navigationBar.button.newButton",
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

- `id` (required) — a unique identifier for the button.
- `action` (required) — the work performed when the button is triggered.
- `label` (required) — a view describing the button. Don't encode visibility logic here.
- `isEnabled` — whether the button responds to taps. Defaults to `true`.
- `isVisible` — whether the button is shown. Defaults to `true`.

### Create Custom Items

For full control over rendering, conform a type to the `NavigationBar.Item` protocol:

```swift highlight-navigationBar-newCustomItemConformance
private struct CustomNavigationBarItem: NavigationBar.Item {
  var id: EditorComponentID {
    "my.package.navigationBar.newCustomItem"
  }

  func body(_ context: NavigationBar.Context) throws -> some View {
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

  func isVisible(_ context: NavigationBar.Context) throws -> Bool {
    true
  }
}
```

Then place the custom item inside an item group:

```swift highlight-navigationBar-newCustomItem
CustomNavigationBarItem()
```

- `id` (required) — a unique identifier for the item.
- `body(_:)` (required) — the item's view. Don't encode visibility logic here unless the layout space should be reserved when the item is hidden.
- `isVisible(_:)` — whether the item is shown. Defaults to `true`.

## List of Available Navigation Bar Buttons

Each function in the `NavigationBar.Buttons` namespace returns a `NavigationBar.Button` with default parameters you can override as shown in [Customize Predefined Buttons](./navigation-bar.md#customize-predefined-buttons).

| Button | ID | Description |
| --- | --- | --- |
| `NavigationBar.Buttons.closeEditor` | `NavigationBar.Buttons.ID.closeEditor` | Closes the editor, invoking the configuration's [onClose](../events.md#lifecycle-callbacks) callback. |
| `NavigationBar.Buttons.undo` | `NavigationBar.Buttons.ID.undo` | Performs an undo via the [EditorAPI.undo](../../concepts/undo-and-history.md) engine API. |
| `NavigationBar.Buttons.redo` | `NavigationBar.Buttons.ID.redo` | Performs a redo via the [EditorAPI.redo](../../concepts/undo-and-history.md) engine API. |
| `NavigationBar.Buttons.export` | `NavigationBar.Buttons.ID.export` | Exports the design, invoking the [onExport](../events.md#lifecycle-callbacks) callback. |
| `NavigationBar.Buttons.togglePreviewMode` | `NavigationBar.Buttons.ID.togglePreviewMode` | Toggles between edit and preview view mode. Intended for the Photo, Apparel, and Postcard editors. |
| `NavigationBar.Buttons.togglePagesMode` | `NavigationBar.Buttons.ID.togglePagesMode` | Toggles between edit and pages view mode. Intended for the Design editor. |
| `NavigationBar.Buttons.previousPage` | `NavigationBar.Buttons.ID.previousPage` | Navigates to the previous page. |
| `NavigationBar.Buttons.nextPage` | `NavigationBar.Buttons.ID.nextPage` | Navigates to the next page. |

## Next Steps

- [Dock](./dock.md) — Customize the bottom toolbar that opens asset libraries and sheets.
- [Inspector Bar](./inspector-bar.md) — Configure the context-sensitive editing controls.
- [Canvas Menu](./canvas-menu.md) — Customize the floating selection toolbar.
- [Asset Library](../../import-media/asset-library/customize.md) — Configure the sources used across editor components.



---

## More Resources

- **[iOS Documentation Index](https://img.ly/docs/cesdk/ios/)** - Browse all iOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/ios/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/ios/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [User Interface](../../user-interface.md) > [Customization](../customization.md) > [Hide Elements](./hide-elements.md)

---

```kotlin file=@cesdk_android_examples/editor-guides-configuration-hide-elements/HideElementsEditorSolution.kt reference-only
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.unit.dp
import ly.img.editor.Editor
import ly.img.editor.core.component.CanvasMenu
import ly.img.editor.core.component.Dock
import ly.img.editor.core.component.InspectorBar
import ly.img.editor.core.component.NavigationBar
import ly.img.editor.core.component.closeEditor
import ly.img.editor.core.component.crop
import ly.img.editor.core.component.delete
import ly.img.editor.core.component.duplicate
import ly.img.editor.core.component.modify
import ly.img.editor.core.component.redo
import ly.img.editor.core.component.remember
import ly.img.editor.core.component.rememberBringForward
import ly.img.editor.core.component.rememberCloseEditor
import ly.img.editor.core.component.rememberCrop
import ly.img.editor.core.component.rememberDelete
import ly.img.editor.core.component.rememberDuplicate
import ly.img.editor.core.component.rememberExport
import ly.img.editor.core.component.rememberFormatText
import ly.img.editor.core.component.rememberLayer
import ly.img.editor.core.component.rememberRedo
import ly.img.editor.core.component.rememberSendBackward
import ly.img.editor.core.component.rememberShapesLibrary
import ly.img.editor.core.component.rememberSystemCamera
import ly.img.editor.core.component.rememberSystemGallery
import ly.img.editor.core.component.rememberTextLibrary
import ly.img.editor.core.component.rememberUndo
import ly.img.editor.core.component.shapesLibrary
import ly.img.editor.core.component.textLibrary
import ly.img.editor.core.configuration.EditorConfiguration
import ly.img.editor.core.configuration.remember

@Composable
fun HideElementsEditorSolution(
    license: String,
    onClose: (Throwable?) -> Unit,
) {
    Editor(
        license = license,
        configuration = {
            EditorConfiguration.remember {
                dock = { rememberHiddenDock() }
                navigationBar = { rememberMinimalNavigationBar() }
                canvasMenu = { rememberCanvasMenuWithoutDuplicateAndDelete() }
                inspectorBar = { rememberInspectorBarWithoutCropAndDelete() }
            }
        },
        onClose = onClose,
    )
}

@Composable
private fun rememberHiddenDock() = Dock.remember {
    visible = { false }
}

@Composable
private fun rememberDockWithoutTextAndShapes() = Dock.remember {
    horizontalArrangement = { Arrangement.Center }
    listBuilder = {
        Dock.ListBuilder.remember {
            add { Dock.Button.rememberSystemGallery() }
            add { Dock.Button.rememberSystemCamera() }
            add { Dock.Button.rememberTextLibrary() }
            add { Dock.Button.rememberShapesLibrary() }
        }.modify {
            remove(id = Dock.Button.Id.textLibrary, failIfNotFound = true)
            remove(id = Dock.Button.Id.shapesLibrary, failIfNotFound = true)
        }
    }
}

@Composable
private fun rememberNavigationBarWithoutCloseAndRedo() = NavigationBar.remember {
    listBuilder = {
        NavigationBar.ListBuilder.remember {
            aligned(alignment = Alignment.Start) {
                add { NavigationBar.Button.rememberCloseEditor() }
            }
            aligned(
                alignment = Alignment.End,
                arrangement = Arrangement.spacedBy(2.dp),
            ) {
                add { NavigationBar.Button.rememberUndo() }
                add { NavigationBar.Button.rememberRedo() }
                add { NavigationBar.Button.rememberExport() }
            }
        }.modify {
            remove(id = NavigationBar.Button.Id.closeEditor, failIfNotFound = true)
            remove(id = NavigationBar.Button.Id.redo, failIfNotFound = true)
        }
    }
}

@Composable
private fun rememberCanvasMenuWithoutDuplicateAndDelete() = CanvasMenu.remember {
    listBuilder = {
        CanvasMenu.ListBuilder.remember {
            add { CanvasMenu.Button.rememberBringForward() }
            add { CanvasMenu.Button.rememberSendBackward() }
            add { CanvasMenu.Button.rememberDuplicate() }
            add { CanvasMenu.Button.rememberDelete() }
        }.modify {
            remove(id = CanvasMenu.Button.Id.duplicate, failIfNotFound = true)
            remove(id = CanvasMenu.Button.Id.delete, failIfNotFound = true)
        }
    }
}

@Composable
private fun rememberInspectorBarWithoutCropAndDelete() = InspectorBar.remember {
    listBuilder = {
        InspectorBar.ListBuilder.remember {
            add { InspectorBar.Button.rememberLayer() }
            add { InspectorBar.Button.rememberCrop() }
            add { InspectorBar.Button.rememberFormatText() }
            add { InspectorBar.Button.rememberDelete() }
        }.modify {
            remove(id = InspectorBar.Button.Id.crop, failIfNotFound = true)
            remove(id = InspectorBar.Button.Id.delete, failIfNotFound = true)
        }
    }
}

@Composable
private fun rememberMinimalNavigationBar() = NavigationBar.remember {
    listBuilder = {
        NavigationBar.ListBuilder.remember {
            aligned(alignment = Alignment.Start) {
                add { NavigationBar.Button.rememberCloseEditor() }
            }
            aligned(
                alignment = Alignment.End,
                arrangement = Arrangement.spacedBy(2.dp),
            ) {
                add { NavigationBar.Button.rememberUndo() }
                add { NavigationBar.Button.rememberExport() }
            }
        }
    }
}
```

Hide complete editor components or remove individual buttons to create a more
focused editing experience.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.83.0-nightly.20260904/editor-guides-configuration-hide-elements)

## Overview

CE.SDK editor components are configured through `EditorConfiguration`. You can hide a whole component with its `visible` property, or keep the component visible and remove specific actions from its `listBuilder`.

| Approach | Android API | Result |
|----------|-------------|--------|
| Hide component | `visible = { false }` on the component builder | The component does not render or reserve editor space |
| Remove items | `listBuilder.modify { remove(id = ...) }` | The selected buttons are removed while the component remains available |

> **Note:** The [Design Editor Starter Kit](../../starterkits/design-editor.md) shows a complete
> editor surface. The snippets below stay focused on the editor configuration
> APIs so you can apply them to your own editor setup.

## Hiding the Dock

Set `visible` to `false` on `Dock.remember` when the dock should be hidden for the whole editing session:

```kotlin highlight-android-hide-dock
@Composable
private fun rememberHiddenDock() = Dock.remember {
    visible = { false }
}
```

Use this approach when the component itself should disappear. Removing every dock item only removes the actions from the list builder; `visible = { false }` also removes the component container.

## Removing Items from the Dock

Start from the dock buttons your editor needs, then call `modify` on the list builder and remove buttons by their typed IDs:

```kotlin highlight-android-remove-dock-items
@Composable
private fun rememberDockWithoutTextAndShapes() = Dock.remember {
    horizontalArrangement = { Arrangement.Center }
    listBuilder = {
        Dock.ListBuilder.remember {
            add { Dock.Button.rememberSystemGallery() }
            add { Dock.Button.rememberSystemCamera() }
            add { Dock.Button.rememberTextLibrary() }
            add { Dock.Button.rememberShapesLibrary() }
        }.modify {
            remove(id = Dock.Button.Id.textLibrary, failIfNotFound = true)
            remove(id = Dock.Button.Id.shapesLibrary, failIfNotFound = true)
        }
    }
}
```

This example removes the text and shape library buttons while keeping the gallery and camera buttons available.

## Removing Items from the Navigation Bar

Navigation bar items are usually grouped with `aligned`. Keep those groups in the source list builder, then remove buttons by ID:

```kotlin highlight-android-remove-navigation-bar-items
@Composable
private fun rememberNavigationBarWithoutCloseAndRedo() = NavigationBar.remember {
    listBuilder = {
        NavigationBar.ListBuilder.remember {
            aligned(alignment = Alignment.Start) {
                add { NavigationBar.Button.rememberCloseEditor() }
            }
            aligned(
                alignment = Alignment.End,
                arrangement = Arrangement.spacedBy(2.dp),
            ) {
                add { NavigationBar.Button.rememberUndo() }
                add { NavigationBar.Button.rememberRedo() }
                add { NavigationBar.Button.rememberExport() }
            }
        }.modify {
            remove(id = NavigationBar.Button.Id.closeEditor, failIfNotFound = true)
            remove(id = NavigationBar.Button.Id.redo, failIfNotFound = true)
        }
    }
}
```

Here the close and redo actions are removed, while undo and export remain in the end-aligned group.

## Removing Items from the Canvas Menu

The canvas menu appears for selected blocks. Remove contextual actions from its list builder when users should not see specific operations:

```kotlin highlight-android-remove-canvas-menu-items
@Composable
private fun rememberCanvasMenuWithoutDuplicateAndDelete() = CanvasMenu.remember {
    listBuilder = {
        CanvasMenu.ListBuilder.remember {
            add { CanvasMenu.Button.rememberBringForward() }
            add { CanvasMenu.Button.rememberSendBackward() }
            add { CanvasMenu.Button.rememberDuplicate() }
            add { CanvasMenu.Button.rememberDelete() }
        }.modify {
            remove(id = CanvasMenu.Button.Id.duplicate, failIfNotFound = true)
            remove(id = CanvasMenu.Button.Id.delete, failIfNotFound = true)
        }
    }
}
```

The snippet keeps layer ordering actions and removes duplicate and delete.

## Removing Items from the Inspector Bar

The inspector bar is also selection-dependent. Configure the available actions with `InspectorBar.ListBuilder.remember`, then remove any actions that do not belong in your workflow:

```kotlin highlight-android-remove-inspector-bar-items
@Composable
private fun rememberInspectorBarWithoutCropAndDelete() = InspectorBar.remember {
    listBuilder = {
        InspectorBar.ListBuilder.remember {
            add { InspectorBar.Button.rememberLayer() }
            add { InspectorBar.Button.rememberCrop() }
            add { InspectorBar.Button.rememberFormatText() }
            add { InspectorBar.Button.rememberDelete() }
        }.modify {
            remove(id = InspectorBar.Button.Id.crop, failIfNotFound = true)
            remove(id = InspectorBar.Button.Id.delete, failIfNotFound = true)
        }
    }
}
```

This keeps layer and text formatting actions while removing crop and delete.

Each component exposes built-in button IDs through its own namespace:

| Component | ID namespace | Example |
|-----------|--------------|---------|
| Dock | `Dock.Button.Id.*` | `Dock.Button.Id.textLibrary` |
| Navigation Bar | `NavigationBar.Button.Id.*` | `NavigationBar.Button.Id.closeEditor` |
| Canvas Menu | `CanvasMenu.Button.Id.*` | `CanvasMenu.Button.Id.delete` |
| Inspector Bar | `InspectorBar.Button.Id.*` | `InspectorBar.Button.Id.crop` |

## Creating a Minimal UI

Combine the same patterns to build a canvas-focused editor. Hide the dock and replace the navigation bar with only the actions you want to keep:

```kotlin highlight-android-minimal-ui
dock = { rememberHiddenDock() }
navigationBar = { rememberMinimalNavigationBar() }
```

Define the reduced navigation bar as a small list builder:

```kotlin highlight-android-minimal-navigation-bar
@Composable
private fun rememberMinimalNavigationBar() = NavigationBar.remember {
    listBuilder = {
        NavigationBar.ListBuilder.remember {
            aligned(alignment = Alignment.Start) {
                add { NavigationBar.Button.rememberCloseEditor() }
            }
            aligned(
                alignment = Alignment.End,
                arrangement = Arrangement.spacedBy(2.dp),
            ) {
                add { NavigationBar.Button.rememberUndo() }
                add { NavigationBar.Button.rememberExport() }
            }
        }
    }
}
```

Use a new list builder when you want full control over the visible actions. Use `modify` when you want to start from an existing component and remove only a few items.

## API Reference

| API | Purpose |
|-----|---------|
| `EditorConfiguration.remember { ... }` | Creates the editor configuration that owns component customization |
| `Dock.remember { visible = { false } }` | Configures the dock and hides it completely |
| `Dock.ListBuilder.remember { ... }` | Defines dock buttons before removal |
| `NavigationBar.ListBuilder.remember { ... }` | Defines navigation bar buttons and alignment groups before removal |
| `CanvasMenu.ListBuilder.remember { ... }` | Defines contextual canvas menu actions before removal |
| `InspectorBar.ListBuilder.remember { ... }` | Defines inspector bar actions before removal |
| `listBuilder.modify { remove(id=_, failIfNotFound=_) }` | Removes an existing component item from a list builder |

## Next Steps

- [Customize Dock](./dock.md) - Full dock customization patterns
- [Customize Navigation Bar](./navigation-bar.md) - Navigation bar configuration
- [Rearrange Buttons](./rearrange-buttons.md) - Learn how to reorder buttons and components in CE.SDK's navigation bar, canvas menu, canvas bar, dock, and inspector bar using the Ordering APIs.
- [Add a New Button](../ui-extensions/add-new-button.md) - Add a custom button to the UI to trigger specific actions or workflows.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
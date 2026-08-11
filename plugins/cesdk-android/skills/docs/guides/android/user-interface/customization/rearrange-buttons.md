> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [User Interface](../../user-interface.md) > [Customization](../customization.md) > [Rearrange Buttons](./rearrange-buttons.md)

---

```kotlin file=@cesdk_android_examples/editor-guides-customization-rearrange-buttons/RearrangeButtonsEditorSolution.kt reference-only
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import ly.img.editor.Editor
import ly.img.editor.configuration.design.DesignConfigurationBuilder
import ly.img.editor.core.component.CanvasMenu
import ly.img.editor.core.component.Dock
import ly.img.editor.core.component.EditorComponentId
import ly.img.editor.core.component.InspectorBar
import ly.img.editor.core.component.NavigationBar
import ly.img.editor.core.component.bringForward
import ly.img.editor.core.component.duplicate
import ly.img.editor.core.component.imglyCamera
import ly.img.editor.core.component.layer
import ly.img.editor.core.component.modify
import ly.img.editor.core.component.redo
import ly.img.editor.core.component.remember
import ly.img.editor.core.component.rememberDuplicate
import ly.img.editor.core.component.rememberRedo
import ly.img.editor.core.component.rememberTextLibrary
import ly.img.editor.core.component.rememberUndo
import ly.img.editor.core.component.selectGroup
import ly.img.editor.core.component.sendBackward
import ly.img.editor.core.component.textLibrary
import ly.img.editor.core.component.undo
import ly.img.editor.core.configuration.EditorConfiguration
import ly.img.editor.core.configuration.remember
import ly.img.editor.core.configuration.then

@Composable
fun RearrangeButtonsEditorSolution(
    license: String,
    onClose: (Throwable?) -> Unit,
) {
    Editor(
        license = license,
        configuration = {
            EditorConfiguration.remember(::DesignConfigurationBuilder).then {
                navigationBar = navigationBarComponent@{
                    val sourceNavigationBar =
                        parentConfiguration?.navigationBar as? NavigationBar ?: return@navigationBarComponent null
                    val updatedListBuilder = sourceNavigationBar.listBuilder.modify {
                        remove(id = NavigationBar.Button.Id.undo, failIfNotFound = true)
                        remove(id = NavigationBar.Button.Id.redo, failIfNotFound = true)
                        addFirst(alignment = Alignment.Start) {
                            NavigationBar.Button.rememberUndo()
                        }
                        addFirst(alignment = Alignment.Start) {
                            NavigationBar.Button.rememberRedo()
                        }
                    }
                    remember(sourceNavigationBar, updatedListBuilder) {
                        sourceNavigationBar.copy(listBuilder = updatedListBuilder)
                    }
                }
                canvasMenu = canvasMenuComponent@{
                    val sourceCanvasMenu =
                        parentConfiguration?.canvasMenu as? CanvasMenu ?: return@canvasMenuComponent null
                    val updatedListBuilder = sourceCanvasMenu.listBuilder.modify {
                        // These divider IDs come from the Design Editor Starter Kit.
                        // Give custom dividers stable IDs and remove those IDs instead.
                        val designCanvasMenuDivider1 = EditorComponentId("ly.img.component.canvasMenu.divider1")
                        val designCanvasMenuDivider2 = EditorComponentId("ly.img.component.canvasMenu.divider2")
                        remove(id = designCanvasMenuDivider1, failIfNotFound = false)
                        remove(id = CanvasMenu.Button.Id.bringForward, failIfNotFound = false)
                        remove(id = CanvasMenu.Button.Id.selectGroup, failIfNotFound = false)
                        remove(id = CanvasMenu.Button.Id.sendBackward, failIfNotFound = false)
                        remove(id = designCanvasMenuDivider2, failIfNotFound = false)
                    }
                    remember(sourceCanvasMenu, updatedListBuilder) {
                        sourceCanvasMenu.copy(listBuilder = updatedListBuilder)
                    }
                }
                dock = dockComponent@{
                    val sourceDock = parentConfiguration?.dock as? Dock ?: return@dockComponent null
                    val updatedListBuilder = sourceDock.listBuilder.modify {
                        remove(id = Dock.Button.Id.textLibrary, failIfNotFound = true)
                        addFirst {
                            Dock.Button.rememberTextLibrary()
                        }
                        remove(id = Dock.Button.Id.imglyCamera, failIfNotFound = true)
                    }
                    remember(sourceDock, updatedListBuilder) {
                        sourceDock.copy(listBuilder = updatedListBuilder)
                    }
                }
                inspectorBar = inspectorBarComponent@{
                    val sourceInspectorBar =
                        parentConfiguration?.inspectorBar as? InspectorBar ?: return@inspectorBarComponent null
                    val updatedListBuilder = sourceInspectorBar.listBuilder.modify {
                        remove(id = InspectorBar.Button.Id.duplicate, failIfNotFound = true)
                        addBefore(id = InspectorBar.Button.Id.layer, failIfNotFound = true) {
                            InspectorBar.Button.rememberDuplicate()
                        }
                    }
                    remember(sourceInspectorBar, updatedListBuilder) {
                        sourceInspectorBar.copy(listBuilder = updatedListBuilder)
                    }
                }
            }
        },
        onClose = onClose,
    )
}
```

Reorder buttons across the navigation bar, canvas menu, dock, and inspector
bar to prioritize actions for your workflows.

![Rearranged Android dock buttons](https://img.ly/docs/cesdk/android/user-interface/customization/rearrange-buttons-97022a/assets/android.hero.png)

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.81.0-nightly.20260811/editor-guides-customization-rearrange-buttons)

## Overview

CE.SDK editor components expose list builders for their button order. Start with
the existing component from `parentConfiguration`, call `listBuilder.modify`,
then remove, insert, or replace items by stable button IDs.

| Operation | Purpose |
| --- | --- |
| `addFirst` | Insert at the beginning |
| `addLast` | Insert at the end |
| `addBefore` | Insert before a matching ID |
| `addAfter` | Insert after a matching ID |
| `replace` | Replace a matching ID |
| `remove` | Remove a matching ID |

ID-based operations accept `failIfNotFound`. Keep the default `true` when the
example expects the item to exist in the current editor configuration.

Default item order can change between editor versions. Use `modify` when you
want to adapt the current default configuration; if your workflow needs strict
ordering, define the complete component list with the component-specific
`*.ListBuilder.remember { ... }` APIs instead.

> **Note:** This example starts from the [Design Editor Starter Kit](../../starterkits/design-editor.md)
> with `EditorConfiguration.remember(::DesignConfigurationBuilder).then { ... }`,
> so `parentConfiguration` provides the Starter Kit components to rearrange. If
> you copy these component lambdas into a fresh `EditorConfiguration.remember`
> block, there are no Starter Kit components to inherit; pass in an existing
> configuration or component to modify, or build your own list builder.

## Rearranging the Navigation Bar

The navigation bar can use aligned item groups. When the source builder uses
aligned groups, pass the target `Alignment` to `addFirst` or `addLast`. Here we
move undo and redo from the trailing group to the leading group.

```kotlin highlight-android-navigation-bar
navigationBar = navigationBarComponent@{
    val sourceNavigationBar =
        parentConfiguration?.navigationBar as? NavigationBar ?: return@navigationBarComponent null
    val updatedListBuilder = sourceNavigationBar.listBuilder.modify {
        remove(id = NavigationBar.Button.Id.undo, failIfNotFound = true)
        remove(id = NavigationBar.Button.Id.redo, failIfNotFound = true)
        addFirst(alignment = Alignment.Start) {
            NavigationBar.Button.rememberUndo()
        }
        addFirst(alignment = Alignment.Start) {
            NavigationBar.Button.rememberRedo()
        }
    }
    remember(sourceNavigationBar, updatedListBuilder) {
        sourceNavigationBar.copy(listBuilder = updatedListBuilder)
    }
}
```

Common navigation bar IDs include `NavigationBar.Button.Id.closeEditor`,
`NavigationBar.Button.Id.undo`, `NavigationBar.Button.Id.redo`, and
`NavigationBar.Button.Id.export`.

## Rearranging the Canvas Menu

The canvas menu appears next to the selected block. Remove contextual actions
that should not be prominent in your workflow while leaving the remaining
default actions in their existing order. When you remove a grouped action
cluster, remove its adjacent dividers as well so the remaining buttons stay
visually grouped. The divider IDs shown here belong to the Design Editor
Starter Kit; custom configurations should assign stable IDs to their own
dividers and remove those IDs instead. `failIfNotFound = false` is useful when
extending configurations where those IDs may not be present.

```kotlin highlight-android-canvas-menu
canvasMenu = canvasMenuComponent@{
    val sourceCanvasMenu =
        parentConfiguration?.canvasMenu as? CanvasMenu ?: return@canvasMenuComponent null
    val updatedListBuilder = sourceCanvasMenu.listBuilder.modify {
        // These divider IDs come from the Design Editor Starter Kit.
        // Give custom dividers stable IDs and remove those IDs instead.
        val designCanvasMenuDivider1 = EditorComponentId("ly.img.component.canvasMenu.divider1")
        val designCanvasMenuDivider2 = EditorComponentId("ly.img.component.canvasMenu.divider2")
        remove(id = designCanvasMenuDivider1, failIfNotFound = false)
        remove(id = CanvasMenu.Button.Id.bringForward, failIfNotFound = false)
        remove(id = CanvasMenu.Button.Id.selectGroup, failIfNotFound = false)
        remove(id = CanvasMenu.Button.Id.sendBackward, failIfNotFound = false)
        remove(id = designCanvasMenuDivider2, failIfNotFound = false)
    }
    remember(sourceCanvasMenu, updatedListBuilder) {
        sourceCanvasMenu.copy(listBuilder = updatedListBuilder)
    }
}
```

Common canvas menu IDs include `CanvasMenu.Button.Id.bringForward`,
`CanvasMenu.Button.Id.sendBackward`, `CanvasMenu.Button.Id.duplicate`, and
`CanvasMenu.Button.Id.delete`.

## Rearranging the Dock

The dock provides access to libraries and tools at the bottom of the editor. In
this example, we move the text library to the first position and remove the
camera button inherited from the Design Editor Starter Kit.

```kotlin highlight-android-dock
dock = dockComponent@{
    val sourceDock = parentConfiguration?.dock as? Dock ?: return@dockComponent null
    val updatedListBuilder = sourceDock.listBuilder.modify {
        remove(id = Dock.Button.Id.textLibrary, failIfNotFound = true)
        addFirst {
            Dock.Button.rememberTextLibrary()
        }
        remove(id = Dock.Button.Id.imglyCamera, failIfNotFound = true)
    }
    remember(sourceDock, updatedListBuilder) {
        sourceDock.copy(listBuilder = updatedListBuilder)
    }
}
```

Common dock IDs include `Dock.Button.Id.systemGallery`,
`Dock.Button.Id.imglyCamera`, `Dock.Button.Id.textLibrary`, and
`Dock.Button.Id.shapesLibrary`.

## Rearranging the Inspector Bar

The inspector bar shows contextual actions for the selected block. Move the
duplicate action before layer options by removing it first, then adding it back
before `InspectorBar.Button.Id.layer`.

```kotlin highlight-android-inspector-bar
inspectorBar = inspectorBarComponent@{
    val sourceInspectorBar =
        parentConfiguration?.inspectorBar as? InspectorBar ?: return@inspectorBarComponent null
    val updatedListBuilder = sourceInspectorBar.listBuilder.modify {
        remove(id = InspectorBar.Button.Id.duplicate, failIfNotFound = true)
        addBefore(id = InspectorBar.Button.Id.layer, failIfNotFound = true) {
            InspectorBar.Button.rememberDuplicate()
        }
    }
    remember(sourceInspectorBar, updatedListBuilder) {
        sourceInspectorBar.copy(listBuilder = updatedListBuilder)
    }
}
```

Common inspector bar IDs include `InspectorBar.Button.Id.layer`,
`InspectorBar.Button.Id.crop`, `InspectorBar.Button.Id.formatText`, and
`InspectorBar.Button.Id.delete`.

## API Reference

| API | Purpose |
| --- | --- |
| `EditorConfiguration.remember(builderFactory=_)` | Creates the base editor configuration |
| `EditorConfiguration.then(builder=_)` | Extends an existing editor configuration |
| `NavigationBar.ListBuilder.remember(builder=_)` | Builds navigation bar items |
| `CanvasMenu.ListBuilder.remember(builder=_)` | Builds canvas menu items |
| `Dock.ListBuilder.remember(builder=_)` | Builds dock items |
| `InspectorBar.ListBuilder.remember(builder=_)` | Builds inspector bar items |
| `listBuilder.modify(builder=_)` | Applies list-builder changes without replacing the whole component |
| `addFirst(alignment=_, block=_)` | Inserts an item at the beginning of an aligned group |
| `addFirst(block=_)` | Inserts an item at the beginning of an unaligned list |
| `addLast(alignment=_, block=_)` | Inserts an item at the end of an aligned group |
| `addLast(block=_)` | Inserts an item at the end of an unaligned list |
| `addBefore(id=_, failIfNotFound=_, block=_)` | Inserts an item before a matching component ID |
| `addAfter(id=_, failIfNotFound=_, block=_)` | Inserts an item after a matching component ID |
| `replace(id=_, failIfNotFound=_, block=_)` | Replaces an item with a matching component ID |
| `remove(id=_, failIfNotFound=_)` | Removes an item with a matching component ID |

## Next Steps

- [Add a New Button](../ui-extensions/add-new-button.md) - Add a custom button to the UI to trigger specific actions or workflows.
- [Hide Elements](./hide-elements.md) - Learn how to hide and show UI elements in CE.SDK using the Feature API, ordering APIs, and panel management across different platforms.
- [Canvas Menu](./canvas-menu.md) - Full canvas menu customization
- [Dock](./dock.md) - Full dock customization



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
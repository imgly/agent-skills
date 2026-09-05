> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [User Interface](../../user-interface.md) > [UI Extensions](../ui-extensions.md) > [Create Custom Panel](./create-custom-panel.md)

---

```kotlin file=@cesdk_android_examples/editor-guides-ui-extensions-create-custom-panel/CreateCustomPanelSolution.kt reference-only
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.material3.Button
import androidx.compose.material3.Icon
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Slider
import androidx.compose.material3.Switch
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import ly.img.editor.Editor
import ly.img.editor.core.EditorContext
import ly.img.editor.core.component.EditorComponentId
import ly.img.editor.core.component.InspectorBar
import ly.img.editor.core.component.data.Height
import ly.img.editor.core.component.remember
import ly.img.editor.core.configuration.EditorConfiguration
import ly.img.editor.core.configuration.remember
import ly.img.editor.core.event.EditorEvent
import ly.img.editor.core.iconpack.IconPack
import ly.img.editor.core.iconpack.Preview
import ly.img.editor.core.sheet.SheetStyle
import ly.img.editor.core.sheet.SheetType
import ly.img.engine.DesignBlock
import ly.img.engine.DesignBlockType
import ly.img.engine.FillType
import ly.img.engine.ShapeType
import ly.img.engine.Color as EngineColor

private const val CREATE_CUSTOM_PANEL_DEMO_BLOCK_NAME = "com.example.guides.createCustomPanel.selection"

@Composable
fun CreateCustomPanelSolution(
    license: String,
    onClose: (Throwable?) -> Unit,
) {
    Editor(
        license = license, // pass null or empty for evaluation mode with watermark
        configuration = {
            EditorConfiguration.remember {
                onLoaded = {
                    val engine = editorContext.engine
                    val scene = engine.scene.get() ?: engine.scene.create()
                    val page = engine.scene.getCurrentPage() ?: engine.scene.getPages().firstOrNull() ?: engine.block
                        .create(DesignBlockType.Page)
                        .also {
                            engine.block.setWidth(block = it, value = 1080F)
                            engine.block.setHeight(block = it, value = 1080F)
                            engine.block.appendChild(parent = scene, child = it)
                        }
                    val block = engine.block.findByName(CREATE_CUSTOM_PANEL_DEMO_BLOCK_NAME).firstOrNull() ?: engine.block
                        .create(DesignBlockType.Graphic)
                        .also {
                            engine.block.setName(block = it, name = CREATE_CUSTOM_PANEL_DEMO_BLOCK_NAME)
                            engine.block.setShape(
                                block = it,
                                shape = engine.block.createShape(ShapeType.Rect),
                            )
                            val fill = engine.block.createFill(FillType.Color)
                            engine.block.setFill(block = it, fill = fill)
                            engine.block.setFillSolidColor(
                                block = it,
                                color = EngineColor.fromRGBA(r = 0.32F, g = 0.58F, b = 0.94F, a = 1F),
                            )
                            engine.block.setWidth(block = it, value = 320F)
                            engine.block.setHeight(block = it, value = 220F)
                            engine.block.setPositionX(block = it, value = 380F)
                            engine.block.setPositionY(block = it, value = 360F)
                            engine.block.appendChild(parent = page, child = it)
                        }
                    engine.block.bringToFront(block = block)
                    engine.block.setSelected(block = block, selected = true)
                    engine.scene.zoomToBlock(page)

                    parentConfiguration?.onLoaded?.invoke(this)
                }
                inspectorBar = {
                    InspectorBar.remember {
                        listBuilder = {
                            InspectorBar.ListBuilder.remember {
                                add { openCreateCustomPanelButton }
                            }
                        }
                    }
                }
            }
        },
        onClose = onClose,
    )
}

val openCreateCustomPanelButton
    @Composable get() =
        InspectorBar.Button.remember {
            id = { EditorComponentId("open_create_custom_panel") }
            text = { Text("Properties") }
            icon = { Icon(IconPack.Preview, contentDescription = "Open properties panel") }
            onClick = {
                val selectedBlock = editorContext.selection.designBlock
                editorContext.eventHandler.send(
                    EditorEvent.Sheet.Open(createCustomPanelSheetType(selectedBlock)),
                )
            }
        }

fun createCustomPanelSheetType(block: DesignBlock): SheetType = SheetType.Custom(
    style = SheetStyle(
        isFloating = false,
        minHeight = Height.Exactly(0.dp),
        maxHeight = Height.Fraction(0.7F),
        isHalfExpandingEnabled = false,
        isHalfExpandedInitially = false,
        animateInitialValue = true,
    ),
    content = {
        CreateCustomPanelPropertyPanel(editorContext = editorContext, block = block)
    },
)

@Composable
fun CreateCustomPanelPropertyPanel(
    editorContext: EditorContext,
    block: DesignBlock,
) {
    val engine = editorContext.engine
    var name by remember(block) {
        mutableStateOf(runCatching { engine.block.getName(block) }.getOrDefault(""))
    }
    var opacity by remember(block) {
        mutableStateOf(runCatching { engine.block.getOpacity(block) }.getOrDefault(1F))
    }
    var isVisible by remember(block) {
        mutableStateOf(runCatching { engine.block.isVisible(block) }.getOrDefault(true))
    }

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .navigationBarsPadding()
            .padding(16.dp),
        horizontalAlignment = Alignment.Start,
    ) {
        Text("Block properties")
        Spacer(modifier = Modifier.height(16.dp))
        OutlinedTextField(
            modifier = Modifier.fillMaxWidth(),
            value = name,
            onValueChange = { name = it },
            label = { Text("Name") },
            singleLine = true,
        )
        Spacer(modifier = Modifier.height(24.dp))
        Text("Opacity")
        Slider(
            value = opacity,
            onValueChange = { opacity = it },
            valueRange = 0F..1F,
        )
        Spacer(modifier = Modifier.height(16.dp))
        Row(verticalAlignment = Alignment.CenterVertically) {
            Switch(
                checked = isVisible,
                onCheckedChange = { isVisible = it },
            )
            Spacer(modifier = Modifier.width(12.dp))
            Text("Visible")
        }
        Spacer(modifier = Modifier.height(24.dp))
        Button(
            modifier = Modifier.align(Alignment.End),
            onClick = {
                engine.block.setName(block, name = name)
                engine.block.setOpacity(block = block, value = opacity)
                engine.block.setVisible(block = block, visible = isVisible)
                editorContext.eventHandler.send(EditorEvent.Sheet.Close(animate = true))
            },
        ) {
            Text("Done")
        }
    }
}
```

Build a functional custom panel — a property editor that opens from an inspector bar button, edits the selected block, and writes changes back to the scene.

![Custom panel on Android](https://img.ly/docs/cesdk/android/user-interface/ui-extensions/create-custom-panel-d87b83/assets/android.hero.webp)

> **Reading time:** 6 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.83.0-nightly.20260905/editor-guides-ui-extensions-create-custom-panel)

## Overview

Custom panels on Android are editor sheets whose content you build with native
Jetpack Compose. You present your own composable and wire it to the engine
directly — there is no panel registration step and no component catalog. This
guide builds a property editor: a button in the inspector bar opens a sheet that
edits the selected block's name, opacity, and visibility.

The example builds on `EditorConfiguration.remember { ... }`, the standard
Android editor configuration entry point. Substitute your own editor
configuration as needed — the `inspectorBar` slot is exposed on every
configuration. The [Configuration](../../configuration.md) guide covers how
editor configuration sets up the editor as a whole, and the
[Panel](../customization/panel.md) guide covers the sheet mechanism — sheet types,
presentation styles, and the built-in sheets — that this guide builds on.

## Opening the Panel from the Inspector Bar

The inspector bar is the surface the editor shows for the current selection,
which makes it the natural home for a panel that edits the selected block. Add
an inspector bar button whose action opens the sheet. The button has access to
`editorContext`, including the `engine`, the `eventHandler`, and the current
`selection`. Read the selected block from `editorContext.selection.designBlock`,
then open a `SheetType.Custom` that renders the property panel.

```kotlin highlight-android-inspector-button
InspectorBar.Button.remember {
    id = { EditorComponentId("open_create_custom_panel") }
    text = { Text("Properties") }
    icon = { Icon(IconPack.Preview, contentDescription = "Open properties panel") }
    onClick = {
        val selectedBlock = editorContext.selection.designBlock
        editorContext.eventHandler.send(
            EditorEvent.Sheet.Open(createCustomPanelSheetType(selectedBlock)),
        )
    }
}
```

- Replacing `inspectorBar.listBuilder` replaces the inspector bar's contents;
  include any other items your app needs in the same list builder.
- A panel that is not tied to a selection — like the built-in sheets in the
  Panel guide — can fit a dock button instead. See [Add a New Button](./add-new-button.md) for both surfaces.

## Building the Panel Content

Panel content is regular Compose UI. Because the `SheetType.Custom` content
lambda runs in the editor scope, it can read `editorContext.engine` directly.
`SheetStyle` controls whether the sheet floats and how tall it can become, while
the `content` lambda supplies the app-provided panel UI. The
[Panel](../customization/panel.md) guide documents the other sheet options.

```kotlin highlight-android-open-custom-panel
fun createCustomPanelSheetType(block: DesignBlock): SheetType = SheetType.Custom(
    style = SheetStyle(
        isFloating = false,
        minHeight = Height.Exactly(0.dp),
        maxHeight = Height.Fraction(0.7F),
        isHalfExpandingEnabled = false,
        isHalfExpandedInitially = false,
        animateInitialValue = true,
    ),
    content = {
        CreateCustomPanelPropertyPanel(editorContext = editorContext, block = block)
    },
)
```

Use Compose state with `remember { mutableStateOf(...) }` to seed transient
controls from the selected block. The sample reads the current name with
`engine.block.getName()`, opacity with `engine.block.getOpacity()`, and
visibility with `engine.block.isVisible()`, then renders native controls such as
`OutlinedTextField`, `Slider`, and `Switch`.

For state that should survive configuration changes, use
`editorContext.mutableStateOf(key, initial)` instead. It stores the value for the
lifetime of the editor, so give each state value a unique key. Use regular
Compose state when the value only needs to live with the panel content.

```kotlin highlight-android-panel-content
@Composable
fun CreateCustomPanelPropertyPanel(
    editorContext: EditorContext,
    block: DesignBlock,
) {
    val engine = editorContext.engine
    var name by remember(block) {
        mutableStateOf(runCatching { engine.block.getName(block) }.getOrDefault(""))
    }
    var opacity by remember(block) {
        mutableStateOf(runCatching { engine.block.getOpacity(block) }.getOrDefault(1F))
    }
    var isVisible by remember(block) {
        mutableStateOf(runCatching { engine.block.isVisible(block) }.getOrDefault(true))
    }

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .navigationBarsPadding()
            .padding(16.dp),
        horizontalAlignment = Alignment.Start,
    ) {
        Text("Block properties")
        Spacer(modifier = Modifier.height(16.dp))
        OutlinedTextField(
            modifier = Modifier.fillMaxWidth(),
            value = name,
            onValueChange = { name = it },
            label = { Text("Name") },
            singleLine = true,
        )
        Spacer(modifier = Modifier.height(24.dp))
        Text("Opacity")
        Slider(
            value = opacity,
            onValueChange = { opacity = it },
            valueRange = 0F..1F,
        )
        Spacer(modifier = Modifier.height(16.dp))
        Row(verticalAlignment = Alignment.CenterVertically) {
            Switch(
                checked = isVisible,
                onCheckedChange = { isVisible = it },
            )
            Spacer(modifier = Modifier.width(12.dp))
            Text("Visible")
        }
```

## Applying Changes and Closing the Panel

The Done button writes the edited values back to the scene with
`engine.block.setName()`, `engine.block.setOpacity()`, and
`engine.block.setVisible()`, then dismisses the sheet by sending
`EditorEvent.Sheet.Close`. The user can also drag the sheet down to dismiss it.

```kotlin highlight-android-apply-close
Button(
    modifier = Modifier.align(Alignment.End),
    onClick = {
        engine.block.setName(block, name = name)
        engine.block.setOpacity(block = block, value = opacity)
        engine.block.setVisible(block = block, visible = isVisible)
        editorContext.eventHandler.send(EditorEvent.Sheet.Close(animate = true))
    },
) {
    Text("Done")
}
```

## API Reference

| Method | Description |
| --- | --- |
| `EditorConfiguration.remember { inspectorBar = { ... } }` | Declare the inspector bar in the editor configuration |
| `InspectorBar.Button.remember { ... }` | Create an inspector bar button whose `onClick` can open the panel |
| `editorContext.selection.designBlock` | The selected block inside the button action |
| `editorContext.engine` | Engine access inside the button action and sheet content |
| `editorContext.mutableStateOf(key=_, initial=_)` | Store Compose state in the editor scope so it survives configuration changes |
| `editorContext.eventHandler.send(EditorEvent.Sheet.Open(...))` | Present custom Compose content as a sheet |
| `editorContext.eventHandler.send(EditorEvent.Sheet.Close(...))` | Dismiss the current sheet |
| `SheetType.Custom(style=_, content=_)` | Define a custom editor sheet with app-provided Compose content |
| `engine.block.getName(block=_)` | Read a block's name |
| `engine.block.setName(block=_, name=_)` | Write a block's name |
| `engine.block.getOpacity(block=_)` | Read a block's opacity |
| `engine.block.setOpacity(block=_, value=_)` | Write a block's opacity |
| `engine.block.isVisible(block=_)` | Read whether a block is visible |
| `engine.block.setVisible(block=_, visible=_)` | Write a block's visibility |

## Next Steps

- [Panel](../customization/panel.md) — sheet types, presentation styles, and the built-in sheets this guide builds on.
- [Add a New Button](./add-new-button.md) — full options for dock, canvas menu, inspector bar, and navigation bar buttons.
- [Dock](../customization/dock.md) — configure the dock area and item order.
- [Inspector Bar](../customization/inspector-bar.md) — the built-in surface for editing properties of the selected block.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [User Interface](../../user-interface.md) > [Customization](../customization.md) > [Panel](./panel.md)

---

```kotlin file=@cesdk_android_examples/editor-guides-configuration-panel/DefaultPanelSolution.kt reference-only
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.KeyboardArrowUp
import androidx.compose.material3.Button
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import ly.img.editor.Editor
import ly.img.editor.core.EditorContext
import ly.img.editor.core.component.Dock
import ly.img.editor.core.component.EditorComponentId
import ly.img.editor.core.component.data.Height
import ly.img.editor.core.component.remember
import ly.img.editor.core.configuration.EditorConfiguration
import ly.img.editor.core.configuration.remember
import ly.img.editor.core.event.EditorEvent
import ly.img.editor.core.sheet.SheetStyle
import ly.img.editor.core.sheet.SheetType

@Composable
fun DefaultPanelSolution(
    license: String,
    onClose: (Throwable?) -> Unit,
) {
    Editor(
        license = license, // pass null or empty for evaluation mode with watermark
        configuration = {
            EditorConfiguration.remember {
                dock = {
                    Dock.remember {
                        listBuilder = {
                            Dock.ListBuilder.remember {
                                add { openPanelDockButton }
                                add { openCustomPanelDockButton }
                            }
                        }
                    }
                }
            }
        },
        onClose = onClose,
    )
}

val openPanelDockButton
    @Composable get() = Dock.Button.remember {
        id = { EditorComponentId("open_library_panel") }
        text = { Text("Open Library") }
        icon = { Icon(Icons.Rounded.KeyboardArrowUp, null) }
        onClick = {
            editorContext.eventHandler.send(
                EditorEvent.Sheet.Open(
                    SheetType.LibraryAdd(),
                ),
            )
        }
    }

val openCustomPanelDockButton
    @Composable get() = Dock.Button.remember {
        id = { EditorComponentId("open_custom_panel") }
        text = { Text("Custom Panel") }
        icon = { Icon(Icons.Rounded.KeyboardArrowUp, null) }
        onClick = {
            editorContext.eventHandler.send(
                EditorEvent.Sheet.Open(
                    customPanelSheetType(),
                ),
            )
        }
    }

fun customPanelSheetType(): SheetType {
    return SheetType.Custom(
        style = SheetStyle(
            isFloating = false,
            minHeight = Height.Exactly(0.dp),
            maxHeight = Height.Fraction(0.5F),
            isHalfExpandingEnabled = false,
            isHalfExpandedInitially = false,
            animateInitialValue = true,
        ),
        content = {
            SimpleCustomPanelContent(editorContext = editorContext)
        },
    )
}

@Composable
private fun SimpleCustomPanelContent(editorContext: EditorContext) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .navigationBarsPadding()
            .padding(16.dp),
        horizontalAlignment = Alignment.Start,
    ) {
        Text("Custom panel")
        Spacer(modifier = Modifier.height(16.dp))
        Text("Render native Compose content here.")
        Spacer(modifier = Modifier.height(24.dp))
        Button(
            modifier = Modifier.align(Alignment.End),
            onClick = {
                editorContext.eventHandler.send(EditorEvent.Sheet.Close(animate = true))
            },
        ) {
            Text("Done")
        }
    }
}
```

Use sheets to show built-in editor panels or your own Compose content in the editor UI.

![Panel on Android](https://img.ly/docs/cesdk/android/user-interface/customization/panel-7ce1ee/assets/panel-android.png)

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.83.0-nightly.20260903/editor-guides-configuration-panel)

In Android integrations, panels are implemented as editor sheets. You open a concrete `SheetType` through `EditorEvent.Sheet.Open`, and you close the currently displayed sheet with `EditorEvent.Sheet.Close`.

The same Base Editor sheet system is used by Starter Kits. See the [Design Editor Starter Kit](../../starterkits/design-editor.md) for a complete editor surface that uses these components in context.

## Controlling a Panel

Send an `EditorEvent.Sheet.Open` event from a component that has access to `editorContext`. This example adds a dock button that opens the built-in asset library sheet.

```kotlin highlight-android-open-panel
editorContext.eventHandler.send(
    EditorEvent.Sheet.Open(
        SheetType.LibraryAdd(),
    ),
)
```

To dismiss the active sheet from code, send `EditorEvent.Sheet.Close`. The `animate` argument controls whether the close transition is animated.

```kotlin highlight-android-close-panel
editorContext.eventHandler.send(EditorEvent.Sheet.Close(animate = true))
```

Android sheets are selected by type instead of string IDs. If your workflow needs a different panel, open the matching `SheetType` rather than searching for or closing panels by ID.

## Creating a Custom Panel

Use `SheetType.Custom` when you need app-specific UI inside a sheet. The `content` lambda is regular Compose content in `EditorScope`, so it can render controls and send editor events.

```kotlin highlight-android-open-custom-panel
return SheetType.Custom(
    style = SheetStyle(
        isFloating = false,
        minHeight = Height.Exactly(0.dp),
        maxHeight = Height.Fraction(0.5F),
        isHalfExpandingEnabled = false,
        isHalfExpandedInitially = false,
        animateInitialValue = true,
    ),
    content = {
        SimpleCustomPanelContent(editorContext = editorContext)
    },
)
```

Open the custom sheet type with the same event flow as a built-in sheet.

```kotlin highlight-android-open-custom-panel-event
editorContext.eventHandler.send(
    EditorEvent.Sheet.Open(
        customPanelSheetType(),
    ),
)
```

The `SheetStyle` controls how the sheet is presented:

| Parameter | Default Value | Description |
| --- | --- | --- |
| `isFloating` | `false` | Renders the sheet over the editor when `true`; adjusts the canvas around the sheet when `false`. |
| `minHeight` | `Height.Exactly(0.dp)` | Sets the minimum sheet height. |
| `maxHeight` | `Height.Fraction(0.5F)` | Sets the maximum sheet height. Use `null` when the sheet should not cap its height. |
| `isHalfExpandingEnabled` | `false` | Adds a half-expanded state between hidden and expanded. |
| `isHalfExpandedInitially` | `false` | Opens the sheet half-expanded first when half expansion is enabled. |
| `animateInitialValue` | `true` | Animates the initial expanded or half-expanded state. |

If custom content needs to scroll after it reaches `maxHeight`, add the scrolling behavior to your Compose content.

## Default Sheet Types

The editor provides built-in sheet types for common editing tasks:

| Sheet Type | Description |
| --- | --- |
| `SheetType.LibraryAdd()` | Add assets from the configured asset library. |
| `SheetType.LibraryReplace(libraryCategory = category)` | Replace the selected block's asset with assets from a library category. |
| `SheetType.Reorder()` | Reorder videos on the background track. |
| `SheetType.Adjustments()` | Make adjustments to image and video fills. |
| `SheetType.Filter()` | Set filters on image and video fills. |
| `SheetType.Effect()` | Set effects on image and video fills. |
| `SheetType.Blur()` | Set blur effects on image and video fills. |
| `SheetType.Crop(mode = SheetType.Crop.Mode.ImageCrop)` | Crop the selected image or video fill. |
| `SheetType.ResizeAll()` | Resize all pages in the design. |
| `SheetType.Layer()` | Control the layering of design blocks. |
| `SheetType.FormatText()` | Format selected text blocks. |
| `SheetType.Shape()` | Change the shape of selected blocks. |
| `SheetType.FillStroke()` | Edit fill and stroke properties. |
| `SheetType.Speed()` | Control video clip playback speed. |
| `SheetType.Volume()` | Control audio and video volume. |
| `SheetType.Voiceover()` | Record voice-over audio in video scenes. |
| `SheetType.Animation()` | Configure in, out, and loop animations. |
| `SheetType.Transition(outgoingBlock = outgoingBlock)` | Configure the transition from a clip to its next eligible clip. |
| `SheetType.TextBackground()` | Configure text background properties. |

## API Reference

| API | Use |
| --- | --- |
| `editorContext.eventHandler.send(event=_)` | Sends an editor event from a UI component that has access to `editorContext`. |
| `EditorEvent.Sheet.Open(type=_)` | Opens the sheet described by a `SheetType`. |
| `EditorEvent.Sheet.Close(animate=_)` | Closes the active sheet, optionally animating the transition. |
| `SheetType.Custom(style=_, content=_)` | Defines a sheet with app-specific Compose content. Add scrolling inside `content` when needed. |
| `SheetType.LibraryAdd(style=_, libraryCategory=_, addToBackgroundTrack=_)` | Opens the configured asset library for adding assets to the scene. |
| `SheetStyle(isFloating=_, minHeight=_, maxHeight=_, isHalfExpandingEnabled=_, isHalfExpandedInitially=_, animateInitialValue=_)` | Controls placement, height limits, half-expanded state, and initial animation. |
| `Height.Exactly(size=_)` | Sets an exact sheet height for `SheetStyle.minHeight` or `SheetStyle.maxHeight`. |
| `Height.Fraction(fraction=_)` | Sets a sheet height as a fraction of the editor height. |

## Next Steps

- [Create a Custom Panel](../ui-extensions/create-custom-panel.md) - Design a custom sidebar panel to support unique workflows and user needs.
- [Asset Library](../../import-media/asset-library.md) - Manage the assets users browse, preview, and insert.
- [Inspector Bar](./inspector-bar.md) - Customize the inspector bar for editing properties.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
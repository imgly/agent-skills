> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [User Interface](../../user-interface.md) > [Appearance](../appearance.md) > [Overlay](./overlay.md)

---

```kotlin file=@cesdk_android_examples/editor-guides-configuration-overlay/OverlayEditorSolution.kt reference-only
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.window.DialogProperties
import kotlinx.coroutines.delay
import ly.img.editor.Editor
import ly.img.editor.core.component.EditorComponent
import ly.img.editor.core.component.remember
import ly.img.editor.core.configuration.EditorConfiguration
import ly.img.editor.core.configuration.remember
import ly.img.editor.core.event.EditorEvent
import ly.img.engine.DesignBlockType

// Add this composable to your NavHost
@Composable
fun OverlayEditorSolution(
    license: String,
    onClose: (Throwable?) -> Unit,
) {
    var isLoading by remember { mutableStateOf(false) }
    Editor(
        license = license,
        configuration = {
            EditorConfiguration.remember {
                onCreate = {
                    isLoading = true
                    try {
                        val scene = editorContext.engine.scene.create()
                        val page = editorContext.engine.block.create(DesignBlockType.Page)
                        editorContext.engine.block.setWidth(block = page, value = 1080F)
                        editorContext.engine.block.setHeight(block = page, value = 1080F)
                        editorContext.engine.block.appendChild(parent = scene, child = page)
                        // Replace this delay with the startup work that should block editor interaction.
                        delay(3000)
                    } finally {
                        isLoading = false
                    }
                }
                overlay = {
                    EditorComponent.remember {
                        decoration = {
                            if (isLoading) {
                                AlertDialog(
                                    onDismissRequest = { },
                                    title = {
                                        Text(text = "Loading editor")
                                    },
                                    text = {
                                        Text(text = "The editor is preparing the scene. You can close it if you need to cancel.")
                                    },
                                    confirmButton = {
                                        TextButton(
                                            onClick = {
                                                editorContext.eventHandler.send(EditorEvent.CloseEditor())
                                            },
                                        ) {
                                            Text(text = "Close Editor")
                                        }
                                    },
                                    properties = DialogProperties(dismissOnBackPress = false, dismissOnClickOutside = false),
                                )
                            }
                        }
                    }
                }
            }
        },
        onClose = onClose,
    )
}
```

Render app-controlled Compose UI above the CE.SDK editor to block interaction during loading, confirmation, or other transient flows.

![Custom overlay dialog on Android](https://img.ly/docs/cesdk/android/user-interface/appearance/overlay-b7e891/assets/overlay-android.png)

> **Reading time:** 3 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.83.0-nightly.20260906/editor-guides-configuration-overlay)

This guide uses a small Design Editor setup to show a loading dialog above the editor. The same `EditorConfiguration.overlay` hook applies to your CE.SDK editor UI, including the [Design Editor Starter Kit](../../starterkits/design-editor.md).

## Configuration

Keep overlay visibility in Compose state so callbacks and overlay UI can update the same value.

```kotlin highlight-android-state
var isLoading by remember { mutableStateOf(false) }
```

In this example, `onCreate` intentionally owns scene creation. It enables the loading state before the sample scene is prepared and disables it after the startup work finishes.

```kotlin highlight-android-loading-state
onCreate = {
    isLoading = true
    try {
        val scene = editorContext.engine.scene.create()
        val page = editorContext.engine.block.create(DesignBlockType.Page)
        editorContext.engine.block.setWidth(block = page, value = 1080F)
        editorContext.engine.block.setHeight(block = page, value = 1080F)
        editorContext.engine.block.appendChild(parent = scene, child = page)
        // Replace this delay with the startup work that should block editor interaction.
        delay(3000)
    } finally {
        isLoading = false
    }
}
```

Assign `overlay` to an `EditorComponent` and render your Compose UI from its `decoration` block. The dialog below is non-dismissible while loading and sends `EditorEvent.CloseEditor` when the user cancels.

```kotlin highlight-android-overlay
overlay = {
    EditorComponent.remember {
        decoration = {
            if (isLoading) {
                AlertDialog(
                    onDismissRequest = { },
                    title = {
                        Text(text = "Loading editor")
                    },
                    text = {
                        Text(text = "The editor is preparing the scene. You can close it if you need to cancel.")
                    },
                    confirmButton = {
                        TextButton(
                            onClick = {
                                editorContext.eventHandler.send(EditorEvent.CloseEditor())
                            },
                        ) {
                            Text(text = "Close Editor")
                        }
                    },
                    properties = DialogProperties(dismissOnBackPress = false, dismissOnClickOutside = false),
                )
            }
        }
    }
}
```

> **Note:** The overlay is edge-to-edge. Draw over or around system bars yourself when your UI needs explicit status-bar or navigation-bar treatment.

## Complete Sample

The linked Android sample creates a simple page, simulates startup work, and displays the overlay dialog while the loading state is active. Use it as the starting point for your own loading, confirmation, or export dialogs.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
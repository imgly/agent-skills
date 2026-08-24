> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [User Interface](../user-interface.md) > [UI Events](./events.md)

---

```kotlin file=@cesdk_android_examples/editor-guides-configuration-ui-events/UiEventsEditorSolution.kt reference-only
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import ly.img.editor.Editor
import ly.img.editor.core.component.EditorComponent
import ly.img.editor.core.component.remember
import ly.img.editor.core.configuration.EditorConfiguration
import ly.img.editor.core.configuration.remember
import ly.img.editor.core.event.EditorEvent
import ly.img.editor.core.state.EditorViewMode

data class UiEventsState(
    val isLoading: Boolean = false,
    val lastEvent: String = "Waiting for editor events",
)

object ShowLoading : EditorEvent

object HideLoading : EditorEvent

data class WorkflowStepChanged(
    val label: String,
) : EditorEvent

// Add this composable to your NavHost
@Composable
fun UiEventsEditorSolution(
    license: String,
    onClose: (Throwable?) -> Unit,
) {
    var state by remember { mutableStateOf(UiEventsState()) }
    Editor(
        license = license, // pass null or empty for evaluation mode with watermark
        configuration = {
            EditorConfiguration.remember {
                onLoaded = {
                    editorContext.eventHandler.send(
                        WorkflowStepChanged(label = "Editor loaded"),
                    )
                }
                onEvent = { event ->
                    state = when (event) {
                        ShowLoading -> state.copy(
                            isLoading = true,
                            lastEvent = "Started custom loading state",
                        )

                        HideLoading -> state.copy(
                            isLoading = false,
                            lastEvent = "Finished custom loading state",
                        )

                        is WorkflowStepChanged -> state.copy(lastEvent = event.label)

                        is EditorEvent.SetViewMode -> {
                            val viewMode = when (event.viewMode) {
                                is EditorViewMode.Edit -> "Edit"
                                is EditorViewMode.Preview -> "Preview"
                                is EditorViewMode.Pages -> "Pages"
                            }
                            state.copy(lastEvent = "View mode changed to $viewMode")
                        }

                        is EditorEvent.Export.Start -> {
                            state.copy(lastEvent = "Export requested")
                        }

                        else -> state
                    }
                }
                overlay = {
                    EditorComponent.remember {
                        decoration = {
                            val syncScope = rememberCoroutineScope()
                            Box(modifier = Modifier.fillMaxSize()) {
                                Text(
                                    text = state.lastEvent,
                                    modifier = Modifier
                                        .align(Alignment.TopCenter)
                                        .padding(top = 24.dp),
                                )
                                Column(
                                    modifier = Modifier
                                        .align(Alignment.BottomCenter)
                                        .padding(bottom = 24.dp),
                                    horizontalAlignment = Alignment.CenterHorizontally,
                                    verticalArrangement = Arrangement.spacedBy(8.dp),
                                ) {
                                    Button(
                                        onClick = {
                                            editorContext.eventHandler.send(
                                                EditorEvent.SetViewMode(EditorViewMode.Preview()),
                                            )
                                        },
                                    ) {
                                        Text("Preview")
                                    }
                                    Button(
                                        onClick = {
                                            editorContext.eventHandler.send(EditorEvent.Export.Start())
                                        },
                                    ) {
                                        Text("Request Export")
                                    }
                                    Button(
                                        enabled = !state.isLoading,
                                        onClick = {
                                            syncScope.launch {
                                                editorContext.eventHandler.send(ShowLoading)
                                                editorContext.eventHandler.send(
                                                    WorkflowStepChanged(label = "Sync requested"),
                                                )
                                                // Simulate asynchronous app work before clearing the loading event.
                                                delay(1_200)
                                                editorContext.eventHandler.send(HideLoading)
                                            }
                                        },
                                    ) {
                                        Text("Run Sync")
                                    }
                                }
                                if (state.isLoading) {
                                    CircularProgressIndicator(
                                        modifier = Modifier.align(Alignment.Center),
                                    )
                                }
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

Listen to editor UI events, send custom events from editor configuration code,
and route those events into your Android app state.

> **Reading time:** 4 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.82.0-nightly.20260824/editor-guides-configuration-ui-events)

Editor UI events are messages sent through the editor's `EditorEventHandler`.
Built-in editor components use them for actions such as changing view mode or
starting export, and your configuration can send custom events for app-specific
workflows.

> **Note:** The [Design Editor Starter Kit](../starterkits/design-editor.md) shows a complete
> Android editor surface that uses the same configuration layer.

## Editor Events vs Engine Events

Use UI events when the event belongs to the editor interface: a button tap,
sheet transition, export request, or custom workflow step. The event flow is:
`editorContext.eventHandler.send(event)` dispatches an `EditorEvent`, the editor
handles known internal events when applicable, and `onEvent` receives internal
and custom events for your app logic.

Use [Events](../concepts/events.md) instead when you need CreativeEngine block
lifecycle changes such as created, updated, or destroyed blocks. That guide uses
`engine.event.subscribe()` and is separate from the editor UI event bus.

## Define Custom Events

Custom events are Kotlin objects or data classes that implement `EditorEvent`.
Keep them small and specific to the UI workflow you want to observe.

```kotlin highlight-android-custom-events
object ShowLoading : EditorEvent

object HideLoading : EditorEvent

data class WorkflowStepChanged(
    val label: String,
) : EditorEvent
```

## Use Events for App State

Keep UI state in regular Compose state and update it from `onEvent`. The event
handler should decide what happened; composables read the state when rendering
event-driven UI.

```kotlin highlight-android-event-state
data class UiEventsState(
    val isLoading: Boolean = false,
    val lastEvent: String = "Waiting for editor events",
)
```

```kotlin highlight-android-remember-state
var state by remember { mutableStateOf(UiEventsState()) }
```

## Observe Editor Events

Configure `onEvent` inside `EditorConfiguration.remember`. The callback runs for
built-in events and for the custom event types defined above.

```kotlin highlight-android-observe-events
                onEvent = { event ->
                    state = when (event) {
                        ShowLoading -> state.copy(
                            isLoading = true,
                            lastEvent = "Started custom loading state",
                        )

                        HideLoading -> state.copy(
                            isLoading = false,
                            lastEvent = "Finished custom loading state",
                        )

                        is WorkflowStepChanged -> state.copy(lastEvent = event.label)

                        is EditorEvent.SetViewMode -> {
                            val viewMode = when (event.viewMode) {
                                is EditorViewMode.Edit -> "Edit"
                                is EditorViewMode.Preview -> "Preview"
                                is EditorViewMode.Pages -> "Pages"
                            }
                            state.copy(lastEvent = "View mode changed to $viewMode")
                        }

                        is EditorEvent.Export.Start -> {
                            state.copy(lastEvent = "Export requested")
                        }

                        else -> state
                    }
                }
```

This example tracks `EditorEvent.SetViewMode` and `EditorEvent.Export.Start` as
built-in UI events. The sample overlay sends those events from buttons so the
reducer is reachable in the demo, and it handles custom events in the same
reducer so app logic has a single event entry point.

## Send Events from Editor UI

Send custom events from editor callbacks or custom UI components through
`editorContext.eventHandler.send(...)`. The sample sends a workflow step after
the editor finishes loading.

```kotlin highlight-android-send-custom-events
onLoaded = {
    editorContext.eventHandler.send(
        WorkflowStepChanged(label = "Editor loaded"),
    )
}
```

The same handler is available from components configured through
`EditorConfiguration`, so custom buttons can dispatch app-specific events
without bypassing the editor event pipeline.

The overlay below sends built-in and custom events from buttons, then renders
the last observed event plus a loading spinner from the same state object.

```kotlin highlight-android-overlay-actions
overlay = {
    EditorComponent.remember {
        decoration = {
            val syncScope = rememberCoroutineScope()
            Box(modifier = Modifier.fillMaxSize()) {
                Text(
                    text = state.lastEvent,
                    modifier = Modifier
                        .align(Alignment.TopCenter)
                        .padding(top = 24.dp),
                )
                Column(
                    modifier = Modifier
                        .align(Alignment.BottomCenter)
                        .padding(bottom = 24.dp),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.spacedBy(8.dp),
                ) {
                    Button(
                        onClick = {
                            editorContext.eventHandler.send(
                                EditorEvent.SetViewMode(EditorViewMode.Preview()),
                            )
                        },
                    ) {
                        Text("Preview")
                    }
                    Button(
                        onClick = {
                            editorContext.eventHandler.send(EditorEvent.Export.Start())
                        },
                    ) {
                        Text("Request Export")
                    }
                    Button(
                        enabled = !state.isLoading,
                        onClick = {
                            syncScope.launch {
                                editorContext.eventHandler.send(ShowLoading)
                                editorContext.eventHandler.send(
                                    WorkflowStepChanged(label = "Sync requested"),
                                )
                                // Simulate asynchronous app work before clearing the loading event.
                                delay(1_200)
                                editorContext.eventHandler.send(HideLoading)
                            }
                        },
                    ) {
                        Text("Run Sync")
                    }
                }
                if (state.isLoading) {
                    CircularProgressIndicator(
                        modifier = Modifier.align(Alignment.Center),
                    )
                }
            }
        }
    }
}
```

## API Reference

| API | Description |
| --- | ----------- |
| `EditorConfiguration.remember { onEvent = { ... } }` | Creates an editor configuration and registers the event observer. |
| `editorContext.eventHandler.send(event=_)` | Dispatches a built-in or custom editor UI event. |
| `EditorComponent.remember { decoration = { ... } }` | Creates a custom UI component that can send editor events from its callbacks. |

## Key Types

| Type | Purpose |
| ---- | ------- |
| `EditorEvent` | Base interface for built-in and custom editor UI events. |
| `EditorEvent.SetViewMode(viewMode=_)` | Built-in event type that sets the editor view mode. |
| `EditorEvent.Export.Start` | Built-in event sent by export actions before `onExport` runs. |
| `ShowLoading`, `HideLoading`, `WorkflowStepChanged` | Custom events used by the sample to update app-side Compose state. |

## Next Steps

- [Events](../concepts/events.md) - subscribe to CreativeEngine block lifecycle events.
- [Overlay](./appearance/overlay.md) - render event-driven dialogs and loading states over the editor.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
# EditorEventHandler

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.event`

An interface for sending editor events that can be captured in ly.img.editor.EditorConfiguration.onEvent.

```kotlin
interface EditorEventHandler
```


## Members

### sendCancelExportEvent

```kotlin
open fun sendCancelExportEvent()
```
> **Deprecated:** Use EditorEventHandler.send(EditorEvent.Export.Cancel() instead Replace with `send(EditorEvent.Export.Cancel())`.

A special function for canceling the export job if it is running.

### sendCloseEditorEvent

```kotlin
open fun sendCloseEditorEvent(throwable: Throwable? = null)
```
> **Deprecated:** Use EditorEventHandler.send(EditorEvent.CloseEditor(throwable) instead Replace with `send(EditorEvent.CloseEditor(throwable))`.

A special function for closing the editor. This force closes the editor without entering the ly.img.editor.EngineConfiguration.onClose callback.

### send

```kotlin
abstract fun send(event: EditorEvent)
```

A function for sending EditorEvents. If the event is an instance of EditorEvent.Internal then it will be handled by the editor automatically. All other events are forwarded to ly.img.editor.EditorConfiguration.onEvent.

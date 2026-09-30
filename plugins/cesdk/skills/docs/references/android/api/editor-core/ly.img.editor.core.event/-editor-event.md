# EditorEvent

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.event`

An editor event that can be sent via EditorEventHandler. All the instances of classes that inherit from EditorEvent and are declared below are handled internally, i.e. EditorEvent.CloseEditor, EditorEvent.Sheet.Open. All the remaining events are considered as custom and need to be handled manually in ly.img.editor.EditorConfiguration.onEvent. However, no matter internal or custom, all events are forwarded to ly.img.editor.EditorConfiguration.onEvent and can be useful to update your state, do action tracking etc.

```kotlin
interface EditorEvent
```

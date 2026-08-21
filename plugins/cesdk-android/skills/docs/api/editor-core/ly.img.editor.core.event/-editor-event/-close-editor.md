# CloseEditor

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.event`

An event for closing the editor. This force closes the editor without entering the ly.img.editor.EngineConfiguration.onClose callback.

```kotlin
class CloseEditor(val throwable: Throwable? = null) : EditorEvent
```


## Members

### CloseEditor

```kotlin
constructor(throwable: Throwable? = null)
```

### throwable

```kotlin
val throwable: Throwable? = null
```

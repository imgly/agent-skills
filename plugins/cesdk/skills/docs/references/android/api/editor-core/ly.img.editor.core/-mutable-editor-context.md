# MutableEditorContext

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core`

```kotlin
interface MutableEditorContext : EditorContext
```


## Members

### clear

```kotlin
abstract fun clear()
```

### init

```kotlin
abstract fun init(license: String?, userId: String?, baseUri: Uri, host: String, activity: Activity, eventHandler: EditorEventHandler, coroutineScope: CoroutineScope, timelineOwnerProvider: () -> TimelineOwner)
```

### state

```kotlin
abstract override val state: MutableStateFlow<EditorState>
```

The state flow of the EditorState.

### updateConfiguration

```kotlin
abstract fun updateConfiguration(configuration: EditorConfiguration)
```

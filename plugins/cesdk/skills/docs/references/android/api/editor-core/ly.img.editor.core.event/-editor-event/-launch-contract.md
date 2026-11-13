# LaunchContract

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.event`

An event for launching any contract via ActivityResultContract API. IMPORTANT: Do not capture any values in the onOutput. In case the activity of the editor is killed when returning back it may cause issues.

```kotlin
class LaunchContract<I, O>(val contract: ActivityResultContract<I, O>, val input: I, val onOutput: EditorScope.(O) -> Unit) : EditorEvent
```


## Members

### LaunchContract

```kotlin
constructor(contract: ActivityResultContract<I, O>, input: I, onOutput: EditorScope.(O) -> Unit)
```

### contract

```kotlin
val contract: ActivityResultContract<I, O>
```

### input

```kotlin
val input: I
```

### launched

```kotlin
var launched: Boolean
```

### onOutput

```kotlin
val onOutput: EditorScope.(O) -> Unit
```

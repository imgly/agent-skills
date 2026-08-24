# EditorContext

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core`

An umbrella interface containing all the useful properties and functions of the current editor: Following can be found: 1. Properties that were provided when calling the Editor composable. 2. Engine, EditorEventHandler and Activity of the current editor. 3. CoroutineScope of the current editor. 4. Collectable EditorState of the editor.

```kotlin
@Stable
interface EditorContext
```


## Members

### activity

```kotlin
abstract val activity: Activity
```

The activity where the current editor is running.

### baseUri

```kotlin
abstract val baseUri: Uri
```

The baseUri provided via param when launching the editor.

### configuration

```kotlin
abstract val configuration: StateFlow<EditorConfiguration?>
```

The configuration of the current editor.

### coroutineScope

```kotlin
abstract val coroutineScope: CoroutineScope
```

The coroutine scope that is always alive while editor is running. It also survives configuration changes.

### engine

```kotlin
abstract val engine: Engine
```

The engine of the current editor.

### eventHandler

```kotlin
abstract val eventHandler: EditorEventHandler
```

The event handler of the current editor.

### host

```kotlin
abstract val host: String
```

The integration context embedding the engine, used for license matching.

### license

```kotlin
abstract val license: String?
```

The license provided via param when launching the editor.

### mutableStateOf

```kotlin
abstract fun <T> mutableStateOf(key: String, initial: T): MutableState<T>
```

MutableState provider for storing custom content in the editor scope. All state values will survive configuration changes and will be available until exiting the editor.

### stateOf

```kotlin
abstract fun <T> stateOf(key: String): State<T>
```

State provider to access the state, previously declared via mutableStateOf.

### state

```kotlin
abstract val state: StateFlow<EditorState>
```

The state flow of the EditorState.

### userId

```kotlin
abstract val userId: String?
```

The userId provided via param when launching the editor.

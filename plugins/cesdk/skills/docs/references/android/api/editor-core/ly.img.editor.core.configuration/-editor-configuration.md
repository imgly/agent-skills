# EditorConfiguration

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.configuration`

Configuration class of the editor.

```kotlin
@Immutable
data class EditorConfiguration(val onCreate: suspend EditorScope.() -> Unit?, val onLoaded: suspend EditorScope.() -> Unit?, val onExport: suspend EditorScope.() -> Unit?, val onClose: suspend EditorScope.() -> Unit?, val onEvent: EditorScope.(EditorEvent) -> Unit?, val onUpload: suspend EditorScope.(AssetDefinition, UploadAssetSourceType) -> AssetDefinition?, val onError: suspend EditorScope.(Throwable) -> Unit?, val colorPalette: List<Color>?, val assetLibrary: AssetLibrary?, val dock: EditorComponent<*>?, val navigationBar: EditorComponent<*>?, val inspectorBar: EditorComponent<*>?, val canvasMenu: EditorComponent<*>?, val bottomPanel: EditorComponent<*>?, val overlay: EditorComponent<*>?)
```


## Members

### EditorConfiguration

```kotlin
constructor(onCreate: suspend EditorScope.() -> Unit?, onLoaded: suspend EditorScope.() -> Unit?, onExport: suspend EditorScope.() -> Unit?, onClose: suspend EditorScope.() -> Unit?, onEvent: EditorScope.(EditorEvent) -> Unit?, onUpload: suspend EditorScope.(AssetDefinition, UploadAssetSourceType) -> AssetDefinition?, onError: suspend EditorScope.(Throwable) -> Unit?, colorPalette: List<Color>?, assetLibrary: AssetLibrary?, dock: EditorComponent<*>?, navigationBar: EditorComponent<*>?, inspectorBar: EditorComponent<*>?, canvasMenu: EditorComponent<*>?, bottomPanel: EditorComponent<*>?, overlay: EditorComponent<*>?)
```

### assetLibrary

```kotlin
val assetLibrary: AssetLibrary?
```

### bottomPanel

```kotlin
val bottomPanel: EditorComponent<*>?
```

### canvasMenu

```kotlin
val canvasMenu: EditorComponent<*>?
```

### colorPalette

```kotlin
val colorPalette: List<Color>?
```

### dock

```kotlin
val dock: EditorComponent<*>?
```

### inspectorBar

```kotlin
val inspectorBar: EditorComponent<*>?
```

### navigationBar

```kotlin
val navigationBar: EditorComponent<*>?
```

### onClose

```kotlin
val onClose: suspend EditorScope.() -> Unit?
```

### onCreate

```kotlin
val onCreate: suspend EditorScope.() -> Unit?
```

### onError

```kotlin
val onError: suspend EditorScope.(Throwable) -> Unit?
```

### onEvent

```kotlin
val onEvent: EditorScope.(EditorEvent) -> Unit?
```

### onExport

```kotlin
val onExport: suspend EditorScope.() -> Unit?
```

### onLoaded

```kotlin
val onLoaded: suspend EditorScope.() -> Unit?
```

### onUpload

```kotlin
val onUpload: suspend EditorScope.(AssetDefinition, UploadAssetSourceType) -> AssetDefinition?
```

### overlay

```kotlin
val overlay: EditorComponent<*>?
```

# SystemGalleryPermission

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.library.data`

Centralized state for handling system gallery permissions. The editor uses this object to decide whether full gallery access is granted, whether only user-selected items are available, or if access is denied.

```kotlin
object SystemGalleryPermission
```


## Members

### addSelected

```kotlin
fun addSelected(uri: Uri, context: Context)
```

Add a single user-selected URI to the allowed set.

### hasImageType

```kotlin
fun hasImageType(mimeTypes: List<String>): Boolean
```

### hasPermissionForMimeTypes

```kotlin
fun hasPermissionForMimeTypes(context: Context, mimeTypes: List<String>?): Boolean
```

### hasPermission

```kotlin
fun hasPermission(context: Context, mimeType: String?): Boolean
```

Returns true if the current permission state allows reading the given mimeType.

### hasVideoType

```kotlin
fun hasVideoType(mimeTypes: List<String>): Boolean
```

### isManualMode

```kotlin
val isManualMode: Boolean
```

### mode

```kotlin
var mode: SystemGalleryPermission.Mode
```

### requiredPermission

```kotlin
fun requiredPermission(mimeTypes: List<String>): Array<String?>
```

Returns the permission set required for the provided mimeTypes.

### selectedForMimeType

```kotlin
fun selectedForMimeType(mimeType: String?): List<SystemGalleryPermission.SelectedUri>
```

### selectedForMimeTypes

```kotlin
fun selectedForMimeTypes(mimeTypes: List<String>?): List<SystemGalleryPermission.SelectedUri>
```

### setAllGranted

```kotlin
fun setAllGranted()
```

Mark full access granted and clear any selected-only state.

### setMode

```kotlin
fun setMode(configuration: SystemGalleryConfiguration)
```

Configure how the system gallery should behave. Marked unstable to make opt-in explicit for integrators.

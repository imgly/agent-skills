# Vector

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.component.data`

A type of an icon that renders an image vector.

```kotlin
@Stable
data class Vector(val imageVector: ImageVector, val tint: (@Composable () -> Color)? = null) : EditorIcon
```


## Members

### Vector

```kotlin
constructor(imageVector: ImageVector, tint: (@Composable () -> Color)? = null)
```

### imageVector

```kotlin
val imageVector: ImageVector
```

### tint

```kotlin
val tint: (@Composable () -> Color)? = null
```

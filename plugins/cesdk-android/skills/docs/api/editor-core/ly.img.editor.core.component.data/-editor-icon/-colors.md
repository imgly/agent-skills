# Colors

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.component.data`

A type of an icon that renders a list of colors in circles.

```kotlin
@Stable
data class Colors(val colors: List<Color?>) : EditorIcon
```


## Members

### Colors

```kotlin
constructor(color: Color?)
```

```kotlin
constructor(colors: List<Color?>)
```

A convenience constructor when there is a single color that should be drawn.

### colors

```kotlin
val colors: List<Color?>
```

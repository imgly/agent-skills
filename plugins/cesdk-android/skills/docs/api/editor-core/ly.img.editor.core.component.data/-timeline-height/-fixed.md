# Fixed

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.component.data`

The timeline uses a fixed height sized to show exactly tracks tracks, without auto-resizing. tracks counts overlay tracks above the background track, so 0 still shows the background track. Negative values are clamped to 0.

```kotlin
@Immutable
data class Fixed(val tracks: Int) : TimelineHeight
```


## Members

### Fixed

```kotlin
constructor(tracks: Int)
```

### tracks

```kotlin
val tracks: Int
```

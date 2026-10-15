# Dynamic

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.component.data`

The timeline auto-resizes to fit its tracks, growing to at most maximumTracks tracks tall. This is the default and reproduces the standard timeline.

```kotlin
@Immutable
data class Dynamic(val maximumTracks: Int = 3) : TimelineHeight
```


## Members

### Dynamic

```kotlin
constructor(maximumTracks: Int = 3)
```

### maximumTracks

```kotlin
val maximumTracks: Int = 3
```

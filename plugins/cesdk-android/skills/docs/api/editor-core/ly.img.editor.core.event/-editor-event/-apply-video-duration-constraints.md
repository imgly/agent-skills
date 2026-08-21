# ApplyVideoDurationConstraints

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.event`

An event for applying video duration constraints.

```kotlin
class ApplyVideoDurationConstraints(val minDuration: Duration? = null, val maxDuration: Duration? = null) : EditorEvent
```


## Members

### ApplyVideoDurationConstraints

```kotlin
constructor(minDuration: Duration? = null, maxDuration: Duration? = null)
```

### maxDuration

```kotlin
val maxDuration: Duration? = null
```

### minDuration

```kotlin
val minDuration: Duration? = null
```

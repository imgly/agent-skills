# ForceCropConfiguration

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.component.data`

Configuration for applying a force crop preset.

```kotlin
data class ForceCropConfiguration(val sourceId: String = "", val presetId: String = "", val mode: ForceCropMode = ForceCropMode.Silent, val presetCandidates: List<ForceCropPresetCandidate> = emptyList())
```


## Members

### ForceCropConfiguration

```kotlin
constructor(sourceId: String = "", presetId: String = "", mode: ForceCropMode = ForceCropMode.Silent, presetCandidates: List<ForceCropPresetCandidate> = emptyList())
```

### mode

```kotlin
val mode: ForceCropMode
```

### presetCandidates

```kotlin
val presetCandidates: List<ForceCropPresetCandidate>
```

### presetId

```kotlin
val presetId: String
```

### sourceId

```kotlin
val sourceId: String
```

# TextFontUsage

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

A current shaping snapshot. This does not indicate framebuffer or export completion.

```kotlin
data class TextFontUsage(val state: BlockState, val text: String, val runs: List<TextFontUsageRun>)
```


## Members

### TextFontUsage

```kotlin
constructor(state: BlockState, text: String, runs: List<TextFontUsageRun>)
```

### runs

```kotlin
val runs: List<TextFontUsageRun>
```

Font provenance runs. Empty text and pending snapshots have no runs.

### state

```kotlin
val state: BlockState
```

Resource readiness. Pending snapshots have no runs; errors can include fallback runs.

### text

```kotlin
val text: String
```

Resolved text after case transformations and template substitutions. Run indices refer to UTF-16 code units in this string, rather than the editable text/text property.

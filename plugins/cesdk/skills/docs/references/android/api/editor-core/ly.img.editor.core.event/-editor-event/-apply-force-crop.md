# ApplyForceCrop

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.event`

An event for applying a force crop configuration to a specific designBlock.

```kotlin
class ApplyForceCrop(val designBlock: DesignBlock, val configuration: ForceCropConfiguration) : EditorEvent
```


## Members

### ApplyForceCrop

```kotlin
constructor(designBlock: DesignBlock, configuration: ForceCropConfiguration)
```

### configuration

```kotlin
val configuration: ForceCropConfiguration
```

### designBlock

```kotlin
val designBlock: DesignBlock
```

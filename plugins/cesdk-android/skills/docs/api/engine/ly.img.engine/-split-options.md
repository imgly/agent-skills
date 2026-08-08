# SplitOptions

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

```kotlin
data class SplitOptions(val attachToParent: Boolean = true, val createParentTrackIfNeeded: Boolean = false, val selectNewBlock: Boolean = true)
```


## Members

### SplitOptions

```kotlin
constructor(attachToParent: Boolean = true, createParentTrackIfNeeded: Boolean = false, selectNewBlock: Boolean = true)
```

### attachToParent

```kotlin
val attachToParent: Boolean = true
```

Whether or not the new block will be attached to the same parent as the original. The default value is true.

### createParentTrackIfNeeded

```kotlin
val createParentTrackIfNeeded: Boolean = false
```

Whether to create a parent track if needed and add both blocks to it. Only used when attachToParent is true. The default value is false.

### selectNewBlock

```kotlin
val selectNewBlock: Boolean = true
```

Whether to select the newly created block after splitting. The default value is true.

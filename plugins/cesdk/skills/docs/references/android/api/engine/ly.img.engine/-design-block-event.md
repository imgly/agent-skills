# DesignBlockEvent

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

```kotlin
data class DesignBlockEvent(val block: DesignBlock, val type: DesignBlockEvent.Type)
```


## Members

### DesignBlockEvent

```kotlin
constructor(block: DesignBlock, type: DesignBlockEvent.Type)
```

### block

```kotlin
val block: DesignBlock
```

Design block that was changed.

### type

```kotlin
val type: DesignBlockEvent.Type
```

Type of change: one of CREATED, UPDATED, DESTROYED

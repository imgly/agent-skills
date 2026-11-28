# BlockClick

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

A click or tap on a block, emitted by BlockApi.onClickedWithCount.

```kotlin
data class BlockClick(val block: DesignBlock, val clickCount: Int)
```


## Members

### BlockClick

```kotlin
constructor(block: DesignBlock, clickCount: Int)
```

### block

```kotlin
val block: DesignBlock
```

The clicked block.

### clickCount

```kotlin
val clickCount: Int
```

The number of cohesive clicks or taps: 1 for a single click or tap, 2 for the second click of a double click, and so on.

# BlockMatte

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

A block that masks another block, and the channel it masks with. Experimental: this API may change in a minor release.

```kotlin
data class BlockMatte(val source: DesignBlock, val mode: MatteMode)
```


## Members

### BlockMatte

```kotlin
constructor(source: DesignBlock, mode: MatteMode)
```

### mode

```kotlin
val mode: MatteMode
```

The channel of the source that masks the block.

### source

```kotlin
val source: DesignBlock
```

The matte source block.

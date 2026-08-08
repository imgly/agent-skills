# Block

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

A specific block. Pages are blocks, so setting this on a page acts as the default for blocks inside that page.

```kotlin
data class Block(val block: DesignBlock) : MovementConstraintScope
```


## Members

### Block

```kotlin
constructor(block: DesignBlock)
```

### block

```kotlin
val block: DesignBlock
```

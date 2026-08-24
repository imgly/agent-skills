# BackgroundRemovalMask

- **Module:** `ly.img:plugin-background-removal`
- **Package:** `ly.img.editor.plugin.backgroundRemoval`

Segmentation mask returned by a background removal backend.

```kotlin
data class BackgroundRemovalMask(val buffer: ByteBuffer, val width: Int, val height: Int)
```


## Members

### BackgroundRemovalMask

```kotlin
constructor(buffer: ByteBuffer, width: Int, height: Int)
```

### buffer

```kotlin
val buffer: ByteBuffer
```

### height

```kotlin
val height: Int
```

### width

```kotlin
val width: Int
```

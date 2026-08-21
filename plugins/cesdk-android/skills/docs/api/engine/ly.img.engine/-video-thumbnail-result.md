# VideoThumbnailResult

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

```kotlin
class VideoThumbnailResult(val frameIndex: Int, val width: Int, val height: Int, val imageData: ByteBuffer)
```


## Members

### VideoThumbnailResult

```kotlin
constructor(frameIndex: Int, width: Int, height: Int, imageData: ByteBuffer)
```

### frameIndex

```kotlin
val frameIndex: Int
```

The frame index in the requested sequence.

### height

```kotlin
val height: Int
```

The thumbnail height in pixels.

### imageData

```kotlin
val imageData: ByteBuffer
```

The thumbnail image data as 8-bit RGBA.

### width

```kotlin
val width: Int
```

The thumbnail width in pixels.

# ExportVideoOptions

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

```kotlin
data class ExportVideoOptions(val h264Profile: Int = 77, val h264Level: Int = 52, val videoBitrate: Int = BITRATE_SYSTEM, val audioBitrate: Int = 0, val frameRate: Float = 30.0f, val targetWidth: Float? = null, val targetHeight: Float? = null, val allowTextOverhang: Boolean = false)
```


## Members

### ExportVideoOptions

```kotlin
constructor(h264Profile: Int = 77, h264Level: Int = 52, videoBitrate: VideoBitrate, audioBitrate: Int = 0, frameRate: Float = 30.0f, targetWidth: Float? = null, targetHeight: Float? = null, allowTextOverhang: Boolean = false)
```

```kotlin
constructor(h264Profile: Int = 77, h264Level: Int = 52, videoBitrate: Int = BITRATE_SYSTEM, audioBitrate: Int = 0, frameRate: Float = 30.0f, targetWidth: Float? = null, targetHeight: Float? = null, allowTextOverhang: Boolean = false)
```

The video export options with a strongly typed video bitrate. All parameters match the primary constructor, except that videoBitrate selects the bitrate as a VideoBitrate: VideoBitrate.System (the platform encoder uses the shared resolution/framerate default), VideoBitrate.Auto (the same bounded default across platforms) or VideoBitrate.Custom (an explicit bitrate in bits per second).

### allowTextOverhang

```kotlin
val allowTextOverhang: Boolean = false
```

If true, the export will include text bounding boxes that account for glyph overhangs. When enabled, text blocks with glyphs that extend beyond their frame (e.g., decorative fonts with swashes) will be exported with the full glyph bounds visible, preventing text clipping. The default value is false.

### audioBitrate

```kotlin
val audioBitrate: Int = 0
```

The audio bitrate in bits per second. If the value is 0, the bitrate is automatically determined by audio (128kbps for stereo AAC stream).

### frameRate

```kotlin
val frameRate: Float = 30.0f
```

The target frame rate of the exported video in Hz. The default value is 30.

### h264Level

```kotlin
val h264Level: Int = 52
```

Controls the H.264 encoding level. This relates to parameters used by the encoder such as bit rate, timings and motion vectors. Defined by the spec are levels 1.0 up to 6.2. To arrive at an integer value, the level is multiplied by ten. E.g. to get level 5.2, pass a value of 52. The default value is 52.

### h264Profile

```kotlin
val h264Profile: Int = 77
```

Determines the encoder feature set and in turn the quality, size and speed of the encoding process. The default value is 77 (Main Profile).

### targetHeight

```kotlin
val targetHeight: Float? = null
```

An optional target height used in conjunction with target width. If used, the block will be rendered large enough, that it fills the target size entirely while maintaining its aspect ratio.

### targetWidth

```kotlin
val targetWidth: Float? = null
```

An optional target width used in conjunction with target height. If used, the block will be rendered large enough, that it fills the target size entirely while maintaining its aspect ratio.

### videoBitrate

```kotlin
val videoBitrate: Int
```

The video bitrate in bits per second. Pass a positive value for an explicit bitrate, or one of the automatic modes BITRATE_SYSTEM (default) or BITRATE_AUTO. On Android there is no encoder-internal default, so both modes resolve to the same bounded resolution/framerate default. Prefer the constructor taking a VideoBitrate to select these modes by name.

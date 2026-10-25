# ExportVideoOptions

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

```kotlin
data class ExportVideoOptions(val h264Profile: Int = 77, val h264Level: Int = 52, val videoBitrate: Int = BITRATE_SYSTEM, val audioBitrate: Int = 0, val frameRate: Float? = null, val targetWidth: Float? = null, val targetHeight: Float? = null, val allowTextOverhang: Boolean = false, val videoCodec: VideoCodec = VideoCodec.AUTO, val audioCodec: AudioCodec = AudioCodec.AUTO, val exportAlpha: Boolean = false, val coverTimeOffset: Double? = null)
```


## Members

### ExportVideoOptions

```kotlin
constructor(h264Profile: Int = 77, h264Level: Int = 52, videoBitrate: VideoBitrate, audioBitrate: Int = 0, frameRate: Float? = null, targetWidth: Float? = null, targetHeight: Float? = null, allowTextOverhang: Boolean = false, videoCodec: VideoCodec = VideoCodec.AUTO, audioCodec: AudioCodec = AudioCodec.AUTO, exportAlpha: Boolean = false, coverTimeOffset: Double? = null)
```

```kotlin
constructor(h264Profile: Int = 77, h264Level: Int = 52, videoBitrate: Int = BITRATE_SYSTEM, audioBitrate: Int = 0, frameRate: Float? = null, targetWidth: Float? = null, targetHeight: Float? = null, allowTextOverhang: Boolean = false, videoCodec: VideoCodec = VideoCodec.AUTO, audioCodec: AudioCodec = AudioCodec.AUTO, exportAlpha: Boolean = false, coverTimeOffset: Double? = null)
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

### audioCodec

```kotlin
val audioCodec: AudioCodec
```

The codec to encode the audio with. AudioCodec.AUTO picks AAC for MimeType.MP4 and Opus for MimeType.WEBM. A codec that the file type cannot hold fails the export.

### coverTimeOffset

```kotlin
val coverTimeOffset: Double? = null
```

Cover time in seconds from the beginning of the exported video. Null uses the page playback position at export start, clamped to the exported frames. An explicit value must be finite and within [0, export duration). The frame containing that time is embedded as a PNG, preserving the export aspect ratio with both dimensions at most 512 pixels.

### exportAlpha

```kotlin
val exportAlpha: Boolean = false
```

Keep the transparency of the page in the video, as a second stream. Only VideoCodec.VP8 and VideoCodec.VP9 in MimeType.WEBM keep it, and any other codec fails the export. The default value is false.

### frameRate

```kotlin
val frameRate: Float? = null
```

The target frame rate of the exported video in Hz, greater than 0 and at most 240. The default value is null: the video uses the scene's scene/frameRate, the frame that the preview motion blur shows, or 30 when that is not a positive number.

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

An optional target height. If used, the block will be rendered large enough that it fills the target size entirely while maintaining its aspect ratio. Without a target width, the width follows from that aspect ratio.

### targetWidth

```kotlin
val targetWidth: Float? = null
```

An optional target width. If used, the block will be rendered large enough that it fills the target size entirely while maintaining its aspect ratio. Without a target height, the height follows from that aspect ratio.

### videoBitrate

```kotlin
val videoBitrate: Int
```

The video bitrate in bits per second. Pass a positive value for an explicit bitrate, or one of the automatic modes BITRATE_SYSTEM (default) or BITRATE_AUTO. On Android there is no encoder-internal default, so both modes resolve to the same bounded resolution/framerate default. Prefer the constructor taking a VideoBitrate to select these modes by name.

### videoCodec

```kotlin
val videoCodec: VideoCodec
```

The codec to encode the video with. VideoCodec.AUTO picks H.264 for MimeType.MP4 and VP9 for MimeType.WEBM. A codec that the file type cannot hold fails the export.

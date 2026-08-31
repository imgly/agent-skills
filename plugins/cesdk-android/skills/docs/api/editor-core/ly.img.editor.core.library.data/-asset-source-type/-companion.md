# Companion

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.library.data`

```kotlin
object Companion
```


## Members

### AudioUploads

```kotlin
val AudioUploads: UploadAssetSourceType
```

The default source type for audio uploads.

### Audio

```kotlin
val Audio: AssetSourceType
```

The default source type for audios.

### CaptionPresets

```kotlin
val CaptionPresets: AssetSourceType
```

Caption style presets. Assets carry an opaque payload.stylePreset that the engine applies to one caption and syncs across its track.

### GalleryAllVisuals

```kotlin
val GalleryAllVisuals: SystemGalleryAssetSourceType
```

Asset source type for accessing the device gallery.

### GalleryImage

```kotlin
val GalleryImage: SystemGalleryAssetSourceType
```

Asset source type for accessing the device gallery.

### GalleryVideo

```kotlin
val GalleryVideo: SystemGalleryAssetSourceType
```

Asset source type for accessing the device gallery.

### ImageUploads

```kotlin
val ImageUploads: UploadAssetSourceType
```

The default source type for image uploads.

### Images

```kotlin
val Images: AssetSourceType
```

The default source type for images.

### Shapes

```kotlin
val Shapes: AssetSourceType
```

The default source type for shapes.

### Stickers

```kotlin
val Stickers: AssetSourceType
```

The default source type for stickers.

### TextComponents

```kotlin
val TextComponents: AssetSourceType
```

The default source type for text components.

### TextCurves

```kotlin
val TextCurves: AssetSourceType
```

Curved text presets, used by the text-on-path picker.

### TextPlain

```kotlin
val TextPlain: AssetSourceType
```

Plain text presets. Assets carry an opaque payload.stylePreset that the engine applies; the section drills into the source's groups (default / elegant / modernTech).

### TextStyles

```kotlin
val TextStyles: AssetSourceType
```

Decorative text style presets.

### Text

```kotlin
val Text: AssetSourceType
```
> **Deprecated:** The default text library now uses the split text preset sources: TextPlain (ly.img.text), TextStyles (ly.img.text.styles), TextCurves (ly.img.text.curves), TextComponents (ly.img.text.components).

The legacy source type for plain text, served by TextAssetSource. The default text library now uses the split text preset sources (TextPlain, TextStyles, TextCurves) and no longer references this source type.

### Typeface

```kotlin
val Typeface: AssetSourceType
```

The default source type for typeface.

### VideoUploads

```kotlin
val VideoUploads: UploadAssetSourceType
```

The default source type for video uploads.

### Videos

```kotlin
val Videos: AssetSourceType
```

The default source type for videos.

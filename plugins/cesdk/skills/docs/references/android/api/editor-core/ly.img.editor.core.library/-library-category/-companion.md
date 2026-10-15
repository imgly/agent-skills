# Companion

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.library`

```kotlin
object Companion
```


## Members

### Audio

```kotlin
val Audio: LibraryCategory
```

The default library category for audio assets.

### Clips

```kotlin
val Clips: LibraryCategory
```

The default library category for clip assets.

### ImagesWithoutSystemGallery

```kotlin
val ImagesWithoutSystemGallery: LibraryCategory
```

Variant of Images that omits the system gallery section (only curated sources and uploads).

### Images

```kotlin
val Images: LibraryCategory
```

### Overlays

```kotlin
val Overlays: LibraryCategory
```

The default library category for overlay assets.

### Shapes

```kotlin
val Shapes: LibraryCategory
```

The default library category for shape assets.

### StickersAndShapes

```kotlin
val StickersAndShapes: LibraryCategory
```

The default library category for sticker and shape assets.

### Stickers

```kotlin
val Stickers: LibraryCategory
```

The default library category for sticker assets.

### Text

```kotlin
val Text: LibraryCategory
```

The default library category for text assets.

### VideoWithoutSystemGallery

```kotlin
val VideoWithoutSystemGallery: LibraryCategory
```

Variant of Video that omits the system gallery section (only curated sources and uploads).

### Video

```kotlin
val Video: LibraryCategory
```

### getElements

```kotlin
fun getElements(includeAVResources: Boolean = false, images: LibraryCategory = Images, videos: LibraryCategory = Video, audios: LibraryCategory = Audio, text: LibraryCategory = Text, shapes: LibraryCategory = Shapes, stickers: LibraryCategory = Stickers): LibraryCategory
```

A helper function to construct an abstract "Elements" category that is a combination of categories.

### getGallery

```kotlin
fun getGallery(includeAVResources: Boolean): LibraryCategory
```

### sourceTypes

```kotlin
val LibraryContent.sourceTypes: List<AssetSourceType>
```

All the source types of the library content.

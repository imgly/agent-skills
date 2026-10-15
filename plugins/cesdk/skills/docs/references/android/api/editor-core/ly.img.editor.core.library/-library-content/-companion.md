# Companion

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.library`

```kotlin
object Companion
```


## Members

### Audio

```kotlin
val Audio: LibraryContent.Sections
```

The default content for displaying audio assets.

### Clips

```kotlin
val Clips: LibraryContent.Sections
```

The default content for displaying clip assets.

### Images

```kotlin
val Images: LibraryContent.Sections
```

### Overlays

```kotlin
val Overlays: LibraryContent.Sections
```

The default content for displaying overlay assets.

### Shapes

```kotlin
val Shapes: LibraryContent.Sections
```

The default content for displaying shape assets.

### StickersAndShapes

```kotlin
val StickersAndShapes: LibraryContent.Sections
```

The default content for displaying sticker and shape assets.

### Stickers

```kotlin
val Stickers: LibraryContent.Sections
```

The default content for displaying sticker assets.

### Text

```kotlin
val Text: LibraryContent.Sections
```

The default content for displaying text assets.

### Video

```kotlin
val Video: LibraryContent.Sections
```

### images

```kotlin
fun images(includeSystemGallery: Boolean = true): LibraryContent.Sections
```

Returns the default image content, optionally including the system gallery section.

### videos

```kotlin
fun videos(includeSystemGallery: Boolean = true): LibraryContent.Sections
```

Returns the default video content, optionally including the system gallery section.

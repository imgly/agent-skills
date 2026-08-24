# AssetLibrary

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.library`

Configuration class for the asset library.

```kotlin
data class AssetLibrary(val tabs: () -> List<LibraryCategory>, val images: () -> LibraryCategory = { LibraryCategory.Images }, val videos: () -> LibraryCategory = { LibraryCategory.Video }, val gallery: () -> LibraryCategory = { LibraryCategory.getGallery(includeAVResources = false) }, val audios: () -> LibraryCategory = { LibraryCategory.Audio }, val text: () -> LibraryCategory = { LibraryCategory.Text }, val shapes: () -> LibraryCategory = { LibraryCategory.Shapes }, val stickers: () -> LibraryCategory = { LibraryCategory.Stickers }, val overlays: () -> LibraryCategory = { createOverlaysCategory( videos = videos().withoutSystemGallerySections(), images = images().withoutSystemGallerySections(), ) }, val clips: () -> LibraryCategory = { createClipsCategory( videos = videos().withoutSystemGallerySections(), images = images().withoutSystemGallerySections(), ) }, val elements: () -> LibraryCategory = { LibraryCategory.getElements( images = images(), videos = videos(), audios = audios(), text = text(), shapes = shapes(), stickers = stickers(), ) }, val stickersAndShapes: () -> LibraryCategory = { createStickersAndShapesCategory( stickers = stickers(), shapes = shapes(), ) })
```


## Members

### AssetLibrary

```kotlin
constructor(tabs: () -> List<LibraryCategory>, images: () -> LibraryCategory = { LibraryCategory.Images }, videos: () -> LibraryCategory = { LibraryCategory.Video }, gallery: () -> LibraryCategory = { LibraryCategory.getGallery(includeAVResources = false) }, audios: () -> LibraryCategory = { LibraryCategory.Audio }, text: () -> LibraryCategory = { LibraryCategory.Text }, shapes: () -> LibraryCategory = { LibraryCategory.Shapes }, stickers: () -> LibraryCategory = { LibraryCategory.Stickers }, overlays: () -> LibraryCategory = { createOverlaysCategory( videos = videos().withoutSystemGallerySections(), images = images().withoutSystemGallerySections(), ) }, clips: () -> LibraryCategory = { createClipsCategory( videos = videos().withoutSystemGallerySections(), images = images().withoutSystemGallerySections(), ) }, elements: () -> LibraryCategory = { LibraryCategory.getElements( images = images(), videos = videos(), audios = audios(), text = text(), shapes = shapes(), stickers = stickers(), ) }, stickersAndShapes: () -> LibraryCategory = { createStickersAndShapesCategory( stickers = stickers(), shapes = shapes(), ) })
```

### audios

```kotlin
val audios: () -> LibraryCategory
```

### clips

```kotlin
val clips: () -> LibraryCategory
```

### elements

```kotlin
val elements: () -> LibraryCategory
```

### gallery

```kotlin
val gallery: () -> LibraryCategory
```

### images

```kotlin
val images: () -> LibraryCategory
```

### overlays

```kotlin
val overlays: () -> LibraryCategory
```

### shapes

```kotlin
val shapes: () -> LibraryCategory
```

### stickersAndShapes

```kotlin
val stickersAndShapes: () -> LibraryCategory
```

### stickers

```kotlin
val stickers: () -> LibraryCategory
```

### tabs

```kotlin
val tabs: () -> List<LibraryCategory>
```

### text

```kotlin
val text: () -> LibraryCategory
```

### videos

```kotlin
val videos: () -> LibraryCategory
```

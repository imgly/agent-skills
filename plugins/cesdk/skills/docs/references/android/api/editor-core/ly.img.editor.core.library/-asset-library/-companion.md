# Companion

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.library`

```kotlin
object Companion
```


## Members

### getDefault

```kotlin
fun getDefault(includeAVResources: Boolean = false, tabs: List<AssetLibrary.Tab> = Tab.entries, images: LibraryCategory = LibraryCategory.Images, videos: LibraryCategory = LibraryCategory.Video, audios: LibraryCategory = LibraryCategory.Audio, text: LibraryCategory = LibraryCategory.Text, shapes: LibraryCategory = LibraryCategory.Shapes, stickers: LibraryCategory = LibraryCategory.Stickers, overlays: LibraryCategory = createOverlaysCategory( videos = videos.withoutSystemGallerySections(), images = images.withoutSystemGallerySections(), ), clips: LibraryCategory = createClipsCategory( videos = videos.withoutSystemGallerySections(), images = images.withoutSystemGallerySections(), ), stickersAndShapes: LibraryCategory = createStickersAndShapesCategory(stickers = stickers, shapes = shapes), gallery: LibraryCategory = LibraryCategory.getGallery(includeAVResources)): AssetLibrary
```

A helper function for creating an AssetLibrary instance. This is an ideal builder in case you just want to swap positions of tabs or drop some of the tabs. You can also modify a specific category by completely replacing it or modifying using the helper functions LibraryCategory.addSection, LibraryCategory.dropSection and LibraryCategory.replaceSection.

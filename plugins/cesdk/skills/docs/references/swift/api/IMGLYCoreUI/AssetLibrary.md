# AssetLibrary

- **Module:** `IMGLYCoreUI`
- **DocC identifier:** `/documentation/IMGLYCoreUI/AssetLibrary`

An interface to define an asset library.

```swift
@MainActor protocol AssetLibrary : View
```

## Members

### audioTab

```swift
@MainActor var audioTab: Self.AudioTab { get }
```

A view to select audio assets.

### AudioTab

```swift
associatedtype AudioTab : View
```

### clipsTab

```swift
@MainActor var clipsTab: Self.ClipsTab { get }
```

A view to select video and image assets used as clips in the `VideoEditor`.

### ClipsTab

```swift
associatedtype ClipsTab : View
```

### elementsTab

```swift
@MainActor var elementsTab: Self.ElementsTab { get }
```

A view to select assets used in the `DesignEditor`.

### ElementsTab

```swift
associatedtype ElementsTab : View
```

### imagesTab

```swift
@MainActor var imagesTab: Self.ImagesTab { get }
```

A view to select image assets.

### ImagesTab

```swift
associatedtype ImagesTab : View
```

### overlaysTab

```swift
@MainActor var overlaysTab: Self.OverlaysTab { get }
```

A view to select video and image assets used as overlays in the `VideoEditor`.

### OverlaysTab

```swift
associatedtype OverlaysTab : View
```

### photoRollTab

```swift
@MainActor var photoRollTab: Self.PhotoRollTab { get }
```

A view to select assets from the photo roll.

### PhotoRollTab

```swift
associatedtype PhotoRollTab : View
```

### shapesTab

```swift
@MainActor var shapesTab: Self.ShapesTab { get }
```

A view to select shape assets.

### ShapesTab

```swift
associatedtype ShapesTab : View
```

### stickersAndShapesTab

```swift
@MainActor var stickersAndShapesTab: Self.StickersAndShapesTab { get }
```

A view to select sticker and shape assets used in the `VideoEditor`.

### StickersAndShapesTab

```swift
associatedtype StickersAndShapesTab : View
```

### stickersTab

```swift
@MainActor var stickersTab: Self.StickersTab { get }
```

A view to select sticker assets.

### StickersTab

```swift
associatedtype StickersTab : View
```

### textTab

```swift
@MainActor var textTab: Self.TextTab { get }
```

A view to select text assets.

### TextTab

```swift
associatedtype TextTab : View
```

### videosTab

```swift
@MainActor var videosTab: Self.VideosTab { get }
```

A view to select video assets.

### VideosTab

```swift
associatedtype VideosTab : View
```

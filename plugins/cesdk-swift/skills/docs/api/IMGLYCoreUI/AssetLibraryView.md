# AssetLibraryView

- **Module:** `IMGLYCoreUI`
- **DocC identifier:** `/documentation/IMGLYCoreUI/AssetLibraryView`

An asset library view that renders content from `AssetLibraryCategory` data. This is the default `AssetLibrary` implementation used by the editor.

```swift
@MainActor struct AssetLibraryView
```

## Members

### audioTab

```swift
@ViewBuilder @MainActor var audioTab: some View { get }
```

A view to select audio assets.

### body

```swift
@MainActor var body: some View { get }
```

### clipsTab

```swift
@MainActor var clipsTab: some View { get }
```

A view to select video and image assets used as clips in the `VideoEditor`.

### elementsTab

```swift
@ViewBuilder @MainActor var elementsTab: some View { get }
```

A view to select assets used in the `DesignEditor`.

### imagesTab

```swift
@ViewBuilder @MainActor var imagesTab: some View { get }
```

A view to select image assets.

### init(categories:includeAVResources:)

```swift
@MainActor init(categories: [AssetLibraryCategory], includeAVResources: Bool = false)
```

Creates an asset library from category data. `categories`

### overlaysTab

```swift
@MainActor var overlaysTab: some View { get }
```

A view to select video and image assets used as overlays in the `VideoEditor`.

### photoRollTab

```swift
@MainActor var photoRollTab: some View { get }
```

A view to select assets from the photo roll.

### shapesTab

```swift
@ViewBuilder @MainActor var shapesTab: some View { get }
```

A view to select shape assets.

### stickersAndShapesTab

```swift
@MainActor var stickersAndShapesTab: some View { get }
```

A view to select sticker and shape assets used in the `VideoEditor`.

### stickersTab

```swift
@ViewBuilder @MainActor var stickersTab: some View { get }
```

A view to select sticker assets.

### textTab

```swift
@ViewBuilder @MainActor var textTab: some View { get }
```

A view to select text assets.

### videosTab

```swift
@ViewBuilder @MainActor var videosTab: some View { get }
```

A view to select video assets.

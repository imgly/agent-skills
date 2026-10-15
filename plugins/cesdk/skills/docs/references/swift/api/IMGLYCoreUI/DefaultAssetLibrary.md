# DefaultAssetLibrary

- **Module:** `IMGLYCoreUI`
- **DocC identifier:** `/documentation/IMGLYCoreUI/DefaultAssetLibrary`

> **Deprecated:** Use AssetLibraryConfiguration with AssetLibraryCategory modifications instead.

This is a predefined [`AssetLibrary`](assetlibrary.md) intended to quickly customize some parts of the default asset library without implementing a complete [`AssetLibrary`](assetlibrary.md) from scratch. Instead of:

```swift
@MainActor struct DefaultAssetLibrary
```

## Members

### audio

> **Deprecated:** Use AssetLibraryConfiguration with AssetLibraryCategory modifications instead.

```swift
@AssetLibraryBuilder @MainActor static var audio: any AssetLibraryContent { get }
```

The default audio asset library content.

### audio(audio:)

> **Deprecated:** Use AssetLibraryConfiguration with AssetLibraryCategory modifications instead.

```swift
@MainActor func audio(@AssetLibraryBuilder audio: @MainActor @Sendable () -> any AssetLibraryContent) -> DefaultAssetLibrary
```

Modify the audio asset library content. `audio`

### audioLabel(_:)

> **Deprecated:** Use AssetLibraryConfiguration with AssetLibraryCategory modifications instead.

```swift
@MainActor static func audioLabel(_ title: LocalizedStringResource) -> some View
```

The default label for the audio tab.

### audioTab

> **Deprecated:** Use AssetLibraryConfiguration with AssetLibraryCategory modifications instead.

```swift
@MainActor var audioTab: some View { get }
```

A view to select audio assets.

### body

> **Deprecated:** Use AssetLibraryConfiguration with AssetLibraryCategory modifications instead.

```swift
@MainActor var body: some View { get }
```

### clipsTab

> **Deprecated:** Use AssetLibraryConfiguration with AssetLibraryCategory modifications instead.

```swift
@MainActor var clipsTab: some View { get }
```

A view to select video and image assets used as clips in the `VideoEditor`.

### DefaultAssetLibrary.Tab

> **Deprecated:** Use AssetLibraryConfiguration with AssetLibraryCategory modifications instead.

```swift
enum Tab
```

A tab for a specific asset type.

### Tab.DefaultAssetLibrary.Tab.audio

> **Deprecated:** Use AssetLibraryConfiguration with AssetLibraryCategory modifications instead.

```swift
case audio
```

### Tab.DefaultAssetLibrary.Tab.elements

> **Deprecated:** Use AssetLibraryConfiguration with AssetLibraryCategory modifications instead.

```swift
case elements
```

### Tab.DefaultAssetLibrary.Tab.images

> **Deprecated:** Use AssetLibraryConfiguration with AssetLibraryCategory modifications instead.

```swift
case images
```

### Tab.DefaultAssetLibrary.Tab.photoRoll

> **Deprecated:** Use AssetLibraryConfiguration with AssetLibraryCategory modifications instead.

```swift
case photoRoll
```

### Tab.DefaultAssetLibrary.Tab.shapes

> **Deprecated:** Use AssetLibraryConfiguration with AssetLibraryCategory modifications instead.

```swift
case shapes
```

### Tab.DefaultAssetLibrary.Tab.stickers

> **Deprecated:** Use AssetLibraryConfiguration with AssetLibraryCategory modifications instead.

```swift
case stickers
```

### Tab.DefaultAssetLibrary.Tab.text

> **Deprecated:** Use AssetLibraryConfiguration with AssetLibraryCategory modifications instead.

```swift
case text
```

### Tab.DefaultAssetLibrary.Tab.videos

> **Deprecated:** Use AssetLibraryConfiguration with AssetLibraryCategory modifications instead.

```swift
case videos
```

### elementsLabel(_:)

> **Deprecated:** Use AssetLibraryConfiguration with AssetLibraryCategory modifications instead.

```swift
@MainActor static func elementsLabel(_ title: LocalizedStringResource) -> some View
```

The default label for the elements tab.

### elementsTab

> **Deprecated:** Use AssetLibraryConfiguration with AssetLibraryCategory modifications instead.

```swift
@MainActor var elementsTab: some View { get }
```

A view to select assets used in the `DesignEditor`.

### images

> **Deprecated:** Use AssetLibraryConfiguration with AssetLibraryCategory modifications instead.

```swift
@AssetLibraryBuilder @MainActor static var images: any AssetLibraryContent { get }
```

The default image asset library content.

### images(images:)

> **Deprecated:** Use AssetLibraryConfiguration with AssetLibraryCategory modifications instead.

```swift
@MainActor func images(@AssetLibraryBuilder images: @MainActor @Sendable () -> any AssetLibraryContent) -> DefaultAssetLibrary
```

Modify the image asset library content. `images`

### imagesLabel(_:)

> **Deprecated:** Use AssetLibraryConfiguration with AssetLibraryCategory modifications instead.

```swift
@MainActor static func imagesLabel(_ title: LocalizedStringResource) -> some View
```

The default label for the images tab.

### imagesTab

> **Deprecated:** Use AssetLibraryConfiguration with AssetLibraryCategory modifications instead.

```swift
@MainActor var imagesTab: some View { get }
```

A view to select image assets.

### init(tabs:includeAVResources:)

> **Deprecated:** Use AssetLibraryConfiguration with AssetLibraryCategory modifications instead.

```swift
@MainActor init(tabs: [DefaultAssetLibrary.Tab] = Tab.allCases, includeAVResources: Bool = false)
```

Creates a default asset library with a selection of `tabs`. `tabs`

### overlaysTab

> **Deprecated:** Use AssetLibraryConfiguration with AssetLibraryCategory modifications instead.

```swift
@MainActor var overlaysTab: some View { get }
```

A view to select video and image assets used as overlays in the `VideoEditor`.

### photoRollLabel(_:)

> **Deprecated:** Use AssetLibraryConfiguration with AssetLibraryCategory modifications instead.

```swift
@MainActor static func photoRollLabel(_ title: LocalizedStringResource) -> some View
```

The default label for the photo roll tab.

### photoRollTab

> **Deprecated:** Use AssetLibraryConfiguration with AssetLibraryCategory modifications instead.

```swift
@MainActor var photoRollTab: some View { get }
```

A view to select assets from the photo roll.

### shapes

> **Deprecated:** Use AssetLibraryConfiguration with AssetLibraryCategory modifications instead.

```swift
@AssetLibraryBuilder @MainActor static var shapes: any AssetLibraryContent { get }
```

The default shape asset library content.

### shapes(shapes:)

> **Deprecated:** Use AssetLibraryConfiguration with AssetLibraryCategory modifications instead.

```swift
@MainActor func shapes(@AssetLibraryBuilder shapes: @MainActor @Sendable () -> any AssetLibraryContent) -> DefaultAssetLibrary
```

Modify the shape asset library content. `shapes`

### shapesLabel(_:)

> **Deprecated:** Use AssetLibraryConfiguration with AssetLibraryCategory modifications instead.

```swift
@MainActor static func shapesLabel(_ title: LocalizedStringResource) -> some View
```

The default label for the shapes tab.

### shapesTab

> **Deprecated:** Use AssetLibraryConfiguration with AssetLibraryCategory modifications instead.

```swift
@MainActor var shapesTab: some View { get }
```

A view to select shape assets.

### stickers

> **Deprecated:** Use AssetLibraryConfiguration with AssetLibraryCategory modifications instead.

```swift
@AssetLibraryBuilder @MainActor static var stickers: any AssetLibraryContent { get }
```

The default sticker asset library content.

### stickers(stickers:)

> **Deprecated:** Use AssetLibraryConfiguration with AssetLibraryCategory modifications instead.

```swift
@MainActor func stickers(@AssetLibraryBuilder stickers: @MainActor @Sendable () -> any AssetLibraryContent) -> DefaultAssetLibrary
```

Modify the sticker asset library content. `stickers`

### stickersAndShapesTab

> **Deprecated:** Use AssetLibraryConfiguration with AssetLibraryCategory modifications instead.

```swift
@MainActor var stickersAndShapesTab: some View { get }
```

A view to select sticker and shape assets used in the `VideoEditor`.

### stickersLabel(_:)

> **Deprecated:** Use AssetLibraryConfiguration with AssetLibraryCategory modifications instead.

```swift
@MainActor static func stickersLabel(_ title: LocalizedStringResource) -> some View
```

The default label for the stickers tab.

### stickersTab

> **Deprecated:** Use AssetLibraryConfiguration with AssetLibraryCategory modifications instead.

```swift
@MainActor var stickersTab: some View { get }
```

A view to select sticker assets.

### text

> **Deprecated:** Use AssetLibraryConfiguration with AssetLibraryCategory modifications instead.

```swift
@AssetLibraryBuilder @MainActor static var text: any AssetLibraryContent { get }
```

The default text asset library content: plain text, text styles, text combinations, and curved text.

### text(text:)

> **Deprecated:** Use AssetLibraryConfiguration with AssetLibraryCategory modifications instead.

```swift
@MainActor func text(@AssetLibraryBuilder text: @MainActor @Sendable () -> any AssetLibraryContent) -> DefaultAssetLibrary
```

Modify the text asset library content. `text`

### textLabel(_:)

> **Deprecated:** Use AssetLibraryConfiguration with AssetLibraryCategory modifications instead.

```swift
@MainActor static func textLabel(_ title: LocalizedStringResource) -> some View
```

The default label for the text tab.

### textPresets

> **Deprecated:** Use AssetLibraryConfiguration with AssetLibraryCategory modifications instead.

```swift
@AssetLibraryBuilder @MainActor static var textPresets: any AssetLibraryContent { get }
```

The default text style-presets content: a single section whose “See All” reveals the grouped overview. Used in the “Add Text” flow.

### textStylePresetGroups

> **Deprecated:** Use AssetLibraryConfiguration with AssetLibraryCategory modifications instead.

```swift
@AssetLibraryBuilder @MainActor static var textStylePresetGroups: any AssetLibraryContent { get }
```

The grouped text style-presets overview: one section per asset group of the `ly.img.text.styles` source. Shown directly by the inspector-bar “Styles” sheet.

### textTab

> **Deprecated:** Use AssetLibraryConfiguration with AssetLibraryCategory modifications instead.

```swift
@MainActor var textTab: some View { get }
```

A view to select text assets.

### uploadsLabel(_:)

> **Deprecated:** 
  Deprecated in v1.60.0. Please see the changelog for migration details:
  https://img.ly/docs/cesdk/changelog/v1-60-0/
  

```swift
@MainActor static func uploadsLabel(_ title: LocalizedStringResource) -> some View
```

The default label for the uploads tab.

### videos

> **Deprecated:** Use AssetLibraryConfiguration with AssetLibraryCategory modifications instead.

```swift
@AssetLibraryBuilder @MainActor static var videos: any AssetLibraryContent { get }
```

The default video asset library content.

### videos(videos:)

> **Deprecated:** Use AssetLibraryConfiguration with AssetLibraryCategory modifications instead.

```swift
@MainActor func videos(@AssetLibraryBuilder videos: @MainActor @Sendable () -> any AssetLibraryContent) -> DefaultAssetLibrary
```

Modify the video asset library content. `videos`

### videosLabel(_:)

> **Deprecated:** Use AssetLibraryConfiguration with AssetLibraryCategory modifications instead.

```swift
@MainActor static func videosLabel(_ title: LocalizedStringResource) -> some View
```

The default label for the videos tab.

### videosTab

> **Deprecated:** Use AssetLibraryConfiguration with AssetLibraryCategory modifications instead.

```swift
@MainActor var videosTab: some View { get }
```

A view to select video assets.

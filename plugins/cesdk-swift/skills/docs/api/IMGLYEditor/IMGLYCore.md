# IMGLYCore

- **Module:** `IMGLYEditor`
- **DocC identifier:** `/documentation/IMGLYEditor/IMGLYCore`

## Members

### IMGLY.adaptiveIconOnly

```swift
static var adaptiveIconOnly: AdaptiveIconOnlyLabelStyle { get }
```

An adaptive label style that displays the title and icon if the vertical size class is compact and only the icon otherwise.

### IMGLY.addAsset

```swift
static let addAsset: Image
```

An icon image for adding an asset.

### IMGLY.addAudio

```swift
static let addAudio: Image
```

An icon image for adding audio.

### IMGLY.addCameraBackground

```swift
static let addCameraBackground: Image
```

An icon image for adding content from the camera to the background track.

### IMGLY.addCameraForeground

```swift
static let addCameraForeground: Image
```

An icon image for adding content from the camera.

### IMGLY.addElement

```swift
static let addElement: Image
```

An icon image for adding an element from the library.

### IMGLY.addImage

```swift
static let addImage: Image
```

An icon image for adding an image.

### IMGLY.addPhotoRollBackground

```swift
static let addPhotoRollBackground: Image
```

An icon image for adding content from the photo roll to the background track.

### IMGLY.addPhotoRollForeground

```swift
static let addPhotoRollForeground: Image
```

An icon image for adding content from the photo roll.

### IMGLY.addShape

```swift
static let addShape: Image
```

An icon image for adding a shape.

### IMGLY.addSticker

```swift
static let addSticker: Image
```

An icon image for adding a sticker.

### IMGLY.addText

```swift
static let addText: Image
```

An icon image for adding text.

### IMGLY.addVideo

```swift
static let addVideo: Image
```

An icon image for adding a video.

### IMGLY.addVoiceover

```swift
static let addVoiceover: Image
```

An icon image for adding a voiceover.

### IMGLY.adjustments

```swift
static let adjustments: Image
```

An icon image for adjustments.

### IMGLY.animation

```swift
static let animation: Image
```

An icon image for animation.

### IMGLY.assetLibrary

```swift
static var assetLibrary: AssetLibraryButtonStyle { get }
```

A primitive button style for the asset library dock button.

### IMGLY.blur

```swift
static let blur: Image
```

An icon image for blur.

### IMGLY.bringForward

```swift
static let bringForward: Image
```

An icon image for bring forward.

### IMGLY.canvasMenu(_:)

```swift
@MainActor static func canvasMenu(_ style: CanvasMenuLabelStyle.Style) -> Wrapped
```

A label style used for the [`CanvasMenu`](../../canvasmenu.md). `style`

### IMGLY.clipSpeed

```swift
static let clipSpeed: Image
```

An icon image for clip speed.

### IMGLY.configuration(_:)

```swift
@MainActor func configuration(@EditorConfigurationResultBuilder _ configurations: @escaping () -> [EditorConfiguration]) -> some View
```

Configures the editor using one or more composable configurations. `configurations`

### IMGLY.crop

```swift
static let crop: Image
```

An icon image for crop.

### IMGLY.delete

```swift
static let delete: Image
```

An icon image for delete.

### IMGLY.duplicate

```swift
static let duplicate: Image
```

An icon image for duplicate.

### IMGLY.editText

```swift
static let editText: Image
```

An icon image for edit text.

### IMGLY.effect

```swift
static let effect: Image
```

An icon image for effect.

### IMGLY.enterGroup

```swift
static let enterGroup: Image
```

An icon image for enter group.

### IMGLY.export

```swift
static let export: Image
```

An icon image for export.

### IMGLY.filter

```swift
static let filter: Image
```

An icon image for filter.

### IMGLY.formatText

```swift
static let formatText: Image
```

An icon image for format text.

### IMGLY

```swift
extension IMGLY
```

### IMGLY.large

```swift
static let large: PresentationDetent
```

A large presentation detent.

### IMGLY.layer

```swift
static let layer: Image
```

An icon image for layer.

### IMGLY.medium

```swift
static let medium: PresentationDetent
```

A medium presentation detent.

### IMGLY.micro

```swift
static let micro: PresentationDetent
```

A micro presentation detent. Smaller than [`tiny`](tiny.md); matches the height of the editor dock bar. Use this when a sheet must remain compact so the timeline stays fully visible beneath it.

### IMGLY.moveAsClip

```swift
static let moveAsClip: Image
```

An icon image for move as clip.

### IMGLY.moveAsOverlay

```swift
static let moveAsOverlay: Image
```

An icon image for move as overlay.

### IMGLY.pages

```swift
static let pages: Image
```

An icon image for toggling pages mode.

### IMGLY.preview

```swift
static let preview: Image
```

An icon image for toggling preview mode.

### IMGLY.redo

```swift
static let redo: Image
```

An icon image for redo.

### IMGLY.reorder

```swift
static let reorder: Image
```

An icon image for reoder.

### IMGLY.replace

```swift
static let replace: Image
```

An icon image for replace.

### IMGLY.resize

```swift
static let resize: Image
```

An icon image for resize.

### IMGLY.selectGroup

```swift
static let selectGroup: Image
```

An icon image for select group.

### IMGLY.sendBackward

```swift
static let sendBackward: Image
```

An icon image for send backward.

### IMGLY.shape

```swift
static let shape: Image
```

An icon image for shape.

### IMGLY.small

```swift
static let small: PresentationDetent
```

A small presentation detent.

### IMGLY.split

```swift
static let split: Image
```

An icon image for split.

### IMGLY.textOnPath

```swift
static let textOnPath: Image
```

An icon image for text on path.

### IMGLY.textStyles

```swift
static let textStyles: Image
```

An icon image for text style presets (“Presets”).

### IMGLY.tiny

```swift
static let tiny: PresentationDetent
```

A tiny presentation detent.

### IMGLY.undo

```swift
static let undo: Image
```

An icon image for undo.

### IMGLY.volume

```swift
static let volume: Image
```

An icon image for volume.

# Dock

- **Module:** `IMGLYEditor`
- **DocC identifier:** `/documentation/IMGLYEditor/Dock`

A namespace for the dock component.

```swift
enum Dock
```

## Members

### Buttons.ID.adjustments

```swift
static var adjustments: EditorComponentID { get }
```

The id of the [`adjustments(action:title:icon:isEnabled:isVisible:)`](../adjustments(action:title:icon:isenabled:isvisible:).md) button.

### Buttons.adjustments(action:title:icon:isEnabled:isVisible:)

```swift
@MainActor static func adjustments(action: @escaping Dock.Context.To<Void> = {
      try $0.eventHandler.send(.openSheet(type: .adjustments(id: nonNil($0.engine.scene.getCurrentPage()))))
    }, @ViewBuilder title: @escaping Dock.Context.To<some View> = { _ in
      Text(.imgly.localized("ly_img_editor_dock_button_adjustments"))
    }, @ViewBuilder icon: @escaping Dock.Context.To<some View> = { _ in Image.imgly.adjustments }, isEnabled: @escaping Dock.Context.To<Bool> = { _ in true }, isVisible: @escaping Dock.Context.To<Bool> = {
      try $0.engine.block.isAllowedByScope(nonNil($0.engine.scene.getCurrentPage()), key: "appearance/adjustments")
    }) -> some Dock.Item
```

Creates a [`Dock.Button`](../button.md) that opens the adjustments sheet. `action`

### Configuration.Builder.alignment

```swift
var alignment: Dock.Alignment?
```

The dock item alignment.

### Buttons.ID.assetLibrary

```swift
static var assetLibrary: EditorComponentID { get }
```

The id of the [`assetLibrary(action:title:icon:isEnabled:isVisible:modifier:)`](../assetlibrary(action:title:icon:isenabled:isvisible:modifier:).md) button.

### Context.assetLibrary

```swift
let assetLibrary: any AssetLibrary
```

The configured [`AssetLibrary`](../../../imglycoreui/assetlibrary.md).

### Buttons.assetLibrary(action:title:icon:isEnabled:isVisible:modifier:)

```swift
@MainActor static func assetLibrary(action: @escaping Dock.Context.To<Void> = { context in
      context.eventHandler.send(.openSheet(type: .libraryAdd { context.assetLibrary }))
    }, @ViewBuilder title: @escaping Dock.Context.To<some View> = { _ in
      Text(.imgly.localized("ly_img_editor_dock_button_library"))
    }, @ViewBuilder icon: @escaping Dock.Context.To<some View> = { _ in Image.imgly.addAsset }, isEnabled: @escaping Dock.Context.To<Bool> = { _ in true }, isVisible: @escaping Dock.Context.To<Bool> = { _ in true }, modifier: @escaping Dock.Context.To<some ViewModifier> = { _ in EmptyModifier() }) -> some Dock.Item
```

Creates a [`Dock.Button`](../button.md) that opens the asset library sheet. `action`

### Buttons.ID.audioLibrary

```swift
static var audioLibrary: EditorComponentID { get }
```

The id of the [`audioLibrary(action:title:icon:isEnabled:isVisible:)`](../audiolibrary(action:title:icon:isenabled:isvisible:).md) button.

### Buttons.audioLibrary(action:title:icon:isEnabled:isVisible:)

```swift
@MainActor static func audioLibrary(action: @escaping Dock.Context.To<Void> = { context in
      context.eventHandler.send(.openSheet(type: .libraryAdd { context.assetLibrary.audioTab }))
    }, @ViewBuilder title: @escaping Dock.Context.To<some View> = { _ in
      Text(.imgly.localized("ly_img_editor_dock_button_audio"))
    }, @ViewBuilder icon: @escaping Dock.Context.To<some View> = { _ in Image.imgly.addAudio }, isEnabled: @escaping Dock.Context.To<Bool> = { _ in true }, isVisible: @escaping Dock.Context.To<Bool> = { _ in true }) -> some Dock.Item
```

Creates a [`Dock.Button`](../button.md) that opens the audio library sheet. `action`

### Configuration.Builder.backgroundColor

```swift
var backgroundColor: Dock.BackgroundColor?
```

The dock background color.

### Buttons.ID.blur

```swift
static var blur: EditorComponentID { get }
```

The id of the [`blur(action:title:icon:isEnabled:isVisible:)`](../blur(action:title:icon:isenabled:isvisible:).md) button.

### Buttons.blur(action:title:icon:isEnabled:isVisible:)

```swift
@MainActor static func blur(action: @escaping Dock.Context.To<Void> = {
      try $0.eventHandler.send(.openSheet(type: .blur(id: nonNil($0.engine.scene.getCurrentPage()))))
    }, @ViewBuilder title: @escaping Dock.Context.To<some View> = { _ in
      Text(.imgly.localized("ly_img_editor_dock_button_blur"))
    }, @ViewBuilder icon: @escaping Dock.Context.To<some View> = { _ in Image.imgly.blur }, isEnabled: @escaping Dock.Context.To<Bool> = { _ in true }, isVisible: @escaping Dock.Context.To<Bool> = {
      try $0.engine.block.isAllowedByScope(nonNil($0.engine.scene.getCurrentPage()), key: "appearance/blur")
    }) -> some Dock.Item
```

Creates a [`Dock.Button`](../button.md) that opens the blur sheet. `action`

### Buttons.AssetLibraryModifier.body(content:)

```swift
@MainActor func body(content: Dock.Buttons.AssetLibraryModifier.Content) -> some View
```

### Buttons.ID.captions

```swift
static var captions: EditorComponentID { get }
```

The id of the [`captions(action:title:icon:isEnabled:isVisible:)`](../captions(action:title:icon:isenabled:isvisible:).md) button.

### Buttons.captions(action:title:icon:isEnabled:isVisible:)

```swift
@MainActor static func captions(action: @escaping Dock.Context.To<Void> = { $0.eventHandler.send(.openSheet(type: .captions())) }, @ViewBuilder title: @escaping Dock.Context.To<some View> = { _ in
      Text(.imgly.localized("ly_img_editor_dock_button_captions"))
    }, @ViewBuilder icon: @escaping Dock.Context.To<some View> = { _ in Image.imgly.captions }, isEnabled: @escaping Dock.Context.To<Bool> = { _ in true }, isVisible: @escaping Dock.Context.To<Bool> = { _ in true }) -> some Dock.Item
```

Creates a [`Dock.Button`](../button.md) that opens the captions sheet. `action`

### Buttons.ID.crop

```swift
static var crop: EditorComponentID { get }
```

The id of the [`crop(action:title:icon:isEnabled:isVisible:)`](../crop(action:title:icon:isenabled:isvisible:).md) button.

### Buttons.crop(action:title:icon:isEnabled:isVisible:)

```swift
@MainActor static func crop(action: @escaping Dock.Context.To<Void> = {
      try $0.eventHandler.send(.openSheet(type: .crop(
        id: nonNil($0.engine.scene.getCurrentPage()),
        assetSourceIDs: ["ly.img.crop.presets",
                         "ly.img.page.presets"],
      )))
    }, @ViewBuilder title: @escaping Dock.Context.To<some View> = { _ in
      Text(.imgly.localized("ly_img_editor_dock_button_crop"))
    }, @ViewBuilder icon: @escaping Dock.Context.To<some View> = { _ in Image.imgly.crop }, isEnabled: @escaping Dock.Context.To<Bool> = { _ in true }, isVisible: @escaping Dock.Context.To<Bool> = {
      try $0.engine.block.isAllowedByScope(nonNil($0.engine.scene.getCurrentPage()), key: "layer/crop")
    }) -> some Dock.Item
```

Creates a [`Dock.Button`](../button.md) that opens the crop sheet. `action`

### Dock.Alignment

```swift
typealias Alignment = Dock.Context.To<Alignment>
```

A type for the alignment of the dock items.

### Dock.BackgroundColor

```swift
typealias BackgroundColor = @MainActor @Sendable (Dock.Context, ColorScheme) throws -> Color
```

A type to change the background color of the dock.

### Dock.Builder

```swift
typealias Builder = ArrayBuilder<any Dock.Item>
```

A builder for building arrays of dock [`Dock.Item`](item.md)s.

### Dock.Button

```swift
typealias Button = EditorComponents.Button
```

A button dock [`Dock.Item`](item.md) component.

### Dock.Buttons

```swift
enum Buttons
```

A namespace for dock buttons.

### Buttons.Dock.Buttons.AssetLibraryModifier

```swift
@MainActor struct AssetLibraryModifier
```

A `ViewModifier` for the [`assetLibrary(action:title:icon:isEnabled:isVisible:modifier:)`](./assetlibrary(action:title:icon:isenabled:isvisible:modifier:).md).

### Buttons.Dock.Buttons.ID

```swift
enum ID
```

A namespace for dock button IDs.

### Dock.Configuration

```swift
struct Configuration
```

Configuration for dock.

### Configuration.Dock.Configuration.Builder

```swift
struct Builder
```

Builder for dock configuration.

### Dock.Context

```swift
struct Context
```

The context of dock components.

### Dock.Custom

```swift
typealias Custom = EditorComponents.Custom
```

A custom dock [`Dock.Item`](item.md) component.

### Dock.Item

```swift
protocol Item : EditorComponent where Self.Context == Dock.Context
```

A type for dock item components.

### Dock.Items

```swift
typealias Items = Dock.Context.To<[any Dock.Item]>
```

A closure to build an array of dock [`Dock.Item`](item.md)s.

### Dock.Modifications

```swift
typealias Modifications = @MainActor @Sendable (Dock.Context, Dock.Modifier) throws -> Void
```

A closure to modify an array of dock [`Dock.Item`](item.md)s.

### Dock.Modifier

```swift
typealias Modifier = ArrayModifier<any Dock.Item, None>
```

A modifier for modifying arrays of dock [`Dock.Item`](item.md)s.

### Dock.ScrollDisabled

```swift
typealias ScrollDisabled = Dock.Context.To<Bool>
```

A type for enabling/disabling the scroll of the dock.

### Buttons.ID.effect

```swift
static var effect: EditorComponentID { get }
```

The id of the [`effect(action:title:icon:isEnabled:isVisible:)`](../effect(action:title:icon:isenabled:isvisible:).md) button.

### Buttons.effect(action:title:icon:isEnabled:isVisible:)

```swift
@MainActor static func effect(action: @escaping Dock.Context.To<Void> = {
      try $0.eventHandler.send(.openSheet(type: .effect(id: nonNil($0.engine.scene.getCurrentPage()))))
    }, @ViewBuilder title: @escaping Dock.Context.To<some View> = { _ in
      Text(.imgly.localized("ly_img_editor_dock_button_effect"))
    }, @ViewBuilder icon: @escaping Dock.Context.To<some View> = { _ in Image.imgly.effect }, isEnabled: @escaping Dock.Context.To<Bool> = { _ in true }, isVisible: @escaping Dock.Context.To<Bool> = {
      try $0.engine.block.isAllowedByScope(nonNil($0.engine.scene.getCurrentPage()), key: "appearance/effect")
    }) -> some Dock.Item
```

Creates a [`Dock.Button`](../button.md) that opens the effect sheet. `action`

### Buttons.ID.elementsLibrary

```swift
static var elementsLibrary: EditorComponentID { get }
```

The id of the [`elementsLibrary(action:title:icon:isEnabled:isVisible:)`](../elementslibrary(action:title:icon:isenabled:isvisible:).md) button.

### Buttons.elementsLibrary(action:title:icon:isEnabled:isVisible:)

```swift
@MainActor static func elementsLibrary(action: @escaping Dock.Context.To<Void> = { context in
      context.eventHandler.send(.openSheet(type: .libraryAdd { context.assetLibrary.elementsTab }))
    }, @ViewBuilder title: @escaping Dock.Context.To<some View> = { _ in
      Text(.imgly.localized("ly_img_editor_dock_button_elements"))
    }, @ViewBuilder icon: @escaping Dock.Context.To<some View> = { _ in Image.imgly.addElement }, isEnabled: @escaping Dock.Context.To<Bool> = { _ in true }, isVisible: @escaping Dock.Context.To<Bool> = { _ in true }) -> some Dock.Item
```

Creates a [`Dock.Button`](../button.md) that opens the elements library sheet. `action`

### Context.engine

```swift
let engine: Engine
```

The engine of the current editor.

### Context.eventHandler

```swift
let eventHandler: any EditorEventHandler
```

The event handler of the current editor.

### Buttons.ID.filter

```swift
static var filter: EditorComponentID { get }
```

The id of the [`filter(action:title:icon:isEnabled:isVisible:)`](../filter(action:title:icon:isenabled:isvisible:).md) button.

### Buttons.filter(action:title:icon:isEnabled:isVisible:)

```swift
@MainActor static func filter(action: @escaping Dock.Context.To<Void> = {
      try $0.eventHandler.send(.openSheet(type: .filter(id: nonNil($0.engine.scene.getCurrentPage()))))
    }, @ViewBuilder title: @escaping Dock.Context.To<some View> = { _ in
      Text(.imgly.localized("ly_img_editor_dock_button_filter"))
    }, @ViewBuilder icon: @escaping Dock.Context.To<some View> = { _ in Image.imgly.filter }, isEnabled: @escaping Dock.Context.To<Bool> = { _ in true }, isVisible: @escaping Dock.Context.To<Bool> = {
      try $0.engine.block.isAllowedByScope(nonNil($0.engine.scene.getCurrentPage()), key: "appearance/filter")
    }) -> some Dock.Item
```

Creates a [`Dock.Button`](../button.md) that opens the filter sheet. `action`

### Buttons.ID.imagesLibrary

```swift
static var imagesLibrary: EditorComponentID { get }
```

The id of the [`imagesLibrary(action:title:icon:isEnabled:isVisible:)`](../imageslibrary(action:title:icon:isenabled:isvisible:).md) button.

### Buttons.imagesLibrary(action:title:icon:isEnabled:isVisible:)

```swift
@MainActor static func imagesLibrary(action: @escaping Dock.Context.To<Void> = { context in
      context.eventHandler.send(.openSheet(type: .libraryAdd { context.assetLibrary.imagesTab }))
    }, @ViewBuilder title: @escaping Dock.Context.To<some View> = { _ in
      Text(.imgly.localized("ly_img_editor_dock_button_images"))
    }, @ViewBuilder icon: @escaping Dock.Context.To<some View> = { _ in Image.imgly.addImage }, isEnabled: @escaping Dock.Context.To<Bool> = { _ in true }, isVisible: @escaping Dock.Context.To<Bool> = { _ in true }) -> some Dock.Item
```

Creates a [`Dock.Button`](../button.md) that opens the images library sheet. `action`

### Buttons.ID.imglyCamera

```swift
static var imglyCamera: EditorComponentID { get }
```

The id of the [`imglyCamera(action:title:icon:isEnabled:isVisible:)`](../imglycamera(action:title:icon:isenabled:isvisible:).md) button.

### Buttons.imglyCamera(action:title:icon:isEnabled:isVisible:)

```swift
@MainActor static func imglyCamera(action: @escaping Dock.Context.To<Void> = { $0.eventHandler.send(.addFromIMGLYCamera()) }, @ViewBuilder title: @escaping Dock.Context.To<some View> = { _ in
      Text(.imgly.localized("ly_img_editor_dock_button_camera"))
    }, @ViewBuilder icon: @escaping Dock.Context.To<some View> = { _ in Image.imgly.addCameraForeground }, isEnabled: @escaping Dock.Context.To<Bool> = { _ in true }, isVisible: @escaping Dock.Context.To<Bool> = { _ in true }) -> some Dock.Item
```

Creates a [`Dock.Button`](../button.md) that opens the IMGLY camera. `action`

### Buttons.ID.imglyPhotoRoll

> **Deprecated:** 
  Deprecated in v1.66.0. Please see the changelog for migration details:
  https://img.ly/docs/cesdk/changelog/v1-66-0/
  

```swift
static var imglyPhotoRoll: EditorComponentID { get }
```

The id of the [`imglyPhotoRoll(action:title:icon:isEnabled:isVisible:)`](../imglyphotoroll(action:title:icon:isenabled:isvisible:).md) button.

### Buttons.imglyPhotoRoll(action:title:icon:isEnabled:isVisible:)

> **Deprecated:** 
  Deprecated in v1.66.0. Please see the changelog for migration details:
  https://img.ly/docs/cesdk/changelog/v1-66-0/
  

```swift
@MainActor static func imglyPhotoRoll(action: @escaping Dock.Context.To<Void> = { $0.eventHandler.send(.addFromIMGLYPhotoRoll) }, @ViewBuilder title: @escaping Dock.Context.To<some View> = { _ in
      Text(.imgly.localized("ly_img_editor_dock_button_photo_roll"))
    }, @ViewBuilder icon: @escaping Dock.Context.To<some View> = { _ in Image.imgly.addPhotoRollForeground }, isEnabled: @escaping Dock.Context.To<Bool> = { _ in true }, isVisible: @escaping Dock.Context.To<Bool> = { _ in true }) -> some Dock.Item
```

Creates a [`Dock.Button`](../button.md) that opens the photo roll library sheet. `action`

### Configuration.init(_:)

```swift
init(_ configure: (inout Dock.Configuration.Builder) -> Void)
```

Creates dock configuration.

### Buttons.AssetLibraryModifier.init()

```swift
@MainActor init()
```

### Configuration.Builder.items(_:)

```swift
mutating func items(@Dock.Builder _ newItems: @escaping Dock.Items)
```

Sets the dock items using a result builder.

### Configuration.Builder.modify(_:)

```swift
mutating func modify(_ modification: @escaping Dock.Modifications)
```

Adds a modification. Modifications accumulate in order.

### Buttons.ID.overlaysLibrary

```swift
static var overlaysLibrary: EditorComponentID { get }
```

The id of the [`overlaysLibrary(action:title:icon:isEnabled:isVisible:)`](../overlayslibrary(action:title:icon:isenabled:isvisible:).md) button.

### Buttons.overlaysLibrary(action:title:icon:isEnabled:isVisible:)

```swift
@MainActor static func overlaysLibrary(action: @escaping Dock.Context.To<Void> = { context in
      context.eventHandler.send(.openSheet(type: .libraryAdd { context.assetLibrary.overlaysTab }))
    }, @ViewBuilder title: @escaping Dock.Context.To<some View> = { _ in
      Text(.imgly.localized("ly_img_editor_dock_button_overlays"))
    }, @ViewBuilder icon: @escaping Dock.Context.To<some View> = { _ in Image.imgly.addVideo }, isEnabled: @escaping Dock.Context.To<Bool> = { _ in true }, isVisible: @escaping Dock.Context.To<Bool> = { _ in true }) -> some Dock.Item
```

Creates a [`Dock.Button`](../button.md) that opens the overlays library sheet. `action`

### Buttons.ID.photoRoll

```swift
static var photoRoll: EditorComponentID { get }
```

The id of the [`photoRoll(action:title:icon:isEnabled:isVisible:)`](../photoroll(action:title:icon:isenabled:isvisible:).md) button.

### Buttons.photoRoll(action:title:icon:isEnabled:isVisible:)

```swift
@MainActor static func photoRoll(action: @escaping Dock.Context.To<Void> = { $0.eventHandler.send(.addFromPhotoRoll) }, @ViewBuilder title: @escaping Dock.Context.To<some View> = { _ in
      Text(.imgly.localized("ly_img_editor_dock_button_photo_roll"))
    }, @ViewBuilder icon: @escaping Dock.Context.To<some View> = { _ in Image.imgly.addPhotoRollForeground }, isEnabled: @escaping Dock.Context.To<Bool> = { _ in true }, isVisible: @escaping Dock.Context.To<Bool> = { _ in true }) -> some Dock.Item
```

Creates a [`Dock.Button`](../button.md) that opens the photo roll. `action`

### Buttons.ID.reorder

```swift
static var reorder: EditorComponentID { get }
```

The id of the [`reorder(action:title:icon:isEnabled:isVisible:)`](../reorder(action:title:icon:isenabled:isvisible:).md) button.

### Buttons.reorder(action:title:icon:isEnabled:isVisible:)

```swift
@MainActor static func reorder(action: @escaping Dock.Context.To<Void> = { $0.eventHandler.send(.openSheet(type: .reorder())) }, @ViewBuilder title: @escaping Dock.Context.To<some View> = { _ in
      Text(.imgly.localized("ly_img_editor_dock_button_reorder"))
    }, @ViewBuilder icon: @escaping Dock.Context.To<some View> = { _ in Image.imgly.reorder }, isEnabled: @escaping Dock.Context.To<Bool> = { _ in true }, isVisible: @escaping Dock.Context.To<Bool> = { context in
      let backgroundTrack = try context.engine.block.find(byType: .track).filter {
        try context.engine.block.isPageDurationSource($0)
      }.first
      guard let backgroundTrack else {
        return false
      }
      return try context.engine.block.getChildren(backgroundTrack).count > 1
    }) -> some Dock.Item
```

Creates a [`Dock.Button`](../button.md) that opens the reorder sheet. `action`

### Buttons.ID.resize

```swift
static var resize: EditorComponentID { get }
```

The id of the [`resize(action:title:icon:isEnabled:isVisible:)`](../resize(action:title:icon:isenabled:isvisible:).md) button.

### Buttons.resize(action:title:icon:isEnabled:isVisible:)

```swift
@MainActor static func resize(action: @escaping Dock.Context.To<Void> = { $0.eventHandler.send(.openSheet(type: .resize())) }, @ViewBuilder title: @escaping Dock.Context.To<some View> = { _ in
      Text(.imgly.localized("ly_img_editor_dock_button_resize"))
    }, @ViewBuilder icon: @escaping Dock.Context.To<some View> = { _ in Image.imgly.resize }, isEnabled: @escaping Dock.Context.To<Bool> = { _ in true }, isVisible: @escaping Dock.Context.To<Bool> = { _ in true }) -> some Dock.Item
```

Creates a [`Dock.Button`](../button.md) that opens the resize sheet. `action`

### Configuration.Builder.scrollDisabled

```swift
var scrollDisabled: Dock.ScrollDisabled?
```

Whether dock scrolling is disabled.

### Buttons.ID.shapesLibrary

```swift
static var shapesLibrary: EditorComponentID { get }
```

The id of the [`shapesLibrary(action:title:icon:isEnabled:isVisible:)`](../shapeslibrary(action:title:icon:isenabled:isvisible:).md) button.

### Buttons.shapesLibrary(action:title:icon:isEnabled:isVisible:)

```swift
@MainActor static func shapesLibrary(action: @escaping Dock.Context.To<Void> = { context in
      context.eventHandler.send(.openSheet(type: .libraryAdd { context.assetLibrary.shapesTab }))
    }, @ViewBuilder title: @escaping Dock.Context.To<some View> = { _ in
      Text(.imgly.localized("ly_img_editor_dock_button_shapes"))
    }, @ViewBuilder icon: @escaping Dock.Context.To<some View> = { _ in Image.imgly.addShape }, isEnabled: @escaping Dock.Context.To<Bool> = { _ in true }, isVisible: @escaping Dock.Context.To<Bool> = { _ in true }) -> some Dock.Item
```

Creates a [`Dock.Button`](../button.md) that opens the shapes library sheet. `action`

### Buttons.ID.stickersAndShapesLibrary

```swift
static var stickersAndShapesLibrary: EditorComponentID { get }
```

The id of the [`stickersAndShapesLibrary(action:title:icon:isEnabled:isVisible:)`](../stickersandshapeslibrary(action:title:icon:isenabled:isvisible:).md) button.

### Buttons.stickersAndShapesLibrary(action:title:icon:isEnabled:isVisible:)

```swift
@MainActor static func stickersAndShapesLibrary(action: @escaping Dock.Context.To<Void> = { context in
      context.eventHandler.send(.openSheet(type: .libraryAdd { context.assetLibrary.stickersAndShapesTab }))
    }, @ViewBuilder title: @escaping Dock.Context.To<some View> = { _
      in Text(.imgly.localized("ly_img_editor_dock_button_stickers"))
    }, @ViewBuilder icon: @escaping Dock.Context.To<some View> = { _ in Image.imgly.addSticker }, isEnabled: @escaping Dock.Context.To<Bool> = { _ in true }, isVisible: @escaping Dock.Context.To<Bool> = { _ in true }) -> some Dock.Item
```

Creates a [`Dock.Button`](../button.md) that opens the stickers and shapes library sheet. `action`

### Buttons.ID.stickersLibrary

```swift
static var stickersLibrary: EditorComponentID { get }
```

The id of the [`stickersLibrary(action:title:icon:isEnabled:isVisible:)`](../stickerslibrary(action:title:icon:isenabled:isvisible:).md) button.

### Buttons.stickersLibrary(action:title:icon:isEnabled:isVisible:)

```swift
@MainActor static func stickersLibrary(action: @escaping Dock.Context.To<Void> = { context in
      context.eventHandler.send(.openSheet(type: .libraryAdd { context.assetLibrary.stickersTab }))
    }, @ViewBuilder title: @escaping Dock.Context.To<some View> = { _ in
      Text(.imgly.localized("ly_img_editor_dock_button_stickers"))
    }, @ViewBuilder icon: @escaping Dock.Context.To<some View> = { _ in Image.imgly.addSticker }, isEnabled: @escaping Dock.Context.To<Bool> = { _ in true }, isVisible: @escaping Dock.Context.To<Bool> = { _ in true }) -> some Dock.Item
```

Creates a [`Dock.Button`](../button.md) that opens the stickers library sheet. `action`

### Buttons.ID.systemCamera

```swift
static var systemCamera: EditorComponentID { get }
```

The id of the [`systemCamera(action:title:icon:isEnabled:isVisible:)`](../systemcamera(action:title:icon:isenabled:isvisible:).md) button.

### Buttons.systemCamera(action:title:icon:isEnabled:isVisible:)

```swift
@MainActor static func systemCamera(action: @escaping Dock.Context.To<Void> = { $0.eventHandler.send(.addFromSystemCamera()) }, @ViewBuilder title: @escaping Dock.Context.To<some View> = { _ in
      Text(.imgly.localized("ly_img_editor_dock_button_camera"))
    }, @ViewBuilder icon: @escaping Dock.Context.To<some View> = { _ in Image.imgly.addCameraForeground }, isEnabled: @escaping Dock.Context.To<Bool> = { _ in true }, isVisible: @escaping Dock.Context.To<Bool> = { _ in true }) -> some Dock.Item
```

Creates a [`Dock.Button`](../button.md) that opens the system camera. `action`

### Buttons.ID.systemPhotoRoll

> **Deprecated:** 
  Deprecated in v1.66.0. Please see the changelog for migration details:
  https://img.ly/docs/cesdk/changelog/v1-66-0/
  

```swift
static var systemPhotoRoll: EditorComponentID { get }
```

The id of the [`systemPhotoRoll(action:title:icon:isEnabled:isVisible:)`](../systemphotoroll(action:title:icon:isenabled:isvisible:).md) button.

### Buttons.systemPhotoRoll(action:title:icon:isEnabled:isVisible:)

> **Deprecated:** 
  Deprecated in v1.66.0. Please see the changelog for migration details:
  https://img.ly/docs/cesdk/changelog/v1-66-0/
  

```swift
@MainActor static func systemPhotoRoll(action: @escaping Dock.Context.To<Void> = { $0.eventHandler.send(.addFromSystemPhotoRoll()) }, @ViewBuilder title: @escaping Dock.Context.To<some View> = { _ in
      Text(.imgly.localized("ly_img_editor_dock_button_photo_roll"))
    }, @ViewBuilder icon: @escaping Dock.Context.To<some View> = { _ in Image.imgly.addPhotoRollForeground }, isEnabled: @escaping Dock.Context.To<Bool> = { _ in true }, isVisible: @escaping Dock.Context.To<Bool> = { _ in true }) -> some Dock.Item
```

Creates a [`Dock.Button`](../button.md) that opens the system photo roll. `action`

### Buttons.ID.textLibrary

```swift
static var textLibrary: EditorComponentID { get }
```

The id of the [`textLibrary(action:title:icon:isEnabled:isVisible:)`](../textlibrary(action:title:icon:isenabled:isvisible:).md) button.

### Buttons.textLibrary(action:title:icon:isEnabled:isVisible:)

```swift
@MainActor static func textLibrary(action: @escaping Dock.Context.To<Void> = { context in
      context.eventHandler.send(.openSheet(type: .libraryAdd(style: .addAsset(detent: .imgly.medium)) {
        context.assetLibrary.textTab
      }))
    }, @ViewBuilder title: @escaping Dock.Context.To<some View> = { _ in
      Text(.imgly.localized("ly_img_editor_dock_button_text"))
    }, @ViewBuilder icon: @escaping Dock.Context.To<some View> = { _ in Image.imgly.addText }, isEnabled: @escaping Dock.Context.To<Bool> = { _ in true }, isVisible: @escaping Dock.Context.To<Bool> = { _ in true }) -> some Dock.Item
```

Creates a [`Dock.Button`](../button.md) that opens the text library sheet. `action`

### Buttons.ID.voiceover

```swift
static var voiceover: EditorComponentID { get }
```

The id of the [`voiceover(action:title:icon:isEnabled:isVisible:)`](../voiceover(action:title:icon:isenabled:isvisible:).md) button.

### Buttons.voiceover(action:title:icon:isEnabled:isVisible:)

```swift
@MainActor static func voiceover(action: @escaping Dock.Context.To<Void> = { $0.eventHandler.send(.openSheet(type: .voiceover())) }, @ViewBuilder title: @escaping Dock.Context.To<some View> = { _ in
      Text(.imgly.localized("ly_img_editor_dock_button_voiceover"))
    }, @ViewBuilder icon: @escaping Dock.Context.To<some View> = { _ in Image.imgly.addVoiceover }, isEnabled: @escaping Dock.Context.To<Bool> = { _ in true }, isVisible: @escaping Dock.Context.To<Bool> = { _ in true }) -> some Dock.Item
```

Creates a [`Dock.Button`](../button.md) that opens the voiceover sheet. `action`

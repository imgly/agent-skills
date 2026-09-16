# Timeline

- **Module:** `IMGLYEditor`
- **DocC identifier:** `/documentation/IMGLYEditor/Timeline`

The timeline component for video editing. Place it in the editor’s bottom panel. It is also the namespace for everything that customizes it: [`Timeline.Configuration`](timeline/configuration.md), [`Timeline.Buttons`](timeline/buttons.md), [`Timeline.Item`](timeline/item.md) and friends.

```swift
@MainActor struct Timeline
```

## Members

### Buttons.ID.addAudio

```swift
static var addAudio: EditorComponentID { get }
```

The id of the [`addAudio(options:title:icon:isEnabled:)`](../addaudio(options:title:icon:isenabled:).md) button.

### Configuration.Builder.addAudio

```swift
var addAudio: (any Timeline.Item)?
```

The “Add Audio” button. Use [`addAudio(options:title:icon:isEnabled:)`](../../buttons/addaudio(options:title:icon:isenabled:).md) to configure its options, a [`Timeline.Custom`](../../custom.md) to replace it entirely, or `nil` to remove it. A replacement is sized to one track row, as [`addClip`](addclip.md) is.

### Buttons.addAudio(options:title:icon:isEnabled:)

```swift
static func addAudio(@Timeline.AddAudioOptionsBuilder options: @escaping Timeline.AddAudioOptions = { _ in [.music(), .voiceover()] }, title: Timeline.ItemContext.To<any View>? = nil, icon: Timeline.ItemContext.To<any View>? = nil, isEnabled: @escaping Timeline.ItemContext.To<Bool> = { _ in true }) -> some Timeline.Item
```

The default “Add Audio” button. `options`

### Buttons.ID.addClip

```swift
static var addClip: EditorComponentID { get }
```

The id of the [`addClip(options:title:icon:isEnabled:)`](../addclip(options:title:icon:isenabled:).md) button.

### Configuration.Builder.addClip

```swift
var addClip: (any Timeline.Item)?
```

The “Add Clip” button. Use [`addClip(options:title:icon:isEnabled:)`](../../buttons/addclip(options:title:icon:isenabled:).md) to configure its options, a [`Timeline.Custom`](../../custom.md) to replace it entirely, or `nil` to remove it. A replacement sits in the background lane and is sized to one track row, like the track beside it. The timeline reserves its height by row count and never measures this button, so a taller one would overflow the lane.

### Buttons.addClip(options:title:icon:isEnabled:)

```swift
static func addClip(@Timeline.AddClipOptionsBuilder options: @escaping Timeline.AddClipOptions = { _ in [.camera(), .library()] }, title: Timeline.ItemContext.To<any View>? = nil, icon: Timeline.ItemContext.To<any View>? = nil, isEnabled: @escaping Timeline.ItemContext.To<Bool> = { _ in true }) -> some Timeline.Item
```

The default “Add Clip” button. `options`

### ItemContext.assetLibrary

```swift
let assetLibrary: any AssetLibrary
```

The configured [`AssetLibrary`](../../../imglycoreui/assetlibrary.md).

### AddAudioOption.body(_:)

```swift
@MainActor func body(_ context: Timeline.ItemContext) throws -> some View
```

The option’s menu row. The enclosing button wraps it in the `Button` that performs the action, and reuses it as its own label when only one option remains. `context`

### AddClipOption.body(_:)

```swift
@MainActor func body(_ context: Timeline.ItemContext) throws -> some View
```

The option’s menu row. The enclosing button wraps it in the `Button` that performs the action, and reuses it as its own label when only one option remains. `context`

### Spacer.body(_:)

```swift
@MainActor func body(_: Timeline.ItemContext) throws -> some View
```

The content and behavior of this component. `context`

### AddClipOption.ID-swift.enum.camera

```swift
static var camera: EditorComponentID { get }
```

The id of [`camera(action:title:icon:isEnabled:isVisible:)`](../camera(action:title:icon:isenabled:isvisible:).md).

### AddClipOption.camera(action:title:icon:isEnabled:isVisible:)

```swift
static func camera(action: @escaping Timeline.ItemContext.To<Void> = { $0.eventHandler.send(.addFromIMGLYCamera()) }, @ViewBuilder title: @escaping Timeline.ItemContext.To<some View> = { _ in
      Text(.imgly.localized("ly_img_editor_timeline_add_clip_option_camera"))
    }, @ViewBuilder icon: @escaping Timeline.ItemContext.To<some View> = { _ in
      Image.imgly.addCameraBackground
    }, isEnabled: @escaping Timeline.ItemContext.To<Bool> = { _ in true }, isVisible: @escaping Timeline.ItemContext.To<Bool> = { _ in true }) -> Timeline.AddClipOption
```

Records a clip with the camera and adds it to the background track. `action`

### AddAudioOption.custom(id:action:title:icon:isEnabled:isVisible:)

```swift
static func custom(id: EditorComponentID, action: @escaping Timeline.ItemContext.To<Void>, @ViewBuilder title: @escaping Timeline.ItemContext.To<some View>, @ViewBuilder icon: @escaping Timeline.ItemContext.To<some View>, isEnabled: @escaping Timeline.ItemContext.To<Bool> = { _ in true }, isVisible: @escaping Timeline.ItemContext.To<Bool> = { _ in true }) -> Timeline.AddAudioOption
```

A custom “Add Audio” source. `id`

### AddClipOption.custom(id:action:title:icon:isEnabled:isVisible:)

```swift
static func custom(id: EditorComponentID, action: @escaping Timeline.ItemContext.To<Void>, @ViewBuilder title: @escaping Timeline.ItemContext.To<some View>, @ViewBuilder icon: @escaping Timeline.ItemContext.To<some View>, isEnabled: @escaping Timeline.ItemContext.To<Bool> = { _ in true }, isVisible: @escaping Timeline.ItemContext.To<Bool> = { _ in true }) -> Timeline.AddClipOption
```

A custom “Add Clip” source. `id`

### ItemContext.engine

```swift
let engine: Engine
```

The engine of the current editor.

### ItemContext.eventHandler

```swift
let eventHandler: any EditorEventHandler
```

The event handler of the current editor.

### Configuration.Builder.header(_:)

```swift
mutating func header(@Timeline.HeaderBuilder _ newHeader: @escaping Timeline.Header)
```

Sets the header bar shown above the timeline using a result builder. Use [`Timeline.Buttons`](../../buttons.md) factories grouped by [`Timeline.ItemPlacement`](../../itemplacement.md), or provide your own [`Timeline.Custom`](../../custom.md) items. `newHeader`

### Configuration.Builder.height

```swift
var height: Timeline.Height
```

The timeline’s height, expressed in track rows. Resolved per render, so the height can depend on the [`Timeline.ItemContext`](../../itemcontext.md) — the editor state, or the vertical size class.

### AddAudioOption.id

```swift
let id: EditorComponentID
```

A stable identifier used for diffing and ordering.

### AddClipOption.id

```swift
let id: EditorComponentID
```

A stable identifier used for diffing and ordering.

### Spacer.id

```swift
let id: EditorComponentID
```

The unique identifier of this component suitable to be used with a `ForEach` view.

### Configuration.init(_:)

```swift
init(_ configure: (inout Timeline.Configuration.Builder) -> Void = { _ in })
```

Creates timeline configuration. `configure`

### init(context:)

```swift
@MainActor init(context: BottomPanel.Context)
```

Creates a timeline component with the standard configuration. `context`

### init(context:configuration:isExpanded:)

```swift
@MainActor init(context: BottomPanel.Context, configuration: Timeline.Configuration = .init(), isExpanded: Binding<Bool>? = nil)
```

Creates a timeline component. `context`

### Spacer.init(isVisible:)

```swift
init(isVisible: @escaping Timeline.ItemContext.To<Bool> = { _ in true })
```

Creates a spacer. `isVisible`

### ItemGroup.init(placement:items:)

```swift
init(placement: Timeline.ItemPlacement, @ArrayBuilder<any Timeline.Item> items: () -> [any Timeline.Item])
```

Creates a group of timeline header [`Timeline.Item`](../item.md)s with a specific placement. `placement`

### AddAudioOption.isEnabled(_:)

```swift
@MainActor func isEnabled(_ context: Timeline.ItemContext) throws -> Bool
```

Whether this option can be triggered. `context`

### AddClipOption.isEnabled(_:)

```swift
@MainActor func isEnabled(_ context: Timeline.ItemContext) throws -> Bool
```

Whether this option can be triggered. `context`

### AddAudioOption.isVisible(_:)

```swift
@MainActor func isVisible(_ context: Timeline.ItemContext) throws -> Bool
```

The visibility of this option. `context`

### AddClipOption.isVisible(_:)

```swift
@MainActor func isVisible(_ context: Timeline.ItemContext) throws -> Bool
```

The visibility of this option. `context`

### Spacer.isVisible(_:)

```swift
@MainActor func isVisible(_ context: Timeline.ItemContext) throws -> Bool
```

The visibility of this component. `context`

### AddClipOption.ID-swift.enum.library

```swift
static var library: EditorComponentID { get }
```

The id of [`library(action:title:icon:isEnabled:isVisible:)`](../library(action:title:icon:isenabled:isvisible:).md).

### AddClipOption.library(action:title:icon:isEnabled:isVisible:)

```swift
static func library(action: Timeline.ItemContext.To<Void>? = nil, @ViewBuilder title: @escaping Timeline.ItemContext.To<some View> = { _ in
      Text(.imgly.localized("ly_img_editor_timeline_add_clip_option_library"))
    }, @ViewBuilder icon: @escaping Timeline.ItemContext.To<some View> = { _ in
      Image.imgly.addClipLibrary
    }, isEnabled: @escaping Timeline.ItemContext.To<Bool> = { _ in true }, isVisible: @escaping Timeline.ItemContext.To<Bool> = { _ in true }) -> Timeline.AddClipOption
```

Opens the asset library and adds the selection to the background track. `action`

### Buttons.ID.loop

```swift
static var loop: EditorComponentID { get }
```

The id of the [`loop(action:icon:isEnabled:isVisible:)`](../loop(action:icon:isenabled:isvisible:).md) header item.

### Buttons.loop(action:icon:isEnabled:isVisible:)

```swift
static func loop(action: Timeline.ItemContext.To<Void>? = nil, icon: Timeline.ItemContext.To<any View>? = nil, isEnabled: @escaping Timeline.ItemContext.To<Bool> = { _ in true }, isVisible: @escaping Timeline.ItemContext.To<Bool> = { _ in true }) -> some Timeline.Item
```

The default looping toggle. `action`

### Configuration.Builder.modifyHeader(_:)

```swift
mutating func modifyHeader(_ modification: @escaping Timeline.Modifications)
```

Adds a modification to the header. Modifications accumulate in order and are applied on top of [`header(_:)`](./header(_:).md), so the built-in items can be adjusted without restating them. `modification`

### AddAudioOption.ID-swift.enum.music

```swift
static var music: EditorComponentID { get }
```

The id of [`music(action:title:icon:isEnabled:isVisible:)`](../music(action:title:icon:isenabled:isvisible:).md).

### AddAudioOption.music(action:title:icon:isEnabled:isVisible:)

```swift
static func music(action: Timeline.ItemContext.To<Void>? = nil, @ViewBuilder title: @escaping Timeline.ItemContext.To<some View> = { _ in
      Text(.imgly.localized("ly_img_editor_timeline_add_audio_option_music"))
    }, @ViewBuilder icon: @escaping Timeline.ItemContext.To<some View> = { _ in
      Image.imgly.addAudio
    }, isEnabled: @escaping Timeline.ItemContext.To<Bool> = { _ in true }, isVisible: @escaping Timeline.ItemContext.To<Bool> = { _ in true }) -> Timeline.AddAudioOption
```

Opens the audio asset library and adds the selection as an audio track. `action`

### AddClipOption.ID-swift.enum.photoRoll

```swift
static var photoRoll: EditorComponentID { get }
```

The id of [`photoRoll(action:title:icon:isEnabled:isVisible:)`](../photoroll(action:title:icon:isenabled:isvisible:).md).

### AddClipOption.photoRoll(action:title:icon:isEnabled:isVisible:)

```swift
static func photoRoll(action: @escaping Timeline.ItemContext.To<Void> = {
      $0.eventHandler.send(.addFromPhotoRoll(addToBackgroundTrack: true))
    }, @ViewBuilder title: @escaping Timeline.ItemContext.To<some View> = { _ in
      Text(.imgly.localized("ly_img_editor_dock_button_photo_roll"))
    }, @ViewBuilder icon: @escaping Timeline.ItemContext.To<some View> = { _ in
      Image.imgly.addPhotoRollBackground
    }, isEnabled: @escaping Timeline.ItemContext.To<Bool> = { _ in true }, isVisible: @escaping Timeline.ItemContext.To<Bool> = { _ in true }) -> Timeline.AddClipOption
```

Opens the privacy-friendly photo picker and adds the selection to the background track. `action`

### Buttons.ID.playPause

```swift
static var playPause: EditorComponentID { get }
```

The id of the [`playPause(action:icon:isEnabled:isVisible:)`](../playpause(action:icon:isenabled:isvisible:).md) header item.

### Buttons.playPause(action:icon:isEnabled:isVisible:)

```swift
static func playPause(action: Timeline.ItemContext.To<Void>? = nil, icon: Timeline.ItemContext.To<any View>? = nil, isEnabled: @escaping Timeline.ItemContext.To<Bool> = { _ in true }, isVisible: @escaping Timeline.ItemContext.To<Bool> = { _ in true }) -> some Timeline.Item
```

The default play/pause button. `action`

### ItemContext.state

```swift
let state: any EditorState
```

The state of the current editor, so an item can react to export or view mode.

### Labels.ID.timecode

```swift
static var timecode: EditorComponentID { get }
```

The id of the [`timecode(label:isEnabled:isVisible:)`](../timecode(label:isenabled:isvisible:).md) header item.

### Labels.timecode(label:isEnabled:isVisible:)

```swift
static func timecode(label: Timeline.ItemContext.To<any View>? = nil, isEnabled: @escaping Timeline.ItemContext.To<Bool> = { _ in true }, isVisible: @escaping Timeline.ItemContext.To<Bool> = { _ in true }) -> some Timeline.Item
```

The default timecode display, showing the playhead position and the total duration. `label`

### Timeline.AddAudioOption

```swift
struct AddAudioOption
```

An option shown in the timeline’s “Add Audio” button.

### AddAudioOption.Timeline.AddAudioOption.ID

```swift
enum ID
```

The stable identifiers of the built-in “Add Audio” options. Use them to find an option in an existing array, or to give a replacement the same identity.

### Timeline.AddAudioOptions

```swift
typealias AddAudioOptions = Timeline.ItemContext.To<[Timeline.AddAudioOption]>
```

A closure to build the options of the “Add Audio” button.

### Timeline.AddAudioOptionsBuilder

```swift
typealias AddAudioOptionsBuilder = ArrayBuilder<Timeline.AddAudioOption>
```

A builder for building arrays of “Add Audio” [`Timeline.AddAudioOption`](addaudiooption.md)s.

### Timeline.AddClipOption

```swift
struct AddClipOption
```

An option shown in the timeline’s “Add Clip” button.

### AddClipOption.Timeline.AddClipOption.ID

```swift
enum ID
```

The stable identifiers of the built-in “Add Clip” options. Use them to find an option in an existing array, or to give a replacement the same identity.

### Timeline.AddClipOptions

```swift
typealias AddClipOptions = Timeline.ItemContext.To<[Timeline.AddClipOption]>
```

A closure to build the options of the “Add Clip” button.

### Timeline.AddClipOptionsBuilder

```swift
typealias AddClipOptionsBuilder = ArrayBuilder<Timeline.AddClipOption>
```

A builder for building arrays of “Add Clip” [`Timeline.AddClipOption`](addclipoption.md)s.

### Timeline.Button

```swift
typealias Button = EditorComponents.Button
```

A button timeline [`Timeline.Item`](item.md) component. The header applies `.buttonStyle(.plain)`; the button sizes and fonts its own label.

### Timeline.Buttons

```swift
enum Buttons
```

A namespace for the built-in timeline button components.

### Buttons.Timeline.Buttons.ID

```swift
enum ID
```

The stable identifiers of the built-in timeline buttons.

### Timeline.Configuration

```swift
struct Configuration
```

Customizes the timeline’s add-content entry points, header, and height. Pass a configuration to [`init(context:configuration:isExpanded:)`](./init(context:configuration:isexpanded:).md).

### Configuration.Timeline.Configuration.Builder

```swift
struct Builder
```

Builder for timeline configuration.

### Timeline.Custom

```swift
typealias Custom = EditorComponents.Custom
```

A custom timeline [`Timeline.Item`](item.md) component.

### Timeline.Header

```swift
typealias Header = Timeline.ItemContext.To<[Timeline.ItemGroup]>
```

A closure to build an array of timeline header [`Timeline.ItemGroup`](itemgroup.md)s.

### Timeline.HeaderBuilder

```swift
typealias HeaderBuilder = ArrayBuilder<Timeline.ItemGroup>
```

A builder for building arrays of timeline header [`Timeline.ItemGroup`](itemgroup.md)s.

### Timeline.Height

```swift
typealias Height = Timeline.ItemContext.To<Timeline.HeightMode>
```

A closure to resolve the timeline’s [`Timeline.HeightMode`](heightmode.md).

### Timeline.HeightMode

```swift
enum HeightMode
```

How the timeline’s height is determined, expressed in track rows. Every case counts *overlay* tracks. The background track is always shown and is never counted, and the caption lane is a lane of its own rather than an overlay track.

### HeightMode.Timeline.HeightMode.dynamic(maximumTracks:)

```swift
case dynamic(maximumTracks: Int = 3)
```

The timeline auto-resizes to fit its tracks, growing to at most `maximumTracks` tracks tall. This is the default. A caption lane is added on top of `maximumTracks`, so a scene with captions is one row taller than one without. The lane appears with the first caption clip, not with the caption track, so an empty caption track adds nothing. Use [`Timeline.HeightMode.fixed(tracks:)`](./fixed(tracks:).md) when the height must not move.

### HeightMode.Timeline.HeightMode.fixed(tracks:)

```swift
case fixed(tracks: Int)
```

The timeline uses a fixed height sized to show exactly `tracks` tracks, without auto-resizing. `tracks` counts overlay tracks above the background track, so `0` still shows the background track. Negative values are clamped to `0`.

### Timeline.Item

```swift
protocol Item : EditorComponent where Self.Context == Timeline.ItemContext
```

A type for timeline item components.

### Timeline.ItemContext

```swift
struct ItemContext
```

The context a timeline [`Timeline.Item`](item.md) receives. Named apart from `Context` so [`Timeline`](../timeline.md) keeps that name free: an `EditorComponent`’s own `Context` is the one its slot hands it, which is not this.

### Timeline.ItemGroup

```swift
struct ItemGroup
```

A group of timeline header [`Timeline.Item`](item.md)s with a specific [`Timeline.ItemPlacement`](itemplacement.md).

### Timeline.ItemPlacement

```swift
enum ItemPlacement
```

A type that defines the placement of timeline header [`Timeline.Item`](item.md)s contained in an [`Timeline.ItemGroup`](itemgroup.md).

### ItemPlacement.Timeline.ItemPlacement.center

```swift
case center
```

Placed in the horizontal center of the header.

### ItemPlacement.Timeline.ItemPlacement.leading

```swift
case leading
```

Placed at the leading edge of the header.

### ItemPlacement.Timeline.ItemPlacement.trailing

```swift
case trailing
```

Placed at the trailing edge of the header.

### Timeline.Labels

```swift
enum Labels
```

A namespace for the built-in timeline label components. A label displays a value and has no action, so it is not a [`Timeline.Buttons`](buttons.md).

### Labels.Timeline.Labels.ID

```swift
enum ID
```

The stable identifiers of the built-in timeline labels.

### Timeline.Modifications

```swift
typealias Modifications = @MainActor @Sendable (Timeline.ItemContext, Timeline.Modifier) throws -> Void
```

A closure to modify an array of timeline header [`Timeline.Item`](item.md)s grouped by their [`Timeline.ItemPlacement`](itemplacement.md)s.

### Timeline.Modifier

```swift
typealias Modifier = ArrayModifier<any Timeline.Item, Timeline.ItemPlacement>
```

A modifier for modifying arrays of timeline header [`Timeline.Item`](item.md)s grouped by their [`Timeline.ItemPlacement`](itemplacement.md)s.

### Timeline.Spacer

```swift
struct Spacer
```

Flexible space between header items. Placement alone only groups items; a spacer is what pushes them apart.

### Buttons.ID.toggleExpanded

```swift
static var toggleExpanded: EditorComponentID { get }
```

The id of the [`toggleExpanded(action:label:isEnabled:isVisible:)`](../toggleexpanded(action:label:isenabled:isvisible:).md) header item.

### Buttons.toggleExpanded(action:label:isEnabled:isVisible:)

```swift
static func toggleExpanded(action: Timeline.ItemContext.To<Void>? = nil, label: Timeline.ItemContext.To<any View>? = nil, isEnabled: @escaping Timeline.ItemContext.To<Bool> = { _ in true }, isVisible: @escaping Timeline.ItemContext.To<Bool> = { $0.verticalSizeClass != .compact }) -> some Timeline.Item
```

The default expand/collapse toggle. `action`

### ItemContext.verticalSizeClass

```swift
let verticalSizeClass: UserInterfaceSizeClass?
```

The vertical size class of the timeline.

### AddAudioOption.ID-swift.enum.voiceover

```swift
static var voiceover: EditorComponentID { get }
```

The id of [`voiceover(action:title:icon:isEnabled:isVisible:)`](../voiceover(action:title:icon:isenabled:isvisible:).md).

### AddAudioOption.voiceover(action:title:icon:isEnabled:isVisible:)

```swift
static func voiceover(action: @escaping Timeline.ItemContext.To<Void> = { $0.eventHandler.send(.openSheet(type: .voiceover())) }, @ViewBuilder title: @escaping Timeline.ItemContext.To<some View> = { _ in
      Text(.imgly.localized("ly_img_editor_timeline_add_audio_option_voiceover"))
    }, @ViewBuilder icon: @escaping Timeline.ItemContext.To<some View> = { _ in
      Image.imgly.addVoiceover
    }, isEnabled: @escaping Timeline.ItemContext.To<Bool> = { _ in true }, isVisible: @escaping Timeline.ItemContext.To<Bool> = { _ in true }) -> Timeline.AddAudioOption
```

Starts a voiceover recording. `action`

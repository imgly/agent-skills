# InspectorBar

- **Module:** `IMGLYEditor`
- **DocC identifier:** `/documentation/IMGLYEditor/InspectorBar`

A namespace for the inspector bar component.

```swift
enum InspectorBar
```

## Members

### Buttons.ID.addVoiceoverRecording

```swift
static var addVoiceoverRecording: EditorComponentID { get }
```

The id of the [`addVoiceoverRecording(action:title:icon:isEnabled:isVisible:)`](../addvoiceoverrecording(action:title:icon:isenabled:isvisible:).md) button.

### Buttons.addVoiceoverRecording(action:title:icon:isEnabled:isVisible:)

```swift
@MainActor static func addVoiceoverRecording(action: @escaping InspectorBar.Context.To<Void> = { $0.eventHandler.send(.openSheet(type: .voiceover())) }, @ViewBuilder title: @escaping InspectorBar.Context.To<some View> = { _ in
      Text(.imgly.localized("ly_img_editor_sheet_voiceover_button_add_recording"))
    }, @ViewBuilder icon: @escaping InspectorBar.Context.To<some View> = { _ in Image.imgly.addVoiceover }, isEnabled: @escaping InspectorBar.Context.To<Bool> = { _ in true }, isVisible: @escaping InspectorBar.Context.To<Bool> = {
      $0.selection.type == .audio &&
        $0.selection.kind == "voiceover"
    }) -> some InspectorBar.Item
```

Creates a [`InspectorBar.Button`](../button.md) that starts a new voiceover recording from a selected voiceover clip. `action`

### Buttons.ID.adjustments

```swift
static var adjustments: EditorComponentID { get }
```

The id of the [`adjustments(action:title:icon:isEnabled:isVisible:)`](../adjustments(action:title:icon:isenabled:isvisible:).md) button.

### Buttons.adjustments(action:title:icon:isEnabled:isVisible:)

```swift
@MainActor static func adjustments(action: @escaping InspectorBar.Context.To<Void> = {
      $0.eventHandler.send(.openSheet(type: .adjustments(id: $0.selection.block)))
    }, @ViewBuilder title: @escaping InspectorBar.Context.To<some View> = { _ in
      Text(.imgly.localized("ly_img_editor_inspector_bar_button_adjustments"))
    }, @ViewBuilder icon: @escaping InspectorBar.Context.To<some View> = { _ in Image.imgly.adjustments }, isEnabled: @escaping InspectorBar.Context.To<Bool> = { _ in true }, isVisible: @escaping InspectorBar.Context.To<Bool> = {
      try [.video, .image].contains($0.selection.fillType) &&
        $0.selection.kind != "sticker" &&
        $0.selection.kind != "animatedSticker" &&
        $0.engine.block.isAllowedByScope($0.selection.block, key: "appearance/adjustments")
    }) -> some InspectorBar.Item
```

Creates a [`InspectorBar.Button`](../button.md) that opens the adjustments sheet. `action`

### Buttons.ID.animation

```swift
static var animation: EditorComponentID { get }
```

The id of the [`animation(action:title:icon:isEnabled:isVisible:)`](../animation(action:title:icon:isenabled:isvisible:).md) button.

### Buttons.animation(action:title:icon:isEnabled:isVisible:)

```swift
@MainActor static func animation(action: @escaping InspectorBar.Context.To<Void> = {
      $0.eventHandler.send(.openSheet(type: .animation()))
    }, @ViewBuilder title: @escaping InspectorBar.Context.To<some View> = { _ in
      Text(.imgly.localized("ly_img_editor_inspector_bar_button_animations"))
    }, @ViewBuilder icon: @escaping InspectorBar.Context.To<some View> = { _ in Image.imgly.animation }, isEnabled: @escaping InspectorBar.Context.To<Bool> = { _ in true }, isVisible: @escaping InspectorBar.Context.To<Bool> = { context in
      try context.selection.type != .page &&
        context.selection.type != .audio &&
        context.engine.block.supportsAnimation(context.selection.block)
    }) -> some InspectorBar.Item
```

Creates a [`InspectorBar.Button`](../button.md) that opens the animation sheet. `action`

### Context.assetLibrary

```swift
let assetLibrary: any AssetLibrary
```

The configured [`AssetLibrary`](../../../imglycoreui/assetlibrary.md).

### Context.Selection-swift.struct.block

```swift
@MainActor let block: DesignBlockID
```

The id of the current selected design block.

### Buttons.ID.blur

```swift
static var blur: EditorComponentID { get }
```

The id of the [`blur(action:title:icon:isEnabled:isVisible:)`](../blur(action:title:icon:isenabled:isvisible:).md) button.

### Buttons.blur(action:title:icon:isEnabled:isVisible:)

```swift
@MainActor static func blur(action: @escaping InspectorBar.Context.To<Void> = {
      $0.eventHandler.send(.openSheet(type: .blur(id: $0.selection.block)))
    }, @ViewBuilder title: @escaping InspectorBar.Context.To<some View> = { _ in
      Text(.imgly.localized("ly_img_editor_inspector_bar_button_blur"))
    }, @ViewBuilder icon: @escaping InspectorBar.Context.To<some View> = { _ in Image.imgly.blur }, isEnabled: @escaping InspectorBar.Context.To<Bool> = { _ in true }, isVisible: @escaping InspectorBar.Context.To<Bool> = {
      try [.video, .image].contains($0.selection.fillType) &&
        $0.selection.kind != "sticker" &&
        $0.selection.kind != "animatedSticker" &&
        $0.engine.block.isAllowedByScope($0.selection.block, key: "appearance/blur")
    }) -> some InspectorBar.Item
```

Creates a [`InspectorBar.Button`](../button.md) that opens the blur sheet. `action`

### Buttons.ID.clipSpeed

```swift
static var clipSpeed: EditorComponentID { get }
```

The id of the [`clipSpeed(action:title:icon:isEnabled:isVisible:)`](../clipspeed(action:title:icon:isenabled:isvisible:).md) button.

### Buttons.clipSpeed(action:title:icon:isEnabled:isVisible:)

```swift
@MainActor static func clipSpeed(action: @escaping InspectorBar.Context.To<Void> = { $0.eventHandler.send(.openSheet(type: .clipSpeed())) }, @ViewBuilder title: @escaping InspectorBar.Context.To<some View> = { _ in
      Text(.imgly.localized("ly_img_editor_inspector_bar_button_clip_speed"))
    }, @ViewBuilder icon: @escaping InspectorBar.Context.To<some View> = { _ in Image.imgly.clipSpeed }, isEnabled: @escaping InspectorBar.Context.To<Bool> = { _ in true }, isVisible: @escaping InspectorBar.Context.To<Bool> = { context in
      let playbackBlock: DesignBlockID
      if try context.engine.block.supportsPlaybackControl(context.selection.block) {
        playbackBlock = context.selection.block
      } else if try context.engine.block.supportsFill(context.selection.block) {
        let fill = try context.engine.block.getFill(context.selection.block)
        guard try context.engine.block.supportsPlaybackControl(fill) else { return false }
        playbackBlock = fill
      } else {
        return false
      }
      let playbackFillType = try? FillType(rawValue: context.engine.block.getType(playbackBlock))
      let selectionFillType = context.selection.fillType
      let isAudio = context.selection.type == .audio
      return try (isAudio || selectionFillType == .video || playbackFillType == .video) &&
        context.engine.block.isAllowedByScope(context.selection.block, key: "fill/change")
    }) -> some InspectorBar.Item
```

Creates a [`InspectorBar.Button`](../button.md) that opens the clip speed sheet. `action`

### Buttons.ID.crop

```swift
static var crop: EditorComponentID { get }
```

The id of the [`crop(action:title:icon:isEnabled:isVisible:)`](../crop(action:title:icon:isenabled:isvisible:).md) button.

### Buttons.crop(action:title:icon:isEnabled:isVisible:)

```swift
@MainActor static func crop(action: @escaping InspectorBar.Context.To<Void> = {
      $0.eventHandler.send(.openSheet(type: .crop(
        id: $0.selection.block,
        assetSourceIDs: ["ly.img.crop.presets"],
      )))
    }, @ViewBuilder title: @escaping InspectorBar.Context.To<some View> = { _ in
      Text(.imgly.localized("ly_img_editor_inspector_bar_button_crop"))
    }, @ViewBuilder icon: @escaping InspectorBar.Context.To<some View> = { _ in Image.imgly.crop }, isEnabled: @escaping InspectorBar.Context.To<Bool> = { _ in true }, isVisible: @escaping InspectorBar.Context.To<Bool> = {
      try [.video, .image].contains($0.selection.fillType) &&
        $0.selection.kind != "sticker" &&
        $0.selection.kind != "animatedSticker" &&
        $0.engine.block.supportsCrop($0.selection.block) &&
        $0.engine.block.isAllowedByScope($0.selection.block, key: "layer/crop")
    }) -> some InspectorBar.Item
```

Creates a [`InspectorBar.Button`](../button.md) that opens the crop sheet. `action`

### Buttons.ID.delete

```swift
static var delete: EditorComponentID { get }
```

The id of the [`delete(action:title:icon:isEnabled:isVisible:)`](../delete(action:title:icon:isenabled:isvisible:).md) button.

### Buttons.delete(action:title:icon:isEnabled:isVisible:)

```swift
@MainActor static func delete(action: @escaping InspectorBar.Context.To<Void> = { $0.eventHandler.send(.deleteSelection) }, @ViewBuilder title: @escaping InspectorBar.Context.To<some View> = { _ in
      Text(.imgly.localized("ly_img_editor_inspector_bar_button_delete")).foregroundColor(.red)
    }, @ViewBuilder icon: @escaping InspectorBar.Context.To<some View> = { _ in Image.imgly.delete.foregroundColor(.red) }, isEnabled: @escaping InspectorBar.Context.To<Bool> = { _ in true }, isVisible: @escaping InspectorBar.Context.To<Bool> = {
      try $0.selection.type != .page &&
        $0.engine.block.isAllowedByScope($0.selection.block, key: "lifecycle/destroy")
    }) -> some InspectorBar.Item
```

Creates a [`InspectorBar.Button`](../button.md) that deletes the selected design block. `action`

### Buttons.ID.duplicate

```swift
static var duplicate: EditorComponentID { get }
```

The id of the [`duplicate(action:title:icon:isEnabled:isVisible:)`](../duplicate(action:title:icon:isenabled:isvisible:).md) button.

### Buttons.duplicate(action:title:icon:isEnabled:isVisible:)

```swift
@MainActor static func duplicate(action: @escaping InspectorBar.Context.To<Void> = { $0.eventHandler.send(.duplicateSelection) }, @ViewBuilder title: @escaping InspectorBar.Context.To<some View> = { _ in
      Text(.imgly.localized("ly_img_editor_inspector_bar_button_duplicate"))
    }, @ViewBuilder icon: @escaping InspectorBar.Context.To<some View> = { _ in Image.imgly.duplicate }, isEnabled: @escaping InspectorBar.Context.To<Bool> = { _ in true }, isVisible: @escaping InspectorBar.Context.To<Bool> = { context in
      try context.selection.type != .page &&
        context.engine.block.isAllowedByScope(context.selection.block, key: "lifecycle/duplicate")
    }) -> some InspectorBar.Item
```

Creates a [`InspectorBar.Button`](../button.md) that duplicates the selected design block. `action`

### Buttons.ID.editText

```swift
static var editText: EditorComponentID { get }
```

The id of the [`editText(action:title:icon:isEnabled:isVisible:)`](../edittext(action:title:icon:isenabled:isvisible:).md) button.

### Buttons.editText(action:title:icon:isEnabled:isVisible:)

```swift
@MainActor static func editText(action: @escaping InspectorBar.Context.To<Void> = { $0.eventHandler.send(.enterTextEditModeForSelection) }, @ViewBuilder title: @escaping InspectorBar.Context.To<some View> = { _ in
      Text(.imgly.localized("ly_img_editor_inspector_bar_button_edit_text"))
    }, @ViewBuilder icon: @escaping InspectorBar.Context.To<some View> = { _ in Image.imgly.editText }, isEnabled: @escaping InspectorBar.Context.To<Bool> = { _ in true }, isVisible: @escaping InspectorBar.Context.To<Bool> = {
      try $0.selection.type == .text &&
        $0.engine.block.isAllowedByScope($0.selection.block, key: "text/edit")
    }) -> some InspectorBar.Item
```

Creates a [`InspectorBar.Button`](../button.md) that enters the text edit mode for the selected design block. `action`

### Buttons.ID.effect

```swift
static var effect: EditorComponentID { get }
```

The id of the [`effect(action:title:icon:isEnabled:isVisible:)`](../effect(action:title:icon:isenabled:isvisible:).md) button.

### Buttons.effect(action:title:icon:isEnabled:isVisible:)

```swift
@MainActor static func effect(action: @escaping InspectorBar.Context.To<Void> = {
      $0.eventHandler.send(.openSheet(type: .effect(id: $0.selection.block)))
    }, @ViewBuilder title: @escaping InspectorBar.Context.To<some View> = { _ in
      Text(.imgly.localized("ly_img_editor_inspector_bar_button_effect"))
    }, @ViewBuilder icon: @escaping InspectorBar.Context.To<some View> = { _ in Image.imgly.effect }, isEnabled: @escaping InspectorBar.Context.To<Bool> = { _ in true }, isVisible: @escaping InspectorBar.Context.To<Bool> = {
      try [.video, .image].contains($0.selection.fillType) &&
        $0.selection.kind != "sticker" &&
        $0.selection.kind != "animatedSticker" &&
        $0.engine.block.isAllowedByScope($0.selection.block, key: "appearance/effect")
    }) -> some InspectorBar.Item
```

Creates a [`InspectorBar.Button`](../button.md) that opens the effect sheet. `action`

### Configuration.Builder.enabled

```swift
var enabled: InspectorBar.Enabled?
```

Whether the inspector bar is enabled.

### Context.engine

```swift
let engine: Engine
```

The engine of the current editor.

### Buttons.ID.enterGroup

```swift
static var enterGroup: EditorComponentID { get }
```

The id of the [`enterGroup(action:title:icon:isEnabled:isVisible:)`](../entergroup(action:title:icon:isenabled:isvisible:).md) button.

### Buttons.enterGroup(action:title:icon:isEnabled:isVisible:)

```swift
@MainActor static func enterGroup(action: @escaping InspectorBar.Context.To<Void> = { $0.eventHandler.send(.enterGroupForSelection) }, @ViewBuilder title: @escaping InspectorBar.Context.To<some View> = { _ in
      Text(.imgly.localized("ly_img_editor_inspector_bar_button_enter_group"))
    }, @ViewBuilder icon: @escaping InspectorBar.Context.To<some View> = { _ in Image.imgly.enterGroup }, isEnabled: @escaping InspectorBar.Context.To<Bool> = { _ in true }, isVisible: @escaping InspectorBar.Context.To<Bool> = {
      $0.selection.type == .group
    }) -> some InspectorBar.Item
```

Creates a [`InspectorBar.Button`](../button.md) that changes selection from the selected group design block to a design block within that group. `action`

### Context.eventHandler

```swift
let eventHandler: any EditorEventHandler
```

The event handler of the current editor.

### Buttons.ID.fillStroke

```swift
static var fillStroke: EditorComponentID { get }
```

The id of the [`fillStroke(action:title:icon:isEnabled:isVisible:)`](../fillstroke(action:title:icon:isenabled:isvisible:).md) button.

### Buttons.fillStroke(action:title:icon:isEnabled:isVisible:)

```swift
@MainActor static func fillStroke(action: @escaping InspectorBar.Context.To<Void> = { $0.eventHandler.send(.openSheet(type: .fillStroke())) }, @ViewBuilder title: @escaping InspectorBar.Context.To<some View> = {
      let showStroke = try $0.engine.block.supportsStroke($0.selection.block) &&
        $0.engine.block.isAllowedByScope($0.selection.block, key: "stroke/change")
       
       
      let hideFillForLine = try $0.engine.block.isLineOrigin($0.selection.block) && showStroke
      let showFill = try [.none, .color, .linearGradient].contains($0.selection.fillType) &&
        $0.engine.block.supportsFill($0.selection.block) &&
        !hideFillForLine &&
        $0.engine.block.isAllowedByScope($0.selection.block, key: "fill/change")
      if showFill, showStroke {
        return Text(.imgly.localized("ly_img_editor_inspector_bar_button_fill_and_stroke"))
      } else if showFill {
        return Text(.imgly.localized("ly_img_editor_inspector_bar_button_fill"))
      } else {
        return Text(.imgly.localized("ly_img_editor_inspector_bar_button_stroke"))
      }
    }, @ViewBuilder icon: @escaping InspectorBar.Context.To<some View> = { FillStrokeIcon(id: $0.selection.block) }, isEnabled: @escaping InspectorBar.Context.To<Bool> = { _ in true }, isVisible: @escaping InspectorBar.Context.To<Bool> = {
      let showStroke = try $0.engine.block.supportsStroke($0.selection.block) &&
        $0.engine.block.isAllowedByScope($0.selection.block, key: "stroke/change")
       
       
      let hideFillForLine = try $0.engine.block.isLineOrigin($0.selection.block) && showStroke
      let showFill = try [.none, .color, .linearGradient].contains($0.selection.fillType) &&
        $0.engine.block.supportsFill($0.selection.block) &&
        !hideFillForLine &&
        $0.engine.block.isAllowedByScope($0.selection.block, key: "fill/change")
      return $0.selection.kind != "sticker" && $0.selection.kind != "animatedSticker" &&
        (showFill || showStroke)
    }) -> some InspectorBar.Item
```

Creates a [`InspectorBar.Button`](../button.md) that opens the fill and stroke sheet. `action`

### Context.Selection-swift.struct.fillType

```swift
@MainActor let fillType: FillType?
```

The fill type of the current selected design [`block`](block.md).

### Buttons.ID.filter

```swift
static var filter: EditorComponentID { get }
```

The id of the [`filter(action:title:icon:isEnabled:isVisible:)`](../filter(action:title:icon:isenabled:isvisible:).md) button.

### Buttons.filter(action:title:icon:isEnabled:isVisible:)

```swift
@MainActor static func filter(action: @escaping InspectorBar.Context.To<Void> = {
      $0.eventHandler.send(.openSheet(type: .filter(id: $0.selection.block)))
    }, @ViewBuilder title: @escaping InspectorBar.Context.To<some View> = { _ in
      Text(.imgly.localized("ly_img_editor_inspector_bar_button_filter"))
    }, @ViewBuilder icon: @escaping InspectorBar.Context.To<some View> = { _ in Image.imgly.filter }, isEnabled: @escaping InspectorBar.Context.To<Bool> = { _ in true }, isVisible: @escaping InspectorBar.Context.To<Bool> = {
      try [.video, .image].contains($0.selection.fillType) &&
        $0.selection.kind != "sticker" &&
        $0.selection.kind != "animatedSticker" &&
        $0.engine.block.isAllowedByScope($0.selection.block, key: "appearance/filter")
    }) -> some InspectorBar.Item
```

Creates a [`InspectorBar.Button`](../button.md) that opens the filter sheet. `action`

### Buttons.ID.formatText

```swift
static var formatText: EditorComponentID { get }
```

The id of the [`formatText(action:title:icon:isEnabled:isVisible:)`](../formattext(action:title:icon:isenabled:isvisible:).md) button.

### Buttons.formatText(action:title:icon:isEnabled:isVisible:)

```swift
@MainActor static func formatText(action: @escaping InspectorBar.Context.To<Void> = { $0.eventHandler.send(.openSheet(type: .formatText())) }, @ViewBuilder title: @escaping InspectorBar.Context.To<some View> = { _ in
      Text(.imgly.localized("ly_img_editor_inspector_bar_button_format_text"))
    }, @ViewBuilder icon: @escaping InspectorBar.Context.To<some View> = { _ in Image.imgly.formatText }, isEnabled: @escaping InspectorBar.Context.To<Bool> = { _ in true }, isVisible: @escaping InspectorBar.Context.To<Bool> = {
      try $0.selection.type == .text &&
        $0.engine.block.isAllowedByScope($0.selection.block, key: "text/character")
    }) -> some InspectorBar.Item
```

Creates a [`InspectorBar.Button`](../button.md) that opens the format text sheet. `action`

### Configuration.init(_:)

```swift
init(_ configure: (inout InspectorBar.Configuration.Builder) -> Void)
```

Creates inspector bar configuration.

### InspectorBar.Builder

```swift
typealias Builder = ArrayBuilder<any InspectorBar.Item>
```

A builder for building arrays of inspector bar [`InspectorBar.Item`](item.md)s.

### InspectorBar.Button

```swift
typealias Button = EditorComponents.Button
```

A button inspector bar [`InspectorBar.Item`](item.md) component.

### InspectorBar.Buttons

```swift
enum Buttons
```

A namespace for inspector bar buttons.

### Buttons.InspectorBar.Buttons.ID

```swift
enum ID
```

A namespace for inspector bar button IDs.

### InspectorBar.Configuration

```swift
struct Configuration
```

Configuration for inspector bar.

### Configuration.InspectorBar.Configuration.Builder

```swift
struct Builder
```

Builder for inspector bar configuration.

### InspectorBar.Context

```swift
struct Context
```

The context of inspector bar components.

### Context.InspectorBar.Context.Selection

```swift
@MainActor struct Selection
```

Cached properties of the current selection.

### InspectorBar.Enabled

```swift
typealias Enabled = InspectorBar.Context.To<Bool>
```

A type to set whether the inspector bar is enabled.

### InspectorBar.Item

```swift
protocol Item : EditorComponent where Self.Context == InspectorBar.Context
```

A type for inspector bar item components.

### InspectorBar.Items

```swift
typealias Items = InspectorBar.Context.To<[any InspectorBar.Item]>
```

A closure to build an array of inspector bar [`InspectorBar.Item`](item.md)s.

### InspectorBar.Modifications

```swift
typealias Modifications = @MainActor @Sendable (InspectorBar.Context, InspectorBar.Modifier) throws -> Void
```

A closure to modify an array of inspector bar [`InspectorBar.Item`](item.md)s.

### InspectorBar.Modifier

```swift
typealias Modifier = ArrayModifier<any InspectorBar.Item, None>
```

A modifier for modifying arrays of inspector bar [`InspectorBar.Item`](item.md)s.

### Configuration.Builder.items(_:)

```swift
mutating func items(@InspectorBar.Builder _ newItems: @escaping InspectorBar.Items)
```

Sets the inspector bar items using a result builder.

### Context.Selection-swift.struct.kind

```swift
@MainActor let kind: String?
```

The kind of the current selected design [`block`](block.md).

### Buttons.ID.layer

```swift
static var layer: EditorComponentID { get }
```

The id of the [`layer(action:title:icon:isEnabled:isVisible:)`](../layer(action:title:icon:isenabled:isvisible:).md) button.

### Buttons.layer(action:title:icon:isEnabled:isVisible:)

```swift
@MainActor static func layer(action: @escaping InspectorBar.Context.To<Void> = { $0.eventHandler.send(.openSheet(type: .layer())) }, @ViewBuilder title: @escaping InspectorBar.Context.To<some View> = { _ in
      Text(.imgly.localized("ly_img_editor_inspector_bar_button_layer"))
    }, @ViewBuilder icon: @escaping InspectorBar.Context.To<some View> = { _ in Image.imgly.layer }, isEnabled: @escaping InspectorBar.Context.To<Bool> = { _ in true }, isVisible: @escaping InspectorBar.Context.To<Bool> = { context in
      @MainActor func isBackgroundTrack(_ id: DesignBlockID?) throws -> Bool {
        if let id {
          try context.engine.block.getType(id) == DesignBlockType.track.rawValue &&
            context.engine.block.isPageDurationSource(id)
        } else {
          false
        }
      }
      @MainActor func isMoveAllowed() throws -> Bool {
        try context.engine.block.isAllowedByScope(context.selection.block, key: "layer/move") &&
          !isBackgroundTrack(context.selection.parentBlock)
      }
      return try ![.page, .audio].contains(context.selection.type) &&
        context.selection.kind != "voiceover" && (
          context.engine.block.isAllowedByScope(context.selection.block, key: "layer/blendMode") ||
            context.engine.block.isAllowedByScope(context.selection.block, key: "layer/opacity") ||
            isMoveAllowed() ||
            context.engine.block.isAllowedByScope(context.selection.block, key: "lifecycle/destroy") ||
            context.engine.block.isAllowedByScope(context.selection.block, key: "lifecycle/duplicate")
        )
    }) -> some InspectorBar.Item
```

Creates a [`InspectorBar.Button`](../button.md) that opens the layer sheet. `action`

### Configuration.Builder.modify(_:)

```swift
mutating func modify(_ modification: @escaping InspectorBar.Modifications)
```

Adds a modification. Modifications accumulate in order.

### Buttons.ID.moveAsClip

```swift
static var moveAsClip: EditorComponentID { get }
```

The id of the [`moveAsClip(action:title:icon:isEnabled:isVisible:)`](../moveasclip(action:title:icon:isenabled:isvisible:).md) button.

### Buttons.moveAsClip(action:title:icon:isEnabled:isVisible:)

```swift
@MainActor static func moveAsClip(action: @escaping InspectorBar.Context.To<Void> = { $0.eventHandler.send(.moveSelectionAsClip) }, @ViewBuilder title: @escaping InspectorBar.Context.To<some View> = { _ in
      Text(.imgly.localized("ly_img_editor_inspector_bar_button_move_as_clip"))
    }, @ViewBuilder icon: @escaping InspectorBar.Context.To<some View> = { _ in Image.imgly.moveAsClip }, isEnabled: @escaping InspectorBar.Context.To<Bool> = { _ in true }, isVisible: @escaping InspectorBar.Context.To<Bool> = { context in
      @MainActor func isBackgroundTrack(_ id: DesignBlockID?) throws -> Bool {
        if let id {
          try context.engine.block.getType(id) == DesignBlockType.track.rawValue &&
            context.engine.block.isPageDurationSource(id)
        } else {
          false
        }
      }
      return try context.selection.type != .audio &&
        !isBackgroundTrack(context.selection.parentBlock)
    }) -> some InspectorBar.Item
```

Creates a [`InspectorBar.Button`](../button.md) that moves the selected design block into the background track as clip. `action`

### Buttons.ID.moveAsOverlay

```swift
static var moveAsOverlay: EditorComponentID { get }
```

The id of the [`moveAsOverlay(action:title:icon:isEnabled:isVisible:)`](../moveasoverlay(action:title:icon:isenabled:isvisible:).md) button.

### Buttons.moveAsOverlay(action:title:icon:isEnabled:isVisible:)

```swift
@MainActor static func moveAsOverlay(action: @escaping InspectorBar.Context.To<Void> = { $0.eventHandler.send(.moveSelectionAsOverlay) }, @ViewBuilder title: @escaping InspectorBar.Context.To<some View> = { _ in
      Text(.imgly.localized("ly_img_editor_inspector_bar_button_move_as_overlay"))
    }, @ViewBuilder icon: @escaping InspectorBar.Context.To<some View> = { _ in Image.imgly.moveAsOverlay }, isEnabled: @escaping InspectorBar.Context.To<Bool> = { _ in true }, isVisible: @escaping InspectorBar.Context.To<Bool> = { context in
      @MainActor func isBackgroundTrack(_ id: DesignBlockID?) throws -> Bool {
        if let id {
          try context.engine.block.getType(id) == DesignBlockType.track.rawValue &&
            context.engine.block.isPageDurationSource(id)
        } else {
          false
        }
      }
      return try context.selection.type != .audio &&
        isBackgroundTrack(context.selection.parentBlock)
    }) -> some InspectorBar.Item
```

Creates a [`InspectorBar.Button`](../button.md) that moves the selected design block from the background track to an overlay. `action`

### Context.Selection-swift.struct.parentBlock

```swift
@MainActor var parentBlock: DesignBlockID? { get }
```

The id of the parent design block of the current selected design [`block`](block.md).

### Buttons.ID.reorder

```swift
static var reorder: EditorComponentID { get }
```

The id of the [`reorder(action:title:icon:isEnabled:isVisible:)`](../reorder(action:title:icon:isenabled:isvisible:).md) button.

### Buttons.reorder(action:title:icon:isEnabled:isVisible:)

```swift
@MainActor static func reorder(action: @escaping InspectorBar.Context.To<Void> = { $0.eventHandler.send(.openSheet(type: .reorder())) }, @ViewBuilder title: @escaping InspectorBar.Context.To<some View> = { _ in
      Text(.imgly.localized("ly_img_editor_inspector_bar_button_reorder"))
    }, @ViewBuilder icon: @escaping InspectorBar.Context.To<some View> = { _ in Image.imgly.reorder }, isEnabled: @escaping InspectorBar.Context.To<Bool> = { _ in true }, isVisible: @escaping InspectorBar.Context.To<Bool> = { context in
      @MainActor func isBackgroundTrack(_ id: DesignBlockID?) throws -> Bool {
        if let id {
          try context.engine.block.getType(id) == DesignBlockType.track.rawValue &&
            context.engine.block.isPageDurationSource(id)
        } else {
          false
        }
      }
      return if let backgroundTrack = context.selection.parentBlock,
                context.engine.block.isValid(backgroundTrack),
                try context.engine.block.getChildren(backgroundTrack).count > 1,
                try isBackgroundTrack(backgroundTrack) {
        true
      } else {
        false
      }
    }) -> some InspectorBar.Item
```

Creates a [`InspectorBar.Button`](../button.md) that opens the reorder sheet. `action`

### Buttons.ID.replace

```swift
static var replace: EditorComponentID { get }
```

The id of the [`replace(action:title:icon:isEnabled:isVisible:)`](../replace(action:title:icon:isenabled:isvisible:).md) button

### Buttons.replace(action:title:icon:isEnabled:isVisible:)

```swift
@MainActor static func replace(action: @escaping InspectorBar.Context.To<Void> = { context in
      let libraryTab = try {
        switch context.selection.type {
        case .audio: context.assetLibrary.audioTab
        case .graphic:
          switch context.selection.fillType {
          case .video:
            context.assetLibrary.videosTab
          case .image:
            if context.selection.kind == "sticker" {
              context.assetLibrary.stickersTab
            } else {
              context.assetLibrary.imagesTab
            }
          default:
            throw EditorError(
              "Unsupported fillType \(context.selection.fillType?.rawValue ?? "") for replace inspector bar button.",
            )
          }
        case .page:
          switch context.selection.fillType {
          case .video:
            context.assetLibrary.videosTab
          case .image:
            context.assetLibrary.imagesTab
          default:
            throw EditorError(
              "Unsupported fillType \(context.selection.fillType?.rawValue ?? "") for replace inspector bar button.",
            )
          }
        default:
          throw EditorError(
            "Unsupported type \(context.selection.type?.rawValue ?? "") for replace inspector bar button.",
          )
        }
      }()
      context.eventHandler.send(.openSheet(type: .libraryReplace { libraryTab }))
    }, @ViewBuilder title: @escaping InspectorBar.Context.To<some View> = { _ in
      Text(.imgly.localized("ly_img_editor_inspector_bar_button_replace"))
    }, @ViewBuilder icon: @escaping InspectorBar.Context.To<some View> = { _ in Image.imgly.replace }, isEnabled: @escaping InspectorBar.Context.To<Bool> = { _ in true }, isVisible: @escaping InspectorBar.Context.To<Bool> = {
      try (
        ($0.selection.type == .audio && $0.selection.kind != "voiceover") ||
          (
            ($0.selection.type == .graphic || $0.selection.type == .page) &&
              [.image, .video].contains($0.selection.fillType)
          ),
      ) && $0.engine.block.isAllowedByScope($0.selection.block, key: "fill/change") &&
        $0.selection.kind != "sticker" && $0.selection.kind != "animatedSticker"
    }) -> some InspectorBar.Item
```

Creates a [`InspectorBar.Button`](../button.md) that opens the replace sheet. `action`

### Buttons.ID.selectGroup

```swift
static var selectGroup: EditorComponentID { get }
```

The id of the [`selectGroup(action:title:icon:isEnabled:isVisible:)`](../selectgroup(action:title:icon:isenabled:isvisible:).md) button.

### Buttons.selectGroup(action:title:icon:isEnabled:isVisible:)

```swift
@MainActor static func selectGroup(action: @escaping InspectorBar.Context.To<Void> = { $0.eventHandler.send(.selectGroupForSelection) }, @ViewBuilder title: @escaping InspectorBar.Context.To<some View> = { _ in
      Text(.imgly.localized("ly_img_editor_inspector_bar_button_select_group"))
    }, @ViewBuilder icon: @escaping InspectorBar.Context.To<some View> = { _ in Image.imgly.selectGroup }, isEnabled: @escaping InspectorBar.Context.To<Bool> = { _ in true }, isVisible: @escaping InspectorBar.Context.To<Bool> = { context in
      @MainActor func isGrouped(_ id: DesignBlockID?) throws -> Bool {
        if let id {
          try context.engine.block.getType(id) == DesignBlockType.group.rawValue
        } else {
          false
        }
      }
      return try isGrouped(context.selection.parentBlock)
    }) -> some InspectorBar.Item
```

Creates a [`InspectorBar.Button`](../button.md) that selects the group design block containing the selected design block. `action`

### Context.selection

```swift
let selection: InspectorBar.Context.Selection
```

The current selection.

### Buttons.ID.shape

```swift
static var shape: EditorComponentID { get }
```

The id of the [`shape(action:title:icon:isEnabled:isVisible:)`](../shape(action:title:icon:isenabled:isvisible:).md) button.

### Buttons.shape(action:title:icon:isEnabled:isVisible:)

```swift
@MainActor static func shape(action: @escaping InspectorBar.Context.To<Void> = { $0.eventHandler.send(.openSheet(type: .shape())) }, @ViewBuilder title: @escaping InspectorBar.Context.To<some View> = { _ in
      Text(.imgly.localized("ly_img_editor_inspector_bar_button_shape"))
    }, @ViewBuilder icon: @escaping InspectorBar.Context.To<some View> = { _ in Image.imgly.shape }, isEnabled: @escaping InspectorBar.Context.To<Bool> = { _ in true }, isVisible: @escaping InspectorBar.Context.To<Bool> = {
      try ($0.selection.fillType != .image || $0.selection.kind != "sticker") &&
        $0.selection.kind != "animatedSticker" &&
        $0.engine.block.isAllowedByScope($0.selection.block, key: "shape/change") &&
        $0.engine.block.supportsShape($0.selection.block) &&
        [.star, .polygon, .rect].contains(
          ShapeType(rawValue: $0.engine.block.getType($0.engine.block.getShape($0.selection.block))),
        )
    }) -> some InspectorBar.Item
```

Creates a [`InspectorBar.Button`](../button.md) that opens the shape sheet. `action`

### Buttons.ID.split

```swift
static var split: EditorComponentID { get }
```

The id of the [`split(action:title:icon:isEnabled:isVisible:)`](../split(action:title:icon:isenabled:isvisible:).md) button.

### Buttons.split(action:title:icon:isEnabled:isVisible:)

```swift
@MainActor static func split(action: @escaping InspectorBar.Context.To<Void> = { $0.eventHandler.send(.splitSelection) }, @ViewBuilder title: @escaping InspectorBar.Context.To<some View> = { _ in
      Text(.imgly.localized("ly_img_editor_inspector_bar_button_split"))
    }, @ViewBuilder icon: @escaping InspectorBar.Context.To<some View> = { _ in Image.imgly.split }, isEnabled: @escaping InspectorBar.Context.To<Bool> = { _ in true }, isVisible: @escaping InspectorBar.Context.To<Bool> = {
      try $0.engine.block.isAllowedByScope($0.selection.block, key: "lifecycle/duplicate")
    }) -> some InspectorBar.Item
```

Creates a [`InspectorBar.Button`](../button.md) that splits the selected design block. `action`

### Buttons.ID.textBackground

```swift
static var textBackground: EditorComponentID { get }
```

The id of the [`textBackground(action:title:icon:isEnabled:isVisible:)`](../textbackground(action:title:icon:isenabled:isvisible:).md) button.

### Buttons.textBackground(action:title:icon:isEnabled:isVisible:)

```swift
@MainActor static func textBackground(action: @escaping InspectorBar.Context.To<Void> = { $0.eventHandler.send(.openSheet(type: .textBackground())) }, @ViewBuilder title: @escaping InspectorBar.Context.To<some View> = { _ in
      Text(.imgly.localized("ly_img_editor_inspector_bar_button_text_background"))
    }, @ViewBuilder icon: @escaping InspectorBar.Context.To<some View> = { BackgroundColorIcon(id: $0.selection.block) }, isEnabled: @escaping InspectorBar.Context.To<Bool> = { _ in true }, isVisible: @escaping InspectorBar.Context.To<Bool> = { context in
      try context.selection.type == .text &&
        context.engine.block.isAllowedByScope(context.selection.block, key: "text/character")
    }) -> some InspectorBar.Item
```

Creates an [`InspectorBar.Button`](../button.md) that opens the text background sheet. `action`

### Buttons.ID.textOnPath

```swift
static var textOnPath: EditorComponentID { get }
```

The id of the [`textOnPath(action:title:icon:isEnabled:isVisible:)`](../textonpath(action:title:icon:isenabled:isvisible:).md) button.

### Buttons.textOnPath(action:title:icon:isEnabled:isVisible:)

```swift
@MainActor static func textOnPath(action: @escaping InspectorBar.Context.To<Void> = { $0.eventHandler.send(.openSheet(type: .textOnPath())) }, @ViewBuilder title: @escaping InspectorBar.Context.To<some View> = { _ in
      Text(.imgly.localized("ly_img_editor_inspector_bar_button_text_on_path"))
    }, @ViewBuilder icon: @escaping InspectorBar.Context.To<some View> = { _ in Image.imgly.textOnPath }, isEnabled: @escaping InspectorBar.Context.To<Bool> = { _ in true }, isVisible: @escaping InspectorBar.Context.To<Bool> = {
      try $0.selection.type == .text &&
        $0.engine.block.isAllowedByScope($0.selection.block, key: "text/character")
    }) -> some InspectorBar.Item
```

Creates a [`InspectorBar.Button`](../button.md) that opens the Text on Path sheet. `action`

### Buttons.ID.textPresets

```swift
static var textPresets: EditorComponentID { get }
```

The id of the [`textPresets(action:title:icon:isEnabled:isVisible:)`](../textpresets(action:title:icon:isenabled:isvisible:).md) button.

### Buttons.textPresets(action:title:icon:isEnabled:isVisible:)

```swift
@MainActor static func textPresets(action: @escaping InspectorBar.Context.To<Void> = { context in
      context.eventHandler.send(.openSheet(type: .libraryReplace(
        .imgly.localized("ly_img_editor_inspector_bar_button_text_styles"),
        style: .only(detent: .imgly.medium),
      ) {
         
        AssetLibraryGroup(.imgly.localized("ly_img_editor_asset_library_section_plain_text")) {
          AssetLibrarySource.textPreset(
            .titleForGroup { TextPresetsGrid.sectionTitle(for: $0) },
            source: .init(id: "ly.img.text"),
          )
        }
        AssetLibrarySource.textPreset(
          .title(.imgly.localized("ly_img_editor_asset_library_section_text_styles")),
          source: .init(id: "ly.img.text.styles"),
        )
        AssetLibrarySource.textPreset(
          .title(.imgly.localized("ly_img_editor_asset_library_section_curve_text")),
          source: .init(id: "ly.img.text.curves"),
        )
      }))
    }, @ViewBuilder title: @escaping InspectorBar.Context.To<some View> = { _ in
      Text(.imgly.localized("ly_img_editor_inspector_bar_button_text_styles"))
    }, @ViewBuilder icon: @escaping InspectorBar.Context.To<some View> = { _ in Image.imgly.textStyles }, isEnabled: @escaping InspectorBar.Context.To<Bool> = { _ in true }, isVisible: @escaping InspectorBar.Context.To<Bool> = {
      try $0.selection.type == .text &&
        $0.engine.block.isAllowedByScope($0.selection.block, key: "text/character") &&
        $0.engine.asset.findAllSources().contains("ly.img.text.styles")
    }) -> some InspectorBar.Item
```

Creates an [`InspectorBar.Button`](../button.md) that opens the text style presets sheet. `action`

### Context.Selection-swift.struct.type

```swift
@MainActor let type: DesignBlockType?
```

The type of the current selected design [`block`](block.md).

### Buttons.ID.volume

```swift
static var volume: EditorComponentID { get }
```

The id of the [`volume(action:title:icon:isEnabled:isVisible:)`](../volume(action:title:icon:isenabled:isvisible:).md) button.

### Buttons.volume(action:title:icon:isEnabled:isVisible:)

```swift
@MainActor static func volume(action: @escaping InspectorBar.Context.To<Void> = { $0.eventHandler.send(.openSheet(type: .volume())) }, @ViewBuilder title: @escaping InspectorBar.Context.To<some View> = { _ in
      Text(.imgly.localized("ly_img_editor_inspector_bar_button_volume"))
    }, @ViewBuilder icon: @escaping InspectorBar.Context.To<some View> = { _ in Image.imgly.volume }, isEnabled: @escaping InspectorBar.Context.To<Bool> = { context in
      guard context.selection.fillType == .video else { return true }
      let playbackBlock: DesignBlockID
      if try context.engine.block.supportsPlaybackControl(context.selection.block) {
        playbackBlock = context.selection.block
      } else if try context.engine.block.supportsFill(context.selection.block) {
        let fill = try context.engine.block.getFill(context.selection.block)
        guard try context.engine.block.supportsPlaybackControl(fill) else { return true }
        playbackBlock = fill
      } else {
        return true
      }
      return try context.engine.block.getPlaybackSpeed(playbackBlock) <= 3
    }, isVisible: @escaping InspectorBar.Context.To<Bool> = {
      try ($0.selection.type == .audio || $0.selection.fillType == .video) &&
        $0.engine.block.isAllowedByScope($0.selection.block, key: "fill/change")
    }) -> some InspectorBar.Item
```

Creates a [`InspectorBar.Button`](../button.md) that opens the volume sheet. `action`

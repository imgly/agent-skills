# CanvasMenu

- **Module:** `IMGLYEditor`
- **DocC identifier:** `/documentation/IMGLYEditor/CanvasMenu`

A namespace for the canvas menu component.

```swift
enum CanvasMenu
```

## Members

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

### Divider.body(_:)

```swift
@MainActor func body(_: CanvasMenu.Context) throws -> some View
```

The content and behavior of this component. `context`

### Buttons.ID.bringForward

```swift
static var bringForward: EditorComponentID { get }
```

The id of the [`bringForward(action:label:isEnabled:isVisible:)`](../bringforward(action:label:isenabled:isvisible:).md) button.

### Buttons.bringForward(action:label:isEnabled:isVisible:)

```swift
@MainActor static func bringForward(action: @escaping CanvasMenu.Context.To<Void> = { $0.eventHandler.send(.bringSelectionForward) }, @ViewBuilder label: @escaping CanvasMenu.Context.To<some View> = { _ in
      Label {
        Text(.imgly.localized("ly_img_editor_canvas_menu_button_bring_forward"))
      } icon: {
        Image.imgly.bringForward
      }
    }, isEnabled: @escaping CanvasMenu.Context.To<Bool> = { $0.selection.canBringForward }, isVisible: @escaping CanvasMenu.Context.To<Bool> = { $0.selection.canMove }) -> some CanvasMenu.Item
```

Creates a [`CanvasMenu.Button`](../button.md) that brings forward the selected design block. `action`

### Context.Selection-swift.struct.canBringForward

```swift
@MainActor let canBringForward: Bool
```

`true` when `BlockAPI.bringForward(_:)` would change the block’s layout. Drives per-direction *enabled* state of “bring forward” / layer-up controls.

### Context.Selection-swift.struct.canMove

```swift
@MainActor let canMove: Bool
```

Aggregate visibility gate: `true` when the editor allows reordering this selection at all (combines `canBringForward || canSendBackward` with the editor scope, the background-track pin, and the audio and caption exclusions). Drives *visibility* of the reorder controls; for the per-direction enabled state use [`canBringForward`](canbringforward.md) / [`canSendBackward`](cansendbackward.md).

### Context.Selection-swift.struct.canSendBackward

```swift
@MainActor let canSendBackward: Bool
```

`true` when `BlockAPI.bringBackward(_:)` would change the block’s layout. Drives per-direction *enabled* state of “send backward” / layer-down controls.

### CanvasMenu.Builder

```swift
typealias Builder = ArrayBuilder<any CanvasMenu.Item>
```

A builder for building arrays of canvas menu [`CanvasMenu.Item`](item.md)s.

### CanvasMenu.Button

```swift
typealias Button = EditorComponents.Button
```

A button canvas menu [`CanvasMenu.Item`](item.md) component.

### CanvasMenu.Buttons

```swift
enum Buttons
```

A namespace for canvas menu buttons.

### Buttons.CanvasMenu.Buttons.ID

```swift
enum ID
```

A namespace for canvas menu button IDs.

### CanvasMenu.Configuration

```swift
struct Configuration
```

Configuration for canvas menu.

### Configuration.CanvasMenu.Configuration.Builder

```swift
struct Builder
```

Builder for canvas menu configuration.

### CanvasMenu.Context

```swift
struct Context
```

The context of canvas menu components.

### Context.CanvasMenu.Context.Selection

```swift
@MainActor struct Selection
```

Cached properties of the current selection.

### CanvasMenu.Divider

```swift
struct Divider
```

A visual element that can be used to separate other content.

### CanvasMenu.Item

```swift
protocol Item : EditorComponent where Self.Context == CanvasMenu.Context
```

A type for canvas menu item components.

### CanvasMenu.Items

```swift
typealias Items = CanvasMenu.Context.To<[any CanvasMenu.Item]>
```

A closure to build an array of canvas menu [`CanvasMenu.Item`](item.md)s.

### CanvasMenu.Modifications

```swift
typealias Modifications = @MainActor @Sendable (CanvasMenu.Context, CanvasMenu.Modifier) throws -> Void
```

A closure to modify an array of canvas menu [`CanvasMenu.Item`](item.md)s.

### CanvasMenu.Modifier

```swift
typealias Modifier = ArrayModifier<any CanvasMenu.Item, None>
```

A modifier for modifying arrays of canvas menu [`CanvasMenu.Item`](item.md)s.

### Buttons.ID.delete

```swift
static var delete: EditorComponentID { get }
```

The id of the [`delete(action:label:isEnabled:isVisible:)`](../delete(action:label:isenabled:isvisible:).md) button.

### Buttons.delete(action:label:isEnabled:isVisible:)

```swift
@MainActor static func delete(action: @escaping CanvasMenu.Context.To<Void> = { $0.eventHandler.send(.deleteSelection) }, @ViewBuilder label: @escaping CanvasMenu.Context.To<some View> = { _ in
      Label {
        Text(.imgly.localized("ly_img_editor_canvas_menu_button_delete"))
      } icon: {
        Image.imgly.delete
      }
    }, isEnabled: @escaping CanvasMenu.Context.To<Bool> = { _ in true }, isVisible: @escaping CanvasMenu.Context.To<Bool> = {
      try $0.engine.block.isAllowedByScope($0.selection.block, key: "lifecycle/destroy")
    }) -> some CanvasMenu.Item
```

Creates a [`CanvasMenu.Button`](../button.md) that deletes the selected design block. `action`

### Buttons.ID.duplicate

```swift
static var duplicate: EditorComponentID { get }
```

The id of the [`duplicate(action:label:isEnabled:isVisible:)`](../duplicate(action:label:isenabled:isvisible:).md) button.

### Buttons.duplicate(action:label:isEnabled:isVisible:)

```swift
@MainActor static func duplicate(action: @escaping CanvasMenu.Context.To<Void> = { $0.eventHandler.send(.duplicateSelection) }, @ViewBuilder label: @escaping CanvasMenu.Context.To<some View> = { _ in
      Label {
        Text(.imgly.localized("ly_img_editor_canvas_menu_button_duplicate"))
      } icon: {
        Image.imgly.duplicate
      }
    }, isEnabled: @escaping CanvasMenu.Context.To<Bool> = { _ in true }, isVisible: @escaping CanvasMenu.Context.To<Bool> = {
       
      try $0.selection.type != .caption &&
        $0.engine.block.isAllowedByScope($0.selection.block, key: "lifecycle/duplicate")
    }) -> some CanvasMenu.Item
```

Creates a [`CanvasMenu.Button`](../button.md) that duplicates the selected design block. `action`

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

### Context.Selection-swift.struct.fillType

```swift
@MainActor let fillType: FillType?
```

The fill type of the current selected design [`block`](block.md).

### Divider.id

```swift
let id: EditorComponentID
```

The unique identifier of this component suitable to be used with a `ForEach` view.

### Configuration.init(_:)

```swift
init(_ configure: (inout CanvasMenu.Configuration.Builder) -> Void)
```

Creates canvas menu configuration.

### Divider.init()

```swift
init()
```

Creates a divider.

### Configuration.Builder.items(_:)

```swift
mutating func items(@CanvasMenu.Builder _ newItems: @escaping CanvasMenu.Items)
```

Sets the canvas menu items using a result builder.

### Context.Selection-swift.struct.kind

```swift
@MainActor let kind: String?
```

The kind of the current selected design [`block`](block.md).

### Configuration.Builder.modify(_:)

```swift
mutating func modify(_ modification: @escaping CanvasMenu.Modifications)
```

Adds a modification. Modifications accumulate in order.

### Context.Selection-swift.struct.parentBlock

```swift
@MainActor var parentBlock: DesignBlockID? { get }
```

The id of the parent design block of the current selected design [`block`](block.md).

### Buttons.ID.selectGroup

```swift
static var selectGroup: EditorComponentID { get }
```

The id of the [`selectGroup(action:label:isEnabled:isVisible:)`](../selectgroup(action:label:isenabled:isvisible:).md) button.

### Buttons.selectGroup(action:label:isEnabled:isVisible:)

```swift
@MainActor static func selectGroup(action: @escaping CanvasMenu.Context.To<Void> = { $0.eventHandler.send(.selectGroupForSelection) }, @ViewBuilder label: @escaping CanvasMenu.Context.To<some View> = { _ in
      Label {
        Text(.imgly.localized("ly_img_editor_canvas_menu_button_select_group"))
      } icon: {
        Image.imgly.selectGroup
      }
      .labelStyle(.imgly.canvasMenu(.titleOnly))
    }, isEnabled: @escaping CanvasMenu.Context.To<Bool> = { _ in true }, isVisible: @escaping CanvasMenu.Context.To<Bool> = { context in
      @MainActor func isGrouped(_ id: DesignBlockID?) throws -> Bool {
        if let id {
          try context.engine.block.getType(id) == DesignBlockType.group.rawValue
        } else {
          false
        }
      }
      return try isGrouped(context.selection.parentBlock)
    }) -> some CanvasMenu.Item
```

Creates a [`CanvasMenu.Button`](../button.md) that selects the group design block containing the selected design block. `action`

### Context.selection

```swift
let selection: CanvasMenu.Context.Selection
```

The current selection.

### Buttons.ID.sendBackward

```swift
static var sendBackward: EditorComponentID { get }
```

The id of the [`sendBackward(action:label:isEnabled:isVisible:)`](../sendbackward(action:label:isenabled:isvisible:).md) button.

### Buttons.sendBackward(action:label:isEnabled:isVisible:)

```swift
@MainActor static func sendBackward(action: @escaping CanvasMenu.Context.To<Void> = { $0.eventHandler.send(.sendSelectionBackward) }, @ViewBuilder label: @escaping CanvasMenu.Context.To<some View> = { _ in
      Label {
        Text(.imgly.localized("ly_img_editor_canvas_menu_button_send_backward"))
      } icon: {
        Image.imgly.sendBackward
      }
    }, isEnabled: @escaping CanvasMenu.Context.To<Bool> = { $0.selection.canSendBackward }, isVisible: @escaping CanvasMenu.Context.To<Bool> = { $0.selection.canMove }) -> some CanvasMenu.Item
```

Creates a [`CanvasMenu.Button`](../button.md) that sends backward the selected design block. `action`

### Context.Selection-swift.struct.siblings

```swift
@MainActor let siblings: [DesignBlockID]
```

The reorderable peers of the current selected design [`block`](block.md) *in its current parent*, sorted in rendering order (last is rendered in front). Use this for enumeration or display — to gate UI on whether a reorder action would actually change layout, prefer the engine-aware [`canBringForward`](canbringforward.md) / [`canSendBackward`](cansendbackward.md) properties below, which also account for the track pop-out semantics that this list intentionally does not reflect.

### Context.Selection-swift.struct.type

```swift
@MainActor let type: DesignBlockType?
```

The type of the current selected design [`block`](block.md).

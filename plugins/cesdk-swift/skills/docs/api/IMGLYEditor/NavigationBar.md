# NavigationBar

- **Module:** `IMGLYEditor`
- **DocC identifier:** `/documentation/IMGLYEditor/NavigationBar`

A namespace for the navigation bar component.

```swift
enum NavigationBar
```

## Members

### Context.assetLibrary

```swift
let assetLibrary: any AssetLibrary
```

The configured [`AssetLibrary`](../../../imglycoreui/assetlibrary.md).

### Buttons.ID.closeEditor

```swift
static var closeEditor: EditorComponentID { get }
```

The id of the [`closeEditor(action:label:isEnabled:isVisible:)`](../closeeditor(action:label:isenabled:isvisible:).md) button.

### Buttons.closeEditor(action:label:isEnabled:isVisible:)

```swift
@MainActor static func closeEditor(action: @escaping NavigationBar.Context.To<Void> = { $0.eventHandler.send(.onClose) }, @ViewBuilder label: @escaping NavigationBar.Context.To<some View> = { _ in
      NavigationLabel(.imgly.localized("ly_img_editor_navigation_bar_button_close_editor"), direction: .backward)
    }, isEnabled: @escaping NavigationBar.Context.To<Bool> = { _ in true }, isVisible: @escaping NavigationBar.Context.To<Bool> = {
      if !$0.state.isCreating, let engine = $0.engine {
        try $0.state.viewMode == .edit && (
          engine.editor.getSettingBool("features/pageCarouselEnabled") ||
            engine.scene.getPages().first == engine.scene.getCurrentPage()
        )
      } else {
        true
      }
    }) -> some NavigationBar.Item
```

Creates a [`NavigationBar.Button`](../button.md) that closes the editor. `action`

### Context.engine

```swift
let engine: Engine?
```

The engine of the current editor. It is `nil` as long as the engine is being created before the [`onCreate(_:)`](../../editorconfiguration/builder/oncreate(_:).md) callback is run.

### Context.eventHandler

```swift
let eventHandler: any EditorEventHandler
```

The event handler of the current editor.

### Buttons.ID.export

```swift
static var export: EditorComponentID { get }
```

The id of the [`export(action:label:isEnabled:isVisible:)`](../export(action:label:isenabled:isvisible:).md) button.

### Buttons.export(action:label:isEnabled:isVisible:)

```swift
@MainActor static func export(action: @escaping NavigationBar.Context.To<Void> = { $0.eventHandler.send(.startExport) }, @ViewBuilder label: @escaping NavigationBar.Context.To<some View> = { _ in
      Label { Text(.imgly.localized("ly_img_editor_navigation_bar_button_export")) } icon: { Image.imgly.export }
        .labelStyle(.imgly.adaptiveIconOnly)
    }, isEnabled: @escaping NavigationBar.Context.To<Bool> = {
      !$0.state.isCreating && !$0.state.isExporting
    }, isVisible: @escaping NavigationBar.Context.To<Bool> = {
      if !$0.state.isCreating, let engine = $0.engine {
        try $0.state.viewMode != .edit || (
          engine.editor.getSettingBool("features/pageCarouselEnabled") ||
            engine.scene.getPages().last == engine.scene.getCurrentPage()
        )
      } else {
        true
      }
    }) -> some NavigationBar.Item
```

Creates a [`NavigationBar.Button`](../button.md) that performs an export action. `action`

### Configuration.init(_:)

```swift
init(_ configure: (inout NavigationBar.Configuration.Builder) -> Void)
```

Creates navigation bar configuration.

### ItemGroup.init(placement:items:)

```swift
init(placement: NavigationBar.ItemPlacement, @ArrayBuilder<any NavigationBar.Item> items: () -> [any NavigationBar.Item])
```

Creates a group of navigation bar [`NavigationBar.Item`](../item.md)s with a specific placement. `placement`

### Configuration.Builder.items(_:)

```swift
mutating func items(@NavigationBar.Builder _ newItems: @escaping NavigationBar.Items)
```

Sets the navigation bar items using a result builder.

### Configuration.Builder.modify(_:)

```swift
mutating func modify(_ modification: @escaping NavigationBar.Modifications)
```

Adds a modification. Modifications accumulate in order.

### NavigationBar.Builder

```swift
typealias Builder = ArrayBuilder<NavigationBar.ItemGroup>
```

A builder for building arrays of navigation bar [`NavigationBar.ItemGroup`](itemgroup.md)s.

### NavigationBar.Button

```swift
typealias Button = EditorComponents.Button
```

A button navigation bar [`NavigationBar.Item`](item.md) component.

### NavigationBar.Buttons

```swift
enum Buttons
```

A namespace for navigation bar buttons.

### Buttons.NavigationBar.Buttons.ID

```swift
enum ID
```

A namespace for navigation bar button IDs.

### NavigationBar.Configuration

```swift
struct Configuration
```

Configuration for navigation bar.

### Configuration.NavigationBar.Configuration.Builder

```swift
struct Builder
```

Builder for navigation bar configuration.

### NavigationBar.Context

```swift
struct Context
```

The context of navigation bar components.

### NavigationBar.Item

```swift
protocol Item : EditorComponent where Self.Context == NavigationBar.Context
```

A type for navigation bar item components.

### NavigationBar.ItemGroup

```swift
struct ItemGroup
```

A group of navigation bar [`NavigationBar.Item`](item.md)s with a specific [`NavigationBar.ItemPlacement`](itemplacement.md).

### NavigationBar.ItemPlacement

```swift
enum ItemPlacement
```

A type that defines the placement of navigation bar [`NavigationBar.Item`](item.md)s contained in an [`NavigationBar.ItemGroup`](itemgroup.md). It is mapped to the corresponding SwiftUI `ToolbarItemPlacement`s used for `ToolbarItemGroup`s.

### ItemPlacement.NavigationBar.ItemPlacement.principal

```swift
case principal
```

### ItemPlacement.NavigationBar.ItemPlacement.topBarLeading

```swift
case topBarLeading
```

### ItemPlacement.NavigationBar.ItemPlacement.topBarTrailing

```swift
case topBarTrailing
```

### NavigationBar.Items

```swift
typealias Items = NavigationBar.Context.To<[NavigationBar.ItemGroup]>
```

A closure to build an array of navigation bar [`NavigationBar.ItemGroup`](itemgroup.md)s.

### NavigationBar.Modifications

```swift
typealias Modifications = @MainActor @Sendable (NavigationBar.Context, NavigationBar.Modifier) throws -> Void
```

A closure to modify an array of navigation bar [`NavigationBar.Item`](item.md)s grouped by their [`NavigationBar.ItemPlacement`](itemplacement.md)s..

### NavigationBar.Modifier

```swift
typealias Modifier = ArrayModifier<any NavigationBar.Item, NavigationBar.ItemPlacement>
```

A modifier for modifying arrays of navigation bar [`NavigationBar.Item`](item.md)s grouped by their [`NavigationBar.ItemPlacement`](itemplacement.md)s.

### Buttons.ID.nextPage

```swift
static var nextPage: EditorComponentID { get }
```

The id of the [`nextPage(action:label:isEnabled:isVisible:)`](../nextpage(action:label:isenabled:isvisible:).md) button.

### Buttons.nextPage(action:label:isEnabled:isVisible:)

```swift
@MainActor static func nextPage(action: @escaping NavigationBar.Context.To<Void> = { $0.eventHandler.send(.navigateToNextPage) }, @ViewBuilder label: @escaping NavigationBar.Context.To<some View> = { _ in
      NavigationLabel(.imgly.localized("ly_img_editor_navigation_bar_button_next"), direction: .forward)
    }, isEnabled: @escaping NavigationBar.Context.To<Bool> = { !$0.state.isCreating }, isVisible: @escaping NavigationBar.Context.To<Bool> = {
      if !$0.state.isCreating, let engine = $0.engine {
        try $0.state.viewMode == .edit && (
          engine.editor.getSettingBool("features/pageCarouselEnabled") ||
            engine.scene.getPages().last != engine.scene.getCurrentPage()
        )
      } else {
        false
      }
    }) -> some NavigationBar.Item
```

Creates a [`NavigationBar.Button`](../button.md) that navigates to the next page. `action`

### Buttons.ID.previousPage

```swift
static var previousPage: EditorComponentID { get }
```

The id of the [`previousPage(action:label:isEnabled:isVisible:)`](../previouspage(action:label:isenabled:isvisible:).md) button.

### Buttons.previousPage(action:label:isEnabled:isVisible:)

```swift
@MainActor static func previousPage(action: @escaping NavigationBar.Context.To<Void> = { $0.eventHandler.send(.navigateToPreviousPage) }, @ViewBuilder label: @escaping NavigationBar.Context.To<some View> = { _ in
      NavigationLabel(.imgly.localized("ly_img_editor_navigation_bar_button_previous"), direction: .backward)
    }, isEnabled: @escaping NavigationBar.Context.To<Bool> = { !$0.state.isCreating }, isVisible: @escaping NavigationBar.Context.To<Bool> = {
      if !$0.state.isCreating, let engine = $0.engine {
        try $0.state.viewMode == .edit && (
          engine.editor.getSettingBool("features/pageCarouselEnabled") ||
            engine.scene.getPages().first != engine.scene.getCurrentPage()
        )
      } else {
        false
      }
    }) -> some NavigationBar.Item
```

Creates a [`NavigationBar.Button`](../button.md) that navigates to the previous page. `action`

### Buttons.ID.redo

```swift
static var redo: EditorComponentID { get }
```

The id of the [`redo(action:label:isEnabled:isVisible:)`](../redo(action:label:isenabled:isvisible:).md) button.

### Buttons.redo(action:label:isEnabled:isVisible:)

```swift
@MainActor static func redo(action: @escaping NavigationBar.Context.To<Void> = { try $0.engine?.editor.redo() }, @ViewBuilder label: @escaping NavigationBar.Context.To<some View> = {
      Label { Text(.imgly.localized("ly_img_editor_navigation_bar_button_redo")) } icon: { Image.imgly.redo }
        .opacity($0.state.viewMode == .preview ? 0 : 1)
        .labelStyle(.imgly.adaptiveIconOnly)
    }, isEnabled: @escaping NavigationBar.Context.To<Bool> = {
      try !$0.state.isCreating && $0.state.viewMode != .preview && $0.engine?.editor.canRedo() == true
    }, isVisible: @escaping NavigationBar.Context.To<Bool> = { _ in true }) -> some NavigationBar.Item
```

Creates a [`NavigationBar.Button`](../button.md) that performs a redo action. `action`

### Context.state

```swift
let state: any EditorState
```

The state of the current editor.

### Buttons.ID.togglePagesMode

```swift
static var togglePagesMode: EditorComponentID { get }
```

The id of the [`togglePagesMode(action:label:isEnabled:isVisible:)`](../togglepagesmode(action:label:isenabled:isvisible:).md) button.

### Buttons.togglePagesMode(action:label:isEnabled:isVisible:)

```swift
@MainActor static func togglePagesMode(action: @escaping NavigationBar.Context.To<Void> = {
      $0.eventHandler.send(.setViewMode($0.state.viewMode == .pages ? .edit : .pages))
    }, @ViewBuilder label: @escaping NavigationBar.Context.To<some View> = {
      let isPagesMode = $0.state.viewMode == .pages
      let pageCount = try $0.engine?.scene.get() != nil ? $0.engine?.scene.getPages().count ?? 0 : 0
      return Label {
        let pages = AttributedString(localized:
          .imgly.localized("ly_img_editor_navigation_bar_button_pages_mode \(pageCount)"))
         
         
        Text(pages.imgly.remove(string: "\(pageCount)"))
          .padding(.leading, -4)
      } icon: {
        HStack {
          Image.imgly.pages
            .symbolVariant(isPagesMode ? .fill : .none)
          Text("\(pageCount)")
            .monospacedDigit()
            .font(.subheadline.weight(.semibold))
        }
      }
      .labelStyle(.imgly.adaptiveIconOnly)
      .accessibilityLabel(Text(.imgly.localized("ly_img_editor_navigation_bar_button_toggle_pages_mode")))
    }, isEnabled: @escaping NavigationBar.Context.To<Bool> = { !$0.state.isCreating }, isVisible: @escaping NavigationBar.Context.To<Bool> = {
      try $0.state.isCreating || $0.engine?.block.find(byType: .stack).first != nil
    }) -> some NavigationBar.Item
```

Creates a [`NavigationBar.Button`](../button.md) that toggles between pages and edit mode. `action`

### Buttons.ID.togglePreviewMode

```swift
static var togglePreviewMode: EditorComponentID { get }
```

The id of the [`togglePreviewMode(action:label:isEnabled:isVisible:)`](../togglepreviewmode(action:label:isenabled:isvisible:).md) button.

### Buttons.togglePreviewMode(action:label:isEnabled:isVisible:)

```swift
@MainActor static func togglePreviewMode(action: @escaping NavigationBar.Context.To<Void> = {
      $0.eventHandler.send(.setViewMode($0.state.viewMode == .preview ? .edit : .preview))
    }, @ViewBuilder label: @escaping NavigationBar.Context.To<some View> = {
      let isPreviewMode = $0.state.viewMode == .preview
      return ZStack(alignment: .leading) {
        Label {
          Text(.imgly.localized("ly_img_editor_navigation_bar_button_preview_mode"))
        } icon: {
          Image.imgly.preview
        }
        .opacity(isPreviewMode ? 0 : 1)
        Label {
          Text(.imgly.localized("ly_img_editor_navigation_bar_button_edit_mode"))
        } icon: {
          Image.imgly.preview.symbolVariant(.fill)
        }
        .opacity(isPreviewMode ? 1 : 0)
      }
      .labelStyle(.imgly.adaptiveIconOnly)
      .accessibilityElement(children: .ignore)  
      .accessibilityLabel(Text(.imgly.localized("ly_img_editor_navigation_bar_button_toggle_preview_mode")))
    }, isEnabled: @escaping NavigationBar.Context.To<Bool> = { !$0.state.isCreating }, isVisible: @escaping NavigationBar.Context.To<Bool> = { _ in true }) -> some NavigationBar.Item
```

Creates a [`NavigationBar.Button`](../button.md) that toggles between preview and edit mode. `action`

### Buttons.ID.undo

```swift
static var undo: EditorComponentID { get }
```

The id of the [`undo(action:label:isEnabled:isVisible:)`](../undo(action:label:isenabled:isvisible:).md) button.

### Buttons.undo(action:label:isEnabled:isVisible:)

```swift
@MainActor static func undo(action: @escaping NavigationBar.Context.To<Void> = { try $0.engine?.editor.undo() }, @ViewBuilder label: @escaping NavigationBar.Context.To<some View> = {
      Label { Text(.imgly.localized("ly_img_editor_navigation_bar_button_undo")) } icon: { Image.imgly.undo }
        .opacity($0.state.viewMode == .preview ? 0 : 1)
        .labelStyle(.imgly.adaptiveIconOnly)
    }, isEnabled: @escaping NavigationBar.Context.To<Bool> = {
      try !$0.state.isCreating && $0.state.viewMode != .preview && $0.engine?.editor.canUndo() == true
    }, isVisible: @escaping NavigationBar.Context.To<Bool> = { _ in true }) -> some NavigationBar.Item
```

Creates a [`NavigationBar.Button`](../button.md) that performs an undo action. `action`

# EditorEvents

- **Module:** `IMGLYEditor`
- **DocC identifier:** `/documentation/IMGLYEditor/EditorEvents`

A namespace for [`EditorEvent`](editorevent.md)s.

```swift
enum EditorEvents
```

## Members

### AddFrom.defaultAssetSourceIDs

```swift
static var defaultAssetSourceIDs: [MediaType : String] { get }
```

Default asset source IDs for adding assets based on the asset’s [`MediaType`](../../../imglycoreui/mediatype.md).

### EditorEvents.AddFrom

```swift
enum AddFrom
```

A namespace for [`EditorEvent`](../editorevent.md)s related to adding assets.

### AddFrom.EditorEvents.AddFrom.IMGLYCamera

```swift
struct IMGLYCamera
```

An event for adding assets from the IMGLY camera.

### AddFrom.EditorEvents.AddFrom.IMGLYPhotoRoll

> **Deprecated:** 
  Deprecated in v1.66.0. Please see the changelog for migration details:
  https://img.ly/docs/cesdk/changelog/v1-66-0/
  

```swift
struct IMGLYPhotoRoll
```

An event for adding assets from the photo roll library sheet.

### AddFrom.EditorEvents.AddFrom.PhotoRoll

```swift
struct PhotoRoll
```

An event for adding assets from the photo roll. The behavior depends on the mode passed to [`PhotoRollAssetSource`](../../../imglycore/photorollassetsource.md):

### AddFrom.EditorEvents.AddFrom.SystemCamera

```swift
struct SystemCamera
```

An event for adding assets from the system camera.

### AddFrom.EditorEvents.AddFrom.SystemPhotoRoll

> **Deprecated:** 
  Deprecated in v1.66.0. Please see the changelog for migration details:
  https://img.ly/docs/cesdk/changelog/v1-66-0/
  

```swift
struct SystemPhotoRoll
```

An event for adding assets from the system photo roll.

### EditorEvents.ApplyForceCrop

```swift
struct ApplyForceCrop
```

An event for applying a force crop preset to a block.

### EditorEvents.CloseEditor

```swift
struct CloseEditor
```

An event for closing the editor.

### EditorEvents.Export

```swift
enum Export
```

A namespace for [`EditorEvent`](../editorevent.md)s related to export.

### Export.EditorEvents.Export.Cancel

```swift
struct Cancel
```

An event for canceling the export process if it is running.

### Export.EditorEvents.Export.Completed

```swift
struct Completed
```

An export completed event.

### Export.EditorEvents.Export.Progress

```swift
struct Progress
```

An export progress event.

### Export.EditorEvents.Export.Start

```swift
struct Start
```

An event for starting an export process.

### EditorEvents.Navigation

```swift
enum Navigation
```

A namespace for [`EditorEvent`](../editorevent.md)s related to navigation inside the editor .

### Navigation.EditorEvents.Navigation.ToNextPage

```swift
struct ToNextPage
```

An event for navigating to the next page.

### Navigation.EditorEvents.Navigation.ToPreviousPage

```swift
struct ToPreviousPage
```

An event for navigating to the previous page.

### EditorEvents.OnClose

```swift
struct OnClose
```

An event before closing the editor

### EditorEvents.Selection

```swift
enum Selection
```

A namespace for [`EditorEvent`](../editorevent.md)s related to the selected design block.

### Selection.EditorEvents.Selection.BringForward

```swift
struct BringForward
```

An event for bringing forward the selected design block.

### Selection.EditorEvents.Selection.Delete

```swift
struct Delete
```

An event for deleting the selected design block.

### Selection.EditorEvents.Selection.Duplicate

```swift
struct Duplicate
```

An event for duplicating the selected design block.

### Selection.EditorEvents.Selection.EnterGroup

```swift
struct EnterGroup
```

An event for changing selection from a selected group to the first block within that group.

### Selection.EditorEvents.Selection.EnterTextEditMode

```swift
struct EnterTextEditMode
```

An event for entering text editing mode for the selected design block.

### Selection.EditorEvents.Selection.MoveAsClip

```swift
struct MoveAsClip
```

An event for moving the selected design block into the background track as clip in a video scene.

### Selection.EditorEvents.Selection.MoveAsOverlay

```swift
struct MoveAsOverlay
```

An event for moving the selected design block from the background track to an overlay in a video scene.

### Selection.EditorEvents.Selection.SelectGroup

```swift
struct SelectGroup
```

An event for changing selection from the selected design block to the group design block that contains the selected design block.

### Selection.EditorEvents.Selection.SendBackward

```swift
struct SendBackward
```

An event for sending backward the selected design block.

### Selection.EditorEvents.Selection.Split

```swift
struct Split
```

An event for splitting the selected design block in a video scene.

### EditorEvents.SetExtraCanvasInsets

```swift
struct SetExtraCanvasInsets
```

An event for setting extra zoom insets on the canvas.

### EditorEvents.SetVideoDurationConstraints

```swift
struct SetVideoDurationConstraints
```

An event for setting minimum and maximum video duration constraints.

### EditorEvents.SetViewMode

```swift
struct SetViewMode
```

An event for setting the view mode of the editor.

### EditorEvents.ShareFile

```swift
struct ShareFile
```

A share file event.

### EditorEvents.Sheet

```swift
enum Sheet
```

A namespace for [`EditorEvent`](../editorevent.md)s related to sheet handling.

### Sheet.EditorEvents.Sheet.Close

```swift
struct Close
```

A sheet close event.

### Sheet.EditorEvents.Sheet.Open

```swift
struct Open
```

A sheet open event.

### EditorEvents.ShowCloseConfirmationAlert

```swift
struct ShowCloseConfirmationAlert
```

An event for showing a confirmation alert when closing the editor with unsaved changes.

### EditorEvents.ShowErrorAlert

```swift
struct ShowErrorAlert
```

An event for showing a error alert when closing the editor with an error.

### EditorEvents.ShowVideoMinLengthAlert

```swift
struct ShowVideoMinLengthAlert
```

An event for showing an alert when the video is below the minimum duration.

# EditorEvent

- **Module:** `IMGLYEditor`
- **DocC identifier:** `/documentation/IMGLYEditor/EditorEvent`

An editor event that can be sent via [`EditorEventHandler`](editoreventhandler.md).

```swift
protocol EditorEvent
```

## Members

### addFromIMGLYCamera(to:)

```swift
static func addFromIMGLYCamera(to assetSourceIDs: [MediaType : String] = EditorEvents.AddFrom.defaultAssetSourceIDs) -> Self
```

Creates an [`EditorEvent`](../editorevent.md) to add assets from the IMGLY camera. `assetSourceIDs`

### addFromIMGLYPhotoRoll

> **Deprecated:** 
  Deprecated in v1.66.0. Please see the changelog for migration details:
  https://img.ly/docs/cesdk/changelog/v1-66-0/
  

```swift
static var addFromIMGLYPhotoRoll: EditorEvents.AddFrom.IMGLYPhotoRoll { get }
```

Creates an [`EditorEvent`](../editorevent.md) to add assets from the photo roll library sheet. The created [`EditorEvents.AddFrom.IMGLYPhotoRoll`](../editorevents/addfrom/imglyphotoroll.md) event.

### addFromPhotoRoll

```swift
static var addFromPhotoRoll: EditorEvents.AddFrom.PhotoRoll { get }
```

Creates an [`EditorEvent`](../editorevent.md) to add assets from the photo roll.

### addFromPhotoRoll(addToBackgroundTrack:)

```swift
static func addFromPhotoRoll(addToBackgroundTrack: Bool = false) -> Self
```

Creates an [`EditorEvent`](../editorevent.md) to add assets from the photo roll. `addToBackgroundTrack`

### addFromSystemCamera(to:addToBackgroundTrack:)

```swift
static func addFromSystemCamera(to assetSourceIDs: [MediaType : String] = EditorEvents.AddFrom.defaultAssetSourceIDs, addToBackgroundTrack: Bool = false) -> Self
```

Creates an [`EditorEvent`](../editorevent.md) to add assets from the system camera. `assetSourceIDs`

### addFromSystemPhotoRoll(to:addToBackgroundTrack:)

> **Deprecated:** 
  Deprecated in v1.66.0. Please see the changelog for migration details:
  https://img.ly/docs/cesdk/changelog/v1-66-0/
  

```swift
static func addFromSystemPhotoRoll(to assetSourceIDs: [MediaType : String] = EditorEvents.AddFrom.defaultAssetSourceIDs, addToBackgroundTrack: Bool = false) -> Self
```

Creates an [`EditorEvent`](../editorevent.md) to add assets from the system photo roll. `assetSourceIDs`

### applyForceCrop(to:with:mode:)

```swift
static func applyForceCrop(to blockID: DesignBlockID, with presetCandidates: [ForceCropPreset], mode: ForceCropMode) -> Self
```

Creates an [`EditorEvent`](../editorevent.md) to apply a force crop preset to a design block. `blockID`

### bringSelectionForward

```swift
static var bringSelectionForward: EditorEvents.Selection.BringForward { get }
```

Creates an [`EditorEvent`](../editorevent.md) to bring forward the selected design block.

### cancelExport

```swift
static var cancelExport: EditorEvents.Export.Cancel { get }
```

Creates an [`EditorEvent`](../editorevent.md) to cancel the export process if it is running.

### closeEditor

```swift
static var closeEditor: EditorEvents.CloseEditor { get }
```

Creates an [`EditorEvent`](../editorevent.md) to close the editor.

### closeSheet

```swift
static var closeSheet: EditorEvents.Sheet.Close { get }
```

Creates an [`EditorEvent`](../editorevent.md) to close the sheet that is currently open.

### deleteSelection

```swift
static var deleteSelection: EditorEvents.Selection.Delete { get }
```

Creates an [`EditorEvent`](../editorevent.md) to delete the selected design block.

### duplicateSelection

```swift
static var duplicateSelection: EditorEvents.Selection.Duplicate { get }
```

Creates an [`EditorEvent`](../editorevent.md) to duplicate the selected design block.

### enterGroupForSelection

```swift
static var enterGroupForSelection: EditorEvents.Selection.EnterGroup { get }
```

Creates an [`EditorEvent`](../editorevent.md) to change selection from a selected group to the first block within that group.

### enterTextEditModeForSelection

```swift
static var enterTextEditModeForSelection: EditorEvents.Selection.EnterTextEditMode { get }
```

Creates an [`EditorEvent`](../editorevent.md) to enter text editing mode for the selected design block.

### exportCompleted(action:)

```swift
static func exportCompleted(action: @escaping () -> Void = {}) -> Self
```

Creates an [`EditorEvent`](../editorevent.md) to show the export completed sheet and to perform the given `action` after dismissal. `action`

### exportProgress(_:)

```swift
static func exportProgress(_ progress: ExportProgress = .spinner) -> Self
```

Creates an [`EditorEvent`](../editorevent.md) to show the export progress sheet for the given state. `progress`

### moveSelectionAsClip

```swift
static var moveSelectionAsClip: EditorEvents.Selection.MoveAsClip { get }
```

Creates an [`EditorEvent`](../editorevent.md) to move the selected design block into the background track as clip in a video scene.

### moveSelectionAsOverlay

```swift
static var moveSelectionAsOverlay: EditorEvents.Selection.MoveAsOverlay { get }
```

Creates an [`EditorEvent`](../editorevent.md) to move the selected design block from the background track to an overlay in a video scene.

### navigateToNextPage

```swift
static var navigateToNextPage: EditorEvents.Navigation.ToNextPage { get }
```

Creates an [`EditorEvent`](../editorevent.md) to navigate to the next page.

### navigateToPreviousPage

```swift
static var navigateToPreviousPage: EditorEvents.Navigation.ToPreviousPage { get }
```

Creates an [`EditorEvent`](../editorevent.md) to navigate to the previous page.

### onClose

```swift
static var onClose: EditorEvents.OnClose { get }
```

Creates an [`EditorEvent`](../editorevent.md) to trigger the onClose callback. The created [`EditorEvents.OnClose`](../editorevents/onclose.md) event.

### openSheet(style:associatedEditMode:content:)

```swift
static func openSheet(style: SheetStyle, associatedEditMode: EditMode? = nil, @ViewBuilder content: @escaping () -> some View) -> Self
```

Creates an [`EditorEvent`](../editorevent.md) to open a sheet with any `content`. `style`

### openSheet(type:)

```swift
static func openSheet(type: any SheetType) -> Self
```

Creates an [`EditorEvent`](../editorevent.md) to open a sheet of a specific `type`. `type`

### selectGroupForSelection

```swift
static var selectGroupForSelection: EditorEvents.Selection.SelectGroup { get }
```

Creates an [`EditorEvent`](../editorevent.md) to change selection from the selected design block to the group design block that contains the selected design block.

### sendSelectionBackward

```swift
static var sendSelectionBackward: EditorEvents.Selection.SendBackward { get }
```

Creates an [`EditorEvent`](../editorevent.md) to send backward the selected design block.

### setExtraCanvasInsets(_:)

```swift
static func setExtraCanvasInsets(_ insets: CGFloat) -> Self
```

Creates an [`EditorEvent`](../editorevent.md) to set extra zoom insets for the canvas.. `insets`

### setVideoDurationConstraints(minimumVideoDuration:maximumVideoDuration:)

```swift
static func setVideoDurationConstraints(minimumVideoDuration: TimeInterval?, maximumVideoDuration: TimeInterval?) -> Self
```

Creates an [`EditorEvent`](../editorevent.md) to set minimum and maximum video duration constraints. `minimumVideoDuration`

### setViewMode(_:)

```swift
static func setViewMode(_ viewMode: EditorViewMode) -> Self
```

Creates an [`EditorEvent`](../editorevent.md) to set the view mode of the editor. `viewMode`

### shareFile(_:)

```swift
static func shareFile(_ url: URL) -> Self
```

Creates an [`EditorEvent`](../editorevent.md) to show the share sheet for the given URL. `url`

### showCloseConfirmationAlert

```swift
static var showCloseConfirmationAlert: EditorEvents.ShowCloseConfirmationAlert { get }
```

Creates an [`EditorEvent`](../editorevent.md) to show the close confirmation alert.

### showErrorAlert(_:_:)

```swift
static func showErrorAlert(_ error: any Error, _ onDismiss: @escaping () -> Void = {}) -> Self
```

Creates an [`EditorEvent`](../editorevent.md) to show the error alert.

### showVideoMinLengthAlert(minimumVideoDuration:)

```swift
static func showVideoMinLengthAlert(minimumVideoDuration: TimeInterval) -> Self
```

Creates an [`EditorEvent`](../editorevent.md) to show an alert when the video is below the minimum duration. `minimumVideoDuration`

### splitSelection

```swift
static var splitSelection: EditorEvents.Selection.Split { get }
```

Creates an [`EditorEvent`](../editorevent.md) to split the selected design block in a video scene.

### startExport

```swift
static var startExport: EditorEvents.Export.Start { get }
```

Creates an [`EditorEvent`](../editorevent.md) to start the export process. This event triggers the [`onExport(_:)`](../editorconfiguration/builder/onexport(_:).md) callback.

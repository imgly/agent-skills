# EditorAPI

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/EditorAPI`

```swift
@MainActor final class EditorAPI
```

## Members

### addUndoStep()

```swift
@MainActor func addUndoStep() throws
```

Adds a new history state to the stack, if undoable changes were made.

### addVectorNode()

```swift
@MainActor func addVectorNode() throws
```

Add a new vertex by splitting the segment after the currently selected vector node.

### canRedo()

```swift
@MainActor func canRedo() throws -> Bool
```

If a redo step is available. `true` if a redo step is available.

### canUndo()

```swift
@MainActor func canUndo() throws -> Bool
```

If an undo step is available. `true` if an undo step is available.

### checkP3Support()

```swift
@MainActor func checkP3Support() throws
```

If the engine does not support working in the P3 color space, this function throws an error.

### convertColorToColorSpace(color:colorSpace:)

```swift
@MainActor func convertColorToColorSpace(color: Color, colorSpace: ColorSpace) throws -> Color
```

Converts a color to the given color space. `color`

### createBuffer()

```swift
@MainActor func createBuffer() -> URL
```

Create a resizable buffer that can hold arbitrary data. A URL to identify the buffer.

### createHistory()

```swift
@MainActor func createHistory() -> History
```

Create a history which consists of an undo/redo stack for editing operations. There can be multiple. But only one can be active at a time. The handle to the created history.

### defaultURIResolver(relativePath:)

```swift
@MainActor func defaultURIResolver(relativePath: String) -> String
```

This is the default implementation for the URI resolver. It resolves the given path relative to the `basePath` setting. `relativePath`

### deleteSelectedVectorControlPoints()

```swift
@MainActor func deleteSelectedVectorControlPoints() throws
```

Delete (reset) the currently selected vector control point handles. Removes the bezier handle from the node, converting that side to a straight line. If the node has two handles, only the selected one is removed.

### deleteVectorNode()

```swift
@MainActor func deleteVectorNode() throws
```

Delete the currently selected vector node from the path.

### destroyBuffer(url:)

```swift
@MainActor func destroyBuffer(url: URL) throws
```

Destroy a buffer and free its resources. `url`

### destroyHistory(_:)

```swift
@MainActor func destroyHistory(_ history: History)
```

Destroy the given history, returns an error if the handle doesn’t refer to a history. `history`

### findAllMediaURIs()

```swift
@MainActor func findAllMediaURIs() throws -> [URL]
```

Returns all media URIs referenced by blocks in the scene. An array of deduplicated media URIs.

### findAllScopes()

```swift
@MainActor func findAllScopes() -> [String]
```

Gets all available global scopes that can be set. A list of all available global scopes.

### findAllSettings()

```swift
@MainActor func findAllSettings() -> [String]
```

Get a list of all available settings. A list of all available settings.

### findAllSpotColors()

```swift
@MainActor func findAllSpotColors() -> [String]
```

Queries the names of currently set spot colors previously set with `setSpotColor`. The names of set spot colors.

### findAllTransientResources()

```swift
@MainActor func findAllTransientResources() throws -> [(url: URL, size: UInt)]
```

Returns the URLs and sizes of all resources whose data would be lost if the scene was exported. A list containing the URLs and sizes of transient resources.

### getAbsoluteURI(relativePath:)

```swift
@MainActor func getAbsoluteURI(relativePath: String) async throws -> String
```

Resolves the given path. If a custom resolver has been set with `setURIResolver`, it invokes it with the given path. Else, it resolves it as relative to the `basePath` setting. `relativePath`

### getActiveHistory()

```swift
@MainActor func getActiveHistory() -> History
```

Get the handle to the currently active history. If there’s none it will be created. The handle to the active history.

### getAvailableMemory()

```swift
@MainActor func getAvailableMemory() throws -> Int64
```

Get the currently available memory in bytes The available memory in bytes.

### getBufferData(url:offset:length:)

```swift
@MainActor func getBufferData(url: URL, offset: UInt, length: UInt) throws -> Data
```

Get the data of a buffer. `url`

### getBufferLength(url:)

```swift
@MainActor func getBufferLength(url: URL) throws -> NSNumber
```

Get the length of a buffer. `url`

### getCursorRotation()

```swift
@MainActor func getCursorRotation() -> Float
```

Get the rotation with which to render the mouse cursor. The angle in radians.

### getCursorType()

```swift
@MainActor func getCursorType() -> CursorType
```

Get the type of cursor that should be displayed by the application. The cursor type.

### getEditMode()

```swift
@MainActor func getEditMode() -> EditMode
```

Get the current edit mode of the editor. An edit mode defines what type of content can currently be edited by the user. “Transform”, “Crop”, “Text”, “Playback”.

### getFontMetrics(fontFileURI:)

```swift
@MainActor func getFontMetrics(fontFileURI: String) async throws -> FontMetrics
```

Get font metrics for a given font file URI. If the font is not yet loaded, it will be fetched asynchronously. `fontFileURI`

### getGlobalScope(key:)

```swift
@MainActor func getGlobalScope(key: String) throws -> GlobalScope
```

Query the state of a global scope. `key`

### getMaxExportSize()

```swift
@MainActor func getMaxExportSize() throws -> Int
```

Get the export size limit in pixels on the current device. An export is only possible when both the width and height of the output are below or equal this limit. However, this is only an upper limit as the export might also not be possible due to other reasons, e.g., memory constraints. The upper export size limit in pixels or an unlimited size, i.e, the maximum signed 32-bit integer value, if the limit is unknown.

### getMimeType(uri:)

> **Deprecated:** Use 'getMIMEType(url:)' instead. Renamed to `getMIMEType(url:)`.

```swift
@MainActor func getMimeType(uri: URL) async throws -> String
```

Returns the mimetype of the resources at the given URL. `uri`

### getMIMEType(url:)

```swift
@MainActor func getMIMEType(url: URL) async throws -> String
```

Returns the mimetype of the resources at the given URL. `url`

### getMoveHandleVisibility()

```swift
@MainActor func getMoveHandleVisibility() throws -> HandleVisibility
```

Get when the standalone move handle is shown for the selected block.

### getMovementConstraint(_:)

```swift
@MainActor func getMovementConstraint(_ id: DesignBlockID) throws -> ResolvedMovementConstraint?
```

Get the effective movement constraint for a block, picking the most specific matching rule: block > parent page > blockType > scene-wide. `id`

### getResizeHandlesVisibility()

```swift
@MainActor func getResizeHandlesVisibility() throws -> HandleVisibility
```

Get when the edge (resize) handles are shown for the selected block.

### getResourceData(url:chunkSize:onData:)

```swift
@MainActor func getResourceData(url: URL, chunkSize: UInt, onData: (Blob) -> Bool) throws
```

Provides the data of a resource at the given URL. `url`

### getRole()

```swift
@MainActor func getRole() throws -> String
```

Get the current role of the user. The current role of the user.

### getRotateHandlesVisibility()

```swift
@MainActor func getRotateHandlesVisibility() throws -> HandleVisibility
```

Get when the rotation handle is shown for the selected block.

### getScaleHandlesVisibility()

```swift
@MainActor func getScaleHandlesVisibility() throws -> HandleVisibility
```

Get when the corner (scale) handles are shown for the selected block.

### getSelectedVectorNodeMirrorMode()

```swift
@MainActor func getSelectedVectorNodeMirrorMode() throws -> Int
```

Get the bezier handle mirror mode of the currently selected vector node. The mirror mode as an integer (`0` = None, `1` = AngleAndLength, `2` = AngleOnly).

### getSettingBool(_:)

```swift
@MainActor func getSettingBool(_ keypath: String) throws -> Bool
```

Get a boolean setting. `keypath`

### getSettingColor(_:)-6p0rf

```swift
@MainActor func getSettingColor(_ keypath: String) throws -> Color
```

Get a color setting. `keypath`

### getSettingColor(_:)-9yw92

> **Deprecated:** 
    Use 'getSettingColor(id: DesignBlockID, property: String) -> Color' instead.
    

```swift
@MainActor func getSettingColor(_ keypath: String) throws -> RGBA
```

Get a color setting. `keypath`

### getSettingEnum(_:)

```swift
@MainActor func getSettingEnum(_ keypath: String) throws -> String
```

Get an enum setting. `keypath`

### getSettingEnumOptions(_:)

```swift
@MainActor func getSettingEnumOptions(_ keypath: String) throws -> [String]
```

Get the available options for an enum setting. `keypath`

### getSettingFloat(_:)

```swift
@MainActor func getSettingFloat(_ keypath: String) throws -> Float
```

Get a float setting. `keypath`

### getSettingInt(_:)

```swift
@MainActor func getSettingInt(_ keypath: String) throws -> Int
```

Get an integer setting. `keypath`

### getSettingString(_:)

```swift
@MainActor func getSettingString(_ keypath: String) throws -> String
```

Get a string setting. `keypath`

### getSettingType(_:)

```swift
@MainActor func getSettingType(_ keypath: String) throws -> PropertyType
```

Get the type of a setting. `keypath`

### getSpotColor(name:)-7h32o

```swift
@MainActor func getSpotColor(name: String) -> CMYK
```

Queries the CMYK representation set for a spot color. If the value of the queried spot color has not been set yet, returns the default CMYK representation (of magenta). `name`

### getSpotColor(name:)-8043o

```swift
@MainActor func getSpotColor(name: String) -> RGBA
```

Queries the RGB representation set for a spot color. If the value of the queried spot color has not been set yet, returns the default RGB representation (of magenta). The alpha value is always 1.0. `name`

### getSpotColorForCutoutType(cutoutType:)

```swift
@MainActor func getSpotColorForCutoutType(cutoutType: CutoutType) throws -> String
```

Get the name of the spot color assigned to a cutout type. `cutoutType`

### getTextCursorPositionInScreenSpaceX()

```swift
@MainActor func getTextCursorPositionInScreenSpaceX() -> Float
```

Get the current text cursor’s x position in screen space. The text cursor’s x position in screen space.

### getTextCursorPositionInScreenSpaceY()

```swift
@MainActor func getTextCursorPositionInScreenSpaceY() -> Float
```

Get the current text cursor’s y position in screen space. The text cursor’s y position in screen space.

### getUsedMemory()

```swift
@MainActor func getUsedMemory() throws -> Int64
```

Get the current memory usage of the editor in bytes The current memory usage in bytes.

### getVectorEditAddMode()

```swift
@MainActor func getVectorEditAddMode() -> Bool
```

Check whether vector edit add mode is currently active. `true` if add mode is active.

### getVectorEditBendMode()

```swift
@MainActor func getVectorEditBendMode() -> Bool
```

Check whether vector edit bend mode is currently active. `true` if bend mode is active.

### getVectorEditDeleteMode()

```swift
@MainActor func getVectorEditDeleteMode() -> Bool
```

Check whether vector edit delete mode is currently active. `true` if delete mode is active.

### hasSelectedVectorControlPoint()

```swift
@MainActor func hasSelectedVectorControlPoint() -> Bool
```

Check whether a vector control point handle is currently selected in vector edit mode. `true` if a vector control point handle is selected.

### hasSelectedVectorNode()

```swift
@MainActor func hasSelectedVectorNode() -> Bool
```

Check whether a vector anchor node is currently selected in vector edit mode. `true` if a vector anchor node is selected.

### isHighlightingEnabled(_:)

```swift
@MainActor func isHighlightingEnabled(_ id: DesignBlockID) throws -> Bool
```

Checks wether the block has selection and hover highlighting enabled or disabled. `id`

### isSelectionEnabled(_:)

```swift
@MainActor func isSelectionEnabled(_ id: DesignBlockID) throws -> Bool
```

Checks whether the block can currently be selected. `id`

### onHistoryUpdated

> **Deprecated:** Use 'onHistoryUpdatedWithKind' instead.

```swift
@MainActor var onHistoryUpdated: AsyncStream<Void> { get }
```

Subscribe to changes to the undo/redo history.

### onHistoryUpdatedPublisher

> **Deprecated:** Use 'onHistoryUpdatedWithKindPublisher' instead.

```swift
@MainActor var onHistoryUpdatedPublisher: AnyPublisher<Void, Never> { get }
```

Subscribe to changes to the undo/redo history.

### onHistoryUpdatedWithKind

```swift
@MainActor var onHistoryUpdatedWithKind: AsyncStream<HistoryUpdate> { get }
```

Subscribe to changes to the undo/redo history. Each emitted [`HistoryUpdate`](../historyupdate.md) describes the kind of update so consumers can distinguish a change to the active history’s snapshots (e.g. an edit, undo, or redo) from a pure activation via [`setActiveHistory(_:)`](./setactivehistory(_:).md).

### onHistoryUpdatedWithKindPublisher

```swift
@MainActor var onHistoryUpdatedWithKindPublisher: AnyPublisher<HistoryUpdate, Never> { get }
```

Subscribe to changes to the undo/redo history. Each emitted [`HistoryUpdate`](../historyupdate.md) describes the kind of update so consumers can distinguish a change to the active history’s snapshots (e.g. an edit, undo, or redo) from a pure activation via [`setActiveHistory(_:)`](./setactivehistory(_:).md).

### onRoleChanged

```swift
@MainActor var onRoleChanged: AsyncStream<String> { get }
```

Subscribe to changes to the editor role.

### onRoleChangedPublisher

```swift
@MainActor var onRoleChangedPublisher: AnyPublisher<String, Never> { get }
```

Subscribe to changes to the editor role.

### onSettingsChanged

```swift
@MainActor var onSettingsChanged: AsyncStream<Void> { get }
```

Subscribe to changes to the editor settings.

### onSettingsChangedPublisher

```swift
@MainActor var onSettingsChangedPublisher: AnyPublisher<Void, Never> { get }
```

Subscribe to changes to the editor settings.

### onStateChanged

```swift
@MainActor var onStateChanged: AsyncStream<Void> { get }
```

Subscribe to changes to the editor state.

### onStateChangedPublisher

```swift
@MainActor var onStateChangedPublisher: AnyPublisher<Void, Never> { get }
```

Subscribe to changes to the editor state.

### redo()

```swift
@MainActor func redo() throws
```

Redo one step in the history if a redo step is available.

### relocateResource(currentURL:relocatedURL:)

```swift
@MainActor func relocateResource(currentURL: URL, relocatedURL: URL) throws
```

Changes the URL associated with a resource. `currentURL`

### removeMovementConstraint(_:)-5h2ya

```swift
@MainActor func removeMovementConstraint(_ scope: MovementConstraintScope) throws
```

Remove the movement constraint for a specific scope. `scope`

### removeMovementConstraint(_:)-950o2

```swift
@MainActor func removeMovementConstraint(_ scopes: [MovementConstraintScope]) throws
```

Remove multiple movement constraint scopes at once. `scopes`

### removeMovementConstraint()

```swift
@MainActor func removeMovementConstraint() throws
```

Remove the scene-wide default movement constraint. Removing a scope falls through to the next tier on subsequent resolution.

### removeSpotColor(name:)

```swift
@MainActor func removeSpotColor(name: String) throws
```

Removes a spot color from the list of set spot colors. `name`

### removeUndoStep()

```swift
@MainActor func removeUndoStep() throws
```

Removes the last history state from the stack, if available.

### setActiveHistory(_:)

```swift
@MainActor func setActiveHistory(_ history: History)
```

Mark the given history as active, returns an error if the handle doesn’t refer to a history. All other histories get cleared from the active state. Undo/redo operations only apply to the active history. `history`

### setBufferData(url:offset:data:)

```swift
@MainActor func setBufferData(url: URL, offset: UInt, data: Data) throws
```

Set the data of a buffer. `url`

### setBufferLength(url:length:)

```swift
@MainActor func setBufferLength(url: URL, length: UInt) throws
```

Set the length of a buffer. `url`

### setEditMode(_:)

```swift
@MainActor func setEditMode(_ mode: EditMode)
```

Set the edit mode of the editor. An edit mode defines what type of content can currently be edited by the user. `mode`

### setGlobalScope(key:value:)

```swift
@MainActor func setGlobalScope(key: String, value: GlobalScope) throws
```

Set a scope to be globally allowed, denied, or deferred to the block-level. `key`

### setHighlightingEnabled(_:enabled:)

```swift
@MainActor func setHighlightingEnabled(_ id: DesignBlockID, enabled: Bool) throws
```

Enable or disable selection and hover highlighting for a block. `id`

### setMoveHandleVisibility(_:)

```swift
@MainActor func setMoveHandleVisibility(_ value: HandleVisibility) throws
```

Set when the standalone move handle is shown for the selected block.

### setMovementConstraint(_:)-3zshf

```swift
@MainActor func setMovementConstraint(_ rules: [MovementConstraintRule]) throws
```

Set multiple movement constraint rules at once. See [`setMovementConstraint(_:)`](./setmovementconstraint(_:)-9rhj7.md) for details. `rules`

### setMovementConstraint(_:)-9rhj7

```swift
@MainActor func setMovementConstraint(_ rule: MovementConstraintRule) throws
```

Set one or more rules that limit how far blocks can be positioned outside their parent page during user interactions (drag, resize, touch gestures, crop). Programmatic API calls are not affected. `rule`

### setResizeHandlesVisibility(_:)

```swift
@MainActor func setResizeHandlesVisibility(_ value: HandleVisibility) throws
```

Set when the edge (resize) handles are shown for the selected block.

### setRole(_:)

```swift
@MainActor func setRole(_ role: String) throws
```

Set the role of the user and apply role-dependent defaults for scopes and settings. `role`

### setRotateHandlesVisibility(_:)

```swift
@MainActor func setRotateHandlesVisibility(_ value: HandleVisibility) throws
```

Set when the rotation handle is shown for the selected block.

### setScaleHandlesVisibility(_:)

```swift
@MainActor func setScaleHandlesVisibility(_ value: HandleVisibility) throws
```

Set when the corner (scale) handles are shown for the selected block.

### setSelectedVectorNodeMirrorMode(_:)

```swift
@MainActor func setSelectedVectorNodeMirrorMode(_ mode: Int) throws
```

Set the bezier handle mirror mode for the currently selected vector node. `mode`

### setSelectionEnabled(_:enabled:)

```swift
@MainActor func setSelectionEnabled(_ id: DesignBlockID, enabled: Bool) throws
```

Enable or disable selection for a block. `id`

### setSettingBool(_:value:)

```swift
@MainActor func setSettingBool(_ keypath: String, value: Bool) throws
```

Set a boolean setting. `keypath`

### setSettingColor(_:color:)

```swift
@MainActor func setSettingColor(_ keypath: String, color: Color) throws
```

Set a color setting. `keypath`

### setSettingColor(_:r:g:b:a:)

> **Deprecated:** 
    Use 'setSettingColor(id: DesignBlockID, property: String, color: Color)' instead.
    

```swift
@MainActor func setSettingColor(_ keypath: String, r: Float, g: Float, b: Float, a: Float = 1) throws
```

Set a color setting. `keypath`

### setSettingEnum(_:value:)

```swift
@MainActor func setSettingEnum(_ keypath: String, value: String) throws
```

Set an enum setting. `keypath`

### setSettingFloat(_:value:)

```swift
@MainActor func setSettingFloat(_ keypath: String, value: Float) throws
```

Set a float setting. `keypath`

### setSettingInt(_:value:)

```swift
@MainActor func setSettingInt(_ keypath: String, value: Int) throws
```

Set an integer setting. `keypath`

### setSettingString(_:value:)

```swift
@MainActor func setSettingString(_ keypath: String, value: String) throws
```

Set a string setting. `keypath`

### setSpotColor(name:c:m:y:k:)

```swift
@MainActor func setSpotColor(name: String, c: Float, m: Float, y: Float, k: Float)
```

Sets the CMYK representation of a spot color. Use this function to both create a new spot color or update an existing spot color. `name`

### setSpotColor(name:r:g:b:)

```swift
@MainActor func setSpotColor(name: String, r: Float, g: Float, b: Float)
```

Sets the RGB representation of a spot color. Use this function to both create a new spot color or update an existing spot color. `name`

### setSpotColorForCutoutType(cutoutType:name:)

```swift
@MainActor func setSpotColorForCutoutType(cutoutType: CutoutType, name: String) throws
```

Set the spot color assign to a cutout type. If no spot color is set, type `.solid` is assigned “CutContour” and type `.dashed` is assigned “PerfCutContour”. All cutout blocks of the given type will be immediately assigned that spot color. `cutoutType`

### setURIResolver(_:)

```swift
@MainActor func setURIResolver(_ resolver: ((String) -> URL)?) throws
```

Sets a custom URI resolver. This method can be called more than once. Subsequent calls will overwrite previous calls. To remove a previously set resolver, pass the value `nil`. Note: The given function must return an absolute path with a scheme. The input is allowed to be invalid URI, e.g., due to placeholders. `resolver`

### setURIResolverAsync(_:)

```swift
@MainActor func setURIResolverAsync(_ resolver: (@Sendable (String) async throws -> URL)?) throws
```

Sets a custom async URI resolver. This method can be called more than once. Subsequent calls will overwrite previous calls. To remove a previously set resolver, pass the value `nil`. Note: The given function must return an absolute path with a scheme. The input is allowed to be invalid URI, e.g., due to placeholders. `resolver`

### setVectorEditAddMode(_:)

```swift
@MainActor func setVectorEditAddMode(_ active: Bool) throws
```

Enable or disable add mode for vector editing. `active`

### setVectorEditBendMode(_:)

```swift
@MainActor func setVectorEditBendMode(_ active: Bool) throws
```

Enable or disable bend mode for vector editing. `active`

### setVectorEditDeleteMode(_:)

```swift
@MainActor func setVectorEditDeleteMode(_ active: Bool) throws
```

Enable or disable delete mode for vector editing. `active`

### startAudioOutputDevice()

```swift
@MainActor func startAudioOutputDevice() throws
```

Start the audio output device. Usually not needed as the device will automatically start when a block is set to playing. Can be used to manually start the audio output device, e.g., before a recording.

### supportsP3()

```swift
@MainActor func supportsP3() throws -> Bool
```

Returns whether the engine supports displaying and working in the P3 color space on the current device. Otherwise, this function throws an error with a description of why the P3 color space is not supported. If supported, the engine can be switched to a P3 color space using the “features/p3WorkingColorSpace” setting.

### toggleSelectedVectorNodeSmooth()

```swift
@MainActor func toggleSelectedVectorNodeSmooth() throws
```

Toggle the currently selected vector node between smooth (bezier handles) and corner (no handles).

### undo()

```swift
@MainActor func undo() throws
```

Undo one step in the history if an undo step is available.

### unstable_isInteractionHappening()

```swift
@MainActor func unstable_isInteractionHappening() throws -> Bool
```

If an user interaction is happening, e.g., a resize edit with a drag handle or a touch gesture. true if an interaction is happening.

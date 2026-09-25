# EditorApi

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

```kotlin
interface EditorApi
```


## Members

### addUndoStep

```kotlin
abstract fun addUndoStep()
```

Adds a new history state to the stack, if undoable changes were made.

### addVectorNode

```kotlin
abstract fun addVectorNode()
```

Add a new vertex by splitting the segment after the currently selected vector node.

### canRedo

```kotlin
abstract fun canRedo(): Boolean
```

If a redo step is available.

### canUndo

```kotlin
abstract fun canUndo(): Boolean
```

If an undo step is available.

### checkP3Support

```kotlin
abstract fun checkP3Support()
```

Throws an exception if the device does not support displaying and working in the P3 color space on the current device. If no exception is thrown, the engine can be switched to a P3 color space using the "features/p3WorkingColorSpace" setting.

### convertColorToColorSpace

```kotlin
abstract fun convertColorToColorSpace(color: Color, colorSpace: ColorSpace): Color
```

Converts a color to the given color space.

### createBuffer

```kotlin
abstract fun createBuffer(): Uri
```

Create a resizable buffer that can hold arbitrary data.

### createHistory

```kotlin
abstract fun createHistory(): History
```

### defaultUriResolver

```kotlin
abstract fun defaultUriResolver(uri: Uri): Uri
```

This is the default implementation for the Uri resolver. If uri is absolute no adjustments are made. If it is relative, it resolves the given Uri relative to the basePath setting, which is "file:///android_asset" by default (assets base uri).

### deleteSelectedVectorControlPoints

```kotlin
abstract fun deleteSelectedVectorControlPoints()
```

Delete the selected vector control points.

### deleteVectorNode

```kotlin
abstract fun deleteVectorNode()
```

Delete the currently selected vector node from the path.

### destroyBuffer

```kotlin
abstract fun destroyBuffer(uri: Uri)
```

Destroy a buffer and free its resources.

### destroyHistory

```kotlin
abstract fun destroyHistory(history: History)
```

Destroy the given history, returns an error if the handle doesn't refer to a history.

### findAllMediaURIs

```kotlin
abstract fun findAllMediaURIs(): List<Uri>
```

Returns all media URIs referenced by blocks in the scene. Note: This function retrieves URIs from image fills, video fills, and audio blocks, including their source sets. Only returns valid media URIs (http://, https://, file://), excluding transient resources like buffer URIs. Useful for determining which media files are referenced by a scene (e.g., for cleanup operations, CDN management).

### findAllScopes

```kotlin
abstract fun findAllScopes(): List<String>
```

Gets all available global scopes that can be set.

### findAllSettings

```kotlin
abstract fun findAllSettings(): List<String>
```

Returns a list of all the settings available.

### findAllSpotColors

```kotlin
abstract fun findAllSpotColors(): List<String>
```

Queries the names of currently set spot colors previously set with setSpotColor.

### findAllTransientResources

```kotlin
abstract fun findAllTransientResources(): List<Pair<Uri, Int>>
```

Returns the Uris and sizes of all resources whose data would be lost if the scene was exported. Note: This function is useful for determining which resources need to be relocated (e.g., to a CDN) before exporting a scene since the resources are not included in the exported scene.

### getAbsoluteUri

```kotlin
abstract suspend fun getAbsoluteUri(uri: Uri): Uri
```

Resolves the given uri asynchronously. If a custom resolver has been set with setUriResolver, it uses the custom resolver. Else, it resolves using defaultUriResolver.

### getActiveHistory

```kotlin
abstract fun getActiveHistory(): History
```

Get the handle to the currently active history. If there's none it will be created.

### getActiveLicense

```kotlin
abstract fun getActiveLicense(): String
```

Get the active license of the engine.

### getAvailableMemory

```kotlin
abstract fun getAvailableMemory(): Long
```

Get the currently available memory in bytes.

### getBufferData

```kotlin
abstract fun getBufferData(uri: Uri, offset: Int, length: Int): ByteBuffer
```

Get the data of a buffer.

### getBufferLength

```kotlin
abstract fun getBufferLength(uri: Uri): Int
```

Get the length of a buffer.

### getEditMode

```kotlin
abstract fun getEditMode(): String
```

Get the current edit mode of the editor. An edit mode defines what type of content can currently be edited by the user.

### getFontMetrics

```kotlin
abstract suspend fun getFontMetrics(fontFileUri: String): FontMetrics
```

Returns the font metrics for a given font file URI. If the font is not yet loaded, it will be fetched asynchronously. The returned metrics are in the font's design units coordinate space.

### getGlobalScope

```kotlin
abstract fun getGlobalScope(key: String): GlobalScope
```

Query the state of a global scope.

### getMaxExportSize

```kotlin
abstract fun getMaxExportSize(): Int
```

Get the export size limit in pixels on the current device. An export is only possible when both the width and height of the output are below or equal this limit. However, this is only an upper limit as the export might also not be possible due to other reasons, e.g., memory constraints.

### getMimeType

```kotlin
abstract suspend fun getMimeType(uri: Uri): String
```

Returns the mimetype of the resources at the given Uri. If the resource is not already downloaded, this function will download it.

### getMovementConstraint

```kotlin
abstract fun getMovementConstraint(block: DesignBlock): ResolvedMovementConstraint?
```

Get the effective movement constraint for a block, picking the most specific matching rule: block parent page blockType scene-wide. The returned ResolvedMovementConstraint.overshoot is a fraction of the block's own size.

### getResourceData

```kotlin
abstract fun getResourceData(uri: Uri, chunkSize: Int, onData: (ByteBuffer) -> Boolean)
```

Provides the data of a resource at the given Uri. Note that it is a synchronous function and all the chunks are provided immediately before the function returns.

### getRole

```kotlin
abstract fun getRole(): String
```

Get the current role of the user

### getSelectedVectorNodeMirrorMode

```kotlin
abstract fun getSelectedVectorNodeMirrorMode(): Int
```

Get the bezier handle mirror mode of the currently selected vector node.

### getSettingBoolean

```kotlin
abstract fun getSettingBoolean(keypath: String): Boolean
```

Get a boolean setting.

### getSettingColor

```kotlin
abstract fun getSettingColor(keypath: String): RGBAColor
```

Get a color setting.

### getSettingEnumOptions

```kotlin
abstract fun getSettingEnumOptions(keypath: String): List<String>
```

Get all the available options of an enum setting.

### getSettingEnum

```kotlin
abstract fun getSettingEnum(keypath: String): String
```

Get an enum setting.

### getSettingFloat

```kotlin
abstract fun getSettingFloat(keypath: String): Float
```

Get a float setting.

### getSettingInt

```kotlin
abstract fun getSettingInt(keypath: String): Int
```

Get an integer setting.

### getSettingString

```kotlin
abstract fun getSettingString(keypath: String): String
```

Get a string setting.

### getSettingType

```kotlin
abstract fun getSettingType(keypath: String): PropertyType
```

Get the type of a setting.

### getSpotColorCMYK

```kotlin
abstract fun getSpotColorCMYK(name: String): CMYKColor
```

Queries the CMYK representation set for a spot color. If the value of the queried spot color has not been set yet, returns the default RGB representation (of magenta).

### getSpotColorRGB

```kotlin
abstract fun getSpotColorRGB(name: String): RGBAColor
```

Queries the RGB representation set for a spot color. If the value of the queried spot color has not been set yet, returns the default RGB representation (of magenta). The alpha value is always 1.0.

### getSpotColor

```kotlin
abstract fun getSpotColor(name: String): RGBAColor
```
> **Deprecated:** Use getSpotColorRGB instead. Replace with `this.getSpotColorRGB(name)`.

Queries the RGB representation set for a spot color. If the value of the queried spot color has not been set yet, returns the default RGB representation (of magenta). The alpha value is always 1.0.

### getTextCursorPositionInScreenSpaceX

```kotlin
abstract fun getTextCursorPositionInScreenSpaceX(): Float
```

Get the current text cursor's x position in screen space.

### getTextCursorPositionInScreenSpaceY

```kotlin
abstract fun getTextCursorPositionInScreenSpaceY(): Float
```

Get the current text cursor's y position in screen space.

### getUsedMemory

```kotlin
abstract fun getUsedMemory(): Long
```

Get the current memory usage of the editor in bytes.

### getVectorEditAddMode

```kotlin
abstract fun getVectorEditAddMode(): Boolean
```

Check whether vector edit add mode is currently active.

### getVectorEditBendMode

```kotlin
abstract fun getVectorEditBendMode(): Boolean
```

Check whether vector edit bend mode is currently active.

### getVectorEditDeleteMode

```kotlin
abstract fun getVectorEditDeleteMode(): Boolean
```

Check whether vector edit delete mode is currently active.

### hasSelectedVectorControlPoint

```kotlin
abstract fun hasSelectedVectorControlPoint(): Boolean
```

Check if there is a selected vector control point.

### hasSelectedVectorNode

```kotlin
abstract fun hasSelectedVectorNode(): Boolean
```

Check whether a vector anchor node is currently selected in vector edit mode.

### isHighlightingEnabled

```kotlin
abstract fun isHighlightingEnabled(block: DesignBlock): Boolean
```

Checks wether the block has selection and hover highlighting enabled or disabled.

### isInteractionHappening

```kotlin
abstract fun isInteractionHappening(): Boolean
```

If an user interaction is happening, e.g., a resize edit with a drag handle or a touch gesture.

### isSelectionEnabled

```kotlin
abstract fun isSelectionEnabled(block: DesignBlock): Boolean
```

Checks whether the block can currently be selected.

### onCarouselPageChanged

```kotlin
abstract fun onCarouselPageChanged(): Flow<DesignBlock>
```

Subscribe to current page changes when page carousel mode is enabled. Note: This is only triggered when page carousel mode is enabled (features/pageCarouselEnabled).

### onHistoryUpdatedWithKind

```kotlin
abstract fun onHistoryUpdatedWithKind(): Flow<HistoryUpdate>
```

Subscribe to changes to the undo/redo history. Each emitted HistoryUpdate describes what kind of update happened so consumers can distinguish a real change to the active history's snapshots (e.g. an edit, undo, or redo) from a pure activation via setActiveHistory.

### onHistoryUpdated

```kotlin
abstract fun onHistoryUpdated(): Flow<Unit>
```
> **Deprecated:** Use onHistoryUpdatedWithKind() to also receive the kind of update. Replace with `onHistoryUpdatedWithKind()`.

Subscribe to changes to the undo/redo history.

### onRoleChanged

```kotlin
abstract fun onRoleChanged(): Flow<String>
```

Subscribe to changes to the editor role.

### onSettingsChanged

```kotlin
abstract fun onSettingsChanged(): Flow<Unit>
```

Subscribe to changes to the editor settings.

### onStateChanged

```kotlin
abstract fun onStateChanged(): Flow<Unit>
```

Subscribe to changes to the editor state.

### redo

```kotlin
abstract fun redo()
```

Redo one step in the history if a redo step is available.

### relocateResource

```kotlin
abstract fun relocateResource(currentUri: Uri, relocatedUri: Uri)
```

Changes the uri associated with a resource. Note: This function can be used change the Uri of a resource that has been relocated (e.g., to a CDN).

### removeMovementConstraint

```kotlin
abstract fun removeMovementConstraint()
```

```kotlin
abstract fun removeMovementConstraint(scope: MovementConstraintScope)
```

```kotlin
abstract fun removeMovementConstraint(scopes: List<MovementConstraintScope>)
```

Remove the scene-wide default movement constraint. Removing a scope falls through to the next tier on subsequent resolution. Remove the movement constraint for a specific scope. Removing a scope falls through to the next tier on subsequent resolution.

### removeSpotColor

```kotlin
abstract fun removeSpotColor(name: String)
```

Removes a spot color from the list of set spot colors.

### removeUndoStep

```kotlin
abstract fun removeUndoStep()
```

Removes the last history state from the stack, if available.

### setActiveHistory

```kotlin
abstract fun setActiveHistory(history: History)
```

Mark the given history as active, returns an error if the handle doesn't refer to a history. All other histories get cleared from the active state. Undo/redo operations only apply to the active history.

### setAppIsPaused

```kotlin
abstract fun setAppIsPaused(paused: Boolean)
```

Inform the engine that the app went to the background when paused. When the app is paused, the engine will try to release resources to save memory. The audio output device will be suspended on pause. It starts again automatically as soon as a block is playing or can be started manually with startAudioOutputDevice.

### setBufferData

```kotlin
abstract fun setBufferData(uri: Uri, offset: Int, data: ByteBuffer)
```

Set the data of a buffer.

### setBufferLength

```kotlin
abstract fun setBufferLength(uri: Uri, length: Int)
```

Set the length of a buffer.

### setEditMode

```kotlin
abstract fun setEditMode(editMode: String)
```

```kotlin
abstract fun setEditMode(editMode: String, baseMode: String)
```

Set the edit mode of the editor. An edit mode defines what type of content can currently be edited by the user. Note: The initial edit mode is "Transform".

### setGlobalScope

```kotlin
abstract fun setGlobalScope(key: String, globalScope: GlobalScope)
```

Set a scope to be globally allowed, denied, or deferred to the block-level.

### setHighlightingEnabled

```kotlin
abstract fun setHighlightingEnabled(block: DesignBlock, enabled: Boolean)
```

Enable or disable selection and hover highlighting for a block.

### setMovementConstraint

```kotlin
abstract fun setMovementConstraint(rule: MovementConstraintRule)
```

```kotlin
abstract fun setMovementConstraint(rules: List<MovementConstraintRule>)
```

Set a rule that limits how far blocks can be positioned outside their parent page during user interactions (drag, resize, touch gestures, crop). Programmatic API calls are not affected. MovementConstraintRule.overshoot is a non-negative fraction of the moved block's own size: 0f pins blocks fully inside the page, 0.3f allows 30% to extend past the page bounds. The rule's MovementConstraintRule.scope determines which blocks it applies to.

### setRole

```kotlin
abstract fun setRole(role: String)
```

Set the role of the user and apply role-dependent defaults for scopes and settings

### setSelectedVectorNodeMirrorMode

```kotlin
abstract fun setSelectedVectorNodeMirrorMode(mode: Int)
```

Set the bezier handle mirror mode for the currently selected vector node. Mirror modes control how the opposite handle behaves when one handle is dragged:

### setSelectionEnabled

```kotlin
abstract fun setSelectionEnabled(block: DesignBlock, enabled: Boolean)
```

Enable or disable selection for a block.

### setSettingBoolean

```kotlin
abstract fun setSettingBoolean(keypath: String, value: Boolean)
```

Set a boolean setting.

### setSettingColor

```kotlin
abstract fun setSettingColor(keypath: String, value: RGBAColor)
```

Set a color setting.

### setSettingEnum

```kotlin
abstract fun setSettingEnum(keypath: String, value: String)
```

Set an enum setting.

### setSettingFloat

```kotlin
abstract fun setSettingFloat(keypath: String, value: Float)
```

Set a float setting.

### setSettingInt

```kotlin
abstract fun setSettingInt(keypath: String, value: Int)
```

Set an integer setting.

### setSettingString

```kotlin
abstract fun setSettingString(keypath: String, value: String)
```

Set a string setting.

### setSpotColor

```kotlin
abstract fun setSpotColor(name: String, color: RGBAColor)
```

```kotlin
abstract fun setSpotColor(name: String, color: CMYKColor)
```

Sets the RGB representation of a spot color. Use this function to both create a new spot color or update an existing spot color. Note: The alpha value is ignored.

### setUriResolverAsync

```kotlin
abstract fun setUriResolverAsync(resolver: suspend (Uri) -> Uri?)
```

Sets a custom async Uri resolver. This method can be called more than once. Subsequent calls will overwrite previous calls. To remove a previously set resolver, pass the value null. The resolver is invoked on the Engine thread. Avoid blocking; for I/O, switch contexts (e.g. withContext(Dispatchers.IO)).

### setUriResolver

```kotlin
abstract fun setUriResolver(resolver: (Uri) -> Uri?)
```

Sets a custom Uri resolver. This method can be called more than once. Subsequent calls will overwrite previous calls. To remove a previously set resolver, pass the value null. Note: The given function must return an absolute path with a scheme.

### setVectorEditAddMode

```kotlin
abstract fun setVectorEditAddMode(active: Boolean)
```

Enable or disable add mode for vector editing. When add mode is active, clicking on a path segment inserts a new anchor point at the click position. Mutually exclusive with bend and delete modes.

### setVectorEditBendMode

```kotlin
abstract fun setVectorEditBendMode(active: Boolean)
```

Enable or disable bend mode for vector editing. When bend mode is active, clicking an anchor node automatically toggles it between smooth (bezier handles) and corner (no handles).

### setVectorEditDeleteMode

```kotlin
abstract fun setVectorEditDeleteMode(active: Boolean)
```

Enable or disable delete mode for vector editing. When delete mode is active, clicking an anchor node instantly deletes it from the path. Mutually exclusive with bend and add modes.

### startAudioOutputDevice

```kotlin
abstract fun startAudioOutputDevice()
```

Start the audio output device. Usually not needed as the device will automatically start when a block is set to playing. Useful to call when the app is resumed and you want to ensure audio playback is resumed as well. Can also be used to manually start the audio output device, e.g., before a recording.

### supportsP3

```kotlin
abstract fun supportsP3(): Boolean
```

Returns whether the engine supports displaying and working in the P3 color space on the current device. If supported, the engine can be switched to a P3 color space using the "features/p3WorkingColorSpace" setting.

### toggleSelectedVectorNodeSmooth

```kotlin
abstract fun toggleSelectedVectorNodeSmooth()
```

Toggle the currently selected vector node between smooth (bezier handles) and corner (no handles).

### undo

```kotlin
abstract fun undo()
```

Undo one step in the history if an undo step is available.

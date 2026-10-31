# SceneApi

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

```kotlin
interface SceneApi
```


## Members

### addMarker

```kotlin
abstract fun addMarker(name: String, time: Double, duration: Double = 0.0)
```

Add a marker to the end of the current scene's marker list. Markers name points or spans on the scene timeline. Several markers may share a name. Experimental: this API may change in a minor release.

### applyTemplate

```kotlin
abstract suspend fun applyTemplate(template: String)
```

```kotlin
abstract suspend fun applyTemplate(templateUri: Uri)
```

Applies the contents of the given template scene to the currently loaded scene. This loads the template scene while keeping the design unit and page dimensions of the current scene. The content of the pages is automatically adjusted to fit the new dimensions.

### createForVideo

```kotlin
abstract fun createForVideo(): DesignBlock
```

Create a new scene in video mode, along with its own camera.

### createFromImage

```kotlin
abstract suspend fun createFromImage(imageUri: Uri, dpi: Float = 300.0f, pixelScaleFactor: Float = 1.0f, sceneLayout: SceneLayout = SceneLayout.FREE): DesignBlock
```

Loads the given image and creates a scene with a single page showing the image. Fetching the image may take an arbitrary amount of time, so the scene isn't immediately available. Cancelling the coroutine stops the download, and the current scene stays.

### createFromVideo

```kotlin
abstract suspend fun createFromVideo(videoUri: Uri): DesignBlock
```

Loads the given video and creates a scene with a single page showing the video. Fetching the video may take an arbitrary amount of time, so the scene isn't immediately available. Cancelling the coroutine stops the download, and the current scene stays.

### create

```kotlin
abstract fun create(sceneLayout: SceneLayout = SceneLayout.FREE): DesignBlock
```

```kotlin
abstract fun create(designUnit: DesignUnit, fontSizeUnit: FontUnit? = null, sceneLayout: SceneLayout = SceneLayout.FREE): DesignBlock
```

Create a new scene, along with its own camera.

### disableCameraPositionClamping

```kotlin
abstract fun disableCameraPositionClamping()
```

Disables any previously set position clamping for the current scene.

### disableCameraZoomClamping

```kotlin
abstract fun disableCameraZoomClamping()
```

Disables previously set zoom clamping for the current scene.

### disableZoomAutoFit

```kotlin
abstract fun disableZoomAutoFit(block: DesignBlock)
```

Disables any previously set zoom auto-fit.

### enableCameraPositionClamping

```kotlin
abstract fun enableCameraPositionClamping(blocks: List<DesignBlock>, paddingLeft: Float = 0.0f, paddingTop: Float = 0.0f, paddingRight: Float = 0.0f, paddingBottom: Float = 0.0f, scaledPaddingLeft: Float = 0.0f, scaledPaddingTop: Float = 0.0f, scaledPaddingRight: Float = 0.0f, scaledPaddingBottom: Float = 0.0f)
```

Continually ensures the camera position to be within the width and height of the blocks axis-aligned bounding box. Without padding, this results in a tight clamp on the blocks. Disables any previously set camera position clamping in the scene and also takes priority over clamp camera commands.

### enableCameraZoomClamping

```kotlin
abstract fun enableCameraZoomClamping(blocks: List<DesignBlock>, minZoomLimit: Float = -1.0F, maxZoomLimit: Float = -1.0F, paddingLeft: Float = 0.0f, paddingTop: Float = 0.0f, paddingRight: Float = 0.0f, paddingBottom: Float = 0.0f)
```

Continually ensures the zoom level of the camera in the active scene to be in the given range.

### enableZoomAutoFit

```kotlin
abstract fun enableZoomAutoFit(block: DesignBlock, axis: ZoomAutoFitAxis, paddingLeft: Float = 0.0f, paddingTop: Float = 0.0f, paddingRight: Float = 0.0f, paddingBottom: Float = 0.0f)
```

Continually adjusts the zoom level to fit the width or height of a block's axis-aligned bounding box. This only shows an effect if the zoom level is not handled/overwritten by the UI. Without padding, this results in a tight view on the block. No more than one block per scene can have zoom auto-fit enabled. Calling setZoomLevel or zoomToBlock disables the continuous adjustment.

### findNearestToViewPortCenterByKind

```kotlin
abstract fun findNearestToViewPortCenterByKind(blockKind: String): List<DesignBlock>
```

Finds all blocks with the given kind sorted by distance to viewport center.

### findNearestToViewPortCenterByType

```kotlin
abstract fun findNearestToViewPortCenterByType(blockType: DesignBlockType): List<DesignBlock>
```

```kotlin
abstract fun findNearestToViewPortCenterByType(blockType: String): List<DesignBlock>
```
> **Deprecated:** Use type safe overload instead. Replace with `this.findNearestToViewPortCenterByType(DesignBlockType.)`.

Finds all blocks with the given type sorted by distance to viewport center.

### getCMYKProfileInfo

```kotlin
abstract fun getCMYKProfileInfo(): CMYKProfileInfo
```
> **Deprecated:** Use getDocumentColorProfileInfo with Default/CMYK instead. Replace with `import ly.img.engine.ProfileSlot import ly.img.engine.ProfileRole import ly.img.engine.ProfileColorSpace; getDocumentColorProfileInfo(ProfileSlot(ProfileRole.DEFAULT, ProfileColorSpace.CMYK))`.

What the document stores about its CMYK profile. Reports the profile that the document names, whether it is loaded, still loading, or failed to load. The fallback profile is not reported. Await EditorApi.loadColorProfiles to learn whether the profile that renders is usable.

### getColorRenderingIntent

```kotlin
abstract fun getColorRenderingIntent(): ColorRenderingIntent
```

How a color that the destination cannot reproduce is mapped into it.

### getCurrentPage

```kotlin
abstract fun getCurrentPage(): DesignBlock?
```

Get the current page, i.e., the page of the first selected element if this page is at least 25% visible or, otherwise, the page nearest to the viewport center.

### getCurrentPages

```kotlin
abstract fun getCurrentPages(): List<DesignBlock>
```

Get the pages that single page mode shows.

### getDesignUnit

```kotlin
abstract fun getDesignUnit(): DesignUnit
```

Returns the design unit of the current scene.

### getDocumentColorProfileInfo

```kotlin
abstract fun getDocumentColorProfileInfo(slot: ProfileSlot): DocumentColorProfileInfo
```

Returns a slot's reference without loading it. Fallback profiles are not reported.

### getFontSizeUnit

```kotlin
abstract fun getFontSizeUnit(): FontUnit
```

Returns the font-size unit of the current scene.

### getLayout

```kotlin
abstract fun getLayout(): SceneLayout
```

Get the current scene layout.

### getMarkers

```kotlin
abstract fun getMarkers(): List<SceneMarker>
```

Get the markers of the current scene in the order they were added. Experimental: this API may change in a minor release.

### getMode

```kotlin
abstract fun getMode(): SceneMode
```
> **Deprecated:** Method will be removed in future versions.

Get the current scene mode.

### getPages

```kotlin
abstract fun getPages(): List<DesignBlock>
```

Get the sorted list of pages in the scene.

### getZoomLevel

```kotlin
abstract fun getZoomLevel(): Float
```

Get the zoom level of the scene or for a camera in the scene. Returns the current zoom level of the scene in unit dpx/dot. A zoom level of 2F results in one dot in the design to be two pixels on the screen.

### get

```kotlin
abstract fun get(): DesignBlock?
```

Return the currently active scene.

### immediateZoomToBlock

```kotlin
abstract fun immediateZoomToBlock(block: DesignBlock, paddingLeft: Float = 0.0f, paddingTop: Float = 0.0f, paddingRight: Float = 0.0f, paddingBottom: Float = 0.0f, forceUpdate: Boolean = false)
```

Sets the zoom and focus to show a block. This only shows an effect if the zoom level is not handled/overwritten by the UI. Without padding, this results in a tight view on the block. It is set immediately and assumes that the block dimensions are known. The block should not be in pending state and it's layout should be up to date.

### isBlackPointCompensationEnabled

```kotlin
abstract fun isBlackPointCompensationEnabled(): Boolean
```

Whether conversion maps the black point of the source onto the destination.

### isCameraPositionClampingEnabled

```kotlin
abstract fun isCameraPositionClampingEnabled(blockOrScene: DesignBlock): Boolean
```

Queries whether position clamping is enabled for blockOrScene.

### isCameraZoomClampingEnabled

```kotlin
abstract fun isCameraZoomClampingEnabled(blockOrScene: DesignBlock): Boolean
```

Queries whether zoom clamping is enabled.

### isZoomAutoFitEnabled

```kotlin
abstract fun isZoomAutoFitEnabled(block: DesignBlock): Boolean
```

Queries whether zoom auto-fit is enabled for block.

### loadArchive

```kotlin
abstract suspend fun loadArchive(archiveUri: Uri, overrideEditorConfig: Boolean = false, waitForResources: Boolean = false, onProgress: ((Int) -> Unit)? = null): DesignBlock
```

Load the contents of a scene previously saved as an archive. Cancelling the coroutine stops the download, and the current scene stays.

### load

```kotlin
abstract suspend fun load(scene: String, overrideEditorConfig: Boolean = false, waitForResources: Boolean = false, onProgress: ((Int) -> Unit)? = null): DesignBlock
```

```kotlin
abstract suspend fun load(sceneUri: Uri, overrideEditorConfig: Boolean = false, waitForResources: Boolean = false, onProgress: ((Int) -> Unit)? = null): DesignBlock
```

Load the contents of a scene file.

### onActiveChanged

```kotlin
abstract fun onActiveChanged(): Flow<Unit>
```

Subscribe to changes to be called whenever the active scene changes. This may happen upon scene load or creation of a new scene.

### onZoomLevelChanged

```kotlin
abstract fun onZoomLevelChanged(): Flow<Unit>
```

Subscribe to changes to the zoom level.

### removeCMYKProfile

```kotlin
abstract fun removeCMYKProfile()
```
> **Deprecated:** Use removeDocumentColorProfile with Default/CMYK instead. Replace with `import ly.img.engine.ProfileSlot import ly.img.engine.ProfileRole import ly.img.engine.ProfileColorSpace; removeDocumentColorProfile(ProfileSlot(ProfileRole.DEFAULT, ProfileColorSpace.CMYK))`.

Removes the CMYK profile from the document. CMYK conversion then uses the fallbackCMYKProfileUri setting, or the bundled profile when that setting is unset. Color management stays on. A setCMYKProfile request that is still loading is cancelled.

### removeDocumentColorProfile

```kotlin
abstract fun removeDocumentColorProfile(slot: ProfileSlot)
```

Removes one profile and supersedes its pending assignment. Other slots stay unchanged. Removing Default/CMYK restores fallback resolution. Removing an empty slot succeeds.

### removeMarker

```kotlin
abstract fun removeMarker(index: Int)
```

Remove a marker from the current scene. Experimental: this API may change in a minor release.

### saveToArchive

```kotlin
abstract suspend fun saveToArchive(scene: DesignBlock, options: SaveToArchiveOptions = SaveToArchiveOptions()): ByteBuffer
```

Saves the current scene and all of its referenced assets into an archive. The archive contains all assets, that were accessible when this function was called. Blocks in the archived scene reference assets relative from to the location of the scene file. These references are resolved when loading such a scene via load. While a font loads, its text is laid out with another font. When the text's size follows its content, a scene archived before the font arrives can differ from one archived after it. To compare two archives, first call engine.block.forceLoadResources(listOf(scene)), then compare the scene.scene files inside them. Each archive entry stores the time of the save. forceLoadResource…

### saveToString

```kotlin
abstract suspend fun saveToString(scene: DesignBlock, allowedResourceSchemes: List<String> = listOf("blob", "bundle", "file", "http", "https")): String
```

```kotlin
abstract suspend fun saveToString(scene: DesignBlock, options: SaveToStringOptions): String
```

Serializes the current scene into a string. Selection is discarded. If a resource uri has a scheme that is not in allowedResourceSchemes, an exception will be thrown.

### setBlackPointCompensationEnabled

```kotlin
abstract fun setBlackPointCompensationEnabled(enabled: Boolean)
```

Turns black point compensation of the document on or off. The setting is document state and applies to every conversion from the document CMYK profile. Undo and redo do not change it.

### setCMYKProfileFromData

```kotlin
abstract fun setCMYKProfileFromData(data: ByteBuffer)
```
> **Deprecated:** Use setDocumentColorProfileFromData with Default/CMYK instead. Replace with `import ly.img.engine.ProfileSlot import ly.img.engine.ProfileRole import ly.img.engine.ProfileColorSpace; setDocumentColorProfileFromData(ProfileSlot(ProfileRole.DEFAULT, ProfileColorSpace.CMYK), data)`.

Makes the ICC profile in data the CMYK profile of the document. Assigns to the slot with role Default and color space CMYK. Works like setCMYKProfile, but the change is in effect when the call returns. The engine keeps one buffer per distinct profile for its lifetime. SceneApi.saveToString stores this profile as a buffer:// URI that only this engine can read. Save to an archive to keep the profile bytes with the scene.

### setCMYKProfile

```kotlin
abstract suspend fun setCMYKProfile(uri: Uri)
```
> **Deprecated:** Use setDocumentColorProfile with Default/CMYK instead. Replace with `import ly.img.engine.ProfileSlot import ly.img.engine.ProfileRole import ly.img.engine.ProfileColorSpace; setDocumentColorProfile(ProfileSlot(ProfileRole.DEFAULT, ProfileColorSpace.CMYK), uri)`.

Loads the ICC profile at uri and makes it the CMYK profile of the document. Assigns to the slot with role Default and color space CMYK. The profile is document state: it is saved with the scene and bundled into an archive. It converts CMYK colors, the CMYK approximations of spot colors, and CMYK images without an embedded profile, while scene/colorConversionMode is Managed. An image with its own profile keeps using that profile.

### setColorRenderingIntent

```kotlin
abstract fun setColorRenderingIntent(intent: ColorRenderingIntent)
```

Sets how a color that the destination cannot reproduce is mapped into it. The intent is document state and applies to every conversion from the document CMYK profile. Undo and redo do not change it.

### setCurrentPages

```kotlin
abstract fun setCurrentPages(pages: List<DesignBlock>)
```

Set the pages that single page mode shows. All other pages leave the view but stay in the document and in the saved file. Takes visible effect while the setting features/singlePageModeEnabled is enabled. Exporting a page holds that page, even while it is out of view. Exporting a scene holds every page, except pages hidden with setVisible.

### setDesignUnit

```kotlin
abstract fun setDesignUnit(designUnit: DesignUnit)
```

Converts all values of the current scene into the given design unit.

### setDocumentColorProfileFromData

```kotlin
abstract fun setDocumentColorProfileFromData(slot: ProfileSlot, data: ByteBuffer)
```

Assigns ICC bytes synchronously, with the same slots and persistence as setDocumentColorProfile. The engine copies the bytes and keeps one buffer per distinct profile for its lifetime. saveToString stores a buffer URI readable only by this engine; use an archive to retain bytes. To save a URL instead, upload the bytes that findAllTransientResources lists and call relocateResource before saving.

### setDocumentColorProfile

```kotlin
abstract suspend fun setDocumentColorProfile(slot: ProfileSlot, uri: Uri)
```

Assigns an ICC profile to one document role and component space. Profiles save with the scene and are bundled into archives. Only Default/CMYK currently affects managed conversion; other slots store profiles without changing rendering or export. Failure or coroutine cancellation keeps the previous profile. Another assignment or removal in this slot, or scene replacement, supersedes pending loading. Other slots are independent. Undo and redo do not change profiles.

### setFontSizeUnit

```kotlin
abstract fun setFontSizeUnit(fontSizeUnit: FontUnit)
```

Sets the unit in which font sizes for BlockApi.setTextFontSize / BlockApi.getTextFontSizes are interpreted. The engine continues to store font sizes in points internally; this only affects API-boundary interpretation.

### setLayout

```kotlin
abstract fun setLayout(layout: SceneLayout)
```

Set the scene layout. This will handle all necessary conversions including creating or destroying stack blocks and reparenting pages as needed. When transitioning from stack layouts (VerticalStack, HorizontalStack, DepthStack) to Free layout, the global positions of pages are preserved to maintain their visual appearance in the scene.

### setMode

```kotlin
abstract fun setMode(mode: SceneMode)
```

Set the scene mode. Changing the scene mode affects how the engine processes and renders the scene: - Video mode enables timeline-based playback, animations, and audio processing. - Design mode disables playback-related features and uses different color space settings.

### setZoomLevel

```kotlin
abstract fun setZoomLevel(level: Float)
```

Set the zoom level of the scene, e.g., for headless versions. This only shows an effect if the zoom level is not handled/overwritten by the UI. Setting a zoom level of 2F results in one dot in the design to be two pixels on the screen.

### zoomToBlock

```kotlin
abstract suspend fun zoomToBlock(block: DesignBlock, paddingLeft: Float = 0.0f, paddingTop: Float = 0.0f, paddingRight: Float = 0.0f, paddingBottom: Float = 0.0f)
```

Sets the zoom and focus to show a block. Without padding, this results in a tight view on the block. It is set asynchronous to ensure that the block dimensions are known.

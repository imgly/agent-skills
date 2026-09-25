# SceneApi

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

```kotlin
interface SceneApi
```


## Members

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

Loads the given image and creates a scene with a single page showing the image. Fetching the image may take an arbitrary amount of time, so the scene isn't immediately available.

### createFromVideo

```kotlin
abstract suspend fun createFromVideo(videoUri: Uri): DesignBlock
```

Loads the given video and creates a scene with a single page showing the video. Fetching the video may take an arbitrary amount of time, so the scene isn't immediately available.

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

### getCurrentPage

```kotlin
abstract fun getCurrentPage(): DesignBlock?
```

Get the current page, i.e., the page of the first selected element if this page is at least 25% visible or, otherwise, the page nearest to the viewport center.

### getDesignUnit

```kotlin
abstract fun getDesignUnit(): DesignUnit
```

Returns the design unit of the current scene.

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
abstract suspend fun loadArchive(archiveUri: Uri, overrideEditorConfig: Boolean = false, waitForResources: Boolean = false): DesignBlock
```

Load the contents of a scene previously saved as an archive.

### load

```kotlin
abstract suspend fun load(scene: String, overrideEditorConfig: Boolean = false, waitForResources: Boolean = false): DesignBlock
```

```kotlin
abstract suspend fun load(sceneUri: Uri, overrideEditorConfig: Boolean = false, waitForResources: Boolean = false): DesignBlock
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

### saveToArchive

```kotlin
abstract suspend fun saveToArchive(scene: DesignBlock, options: SaveToArchiveOptions = SaveToArchiveOptions()): ByteBuffer
```

Saves the current scene and all of its referenced assets into an archive. The archive contains all assets, that were accessible when this function was called. Blocks in the archived scene reference assets relative from to the location of the scene file. These references are resolved when loading such a scene via load.

### saveToString

```kotlin
abstract suspend fun saveToString(scene: DesignBlock, allowedResourceSchemes: List<String> = listOf("blob", "bundle", "file", "http", "https")): String
```

```kotlin
abstract suspend fun saveToString(scene: DesignBlock, options: SaveToStringOptions): String
```

Serializes the current scene into a string. Selection is discarded. If a resource uri has a scheme that is not in allowedResourceSchemes, an exception will be thrown.

### setDesignUnit

```kotlin
abstract fun setDesignUnit(designUnit: DesignUnit)
```

Converts all values of the current scene into the given design unit.

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

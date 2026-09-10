# BlockApi

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

```kotlin
interface BlockApi
```


## Members

### addImageFileURIToSourceSet

```kotlin
abstract suspend fun addImageFileURIToSourceSet(block: DesignBlock, property: String, uri: String)
```
> **Deprecated:** Use addImageFileUriToSourceSet instead. Replace with `this.addImageFileUriToSourceSet(block, property, uri)`.

Add a source to the sourceSet property of the given block. If there already exists in source set an image with the same width, that existing image will be replaced. If the source set is or gets empty, the crop and content fill mode of the associated block will be set to the default values. Note: This fetches the resource from the given URI to obtain the image dimensions. It is recommended to use setSourceSet if the dimension is known.

### addImageFileUriToSourceSet

```kotlin
abstract suspend fun addImageFileUriToSourceSet(block: DesignBlock, property: String, uri: String)
```

Add a source to the sourceSet property of the given block. If there already exists in source set an image with the same width, that existing image will be replaced. If the source set is or gets empty, the crop and content fill mode of the associated block will be set to the default values. Note: This fetches the resource from the given URI to obtain the image dimensions. It is recommended to use setSourceSet if the dimension is known.

### addVideoFileUriToSourceSet

```kotlin
abstract suspend fun addVideoFileUriToSourceSet(block: DesignBlock, property: String, uri: String)
```

Add a source to the sourceSet property of the given block. If there already exists in source set a video with the same width, that existing video will be replaced. If the source set is or gets empty, the crop and content fill mode of the associated block will be set to the default values. Note: This fetches the resource from the given URI to obtain the video dimensions. It is recommended to use setSourceSet if the dimension is known.

### adjustCropToFillFrame

```kotlin
abstract fun adjustCropToFillFrame(block: DesignBlock, minScaleRatio: Float)
```

Adjust the crop position/scale to at least fill the crop frame. Required scope: "layer/crop"

### alignHorizontally

```kotlin
abstract fun alignHorizontally(blocks: List<DesignBlock>, alignment: HorizontalBlockAlignment)
```

Align multiple blocks vertically within their bounding box or a single block to its parent. Required scope: "layer/move"

### alignVertically

```kotlin
abstract fun alignVertically(blocks: List<DesignBlock>, alignment: VerticalBlockAlignment)
```

Align multiple blocks vertically within their bounding box or a single block to its parent. Required scope: "layer/move"

### appendChild

```kotlin
abstract fun appendChild(parent: DesignBlock, child: DesignBlock)
```

Appends a new or existing child to a block's children. Required scope: "editor/add"

### appendEffect

```kotlin
abstract fun appendEffect(block: DesignBlock, effectBlock: DesignBlock)
```

Inserts an effect at the end of the list of effects. The same effect can appear multiple times in the list and won't be removed if appended again. Required scope: "appearance/effect"

### bringForward

```kotlin
abstract fun bringForward(block: DesignBlock)
```

Updates the sorting order of this block and all of its superjacent siblings so that the given block has a higher sorting order than the next superjacent sibling. If the block is parented to a track, it is first moved up in the hierarchy. Empty tracks and empty groups are passed by.

### bringToFront

```kotlin
abstract fun bringToFront(block: DesignBlock)
```

Updates the sorting order of this block and all of its manually created siblings so that the given block has the highest sorting order. If the block is parented to a track, it is first moved up in the hierarchy.

### canRevertToOriginalRatio

```kotlin
abstract fun canRevertToOriginalRatio(block: DesignBlock): Boolean
```

Query if the given block can be reverted to the intrinsic aspect ratio of its image/video content. Backs the "Original" crop preset (AssetTransformPreset.ContentAspectRatio).

### canToggleBoldFont

```kotlin
abstract fun canToggleBoldFont(block: DesignBlock, from: Int = -1, to: Int = -1): Boolean
```

Returns whether the font weight of the given block can be toggled between bold and normal.

### canToggleItalicFont

```kotlin
abstract fun canToggleItalicFont(block: DesignBlock, from: Int = -1, to: Int = -1): Boolean
```

Returns whether the font style of the given block can be toggled between italic and normal.

### combine

```kotlin
abstract fun combine(blocks: List<DesignBlock>, op: BooleanOperation): DesignBlock
```

Perform a boolean operation on the given blocks. All blocks must be combinable. See isCombinable. The parent, fill and sort order of the new block is that of the prioritized block. When performing a Union, Intersection or XOR, the operation is performed pair-wise starting with the element with the highest sort order. When performing a Difference, the operation is performed pair-wise starting with the element with the lowest sort order. Required scopes: "lifecycle/duplicate", "lifecycle/destroy"

### createAnimation

```kotlin
abstract fun createAnimation(type: AnimationType): DesignBlock
```

Creates a new animation, fails if type is unknown.

### createAudioFromVideo

```kotlin
abstract fun createAudioFromVideo(videoFill: DesignBlock, trackIndex: Int, options: AudioFromVideoOptions = AudioFromVideoOptions()): DesignBlock
```

Create a new audio block by extracting a specific audio track from a video fill block.

### createAudiosFromVideo

```kotlin
abstract fun createAudiosFromVideo(videoFill: DesignBlock, options: AudioFromVideoOptions = AudioFromVideoOptions()): List<DesignBlock>
```

Create multiple audio blocks by extracting all audio tracks from a video fill block.

### createBlur

```kotlin
abstract fun createBlur(type: BlurType): DesignBlock
```

```kotlin
abstract fun createBlur(type: String): DesignBlock
```
> **Deprecated:** Use type safe overload instead. Replace with `this.createBlur(BlurType.)`.

Create a new blur, fails if type is unknown or not a valid blur type.

### createCaptionsFromURI

```kotlin
abstract suspend fun createCaptionsFromURI(uri: String): List<DesignBlock>
```

Creates new caption blocks from the given file.

### createCutoutFromBlocks

```kotlin
abstract fun createCutoutFromBlocks(blocks: List<DesignBlock>, vectorizeDistanceThreshold: Float = 2.0f, simplifyDistanceThreshold: Float = 4.0f, useExistingShapeInformation: Boolean = true): DesignBlock
```

Create a cutout block whose path will be the contour of the given blocks. The cutout path for each block is derived from one of the two ways: - Blocks that have already have a vector path (shapes, SVG-based text or stickers). - Blocks that don't have a vector path are vectorized and then, optionally, simplified to eliminate jaggedness (images).

### createCutoutFromOperation

```kotlin
abstract fun createCutoutFromOperation(blocks: List<DesignBlock>, op: CutoutOperation): DesignBlock
```

Perform a boolean operation on the given Cutout blocks. The cutout offset of the new block is 0. The cutout type of the new block is that of the first block. When performing a CutoutOperation.DIFFERENCE operation, the first block is the block subtracted from.

### createCutoutFromPath

```kotlin
abstract fun createCutoutFromPath(path: String): DesignBlock
```

Create a Cutout block.

### createEffect

```kotlin
abstract fun createEffect(type: EffectType): DesignBlock
```

```kotlin
abstract fun createEffect(type: String): DesignBlock
```
> **Deprecated:** Use type safe overload instead. Replace with `this.createEffect(EffectType.)`.

Create a new effect block, fails if type is unknown or not a valid effect block type.

### createFill

```kotlin
abstract fun createFill(fillType: FillType): DesignBlock
```

```kotlin
abstract fun createFill(fillType: String): DesignBlock
```
> **Deprecated:** Use type safe overload instead. Replace with `this.createFill(FillType.)`.

Create a new fill, fails if type is unknown.

### createShape

```kotlin
abstract fun createShape(type: ShapeType): DesignBlock
```

```kotlin
abstract fun createShape(type: String): DesignBlock
```
> **Deprecated:** Use type safe overload instead. Replace with `this.createShape(ShapeType.)`.

Create a new shape, fails if type is unknown.

### createTransition

```kotlin
abstract fun createTransition(type: TransitionType): DesignBlock
```

Creates a new transition, fails if type is unknown. The created block is standalone until assigned to a clip with setTransition. Once assigned, it is owned by that clip: it is destroyed together with the clip, and the engine also destroys it automatically when the two clips stop being timeline-adjacent on the track (e.g. after a manual gap is introduced).

### create

```kotlin
abstract fun create(blockType: DesignBlockType): DesignBlock
```

```kotlin
abstract fun create(blockType: String): DesignBlock
```
> **Deprecated:** Use type safe overload instead. Replace with `this.create(DesignBlockType.)`.

Create a new block.

### destroy

```kotlin
abstract fun destroy(block: DesignBlock)
```

Destroys a block. Required scope: "lifecycle/destroy"

### distributeHorizontally

```kotlin
abstract fun distributeHorizontally(blocks: List<DesignBlock>)
```

Distribute multiple blocks vertically within their bounding box so that the space between them is even. Required scope: "layer/move"

### distributeVertically

```kotlin
abstract fun distributeVertically(blocks: List<DesignBlock>)
```

Distribute multiple blocks vertically within their bounding box so that the space between them is even. Required scope: "layer/move"

### duplicate

```kotlin
abstract fun duplicate(block: DesignBlock, attachToParent: Boolean = true): DesignBlock
```

Duplicates a block including its children. Required scope: "lifecycle/duplicate" If the block is parented to a track that is set always-on-bottom, the duplicate is inserted in the same track immediately after the block. Otherwise, the duplicate is moved up in the hierarchy.

### enterGroup

```kotlin
abstract fun enterGroup(block: DesignBlock)
```

Changes selection from selected group to a block within that group. Nothing happens if block is not a group. Required scope: "editor/select"

### exitGroup

```kotlin
abstract fun exitGroup(block: DesignBlock)
```

Changes selection from a group's selected block to that group. Nothing happens if block is not a group. Required scope: "editor/select"

### exportVideo

```kotlin
abstract suspend fun exportVideo(block: DesignBlock, timeOffset: Double, duration: Double, mimeType: MimeType, progressCallback: (ExportVideoProgress) -> Unit, options: ExportVideoOptions? = null, onPreExport: suspend Engine.() -> Unit = {}, uriResolver: (suspend (Uri) -> Uri)? = null): ByteBuffer
```

```kotlin
abstract suspend fun exportVideo(blocks: List<DesignBlock>, timeOffset: Double, duration: Double, mimeType: MimeType, progressCallback: (ExportVideoProgress) -> Unit, options: ExportVideoOptions? = null, onPreExport: suspend Engine.() -> Unit = {}, uriResolver: (suspend (Uri) -> Uri)? = null): List<ByteBuffer>
```

Exports a design block as a video file of the given mime type. Note: The export will run across multiple iterations of the update loop. In each iteration a frame is scheduled for encoding. Note: The export happens in a background thread and the Engine instance in the onPreExport lambda is a separate instance and is alive until the suspending function resumes. Use this lambda to configure the background engine for export. If uriResolver is provided it will be set on the background engine before the exported scene is loaded and once more after onPreExport is invoked (so it takes precedence if onPreExport also sets a resolver).

### exportWithColorMask

```kotlin
abstract suspend fun exportWithColorMask(block: DesignBlock, mimeType: MimeType, maskColor: RGBAColor, options: ExportOptions? = null, onPreExport: suspend Engine.() -> Unit = {}, uriResolver: (suspend (Uri) -> Uri)? = null): Pair<ByteBuffer, ByteBuffer>
```

```kotlin
abstract suspend fun exportWithColorMask(blocks: List<DesignBlock>, mimeType: MimeType, maskColor: RGBAColor, options: ExportOptions? = null, onPreExport: suspend Engine.() -> Unit = {}, uriResolver: (suspend (Uri) -> Uri)? = null): List<Pair<ByteBuffer, ByteBuffer>>
```

Exports a design block element as a file of the given mime type. Performs an internal update to resolve the final layout for the blocks. Note: The export happens in a background thread and the Engine instance in the onPreExport lambda is a separate instance and is alive until the suspending function resumes. Use this lambda to configure the background engine for export. If uriResolver is provided it will be set on the background engine before the exported scene is loaded and once more after onPreExport is invoked (so it takes precedence if onPreExport also sets a resolver).

### export

```kotlin
abstract suspend fun export(block: DesignBlock, mimeType: MimeType, options: ExportOptions? = null, progressCallback: ((ExportPdfProgress) -> Unit)? = null, onPreExport: suspend Engine.() -> Unit = {}, uriResolver: (suspend (Uri) -> Uri)? = null): ByteBuffer
```

```kotlin
abstract suspend fun export(blocks: List<DesignBlock>, mimeType: MimeType, options: ExportOptions? = null, progressCallback: ((ExportPdfProgress) -> Unit)? = null, onPreExport: suspend Engine.() -> Unit = {}, uriResolver: (suspend (Uri) -> Uri)? = null): List<ByteBuffer>
```

Exports a design block element as a file of the given mime type. Performs an internal update to resolve the final layout for the blocks. Note: The export happens in a background thread and the Engine instance in the onPreExport lambda is a separate instance and is alive until the suspending function resumes. Use this lambda to configure the background engine for export. If uriResolver is provided it will be set on the background engine before the exported scene is loaded and once more after onPreExport is invoked (so it takes precedence if onPreExport also sets a resolver).

### fillParent

```kotlin
abstract fun fillParent(block: DesignBlock)
```

Resize and position a block to entirely fill its parent block. The crop values of the block, except for the flip and crop rotation, are reset if it can be cropped. If the size of the block's fill is unknown, the content fill mode is changed from Crop to Cover to prevent invalid crop values. Required scope: "layer/move" - "layer/resize"

### findAllMetadata

```kotlin
abstract fun findAllMetadata(block: DesignBlock): List<String>
```

Query all metadata keys that exist on this block.

### findAllPlaceholders

```kotlin
abstract fun findAllPlaceholders(): List<DesignBlock>
```

Return all placeholder blocks in the current scene.

### findAllProperties

```kotlin
abstract fun findAllProperties(block: DesignBlock): List<String>
```

Get all available properties of a block.

### findAllSelected

```kotlin
abstract fun findAllSelected(): List<DesignBlock>
```

Get all currently selected blocks.

### findAllUnused

```kotlin
abstract fun findAllUnused(): List<DesignBlock>
```

Return all blocks that are not attached to any scene. A block is considered unused when it has no path to a scene (no scene reference and no ancestor that belongs to a scene) and is not itself a scene. Generated blocks and render blocks (fills, effects, shapes, blurs) are excluded, matching the behaviour of findAll.

### findAll

```kotlin
abstract fun findAll(): List<DesignBlock>
```

Return all blocks currently known to the engine.

### findByKind

```kotlin
abstract fun findByKind(blockKind: String): List<DesignBlock>
```

Finds all blocks with the given kind.

### findByName

```kotlin
abstract fun findByName(name: String): List<DesignBlock>
```

Finds all blocks with the given name.

### findByType

```kotlin
abstract fun findByType(type: DesignBlockType): List<DesignBlock>
```

```kotlin
abstract fun findByType(type: ShapeType): List<DesignBlock>
```

```kotlin
abstract fun findByType(type: EffectType): List<DesignBlock>
```

```kotlin
abstract fun findByType(type: BlurType): List<DesignBlock>
```

```kotlin
abstract fun findByType(type: String): List<DesignBlock>
```
> **Deprecated:** Use type safe overloads instead. Replace with `this.findByType()`.

Finds all design blocks with the given type.

### flipCropHorizontal

```kotlin
abstract fun flipCropHorizontal(block: DesignBlock)
```

Adjusts the crop in order to flip the content along its own horizontal axis.

### flipCropVertical

```kotlin
abstract fun flipCropVertical(block: DesignBlock)
```

Adjusts the crop in order to flip the content along its own vertical axis.

### forceLoadAVResource

```kotlin
abstract suspend fun forceLoadAVResource(block: DesignBlock)
```

Begins loading the required audio and video resource for the given video fill or audio block. If the resource had been loaded earlier and resulted in an error, it will be reloaded.

### forceLoadResources

```kotlin
abstract suspend fun forceLoadResources(blocks: List<DesignBlock>)
```

Begins loading the resources of the given blocks and their children. If the resource had been loaded earlier and resulted in an error, it will be reloaded. Note: This function is useful for preloading resources before they are needed. Warning: For elements with a source set, all elements in the source set will be loaded.

### generateAudioThumbnailSequence

```kotlin
abstract fun generateAudioThumbnailSequence(block: DesignBlock, samplesPerChunk: Int, timeBegin: Double, timeEnd: Double, numberOfSamples: Int, numberOfChannels: Int): Flow<AudioThumbnailResult>
```

Generate a thumbnail sequence for the given audio block or video fill. A thumbnail in this case is a chunk of samples in the range of 0 to 1. In case stereo data is requested, the samples are interleaved, starting with the left channel. Note: Only one request per block runs at a time. A second request for the same block waits for the first to finish instead of failing. Note: numberOfSamples counts samples per channel, so each emission carries samplesPerChunk * numberOfChannels floats and the last one may be shorter. Note: Collect on the main thread; collection throws otherwise.

### generateVideoThumbnailSequence

```kotlin
abstract fun generateVideoThumbnailSequence(block: DesignBlock, thumbnailHeight: Int, timeBegin: Double, timeEnd: Double, numberOfFrames: Int): Flow<VideoThumbnailResult>
```

Generate a thumbnail sequence for the given video fill or design block. Note: Only one request per block runs at a time. A second request for the same block waits for the first to finish instead of failing. Note: For a video fill, cancelling has no effect once the first frame has been scheduled — the engine still produces the remaining frames. Cancelling the collecting coroutine stops your collector from seeing them. Design block sequences cancel at any time. Note: Collect on the main thread; collection throws otherwise.

### getAVResourceTotalDuration

```kotlin
abstract fun getAVResourceTotalDuration(block: DesignBlock): Double
```

Get the duration in seconds of the video or audio resource that is attached to the given block.

### getAudioInfoFromVideo

```kotlin
abstract fun getAudioInfoFromVideo(videoFill: DesignBlock): List<AudioTrackInfo>
```

Get information about all audio tracks from a video fill block.

### getAudioTrackCountFromVideo

```kotlin
abstract fun getAudioTrackCountFromVideo(videoFill: DesignBlock): Int
```

Get the number of available audio tracks in a video fill block.

### getBackgroundColor

```kotlin
abstract fun getBackgroundColor(block: DesignBlock): RGBAColor
```

Get the background color of the given design block.

### getBlendMode

```kotlin
abstract fun getBlendMode(block: DesignBlock): BlendMode
```

Get the blend mode of the given design block.

### getBlur

```kotlin
abstract fun getBlur(block: DesignBlock): DesignBlock
```

Get the blur block of the given design block.

### getBoolean

```kotlin
abstract fun getBoolean(block: DesignBlock, property: String): Boolean
```

Get the value of a boolean property of the given design block.

### getChildren

```kotlin
abstract fun getChildren(block: DesignBlock): List<DesignBlock>
```

Get all children of the given block. Children are sorted in their rendering order: Last child is rendered in front of other children.

### getColorSpotName

```kotlin
abstract fun getColorSpotName(block: DesignBlock, property: String): String
```
> **Deprecated:** Use getColor instead and read from SpotColor object. Replace with `this.getColor(block, property)`.

Get the spot color name of a color property of the given design block.

### getColorSpotTint

```kotlin
@FloatRange(from = 0.0, to = 1.0)
abstract fun getColorSpotTint(block: DesignBlock, property: String): Float
```
> **Deprecated:** Use getColor instead and read from SpotColor object. Replace with `this.getColor(block, property)`.

Get the spot color tint factor of a color property of the given design block.

### getColor

```kotlin
abstract fun getColor(block: DesignBlock, property: String): Color
```

Get the value of a color property of the given design block.

### getContentFillHorizontalAlignment

```kotlin
abstract fun getContentFillHorizontalAlignment(block: DesignBlock): HorizontalContentFillAlignment
```

Query a block's horizontal content fill alignment.

### getContentFillMode

```kotlin
abstract fun getContentFillMode(block: DesignBlock): ContentFillMode
```

Query a block's content fill mode.

### getContentFillVerticalAlignment

```kotlin
abstract fun getContentFillVerticalAlignment(block: DesignBlock): VerticalContentFillAlignment
```

Query a block's vertical content fill alignment.

### getCropRotation

```kotlin
abstract fun getCropRotation(block: DesignBlock): Float
```

Get the crop rotation of the given design block.

### getCropScaleRatio

```kotlin
abstract fun getCropScaleRatio(block: DesignBlock): Float
```

Get the crop scale ratio of the given design block.

### getCropScaleX

```kotlin
abstract fun getCropScaleX(block: DesignBlock): Float
```

Get the crop scale in x direction of the given design block.

### getCropScaleY

```kotlin
abstract fun getCropScaleY(block: DesignBlock): Float
```

Get the crop scale in y direction of the given design block.

### getCropTranslationX

```kotlin
abstract fun getCropTranslationX(block: DesignBlock): Float
```

Get the crop translation in x direction of the given design block.

### getCropTranslationY

```kotlin
abstract fun getCropTranslationY(block: DesignBlock): Float
```

Get the crop translation in y direction of the given design block.

### getDominantColors

```kotlin
abstract suspend fun getDominantColors(block: DesignBlock, options: DominantColorsOptions = DominantColorsOptions()): List<DominantColor>
```

Extracts the dominant colors from the rendered appearance of a block. Performs an internal update to resolve the final layout for the block. Will not complete as long as assets are in a pending state; asset loading progresses during engine updates. Crops, color adjustments, and effects applied to the block are reflected in the returned palette. Fully or mostly transparent pixels are excluded from the analysis.

### getDouble

```kotlin
abstract fun getDouble(block: DesignBlock, property: String): Double
```

Get the value of a double property of the given design block.

### getDropShadowBlurRadiusX

```kotlin
abstract fun getDropShadowBlurRadiusX(block: DesignBlock): Float
```

Get the drop shadow's blur radius on the x axis of the given design block.

### getDropShadowBlurRadiusY

```kotlin
abstract fun getDropShadowBlurRadiusY(block: DesignBlock): Float
```

Get the drop shadow's blur radius on the y axis of the given design block.

### getDropShadowClip

```kotlin
abstract fun getDropShadowClip(block: DesignBlock): Boolean
```

Get the drop shadow's clipping of the given design block.

### getDropShadowColor

```kotlin
abstract fun getDropShadowColor(block: DesignBlock): Color
```

Get the drop shadow color of the given design block.

### getDropShadowOffsetX

```kotlin
abstract fun getDropShadowOffsetX(block: DesignBlock): Float
```

Get the drop shadow's x offset of the given design block.

### getDropShadowOffsetY

```kotlin
abstract fun getDropShadowOffsetY(block: DesignBlock): Float
```

Get the drop shadow's y offset of the given design block.

### getDuration

```kotlin
abstract fun getDuration(block: DesignBlock): Double
```

Get the playback duration of the given block in seconds. The duration defines for how long the block is active in the scene during playback. Note: The duration is ignored when the scene is not in Video mode.

### getEffects

```kotlin
abstract fun getEffects(block: DesignBlock): List<DesignBlock>
```

Get a list of all effects attached to this block.

### getEnumValues

```kotlin
abstract fun getEnumValues(enumProperty: String): List<String>
```

Get all the possible values of an enum given an enum property.

### getEnum

```kotlin
abstract fun getEnum(block: DesignBlock, property: String): String
```

Get the value of an enum property of the given design block.

### getFillOverprint

```kotlin
abstract fun getFillOverprint(block: DesignBlock): Boolean
```

Query whether the fill of the given design block is marked as overprint.

### getFillSolidColor

```kotlin
abstract fun getFillSolidColor(block: DesignBlock): RGBAColor
```

Get the fill color of the given design block.

### getFill

```kotlin
abstract fun getFill(block: DesignBlock): DesignBlock
```

Returns the block containing the fill properties of the given block.

### getFloat

```kotlin
abstract fun getFloat(block: DesignBlock, property: String): Float
```

Get the value of a float property of the given design block.

### getFrameHeight

```kotlin
abstract fun getFrameHeight(block: DesignBlock): Float
```

Get a block's layout height. The layout height is only available after an internal update loop, which may not happen immediately.

### getFrameWidth

```kotlin
abstract fun getFrameWidth(block: DesignBlock): Float
```

Get a block's layout width. The layout width is only available after an internal update loop, which may not happen immediately.

### getFrameX

```kotlin
abstract fun getFrameX(block: DesignBlock): Float
```

Get a block's layout position on the x-axis. The layout position is only available after an internal update loop, which may not happen immediately.

### getFrameY

```kotlin
abstract fun getFrameY(block: DesignBlock): Float
```

Get a block's layout position on the y-axis. The layout position is only available after an internal update loop, which may not happen immediately.

### getGlobalBoundingBoxHeight

```kotlin
abstract fun getGlobalBoundingBoxHeight(block: DesignBlock): Float
```

Get the height of the block's axis-aligned bounding box in the scene's global coordinate space. The scene's global coordinate space has its origin at the top left.

### getGlobalBoundingBoxWidth

```kotlin
abstract fun getGlobalBoundingBoxWidth(block: DesignBlock): Float
```

Get the width of the block's axis-aligned bounding box in the scene's global coordinate space. The scene's global coordinate space has its origin at the top left.

### getGlobalBoundingBoxX

```kotlin
abstract fun getGlobalBoundingBoxX(block: DesignBlock): Float
```

Get the x position of the block's axis-aligned bounding box in the scene's global coordinate space. The scene's global coordinate space has its origin at the top left.

### getGlobalBoundingBoxY

```kotlin
abstract fun getGlobalBoundingBoxY(block: DesignBlock): Float
```

Get the y position of the block's axis-aligned bounding box in the scene's global coordinate space. The scene's global coordinate space has its origin at the top left.

### getGradientColorStops

```kotlin
abstract fun getGradientColorStops(block: DesignBlock, property: String): List<GradientColorStop>
```

Get the gradient color stops property of the given design block.

### getHeightMode

```kotlin
abstract fun getHeightMode(block: DesignBlock): SizeMode
```

Query a block's mode for its height.

### getHeight

```kotlin
abstract fun getHeight(block: DesignBlock): Float
```

Query a block's height.

### getInAnimation

```kotlin
abstract fun getInAnimation(block: DesignBlock): DesignBlock
```

Get the "in" animation of the given block.

### getInt

```kotlin
abstract fun getInt(block: DesignBlock, property: String): Int
```

Get the value of an int property of the given design block.

### getKind

```kotlin
abstract fun getKind(block: DesignBlock): String
```

Get the kind of the given block, fails if the block is invalid.

### getLoopAnimation

```kotlin
abstract fun getLoopAnimation(block: DesignBlock): DesignBlock
```

Get the "loop" animation of the given block.

### getMetadata

```kotlin
abstract fun getMetadata(block: DesignBlock, key: String): String
```

Get a metadata value of a block identified by a key. If the key does not exist, yet, this method will fail.

### getName

```kotlin
abstract fun getName(block: DesignBlock): String
```

Get a block's name.

### getOpacity

```kotlin
@FloatRange(from = 0.0, to = 1.0)
abstract fun getOpacity(block: DesignBlock): Float
```

Get the opacity of the given design block.

### getOutAnimation

```kotlin
abstract fun getOutAnimation(block: DesignBlock): DesignBlock
```

Gets the "out" animation of the given block.

### getParent

```kotlin
abstract fun getParent(block: DesignBlock): DesignBlock?
```

Query a block's parent.

### getPlaybackSpeed

```kotlin
abstract fun getPlaybackSpeed(block: DesignBlock): Float
```

Gets the playback speed multiplier of a block that supports playback control.

### getPlaybackTime

```kotlin
abstract fun getPlaybackTime(block: DesignBlock): Double
```

Get the playback time of the given block.

### getPositionXMode

```kotlin
abstract fun getPositionXMode(block: DesignBlock): PositionMode
```

Query a block's mode for its x position.

### getPositionX

```kotlin
abstract fun getPositionX(block: DesignBlock): Float
```

Query a block's x position.

### getPositionYMode

```kotlin
abstract fun getPositionYMode(block: DesignBlock): PositionMode
```

Query a block's mode for its y position.

### getPositionY

```kotlin
abstract fun getPositionY(block: DesignBlock): Float
```

Query a block's y position.

### getPropertyType

```kotlin
abstract fun getPropertyType(property: String): PropertyType
```

Get the type of a property given its name.

### getRotation

```kotlin
abstract fun getRotation(block: DesignBlock): Float
```

Query a block's rotation in radians.

### getScreenSpaceBoundingBoxRect

```kotlin
abstract fun getScreenSpaceBoundingBoxRect(blocks: List<DesignBlock>): RectF
```

Get the position and size of the axis-aligned bounding box for the given blocks in screen space.

### getShape

```kotlin
abstract fun getShape(block: DesignBlock): DesignBlock
```

Returns the block containing the shape properties of the given block.

### getSourceSet

```kotlin
abstract fun getSourceSet(block: DesignBlock, property: String): List<Source>
```

Returns the source set of a source set property of the given block.

### getSpotColorForCutoutType

```kotlin
abstract fun getSpotColorForCutoutType(type: CutoutType): String
```

Get the name of the spot color assigned to a cutout type.

### getState

```kotlin
abstract fun getState(block: DesignBlock): BlockState
```

Get the current state of a block. Note If this block is in error state or this block has a Shape block, Fill block or Effect block(s), that is in error state, the returned state will be BlockState.Error. Else, if this block is in pending state or this block has a Shape block, Fill block or Effect block(s), that is in pending state, the returned state will be BlockState.Pending. Else, the returned state will be BlockState.Ready.

### getString

```kotlin
abstract fun getString(block: DesignBlock, property: String): String
```

Get the value of a string property of the given design block.

### getStrokeCap

```kotlin
abstract fun getStrokeCap(block: DesignBlock): StrokeCap
```
> **Deprecated:** Use getStrokeStartCap and getStrokeEndCap instead. Replace with `getStrokeStartCap(block)`.

Get the legacy single stroke cap of the given design block. Tracks the value last written via setStrokeCap or setStrokeStartCap; ignores changes made via setStrokeEndCap.

### getStrokeColor

```kotlin
abstract fun getStrokeColor(block: DesignBlock): Color
```

Get the stroke color of the given design block.

### getStrokeCornerGeometry

```kotlin
abstract fun getStrokeCornerGeometry(block: DesignBlock): StrokeCornerGeometry
```

Get the stroke corner geometry of the given design block.

### getStrokeDashArray

```kotlin
abstract fun getStrokeDashArray(block: DesignBlock): List<Float>
```

Get the custom dash pattern of the given design block's stroke.

### getStrokeDashEndCap

```kotlin
abstract fun getStrokeDashEndCap(block: DesignBlock): StrokeCap
```

Query the cap geometry at the trailing edge of each dash piece.

### getStrokeDashOffset

```kotlin
abstract fun getStrokeDashOffset(block: DesignBlock): Float
```

Get the dash offset of the given design block's stroke.

### getStrokeDashStartCap

```kotlin
abstract fun getStrokeDashStartCap(block: DesignBlock): StrokeCap
```

Query the cap geometry at the leading edge of each dash piece.

### getStrokeEndCap

```kotlin
abstract fun getStrokeEndCap(block: DesignBlock): StrokeCap
```

Query the cap geometry at the end of an open stroked path.

### getStrokeOverprint

```kotlin
abstract fun getStrokeOverprint(block: DesignBlock): Boolean
```

Query whether the stroke of the given design block is marked as overprint.

### getStrokePosition

```kotlin
abstract fun getStrokePosition(block: DesignBlock): StrokePosition
```

Get the stroke position of the given design block.

### getStrokeStartCap

```kotlin
abstract fun getStrokeStartCap(block: DesignBlock): StrokeCap
```

Query the cap geometry at the start of an open stroked path.

### getStrokeStyle

```kotlin
abstract fun getStrokeStyle(block: DesignBlock): StrokeStyle
```

Get the stroke style of the given design block.

### getStrokeWidth

```kotlin
abstract fun getStrokeWidth(block: DesignBlock): Float
```

Get the stroke width of the given design block.

### getTextCases

```kotlin
abstract fun getTextCases(block: DesignBlock, from: Int = -1, to: Int = -1): List<TextCase>
```

Returns the ordered list of text cases of the text in the selected range.

### getTextCharacterInkBoxes

```kotlin
abstract fun getTextCharacterInkBoxes(block: DesignBlock, from: Int = -1, to: Int = -1): List<CharacterInkBox>
```

Returns the tight ink-paint bounding box of each grapheme in the given range. Required scope: "text/character" Each entry corresponds to one grapheme cluster in [from, to). Non-printable graphemes (newlines, zero-width joiners, etc.) yield a zero-rect with the correct baselineY. All coordinates are in global scene space (Y-down).

### getTextColors

```kotlin
abstract fun getTextColors(block: DesignBlock, from: Int = -1, to: Int = -1): List<Color>
```

Returns the ordered unique list of colors of the text in the selected range.

### getTextCursorRange

```kotlin
abstract fun getTextCursorRange(): IntRange?
```

Returns the indices of the selected range of the text block that is currently being edited. If both the start and end index of the returned range have the same value, then the text cursor is positioned at that index.

### getTextDecorations

```kotlin
abstract fun getTextDecorations(block: DesignBlock, from: Int = -1, to: Int = -1): List<TextDecorationConfig>
```

Returns the ordered list of unique text decoration configurations in the selected range.

### getTextEffectiveHorizontalAlignment

```kotlin
abstract fun getTextEffectiveHorizontalAlignment(block: DesignBlock): HorizontalAlignment
```

Gets the effective horizontal alignment of a text block. If the alignment is set to Auto, this returns the resolved alignment (Left or Right) based on the text direction of the first logical run. This never returns 'Auto'.

### getTextFontSizes

```kotlin
abstract fun getTextFontSizes(block: DesignBlock, from: Int = -1, to: Int = -1): List<Float>
```

Returns the ordered unique list of font sizes of the text in the selected range.

### getTextFontStyles

```kotlin
abstract fun getTextFontStyles(block: DesignBlock, from: Int = -1, to: Int = -1): List<FontStyle>
```

Returns the ordered unique list of font styles of the text in the selected range.

### getTextFontWeights

```kotlin
abstract fun getTextFontWeights(block: DesignBlock, from: Int = -1, to: Int = -1): List<FontWeight>
```

Returns the ordered unique list of font weights of the text in the selected range.

### getTextHorizontalAlignment

```kotlin
abstract fun getTextHorizontalAlignment(block: DesignBlock, paragraphIndex: Int = -1): HorizontalAlignment?
```

Returns the paragraph-level horizontal alignment override for a specific paragraph, or the block-level alignment for negative paragraph indices.

### getTextKernings

```kotlin
abstract fun getTextKernings(block: DesignBlock, from: Int = -1, to: Int = -1): List<Float>
```

Returns the unique kerning values across the grapheme range.

### getTextLineBoundingBoxRect

```kotlin
abstract fun getTextLineBoundingBoxRect(block: DesignBlock, index: Int): RectF
```

Returns the bounds of the visible area of the given line of the text block. The values are in the scene's global coordinate space (which has its origin at the top left).

### getTextLineHeight

```kotlin
abstract fun getTextLineHeight(block: DesignBlock, paragraphIndex: Int): Float
```

Returns the line height multiplier for a specific paragraph of a text block. Returns the per-paragraph override if one is set, otherwise returns the block-level lineHeight.

### getTextListLevel

```kotlin
abstract fun getTextListLevel(block: DesignBlock, paragraphIndex: Int): Int
```

Returns the list nesting level for a specific paragraph of a text block.

### getTextListStyle

```kotlin
abstract fun getTextListStyle(block: DesignBlock, paragraphIndex: Int): ListStyle
```

Returns the list style for a specific paragraph of a text block.

### getTextOnPathFlipped

```kotlin
abstract fun getTextOnPathFlipped(block: DesignBlock): Boolean
```

Returns whether text is placed on the opposite side of the baseline path.

### getTextOnPathOffset

```kotlin
abstract fun getTextOnPathOffset(block: DesignBlock): Float
```

Returns the start offset along the baseline path as a proportion of the path length.

### getTextOnPath

```kotlin
abstract fun getTextOnPath(block: DesignBlock): String?
```

Returns the SVG path currently used as the text block's baseline, or null if normal layout is active.

### getTextParagraphIndices

```kotlin
abstract fun getTextParagraphIndices(block: DesignBlock, from: Int = -1, to: Int = -1): List<Int>
```

Returns the 0-based paragraph indices that overlap the given range.

### getTextRuns

```kotlin
abstract fun getTextRuns(block: DesignBlock, from: Int = -1, to: Int = -1): List<TextRunInfo>
```

Returns all text runs within the given range of text. Each run represents a contiguous span of text with uniform formatting. Runs are ordered and together cover the full requested range.

### getTextVisibleLineContent

```kotlin
abstract fun getTextVisibleLineContent(block: DesignBlock, lineIndex: Int): String
```

Returns the text content of the given visible line of the text block.

### getTextVisibleLineCount

```kotlin
abstract fun getTextVisibleLineCount(block: DesignBlock): Int
```

Returns the number of visible lines in the given text block.

### getTimeOffset

```kotlin
abstract fun getTimeOffset(block: DesignBlock): Double
```

Get the time offset of the given block relative to its parent.

### getTotalSceneDuration

```kotlin
abstract fun getTotalSceneDuration(scene: DesignBlock): Double
```
> **Deprecated:** Use getDuration and pass a page block Replace with `this.getDuration(page)`.

Returns the total duration (in seconds) of a scene in video mode. The duration is defined by all blocks in the scene.

### getTransition

```kotlin
abstract fun getTransition(block: DesignBlock): DesignBlock
```

Gets the outgoing transition assigned to a clip.

### getTrimLength

```kotlin
abstract fun getTrimLength(block: DesignBlock): Double
```

Get the trim length of the given block or fill.

### getTrimOffset

```kotlin
abstract fun getTrimOffset(block: DesignBlock): Double
```

Get the trim offset of this block. Note: This requires the video or audio clip to be loaded.

### getType

```kotlin
abstract fun getType(block: DesignBlock): String
```

Get the type of the given block, fails if the block is invalid.

### getTypeface

```kotlin
abstract fun getTypeface(block: DesignBlock): Typeface
```

Returns the typeface property of the text block. Does not return the typefaces of the text runs.

### getTypefaces

```kotlin
abstract fun getTypefaces(block: DesignBlock, from: Int = -1, to: Int = -1): List<Typeface>
```

Returns the typefaces of the text block.

### getUUID

```kotlin
abstract fun getUUID(block: DesignBlock): String
```

Get a block's unique identifier.

### getUri

```kotlin
abstract fun getUri(block: DesignBlock, property: String): Uri
```

Get the value of a uri property of the given design block.

### getVideoHeight

```kotlin
abstract fun getVideoHeight(videoFill: DesignBlock): Int
```

Get the video height in pixels of the video resource that is attached to the given block.

### getVideoWidth

```kotlin
abstract fun getVideoWidth(videoFill: DesignBlock): Int
```

Get the video width in pixels of the video resource that is attached to the given block.

### getVolume

```kotlin
@FloatRange(from = 0.0, to = 1.0)
abstract fun getVolume(block: DesignBlock): Float
```

Get the audio volume of the given block.

### getWidthMode

```kotlin
abstract fun getWidthMode(block: DesignBlock): SizeMode
```

Query a block's mode for its width.

### getWidth

```kotlin
abstract fun getWidth(block: DesignBlock): Float
```

Query a block's width.

### group

```kotlin
abstract fun group(blocks: List<DesignBlock>): DesignBlock
```

Group blocks together.

### hasBackgroundColor

```kotlin
abstract fun hasBackgroundColor(block: DesignBlock): Boolean
```
> **Deprecated:** Use supportsBackgroundColor instead. Replace with `this.supportsBackgroundColor(block)`.

Query if the given block has background color properties.

### hasBlendMode

```kotlin
abstract fun hasBlendMode(block: DesignBlock): Boolean
```
> **Deprecated:** Use supportsBlendMode instead. Replace with `this.supportsBlendMode(block)`.

Query if the given block has a blend mode.

### hasBlur

```kotlin
abstract fun hasBlur(block: DesignBlock): Boolean
```
> **Deprecated:** Use supportsBlur instead. Replace with `this.supportsBlur(block)`.

Checks whether the block supports blur.

### hasContentFillMode

```kotlin
abstract fun hasContentFillMode(block: DesignBlock): Boolean
```
> **Deprecated:** Use supportsContentFillMode instead. Replace with `this.supportsContentFillMode(block)`.

Query if the given block has a content fill mode.

### hasCrop

```kotlin
abstract fun hasCrop(block: DesignBlock): Boolean
```
> **Deprecated:** Use supportsCrop instead. Replace with `this.supportsCrop(block)`.

Query if the given block has crop properties.

### hasDropShadow

```kotlin
abstract fun hasDropShadow(block: DesignBlock): Boolean
```
> **Deprecated:** Use supportsDropShadow instead. Replace with `this.supportsDropShadow(block)`.

Query if the given block has a drop shadow property.

### hasDuration

```kotlin
abstract fun hasDuration(block: DesignBlock): Boolean
```
> **Deprecated:** Use supportsDuration instead. Replace with `this.supportsDuration(block)`.

Returns whether the block has a duration property.

### hasEffectEnabled

```kotlin
abstract fun hasEffectEnabled(effectBlock: DesignBlock): Boolean
```
> **Deprecated:** Calls to this function can be removed. All effects can be enabled and disabled.

Checks whether an effect block may be enabled and disabled.

### hasEffects

```kotlin
abstract fun hasEffects(block: DesignBlock): Boolean
```
> **Deprecated:** Use supportsEffects instead. Replace with `this.supportsEffects(block)`.

Queries whether the block supports effects.

### hasFill

```kotlin
abstract fun hasFill(block: DesignBlock): Boolean
```
> **Deprecated:** Use supportsFill instead. Replace with `this.supportsFill(block)`.

Query if the given block has fill color properties.

### hasMetadata

```kotlin
abstract fun hasMetadata(block: DesignBlock, key: String): Boolean
```

Check if the block has metadata associated with the key.

### hasOpacity

```kotlin
abstract fun hasOpacity(block: DesignBlock): Boolean
```
> **Deprecated:** Use supportsOpacity instead. Replace with `this.supportsOpacity(block)`.

Query if the given block has an opacity.

### hasPlaceholderBehavior

```kotlin
abstract fun hasPlaceholderBehavior(block: DesignBlock): Boolean
```
> **Deprecated:** Use supportsPlaceholderBehavior instead. Replace with `this.supportsPlaceholderBehavior(block)`.

Query whether the block supports placeholder behavior.

### hasPlaceholderControls

```kotlin
abstract fun hasPlaceholderControls(block: DesignBlock): Boolean
```
> **Deprecated:** Use supportsPlaceholderControls instead. Replace with `this.supportsPlaceholderControls(block)`.

Checks whether the block supports placeholder controls.

### hasPlaybackControl

```kotlin
abstract fun hasPlaybackControl(block: DesignBlock): Boolean
```
> **Deprecated:** Use supportsPlaybackControl instead. Replace with `this.supportsPlaybackControl(block)`.

Returns whether the block supports a playback control.

### hasPlaybackTime

```kotlin
abstract fun hasPlaybackTime(block: DesignBlock): Boolean
```
> **Deprecated:** Use supportsPlaybackTime instead. Replace with `this.supportsPlaybackTime(block)`.

Returns whether the block has a playback time property.

### hasShape

```kotlin
abstract fun hasShape(block: DesignBlock): Boolean
```
> **Deprecated:** Use supportsShape instead. Replace with `this.supportsShape(block)`.

Query if the given block has a shape property.

### hasStroke

```kotlin
abstract fun hasStroke(block: DesignBlock): Boolean
```
> **Deprecated:** Use supportsStroke instead. Replace with `this.supportsStroke(block)`.

Query if the given block has a stroke property.

### hasTimeOffset

```kotlin
abstract fun hasTimeOffset(block: DesignBlock): Boolean
```
> **Deprecated:** Use supportsTimeOffset instead. Replace with `this.supportsTimeOffset(block)`.

Returns whether the block has a time offset property.

### hasTrim

```kotlin
abstract fun hasTrim(block: DesignBlock): Boolean
```
> **Deprecated:** Use supportsTrim instead. Replace with `this.supportsTrim(block)`.

Returns whether the block has trim properties.

### insertChild

```kotlin
abstract fun insertChild(parent: DesignBlock, child: DesignBlock, index: Int)
```

Insert a new or existing child at a certain position in the parent's children. Required scope: "editor/add"

### insertEffect

```kotlin
abstract fun insertEffect(block: DesignBlock, effectBlock: DesignBlock, index: Int)
```

Inserts an effect at the given index into the list of effects of the given block. The same effect can appear multiple times in the list and won't be removed if appended again. Required scope: "appearance/effect"

### isAVResourceLoaded

```kotlin
abstract fun isAVResourceLoaded(block: DesignBlock): Boolean
```

Returns whether the audio and video resource for the given video fill or audio block is loaded. Note that the function is unstable and mared with UnstableEngineApi.

### isAlignable

```kotlin
abstract fun isAlignable(blocks: List<DesignBlock>): Boolean
```

Confirms that a given set of blocks can be aligned.

### isAllowedByScope

```kotlin
abstract fun isAllowedByScope(block: DesignBlock, key: String): Boolean
```

Check if a scope is allowed for a given block.

### isAlwaysOnBottom

```kotlin
abstract fun isAlwaysOnBottom(block: DesignBlock): Boolean
```

Query a block's always-on-bottom property.

### isAlwaysOnTop

```kotlin
abstract fun isAlwaysOnTop(block: DesignBlock): Boolean
```

Query a block's always-on-top property.

### isBackgroundColorEnabled

```kotlin
abstract fun isBackgroundColorEnabled(block: DesignBlock): Boolean
```

Query if the background of the given design block is enabled.

### isBlurEnabled

```kotlin
abstract fun isBlurEnabled(block: DesignBlock): Boolean
```

Query if blur is enabled for the given block.

### isClipped

```kotlin
abstract fun isClipped(block: DesignBlock): Boolean
```

Query a block's clipped state. If true, the block should clip

### isCombinable

```kotlin
abstract fun isCombinable(blocks: List<DesignBlock>): Boolean
```

Checks whether blocks could be combined. Only graphics blocks and text blocks can be combined. All blocks must have the "lifecycle/duplicate" scope enabled.

### isCropAspectRatioLocked

```kotlin
abstract fun isCropAspectRatioLocked(block: DesignBlock): Boolean
```

Check if the crop aspect ratio is locked for the given block. When locked, crop handles will maintain the current aspect ratio during resize.

### isDistributable

```kotlin
abstract fun isDistributable(blocks: List<DesignBlock>): Boolean
```

Confirms that a given set of blocks can be distributed.

### isDropShadowEnabled

```kotlin
abstract fun isDropShadowEnabled(block: DesignBlock): Boolean
```

Query if the drop shadow of the given design block is enabled.

### isEffectEnabled

```kotlin
abstract fun isEffectEnabled(effectBlock: DesignBlock): Boolean
```

Queries whether an effect block is enabled and therefore applies its effect.

### isFillEnabled

```kotlin
abstract fun isFillEnabled(block: DesignBlock): Boolean
```

Query if the fill of the given design block is enabled.

### isFlipHorizontal

```kotlin
abstract fun isFlipHorizontal(block: DesignBlock): Boolean
```

Query a block's horizontal flip state.

### isFlipVertical

```kotlin
abstract fun isFlipVertical(block: DesignBlock): Boolean
```

Query a block's vertical flip state.

### isForceMuted

```kotlin
abstract fun isForceMuted(block: DesignBlock): Boolean
```

Query whether the block is muted due to engine constraints.

### isGroupable

```kotlin
abstract fun isGroupable(blocks: List<DesignBlock>): Boolean
```

Confirms that a given set of blocks can be grouped together.

### isIncludedInExport

```kotlin
abstract fun isIncludedInExport(block: DesignBlock): Boolean
```

Query if the given block is included on the exported result.

### isLineOrigin

```kotlin
abstract fun isLineOrigin(block: DesignBlock): Boolean
```

Checks whether a graphic block originated as a line shape. Returns true for line graphics in their original line state, and continues to return true after the user enters vector-edit mode (the underlying shape becomes a generic vector path, but the graphic itself is still the same line-derived block). The flag only resets to false when the shape is replaced by a non-line shape via setShape.

### isLooping

```kotlin
abstract fun isLooping(block: DesignBlock): Boolean
```

Query whether the block is looping.

### isMuted

```kotlin
abstract fun isMuted(block: DesignBlock): Boolean
```

Query whether the block is muted.

### isPageDurationSource

```kotlin
abstract fun isPageDurationSource(block: DesignBlock): Boolean
```

Returns whether the block is a duration source block.

### isPlaceholderBehaviorEnabled

```kotlin
abstract fun isPlaceholderBehaviorEnabled(block: DesignBlock): Boolean
```

Query whether the placeholder behavior for a block is enabled.

### isPlaceholderControlsButtonEnabled

```kotlin
abstract fun isPlaceholderControlsButtonEnabled(block: DesignBlock): Boolean
```

Query whether the placeholder button for a block is shown.

### isPlaceholderControlsOverlayEnabled

```kotlin
abstract fun isPlaceholderControlsOverlayEnabled(block: DesignBlock): Boolean
```

Query whether the placeholder overlay pattern for a block is shown.

### isPlaceholderEnabled

```kotlin
abstract fun isPlaceholderEnabled(block: DesignBlock): Boolean
```

Query whether the placeholder function for a block is enabled.

### isPlaying

```kotlin
abstract fun isPlaying(block: DesignBlock): Boolean
```

Returns whether the block is currently during active playback.

### isPropertyReadable

```kotlin
abstract fun isPropertyReadable(property: String): Boolean
```

Check if a property with a given name is readable.

### isPropertyWritable

```kotlin
abstract fun isPropertyWritable(property: String): Boolean
```

Check if a property with a given name is writeable.

### isPropertyWriteable

```kotlin
abstract fun isPropertyWriteable(property: String): Boolean
```
> **Deprecated:** Use isPropertyWritable instead. Replace with `this.isPropertyWritable(property)`.

Check if a property with a given name is writeable.

### isScopeEnabled

```kotlin
abstract fun isScopeEnabled(block: DesignBlock, key: String): Boolean
```

Query whether a scope is enabled for a given block.

### isSelected

```kotlin
abstract fun isSelected(block: DesignBlock): Boolean
```

Get the selected state of a block.

### isSoloPlaybackEnabled

```kotlin
abstract fun isSoloPlaybackEnabled(block: DesignBlock): Boolean
```

Return whether the given block or fill is currently set to play its contents while the rest of the scene remains paused.

### isStrokeEnabled

```kotlin
abstract fun isStrokeEnabled(block: DesignBlock): Boolean
```

Query if the stroke of the given design block is enabled.

### isTransformLocked

```kotlin
abstract fun isTransformLocked(block: DesignBlock): Boolean
```

Query a block's transform locked state. If true, the block's transform can't be changed.

### isValid

```kotlin
abstract fun isValid(block: DesignBlock): Boolean
```

Check if a block is valid. A block becomes invalid once it has been destroyed.

### isVisibleAtCurrentPlaybackTime

```kotlin
abstract fun isVisibleAtCurrentPlaybackTime(block: DesignBlock): Boolean
```

Returns whether the block should be visible on the canvas at the current playback time.

### isVisible

```kotlin
abstract fun isVisible(block: DesignBlock): Boolean
```

Query a block's visibility.

### loadFromArchive

```kotlin
abstract suspend fun loadFromArchive(archiveUri: Uri): List<DesignBlock>
```

Loads existing blocks from an archive. The archiveUri should be that of a file previously saved with saveToArchive. The blocks are not attached by default and won't be visible until attached to a page or the scene. The UUID of the loaded blocks is replaced with a new one.

### loadFromString

```kotlin
abstract suspend fun loadFromString(block: String): List<DesignBlock>
```

Loads existing blocks from the given string. The blocks are not attached by default and won't be visible until attached to a page or the scene. The UUID of the loaded blocks is replaced with a new one.

### loadFromURL

```kotlin
abstract suspend fun loadFromURL(url: Uri): List<DesignBlock>
```

Loads existing blocks from a URL. The URL should point to a blocks file within an unzipped archive directory previously saved with saveToArchive. The blocks are not attached by default and won't be visible until attached to a page or the scene. The UUID of the loaded blocks is replaced with a new one.

### onClicked

```kotlin
abstract fun onClicked(): Flow<DesignBlock>
```

Subscribe to block click events. Note: DesignBlock is emitted at the end of the engine update if it has been clicked.

### onSelectionChanged

```kotlin
abstract fun onSelectionChanged(): Flow<Unit>
```

Subscribe to changes in the current set of selected blocks.

### onStateChanged

```kotlin
abstract fun onStateChanged(blocks: List<DesignBlock>): Flow<List<DesignBlock>>
```

Subscribe to changes to the state of a block. Like getState, the state of a block is determined by the state of itself and its Shape, Fill and Effect block(s).

### referencesAnyVariables

```kotlin
abstract fun referencesAnyVariables(block: DesignBlock): Boolean
```

Checks whether the given block references any variables. Doesn't check the block's children.

### removeEffect

```kotlin
abstract fun removeEffect(block: DesignBlock, index: Int)
```

Removes the effect at the given index. Required scope: "appearance/effect"

### removeMetadata

```kotlin
abstract fun removeMetadata(block: DesignBlock, key: String)
```

Remove metadata associated with the key from the given block.

### removePageDurationSource

```kotlin
abstract fun removePageDurationSource(block: DesignBlock)
```

Remove the block as duration source block for the page. If a scene or page given set as block, it is deactivated for all blocks in the scene or page.

### removeText

```kotlin
abstract fun removeText(block: DesignBlock, from: Int = -1, to: Int = -1)
```

Removes selected range of text of the given text block. Required scope: "text/edit"

### removeTransition

```kotlin
abstract fun removeTransition(block: DesignBlock)
```

Removes the outgoing transition of a clip. The removed transition block is detached but not destroyed automatically. Removing from a clip without an assigned transition is a no-op.

### replaceText

```kotlin
abstract fun replaceText(block: DesignBlock, text: String, from: Int = -1, to: Int = -1)
```

Inserts the given text into the selected range of the text block. Required scope: "text/edit"

### resetCrop

```kotlin
abstract fun resetCrop(block: DesignBlock)
```

Resets the manually set crop of the given design block. The block's content fill mode is set to ContentFillMode.COVER. If the block has a fill, the crop values are updated so that it covers the block. Required scope: "layer/crop"

### resizeContentAware

```kotlin
abstract fun resizeContentAware(blocks: List<DesignBlock>, width: Float, height: Float)
```

Resize all blocks to the given size. The content of the blocks is automatically adjusted to fit the new dimensions. Required scope: "layer/resize"

### saveToArchive

```kotlin
abstract suspend fun saveToArchive(blocks: List<DesignBlock>): ByteBuffer
```

Saves the given blocks to an archive. Note: All given block handles must be valid, otherwise this call returns an error.

### saveToString

```kotlin
abstract suspend fun saveToString(blocks: List<DesignBlock>, allowedResourceSchemes: List<String> = listOf("bundle", "file", "http", "https")): String
```

Saves the given blocks to a proprietary string. If a resource uri has a scheme that is not in allowedResourceSchemes, an exception will be thrown. Note: All given block handles must be valid, otherwise an exception will be thrown.

### scale

```kotlin
abstract fun scale(block: DesignBlock, scale: Float, @FloatRange(from = 0.0, to = 1.0)anchorX: Float, @FloatRange(from = 0.0, to = 1.0)anchorY: Float)
```

Scales the block and all of its children proportionally around the specified relative anchor point. This updates the position, size and style properties (e.g. stroke width) of the block and its children. Required scope: "layer/resize"

### select

```kotlin
abstract fun select(block: DesignBlock)
```

Selects the given block and deselects all other blocks.

### sendBackward

```kotlin
abstract fun sendBackward(block: DesignBlock)
```

Updates the sorting order of this block and all of its manually created and subjacent siblings so that the given block will have a lower sorting order than the next subjacent sibling. If the block is parented to a track, it is first moved up in the hierarchy. Empty tracks and empty groups are passed by.

### sendToBack

```kotlin
abstract fun sendToBack(block: DesignBlock)
```

Updates the sorting order of this block and all of its manually created siblings so that the given block has the lowest sorting order. If the block is parented to a track, it is first moved up in the hierarchy.

### setAlwaysOnBottom

```kotlin
abstract fun setAlwaysOnBottom(block: DesignBlock, enabled: Boolean)
```

Update the block's always-on-bottom property. If true, this blocks's global sorting order is automatically adjusted to be lower than all other siblings without this property. If more than one block is set to be always-on-bottom, the child order decides which is on the bottom.

### setAlwaysOnTop

```kotlin
abstract fun setAlwaysOnTop(block: DesignBlock, enabled: Boolean)
```

Update the block's always-on-top property. If true, this blocks's global sorting order is automatically adjusted to be higher than all other siblings without this property. If more than one block is set to be always-on-top, the child order decides which is on top.

### setAudioFadeIn

```kotlin
abstract fun setAudioFadeIn(block: DesignBlock, duration: Double, easing: AnimationEasingType = AnimationEasingType.LINEAR)
```

Set an audio fade-in for the given block. The audio ramps up from silence to the block's volume over the given duration at the start of the block.

### setAudioFadeOut

```kotlin
abstract fun setAudioFadeOut(block: DesignBlock, duration: Double, easing: AnimationEasingType = AnimationEasingType.LINEAR)
```

Set an audio fade-out for the given block. The audio ramps down from the block's volume to silence over the given duration at the end of the block.

### setBackgroundColorEnabled

```kotlin
abstract fun setBackgroundColorEnabled(block: DesignBlock, enabled: Boolean)
```

Enable or disable the background of the given design block. Required scope: "fill/change"

### setBackgroundColor

```kotlin
abstract fun setBackgroundColor(block: DesignBlock, color: RGBAColor)
```

Set the background color of the given design block. Required scope: "fill/change"

### setBlendMode

```kotlin
abstract fun setBlendMode(block: DesignBlock, blendMode: BlendMode)
```

Set the blend mode of the given design block. Required scope: "layer/blendMode"

### setBlurEnabled

```kotlin
abstract fun setBlurEnabled(block: DesignBlock, enabled: Boolean)
```

Enable or disable the blur of the given design block.

### setBlur

```kotlin
abstract fun setBlur(block: DesignBlock, blurBlock: DesignBlock)
```

Connects block's blur to the given blurBlock. Required scope: "appearance/blur"

### setBoolean

```kotlin
abstract fun setBoolean(block: DesignBlock, property: String, value: Boolean)
```

Set a boolean property of the given design block to the given value.

### setClipped

```kotlin
abstract fun setClipped(block: DesignBlock, clipped: Boolean)
```

Update a block's clipped state. Required scope: "layer/clipping"

### setColorSpot

```kotlin
abstract fun setColorSpot(block: DesignBlock, property: String, name: String, @FloatRange(from = 0.0, to = 1.0)tint: Float = 1.0f)
```
> **Deprecated:** Use setColor instead. Replace with `this.setColor(block, property)`.

Set a color property of the given design block to the given value.

### setColor

```kotlin
abstract fun setColor(block: DesignBlock, property: String, value: Color)
```

Set a color property of the given design block to the given value.

### setContentFillHorizontalAlignment

```kotlin
abstract fun setContentFillHorizontalAlignment(block: DesignBlock, alignment: HorizontalContentFillAlignment)
```

Set the horizontal alignment of the content fill inside the block. Only affects ContentFillMode.CONTAIN and ContentFillMode.COVER; has no visible effect in ContentFillMode.CROP, where the user positions the content explicitly. Required scope: "layer/crop"

### setContentFillMode

```kotlin
abstract fun setContentFillMode(block: DesignBlock, mode: ContentFillMode)
```

Set a block's content fill mode. Required scope: "layer/crop"

### setContentFillVerticalAlignment

```kotlin
abstract fun setContentFillVerticalAlignment(block: DesignBlock, alignment: VerticalContentFillAlignment)
```

Set the vertical alignment of the content fill inside the block. Only affects ContentFillMode.CONTAIN and ContentFillMode.COVER; has no visible effect in ContentFillMode.CROP, where the user positions the content explicitly. Required scope: "layer/crop"

### setCropAspectRatioLocked

```kotlin
abstract fun setCropAspectRatioLocked(block: DesignBlock, locked: Boolean)
```

Set whether the crop aspect ratio should be locked for the given block. When enabled, the block will have a FixedAspectRatioTag and crop handles will maintain aspect ratio. When disabled, the FixedAspectRatioTag will be removed and free resizing is allowed. Required scope: "layer/crop"

### setCropRotation

```kotlin
abstract fun setCropRotation(block: DesignBlock, rotation: Float)
```

Set the crop rotation of the given design block. Required scope: "layer/crop"

### setCropScaleRatio

```kotlin
abstract fun setCropScaleRatio(block: DesignBlock, scaleRatio: Float)
```

Set the crop scale ratio of the given design block. This will uniformly scale the content up or down. The center of the scale operation is the center of the crop frame. Required scope: "layer/crop"

### setCropScaleX

```kotlin
abstract fun setCropScaleX(block: DesignBlock, scaleX: Float)
```

Set the crop scale in x direction of the given design block. Required scope: "layer/crop"

### setCropScaleY

```kotlin
abstract fun setCropScaleY(block: DesignBlock, scaleY: Float)
```

Set the crop scale in y direction of the given design block. Required scope: "layer/crop"

### setCropTranslationX

```kotlin
abstract fun setCropTranslationX(block: DesignBlock, translationX: Float)
```

Set the crop translation in x direction of the given design block. Required scope: "layer/crop"

### setCropTranslationY

```kotlin
abstract fun setCropTranslationY(block: DesignBlock, translationY: Float)
```

Set the crop translation in y direction of the given design block. Required scope: "layer/crop"

### setDouble

```kotlin
abstract fun setDouble(block: DesignBlock, property: String, value: Double)
```

Set a double property of the given design block to the given value.

### setDropShadowBlurRadiusX

```kotlin
abstract fun setDropShadowBlurRadiusX(block: DesignBlock, blurRadiusX: Float)
```

Set the drop shadow's blur radius on the x axis of the given design block. Required scope: "appearance/shadow"

### setDropShadowBlurRadiusY

```kotlin
abstract fun setDropShadowBlurRadiusY(block: DesignBlock, blurRadiusY: Float)
```

Set the drop shadow's blur radius on the y axis of the given design block. Required scope: "appearance/shadow"

### setDropShadowClip

```kotlin
abstract fun setDropShadowClip(block: DesignBlock, clip: Boolean)
```

Set the drop shadow's clipping of the given design block. (Only applies to shapes.) Required scope: "appearance/shadow"

### setDropShadowColor

```kotlin
abstract fun setDropShadowColor(block: DesignBlock, color: Color)
```

Set the drop shadow color of the given design block. Required scope: "appearance/shadow"

### setDropShadowEnabled

```kotlin
abstract fun setDropShadowEnabled(block: DesignBlock, enabled: Boolean)
```

Enable or disable the drop shadow of the given design block. Required scope: "appearance/shadow"

### setDropShadowOffsetX

```kotlin
abstract fun setDropShadowOffsetX(block: DesignBlock, offsetX: Float)
```

Set the drop shadow's x offset of the given design block. Required scope: "appearance/shadow"

### setDropShadowOffsetY

```kotlin
abstract fun setDropShadowOffsetY(block: DesignBlock, offsetY: Float)
```

Set the drop shadow's y offset of the given design block. Required scope: "appearance/shadow"

### setDuration

```kotlin
abstract fun setDuration(block: DesignBlock, duration: Double)
```

Set the playback duration of the given block in seconds. The duration defines for how long the block is active in the scene during playback. If a duration is set on the page block, it becomes the duration source block. Note: The duration is ignored when the scene is not in "Video" mode. Note: This also adjusts the trim for non looping blocks.

### setEffectEnabled

```kotlin
abstract fun setEffectEnabled(effectBlock: DesignBlock, enabled: Boolean)
```

Sets the enabled state of an effect block.

### setEnum

```kotlin
abstract fun setEnum(block: DesignBlock, property: String, value: String)
```

Set an enum property of the given design block to the given value.

### setFillEnabled

```kotlin
abstract fun setFillEnabled(block: DesignBlock, enabled: Boolean)
```

Enable or disable the fill of the given design block. Required scope: "fill/change"

### setFillOverprint

```kotlin
abstract fun setFillOverprint(block: DesignBlock, overprint: Boolean)
```

Mark the fill of the given design block as overprint for PDF export. The flag is only honored by the PDF writer when the fill uses a spot color (Separation/DeviceN). For process-color fills it is a silent no-op. On-screen rendering ignores the flag.

### setFillSolidColor

```kotlin
abstract fun setFillSolidColor(block: DesignBlock, color: RGBAColor)
```

Set the fill color of the given design block. Required scope: "fill/change"

### setFill

```kotlin
abstract fun setFill(block: DesignBlock, fill: DesignBlock)
```

Sets the block containing the fill properties of the given block. Note: The previous fill block is not destroyed automatically. Required scopes: "fill/change", "fill/changeType"

### setFlipHorizontal

```kotlin
abstract fun setFlipHorizontal(block: DesignBlock, flip: Boolean)
```

Update a block's horizontal flip. Required scope: "layer/flip"

### setFlipVertical

```kotlin
abstract fun setFlipVertical(block: DesignBlock, flip: Boolean)
```

Update a block's vertical flip. Required scope: "layer/flip"

### setFloat

```kotlin
abstract fun setFloat(block: DesignBlock, property: String, value: Float)
```

Set a float property of the given design block to the given value.

### setFont

```kotlin
abstract fun setFont(block: DesignBlock, fontFileUri: Uri, typeface: Typeface)
```

Sets the given font and typeface for the text block. Existing formatting is reset. Required scope: "text/character"

### setGradientColorStops

```kotlin
abstract fun setGradientColorStops(block: DesignBlock, property: String, colorStops: List<GradientColorStop>)
```

Set a gradient color stops property of the given design block.

### setHeightMode

```kotlin
abstract fun setHeightMode(block: DesignBlock, mode: SizeMode)
```

Set a block's mode for its height. Required scope: "layer/resize"

### setHeight

```kotlin
abstract fun setHeight(block: DesignBlock, value: Float, maintainCrop: Boolean = false)
```

Update a block's height and optionally maintain the crop. If the crop is maintained, the crop values will be automatically adjusted. The content fill mode Cover is only kept if the features/transformEditsRetainCoverMode setting is enabled, otherwise it will change to Crop. If the size of a group is changed, both dimensions are modified and the aspect ratio of the group is kept. Required scope: "layer/resize"

### setInAnimation

```kotlin
abstract fun setInAnimation(block: DesignBlock, animation: DesignBlock)
```

Sets the "in" animation for the given block.

### setIncludedInExport

```kotlin
abstract fun setIncludedInExport(block: DesignBlock, enabled: Boolean)
```

Set if you want the given design block to be included in exported result.

### setInt

```kotlin
abstract fun setInt(block: DesignBlock, property: String, value: Int)
```

Set an int property of the given design block to the given value.

### setKind

```kotlin
abstract fun setKind(block: DesignBlock, kind: String)
```

Set the kind of the given block, fails if the block is invalid.

### setLoopAnimation

```kotlin
abstract fun setLoopAnimation(block: DesignBlock, animation: DesignBlock)
```

Sets the "loop" animation for the given block.

### setLooping

```kotlin
abstract fun setLooping(block: DesignBlock, looping: Boolean)
```

Set whether the block should start from the beginning again or stop.

### setMetadata

```kotlin
abstract fun setMetadata(block: DesignBlock, key: String, value: String)
```

Set a metadata value of a block identified by a key. If the key does not exist, yet, it will be added.

### setMuted

```kotlin
abstract fun setMuted(block: DesignBlock, muted: Boolean)
```

Set whether the audio of the block is muted.

### setName

```kotlin
abstract fun setName(block: DesignBlock, name: String)
```

Update a block's name.

### setNativePixelBuffer

```kotlin
abstract fun setNativePixelBuffer(pixelStreamFill: DesignBlock, width: Int, height: Int): Int
```

Update the pixels of the given pixelStreamFill block. This method should be called in order to bind a new android.graphics.SurfaceTexture to the pixelStreamFill, as well as after every android.graphics.SurfaceTexture.updateTexImage invocation. Note that the native texture is created only once: all subsequent calls on the same pixel stream fill will return the same id.

### setOpacity

```kotlin
abstract fun setOpacity(block: DesignBlock, @FloatRange(from = 0.0, to = 1.0)value: Float)
```

Set the opacity of the given design block. Required scope: "layer/opacity"

### setOutAnimation

```kotlin
abstract fun setOutAnimation(block: DesignBlock, animation: DesignBlock)
```

Sets the "out" animation for the given block.

### setPageDurationSource

```kotlin
abstract fun setPageDurationSource(page: DesignBlock, block: DesignBlock)
```

Set a block as duration source so that the overall page duration is automatically determined by this. If no defining block is set, the page duration is calculated over all children. Only one block per page can be marked as duration source. Will automatically unmark the previously marked. Note: This is only supported for blocks that have a duration.

### setPlaceholderBehaviorEnabled

```kotlin
abstract fun setPlaceholderBehaviorEnabled(block: DesignBlock, enabled: Boolean)
```

Enable or disable the placeholder behavior for a block.

### setPlaceholderControlsButtonEnabled

```kotlin
abstract fun setPlaceholderControlsButtonEnabled(block: DesignBlock, enabled: Boolean)
```

Enable or disable the visibility of the placeholder button for a block.

### setPlaceholderControlsOverlayEnabled

```kotlin
abstract fun setPlaceholderControlsOverlayEnabled(block: DesignBlock, enabled: Boolean)
```

Enable or disable the visibility of the placeholder overlay pattern for a block.

### setPlaceholderEnabled

```kotlin
abstract fun setPlaceholderEnabled(block: DesignBlock, enabled: Boolean)
```

Enable or disable the placeholder function for a block.

### setPlaybackSpeed

```kotlin
abstract fun setPlaybackSpeed(block: DesignBlock, speed: Float)
```

Sets the playback speed multiplier of a block that supports playback control. Note: This also adjusts the trim and duration of the block. Video fills running faster than 3.0x are force muted until reduced to 3.0x or below.

### setPlaybackTime

```kotlin
abstract fun setPlaybackTime(block: DesignBlock, time: Double)
```

Set the playback time of the given block.

### setPlaying

```kotlin
abstract fun setPlaying(block: DesignBlock, enabled: Boolean)
```

Set whether the block should be during active playback.

### setPositionXMode

```kotlin
abstract fun setPositionXMode(block: DesignBlock, mode: PositionMode)
```

Set a block's mode for its x position. The position refers to the block's local space, relative to its parent with the origin at the top left. Required scope: "layer/move"

### setPositionX

```kotlin
abstract fun setPositionX(block: DesignBlock, value: Float)
```

Update a block's x position. The position refers to the block's local space, relative to its parent with the origin at the top left. Required scope: "layer/move"

### setPositionYMode

```kotlin
abstract fun setPositionYMode(block: DesignBlock, mode: PositionMode)
```

Set a block's mode for its y position. The position refers to the block's local space, relative to its parent with the origin at the top left. Required scope: "layer/move"

### setPositionY

```kotlin
abstract fun setPositionY(block: DesignBlock, value: Float)
```

Update a block's y position. The position refers to the block's local space, relative to its parent with the origin at the top left. Required scope: "layer/move"

### setRotation

```kotlin
abstract fun setRotation(block: DesignBlock, radians: Float)
```

Update a block's rotation. Required scope: "layer/rotate"

### setScopeEnabled

```kotlin
abstract fun setScopeEnabled(block: DesignBlock, key: String, enabled: Boolean)
```

Enable or disable a scope for a given block.

### setSelected

```kotlin
abstract fun setSelected(block: DesignBlock, selected: Boolean)
```

Update the selection state of a block. Fails for invalid blocks. Note: Previously selected blocks remain selected. Required scope: "editor/select"

### setShape

```kotlin
abstract fun setShape(block: DesignBlock, shape: DesignBlock)
```

Sets the block containing the shape properties of the given block. Note: The previous shape block is not destroyed automatically. Required scope: "shape/change"

### setSoloPlaybackEnabled

```kotlin
abstract fun setSoloPlaybackEnabled(block: DesignBlock, enabled: Boolean)
```

Set whether the given block or fill should play its contents while the rest of the scene remains paused. Note: Setting this to true for one block will automatically set it to false on all other blocks.

### setSourceSet

```kotlin
abstract fun setSourceSet(block: DesignBlock, property: String, sourceSet: List<Source>)
```

Set the source set of a source set property of the given block. The crop and content fill mode of the associated block will be set to the default values.

### setSpotColorForCutoutType

```kotlin
abstract fun setSpotColorForCutoutType(type: CutoutType, name: String)
```

Set the spot color assign to a cutout type. If no spot color is set, type CutoutType.SOLID is assigned "CutContour" and type CutoutType.DASHED is assigned "PerfCutContour". All cutout blocks of the given type will be immediately assigned that spot color.

### setState

```kotlin
abstract fun setState(block: DesignBlock, state: BlockState)
```

Set the state of a block.

### setString

```kotlin
abstract fun setString(block: DesignBlock, property: String, value: String)
```

Set a string property of the given design block to the given value.

### setStrokeCap

```kotlin
abstract fun setStrokeCap(block: DesignBlock, cap: StrokeCap)
```
> **Deprecated:** Use setStrokeStartCap and setStrokeEndCap to set each end independently. Replace with `setStrokeStartCap(block, cap)`.

Set the stroke cap of the given design block. Writes both the start and end caps to the same value. Required scope: "stroke/change"

### setStrokeColor

```kotlin
abstract fun setStrokeColor(block: DesignBlock, color: Color)
```

Set the stroke color of the given design block. Required scope: "stroke/change"

### setStrokeCornerGeometry

```kotlin
abstract fun setStrokeCornerGeometry(block: DesignBlock, geometry: StrokeCornerGeometry)
```

Set the stroke corner geometry of the given design block. Required scope: "stroke/change"

### setStrokeDashArray

```kotlin
abstract fun setStrokeDashArray(block: DesignBlock, dashArray: List<Float>)
```

Set a custom dash pattern for the given design block's stroke. Semantics match SVG's stroke-dasharray: alternating on/off lengths in design-unit space. When the pattern is non-empty it overrides the preset implied by StrokeStyle. Pass an empty list to fall back to the preset. Required scope: "stroke/change"

### setStrokeDashEndCap

```kotlin
abstract fun setStrokeDashEndCap(block: DesignBlock, cap: StrokeCap)
```

Set the cap geometry at the trailing edge of each dash piece (excluding the line's actual end). Only takes effect when a dash pattern is active. Distinct from setStrokeEndCap, which only applies to the end of the open path itself.

### setStrokeDashOffset

```kotlin
abstract fun setStrokeDashOffset(block: DesignBlock, dashOffset: Float)
```

Set the dash offset of the given design block's stroke. Semantics match SVG's stroke-dashoffset. Ignored when the custom dash pattern is empty. Required scope: "stroke/change"

### setStrokeDashStartCap

```kotlin
abstract fun setStrokeDashStartCap(block: DesignBlock, cap: StrokeCap)
```

Set the cap geometry at the leading edge of each dash piece (excluding the line's actual start). Only takes effect when a dash pattern is active. Distinct from setStrokeStartCap, which only applies to the start of the open path itself.

### setStrokeEnabled

```kotlin
abstract fun setStrokeEnabled(block: DesignBlock, enabled: Boolean)
```

Enable or disable the stroke of the given design block. Required scope: "stroke/change"

### setStrokeEndCap

```kotlin
abstract fun setStrokeEndCap(block: DesignBlock, cap: StrokeCap)
```

Set the cap geometry at the end of an open stroked path.

### setStrokeOverprint

```kotlin
abstract fun setStrokeOverprint(block: DesignBlock, overprint: Boolean)
```

Mark the stroke of the given design block as overprint for PDF export. The flag is only honored by the PDF writer when the stroke uses a spot color (Separation/DeviceN). For process-color strokes it is a silent no-op. On-screen rendering ignores the flag.

### setStrokePosition

```kotlin
abstract fun setStrokePosition(block: DesignBlock, position: StrokePosition)
```

Set the stroke position of the given design block. Required scope: "stroke/change"

### setStrokeStartCap

```kotlin
abstract fun setStrokeStartCap(block: DesignBlock, cap: StrokeCap)
```

Set the cap geometry at the start of an open stroked path. Pair with setStrokeEndCap to set each end independently; setStrokeCap remains as a both-ends shortcut.

### setStrokeStyle

```kotlin
abstract fun setStrokeStyle(block: DesignBlock, style: StrokeStyle)
```

Set the stroke style of the given design block. Required scope: "stroke/change"

### setStrokeWidth

```kotlin
abstract fun setStrokeWidth(block: DesignBlock, width: Float)
```

Set the stroke width of the given design block. Required scope: "stroke/change"

### setTextCase

```kotlin
abstract fun setTextCase(block: DesignBlock, textCase: TextCase, from: Int = -1, to: Int = -1)
```

Sets the given text case for the selected range of text. Required scope: "text/character"

### setTextColor

```kotlin
abstract fun setTextColor(block: DesignBlock, color: Color, from: Int = -1, to: Int = -1)
```

Changes the color of the text in the selected range to the given color. Required scope: "fill/change"

### setTextCursorRange

```kotlin
abstract fun setTextCursorRange(range: IntRange)
```

Sets the text cursor range (selection) within the text block that is currently being edited. If from equals to, the cursor is positioned at that index.

### setTextDecoration

```kotlin
abstract fun setTextDecoration(block: DesignBlock, config: TextDecorationConfig, from: Int = -1, to: Int = -1)
```

Sets the text decoration for the selected range of text. Required scope: "text/character"

### setTextFontSize

```kotlin
abstract fun setTextFontSize(block: DesignBlock, fontSize: Float, from: Int = -1, to: Int = -1)
```

Changes the size of the text in the selected range to the given size. If the font size is applied to the entire text block, its font size property will be updated. Required scope: "text/character"

### setTextFontStyle

```kotlin
abstract fun setTextFontStyle(block: DesignBlock, fontStyle: FontStyle, from: Int = -1, to: Int = -1)
```

Changes the style of the text in the selected range to the given style. Required scope: "text/character"

### setTextFontWeight

```kotlin
abstract fun setTextFontWeight(block: DesignBlock, fontWeight: FontWeight, from: Int = -1, to: Int = -1)
```

Changes the weight of the text in the selected range to the given weight. Required scope: "text/character"

### setTextHorizontalAlignment

```kotlin
abstract fun setTextHorizontalAlignment(block: DesignBlock, alignment: HorizontalAlignment?, paragraphIndex: Int = -1)
```

Sets the paragraph-level horizontal alignment override for one or all paragraphs of a text block. Required scope: "text/character"

### setTextKerning

```kotlin
abstract fun setTextKerning(block: DesignBlock, kerning: Float, from: Int = -1, to: Int = -1)
```

Sets kerning for a grapheme range. Applies an additional offset in em units on top of the font's built-in kern. 1.0 equals the run's font size, so the offset scales proportionally with text size. Required scope: "text/character"

### setTextLineHeight

```kotlin
abstract fun setTextLineHeight(block: DesignBlock, lineHeight: Float?, paragraphIndex: Int = -1)
```

Sets the line height multiplier for a specific paragraph or all paragraphs of a text block. Required scope: "text/character"

### setTextListLevel

```kotlin
abstract fun setTextListLevel(block: DesignBlock, listLevel: Int, paragraphIndex: Int = -1)
```

Sets the list nesting level for a specific paragraph or all paragraphs of a text block. Required scope: "text/character"

### setTextListStyle

```kotlin
abstract fun setTextListStyle(block: DesignBlock, listStyle: ListStyle, paragraphIndex: Int = -1, listLevel: Int? = null)
```

Sets the list style for a specific paragraph or all paragraphs of a text block. Required scope: "text/character"

### setTextOnPathFlipped

```kotlin
abstract fun setTextOnPathFlipped(block: DesignBlock, flipped: Boolean)
```

Sets whether text is placed on the opposite side of the baseline path.

### setTextOnPathOffset

```kotlin
abstract fun setTextOnPathOffset(block: DesignBlock, offset: Float)
```

Sets the start offset along the baseline path as a proportion of the path length. Values are clamped to [-1, 1]; 1 and -1 wrap back to the path start.

### setTextOnPath

```kotlin
abstract fun setTextOnPath(block: DesignBlock, svgPath: String?)
```

Sets or clears the SVG path that defines a text block's baseline. When a path is set, text is laid out as a single line along the path. Pass null to restore normal text layout. The path must be a valid single-subpath SVG path in the block's local coordinate space.

### setTimeOffset

```kotlin
abstract fun setTimeOffset(block: DesignBlock, offset: Double)
```

Set the time offset of the given block relative to its parent. The time offset controls when the block is first active in the timeline. Note: The time offset is not supported by the page block.

### setTransformLocked

```kotlin
abstract fun setTransformLocked(block: DesignBlock, locked: Boolean)
```

Update a block's transform locked state.

### setTransition

```kotlin
abstract fun setTransition(block: DesignBlock, transition: DesignBlock)
```

Assigns the outgoing transition of a clip. A previously assigned transition block is detached but not destroyed automatically. Fails if the given transition block is invalid or already assigned to another clip. Both the clip and its following clip on the track must support transitions, see supportsTransition. To clear a clip's transition, use removeTransition instead.

### setTrimLength

```kotlin
abstract fun setTrimLength(block: DesignBlock, length: Double)
```

Set the trim length of the given block or fill. The trim length is the duration of the audio or video clip that should be used for playback. Note: After reaching this value during playback, the trim region will loop. Note: This requires the video or audio clip to be loaded.

### setTrimOffset

```kotlin
abstract fun setTrimOffset(block: DesignBlock, offset: Double)
```

Set the trim offset of the given block or fill. Sets the time in seconds within the fill at which playback of the audio or video clip should begin. Note: This requires the video or audio clip to be loaded.

### setTypeface

```kotlin
abstract fun setTypeface(block: DesignBlock, typeface: Typeface, from: Int = -1, to: Int = -1)
```

Sets the given typeface for the text block. The current formatting, e.g., bold or italic, is retained as far as possible. Some formatting might change if the new typeface does not support it, e.g. thin might change to light, bold to normal, and/or italic to non-italic. If the typeface is applied to the entire text block, its typeface property will be updated. If a run does not support the new typeface, it will fall back to the default typeface from the typeface property. Required scope: "text/character"

### setUri

```kotlin
abstract fun setUri(block: DesignBlock, property: String, value: Uri)
```

Set a uri property of the given design block to the given value.

### setVisible

```kotlin
abstract fun setVisible(block: DesignBlock, visible: Boolean)
```

Update a block's visibility. Required scope: "layer/visibility"

### setVolume

```kotlin
abstract fun setVolume(block: DesignBlock, @FloatRange(from = 0.0, to = 1.0)volume: Float)
```

Set the audio volume of the given block.

### setWidthMode

```kotlin
abstract fun setWidthMode(block: DesignBlock, mode: SizeMode)
```

Set a block's mode for its width. Required scope: "layer/resize"

### setWidth

```kotlin
abstract fun setWidth(block: DesignBlock, value: Float, maintainCrop: Boolean = false)
```

Update a block's width and optionally maintain the crop. If the crop is maintained, the crop values will be automatically adjusted. The content fill mode Cover is only kept if the features/transformEditsRetainCoverMode setting is enabled, otherwise it will change to Crop. If the size of a group is changed, both dimensions are modified and the aspect ratio of the group is kept. Required scope: "layer/resize"

### split

```kotlin
abstract fun split(block: DesignBlock, atTime: Double, options: SplitOptions = SplitOptions()): DesignBlock
```

Split a block at the specified time. The original block will be trimmed to end at the split time, and the returned duplicate will start at the split time and continue to the original end time.

### supportsAnimation

```kotlin
abstract fun supportsAnimation(block: DesignBlock): Boolean
```

Returns whether the block supports animation.

### supportsBackgroundColor

```kotlin
abstract fun supportsBackgroundColor(block: DesignBlock): Boolean
```

Query if the given block has background color properties.

### supportsBlendMode

```kotlin
abstract fun supportsBlendMode(block: DesignBlock): Boolean
```

Query if the given block has a blend mode.

### supportsBlur

```kotlin
abstract fun supportsBlur(block: DesignBlock): Boolean
```

Checks whether the block supports blur.

### supportsContentFillMode

```kotlin
abstract fun supportsContentFillMode(block: DesignBlock): Boolean
```

Query if the given block has a content fill mode.

### supportsCrop

```kotlin
abstract fun supportsCrop(block: DesignBlock): Boolean
```

Query if the given block has crop properties.

### supportsDropShadow

```kotlin
abstract fun supportsDropShadow(block: DesignBlock): Boolean
```

Query if the given block has a drop shadow property.

### supportsDuration

```kotlin
abstract fun supportsDuration(block: DesignBlock): Boolean
```

Returns whether the block has a duration property.

### supportsEffects

```kotlin
abstract fun supportsEffects(block: DesignBlock): Boolean
```

Queries whether the block supports effects.

### supportsFill

```kotlin
abstract fun supportsFill(block: DesignBlock): Boolean
```

Query if the given block has fill color properties.

### supportsOpacity

```kotlin
abstract fun supportsOpacity(block: DesignBlock): Boolean
```

Query if the given block has an opacity.

### supportsPageDurationSource

```kotlin
abstract fun supportsPageDurationSource(page: DesignBlock, block: DesignBlock): Boolean
```

Returns whether the block can be marked as the element that defines the duration of the given page.

### supportsPlaceholderBehavior

```kotlin
abstract fun supportsPlaceholderBehavior(block: DesignBlock): Boolean
```

Query whether the block supports placeholder behavior.

### supportsPlaceholderControls

```kotlin
abstract fun supportsPlaceholderControls(block: DesignBlock): Boolean
```

Checks whether the block supports placeholder controls.

### supportsPlaybackControl

```kotlin
abstract fun supportsPlaybackControl(block: DesignBlock): Boolean
```

Returns whether the block supports a playback control.

### supportsPlaybackTime

```kotlin
abstract fun supportsPlaybackTime(block: DesignBlock): Boolean
```

Returns whether the block has a playback time property.

### supportsShape

```kotlin
abstract fun supportsShape(block: DesignBlock): Boolean
```

Query if the given block has a shape property.

### supportsStroke

```kotlin
abstract fun supportsStroke(block: DesignBlock): Boolean
```

Query if the given block has a stroke property.

### supportsTimeOffset

```kotlin
abstract fun supportsTimeOffset(block: DesignBlock): Boolean
```

Returns whether the block has a time offset property.

### supportsTransition

```kotlin
abstract fun supportsTransition(block: DesignBlock): Boolean
```

Checks whether a clip can own an outgoing clip-to-clip transition. Only leaf clips inside a video track qualify. Audio, group, caption, and cutout blocks - as well as blocks outside a video track - report false.

### supportsTrim

```kotlin
abstract fun supportsTrim(block: DesignBlock): Boolean
```

Returns whether the block has trim properties.

### toggleBoldFont

```kotlin
abstract fun toggleBoldFont(block: DesignBlock, from: Int = -1, to: Int = -1)
```

Toggles the font weight of the given block between bold and normal. Required scope: "text/character"

### toggleItalicFont

```kotlin
abstract fun toggleItalicFont(block: DesignBlock, from: Int = -1, to: Int = -1)
```

Toggles the font style of the given block between italic and normal. Required scope: "text/character"

### toggleTextDecorationOverline

```kotlin
abstract fun toggleTextDecorationOverline(block: DesignBlock, from: Int = -1, to: Int = -1)
```

Toggles the text decoration overline of the given block. Required scope: "text/character"

### toggleTextDecorationStrikethrough

```kotlin
abstract fun toggleTextDecorationStrikethrough(block: DesignBlock, from: Int = -1, to: Int = -1)
```

Toggles the text decoration strikethrough of the given block. Required scope: "text/character"

### toggleTextDecorationUnderline

```kotlin
abstract fun toggleTextDecorationUnderline(block: DesignBlock, from: Int = -1, to: Int = -1)
```

Toggles the text decoration underline of the given block. Required scope: "text/character"

### ungroup

```kotlin
abstract fun ungroup(block: DesignBlock)
```

Ungroups a group.

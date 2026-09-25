# BlockAPI

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/BlockAPI`

```swift
@MainActor final class BlockAPI
```

## Members

### addImageFileURIToSourceSet(_:property:uri:)

```swift
@MainActor func addImageFileURIToSourceSet(_ id: DesignBlockID, property: String, uri: URL) async throws
```

Add a source to the `sourceSet` property of the given block. If there already exists in source set an image with the same width, that existing image will be replaced. If the source set is or gets empty, the crop and content fill mode of the associated block will be set to the default values. Note: This fetches the resource from the given URI to obtain the image dimensions. It is recommended to use setSourceSet if the dimension is known. `id`

### addVideoFileURIToSourceSet(_:property:uri:)

```swift
@MainActor func addVideoFileURIToSourceSet(_ id: DesignBlockID, property: String, uri: URL) async throws
```

Add a source to the `sourceSet` property of the given block. If there already exists in source set a video with the same width, that existing video will be replaced. If the source set is or gets empty, the crop and content fill mode of the associated block will be set to the default values. Note: This fetches the resource from the given URI to obtain the video dimensions. It is recommended to use setSourceSet if the dimension is known. `id`

### adjustCropToFillFrame(_:minScaleRatio:)

```swift
@MainActor func adjustCropToFillFrame(_ id: DesignBlockID, minScaleRatio: Float) throws
```

Adjust the crop position/scale to at least fill the crop frame. Required scope: “layer/crop” `id`

### alignHorizontally(_:alignment:)

```swift
@MainActor func alignHorizontally(_ ids: [DesignBlockID], alignment: HorizontalBlockAlignment) throws
```

Align multiple blocks horizontally within their bounding box or a single block to its parent. Required scope: “layer/move” `ids`

### alignVertically(_:alignment:)

```swift
@MainActor func alignVertically(_ ids: [DesignBlockID], alignment: VerticalBlockAlignment) throws
```

Align multiple blocks vertically within their bounding box or a single block to its parent. Required scope: “layer/move” `ids`

### appendChild(to:child:)

```swift
@MainActor func appendChild(to parent: DesignBlockID, child: DesignBlockID) throws
```

Appends a new or existing child to a block’s children. Required scope: “editor/add” `parent`

### appendEffect(_:effectID:)

```swift
@MainActor func appendEffect(_ id: DesignBlockID, effectID: DesignBlockID) throws
```

Inserts an effect at the end of the list of effects. The same effect can appear multiple times in the list and won’t be removed if appended again. Required scope: “appearance/effect” `id`

### BlockAPI.Worker

```swift
typealias Worker = Engine
```

### bringForward(_:)

```swift
@MainActor func bringForward(_ id: DesignBlockID) throws
```

Updates the sorting order of this block and all of its superjacent siblings so that the given block has a higher sorting order than the next superjacent sibling. If the block is parented to a track, it is first moved up in the hierarchy. Empty tracks and empty groups are passed by. `id`

### bringToFront(_:)

```swift
@MainActor func bringToFront(_ id: DesignBlockID) throws
```

Updates the sorting order of this block and all of its manually created siblings so that the given block has the highest sorting order. If the block is parented to a track, it is first moved up in the hierarchy. `id`

### canRevertToOriginalRatio(_:)

```swift
@MainActor func canRevertToOriginalRatio(_ id: DesignBlockID) throws -> Bool
```

Query whether the block can be reverted to the intrinsic aspect ratio of its image/video content. This backs the “Original” crop preset (`AssetTransformPreset.contentAspectRatio`). `id`

### canToggleBoldFont(_:in:)

```swift
@MainActor func canToggleBoldFont(_ id: DesignBlockID, in subrange: Range<String.Index>? = nil) throws -> Bool
```

Returns whether the font weight of the given block can be toggled between bold and normal. `id`

### canToggleItalicFont(_:in:)

```swift
@MainActor func canToggleItalicFont(_ id: DesignBlockID, in subrange: Range<String.Index>? = nil) throws -> Bool
```

Returns whether the font style of the given block can be toggled between italic and normal. `id`

### combine(_:booleanOperation:)

```swift
@MainActor func combine(_ ids: [DesignBlockID], booleanOperation: BooleanOperation) throws -> DesignBlockID
```

Perform a boolean operation on the given blocks. All blocks must be combinable. See `isCombinable`. The parent, fill and sort order of the new block is that of the prioritized block. When performing a `Union`, `Intersection` or `XOR`, the operation is performed pair-wise starting with the element with the highest sort order. When performing a `Difference`, the operation is performed pair-wise starting with the element with the lowest sort order. Required scope: “editor/select” `ids`

### create(_:)-3op61

```swift
@MainActor func create(_ type: DesignBlockType) throws -> DesignBlockID
```

Create a new block. `type`

### create(_:)-rs0o

> **Deprecated:** 
  Use 'create(_ type: DesignBlockType)' instead.
  

```swift
@MainActor func create(_ type: String) throws -> DesignBlockID
```

Create a new block, fails if type is unknown. `type`

### createAnimation(_:)

```swift
@MainActor func createAnimation(_ type: AnimationType) throws -> DesignBlockID
```

Creates a new animation, fails if type is unknown. `type`

### createAudioFromVideo(_:trackIndex:options:)

```swift
@MainActor func createAudioFromVideo(_ id: DesignBlockID, trackIndex: Int, options: AudioFromVideoOptions = .init()) throws -> DesignBlockID
```

Create a new audio block by extracting a specific audio track from a video fill block. `id`

### createAudiosFromVideo(_:options:)

```swift
@MainActor func createAudiosFromVideo(_ id: DesignBlockID, options: AudioFromVideoOptions = .init()) throws -> [DesignBlockID]
```

Create multiple audio blocks by extracting all audio tracks from a video fill block. `id`

### createBlur(_:)-3h0uz

```swift
@MainActor func createBlur(_ type: BlurType) throws -> DesignBlockID
```

Create a new blur. `type`

### createBlur(_:)-95cd1

> **Deprecated:** 
  Use 'createBlur(_ type: BlurType)' instead.
  

```swift
@MainActor func createBlur(_ type: String) throws -> DesignBlockID
```

Create a new blur, fails if type is unknown. `type`

### createBlur(type:)

> **Deprecated:** Use 'createBlur(_:)' instead. Renamed to `createBlur(_:)`.

```swift
@MainActor func createBlur(type: String) throws -> DesignBlockID
```

Create a new blur, fails if type is unknown. `type`

### createCaptionsFromURI(_:)

```swift
@MainActor func createCaptionsFromURI(_ uri: URL) async throws -> [DesignBlockID]
```

Creates new caption blocks from the given file. `uri`

### createCutoutFromBlocks(ids:vectorizeDistanceThreshold:simplifyDistanceThreshold:useExistingShapeInformation:)

```swift
@MainActor func createCutoutFromBlocks(ids: [DesignBlockID], vectorizeDistanceThreshold: Float, simplifyDistanceThreshold: Float, useExistingShapeInformation: Bool) throws -> DesignBlockID
```

Creates a cutout whose path will be the contour of the given blocks. The cutout path for each element is derived from one two ways: `ids`

### createCutoutFromOperation(containing:cutoutOperation:)

```swift
@MainActor func createCutoutFromOperation(containing blocks: [DesignBlockID], cutoutOperation: CutoutOperation) throws -> DesignBlockID
```

Perform a boolean operation on the given Cutout blocks. The cutout offset of the new block is 0. The cutout type of the new block is that of the first block. When performing a `.difference` operation, the first block is the block subtracted from. `blocks`

### createCutoutFromPath(_:)

```swift
@MainActor func createCutoutFromPath(_ path: String) throws -> DesignBlockID
```

Create a Cutout block. `path`

### createEffect(_:)-5h8jo

```swift
@MainActor func createEffect(_ type: EffectType) throws -> DesignBlockID
```

Create a new effect. `type`

### createEffect(_:)-t3kv

> **Deprecated:** 
  Use 'createEffect(_ type: EffectType)' instead.
  

```swift
@MainActor func createEffect(_ type: String) throws -> DesignBlockID
```

Create a new effect, fails if type is unknown. `type`

### createEffect(type:)

> **Deprecated:** Use 'createEffect(_:)' instead. Renamed to `createEffect(_:)`.

```swift
@MainActor func createEffect(type: String) throws -> DesignBlockID
```

Create a new effect, fails if type is unknown. `type`

### createFill(_:)-2c6cb

```swift
@MainActor func createFill(_ type: FillType) throws -> DesignBlockID
```

Create a new fill. `type`

### createFill(_:)-72izr

> **Deprecated:** 
  Use 'createFill(_ type: FillType)' instead.
  

```swift
@MainActor func createFill(_ type: String) throws -> DesignBlockID
```

Create a new fill, fails if type is unknown. `type`

### createShape(_:)-7vl24

> **Deprecated:** 
  Use 'createShape(_ type: ShapeType)' instead.
  

```swift
@MainActor func createShape(_ type: String) throws -> DesignBlockID
```

Create a new shape, fails if type is unknown. `type`

### createShape(_:)-9oxx4

```swift
@MainActor func createShape(_ type: ShapeType) throws -> DesignBlockID
```

Create a new shape. `type`

### createTransition(_:)

```swift
@MainActor func createTransition(_ type: TransitionType) throws -> DesignBlockID
```

Creates a new transition, fails if type is unknown. `type`

### destroy(_:)

```swift
@MainActor func destroy(_ id: DesignBlockID) throws
```

Destroys a block. Required scope: “lifecycle/destroy” `id`

### distributeHorizontally(_:)

```swift
@MainActor func distributeHorizontally(_ ids: [DesignBlockID]) throws
```

Distribute multiple blocks horizontally within their bounding box so that the space between them is even. Required scope: “layer/move” `ids`

### distributeVertically(_:)

```swift
@MainActor func distributeVertically(_ ids: [DesignBlockID]) throws
```

Distribute multiple blocks vertically within their bounding box so that the space between them is even. Required scope: “layer/move” `ids`

### duplicate(_:attachToParent:)

```swift
@MainActor func duplicate(_ id: DesignBlockID, attachToParent: Bool = true) throws -> DesignBlockID
```

Duplicates a block including its children. Required scope: “lifecycle/duplicate” If the block is parented to a track that is set always-on-bottom, the duplicate is inserted in the same track immediately after the block. Otherwise, the duplicate is moved up in the hierarchy. `id`

### enterGroup(_:)

```swift
@MainActor func enterGroup(_ id: DesignBlockID) throws
```

Changes selection from selected group to a block within that group. Nothing happens if `id` is not a group. Required scope: “editor/select” `id`

### exitGroup(_:)

```swift
@MainActor func exitGroup(_ id: DesignBlockID) throws
```

Changes selection from a group’s selected block to that group. Nothing happens if the `id` is not part of a group. Required scope: “editor/select” `id`

### export(_:mimeType:options:onPreExport:uriResolver:onProgress:)-3nqrb

```swift
@MainActor func export(_ id: DesignBlockID, mimeType: MIMEType, options: ExportOptions = .init(), onPreExport: @MainActor @Sendable (BlockAPI.Worker) async throws -> Void = { _ in }, uriResolver: (@Sendable (String) async throws -> URL)? = nil, onProgress: (@MainActor @Sendable (Int, Int) -> Void)? = nil) async throws -> Blob
```

Exports a design block element as a file of the given mime type. Performs an internal update to resolve the final layout for the blocks. `id`

### export(_:mimeType:options:onPreExport:uriResolver:onProgress:)-7r7re

```swift
@MainActor func export(_ ids: [DesignBlockID], mimeType: MIMEType, options: ExportOptions = .init(), onPreExport: @MainActor @Sendable (BlockAPI.Worker) async throws -> Void = { _ in }, uriResolver: (@Sendable (String) async throws -> URL)? = nil, onProgress: (@MainActor @Sendable (Int, Int) -> Void)? = nil) async throws -> AsyncThrowingStream<Blob, any Error>
```

Exports multiple design block elements as files of the given mime type. Performs an internal update to resolve the final layout for the blocks. This method is more memory efficient than calling `export` repeatedly for multiple blocks as it reuses a single worker engine for all exports. `ids`

### export(_:mimeType:options:onPreExport:uriResolver:onProgress:onData:)

```swift
@MainActor func export(_ id: DesignBlockID, mimeType: MIMEType = .pdf, options: ExportOptions = .init(), onPreExport: @MainActor @Sendable (BlockAPI.Worker) async throws -> Void = { _ in }, uriResolver: (@Sendable (String) async throws -> URL)? = nil, onProgress: (@MainActor @Sendable (Int, Int) -> Void)? = nil, onData: @escaping @Sendable (Data) throws -> Void) async throws
```

Exports a design block as a PDF whose bytes are delivered incrementally in chunks instead of one final blob, so the document is never held in memory as a whole. Use this when the destination is not a plain file, for example when uploading the document while it is being encoded. To write to a file use the `export` overload that takes a URL. Performs an internal update to resolve the final layout for the blocks. `id`

### export(_:to:mimeType:options:onPreExport:uriResolver:onProgress:)

```swift
@MainActor func export(_ id: DesignBlockID, to url: URL, mimeType: MIMEType = .pdf, options: ExportOptions = .init(), onPreExport: @MainActor @Sendable (BlockAPI.Worker) async throws -> Void = { _ in }, uriResolver: (@Sendable (String) async throws -> URL)? = nil, onProgress: (@MainActor @Sendable (Int, Int) -> Void)? = nil) async throws
```

Exports a design block as a PDF, writing its bytes into a file as they are produced instead of building the whole document in memory first. Prefer this over `export` for large multi-page documents such as photo books and magazines: peak memory is bounded by the working set of a single page rather than by the size of the finished document. Performs an internal update to resolve the final layout for the blocks. `id`

### exportAudio(_:mimeType:options:)-5xr9k

```swift
@MainActor func exportAudio(_ ids: [DesignBlockID], mimeType: MIMEType = .wav, options: AudioExportOptions = .init()) async throws -> AsyncThrowingStream<AudioExport, any Error>
```

Exports multiple design blocks as audio files of the given mime type. Audio files are exported sequentially, with progress events yielded for each audio. `ids`

### exportAudio(_:mimeType:options:)-7znli

```swift
@MainActor func exportAudio(_ id: DesignBlockID, mimeType: MIMEType = .wav, options: AudioExportOptions = .init()) async throws -> AsyncThrowingStream<AudioExport, any Error>
```

Exports a design block as an audio file of the given mime type. `id`

### exportAudioPublisher(_:mimeType:options:)-1um68

```swift
@MainActor func exportAudioPublisher(_ ids: [DesignBlockID], mimeType: MIMEType = .wav, options: AudioExportOptions = .init()) async throws -> AnyPublisher<AudioExport, any Error>
```

Exports multiple design blocks as audio files and returns a Combine publisher. Audio files are exported sequentially, with progress and finished events emitted for each audio. `ids`

### exportAudioPublisher(_:mimeType:options:)-418az

```swift
@MainActor func exportAudioPublisher(_ id: DesignBlockID, mimeType: MIMEType = .wav, options: AudioExportOptions = .init()) async throws -> AnyPublisher<AudioExport, any Error>
```

Exports a design block as an audio file and returns a Combine publisher. `id`

### exportVideo(_:mimeType:options:onPreExport:uriResolver:)-8tel0

```swift
@MainActor func exportVideo(_ id: DesignBlockID, mimeType: MIMEType = .mp4, options: VideoExportOptions = .init(), onPreExport: @MainActor @Sendable (BlockAPI.Worker) async throws -> Void = { _ in }, uriResolver: (@Sendable (String) async throws -> URL)? = nil) async throws -> AsyncThrowingStream<VideoExport, any Error>
```

Exports a design block as a video file of the given mime type. `id`

### exportVideo(_:mimeType:options:onPreExport:uriResolver:)-9zef

```swift
@MainActor func exportVideo(_ ids: [DesignBlockID], mimeType: MIMEType = .mp4, options: VideoExportOptions = .init(), onPreExport: @MainActor @Sendable (BlockAPI.Worker) async throws -> Void = { _ in }, uriResolver: (@Sendable (String) async throws -> URL)? = nil) async throws -> AsyncThrowingStream<VideoExport, any Error>
```

Exports multiple design blocks as video files of the given mime type. Videos are exported sequentially, with progress events yielded for each video. This method is more memory efficient than calling `exportVideo` repeatedly for multiple blocks as it reuses a single worker engine for all exports. `ids`

### exportVideoPublisher(_:mimeType:options:onPreExport:uriResolver:)-5man1

```swift
@MainActor func exportVideoPublisher(_ id: DesignBlockID, mimeType: MIMEType = .mp4, options: VideoExportOptions = .init(), onPreExport: @MainActor @Sendable (BlockAPI.Worker) async throws -> Void = { _ in }, uriResolver: (@Sendable (String) async throws -> URL)? = nil) async throws -> AnyPublisher<VideoExport, any Error>
```

Exports a design block as a video file of the given mime type. `id`

### exportVideoPublisher(_:mimeType:options:onPreExport:uriResolver:)-6j5ps

```swift
@MainActor func exportVideoPublisher(_ ids: [DesignBlockID], mimeType: MIMEType = .mp4, options: VideoExportOptions = .init(), onPreExport: @MainActor @Sendable (BlockAPI.Worker) async throws -> Void = { _ in }, uriResolver: (@Sendable (String) async throws -> URL)? = nil) async throws -> AnyPublisher<VideoExport, any Error>
```

Exports multiple design blocks as video files of the given mime type. Videos are exported sequentially, with progress events published for each video. This method is more memory efficient than calling `exportVideoPublisher` repeatedly for multiple blocks as it reuses a single worker engine for all exports. `ids`

### exportWithColorMask(_:mimeType:maskColorR:maskColorG:maskColorB:options:onPreExport:uriResolver:)-1yiln

```swift
@MainActor func exportWithColorMask(_ ids: [DesignBlockID], mimeType: MIMEType, maskColorR: Float, maskColorG: Float, maskColorB: Float, options: ExportOptions = .init(), onPreExport: @MainActor @Sendable (BlockAPI.Worker) async throws -> Void = { _ in }, uriResolver: (@Sendable (String) async throws -> URL)? = nil) async throws -> AsyncThrowingStream<[Blob], any Error>
```

Exports multiple design block elements as files of the given mime type with color masks. Performs an internal update to resolve the final layout for the blocks. This method is more memory efficient than calling `exportWithColorMask` repeatedly for multiple blocks as it reuses a single worker engine for all exports. `ids`

### exportWithColorMask(_:mimeType:maskColorR:maskColorG:maskColorB:options:onPreExport:uriResolver:)-7fbiu

```swift
@MainActor func exportWithColorMask(_ id: DesignBlockID, mimeType: MIMEType, maskColorR: Float, maskColorG: Float, maskColorB: Float, options: ExportOptions = .init(), onPreExport: @MainActor @Sendable (BlockAPI.Worker) async throws -> Void = { _ in }, uriResolver: (@Sendable (String) async throws -> URL)? = nil) async throws -> [Blob]
```

Exports a design block element as a file of the given mime type. Performs an internal update to resolve the final layout for the blocks. `id`

### fillParent(_:)

```swift
@MainActor func fillParent(_ id: DesignBlockID) throws
```

Resize and position a block to entirely fill its parent block. The crop values of the block, except for the flip and crop rotation, are reset if it can be cropped. If the size of the block’s fill is unknown, the content fill mode is changed from `Crop` to `Cover` to prevent invalid crop values. Required scope: “layer/move” `id`

### find(byKind:)

```swift
@MainActor func find(byKind kind: String) throws -> [DesignBlockID]
```

Finds all blocks with the given kind. `kind`

### find(byName:)

```swift
@MainActor func find(byName name: String) -> [DesignBlockID]
```

Finds all blocks with the given name. `name`

### find(byType:)-1qrls

```swift
@MainActor func find(byType type: EffectType) throws -> [DesignBlockID]
```

Finds all blocks with the given type. `type`

### find(byType:)-2cvmt

```swift
@MainActor func find(byType type: DesignBlockType) throws -> [DesignBlockID]
```

Finds all blocks with the given type. `type`

### find(byType:)-6e1l2

```swift
@MainActor func find(byType type: FillType) throws -> [DesignBlockID]
```

Finds all blocks with the given type. `type`

### find(byType:)-9nw9h

> **Deprecated:** 
  Use 'find(byType type: DesignBlock/Fill/Shape/Effect/BlurType)' instead.
  

```swift
@MainActor func find(byType type: String) throws -> [DesignBlockID]
```

Finds all blocks with the given type. `type`

### find(byType:)-axpj

```swift
@MainActor func find(byType type: ShapeType) throws -> [DesignBlockID]
```

Finds all blocks with the given type. `type`

### find(byType:)-w20y

```swift
@MainActor func find(byType type: BlurType) throws -> [DesignBlockID]
```

Finds all blocks with the given type. `type`

### findAll()

```swift
@MainActor func findAll() -> [DesignBlockID]
```

Return all blocks currently known to the engine. A list of block ids.

### findAllMetadata(_:)

```swift
@MainActor func findAllMetadata(_ id: DesignBlockID) throws -> [String]
```

Query all metadata keys that exist on this block. `id`

### findAllPlaceholders()

```swift
@MainActor func findAllPlaceholders() -> [DesignBlockID]
```

Return all placeholder blocks in the current scene. A list of block ids.

### findAllProperties(_:)

```swift
@MainActor func findAllProperties(_ id: DesignBlockID) throws -> [String]
```

Get all available properties of a block. `id`

### findAllSelected()

```swift
@MainActor func findAllSelected() -> [DesignBlockID]
```

Get all currently selected blocks. An array of block ids.

### findAllUnused()

```swift
@MainActor func findAllUnused() -> [DesignBlockID]
```

Returns all blocks that are not attached to any scene. A list of block ids that are not attached to any scene.

### flipCropHorizontal(_:)

```swift
@MainActor func flipCropHorizontal(_ id: DesignBlockID) throws
```

Adjusts the crop in order to flip the content along its own horizontal axis. `id`

### flipCropVertical(_:)

```swift
@MainActor func flipCropVertical(_ id: DesignBlockID) throws
```

Adjusts the crop in order to flip the content along its own vertical axis. `id`

### forceLoadAVResource(_:)

```swift
@MainActor func forceLoadAVResource(_ id: DesignBlockID) async throws
```

Begins loading the required audio and video resource for the given video fill or audio block. If the resource had been loaded earlier and resulted in an error, it will be reloaded. `id`

### forceLoadResources(_:)

```swift
@MainActor func forceLoadResources(_ ids: [DesignBlockID]) async throws
```

Begins loading the resources of the given blocks and their children. If the resource had been loaded earlier and resulted in an error, it will be reloaded. This function is useful for preloading resources before they are needed. Warning: For elements with a source set, all elements in the source set will be loaded. `ids`

### generateAudioThumbnailSequence(_:samplesPerChunk:timeRange:numberOfSamples:numberOfChannels:)

```swift
@MainActor func generateAudioThumbnailSequence(_ id: DesignBlockID, samplesPerChunk: Int, timeRange: ClosedRange<Double>, numberOfSamples: Int, numberOfChannels: Int) -> AsyncThrowingStream<AudioThumbnail, any Error>
```

Generate a thumbnail sequence for the given audio block or video fill. A thumbnail in this case is a chunk of samples in the range of 0 to 1. In case stereo data is requested, the samples are interleaved, starting with the left channel. `id`

### generateVideoThumbnailSequence(_:thumbnailHeight:timeRange:numberOfFrames:)

```swift
@MainActor func generateVideoThumbnailSequence(_ id: DesignBlockID, thumbnailHeight: Int, timeRange: ClosedRange<Double>, numberOfFrames: Int) -> AsyncThrowingStream<VideoThumbnail, any Error>
```

Generate a thumbnail sequence for the given video fill or design block. `id`

### getAudioInfoFromVideo(_:)

```swift
@MainActor func getAudioInfoFromVideo(_ id: DesignBlockID) throws -> [AudioTrackInfo]
```

Get information about all audio tracks from a video fill block. `id`

### getAudioTrackCountFromVideo(_:)

```swift
@MainActor func getAudioTrackCountFromVideo(_ id: DesignBlockID) throws -> Int
```

Get the number of available audio tracks in a video fill block. `id`

### getAVResourceTotalDuration(_:)

```swift
@MainActor func getAVResourceTotalDuration(_ id: DesignBlockID) throws -> Double
```

Get the duration in seconds of the video or audio resource that is attached to the given block. `id`

### getBackgroundColor(_:)

```swift
@MainActor func getBackgroundColor(_ id: DesignBlockID) throws -> RGBA
```

Get the background color of the given design block. `id`

### getBlendMode(_:)

```swift
@MainActor func getBlendMode(_ id: DesignBlockID) throws -> BlendMode
```

Get the blend mode of the given design block. `id`

### getBlur(_:)

```swift
@MainActor func getBlur(_ id: DesignBlockID) throws -> DesignBlockID
```

Get the ‘blur’ block of the given design block. `id`

### getBool(_:property:)

```swift
@MainActor func getBool(_ id: DesignBlockID, property: String) throws -> Bool
```

Get the value of a bool property of the given design block. `id`

### getChildren(_:)

```swift
@MainActor func getChildren(_ id: DesignBlockID) throws -> [DesignBlockID]
```

Get all children of the given block. Children are sorted in their rendering order: Last child is rendered in front of other children. `id`

### getColor(_:property:)-24vno

```swift
@MainActor func getColor(_ id: DesignBlockID, property: String) throws -> Color
```

Get the value of a color property of the given design block. `id`

### getColor(_:property:)-98eai

> **Deprecated:** 
    Use 'getColor(id: DesignBlockID, property: String) -> Color' instead.
    

```swift
@MainActor func getColor(_ id: DesignBlockID, property: String) throws -> RGBA
```

Get the value of a string property of the given design block. `id`

### getColorSpotName(_:property:)

> **Deprecated:** 
    Use 'getColor(id: DesignBlockID, property: String) -> Color' instead.
    

```swift
@MainActor func getColorSpotName(_ id: DesignBlockID, property: String) throws -> String
```

Get the spot color name of a color property of the given design block. `id`

### getColorSpotTint(_:property:)

> **Deprecated:** 
    Use 'getColor(id: DesignBlockID, property: String) -> Color' instead.
    

```swift
@MainActor func getColorSpotTint(_ id: DesignBlockID, property: String) throws -> Float
```

Get the spot color tint factor of a color property of the given design block. `id`

### getContentFillHorizontalAlignment(_:)

```swift
@MainActor func getContentFillHorizontalAlignment(_ id: DesignBlockID) throws -> HorizontalContentFillAlignment
```

Query a block’s horizontal content fill alignment. `id`

### getContentFillMode(_:)

```swift
@MainActor func getContentFillMode(_ id: DesignBlockID) throws -> ContentFillMode
```

Query a block’s content fill mode. `id`

### getContentFillVerticalAlignment(_:)

```swift
@MainActor func getContentFillVerticalAlignment(_ id: DesignBlockID) throws -> VerticalContentFillAlignment
```

Query a block’s vertical content fill alignment. `id`

### getCropRotation(_:)

```swift
@MainActor func getCropRotation(_ id: DesignBlockID) throws -> Float
```

Get the crop rotation of the given design block. `id`

### getCropScaleRatio(_:)

```swift
@MainActor func getCropScaleRatio(_ id: DesignBlockID) throws -> Float
```

Get the crop scale ratio of the given design block. `id`

### getCropScaleX(_:)

```swift
@MainActor func getCropScaleX(_ id: DesignBlockID) throws -> Float
```

Get the crop scale on the x axis of the given design block. `id`

### getCropScaleY(_:)

```swift
@MainActor func getCropScaleY(_ id: DesignBlockID) throws -> Float
```

Get the crop scale on the x axis of the given design block. `id`

### getCropTranslationX(_:)

```swift
@MainActor func getCropTranslationX(_ id: DesignBlockID) throws -> Float
```

Get the crop translation on the x axis of the given design block. `id`

### getCropTranslationY(_:)

```swift
@MainActor func getCropTranslationY(_ id: DesignBlockID) throws -> Float
```

Get the crop translation on the y axis of the given design block. `id`

### getDominantColors(_:options:)

```swift
@MainActor func getDominantColors(_ id: DesignBlockID, options: DominantColorsOptions = .init()) async throws -> [DominantColor]
```

Extracts the dominant colors from the rendered appearance of a block. `id`

### getDouble(_:property:)

```swift
@MainActor func getDouble(_ id: DesignBlockID, property: String) throws -> Double
```

Get the value of a double property of the given design block. `id`

### getDropShadowBlurRadiusX(_:)

```swift
@MainActor func getDropShadowBlurRadiusX(_ id: DesignBlockID) throws -> Float
```

Get the drop shadow’s blur radius on the X axis of the given design block. `id`

### getDropShadowBlurRadiusY(_:)

```swift
@MainActor func getDropShadowBlurRadiusY(_ id: DesignBlockID) throws -> Float
```

Get the drop shadow’s blur radius on the Y axis of the given design block. `id`

### getDropShadowClip(_:)

```swift
@MainActor func getDropShadowClip(_ id: DesignBlockID) throws -> Bool
```

Get the drop shadow’s clipping of the given design block. `id`

### getDropShadowColor(_:)-73z92

> **Deprecated:** 
    Use 'getDropShadowColor(id: DesignBlockID) -> Color' instead.
    

```swift
@MainActor func getDropShadowColor(_ id: DesignBlockID) throws -> RGBA
```

Get the drop shadow color of the given design block. `id`

### getDropShadowColor(_:)-9i3at

```swift
@MainActor func getDropShadowColor(_ id: DesignBlockID) throws -> Color
```

Get the drop shadow color of the given design block. `id`

### getDropShadowOffsetX(_:)

```swift
@MainActor func getDropShadowOffsetX(_ id: DesignBlockID) throws -> Float
```

Get the drop shadow’s X offset of the given design block. `id`

### getDropShadowOffsetY(_:)

```swift
@MainActor func getDropShadowOffsetY(_ id: DesignBlockID) throws -> Float
```

Get the drop shadow’s Y offset of the given design block. `id`

### getDuration(_:)

```swift
@MainActor func getDuration(_ id: DesignBlockID) throws -> Double
```

Get the playback duration of the given block in seconds. The duration defines for how long the block is active in the scene during playback. `id`

### getEffects(_:)

```swift
@MainActor func getEffects(_ id: DesignBlockID) throws -> [DesignBlockID]
```

Get a list of all effects attached to this block. `id`

### getEnum(_:property:)

```swift
@MainActor func getEnum(_ id: DesignBlockID, property: String) throws -> String
```

Get the value of an enum property of the given design block. `id`

### getEnumValues(ofProperty:)

```swift
@MainActor func getEnumValues(ofProperty enumProperty: String) throws -> [String]
```

Get all the possible values of an enum given an enum property. `enumProperty`

### getFill(_:)

```swift
@MainActor func getFill(_ id: DesignBlockID) throws -> DesignBlockID
```

Returns the block containing the fill properties of the given block. `id`

### getFillOverprint(_:)

```swift
@MainActor func getFillOverprint(_ id: DesignBlockID) throws -> Bool
```

Query whether the fill of the given design block is marked as overprint. `id`

### getFillSolidColor(_:)

```swift
@MainActor func getFillSolidColor(_ id: DesignBlockID) throws -> RGBA
```

Get the fill color of the given design block. `id`

### getFlipHorizontal(_:)

```swift
@MainActor func getFlipHorizontal(_ id: DesignBlockID) throws -> Bool
```

Query a block’s horizontal flip state. `id`

### getFlipVertical(_:)

```swift
@MainActor func getFlipVertical(_ id: DesignBlockID) throws -> Bool
```

Query a block’s vertical flip state. `id`

### getFloat(_:property:)

```swift
@MainActor func getFloat(_ id: DesignBlockID, property: String) throws -> Float
```

Get the value of a float property of the given design block. `id`

### getFrameHeight(_:)

```swift
@MainActor func getFrameHeight(_ id: DesignBlockID) throws -> Float
```

Get a block’s layout height. The layout height is only available after an internal update loop, which may not happen immediately. `id`

### getFrameWidth(_:)

```swift
@MainActor func getFrameWidth(_ id: DesignBlockID) throws -> Float
```

Get a block’s layout width. The layout width is only available after an internal update loop, which may not happen immediately. `id`

### getFrameX(_:)

```swift
@MainActor func getFrameX(_ id: DesignBlockID) throws -> Float
```

Get a block’s layout position on the x-axis. The layout position is only available after an internal update loop, which may not happen immediately. `id`

### getFrameY(_:)

```swift
@MainActor func getFrameY(_ id: DesignBlockID) throws -> Float
```

Get a block’s layout position on the y-axis. The layout position is only available after an internal update loop, which may not happen immediately. `id`

### getGlobalBoundingBoxHeight(_:)

```swift
@MainActor func getGlobalBoundingBoxHeight(_ id: DesignBlockID) throws -> Float
```

Get the height of the block’s axis-aligned bounding box in the scene’s global coordinate space. The scene’s global coordinate space has its origin at the top left. `id`

### getGlobalBoundingBoxWidth(_:)

```swift
@MainActor func getGlobalBoundingBoxWidth(_ id: DesignBlockID) throws -> Float
```

Get the width of the block’s axis-aligned bounding box in the scene’s global coordinate space. The scene’s global coordinate space has its origin at the top left. `id`

### getGlobalBoundingBoxX(_:)

```swift
@MainActor func getGlobalBoundingBoxX(_ id: DesignBlockID) throws -> Float
```

Get the x position of the block’s axis-aligned bounding box in the scene’s global coordinate space. The scene’s global coordinate space has its origin at the top left. `id`

### getGlobalBoundingBoxY(_:)

```swift
@MainActor func getGlobalBoundingBoxY(_ id: DesignBlockID) throws -> Float
```

Get the y position of the block’s axis-aligned bounding box in the scene’s global coordinate space. The scene’s global coordinate space has its origin at the top left. `id`

### getGradientColorStops(_:property:)

```swift
@MainActor func getGradientColorStops(_ id: DesignBlockID, property: String) throws -> [GradientColorStop]
```

Get the gradient color stops property of the given design block. `id`

### getHeight(_:)

```swift
@MainActor func getHeight(_ id: DesignBlockID) throws -> Float
```

Query a block’s height. `id`

### getHeightMode(_:)

```swift
@MainActor func getHeightMode(_ id: DesignBlockID) throws -> SizeMode
```

Query a block’s mode for its height. `id`

### getInAnimation(_:)

```swift
@MainActor func getInAnimation(_ id: DesignBlockID) throws -> DesignBlockID
```

Get the “in” animation of the given block. `id`

### getInt(_:property:)

```swift
@MainActor func getInt(_ id: DesignBlockID, property: String) throws -> Int
```

Get the value of an int property of the given design block. `id`

### getKind(_:)

```swift
@MainActor func getKind(_ id: DesignBlockID) throws -> String
```

Get the kind of the given block, fails if the block is invalid. `id`

### getLoopAnimation(_:)

```swift
@MainActor func getLoopAnimation(_ id: DesignBlockID) throws -> DesignBlockID
```

Get the “loop” animation of the given block. `id`

### getMetadata(_:key:)

```swift
@MainActor func getMetadata(_ id: DesignBlockID, key: String) throws -> String
```

Get a metadata value of a block identified by a key. If the key does not exist, yet, this method will fail. `id`

### getName(_:)

```swift
@MainActor func getName(_ id: DesignBlockID) throws -> String
```

Get a block’s name. `id`

### getOpacity(_:)

```swift
@MainActor func getOpacity(_ id: DesignBlockID) throws -> Float
```

Get the opacity of the given design block. `id`

### getOutAnimation(_:)

```swift
@MainActor func getOutAnimation(_ id: DesignBlockID) throws -> DesignBlockID
```

Get the “out” animation of the given block. `id`

### getParent(_:)

```swift
@MainActor func getParent(_ id: DesignBlockID) throws -> DesignBlockID?
```

Query a block’s parent. `id`

### getPlaybackSpeed(_:)

```swift
@MainActor func getPlaybackSpeed(_ id: DesignBlockID) throws -> Float
```

Get the playback speed multiplier for the given block. `id`

### getPlaybackTime(_:)

```swift
@MainActor func getPlaybackTime(_ id: DesignBlockID) throws -> Double
```

Get the playback time of the given block. `id`

### getPositionX(_:)

```swift
@MainActor func getPositionX(_ id: DesignBlockID) throws -> Float
```

Query a block’s x position. `id`

### getPositionXMode(_:)

```swift
@MainActor func getPositionXMode(_ id: DesignBlockID) throws -> PositionMode
```

Query a block’s mode for its x position. `id`

### getPositionY(_:)

```swift
@MainActor func getPositionY(_ id: DesignBlockID) throws -> Float
```

Query a block’s y position. `id`

### getPositionYMode(_:)

```swift
@MainActor func getPositionYMode(_ id: DesignBlockID) throws -> PositionMode
```

Query a block’s mode for its y position. `id`

### getRotation(_:)

```swift
@MainActor func getRotation(_ id: DesignBlockID) throws -> Float
```

Query a block’s rotation in radians. `id`

### getScreenSpaceBoundingBox(containing:)

```swift
@MainActor func getScreenSpaceBoundingBox(containing blocks: [DesignBlockID]) throws -> CGRect
```

Get the position and size of the axis-aligned bounding box for the given blocks in screen space. `blocks`

### getShape(_:)

```swift
@MainActor func getShape(_ id: DesignBlockID) throws -> DesignBlockID
```

Returns the block containing the shape properties of the given block. `id`

### getSourceSet(_:property:)

```swift
@MainActor func getSourceSet(_ id: DesignBlockID, property: String) throws -> [Source]
```

Returns the source set of the given block. `id`

### getState(_:)

```swift
@MainActor func getState(_ id: DesignBlockID) throws -> BlockState
```

Get the current state of a block. `id`

### getString(_:property:)

```swift
@MainActor func getString(_ id: DesignBlockID, property: String) throws -> String
```

Get the value of a string property of the given design block. `id`

### getStrokeCap(_:)

> **Deprecated:** Use getStrokeStartCap(_:) and getStrokeEndCap(_:) instead.

```swift
@MainActor func getStrokeCap(_ id: DesignBlockID) throws -> StrokeCap
```

Get the legacy single stroke cap of the given design block. Tracks the value last written via `setStrokeCap(_:cap:)` or `setStrokeStartCap(_:cap:)`; ignores changes made via `setStrokeEndCap(_:cap:)`. `id`

### getStrokeColor(_:)-243t1

```swift
@MainActor func getStrokeColor(_ id: DesignBlockID) throws -> Color
```

Get the stroke color of the given design block. `id`

### getStrokeColor(_:)-8rv52

> **Deprecated:** 
    Use 'getStrokeColor(id: DesignBlockID) -> Color' instead.
    

```swift
@MainActor func getStrokeColor(_ id: DesignBlockID) throws -> RGBA
```

Get the stroke color of the given design block. `id`

### getStrokeCornerGeometry(_:)

```swift
@MainActor func getStrokeCornerGeometry(_ id: DesignBlockID) throws -> StrokeCornerGeometry
```

Get the stroke corner geometry of the given design block. `id`

### getStrokeDashArray(_:)

```swift
@MainActor func getStrokeDashArray(_ id: DesignBlockID) throws -> [Float]
```

Get the custom dash pattern of the given design block’s stroke. `id`

### getStrokeDashEndCap(_:)

```swift
@MainActor func getStrokeDashEndCap(_ id: DesignBlockID) throws -> StrokeCap
```

Get the cap geometry at the trailing edge of each dash piece. `id`

### getStrokeDashOffset(_:)

```swift
@MainActor func getStrokeDashOffset(_ id: DesignBlockID) throws -> Float
```

Get the dash offset of the given design block’s stroke. `id`

### getStrokeDashStartCap(_:)

```swift
@MainActor func getStrokeDashStartCap(_ id: DesignBlockID) throws -> StrokeCap
```

Get the cap geometry at the leading edge of each dash piece. `id`

### getStrokeEndCap(_:)

```swift
@MainActor func getStrokeEndCap(_ id: DesignBlockID) throws -> StrokeCap
```

Get the cap geometry at the end of an open stroked path. `id`

### getStrokeOverprint(_:)

```swift
@MainActor func getStrokeOverprint(_ id: DesignBlockID) throws -> Bool
```

Query whether the stroke of the given design block is marked as overprint. `id`

### getStrokePosition(_:)

```swift
@MainActor func getStrokePosition(_ id: DesignBlockID) throws -> StrokePosition
```

Get the stroke position of the given design block. `id`

### getStrokeStartCap(_:)

```swift
@MainActor func getStrokeStartCap(_ id: DesignBlockID) throws -> StrokeCap
```

Get the cap geometry at the start of an open stroked path. `id`

### getStrokeStyle(_:)

```swift
@MainActor func getStrokeStyle(_ id: DesignBlockID) throws -> StrokeStyle
```

Get the stroke style of the given design block. `id`

### getStrokeWidth(_:)

```swift
@MainActor func getStrokeWidth(_ id: DesignBlockID) throws -> Float
```

Get the stroke width of the given design block. `id`

### getTextCases(_:in:)

```swift
@MainActor func getTextCases(_ id: DesignBlockID, in subrange: Range<String.Index>? = nil) throws -> [TextCase]
```

Returns the ordered list of text cases of the text in the selected range. `id`

### getTextCharacterInkBoxes(_:in:)

```swift
@MainActor func getTextCharacterInkBoxes(_ id: DesignBlockID, in subrange: Range<String.Index>? = nil) throws -> [CharacterInkBox]
```

Returns the tight ink-paint bounding box of each grapheme in the given range. Required scope: “text/character” `id`

### getTextColors(_:in:)

```swift
@MainActor func getTextColors(_ id: DesignBlockID, in subrange: Range<String.Index>? = nil) throws -> [Color]
```

Returns the ordered unique list of colors of the text in the selected range. `id`

### getTextCursorRange()

```swift
@MainActor func getTextCursorRange() throws -> Range<String.Index>?
```

Returns the indices of the selected grapheme range of the text block that is currently being edited. If both the start and end index of the returned range have the same value, then the text cursor is positioned at that index. The selected grapheme range or `nil` if no text block is currently being edited.

### getTextDecorations(_:in:)

```swift
@MainActor func getTextDecorations(_ id: DesignBlockID, in subrange: Range<String.Index>? = nil) throws -> [TextDecorationConfig]
```

Returns the ordered list of unique text decoration configurations in the selected range. `id`

### getTextEffectiveHorizontalAlignment(_:)

```swift
@MainActor func getTextEffectiveHorizontalAlignment(_ id: DesignBlockID) throws -> HorizontalTextAlignment
```

Returns the effective horizontal alignment of a text block. If the alignment is set to Auto, this returns the resolved alignment (Left or Right) based on the text direction of the first logical run. This never returns ‘Auto’. `id`

### getTextFontSizes(_:in:)

```swift
@MainActor func getTextFontSizes(_ id: DesignBlockID, in subrange: Range<String.Index>? = nil) throws -> [Float]
```

Returns the ordered unique list of font sizes of the text in the selected range. `id`

### getTextFontStyles(_:in:)

```swift
@MainActor func getTextFontStyles(_ id: DesignBlockID, in subrange: Range<String.Index>? = nil) throws -> [FontStyle]
```

Returns the ordered unique list of font styles of the text in the selected range. `id`

### getTextFontWeights(_:in:)

```swift
@MainActor func getTextFontWeights(_ id: DesignBlockID, in subrange: Range<String.Index>? = nil) throws -> [FontWeight]
```

Returns the ordered unique list of font weights of the text in the selected range. `id`

### getTextHorizontalAlignment(_:paragraphIndex:)

```swift
@MainActor func getTextHorizontalAlignment(_ id: DesignBlockID, paragraphIndex: Int = -1) throws -> HorizontalTextAlignment?
```

Returns the paragraph-level horizontal alignment override for a specific paragraph, or the block-level alignment for negative paragraph indices. `id`

### getTextKernings(_:in:)

```swift
@MainActor func getTextKernings(_ id: DesignBlockID, in subrange: Range<String.Index>? = nil) throws -> [Float]
```

Returns the unique kerning values across the grapheme range. `id`

### getTextLineBoundingBoxRect(_:index:)

```swift
@MainActor func getTextLineBoundingBoxRect(_ id: DesignBlockID, index: Int) throws -> CGRect
```

Returns the bounds of the visible area of the given line of the text block. The values are in the scene’s global coordinate space (which has its origin at the top left). `id`

### getTextLineHeight(_:paragraphIndex:)

```swift
@MainActor func getTextLineHeight(_ id: DesignBlockID, paragraphIndex: Int) throws -> Float
```

Returns the line height multiplier for a specific paragraph of a text block. `id`

### getTextListLevel(_:paragraphIndex:)

```swift
@MainActor func getTextListLevel(_ id: DesignBlockID, paragraphIndex: Int) throws -> Int
```

Returns the list nesting level for a specific paragraph of a text block. `id`

### getTextListStyle(_:paragraphIndex:)

```swift
@MainActor func getTextListStyle(_ id: DesignBlockID, paragraphIndex: Int) throws -> ListStyle
```

Returns the list style for a specific paragraph of a text block. `id`

### getTextOnPath(_:)

```swift
@MainActor func getTextOnPath(_ id: DesignBlockID) throws -> String?
```

Returns the SVG path currently used as the text block’s baseline, or `nil` if normal layout is active. `id`

### getTextOnPathFlipped(_:)

```swift
@MainActor func getTextOnPathFlipped(_ id: DesignBlockID) throws -> Bool
```

Returns whether text is placed on the opposite side of the baseline path. `id`

### getTextOnPathOffset(_:)

```swift
@MainActor func getTextOnPathOffset(_ id: DesignBlockID) throws -> Float
```

Returns the start offset along the baseline path as a proportion of the path length. `id`

### getTextParagraphIndices(_:in:)

```swift
@MainActor func getTextParagraphIndices(_ id: DesignBlockID, in subrange: Range<String.Index>? = nil) throws -> [Int]
```

Returns the 0-based paragraph indices that overlap the given string subrange. `id`

### getTextRuns(_:in:)

```swift
@MainActor func getTextRuns(_ id: DesignBlockID, in subrange: Range<String.Index>? = nil) throws -> [TextRunInfo]
```

Returns all text runs within the given range of text. `id`

### getTextVisibleLineContent(_:lineIndex:)

```swift
@MainActor func getTextVisibleLineContent(_ id: DesignBlockID, lineIndex: Int) throws -> String
```

Returns the text content of the given visible line of the text block. `id`

### getTextVisibleLineCount(_:)

```swift
@MainActor func getTextVisibleLineCount(_ id: DesignBlockID) throws -> Int
```

Returns the number of visible lines in the given text block. `id`

### getTimeOffset(_:)

```swift
@MainActor func getTimeOffset(_ id: DesignBlockID) throws -> Double
```

Get the time offset of the given block relative to its parent. `id`

### getTotalDuration(scene:)

> **Deprecated:** 
  Use 'getDuration(_ id: DesignBlockID)' instead.
  

```swift
@MainActor func getTotalDuration(scene: DesignBlockID) throws -> Double
```

Returns the total duration (in seconds) of a scene in video mode. The duration is defined by all blocks in the scene. `scene`

### getTransition(_:)

```swift
@MainActor func getTransition(_ id: DesignBlockID) throws -> DesignBlockID
```

Gets the outgoing transition assigned to a clip. `id`

### getTrimLength(_:)

```swift
@MainActor func getTrimLength(_ id: DesignBlockID) throws -> Double
```

Get the trim length of the given block or fill. `id`

### getTrimOffset(_:)

```swift
@MainActor func getTrimOffset(_ id: DesignBlockID) throws -> Double
```

Get the trim offset of this block. `id`

### getType(_:)

```swift
@MainActor func getType(_ id: DesignBlockID) throws -> String
```

Get the type of the given block, fails if the block is invalid. `id`

### getType(ofProperty:)

```swift
@MainActor func getType(ofProperty property: String) throws -> PropertyType
```

Get the type of a property given its name. `property`

### getTypeface(_:)

```swift
@MainActor func getTypeface(_ id: DesignBlockID) throws -> Typeface
```

Returns the typeface property of the text block. Does not return the typefaces of the text runs. `id`

### getTypefaces(_:in:)

```swift
@MainActor func getTypefaces(_ id: DesignBlockID, in subrange: Range<String.Index>? = nil) throws -> [Typeface]
```

Returns the typefaces of the text block. `id`

### getURL(_:property:)

```swift
@MainActor func getURL(_ id: DesignBlockID, property: String) throws -> URL
```

Get the value of a URL property of the given design block. `id`

### getUUID(_:)

```swift
@MainActor func getUUID(_ id: DesignBlockID) throws -> String
```

Get a block’s unique identifier. `id`

### getVideoHeight(_:)

```swift
@MainActor func getVideoHeight(_ id: DesignBlockID) throws -> Int
```

Get the video height in pixels of the video resource that is attached to the given block. `id`

### getVideoWidth(_:)

```swift
@MainActor func getVideoWidth(_ id: DesignBlockID) throws -> Int
```

Get the video width in pixels of the video resource that is attached to the given block. `id`

### getVolume(_:)

```swift
@MainActor func getVolume(_ id: DesignBlockID) throws -> Float
```

Get the audio volume of the given block. `id`

### getWidth(_:)

```swift
@MainActor func getWidth(_ id: DesignBlockID) throws -> Float
```

Query a block’s width. `id`

### getWidthMode(_:)

```swift
@MainActor func getWidthMode(_ id: DesignBlockID) throws -> SizeMode
```

Query a block’s mode for its width. `id`

### group(_:)

```swift
@MainActor func group(_ ids: [DesignBlockID]) throws -> DesignBlockID
```

Group blocks together. `ids`

### hasBackgroundColor(_:)

> **Deprecated:** Use 'supportsBackgroundColor(_:)' instead. Renamed to `supportsBackgroundColor(_:)`.

```swift
@MainActor func hasBackgroundColor(_ id: DesignBlockID) throws -> Bool
```

Query if the given block has background color properties. `id`

### hasBlendMode(_:)

> **Deprecated:** Use 'supportsBlendMode(_:)' instead. Renamed to `supportsBlendMode(_:)`.

```swift
@MainActor func hasBlendMode(_ id: DesignBlockID) throws -> Bool
```

Query if the given block has a blend mode. `id`

### hasBlur(_:)

> **Deprecated:** Use 'supportsBlur(_:)' instead. Renamed to `supportsBlur(_:)`.

```swift
@MainActor func hasBlur(_ id: DesignBlockID) throws -> Bool
```

Checks whether the block supports blur. `id`

### hasContentFillMode(_:)

> **Deprecated:** Use 'supportsContentFillMode(_:)' instead. Renamed to `supportsContentFillMode(_:)`.

```swift
@MainActor func hasContentFillMode(_ id: DesignBlockID) throws -> Bool
```

Query if the given block has a content fill mode. `id`

### hasCrop(_:)

> **Deprecated:** Use 'supportsCrop(_:)' instead. Renamed to `supportsCrop(_:)`.

```swift
@MainActor func hasCrop(_ id: DesignBlockID) throws -> Bool
```

Query if the given block has crop properties. `id`

### hasDropShadow(_:)

> **Deprecated:** Use 'supportsDropShadow(_:)' instead. Renamed to `supportsDropShadow(_:)`.

```swift
@MainActor func hasDropShadow(_ id: DesignBlockID) throws -> Bool
```

Query if the given block has a drop shadow property. `id`

### hasDuration(_:)

> **Deprecated:** Use 'supportsDuration(_:)' instead. Renamed to `supportsDuration(_:)`.

```swift
@MainActor func hasDuration(_ id: DesignBlockID) throws -> Bool
```

Returns whether the block has a duration property. `id`

### hasEffectEnabled(effectID:)

> **Deprecated:** 
  Calls to this function can be removed. All effects can be enabled and disabled.
  

```swift
@MainActor func hasEffectEnabled(effectID: DesignBlockID) throws -> Bool
```

Checks whether an ‘effect’ block may be enabled and disabled. `effectID`

### hasEffects(_:)

> **Deprecated:** Use 'supportsEffects(_:)' instead. Renamed to `supportsEffects(_:)`.

```swift
@MainActor func hasEffects(_ id: DesignBlockID) throws -> Bool
```

Queries whether the block supports effects. `id`

### hasFill(_:)

> **Deprecated:** Use 'supportsFill(_:)' instead. Renamed to `supportsFill(_:)`.

```swift
@MainActor func hasFill(_ id: DesignBlockID) throws -> Bool
```

Query if the given block has fill color properties. `id`

### hasMetadata(_:key:)

```swift
@MainActor func hasMetadata(_ id: DesignBlockID, key: String) throws -> Bool
```

Check if the block has metadata associated with the key. `id`

### hasOpacity(_:)

> **Deprecated:** Use 'supportsOpacity(_:)' instead. Renamed to `supportsOpacity(_:)`.

```swift
@MainActor func hasOpacity(_ id: DesignBlockID) throws -> Bool
```

Query if the given block has an opacity. `id`

### hasPlaceholderBehavior(_:)

> **Deprecated:** Use 'supportsPlaceholderBehavior(_:)' instead. Renamed to `supportsPlaceholderBehavior(_:)`.

```swift
@MainActor func hasPlaceholderBehavior(_ id: DesignBlockID) throws -> Bool
```

Query if the given block supports placeholder behavior. `id`

### hasPlaceholderControls(_:)

> **Deprecated:** Use 'supportsPlaceholderControls(_:)' instead. Renamed to `supportsPlaceholderControls(_:)`.

```swift
@MainActor func hasPlaceholderControls(_ id: DesignBlockID) throws -> Bool
```

Checks whether the block supports placeholder controls. `id`

### hasPlaybackControl(_:)

> **Deprecated:** Use 'supportsPlaybackControl(_:)' instead. Renamed to `supportsPlaybackControl(_:)`.

```swift
@MainActor func hasPlaybackControl(_ id: DesignBlockID) throws -> Bool
```

Returns whether the block supports a playback control. `id`

### hasPlaybackTime(_:)

> **Deprecated:** Use 'supportsPlaybackTime(_:)' instead. Renamed to `supportsPlaybackTime(_:)`.

```swift
@MainActor func hasPlaybackTime(_ id: DesignBlockID) throws -> Bool
```

Returns whether the block has a playback time property. `id`

### hasShape(_:)

> **Deprecated:** Use 'supportsShape(_:)' instead. Renamed to `supportsShape(_:)`.

```swift
@MainActor func hasShape(_ id: DesignBlockID) throws -> Bool
```

Query if the given block has a shape property. `id`

### hasStroke(_:)

> **Deprecated:** Use 'supportsStroke(_:)' instead. Renamed to `supportsStroke(_:)`.

```swift
@MainActor func hasStroke(_ id: DesignBlockID) throws -> Bool
```

Query if the given block has a stroke property. `id`

### hasTimeOffset(_:)

> **Deprecated:** Use 'supportsTimeOffset(_:)' instead. Renamed to `supportsTimeOffset(_:)`.

```swift
@MainActor func hasTimeOffset(_ id: DesignBlockID) throws -> Bool
```

Returns whether the block has a time offset property. `id`

### hasTrim(_:)

> **Deprecated:** Use 'supportsTrim(_:)' instead. Renamed to `supportsTrim(_:)`.

```swift
@MainActor func hasTrim(_ id: DesignBlockID) throws -> Bool
```

Returns whether the block has trim properties. `id`

### insertChild(into:child:at:)

```swift
@MainActor func insertChild(into parent: DesignBlockID, child: DesignBlockID, at index: Int) throws
```

Insert a new or existing child at a certain position in the parent’s children. Required scope: “editor/add” `parent`

### insertEffect(_:effectID:index:)

```swift
@MainActor func insertEffect(_ id: DesignBlockID, effectID: DesignBlockID, index: Int) throws
```

Inserts an effect at the given index into the list of effects of the given block. The same effect can appear multiple times in the list and won’t be removed if appended again. Required scope: “appearance/effect” `id`

### isAlignable(_:)

```swift
@MainActor func isAlignable(_ ids: [DesignBlockID]) throws -> Bool
```

Confirms that a given set of blocks can be aligned. `ids`

### isAllowedByScope(_:key:)

```swift
@MainActor func isAllowedByScope(_ id: DesignBlockID, key: String) throws -> Bool
```

Check if a scope is allowed for a given block. `id`

### isAlwaysOnBottom(_:)

```swift
@MainActor func isAlwaysOnBottom(_ id: DesignBlockID) throws -> Bool
```

If a block is set to be always-on-bottom. `id`

### isAlwaysOnTop(_:)

```swift
@MainActor func isAlwaysOnTop(_ id: DesignBlockID) throws -> Bool
```

If a block is set to be always-on-top. `id`

### isBackgroundColorEnabled(_:)

```swift
@MainActor func isBackgroundColorEnabled(_ id: DesignBlockID) throws -> Bool
```

Query if the background of the given design block is enabled. `id`

### isBlurEnabled(_:)

```swift
@MainActor func isBlurEnabled(_ id: DesignBlockID) throws -> Bool
```

Query if blur is enabled for the given block. `id`

### isClipped(_:)

```swift
@MainActor func isClipped(_ id: DesignBlockID) throws -> Bool
```

Query a block’s clipped state. If `true`, the block should clip `id`

### isCombinable(_:)

```swift
@MainActor func isCombinable(_ ids: [DesignBlockID]) throws -> Bool
```

Checks whether blocks could be combined. Only graphics blocks and text blocks can be combined. All blocks must have the “lifecycle/duplicate” scope enabled. `ids`

### isCropAspectRatioLocked(_:)

```swift
@MainActor func isCropAspectRatioLocked(_ id: DesignBlockID) throws -> Bool
```

Check if the crop aspect ratio is locked for the given block. When locked, crop handles will maintain the current aspect ratio during resize. `id`

### isDistributable(_:)

```swift
@MainActor func isDistributable(_ ids: [DesignBlockID]) throws -> Bool
```

Confirms that a given set of blocks can be distributed. `ids`

### isDropShadowEnabled(_:)

```swift
@MainActor func isDropShadowEnabled(_ id: DesignBlockID) throws -> Bool
```

Query if the drop shadow of the given design block is enabled. `id`

### isEffectEnabled(effectID:)

```swift
@MainActor func isEffectEnabled(effectID: DesignBlockID) throws -> Bool
```

Queries whether an ‘effect’ block is enabled and therefore applies its effect. `effectID`

### isFillEnabled(_:)

```swift
@MainActor func isFillEnabled(_ id: DesignBlockID) throws -> Bool
```

Query if the fill of the given design block is enabled. `id`

### isForceMuted(_:)

```swift
@MainActor func isForceMuted(_ id: DesignBlockID) throws -> Bool
```

Query whether the block is muted due to engine constraints. `id`

### isGroupable(_:)

```swift
@MainActor func isGroupable(_ ids: [DesignBlockID]) throws -> Bool
```

Confirms that a given set of blocks can be grouped together. `ids`

### isIncludedInExport(_:)

```swift
@MainActor func isIncludedInExport(_ id: DesignBlockID) throws -> Bool
```

Check if the given block is included on the exported result. `id`

### isLineOrigin(_:)

```swift
@MainActor func isLineOrigin(_ id: DesignBlockID) throws -> Bool
```

Checks whether a graphic block originated as a line shape. Stays `true` after the user enters vector-edit mode and resets only when `setShape` replaces the shape with a non-line shape. `id`

### isLooping(_:)

```swift
@MainActor func isLooping(_ id: DesignBlockID) throws -> Bool
```

Query whether the block is looping. `id`

### isMuted(_:)

```swift
@MainActor func isMuted(_ id: DesignBlockID) throws -> Bool
```

Query whether the block is muted. `id`

### isPageDurationSource(_:)

```swift
@MainActor func isPageDurationSource(_ id: DesignBlockID) throws -> Bool
```

Returns whether the block is a duration source block. `id`

### isPlaceholderBehaviorEnabled(_:)

```swift
@MainActor func isPlaceholderBehaviorEnabled(_ id: DesignBlockID) throws -> Bool
```

Query if the given block has placeholder behavior enabled. `id`

### isPlaceholderControlsButtonEnabled(_:)

```swift
@MainActor func isPlaceholderControlsButtonEnabled(_ id: DesignBlockID) throws -> Bool
```

Query whether the placeholder button for a block is shown. `id`

### isPlaceholderControlsOverlayEnabled(_:)

```swift
@MainActor func isPlaceholderControlsOverlayEnabled(_ id: DesignBlockID) throws -> Bool
```

Query whether the placeholder overlay pattern for a block is shown. `id`

### isPlaceholderEnabled(_:)

```swift
@MainActor func isPlaceholderEnabled(_ id: DesignBlockID) throws -> Bool
```

Query whether the placeholder function for a block is enabled. `id`

### isPlaying(_:)

```swift
@MainActor func isPlaying(_ id: DesignBlockID) throws -> Bool
```

Returns whether the block is currently during active playback. `id`

### isPropertyReadable(property:)

```swift
@MainActor func isPropertyReadable(property: String) throws -> Bool
```

Check if a property with a given name is readable. `property`

### isPropertyWritable(property:)

```swift
@MainActor func isPropertyWritable(property: String) throws -> Bool
```

Check if a property with a given name is writable. `property`

### isScopeEnabled(_:key:)

```swift
@MainActor func isScopeEnabled(_ id: DesignBlockID, key: String) throws -> Bool
```

Query whether a scope is enabled for a given block. `id`

### isSelected(_:)

```swift
@MainActor func isSelected(_ id: DesignBlockID) throws -> Bool
```

Get the selected state of a block. `id`

### isSoloPlaybackEnabled(_:)

```swift
@MainActor func isSoloPlaybackEnabled(_ id: DesignBlockID) throws -> Bool
```

Return whether the given block or fill is currently set to play its contents while the rest of the scene remains paused. `id`

### isStrokeEnabled(_:)

```swift
@MainActor func isStrokeEnabled(_ id: DesignBlockID) throws -> Bool
```

Query if the stroke of the given design block is enabled. `id`

### isTransformLocked(_:)

```swift
@MainActor func isTransformLocked(_ id: DesignBlockID) throws -> Bool
```

Query a block’s transform locked state. If `true`, the block’s transform can’t be changed. `id`

### isValid(_:)

```swift
@MainActor func isValid(_ id: DesignBlockID) -> Bool
```

Check if a block is valid. A block becomes invalid once it has been destroyed. `id`

### isVisible(_:)

```swift
@MainActor func isVisible(_ id: DesignBlockID) throws -> Bool
```

Query a block’s visibility. `id`

### isVisibleAtCurrentPlaybackTime(_:)

```swift
@MainActor func isVisibleAtCurrentPlaybackTime(_ id: DesignBlockID) throws -> Bool
```

Returns whether the block is visible on the canvas at the current playback time. `id`

### load(from:)-87kwi

```swift
@MainActor func load(from url: URL) async throws -> [DesignBlockID]
```

Loads existing blocks from a URL. The URL should point to a blocks file within an unzipped archive directory previously saved with `block.saveToArchive`. The blocks are not attached by default and won’t be visible until attached to a page or the scene. The UUID of the loaded blocks is replaced with a new one. `url`

### load(from:)-g5ls

```swift
@MainActor func load(from string: String) async throws -> [DesignBlockID]
```

Loads existing blocks from the given string. The blocks are not attached by default and won’t be visible until attached to a page or the scene. The UUID of the loaded blocks is replaced with a new one. `string`

### loadArchive(from:)

```swift
@MainActor func loadArchive(from url: URL) async throws -> [DesignBlockID]
```

Loads existing blocks from an archive. The URL should be that of a file previously saved with `block.saveToArchive`. The blocks are not attached by default and won’t be visible until attached to a page or the scene. The UUID of the loaded blocks is replaced with a new one. `url`

### onClicked

```swift
@MainActor var onClicked: AsyncStream<DesignBlockID> { get }
```

Subscribe to block click events.

### onClickedPublisher

```swift
@MainActor var onClickedPublisher: AnyPublisher<DesignBlockID, Never> { get }
```

Subscribe to block click events.

### onSelectionChanged

```swift
@MainActor var onSelectionChanged: AsyncStream<Void> { get }
```

Subscribe to changes in the current set of selected blocks.

### onSelectionChangedPublisher

```swift
@MainActor var onSelectionChangedPublisher: AnyPublisher<Void, Never> { get }
```

Subscribe to changes in the current set of selected blocks.

### onStateChanged(_:)

```swift
@MainActor func onStateChanged(_ ids: [DesignBlockID]) -> AsyncStream<[DesignBlockID]>
```

Subscribe to changes to the state of a block. `ids`

### onStateChangedPublisher(_:)

```swift
@MainActor func onStateChangedPublisher(_ ids: [DesignBlockID]) -> AnyPublisher<[DesignBlockID], Never>
```

Subscribe to changes to the state of a block. `ids`

### referencesAnyVariables(_:)

```swift
@MainActor func referencesAnyVariables(_ id: DesignBlockID) throws -> Bool
```

Checks whether the given block references any variables. Doesn’t check the block’s children. `id`

### removeEffect(_:index:)

```swift
@MainActor func removeEffect(_ id: DesignBlockID, index: Int) throws
```

Removes the effect at the given index. Required scope: “appearance/effect” `id`

### removeMetadata(_:key:)

```swift
@MainActor func removeMetadata(_ id: DesignBlockID, key: String) throws
```

Remove metadata associated with the key from the given block. `id`

### removePageDurationSource(_:)

```swift
@MainActor func removePageDurationSource(_ id: DesignBlockID) throws
```

Remove the block as duration source block for the page. If a scene or page is given as block, it is deactivated for all blocks in the scene or page. `id`

### removeText(_:from:)

```swift
@MainActor func removeText(_ id: DesignBlockID, from subrange: Range<String.Index>? = nil) throws
```

Removes selected range of text of the given text block. Required scope: “text/edit” `id`

### removeTransition(_:)

```swift
@MainActor func removeTransition(_ id: DesignBlockID) throws
```

Removes the outgoing transition of a clip. `id`

### replaceText(_:text:in:)

```swift
@MainActor func replaceText(_ id: DesignBlockID, text: String, in subrange: Range<String.Index>? = nil) throws
```

Replaces the given text in the selected range of the text block. Required scope: “text/edit” `id`

### resetCrop(_:)

```swift
@MainActor func resetCrop(_ id: DesignBlockID) throws
```

Resets the manually set crop of the given design block. The block’s content fill mode is set to `.cover`. If the block has a fill, the crop values are updated so that it covers the block. Required scope: “layer/crop” `id`

### resizeContentAware(_:width:height:)

```swift
@MainActor func resizeContentAware(_ ids: [DesignBlockID], width: Float, height: Float) throws
```

Resize all blocks to the given size. The content of the blocks is automatically adjusted to fit the new dimensions. Required scope: “layer/resize” `ids`

### saveToArchive(blocks:)

```swift
@MainActor func saveToArchive(blocks: [DesignBlockID]) async throws -> Blob
```

Saves the given blocks and all of their referenced assets into an archive. The archive contains all assets that were accessible when this function was called. Blocks in the archived scene reference assets relative from to the location of the scene file. These references are resolved when loading such a scene via `scene.load(from url:)`. `blocks`

### saveToString(blocks:allowedResourceSchemes:onDisallowedResourceScheme:)

```swift
@MainActor func saveToString(blocks: [DesignBlockID], allowedResourceSchemes: [String] = ["bundle", "file", "http", "https"], onDisallowedResourceScheme: (@MainActor @Sendable (URL, String) async -> URL)? = nil) async throws -> String
```

Saves the given blocks into a string. If given the root of a block hierarchy, e.g. a page with multiple children, the entire hierarchy is saved. `blocks`

### scale(_:to:anchorX:anchorY:)

```swift
@MainActor func scale(_ id: DesignBlockID, to scale: Float, anchorX: Float = 0, anchorY: Float = 0) throws
```

Scales the block and all of its children proportionally around the specified relative anchor point. This updates the position, size and style properties (e.g. stroke width) of the block and its children. Required scope: “layer/resize” `id`

### select(_:)

```swift
@MainActor func select(_ id: DesignBlockID) throws
```

Selects the given block and deselects all other blocks. `id`

### sendBackward(_:)

```swift
@MainActor func sendBackward(_ id: DesignBlockID) throws
```

Updates the sorting order of this block and all of its manually created and subjacent siblings so that the given block will have a lower sorting order than the next subjacent sibling. If the block is parented to a track, it is first moved up in the hierarchy. Empty tracks and empty groups are passed by. `id`

### sendToBack(_:)

```swift
@MainActor func sendToBack(_ id: DesignBlockID) throws
```

Updates the sorting order of this block and all of its manually created siblings so that the given block has the lowest sorting order. If the block is parented to a track, it is first moved up in the hierarchy. `id`

### setAlwaysOnBottom(_:enabled:)

```swift
@MainActor func setAlwaysOnBottom(_ id: DesignBlockID, enabled: Bool) throws
```

Set a block to be always-on-bottom. If true, this blocks’s global sorting order is automatically adjusted to be lower than all other siblings without this property. If more than one block is set to be always-on-bottom, the child order decides which is on the bottom. `id`

### setAlwaysOnTop(_:enabled:)

```swift
@MainActor func setAlwaysOnTop(_ id: DesignBlockID, enabled: Bool) throws
```

Set a block to be always-on-top. If true, this blocks’s global sorting order is automatically adjusted to be higher than all other siblings without this property. If more than one block is set to be always-on-top, the child order decides which is on top. `id`

### setAudioFadeIn(_:duration:easing:)

```swift
@MainActor func setAudioFadeIn(_ id: DesignBlockID, duration: Double, easing: AnimationEasing = .linear) throws
```

Set an audio fade-in for the given block. The audio ramps up from silence to the block’s volume over the given duration at the start of the block. `id`

### setAudioFadeOut(_:duration:easing:)

```swift
@MainActor func setAudioFadeOut(_ id: DesignBlockID, duration: Double, easing: AnimationEasing = .linear) throws
```

Set an audio fade-out for the given block. The audio ramps down from the block’s volume to silence over the given duration at the end of the block. `id`

### setBackgroundColor(_:r:g:b:a:)

```swift
@MainActor func setBackgroundColor(_ id: DesignBlockID, r: Float, g: Float, b: Float, a: Float = 1) throws
```

Set the background color of the given design block. Required scope: “fill/change” `id`

### setBackgroundColorEnabled(_:enabled:)

```swift
@MainActor func setBackgroundColorEnabled(_ id: DesignBlockID, enabled: Bool) throws
```

Enable or disable the background of the given design block. Required scope: “fill/change” `id`

### setBlendMode(_:mode:)

```swift
@MainActor func setBlendMode(_ id: DesignBlockID, mode: BlendMode) throws
```

Set the blend mode of the given design block. Required scope: “layer/blendMode” `id`

### setBlur(_:blurID:)

```swift
@MainActor func setBlur(_ id: DesignBlockID, blurID: DesignBlockID) throws
```

Connects `block`’s blur to the given `blur` block. Required scope: “appearance/blur” `id`

### setBlurEnabled(_:enabled:)

```swift
@MainActor func setBlurEnabled(_ id: DesignBlockID, enabled: Bool) throws
```

Enable or disable the blur of the given design block. `id`

### setBool(_:property:value:)

```swift
@MainActor func setBool(_ id: DesignBlockID, property: String, value: Bool) throws
```

Set a bool property of the given design block to the given value. `id`

### setClipped(_:clipped:)

```swift
@MainActor func setClipped(_ id: DesignBlockID, clipped: Bool) throws
```

Update a block’s clipped state. Required scope: “layer/clipping” `id`

### setColor(_:property:color:)

```swift
@MainActor func setColor(_ id: DesignBlockID, property: String, color: Color) throws
```

Set a color property of the given design block to the given value. `id`

### setColor(_:property:r:g:b:a:)

> **Deprecated:** 
    Use 'setColor(id: DesignBlockID, property: String, color: Color)' instead.
    

```swift
@MainActor func setColor(_ id: DesignBlockID, property: String, r: Float, g: Float, b: Float, a: Float = 1) throws
```

Set a color property of the given design block to the given value. `id`

### setColorSpot(_:property:name:tint:)

> **Deprecated:** 
    Use 'setColor(id: DesignBlockID, property: String, color: Color)' instead.
    

```swift
@MainActor func setColorSpot(_ id: DesignBlockID, property: String, name: String, tint: Float = 1) throws
```

Set a color property of the given design block to the given value. `id`

### setContentFillHorizontalAlignment(_:alignment:)

```swift
@MainActor func setContentFillHorizontalAlignment(_ id: DesignBlockID, alignment: HorizontalContentFillAlignment) throws
```

Set the horizontal alignment of the content fill inside the block. `id`

### setContentFillMode(_:mode:)

```swift
@MainActor func setContentFillMode(_ id: DesignBlockID, mode: ContentFillMode) throws
```

Set a block’s content fill mode. Required scope: “layer/crop” `id`

### setContentFillVerticalAlignment(_:alignment:)

```swift
@MainActor func setContentFillVerticalAlignment(_ id: DesignBlockID, alignment: VerticalContentFillAlignment) throws
```

Set the vertical alignment of the content fill inside the block. `id`

### setCropAspectRatioLocked(_:locked:)

```swift
@MainActor func setCropAspectRatioLocked(_ id: DesignBlockID, locked: Bool) throws
```

Set whether the crop aspect ratio should be locked for the given block. When enabled, the block will have a FixedAspectRatioTag and crop handles will maintain aspect ratio. When disabled, the FixedAspectRatioTag will be removed and free resizing is allowed. Required scope: “layer/crop” `id`

### setCropRotation(_:rotation:)

```swift
@MainActor func setCropRotation(_ id: DesignBlockID, rotation: Float) throws
```

Set the crop rotation of the given design block. Required scope: “layer/crop” `id`

### setCropScaleRatio(_:scaleRatio:)

```swift
@MainActor func setCropScaleRatio(_ id: DesignBlockID, scaleRatio: Float) throws
```

Set the crop scale ratio of the given design block. This will uniformly scale the content up or down. The center of the scale operation is the center of the crop frame. Required scope: “layer/crop” `id`

### setCropScaleX(_:scaleX:)

```swift
@MainActor func setCropScaleX(_ id: DesignBlockID, scaleX: Float) throws
```

Set the crop scale in x direction of the given design block. Required scope: “layer/crop” `id`

### setCropScaleY(_:scaleY:)

```swift
@MainActor func setCropScaleY(_ id: DesignBlockID, scaleY: Float) throws
```

Set the crop scale in y direction of the given design block. Required scope: “layer/crop” `id`

### setCropTranslationX(_:translationX:)

```swift
@MainActor func setCropTranslationX(_ id: DesignBlockID, translationX: Float) throws
```

Set the crop translation in x direction of the given design block. Required scope: “layer/crop”

### setCropTranslationY(_:translationY:)

```swift
@MainActor func setCropTranslationY(_ id: DesignBlockID, translationY: Float) throws
```

Set the crop translation in y direction of the given design block. Required scope: “layer/crop” `id`

### setDouble(_:property:value:)

```swift
@MainActor func setDouble(_ id: DesignBlockID, property: String, value: Double) throws
```

Set a double property of the given design block to the given value. `id`

### setDropShadowBlurRadiusX(_:blurRadiusX:)

```swift
@MainActor func setDropShadowBlurRadiusX(_ id: DesignBlockID, blurRadiusX: Float) throws
```

Set the drop shadow’s blur radius on the X axis of the given design block. Required scope: “appearance/shadow” `id`

### setDropShadowBlurRadiusY(_:blurRadiusY:)

```swift
@MainActor func setDropShadowBlurRadiusY(_ id: DesignBlockID, blurRadiusY: Float) throws
```

Set the drop shadow’s blur radius on the Y axis of the given design block. Required scope: “appearance/shadow” `id`

### setDropShadowClip(_:clip:)

```swift
@MainActor func setDropShadowClip(_ id: DesignBlockID, clip: Bool) throws
```

Set the drop shadow’s clipping of the given design block. (Only applies to shapes.) Required scope: “appearance/shadow” `id`

### setDropShadowColor(_:color:)

```swift
@MainActor func setDropShadowColor(_ id: DesignBlockID, color: Color) throws
```

Set the drop shadow color of the given design block. Required scope: “appearance/shadow” `id`

### setDropShadowColor(_:r:g:b:a:)

> **Deprecated:** 
    Use 'setDropShadowColor(id: DesignBlockID, color: Color)' instead.
    

```swift
@MainActor func setDropShadowColor(_ id: DesignBlockID, r: Float, g: Float, b: Float, a: Float = 1) throws
```

Set the drop shadow color of the given design block. Required scope: “appearance/shadow” `id`

### setDropShadowEnabled(_:enabled:)

```swift
@MainActor func setDropShadowEnabled(_ id: DesignBlockID, enabled: Bool) throws
```

Enable or disable the drop shadow of the given design block. Required scope: “appearance/shadow” `id`

### setDropShadowOffsetX(_:offsetX:)

```swift
@MainActor func setDropShadowOffsetX(_ id: DesignBlockID, offsetX: Float) throws
```

Set the drop shadow’s X offset of the given design block. Required scope: “appearance/shadow” `id`

### setDropShadowOffsetY(_:offsetY:)

```swift
@MainActor func setDropShadowOffsetY(_ id: DesignBlockID, offsetY: Float) throws
```

Set the drop shadow’s Y offset of the given design block. Required scope: “appearance/shadow” `id`

### setDuration(_:duration:)

```swift
@MainActor func setDuration(_ id: DesignBlockID, duration: Double) throws
```

Set the playback duration of the given block in seconds. The duration defines for how long the block is active in the scene during playback. If a duration is set on the page block, it becomes the duration source block. `id`

### setEffectEnabled(effectID:enabled:)

```swift
@MainActor func setEffectEnabled(effectID: DesignBlockID, enabled: Bool) throws
```

Sets the enabled state of an ‘effect’ block. `effectID`

### setEnum(_:property:value:)

```swift
@MainActor func setEnum(_ id: DesignBlockID, property: String, value: String) throws
```

Set an enum property of the given design block to the given value. `id`

### setFill(_:fill:)

```swift
@MainActor func setFill(_ id: DesignBlockID, fill: DesignBlockID) throws
```

Sets the block containing the fill properties of the given block. `id`

### setFillEnabled(_:enabled:)

```swift
@MainActor func setFillEnabled(_ id: DesignBlockID, enabled: Bool) throws
```

Enable or disable the fill of the given design block. Required scope: “fill/change” `id`

### setFillOverprint(_:overprint:)

```swift
@MainActor func setFillOverprint(_ id: DesignBlockID, overprint: Bool) throws
```

Mark the fill of the given design block as overprint for PDF export. `id`

### setFillSolidColor(_:r:g:b:a:)

```swift
@MainActor func setFillSolidColor(_ id: DesignBlockID, r: Float, g: Float, b: Float, a: Float = 1) throws
```

Set the fill color of the given design block. Required scope: “fill/change” `id`

### setFlipHorizontal(_:flip:)

```swift
@MainActor func setFlipHorizontal(_ id: DesignBlockID, flip: Bool) throws
```

Update a block’s horizontal flip. Required scope: “layer/flip” `id`

### setFlipVertical(_:flip:)

```swift
@MainActor func setFlipVertical(_ id: DesignBlockID, flip: Bool) throws
```

Update a block’s vertical flip. Required scope: “layer/flip” `id`

### setFloat(_:property:value:)

```swift
@MainActor func setFloat(_ id: DesignBlockID, property: String, value: Float) throws
```

Set a float property of the given design block to the given value. `id`

### setFont(_:fontFileURL:typeface:)

```swift
@MainActor func setFont(_ id: DesignBlockID, fontFileURL: URL, typeface: Typeface) throws
```

Sets the given font and typeface for the text block. Existing formatting is reset. Required scope: “text/character” `id`

### setGradientColorStops(_:property:colors:)

```swift
@MainActor func setGradientColorStops(_ id: DesignBlockID, property: String, colors: [GradientColorStop]) throws
```

Set a gradient color stops property of the given design block. `id`

### setHeight(_:value:maintainCrop:)

```swift
@MainActor func setHeight(_ id: DesignBlockID, value: Float, maintainCrop: Bool = false) throws
```

Update a block’s height and optionally maintain the crop. If the crop is maintained, the crop values will be automatically adjusted. The content fill mode `Cover` is only kept if the `features/transformEditsRetainCoverMode` setting is enabled, otherwise it will change to `Crop`. If the size of a group is changed, both dimensions are modified and the aspect ratio of the group is kept. Required scope: “layer/resize” `id`

### setHeightMode(_:mode:)

```swift
@MainActor func setHeightMode(_ id: DesignBlockID, mode: SizeMode) throws
```

Set a block’s mode for its height. Required scope: “layer/resize” `id`

### setInAnimation(_:animation:)

```swift
@MainActor func setInAnimation(_ id: DesignBlockID, animation: DesignBlockID) throws
```

Set the “in” animation of the given block. `id`

### setIncludedInExport(_:enabled:)

```swift
@MainActor func setIncludedInExport(_ id: DesignBlockID, enabled: Bool) throws
```

Set whether you want the given design block to be included in exported result. `id`

### setInt(_:property:value:)

```swift
@MainActor func setInt(_ id: DesignBlockID, property: String, value: Int) throws
```

Set an int property of the given design block to the given value.

### setKind(_:kind:)

```swift
@MainActor func setKind(_ id: DesignBlockID, kind: String) throws
```

Get the kind of the given block, fails if the block is invalid. `id`

### setLoopAnimation(_:animation:)

```swift
@MainActor func setLoopAnimation(_ id: DesignBlockID, animation: DesignBlockID) throws
```

Set the “loop” animation of the given block. `id`

### setLooping(_:looping:)

```swift
@MainActor func setLooping(_ id: DesignBlockID, looping: Bool) throws
```

Set whether the block should start from the beginning again or stop. `id`

### setMetadata(_:key:value:)

```swift
@MainActor func setMetadata(_ id: DesignBlockID, key: String, value: String) throws
```

Set a metadata value of a block identified by a key. If the key does not exist, yet, it will be added. `id`

### setMuted(_:muted:)

```swift
@MainActor func setMuted(_ id: DesignBlockID, muted: Bool) throws
```

Set whether the audio of the block is muted. `id`

### setName(_:name:)

```swift
@MainActor func setName(_ id: DesignBlockID, name: String) throws
```

Update a block’s name. `id`

### setNativePixelBuffer(_:buffer:)

```swift
@MainActor func setNativePixelBuffer(_ id: DesignBlockID, buffer: CVPixelBuffer) throws
```

Update the pixels of the given pixel stream fill block. `id`

### setOpacity(_:value:)

```swift
@MainActor func setOpacity(_ id: DesignBlockID, value: Float) throws
```

Set the opacity of the given design block. Required scope: “layer/opacity” `id`

### setOutAnimation(_:animation:)

```swift
@MainActor func setOutAnimation(_ id: DesignBlockID, animation: DesignBlockID) throws
```

Set the “out” animation of the given block. `id`

### setPageDurationSource(_:id:)

```swift
@MainActor func setPageDurationSource(_ page: DesignBlockID, id: DesignBlockID) throws
```

Set a block as duration source so that the overall page duration is automatically determined by this. If no defining block is set, the page duration is calculated over all children. Only one block per page can be marked as duration source. Will automatically unmark the previously marked. Note: This is only supported for blocks that have a duration. `page`

### setPlaceholderBehaviorEnabled(_:enabled:)

```swift
@MainActor func setPlaceholderBehaviorEnabled(_ id: DesignBlockID, enabled: Bool) throws
```

Enable or disable the placeholder behavior for a block. `id`

### setPlaceholderControlsButtonEnabled(_:enabled:)

```swift
@MainActor func setPlaceholderControlsButtonEnabled(_ id: DesignBlockID, enabled: Bool) throws
```

Enable or disable the visibility of the placeholder button for a block. `id`

### setPlaceholderControlsOverlayEnabled(_:enabled:)

```swift
@MainActor func setPlaceholderControlsOverlayEnabled(_ id: DesignBlockID, enabled: Bool) throws
```

Enable or disable the visibility of the placeholder overlay pattern for a block. `id`

### setPlaceholderEnabled(_:enabled:)

```swift
@MainActor func setPlaceholderEnabled(_ id: DesignBlockID, enabled: Bool) throws
```

Enable or disable the placeholder function for a block. `id`

### setPlaybackSpeed(_:speed:)

```swift
@MainActor func setPlaybackSpeed(_ id: DesignBlockID, speed: Float) throws
```

Set the playback speed multiplier for the given block. `id`

### setPlaybackTime(_:time:)

```swift
@MainActor func setPlaybackTime(_ id: DesignBlockID, time: Double) throws
```

Set the playback time of the given block. `id`

### setPlaying(_:enabled:)

```swift
@MainActor func setPlaying(_ id: DesignBlockID, enabled: Bool) throws
```

Set whether the block should be during active playback. `id`

### setPositionX(_:value:)

```swift
@MainActor func setPositionX(_ id: DesignBlockID, value: Float) throws
```

Update a block’s x position. The position refers to the block’s local space, relative to its parent with the origin at the top left. Required scope: “layer/move” `id`

### setPositionXMode(_:mode:)

```swift
@MainActor func setPositionXMode(_ id: DesignBlockID, mode: PositionMode) throws
```

Set a block’s mode for its x position. Required scope: “layer/move” `id`

### setPositionY(_:value:)

```swift
@MainActor func setPositionY(_ id: DesignBlockID, value: Float) throws
```

Update a block’s y position. The position refers to the block’s local space, relative to its parent with the origin at the top left. Required scope: “layer/move” `id`

### setPositionYMode(_:mode:)

```swift
@MainActor func setPositionYMode(_ id: DesignBlockID, mode: PositionMode) throws
```

Set a block’s mode for its y position. Required scope: “layer/move” `id`

### setRotation(_:radians:)

```swift
@MainActor func setRotation(_ id: DesignBlockID, radians: Float) throws
```

Update a block’s rotation. Required scope: “layer/rotate” `id`

### setScopeEnabled(_:key:enabled:)

```swift
@MainActor func setScopeEnabled(_ id: DesignBlockID, key: String, enabled: Bool) throws
```

Enable or disable a scope for a given block. `id`

### setSelected(_:selected:)

```swift
@MainActor func setSelected(_ id: DesignBlockID, selected: Bool) throws
```

Update the selection state of a block. `id`

### setShape(_:shape:)

```swift
@MainActor func setShape(_ id: DesignBlockID, shape: DesignBlockID) throws
```

Sets the block containing the shape properties of the given block. Note that the previous shape block is not destroyed automatically. Required scope: “shape/change” `id`

### setSoloPlaybackEnabled(_:enabled:)

```swift
@MainActor func setSoloPlaybackEnabled(_ id: DesignBlockID, enabled: Bool) throws
```

Set whether the given block or fill should play its contents while the rest of the scene remains paused. `id`

### setSourceSet(_:property:sourceSet:)

```swift
@MainActor func setSourceSet(_ id: DesignBlockID, property: String, sourceSet: [Source]) throws
```

Set the source set of the given block. The crop and content fill mode of the associated block will be set to the default values. `id`

### setState(_:state:)

```swift
@MainActor func setState(_ id: DesignBlockID, state: BlockState) throws
```

Set the state of a block. `id`

### setString(_:property:value:)

```swift
@MainActor func setString(_ id: DesignBlockID, property: String, value: String) throws
```

Set a string property of the given design block to the given value. `id`

### setStrokeCap(_:cap:)

> **Deprecated:** Use setStrokeStartCap(_:cap:) and setStrokeEndCap(_:cap:) to set each end independently.

```swift
@MainActor func setStrokeCap(_ id: DesignBlockID, cap: StrokeCap) throws
```

Set the stroke cap of the given design block. Writes both the start and end caps to the same value. Required scope: “stroke/change” `id`

### setStrokeColor(_:color:)

```swift
@MainActor func setStrokeColor(_ id: DesignBlockID, color: Color) throws
```

Set the stroke color of the given design block. Required scope: “stroke/change” `id`

### setStrokeColor(_:r:g:b:a:)

> **Deprecated:** 
    Use 'setStrokeColor(id: DesignBlockID, color: Color)' instead.
    

```swift
@MainActor func setStrokeColor(_ id: DesignBlockID, r: Float, g: Float, b: Float, a: Float = 1) throws
```

Set the stroke color of the given design block. Required scope: “stroke/change” `id`

### setStrokeCornerGeometry(_:cornerGeometry:)

```swift
@MainActor func setStrokeCornerGeometry(_ id: DesignBlockID, cornerGeometry: StrokeCornerGeometry) throws
```

Set the stroke corner geometry of the given design block. Required scope: “stroke/change” `id`

### setStrokeDashArray(_:dashArray:)

```swift
@MainActor func setStrokeDashArray(_ id: DesignBlockID, dashArray: [Float]) throws
```

Set a custom dash pattern for the given design block’s stroke. Semantics match SVG’s `stroke-dasharray`: alternating on/off lengths in design-unit space. When the pattern is non-empty it overrides the preset implied by `StrokeStyle`. Pass an empty array to fall back to the preset. Required scope: “stroke/change” `id`

### setStrokeDashEndCap(_:cap:)

```swift
@MainActor func setStrokeDashEndCap(_ id: DesignBlockID, cap: StrokeCap) throws
```

Set the cap geometry at the trailing edge of each dash piece (excluding the line’s actual end). Only takes effect when a dash pattern is active. Distinct from `setStrokeEndCap(_:cap:)`, which only applies to the end of the open path itself. Required scope: “stroke/change” `id`

### setStrokeDashOffset(_:dashOffset:)

```swift
@MainActor func setStrokeDashOffset(_ id: DesignBlockID, dashOffset: Float) throws
```

Set the dash offset of the given design block’s stroke. Semantics match SVG’s `stroke-dashoffset`. Ignored when the custom dash pattern is empty. Required scope: “stroke/change” `id`

### setStrokeDashStartCap(_:cap:)

```swift
@MainActor func setStrokeDashStartCap(_ id: DesignBlockID, cap: StrokeCap) throws
```

Set the cap geometry at the leading edge of each dash piece (excluding the line’s actual start). Only takes effect when a dash pattern is active. Distinct from `setStrokeStartCap(_:cap:)`, which only applies to the start of the open path itself. Required scope: “stroke/change” `id`

### setStrokeEnabled(_:enabled:)

```swift
@MainActor func setStrokeEnabled(_ id: DesignBlockID, enabled: Bool) throws
```

Enable or disable the stroke of the given design block. Required scope: “stroke/change” `id`

### setStrokeEndCap(_:cap:)

```swift
@MainActor func setStrokeEndCap(_ id: DesignBlockID, cap: StrokeCap) throws
```

Set the cap geometry at the end of an open stroked path. Required scope: “stroke/change” `id`

### setStrokeOverprint(_:overprint:)

```swift
@MainActor func setStrokeOverprint(_ id: DesignBlockID, overprint: Bool) throws
```

Mark the stroke of the given design block as overprint for PDF export. `id`

### setStrokePosition(_:position:)

```swift
@MainActor func setStrokePosition(_ id: DesignBlockID, position: StrokePosition) throws
```

Set the stroke position of the given design block. Required scope: “stroke/change” `id`

### setStrokeStartCap(_:cap:)

```swift
@MainActor func setStrokeStartCap(_ id: DesignBlockID, cap: StrokeCap) throws
```

Set the cap geometry at the start of an open stroked path. Pair with `setStrokeEndCap(_:cap:)` to set each end independently; `setStrokeCap(_:cap:)` remains as a both-ends shortcut. Required scope: “stroke/change” `id`

### setStrokeStyle(_:style:)

```swift
@MainActor func setStrokeStyle(_ id: DesignBlockID, style: StrokeStyle) throws
```

Set the stroke style of the given design block. Required scope: “stroke/change” `id`

### setStrokeWidth(_:width:)

```swift
@MainActor func setStrokeWidth(_ id: DesignBlockID, width: Float) throws
```

Set the stroke width of the given design block. Required scope: “stroke/change” `id`

### setTextCase(_:textCase:in:)

```swift
@MainActor func setTextCase(_ id: DesignBlockID, textCase: TextCase, in subrange: Range<String.Index>? = nil) throws
```

Sets the given text case for the selected range of text. Required scope: “text/character” `id`

### setTextColor(_:color:in:)

```swift
@MainActor func setTextColor(_ id: DesignBlockID, color: Color, in subrange: Range<String.Index>? = nil) throws
```

Changes the color of the text in the selected range to the given color. Required scope: “fill/change” `id`

### setTextCursorRange(_:)

```swift
@MainActor func setTextCursorRange(_ range: Range<String.Index>) throws
```

Sets the text cursor range (selection) within the text block that is currently being edited. `range`

### setTextDecoration(_:config:in:)

```swift
@MainActor func setTextDecoration(_ id: DesignBlockID, config: TextDecorationConfig, in subrange: Range<String.Index>? = nil) throws
```

Sets the text decoration for the selected range of text. Required scope: “text/character” `id`

### setTextFontSize(_:fontSize:in:)

```swift
@MainActor func setTextFontSize(_ id: DesignBlockID, fontSize: Float, in subrange: Range<String.Index>? = nil) throws
```

Sets the given text font size for the selected range of text. If the font size is applied to the entire text block, its font size property will be updated. Required scope: “text/character” `id`

### setTextFontStyle(_:fontStyle:in:)

```swift
@MainActor func setTextFontStyle(_ id: DesignBlockID, fontStyle: FontStyle, in subrange: Range<String.Index>? = nil) throws
```

Sets the given text style for the selected range of text. Required scope: “text/character” `id`

### setTextFontWeight(_:fontWeight:in:)

```swift
@MainActor func setTextFontWeight(_ id: DesignBlockID, fontWeight: FontWeight, in subrange: Range<String.Index>? = nil) throws
```

Sets the given text weight for the selected range of text. Required scope: “text/character” `id`

### setTextHorizontalAlignment(_:alignment:paragraphIndex:)

```swift
@MainActor func setTextHorizontalAlignment(_ id: DesignBlockID, alignment: HorizontalTextAlignment?, paragraphIndex: Int = -1) throws
```

Sets the paragraph-level horizontal alignment override for one or all paragraphs of a text block. Required scope: “text/character” `id`

### setTextKerning(_:kerning:in:)

```swift
@MainActor func setTextKerning(_ id: DesignBlockID, kerning: Float, in subrange: Range<String.Index>? = nil) throws
```

Sets kerning for a grapheme range. Applies an additional offset in em units on top of the font’s built-in kern. `1.0` equals the run’s font size, so the offset scales proportionally with text size. Use `0.0` to remove any extra offset and restore font-native kerning. Required scope: “text/character” `id`

### setTextLineHeight(_:lineHeight:paragraphIndex:)

```swift
@MainActor func setTextLineHeight(_ id: DesignBlockID, lineHeight: Float?, paragraphIndex: Int = -1) throws
```

Sets the line height scale for a specific paragraph or all paragraphs of a text block. Required scope: “text/character” `id`

### setTextListLevel(_:listLevel:paragraphIndex:)

```swift
@MainActor func setTextListLevel(_ id: DesignBlockID, listLevel: Int, paragraphIndex: Int = -1) throws
```

Sets the list nesting level for a specific paragraph or all paragraphs of a text block. Required scope: “text/character” `id`

### setTextListStyle(_:listStyle:paragraphIndex:listLevel:)

```swift
@MainActor func setTextListStyle(_ id: DesignBlockID, listStyle: ListStyle, paragraphIndex: Int = -1, listLevel: Int? = nil) throws
```

Sets the list style for a specific paragraph or all paragraphs of a text block. Required scope: “text/character” `id`

### setTextOnPath(_:svgPath:)

```swift
@MainActor func setTextOnPath(_ id: DesignBlockID, svgPath: String?) throws
```

Sets or clears the SVG path that defines a text block’s baseline. `id`

### setTextOnPathFlipped(_:flipped:)

```swift
@MainActor func setTextOnPathFlipped(_ id: DesignBlockID, flipped: Bool) throws
```

Sets whether text is placed on the opposite side of the baseline path. `id`

### setTextOnPathOffset(_:offset:)

```swift
@MainActor func setTextOnPathOffset(_ id: DesignBlockID, offset: Float) throws
```

Sets the start offset along the baseline path as a proportion of the path length. `id`

### setTimeOffset(_:offset:)

```swift
@MainActor func setTimeOffset(_ id: DesignBlockID, offset: Double) throws
```

Set the time offset of the given block relative to its parent. The time offset controls when the block is first active in the timeline. `id`

### setTransformLocked(_:locked:)

```swift
@MainActor func setTransformLocked(_ id: DesignBlockID, locked: Bool) throws
```

Update a block’s transform locked state. `id`

### setTransition(_:transition:)

```swift
@MainActor func setTransition(_ id: DesignBlockID, transition: DesignBlockID) throws
```

Assigns the outgoing transition of a clip. `id`

### setTrimLength(_:length:)

```swift
@MainActor func setTrimLength(_ id: DesignBlockID, length: Double) throws
```

Set the trim length of the given block or fill. The trim length is the duration of the audio or video clip that should be used for playback. `id`

### setTrimOffset(_:offset:)

```swift
@MainActor func setTrimOffset(_ id: DesignBlockID, offset: Double) throws
```

Set the trim offset of the given block or fill. Sets the time in seconds within the fill at which playback of the audio or video clip should begin. `id`

### setTypeface(_:typeface:in:)

```swift
@MainActor func setTypeface(_ id: DesignBlockID, typeface: Typeface, in subrange: Range<String.Index>? = nil) throws
```

Sets the given font and typeface for the text block. The current formatting, e.g., bold or italic, is retained as far as possible. Some formatting might change if the new typeface does not support it, e.g. thin might change to light, bold to normal, and/or italic to non-italic. If the typeface is applied to the entire text block, its typeface property will be updated. If a run does not support the new typeface, it will fall back to the default typeface from the typeface property. Required scope: “text/character” `id`

### setURL(_:property:value:)

```swift
@MainActor func setURL(_ id: DesignBlockID, property: String, value: URL) throws
```

Set a URL property of the given design block to the given value. `id`

### setVisible(_:visible:)

```swift
@MainActor func setVisible(_ id: DesignBlockID, visible: Bool) throws
```

Update a block’s visibility. Required scope: “layer/visibility” `id`

### setVolume(_:volume:)

```swift
@MainActor func setVolume(_ id: DesignBlockID, volume: Float) throws
```

Set the audio volume of the given block. `id`

### setWidth(_:value:maintainCrop:)

```swift
@MainActor func setWidth(_ id: DesignBlockID, value: Float, maintainCrop: Bool = false) throws
```

Update a block’s width and optionally maintain the crop. If the crop is maintained, the crop values will be automatically adjusted. The content fill mode `Cover` is only kept if the `features/transformEditsRetainCoverMode` setting is enabled, otherwise it will change to `Crop`. If the size of a group is changed, both dimensions are modified and the aspect ratio of the group is kept. Required scope: “layer/resize” `id`

### setWidthMode(_:mode:)

```swift
@MainActor func setWidthMode(_ id: DesignBlockID, mode: SizeMode) throws
```

Set a block’s mode for its width. Required scope: “layer/resize” `id`

### split(_:atTime:options:)

```swift
@MainActor func split(_ id: DesignBlockID, atTime: Double, options: SplitOptions = .init()) throws -> DesignBlockID
```

Split a block at the specified time. The original block will be trimmed to end at the split time, and the returned duplicate will start at the split time and continue to the original end time. `id`

### supportsAnimation(_:)

```swift
@MainActor func supportsAnimation(_ id: DesignBlockID) throws -> Bool
```

Returns whether the block supports animation. `id`

### supportsBackgroundColor(_:)

```swift
@MainActor func supportsBackgroundColor(_ id: DesignBlockID) throws -> Bool
```

Query if the given block has background color properties. `id`

### supportsBlendMode(_:)

```swift
@MainActor func supportsBlendMode(_ id: DesignBlockID) throws -> Bool
```

Query if the given block has a blend mode. `id`

### supportsBlur(_:)

```swift
@MainActor func supportsBlur(_ id: DesignBlockID) throws -> Bool
```

Checks whether the block supports blur. `id`

### supportsContentFillMode(_:)

```swift
@MainActor func supportsContentFillMode(_ id: DesignBlockID) throws -> Bool
```

Query if the given block has a content fill mode. `id`

### supportsCrop(_:)

```swift
@MainActor func supportsCrop(_ id: DesignBlockID) throws -> Bool
```

Query if the given block has crop properties. `id`

### supportsDropShadow(_:)

```swift
@MainActor func supportsDropShadow(_ id: DesignBlockID) throws -> Bool
```

Query if the given block has a drop shadow property. `id`

### supportsDuration(_:)

```swift
@MainActor func supportsDuration(_ id: DesignBlockID) throws -> Bool
```

Returns whether the block has a duration property. `id`

### supportsEffects(_:)

```swift
@MainActor func supportsEffects(_ id: DesignBlockID) throws -> Bool
```

Queries whether the block supports effects. `id`

### supportsFill(_:)

```swift
@MainActor func supportsFill(_ id: DesignBlockID) throws -> Bool
```

Query if the given block has fill color properties. `id`

### supportsOpacity(_:)

```swift
@MainActor func supportsOpacity(_ id: DesignBlockID) throws -> Bool
```

Query if the given block has an opacity. `id`

### supportsPageDurationSource(_:id:)

```swift
@MainActor func supportsPageDurationSource(_ page: DesignBlockID, id: DesignBlockID) throws -> Bool
```

Returns whether the block can be marked as the element that defines the duration of the given page. `page`

### supportsPlaceholderBehavior(_:)

```swift
@MainActor func supportsPlaceholderBehavior(_ id: DesignBlockID) throws -> Bool
```

Query if the given block supports placeholder behavior. `id`

### supportsPlaceholderControls(_:)

```swift
@MainActor func supportsPlaceholderControls(_ id: DesignBlockID) throws -> Bool
```

Checks whether the block supports placeholder controls. `id`

### supportsPlaybackControl(_:)

```swift
@MainActor func supportsPlaybackControl(_ id: DesignBlockID) throws -> Bool
```

Returns whether the block supports a playback control. `id`

### supportsPlaybackTime(_:)

```swift
@MainActor func supportsPlaybackTime(_ id: DesignBlockID) throws -> Bool
```

Returns whether the block has a playback time property. `id`

### supportsShape(_:)

```swift
@MainActor func supportsShape(_ id: DesignBlockID) throws -> Bool
```

Query if the given block has a shape property. `id`

### supportsStroke(_:)

```swift
@MainActor func supportsStroke(_ id: DesignBlockID) throws -> Bool
```

Query if the given block has a stroke property. `id`

### supportsTimeOffset(_:)

```swift
@MainActor func supportsTimeOffset(_ id: DesignBlockID) throws -> Bool
```

Returns whether the block has a time offset property. `id`

### supportsTransition(_:)

```swift
@MainActor func supportsTransition(_ id: DesignBlockID) throws -> Bool
```

Checks whether a clip can own an outgoing clip-to-clip transition. `id`

### supportsTrim(_:)

```swift
@MainActor func supportsTrim(_ id: DesignBlockID) throws -> Bool
```

Returns whether the block has trim properties. `id`

### toggleBoldFont(_:in:)

```swift
@MainActor func toggleBoldFont(_ id: DesignBlockID, in subrange: Range<String.Index>? = nil) throws
```

Toggles the font weight of the given block between bold and normal. Required scope: “text/character” `id`

### toggleItalicFont(_:in:)

```swift
@MainActor func toggleItalicFont(_ id: DesignBlockID, in subrange: Range<String.Index>? = nil) throws
```

Toggles the font style of the given block between italic and normal. Required scope: “text/character” `id`

### toggleTextDecorationOverline(_:in:)

```swift
@MainActor func toggleTextDecorationOverline(_ id: DesignBlockID, in subrange: Range<String.Index>? = nil) throws
```

Toggles the text decoration overline of the given block. Required scope: “text/character” `id`

### toggleTextDecorationStrikethrough(_:in:)

```swift
@MainActor func toggleTextDecorationStrikethrough(_ id: DesignBlockID, in subrange: Range<String.Index>? = nil) throws
```

Toggles the text decoration strikethrough of the given block. Required scope: “text/character” `id`

### toggleTextDecorationUnderline(_:in:)

```swift
@MainActor func toggleTextDecorationUnderline(_ id: DesignBlockID, in subrange: Range<String.Index>? = nil) throws
```

Toggles the text decoration underline of the given block. Required scope: “text/character” `id`

### ungroup(_:)

```swift
@MainActor func ungroup(_ id: DesignBlockID) throws
```

Ungroups a group. `id`

### unstable_isAVResourceLoaded(_:)

```swift
@MainActor func unstable_isAVResourceLoaded(_ id: DesignBlockID) throws -> Bool
```

Returns whether the audio and video resource for the given video fill or audio block is loaded. `id`

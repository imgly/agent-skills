# SceneAPI

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/SceneAPI`

```swift
@MainActor final class SceneAPI
```

## Members

### applyTemplate(from:)-24f7b

```swift
@MainActor func applyTemplate(from string: String) async throws
```

Applies the contents of the given template scene to the currently loaded scene. This loads the template scene while keeping the design unit and page dimensions of the current scene. The content of the pages is automatically adjusted to fit the new dimensions. `string`

### applyTemplate(from:)-8krqr

```swift
@MainActor func applyTemplate(from url: URL) async throws
```

Applies the contents of the given template scene to the currently loaded scene. This loads the template scene while keeping the design unit and page dimensions of the current scene. The content of the pages is automatically adjusted to fit the new dimensions. `url`

### applyTemplate(fromString:)

> **Deprecated:** Use 'applyTemplate(from:)' instead. Renamed to `applyTemplate(from:)`.

```swift
@MainActor func applyTemplate(fromString string: String) async throws
```

Applies the contents of the given template scene to the currently loaded scene. This loads the template scene while keeping the design unit and page dimensions of the current scene. The content of the pages is automatically adjusted to fit the new dimensions. `string`

### applyTemplate(fromURL:)

> **Deprecated:** Use 'applyTemplate(from:)' instead. Renamed to `applyTemplate(from:)`.

```swift
@MainActor func applyTemplate(fromURL url: URL) async throws
```

Applies the contents of the given template scene to the currently loaded scene. This loads the template scene while keeping the design unit and page dimensions of the current scene. The content of the pages is automatically adjusted to fit the new dimensions. `url`

### create(designUnit:fontSizeUnit:sceneLayout:)

```swift
@discardableResult @MainActor func create(designUnit: DesignUnit, fontSizeUnit: FontUnit? = nil, sceneLayout: SceneLayout = .free) throws -> DesignBlockID
```

Create a new scene with explicit design and font-size units. `designUnit`

### create(fromImage:dpi:pixelScaleFactor:sceneLayout:)

```swift
@discardableResult @MainActor func create(fromImage url: URL, dpi: Float = 300, pixelScaleFactor: Float = 1, sceneLayout: SceneLayout = .free) async throws -> DesignBlockID
```

Loads the given image and creates a scene with a single page showing the image. Fetching the image may take an arbitrary amount of time, so the scene isn’t immediately available. `url`

### create(fromVideo:)

```swift
@discardableResult @MainActor func create(fromVideo url: URL) async throws -> DesignBlockID
```

Loads the given video and creates a scene with a single page showing the video. Fetching the video may take an arbitrary amount of time, so the scene isn’t immediately available. `url`

### create(sceneLayout:)

```swift
@discardableResult @MainActor func create(sceneLayout: SceneLayout = .free) throws -> DesignBlockID
```

Create a new scene, along with its own camera. `sceneLayout`

### createVideo()

```swift
@discardableResult @MainActor func createVideo() throws -> DesignBlockID
```

Create a new scene in video mode, along with its own camera. The scene’s handle.

### disableZoomAutoFit(_:)

```swift
@MainActor func disableZoomAutoFit(_ id: DesignBlockID) throws
```

Disables any previously set zoom auto-fit. `id`

### enableZoomAutoFit(_:axis:paddingLeft:paddingTop:paddingRight:paddingBottom:)

```swift
@MainActor func enableZoomAutoFit(_ id: DesignBlockID, axis: ZoomAutoFitAxis, paddingLeft: Float = 0, paddingTop: Float = 0, paddingRight: Float = 0, paddingBottom: Float = 0) throws
```

Continually adjusts the zoom level to fit the width or height of a block’s axis-aligned bounding box. This only shows an effect if the zoom level is not handled/overwritten by the UI. Without padding, this results in a tight view on the block. `id`

### findNearestToViewPortCenter(byKind:)

```swift
@MainActor func findNearestToViewPortCenter(byKind kind: String) throws -> [DesignBlockID]
```

Finds all blocks with the given kind sorted by distance to viewport center. `kind`

### findNearestToViewPortCenter(byType:)-3czi7

> **Deprecated:** 
  Use 'findNearestToViewPortCenter(byType type: DesignBlockType)' instead.
  

```swift
@MainActor func findNearestToViewPortCenter(byType type: String) throws -> [DesignBlockID]
```

Finds all blocks with the given type sorted by distance to viewport center. `type`

### findNearestToViewPortCenter(byType:)-4mbbd

```swift
@MainActor func findNearestToViewPortCenter(byType type: DesignBlockType) throws -> [DesignBlockID]
```

Finds all blocks with the given type sorted by distance to viewport center. `type`

### get()

```swift
@MainActor func get() throws -> DesignBlockID?
```

Return the currently active scene. The scene or nil, if none was created yet.

### getCurrentPage()

```swift
@MainActor func getCurrentPage() throws -> DesignBlockID?
```

Get the current page, i.e., the page of the first selected element if this page is at least 25% visible, otherwise, the page nearest to the viewport center. The current page in the scene or an error.

### getDesignUnit()

```swift
@MainActor func getDesignUnit() throws -> DesignUnit
```

Returns the design unit of the current scene. The current design unit.

### getFontSizeUnit()

```swift
@MainActor func getFontSizeUnit() throws -> FontUnit
```

Returns the font-size unit of the current scene. The current font-size unit.

### getLayout()

```swift
@MainActor func getLayout() throws -> SceneLayout
```

Get the current scene layout. The current layout of the scene.

### getMode()

```swift
@MainActor func getMode() throws -> SceneMode
```

Get the current scene mode. The current mode of the scene.

### getPages()

```swift
@MainActor func getPages() throws -> [DesignBlockID]
```

Get the sorted list of pages in the scene. The sorted list of pages in the scene.

### getZoom()

```swift
@MainActor func getZoom() throws -> Float
```

Query a camera zoom level of the active scene. Returns the current zoom level of the scene in unit 1/px, i.e., how large a pixel of the camera resolution is shown on the screen. A zoom level of 2.0f results in one pixel in the design to be two pixels on the screen.

### immediateZoom(to:paddingLeft:paddingTop:paddingRight:paddingBottom:forceUpdate:)

```swift
@MainActor func immediateZoom(to id: DesignBlockID, paddingLeft: Float = 0, paddingTop: Float = 0, paddingRight: Float = 0, paddingBottom: Float = 0, forceUpdate: Bool = false) throws
```

Sets the zoom and focus to show a block. Without padding, this results in a tight view on the block. Assums layout has been done. You can force the layout with explicit update call that will update the layout. `id`

### isZoomAutoFitEnabled(_:)

```swift
@MainActor func isZoomAutoFitEnabled(_ id: DesignBlockID) throws -> Bool
```

Queries whether zoom auto-fit is enabled. `id`

### load(from:overrideEditorConfig:waitForResources:)-51d9s

```swift
@discardableResult @MainActor func load(from url: URL, overrideEditorConfig: Bool = false, waitForResources: Bool = false) async throws -> DesignBlockID
```

Load a scene from the URL of a scene or archive file. The file will be fetched asynchronously by the engine and loaded as an archive or as a scene file depending on its content. This loads `.imgly` files as well as the legacy `.scene` and `.zip` formats. `url`

### load(from:overrideEditorConfig:waitForResources:)-8amez

```swift
@discardableResult @MainActor func load(from string: String, overrideEditorConfig: Bool = false, waitForResources: Bool = false) async throws -> DesignBlockID
```

Load the contents of a scene file. `string`

### load(fromString:overrideEditorConfig:)

> **Deprecated:** Use 'load(from:)' instead. Renamed to `load(from:)`.

```swift
@discardableResult @MainActor func load(fromString string: String, overrideEditorConfig: Bool = false) async throws -> DesignBlockID
```

Load the contents of a scene file. `string`

### load(fromURL:overrideEditorConfig:)

> **Deprecated:** Use 'load(from:)' instead. Renamed to `load(from:)`.

```swift
@discardableResult @MainActor func load(fromURL url: URL, overrideEditorConfig: Bool = false) async throws -> DesignBlockID
```

Load a scene from the URL to the scene file. The scene file will be fetched asynchronously by the engine. `url`

### loadArchive(from:overrideEditorConfig:waitForResources:)

```swift
@discardableResult @MainActor func loadArchive(from url: URL, overrideEditorConfig: Bool = false, waitForResources: Bool = false) async throws -> DesignBlockID
```

Load the contents of a scene previously saved as an archive. The archive file will be fetched asynchronously by the engine. `url`

### onActiveChanged

```swift
@MainActor var onActiveChanged: AsyncStream<Void> { get }
```

Subscribe to changes to the active scene rendered by the engine.

### onActiveChangedPublisher

```swift
@MainActor var onActiveChangedPublisher: AnyPublisher<Void, Never> { get }
```

Subscribe to changes to the active scene rendered by the engine.

### onCarouselPageChanged

```swift
@MainActor var onCarouselPageChanged: AsyncStream<DesignBlockID> { get }
```

Subscribe to current page change.

### onCarouselPageChangedPublisher

```swift
@MainActor var onCarouselPageChangedPublisher: AnyPublisher<DesignBlockID, Never> { get }
```

Subscribe to current page change.

### onZoomLevelChanged

```swift
@MainActor var onZoomLevelChanged: AsyncStream<Void> { get }
```

Subscribe to changes to the zoom level.

### onZoomLevelChangedPublisher

```swift
@MainActor var onZoomLevelChangedPublisher: AnyPublisher<Void, Never> { get }
```

Subscribe to changes to the zoom level.

### saveToArchive(options:)

```swift
@MainActor func saveToArchive(options: SaveToArchiveOptions = .init()) async throws -> Blob
```

Saves the current scene and all of its referenced assets into an archive. The archive contains all assets, that were accessible when this function was called. Blocks in the archived scene reference assets relative from to the location of the scene file. These references are resolved when loading such a scene via `load(from url:)`. When persisting the result as a file, use the `.imgly` extension. `options`

### saveToString(allowedResourceSchemes:onDisallowedResourceScheme:)

```swift
@MainActor func saveToString(allowedResourceSchemes: [String] = ["blob", "bundle", "file", "http", "https"], onDisallowedResourceScheme: (@MainActor @Sendable (URL, String) async -> URL)? = nil) async throws -> String
```

Serializes the current scene into a string. Selection is discarded. `allowedResourceSchemes`

### saveToString(options:)

```swift
@MainActor func saveToString(options: SaveToStringOptions = SaveToStringOptions()) async throws -> String
```

Serializes the current scene into a string with optional compression. Selection is discarded. `options`

### setDesignUnit(_:)

```swift
@MainActor func setDesignUnit(_ designUnit: DesignUnit) throws
```

Converts all values of the current scene into the given design unit. `designUnit`

### setFontSizeUnit(_:)

```swift
@MainActor func setFontSizeUnit(_ fontSizeUnit: FontUnit) throws
```

Sets the unit in which font sizes for `setTextFontSize` and `getTextFontSizes` are interpreted. The engine continues to store font sizes in points internally; this only affects API-boundary interpretation. `fontSizeUnit`

### setLayout(_:)

```swift
@MainActor func setLayout(_ layout: SceneLayout) throws
```

Set the scene layout. This will handle all necessary conversions including creating or destroying stack blocks and reparenting pages as needed. When transitioning from stack layouts (VerticalStack, HorizontalStack, DepthStack) to Free layout, the global positions of pages are preserved to maintain their visual appearance in the scene. `layout`

### setMode(_:)

```swift
@MainActor func setMode(_ mode: SceneMode) throws
```

Set the scene mode. Changing the scene mode affects how the engine processes and renders the scene: `mode`

### setZoom(_:)

```swift
@MainActor func setZoom(_ level: Float) throws
```

Sets the zoom level of the active scene. A zoom level of 2.0f results in one pixel in the design to be two pixels on the screen. `level`

### unstable_disableCameraPositionClamping()

```swift
@MainActor func unstable_disableCameraPositionClamping() throws
```

Disables any previously set position clamping.

### unstable_disableCameraZoomClamping()

```swift
@MainActor func unstable_disableCameraZoomClamping() throws
```

Disables previously set zoom clamping for the block, scene, or camera.

### unstable_enableCameraPositionClamping(_:paddingLeft:paddingTop:paddingRight:paddingBottom:scaledPaddingLeft:scaledPaddingTop:scaledPaddingRight:scaledPaddingBottom:)

```swift
@MainActor func unstable_enableCameraPositionClamping(_ ids: [DesignBlockID], paddingLeft: Float = 0, paddingTop: Float = 0, paddingRight: Float = 0, paddingBottom: Float = 0, scaledPaddingLeft: Float = 0, scaledPaddingTop: Float = 0, scaledPaddingRight: Float = 0, scaledPaddingBottom: Float = 0) throws
```

Continually ensures the camera position to be within the width and height of the blocks axis-aligned bounding box. Without padding, this results in a tight clamp on the blocks. Disables any previously set camera position clamping in the scene and also takes priority over clamp camera commands. `ids`

### unstable_enableCameraZoomClamping(_:minZoomLimit:maxZoomLimit:paddingLeft:paddingTop:paddingRight:paddingBottom:)

```swift
@MainActor func unstable_enableCameraZoomClamping(_ ids: [DesignBlockID], minZoomLimit: Float = -1, maxZoomLimit: Float = -1, paddingLeft: Float = 0, paddingTop: Float = 0, paddingRight: Float = 0, paddingBottom: Float = 0) throws
```

Continually ensures the zoom level of the camera in the active scene to be in the given range. `ids`

### unstable_isCameraPositionClampingEnabled(_:)

```swift
@MainActor func unstable_isCameraPositionClampingEnabled(_ id: DesignBlockID) throws -> Bool
```

Queries whether position clamping is enabled. `id`

### unstable_isCameraZoomClampingEnabled(_:)

```swift
@MainActor func unstable_isCameraZoomClampingEnabled(_ id: DesignBlockID) throws -> Bool
```

Queries whether zoom clamping is enabled. `id`

### zoom(to:paddingLeft:paddingTop:paddingRight:paddingBottom:)

```swift
@MainActor func zoom(to id: DesignBlockID, paddingLeft: Float = 0, paddingTop: Float = 0, paddingRight: Float = 0, paddingBottom: Float = 0) async throws
```

Sets the zoom and focus to show a block. Without padding, this results in a tight view on the block. `id`

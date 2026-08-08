# Engine

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/Engine`

```swift
@MainActor final class Engine
```

## Members

### addDefaultAssetSources(baseURL:exclude:)

> **Deprecated:** 
    Uses legacy v4 asset source IDs and will be removed in a future version. Against a CDN that \
    serves v5+ content (the default 'Engine.assetBaseURL' from this release on), the IDs renamed or \
    merged in v5 ('vectorpath'->'vector.shape', 'colors.defaultPalette'->'color.palette', \
    'filter.lut'+'filter.duotone'->'filter') are skipped. Register sources via \
    'engine.asset.addLocalAssetSourceFromJSON(_:matcher:)' with the v5 IDs (plus the new \
    'ly.img.text', 'ly.img.text.styles', 'ly.img.text.curves', 'ly.img.text.components'). Migration guide: \
    https://img.ly/docs/cesdk/ios/to-v1-77-ac6ca9/
    

```swift
@MainActor func addDefaultAssetSources(baseURL: URL = Engine.assetBaseURL, exclude: Set<Engine.DefaultAssetSource> = []) async throws
```

Convenience function that registers a set of asset sources containing our example assets. `baseURL`

### addDemoAssetSources(baseURL:exclude:withUploadAssetSources:)

> **Deprecated:** 
    Uses legacy v3-era demo asset source IDs and will be removed in a future version. Register \
    each source via 'engine.asset.addLocalAssetSourceFromJSON(_:matcher:)' instead. \
    Migration guide: https://img.ly/docs/cesdk/ios/to-v1-77-ac6ca9/
    

```swift
@MainActor func addDemoAssetSources(baseURL: URL = Engine.assetBaseURL, exclude: Set<Engine.DemoAssetSource> = [.video, .videoUpload, .audio, .audioUpload], withUploadAssetSources: Bool = false) async throws
```

Convenience function that registers a set of demo asset sources containing our example assets. `baseURL`

### asset

```swift
@MainActor lazy var asset: AssetAPI { get set }
```

### assetBaseURL

> **Deprecated:** 
    Asset-source URL handling is moving out of the engine binding to match Web. Construct your \
    own baseURL in your app from bundled assets — for example: \
    'Bundle.main.url(forResource: "IMGLYAssets", withExtension: "bundle")!'. \
    The IMG.LY CDN is for development/evaluation only — self-host the assets for production. \
    Will be removed in a future version.
    

```swift
@MainActor static let assetBaseURL: URL
```

The default base URL for loading CE.SDK asset definitions from the IMG.LY CDN. This URL points to the `cesdk-swift` platform-specific versioned asset directory on the IMG.LY CDN. Each source’s manifest is expected at `<baseURL>/<sourceID>/content.json`.

### block

```swift
@MainActor lazy var block: BlockAPI { get set }
```

### defaultAssetSourcesBaseURL

> **Deprecated:** 
    Tied to the deprecated 'addDefaultAssetSources(baseURL:exclude:)' helper. \
    Once you migrate to 'engine.asset.addLocalAssetSourceFromJSON(_:matcher:)' this returns nil — \
    track the base URL yourself. Will be removed in a future version.
    

```swift
@MainActor var defaultAssetSourcesBaseURL: URL? { get }
```

Returns the base URL that was passed to [`addDefaultAssetSources(baseURL:exclude:)`](./adddefaultassetsources(baseurl:exclude:).md), or `nil` if default asset sources have not been loaded yet. This value is stored in scene metadata and can be used to construct URLs for assets such as animation thumbnails that are hosted alongside the default asset sources.

### editor

```swift
@MainActor lazy var editor: EditorAPI { get set }
```

### Engine.AudioContext

```swift
enum AudioContext
```

### AudioContext.Engine.AudioContext.auto

```swift
case auto
```

### AudioContext.Engine.AudioContext.none

```swift
case none
```

### Engine.Context

```swift
@MainActor enum Context
```

### Context.Engine.Context.metal

```swift
case metal
```

### Context.Engine.Context.metalView(view:)

```swift
case metalView(view: MTKView)
```

### Context.Engine.Context.offscreen(size:)

```swift
case offscreen(size: CGSize)
```

### Engine.DefaultAssetSource

> **Deprecated:** 
    Uses legacy v4 asset source IDs and will be removed in a future version. Register sources \
    by raw v5 string ID via 'engine.asset.addLocalAssetSourceFromJSON(_:matcher:)' instead.
    

```swift
enum DefaultAssetSource
```

### DefaultAssetSource.Engine.DefaultAssetSource.blur

> **Deprecated:** 
    Uses legacy v4 asset source IDs and will be removed in a future version. Register sources \
    by raw v5 string ID via 'engine.asset.addLocalAssetSourceFromJSON(_:matcher:)' instead.
    

```swift
case blur
```

Default blurs.

### DefaultAssetSource.Engine.DefaultAssetSource.colorsDefaultPalette

> **Deprecated:** 
    Uses legacy v4 asset source IDs and will be removed in a future version. Register sources \
    by raw v5 string ID via 'engine.asset.addLocalAssetSourceFromJSON(_:matcher:)' instead.
    

```swift
case colorsDefaultPalette
```

Default color palette.

### DefaultAssetSource.Engine.DefaultAssetSource.cropPresets

> **Deprecated:** 
    Uses legacy v4 asset source IDs and will be removed in a future version. Register sources \
    by raw v5 string ID via 'engine.asset.addLocalAssetSourceFromJSON(_:matcher:)' instead.
    

```swift
case cropPresets
```

Default crop presets.

### DefaultAssetSource.Engine.DefaultAssetSource.effect

> **Deprecated:** 
    Uses legacy v4 asset source IDs and will be removed in a future version. Register sources \
    by raw v5 string ID via 'engine.asset.addLocalAssetSourceFromJSON(_:matcher:)' instead.
    

```swift
case effect
```

Default effects.

### DefaultAssetSource.Engine.DefaultAssetSource.filterDuotone

> **Deprecated:** 
    Uses legacy v4 asset source IDs and will be removed in a future version. Register sources \
    by raw v5 string ID via 'engine.asset.addLocalAssetSourceFromJSON(_:matcher:)' instead.
    

```swift
case filterDuotone
```

Duotone filter effects.

### DefaultAssetSource.Engine.DefaultAssetSource.filterLut

> **Deprecated:** 
    Uses legacy v4 asset source IDs and will be removed in a future version. Register sources \
    by raw v5 string ID via 'engine.asset.addLocalAssetSourceFromJSON(_:matcher:)' instead.
    

```swift
case filterLut
```

LUT filter effects.

### DefaultAssetSource.Engine.DefaultAssetSource.pagePresets

> **Deprecated:** 
    Uses legacy v4 asset source IDs and will be removed in a future version. Register sources \
    by raw v5 string ID via 'engine.asset.addLocalAssetSourceFromJSON(_:matcher:)' instead.
    

```swift
case pagePresets
```

Default page presets.

### DefaultAssetSource.Engine.DefaultAssetSource.sticker

> **Deprecated:** 
    Uses legacy v4 asset source IDs and will be removed in a future version. Register sources \
    by raw v5 string ID via 'engine.asset.addLocalAssetSourceFromJSON(_:matcher:)' instead.
    

```swift
case sticker
```

Various stickers.

### DefaultAssetSource.Engine.DefaultAssetSource.typeface

> **Deprecated:** 
    Uses legacy v4 asset source IDs and will be removed in a future version. Register sources \
    by raw v5 string ID via 'engine.asset.addLocalAssetSourceFromJSON(_:matcher:)' instead.
    

```swift
case typeface
```

Default typefaces.

### DefaultAssetSource.Engine.DefaultAssetSource.vectorPath

> **Deprecated:** 
    Uses legacy v4 asset source IDs and will be removed in a future version. Register sources \
    by raw v5 string ID via 'engine.asset.addLocalAssetSourceFromJSON(_:matcher:)' instead.
    

```swift
case vectorPath
```

Shapes and arrows.

### Engine.DemoAssetSource

> **Deprecated:** 
    Uses legacy v3-era demo asset source IDs and will be removed in a future version. Register \
    sources by raw string ID via 'engine.asset.addLocalAssetSourceFromJSON(_:matcher:)' instead.
    

```swift
enum DemoAssetSource
```

### DemoAssetSource.Engine.DemoAssetSource.audio

> **Deprecated:** 
    Uses legacy v3-era demo asset source IDs and will be removed in a future version. Register \
    sources by raw string ID via 'engine.asset.addLocalAssetSourceFromJSON(_:matcher:)' instead.
    

```swift
case audio
```

### DemoAssetSource.Engine.DemoAssetSource.audioUpload

> **Deprecated:** 
    Uses legacy v3-era demo asset source IDs and will be removed in a future version. Register \
    sources by raw string ID via 'engine.asset.addLocalAssetSourceFromJSON(_:matcher:)' instead.
    

```swift
case audioUpload
```

### DemoAssetSource.Engine.DemoAssetSource.image

> **Deprecated:** 
    Uses legacy v3-era demo asset source IDs and will be removed in a future version. Register \
    sources by raw string ID via 'engine.asset.addLocalAssetSourceFromJSON(_:matcher:)' instead.
    

```swift
case image
```

### DemoAssetSource.Engine.DemoAssetSource.imageUpload

> **Deprecated:** 
    Uses legacy v3-era demo asset source IDs and will be removed in a future version. Register \
    sources by raw string ID via 'engine.asset.addLocalAssetSourceFromJSON(_:matcher:)' instead.
    

```swift
case imageUpload
```

### DemoAssetSource.Engine.DemoAssetSource.textComponents

> **Deprecated:** 
    Uses legacy v3-era demo asset source IDs and will be removed in a future version. Register \
    sources by raw string ID via 'engine.asset.addLocalAssetSourceFromJSON(_:matcher:)' instead.
    

```swift
case textComponents
```

### DemoAssetSource.Engine.DemoAssetSource.video

> **Deprecated:** 
    Uses legacy v3-era demo asset source IDs and will be removed in a future version. Register \
    sources by raw string ID via 'engine.asset.addLocalAssetSourceFromJSON(_:matcher:)' instead.
    

```swift
case video
```

### DemoAssetSource.Engine.DemoAssetSource.videoUpload

> **Deprecated:** 
    Uses legacy v3-era demo asset source IDs and will be removed in a future version. Register \
    sources by raw string ID via 'engine.asset.addLocalAssetSourceFromJSON(_:matcher:)' instead.
    

```swift
case videoUpload
```

### Engine.NetworkError

```swift
enum NetworkError
```

### NetworkError.Engine.NetworkError.invalidResponse

```swift
case invalidResponse
```

### NetworkError.Engine.NetworkError.invalidStatusCode(_:)

```swift
case invalidStatusCode(Int)
```

### NetworkError.Engine.NetworkError.invalidURL

```swift
case invalidURL
```

### event

```swift
@MainActor lazy var event: EventAPI { get set }
```

### init(context:audioContext:license:userID:buildHost:)

```swift
@MainActor convenience init(context: Engine.Context = .metal, audioContext: Engine.AudioContext = .auto, license: String? = nil, userID: String? = nil, buildHost: String = "") async throws
```

### AudioContext.init(rawValue:)

```swift
init?(rawValue: UInt8)
```

### DefaultAssetSource.init(rawValue:)

> **Deprecated:** 
    Uses legacy v4 asset source IDs and will be removed in a future version. Register sources \
    by raw v5 string ID via 'engine.asset.addLocalAssetSourceFromJSON(_:matcher:)' instead.
    

```swift
init?(rawValue: String)
```

### DemoAssetSource.init(rawValue:)

> **Deprecated:** 
    Uses legacy v3-era demo asset source IDs and will be removed in a future version. Register \
    sources by raw string ID via 'engine.asset.addLocalAssetSourceFromJSON(_:matcher:)' instead.
    

```swift
init?(rawValue: String)
```

### DemoAssetSource.mimeTypes

> **Deprecated:** 
    Uses legacy v3-era demo asset source IDs and will be removed in a future version. Register \
    sources by raw string ID via 'engine.asset.addLocalAssetSourceFromJSON(_:matcher:)' instead.
    

```swift
var mimeTypes: [String]? { get }
```

### onAppear()

```swift
@MainActor func onAppear()
```

### onDisappear()

```swift
@MainActor func onDisappear()
```

### onSelectionBoxChanged

> **Deprecated:** 
    Call engine.block.getScreenSpaceBoundingBox on the result of engine.block.onSelectionChanged instead (docs).
  

```swift
@MainActor var onSelectionBoxChanged: AsyncMapSequence<AsyncStream<[BlockEvent]>, SelectionBox?> { get }
```

Subscribe to changes in the current set of selected blocks and their corresponding bounding box. > Note: For a more performant solution, you can use a combination of two subscriptions instead:

### onSelectionBoxChangedPublisher

> **Deprecated:** 
    Call engine.block.getScreenSpaceBoundingBox on the result of engine.block.onSelectionChangedPublisher instead.
  

```swift
@MainActor var onSelectionBoxChangedPublisher: AnyPublisher<SelectionBox?, Never> { get }
```

Subscribe to changes in the current set of selected blocks and their corresponding bounding box.

### populateAssetSource(id:baseURL:)

> **Deprecated:** 
    Will be removed in a future version. \
    Use 'engine.asset.addLocalAssetSourceFromJSON(_:matcher:)' with the JSON's URL instead.
    

```swift
@MainActor func populateAssetSource(id: String, baseURL: URL) async throws
```

Convenience function that populates a single asset source from its JSON manifest file. `id`

### populateAssetSource(id:jsonURL:replaceBaseURL:)

> **Deprecated:** 
    Will be removed in a future version. \
    Use 'engine.asset.addLocalAssetSourceFromJSON(_:matcher:)' with the JSON's URL instead.
    

```swift
@MainActor func populateAssetSource(id: String, jsonURL: URL, replaceBaseURL: URL? = nil) async throws
```

Convenience function that populates a single asset source from its JSON manifest file. `id`

### scene

```swift
@MainActor lazy var scene: SceneAPI { get set }
```

### unsafeRunCommand(_:)

```swift
@MainActor func unsafeRunCommand(_ command: String)
```

### variable

```swift
@MainActor lazy var variable: VariableAPI { get set }
```

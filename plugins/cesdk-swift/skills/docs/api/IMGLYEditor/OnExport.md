# OnExport

- **Module:** `IMGLYEditor`
- **DocC identifier:** `/documentation/IMGLYEditor/OnExport`

A namespace for `onExport` callbacks.

```swift
enum OnExport
```

## Members

### export(_:mimeType:)

```swift
@MainActor static func export(_ engine: Engine, mimeType: MIMEType? = nil) async throws -> (Data, UTType)
```

A utility that calls `BlockAPI.export`. `engine`

### exportToFile(_:mimeType:to:)

```swift
@MainActor static func exportToFile(_ engine: Engine, mimeType: MIMEType? = nil, to url: URL? = nil) async throws -> (URL, UTType)
```

A utility that calls the streamed `BlockAPI.export` overload. This fuses `export` and writing the result to a file into a single streamed pass: the document is written out chunk by chunk while it is being encoded, so it is never held in memory as a whole. Prefer it over `export` followed by `Data.write(to:)` for large multi-page documents such as photo books and magazines, where the intermediate `Data` is the peak allocation. `engine`

### exportVideo(_:_:mimeType:duration:)

```swift
@MainActor static func exportVideo(_ engine: Engine, _ eventHandler: any EditorEventHandler, mimeType: MIMEType? = nil, duration: TimeInterval? = nil) async throws -> (Data, UTType)
```

A utility that calls `BlockAPI.exportVideo` and displays a progress indicator. `engine`

### OnExport.Callback

```swift
typealias Callback = @MainActor @Sendable (Engine, any EditorEventHandler) async throws -> Void
```

The callback type.

### OnExport.Handler

```swift
typealias Handler = @MainActor @Sendable (Engine, any EditorEventHandler, () async throws -> Void) async throws -> Void
```

The handler type that receives an `existing` closure for chaining.

### static(mimeType:)

```swift
static func `static`(mimeType: MIMEType? = nil) -> OnExport.Callback
```

Creates a callback that exports the scene as a static file (e.g., PDF, PNG), writes it to a temporary file, and opens a system dialog for sharing the exported file. `mimeType`

### video(mimeType:)

```swift
static func video(mimeType: MIMEType? = nil) -> OnExport.Callback
```

Creates a callback that exports the scene as a video file (e.g., MP4), displays a progress indicator, writes it to a temporary file, and opens a system dialog for sharing the exported file. `mimeType`

# Camera

- **Module:** `IMGLYCamera`
- **DocC identifier:** `/documentation/IMGLYCamera/Camera`

A camera for capturing videos.

```swift
@MainActor struct Camera
```

## Members

### body

```swift
@MainActor var body: some View { get }
```

### init(_:config:mode:onDismiss:)

```swift
@MainActor init(_ settings: EngineSettings, config: CameraConfiguration = .init(), mode: CameraMode = .standard, onDismiss: @escaping @MainActor @Sendable (Result<CameraResult, CameraError>) -> Void)
```

Creates a camera. `settings`

### init(_:config:onDismiss:)

> **Deprecated:** Use inititalizer with `Result<CameraResult, CameraError>` callback instead.

```swift
@MainActor init(_ settings: EngineSettings, config: CameraConfiguration = .init(), onDismiss: @escaping @MainActor @Sendable (Result<[Recording], CameraError>) -> Void)
```

Creates a camera. `settings`

### isModeSupported(_:)

```swift
@MainActor static func isModeSupported(_ mode: CameraMode) -> Bool
```

Checks if the given camera mode is supported. `mode`

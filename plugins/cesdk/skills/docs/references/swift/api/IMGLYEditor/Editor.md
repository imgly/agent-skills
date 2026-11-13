# Editor

- **Module:** `IMGLYEditor`
- **DocC identifier:** `/documentation/IMGLYEditor/Editor`

A minimal editor without solution-specific defaults for building completely custom editor experiences.

```swift
@MainActor struct Editor
```

## Members

### body

```swift
@MainActor var body: some View { get }
```

### init(_:)

```swift
@MainActor init(_ settings: EngineSettings)
```

`settings` The settings to initialize the underlying engine.

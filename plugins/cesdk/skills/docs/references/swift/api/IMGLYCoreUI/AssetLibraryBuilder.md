# AssetLibraryBuilder

- **Module:** `IMGLYCoreUI`
- **DocC identifier:** `/documentation/IMGLYCoreUI/AssetLibraryBuilder`

A result builder for building hierarchical asset library content similar to `ViewBuilder`.

```swift
@MainActor @resultBuilder enum AssetLibraryBuilder
```

## Members

### buildArray(_:)

```swift
@MainActor static func buildArray(_ components: [any AssetLibraryContent]) -> any AssetLibraryContent
```

### buildBlock(_:)

```swift
@MainActor static func buildBlock(_ components: any AssetLibraryContent...) -> any AssetLibraryContent
```

### buildEither(first:)

```swift
@MainActor static func buildEither(first component: any AssetLibraryContent) -> any AssetLibraryContent
```

### buildEither(second:)

```swift
@MainActor static func buildEither(second component: any AssetLibraryContent) -> any AssetLibraryContent
```

### buildOptional(_:)

```swift
@MainActor static func buildOptional(_ component: (any AssetLibraryContent)?) -> any AssetLibraryContent
```

# AssetLibraryMoreTab

- **Module:** `IMGLYCoreUI`
- **DocC identifier:** `/documentation/IMGLYCoreUI/AssetLibraryMoreTab`

Use this view if you have more than five [`AssetLibraryTab`](assetlibrarytab.md)s to workaround various SwiftUI `TabView` shortcomings.

```swift
@MainActor struct AssetLibraryMoreTab<Content> where Content : View
```

## Members

### body

```swift
@MainActor var body: some View { get }
```

### init(content:)

```swift
@MainActor init(@ViewBuilder content: @escaping () -> Content)
```

Creates a more tab with `content`. `content`

# AssetLibraryTab

- **Module:** `IMGLYCoreUI`
- **DocC identifier:** `/documentation/IMGLYCoreUI/AssetLibraryTab`

A tab used in an [`AssetLibrary`](assetlibrary.md) to display [`AssetLibraryContent`](assetlibrarycontent.md).

```swift
@MainActor struct AssetLibraryTab<Label> where Label : View
```

## Members

### body

```swift
@MainActor var body: some View { get }
```

### init(_:content:label:)

```swift
@MainActor init(_ title: LocalizedStringResource, @AssetLibraryBuilder content: @escaping () -> any AssetLibraryContent, @ViewBuilder label: @escaping (LocalizedStringResource) -> Label)
```

Creates an asset library tab with asset library `content`. `title`

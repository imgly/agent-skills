# AssetLibraryTabView

- **Module:** `IMGLYCoreUI`
- **DocC identifier:** `/documentation/IMGLYCoreUI/AssetLibraryTabView`

A tab used in an [`AssetLibrary`](assetlibrary.md) to display any `View`.

```swift
@MainActor struct AssetLibraryTabView<Content, Label> where Content : View, Label : View
```

## Members

### body

```swift
@MainActor var body: some View { get }
```

### init(_:content:label:)

```swift
@MainActor init(_ title: LocalizedStringResource, @ViewBuilder content: @escaping () -> Content, @ViewBuilder label: @escaping (LocalizedStringResource) -> Label)
```

Creates an asset library tab with any `content`. `title`

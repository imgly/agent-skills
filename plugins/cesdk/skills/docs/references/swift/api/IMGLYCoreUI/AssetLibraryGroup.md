# AssetLibraryGroup

- **Module:** `IMGLYCoreUI`
- **DocC identifier:** `/documentation/IMGLYCoreUI/AssetLibraryGroup`

A group of hierarchical asset library content. It is used within an [`AssetLibraryBuilder`](assetlibrarybuilder.md) context.

```swift
@MainActor struct AssetLibraryGroup<Preview> where Preview : View
```

## Members

### audio(_:content:)

```swift
@MainActor static func audio(_ title: LocalizedStringResource, @AssetLibraryBuilder content: () -> any AssetLibraryContent) -> AssetLibraryGroup<Preview>
```

Creates an [`AssetLibraryGroup`](../assetlibrarygroup.md) for audio assets. `title`

### body

```swift
@MainActor var body: some View { get }
```

### debugPrint(_:)

```swift
@MainActor func debugPrint(_ level: Int)
```

Helper utility to print the content hierrachy for debugging.

### empty

```swift
@MainActor static var empty: AssetLibraryGroup<EmptyView> { get }
```

An empty [`AssetLibraryGroup`](../assetlibrarygroup.md).

### id

```swift
@MainActor var id: Int { get }
```

The stable identity of the entity associated with this instance. Suitable to conform to `Identifiable`.

### image(_:content:)

```swift
@MainActor static func image(_ title: LocalizedStringResource, @AssetLibraryBuilder content: () -> any AssetLibraryContent) -> AssetLibraryGroup<Preview>
```

Creates an [`AssetLibraryGroup`](../assetlibrarygroup.md) for image assets. `title`

### init(_:excludedPreviewSources:content:preview:)

```swift
@MainActor init(_ title: LocalizedStringResource, excludedPreviewSources: Set<String> = [], @AssetLibraryBuilder content: () -> any AssetLibraryContent, @ViewBuilder preview: @escaping @MainActor @Sendable () -> Preview = { AssetPreview.imageOrVideo })
```

Creates a group of asset library `content`. It is displayed as a section with a `title` and a `preview`. `title`

### shape(_:content:)

```swift
@MainActor static func shape(_ title: LocalizedStringResource, @AssetLibraryBuilder content: () -> any AssetLibraryContent) -> AssetLibraryGroup<Preview>
```

Creates an [`AssetLibraryGroup`](../assetlibrarygroup.md) for shape assets. `title`

### sources

```swift
@MainActor var sources: [AssetLoader.SourceData] { get }
```

All asset source definitions that belong to this content including all sources of its children.

### sticker(_:content:)

```swift
@MainActor static func sticker(_ title: LocalizedStringResource, @AssetLibraryBuilder content: () -> any AssetLibraryContent) -> AssetLibraryGroup<Preview>
```

Creates an [`AssetLibraryGroup`](../assetlibrarygroup.md) for sticker assets. `title`

### text(_:excludedPreviewSources:content:)

```swift
@MainActor static func text(_ title: LocalizedStringResource, excludedPreviewSources: Set<String> = [], @AssetLibraryBuilder content: () -> any AssetLibraryContent) -> AssetLibraryGroup<Preview>
```

Creates an [`AssetLibraryGroup`](../assetlibrarygroup.md) for text assets. `title`

### upload(_:content:)

```swift
@MainActor static func upload(_ title: LocalizedStringResource, @AssetLibraryBuilder content: () -> any AssetLibraryContent) -> AssetLibraryGroup<Preview>
```

Creates an [`AssetLibraryGroup`](../assetlibrarygroup.md) for asset sources that support uploads. `title`

### video(_:content:)

```swift
@MainActor static func video(_ title: LocalizedStringResource, @AssetLibraryBuilder content: () -> any AssetLibraryContent) -> AssetLibraryGroup<Preview>
```

Creates an [`AssetLibraryGroup`](../assetlibrarygroup.md) for video assets. `title`

### view

```swift
@MainActor var view: AnyView { get }
```

A view representation of this content.

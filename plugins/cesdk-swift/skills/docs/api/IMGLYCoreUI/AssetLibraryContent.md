# AssetLibraryContent

- **Module:** `IMGLYCoreUI`
- **DocC identifier:** `/documentation/IMGLYCoreUI/AssetLibraryContent`

An interface for hierarchical asset library content.

```swift
@MainActor protocol AssetLibraryContent
```

## Members

### debugPrint(_:)

```swift
@MainActor func debugPrint(_ level: Int)
```

Helper utility to print the content hierrachy for debugging.

### id

```swift
@MainActor var id: Int { get }
```

The stable identity of the entity associated with this instance. Suitable to conform to `Identifiable`.

### isEmpty

```swift
@MainActor var isEmpty: Bool { get }
```

A Boolean value indicating whether this content is empty.

### sources

```swift
@MainActor var sources: [AssetLoader.SourceData] { get }
```

All asset source definitions that belong to this content including all sources of its children.

### view

```swift
@MainActor var view: AnyView { get }
```

A view representation of this content.

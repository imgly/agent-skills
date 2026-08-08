# ImageGrid

- **Module:** `IMGLYCoreUI`
- **DocC identifier:** `/documentation/IMGLYCoreUI/ImageGrid`

A grid of image assets.

```swift
@MainActor struct ImageGrid<Empty, First> where Empty : View, First : View
```

## Members

### body

```swift
@MainActor var body: some View { get }
```

### init(empty:first:)

```swift
@MainActor init(@ViewBuilder empty: @escaping (String) -> Empty = { _ in Message.noElements }, @ViewBuilder first: @escaping () -> First = { EmptyView() })
```

Creates a grid of image assets. `empty`

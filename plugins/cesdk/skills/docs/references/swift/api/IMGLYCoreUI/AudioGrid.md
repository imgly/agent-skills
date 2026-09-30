# AudioGrid

- **Module:** `IMGLYCoreUI`
- **DocC identifier:** `/documentation/IMGLYCoreUI/AudioGrid`

A grid of audio assets.

```swift
@MainActor struct AudioGrid<Empty, First> where Empty : View, First : View
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

Creates a grid of audio assets. `empty`

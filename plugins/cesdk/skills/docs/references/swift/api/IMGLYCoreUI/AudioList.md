# AudioList

- **Module:** `IMGLYCoreUI`
- **DocC identifier:** `/documentation/IMGLYCoreUI/AudioList`

A list of audio assets.

```swift
@MainActor struct AudioList<Empty, First> where Empty : View, First : View
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

Creates a list of audio assets. `empty`

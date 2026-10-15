# TextList

- **Module:** `IMGLYCoreUI`
- **DocC identifier:** `/documentation/IMGLYCoreUI/TextList`

A list of text assets.

```swift
@MainActor struct TextList<Empty> where Empty : View
```

## Members

### body

```swift
@MainActor var body: some View { get }
```

### init(empty:)

```swift
@MainActor init(@ViewBuilder empty: @escaping (String) -> Empty = { _ in Message.noElements })
```

Creates a list of text assets. `empty`

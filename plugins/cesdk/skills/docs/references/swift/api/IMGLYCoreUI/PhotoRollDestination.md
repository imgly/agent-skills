# PhotoRollDestination

- **Module:** `IMGLYCoreUI`
- **DocC identifier:** `/documentation/IMGLYCoreUI/PhotoRollDestination`

A grid view that displays photo roll assets from the user’s photo library with an add button as the first item to allow importing additional media.

```swift
@MainActor struct PhotoRollDestination
```

## Members

### body

```swift
@MainActor var body: some View { get }
```

### init(media:)

```swift
@MainActor init(media: [PhotoRollMediaType])
```

Creates a grid view of photo roll assets with add functionality. `media`

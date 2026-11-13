# UploadButton

- **Module:** `IMGLYCoreUI`
- **DocC identifier:** `/documentation/IMGLYCoreUI/UploadButton`

A button that presents a menu to open the photo roll, the camera, or a file import dialog for specific `media` types to add assets to an asset source.

```swift
@MainActor struct UploadButton
```

## Members

### body

```swift
@MainActor var body: some View { get }
```

### init(media:)

```swift
@MainActor init(media: [MediaType])
```

Creates a button to add assets to an asset source. `media`

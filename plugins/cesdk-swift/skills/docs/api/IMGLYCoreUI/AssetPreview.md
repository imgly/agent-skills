# AssetPreview

- **Module:** `IMGLYCoreUI`
- **DocC identifier:** `/documentation/IMGLYCoreUI/AssetPreview`

A grid of assets for preview.

```swift
@MainActor struct AssetPreview<Empty> where Empty : View
```

## Members

### body

```swift
@MainActor var body: some View { get }
```

### imageOrVideo

```swift
@MainActor static let imageOrVideo: AssetPreview<Message>
```

An [`AssetPreview`](../assetpreview.md) for image, video, or text component assets.

### imageOrVideo(empty:)

```swift
@MainActor static func imageOrVideo(@ViewBuilder empty: @escaping () -> Empty) -> AssetPreview<Empty>
```

An [`AssetPreview`](../assetpreview.md) for image, video, or text component assets, with a custom empty view.

### init(height:empty:)

```swift
@MainActor init(height: CGFloat?, @ViewBuilder empty: @escaping () -> Empty = { Message.noElements })
```

Creates a grid of assets for preview. `height`

### shapeOrSticker

```swift
@MainActor static let shapeOrSticker: AssetPreview<Message>
```

An [`AssetPreview`](../assetpreview.md) for shape or sticker assets.

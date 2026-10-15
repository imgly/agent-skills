# PhotoRollAccessory

- **Module:** `IMGLYCoreUI`
- **DocC identifier:** `/documentation/IMGLYCoreUI/PhotoRollAccessory`

An accessory view for photo roll assets that displays either an add menu button when photo library access is authorized, or a permissions request button when access is not yet granted.

```swift
@MainActor struct PhotoRollAccessory
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

Creates an accessory view for photo roll assets that adapts based on photo library permissions. `media`

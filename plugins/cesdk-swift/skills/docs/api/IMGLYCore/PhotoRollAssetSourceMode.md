# PhotoRollAssetSourceMode

- **Module:** `IMGLYCore`
- **DocC identifier:** `/documentation/IMGLYCore/PhotoRollAssetSourceMode`

The mode for accessing the device’s photo library.

```swift
enum PhotoRollAssetSourceMode
```

## Members

### PhotoRollAssetSourceMode.fullLibraryAccess

```swift
case fullLibraryAccess
```

Enables full photo library access. Requires user permission on first use and `NSPhotoLibraryUsageDescription` in Info.plist.

### PhotoRollAssetSourceMode.photosPicker

```swift
case photosPicker
```

Uses the system photos picker. No photo library permissions required.

# AssetTransformPreset

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/AssetTransformPreset`

```swift
enum AssetTransformPreset
```

## Members

### AssetTransformPreset.contentAspectRatio

```swift
case contentAspectRatio
```

### AssetTransformPreset.fixedAspectRatio(width:height:)

```swift
case fixedAspectRatio(width: Float, height: Float)
```

### AssetTransformPreset.fixedSize(width:height:designUnit:)

```swift
case fixedSize(width: Float, height: Float, designUnit: DesignUnit = .px)
```

### AssetTransformPreset.freeAspectRatio

```swift
case freeAspectRatio
```

### init(from:)

```swift
init(from decoder: any Decoder) throws
```

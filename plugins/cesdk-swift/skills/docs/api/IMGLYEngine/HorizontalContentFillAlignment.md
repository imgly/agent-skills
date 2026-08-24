# HorizontalContentFillAlignment

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/HorizontalContentFillAlignment`

Horizontal alignment of the content fill inside the block. Applies when the content fill mode is `.contain` or `.cover`. Has no visible effect in `.crop`, where the user positions the content explicitly.

```swift
@objc enum HorizontalContentFillAlignment
```

## Members

### HorizontalContentFillAlignment.center

```swift
case center
```

Center the content horizontally.

### HorizontalContentFillAlignment.left

```swift
case left
```

Align the content to the left edge of the block.

### HorizontalContentFillAlignment.right

```swift
case right
```

Align the content to the right edge of the block.

### init(rawValue:)

```swift
init?(rawValue: _ObjCRawEnum)
```
